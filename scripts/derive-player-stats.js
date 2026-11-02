// Rebuild player statistics from the match details we already hold.
//
// iLeague's per-player "Penampilan" column counts squad listings, not games
// played: it totals 21 per match, so a backup keeper reads 12. Its saves and
// cards columns are empty for this competition too. We therefore ignore those
// numbers and derive every figure from src/data/seasons/*/matchDetails.json,
// which carries both XIs, the bench, substitution minutes and the timeline.
//
// playerDetails.json keeps the short squad names ("IKHSAN") because the page,
// search index and URL slugs all key off `players.json`. The full name used by
// the match data goes into full_name, and STATS_ALIAS bridges the two.
//
// Run: node scripts/derive-player-stats.js
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '../src/data');
const SEASONS = ['2024-25', '2025-26'];

// Squad listing spells players short; the match data spells them out. Jersey
// numbers are the reliable bridge — fuzzy name matching misses 12 of 30.
const STATS_ALIAS = JSON.parse(readFileSync(join(__dirname, 'player-alias.json'), 'utf-8'));

const key = (name) => String(name).toUpperCase().replace(/[^A-Z0-9]/g, '');
const ALIAS_BY_KEY = new Map(Object.entries(STATS_ALIAS).map(([short, full]) => [key(short), full]));

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

/** Aggregate one season's Persibo appearances, goals and cards. */
function deriveSeason(season) {
  const path = join(DATA, `seasons/${season}/matchDetails.json`);
  if (!existsSync(path)) return { matches: 0, players: new Map() };

  const matches = readJson(path);
  const players = new Map();

  const bucket = (name) => {
    const id = key(name);
    if (!players.has(id)) {
      players.set(id, { name, appearances: 0, goals: 0, yellow: 0, red: 0 });
    }
    return players.get(id);
  };

  for (const match of matches) {
    for (const side of ['home_team', 'away_team']) {
      if (!key(match[side] || '').includes('PERSIBO')) continue;
      const lineup = match.lineups?.[side];
      if (!lineup) continue;

      for (const player of lineup.starting_xi || []) {
        bucket(player.name).appearances += 1;
      }

      // A substitute with no logged minutes never came on, but still needs a row:
      // otherwise he keeps the scraped figure that counts bench listings as games
      // (OBY read 3 for a season he did not play).
      for (const player of lineup.substitutes || []) {
        const row = bucket(player.name);
        if (player.substitution_minutes?.length) row.appearances += 1;
      }

      for (const event of match.events || []) {
        if (key(event.team || '') !== key(match[side])) continue;
        const type = key(event.type || '');
        const row = bucket(event.player);
        if (type.includes('GOAL') && !event.own_goal) row.goals += 1;
        else if (type.includes('YELLOW')) row.yellow += 1;
        else if (type.includes('RED')) row.red += 1;
      }
    }
  }

  return { matches: matches.length, players };
}

/**
 * Substitute the derived figures on the Persibo row of that season. Saves stay
 * empty: no source publishes them for Liga Nusantara, and 0 would claim the
 * keeper never made one.
 *
 * Selected by club and year, not by competition name: the same season is filed
 * under several labels ("PEGADAIAN LIGA 2", "PNM LIGA NUSANTARA"), and only the
 * Persibo row is ours to correct.
 */
function patchHistory(history, season, stats) {
  const year = season.slice(0, 4);
  let patched = 0;
  for (const row of history) {
    if (parseInt(row.year) !== parseInt(year)) continue;
    if (key(row.club || '') !== key('PERSIBO Bojonegoro')) continue;
    row.appearances = String(stats.appearances);
    row.goals = String(stats.goals);
    row.cards = stats.yellow || stats.red ? `${stats.yellow}/${stats.red}` : '/';
    row.source = 'derived:matchDetails';
    patched += 1;
  }
  return patched;
}

const details = readJson(join(DATA, 'playerDetails.json'));
const seasons = SEASONS.map((season) => ({ season, ...deriveSeason(season) }));

let updated = 0;
const missing = [];

for (const player of details) {
  const fullName = ALIAS_BY_KEY.get(key(player.name)) ?? player.full_name ?? player.name;
  player.full_name = fullName;

  // The headline stats describe the season the page is about.
  const current = seasons.find((s) => s.season === '2025-26');
  const stats = current.players.get(key(fullName));

  if (stats) {
    player.statistics = {
      appearances: stats.appearances,
      goals: stats.goals,
      yellow_cards: stats.yellow,
      red_cards: stats.red,
    };
    updated += 1;
  } else {
    player.statistics = { appearances: 0, goals: 0, yellow_cards: 0, red_cards: 0 };
    if (!player.club_history?.length) missing.push(player.name);
  }

  for (const { season, players } of seasons) {
    const playerStats = players.get(key(fullName));
    if (playerStats && player.club_history?.length) {
      patchHistory(player.club_history, season, playerStats);
    }
  }
}

writeFileSync(join(DATA, 'playerDetails.json'), `${JSON.stringify(details, null, 2)}\n`, 'utf-8');

console.log(`players updated from matchday data: ${updated}/${details.length}`);
for (const { season, matches, players } of seasons) {
  const totals = [...players.values()].reduce(
    (acc, p) => ({
      apps: acc.apps + p.appearances,
      goals: acc.goals + p.goals,
      yellow: acc.yellow + p.yellow,
      red: acc.red + p.red,
    }),
    { apps: 0, goals: 0, yellow: 0, red: 0 }
  );
  console.log(
    `  ${season}: ${matches} laga, ${players.size} pemain, ` +
      `${totals.apps} penampilan (${(totals.apps / matches).toFixed(1)}/laga), ` +
      `${totals.goals} gol, ${totals.yellow} kuning, ${totals.red} merah`
  );
}
if (missing.length) console.log(`  tanpa data matchday: ${missing.join(', ')}`);
