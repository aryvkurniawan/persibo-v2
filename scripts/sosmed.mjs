// Renders social-media posters from src/pages/sosmed/*.astro into social/out/*.png.
//
//   npm run sosmed                 # every job in social/posts.json
//   npm run sosmed -- laga-persipa # one job by name
//
// Uses your installed Chrome (channel: 'chrome'); no browser download.
import { chromium } from 'playwright-core';
import { spawn } from 'child_process';
import { mkdir, readFile } from 'fs/promises';
import { join } from 'path';

const PORT = 4321;
const BASE = process.env.SOSMED_BASE ?? `http://localhost:${PORT}`;
const OUT_DIR = 'social/out';

const jobs = JSON.parse(await readFile('social/posts.json', 'utf8'));
const wanted = process.argv.slice(2);
const selected = wanted.length ? jobs.filter((job) => wanted.includes(job.out)) : jobs;
if (!selected.length) {
  console.error(`No job matched ${wanted.join(', ')}. Available: ${jobs.map((j) => j.out).join(', ')}`);
  process.exit(1);
}

const reachable = async (url) => {
  try {
    return (await fetch(url)).ok;
  } catch {
    return false;
  }
};

// Reuse the dev server the user already has open; Astro 7 refuses a second one anyway.
let server = null;
const firstUrl = selected[0].url ?? `/sosmed/${selected[0].out}`;
if (!(await reachable(`${BASE}${firstUrl}`))) {
  server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'dev', '--port', String(PORT)], {
    stdio: 'ignore',
  });
}

const shutdown = () => {
  if (server && !server.killed) server.kill();
};
process.on('exit', shutdown);

async function waitForServer(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await reachable(`${BASE}${firstUrl}`)) return;
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Astro dev server did not start on ${BASE}`);
}

await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  await waitForServer();
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  for (const job of selected) {
    await page.goto(`${BASE}${job.url ?? `/sosmed/${job.out}`}`, { waitUntil: 'networkidle' });
    const poster = page.locator(job.selector ?? '#poster');
    await poster.waitFor();
    await page.evaluate(() => document.fonts.ready);
    const file = join(OUT_DIR, `${job.out}.png`);
    await poster.screenshot({ path: file, omitBackground: job.transparent === true });
    console.log(`✓ ${file}`);
  }
} finally {
  await browser.close();
  shutdown();
}
