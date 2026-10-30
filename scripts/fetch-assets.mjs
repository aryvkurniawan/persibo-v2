#!/usr/bin/env node
/**
 * Rescue iLeague-hosted images into the repo.
 *
 * Everything the site shows about past seasons is currently hotlinked from
 * assets.ileague.id. If iLeague re-uploads or drops a season, those URLs rot and
 * the archive loses its faces silently. This script copies the images we depend
 * on into public/img/ and records where each one came from in a manifest, so the
 * archive keeps working on its own.
 *
 * Run: npm run fetch-assets
 * Idempotent: files already on disk with a matching checksum are skipped.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = path.join(ROOT, 'public');
const MANIFEST = path.join(ROOT, 'src', 'data', 'assets-manifest.json');
const SEASONS = ['2024-25', '2025-26', '2026-27'];
const UA = 'Mozilla/5.0 (compatible; persibo-archive/1.0)';
const CONCURRENCY = 6;

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

/** Every team logo the season data points at, keyed by its remote URL. */
async function collectTeamLogos() {
  const wanted = new Map();
  for (const season of SEASONS) {
    const teams = await readJson(path.join(ROOT, 'src', 'data', 'seasons', season, 'teams.json'), []);
    for (const team of teams) {
      const url = team.logo_url || '';
      if (!url.startsWith('http')) continue;
      if (!wanted.has(url)) {
        wanted.set(url, { kind: 'team-logo', name: team.name, seasons: new Set() });
      }
      wanted.get(url).seasons.add(season);
    }
  }
  return wanted;
}

/**
 * Player photos for everyone who appeared in a Persibo shirt.
 *
 * iLeague re-registers players each season, so one person can hold several ids
 * across seasons while their face stays the same file. Keying by name keeps the
 * archive showing one photo per person, not one per registration.
 */
async function collectPlayerPhotos() {
  const faces = await readJson(path.join(ROOT, 'src', 'data', 'players', 'faces.json'), []);
  const wanted = new Map();
  for (const player of faces) {
    if (!player.photo_url || !player.photo_url.startsWith('http')) continue;
    const key = player.name.toUpperCase();
    if (!wanted.has(key)) {
      wanted.set(key, {
        kind: 'player-photo',
        name: player.name,
        url: player.photo_url,
        player_ids: new Set(),
        seasons: new Set(),
      });
    }
    const entry = wanted.get(key);
    entry.player_ids.add(player.player_id);
    for (const season of player.seasons || []) entry.seasons.add(season);
  }
  return wanted;
}

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 1024) throw new Error(`suspiciously small (${buffer.length}B)`);
  return buffer;
}

async function save(buffer, target, { width = 400, keepAlpha = false } = {}) {
  await fs.mkdir(path.dirname(target), { recursive: true });

  // Downscale once at download time: the originals are print-sized and we only
  // ever render them at a few hundred pixels.
  const image = sharp(buffer).rotate();
  const meta = await image.metadata();
  const pipeline =
    meta.width && meta.width > width
      ? image.resize({ width, withoutEnlargement: true })
      : image;

  // Crests are transparent PNGs. Flattening them into JPEG puts a black box
  // behind every logo on the dark background, so keep the alpha channel.
  const out = keepAlpha
    ? await pipeline.png({ compressionLevel: 9 }).toBuffer()
    : await pipeline.flatten({ background: '#0c0b0f' }).jpeg({ quality: 88, mozjpeg: true }).toBuffer();

  await fs.writeFile(target, out);
  return { bytes: out.length, width: Math.min(meta.width || width, width), height: meta.height || null };
}

async function mapLimit(items, limit, worker) {
  const results = [];
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

async function main() {
  const previous = await readJson(MANIFEST, { generated_at: null, assets: [] });
  const bySource = new Map(previous.assets.map((a) => [a.source_url, a]));

  let jobs = [];

  for (const [url, info] of await collectTeamLogos()) {
    jobs.push({
      url,
      target: path.join('img', 'teams', `${slug(info.name)}.png`),
      kind: 'team-logo',
      name: info.name,
      seasons: [...info.seasons],
      width: 160,
      keepAlpha: true,
    });
  }

  for (const [, info] of await collectPlayerPhotos()) {
    jobs.push({
      url: info.url,
      target: path.join('img', 'players', `${slug(info.name)}.jpg`),
      kind: 'player-photo',
      name: info.name,
      seasons: [...info.seasons],
      player_ids: [...info.player_ids],
      width: 400,
    });
  }

  // A club that stays in the league for several seasons gets a fresh crest URL
  // each year, so several sources map to one file. Keep one per destination.
  const byTarget = new Map();
  for (const job of jobs) {
    const existing = byTarget.get(job.target);
    if (existing) {
      for (const season of job.seasons) existing.seasons.add(season);
      continue;
    }
    byTarget.set(job.target, { ...job, seasons: new Set(job.seasons) });
  }
  jobs = [...byTarget.values()];

  console.log(`Rescuing ${jobs.length} assets into public/img/ ...`);

  const assets = [];
  const failures = [];

  await mapLimit(jobs, CONCURRENCY, async (job) => {
    const abs = path.join(PUBLIC, job.target);
    const publicPath = '/' + job.target.split(path.sep).join('/');
    try {
      // Only trust the manifest when the file it points at is still on disk.
      let known = bySource.get(job.url);
      if (known) {
        try {
          await fs.access(path.join(PUBLIC, known.path.replace(/^\//, '')));
        } catch {
          known = undefined;
        }
      }
      let record = known;

      // Skip the network when we already hold this exact source.
      if (!known) {
        const buffer = await download(job.url);
        const saved = await save(buffer, abs, { width: job.width, keepAlpha: job.keepAlpha });
        record = {
          source_url: job.url,
          path: publicPath,
          bytes: saved.bytes,
          width: saved.width,
          sha256: crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 16),
          fetched_at: new Date().toISOString(),
        };
      }

      assets.push({
        ...record,
        kind: job.kind,
        name: job.name,
        seasons: [...job.seasons],
        ...(job.player_ids ? { player_ids: job.player_ids } : {}),
      });
      process.stdout.write('.');
    } catch (err) {
      failures.push({ url: job.url, name: job.name, reason: err.message });
      process.stdout.write('x');
    }
  });

  assets.sort((a, b) => a.path.localeCompare(b.path));
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fs.writeFile(
    MANIFEST,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        note: 'Images mirrored from assets.ileague.id so past seasons survive the source going away.',
        count: assets.length,
        assets,
      },
      null,
      2
    ) + '\n'
  );

  const total = assets.reduce((sum, a) => sum + (a.bytes || 0), 0);
  console.log(`\n\n${assets.length} assets, ${(total / 1e6).toFixed(2)} MB`);
  console.log(`manifest: ${path.relative(ROOT, MANIFEST)}`);
  if (failures.length) {
    console.log(`\n${failures.length} failed:`);
    for (const f of failures) console.log(`  ${f.name}: ${f.reason}  ${f.url}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
