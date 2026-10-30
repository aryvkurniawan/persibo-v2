import type { Official, Player, PlayerDetail, Standing, Fixture, Team, MatchDetail, Friendly } from '../types';

import officials from '../data/officials.json';
import players from '../data/players.json';
import playerDetails from '../data/playerDetails.json';
import assetsManifest from '../data/assets-manifest.json';

import standings2425 from '../data/seasons/2024-25/standings.json';
import fixtures2425 from '../data/seasons/2024-25/fixtures.json';
import teams2425 from '../data/seasons/2024-25/teams.json';
import matchDetails2425 from '../data/seasons/2024-25/matchDetails.json';

import standings2526 from '../data/seasons/2025-26/standings.json';
import fixtures2526 from '../data/seasons/2025-26/fixtures.json';
import teams2526 from '../data/seasons/2025-26/teams.json';
import matchDetails2526 from '../data/seasons/2025-26/matchDetails.json';

import standings2627 from '../data/seasons/2026-27/standings.json';
import fixtures2627 from '../data/seasons/2026-27/fixtures.json';
import teams2627 from '../data/seasons/2026-27/teams.json';
import matchDetails2627 from '../data/seasons/2026-27/matchDetails.json';
import friendlies2627 from '../data/seasons/2026-27/friendlies.json';

export type Season = '2024-25' | '2025-26' | '2026-27';
export const CURRENT_SEASON: Season = '2026-27';
export const ARCHIVE_SEASON: Season = '2025-26';

const SEASONS = {
  '2024-25': {
    standings: standings2425 as Standing[],
    fixtures: fixtures2425 as Fixture[],
    teams: teams2425 as Team[],
    matchDetails: matchDetails2425 as MatchDetail[],
  },
  '2025-26': {
    standings: standings2526 as Standing[],
    fixtures: fixtures2526 as Fixture[],
    teams: teams2526 as Team[],
    matchDetails: matchDetails2526 as MatchDetail[],
  },
  '2026-27': {
    standings: standings2627 as Standing[],
    fixtures: fixtures2627 as Fixture[],
    teams: teams2627 as Team[],
    matchDetails: matchDetails2627 as MatchDetail[],
  },
} satisfies Record<Season, { standings: Standing[]; fixtures: Fixture[]; teams: Team[]; matchDetails: MatchDetail[] }>;

// Players and officials remain the last published squad (2025-26); iLeague has
// not published a 2026-27 squad yet.
export async function loadOfficials(): Promise<Official[]> {
  return officials as Official[];
}

export async function loadPlayers(): Promise<Player[]> {
  return players as Player[];
}

export async function loadPlayerDetails(): Promise<PlayerDetail[]> {
  return playerDetails as PlayerDetail[];
}

export async function loadStandings(season: Season = CURRENT_SEASON): Promise<Standing[]> {
  return SEASONS[season].standings;
}

export async function loadFixtures(season: Season = CURRENT_SEASON): Promise<Fixture[]> {
  return SEASONS[season].fixtures;
}

export async function loadTeams(season: Season = CURRENT_SEASON): Promise<Team[]> {
  return SEASONS[season].teams;
}

export async function loadMatchDetails(season: Season = CURRENT_SEASON): Promise<MatchDetail[]> {
  return SEASONS[season].matchDetails;
}

/** Pre-season friendlies, newest first. Only the current season has them: they
 *  are hand-curated because iLeague does not publish non-competitive matches. */
export async function loadFriendlies(season: Season = CURRENT_SEASON): Promise<Friendly[]> {
  if (season !== '2026-27') return [];
  return [...(friendlies2627 as Friendly[])].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

/** Mirrored portrait for a player, looked up by name. Returns null when iLeague
 *  never published one, so callers can fall back to a placeholder. */
export async function getPlayerPhoto(name: string): Promise<string | null> {
  const faces = await import('../data/players/faces.json');
  const target = name.toUpperCase().replace(/[^A-Z ]/g, ' ').replace(/\s+/g, ' ').trim();
  const face = (faces.default as Array<{ name: string; photo_url: string }>).find(
    (f) => f.name.toUpperCase() === target
  );
  return face?.photo_url ?? null;
}

export function getPlayerBySlug(players: PlayerDetail[], slug: string): PlayerDetail | undefined {
  return players.find((player) => {
    const playerSlug = player.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    return playerSlug === slug;
  });
}

export async function getPlayerDetailWithPhoto(playerDetails: PlayerDetail[], players: Player[]): Promise<PlayerDetail[]> {
  return playerDetails.map((detail) => {
    const player = players.find((p) => p.name === detail.name);
    return {
      ...detail,
      photo_url: player?.photo_local || player?.photo_url || detail.photo_url,
    };
  });
}

export function getPersiboStanding(standings: Standing[]): Standing | undefined {
  return standings.find((standing) => standing.club.toUpperCase().includes('PERSIBO'));
}

export function getStandingsByGroup(standings: Standing[], group: string): Standing[] {
  return standings.filter((standing) => standing.group === group).sort((a, b) => a.position - b.position);
}

export function getCompletedFixtures(fixtures: Fixture[]): Fixture[] {
  return fixtures.filter((fixture) => fixture.status === 'COMPLETED');
}

export function getScheduledFixtures(fixtures: Fixture[]): Fixture[] {
  return fixtures.filter((fixture) => fixture.status === 'SCHEDULED');
}

export function getTeamLogo(teams: Team[], teamName: string): string | null {
  const team = teams.find(t => {
    // Normalize team names for matching
    const normalizedTeamName = teamName.toUpperCase().replace(/\s+/g, ' ').trim();
    const normalizedDataName = t.name.toUpperCase().replace(/\s+/g, ' ').trim();

    // Check exact match
    if (normalizedDataName === normalizedTeamName) return true;

    // Check if team name contains data name or vice versa
    if (normalizedTeamName.includes(normalizedDataName) || normalizedDataName.includes(normalizedTeamName)) return true;

    // Special cases for common abbreviations
    if (normalizedTeamName.includes('PERSIBO') && normalizedDataName.includes('PERSIBO')) return true;
    if (normalizedTeamName.includes('RANS') && normalizedDataName.includes('RANS')) return true;
    if (normalizedTeamName.includes('PERSIKA') && normalizedDataName.includes('PERSIKA')) return true;
    if (normalizedTeamName.includes('PERSIKUTIM') && normalizedDataName.includes('PERSIKUTIM')) return true;
    if (normalizedTeamName.includes('PERSEWAR') && normalizedDataName.includes('PERSEWAR')) return true;
    if (normalizedTeamName.includes('SANG') && normalizedDataName.includes('SANG')) return true;

    return false;
  });

  // Prefer the mirrored crest: iLeague re-uploads these and old URLs rot. The
  // manifest is the durable lookup, since scraping rewrites teams.json and drops
  // any local path stored there.
  return localLogoFor(team?.name ?? teamName) || team?.logo_local || team?.logo_url || null;
}

/** Normalised key so "PERSIKOTA Kota Tangerang" and "PERSIKOTA KOTA TANGERANG" agree. */
function logoKey(name: string): string {
  return name.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

const LOGOS_BY_NAME = new Map<string, string>();
for (const asset of assetsManifest.assets as Array<{ kind: string; name: string; path: string }>) {
  if (asset.kind === 'team-logo') LOGOS_BY_NAME.set(logoKey(asset.name), asset.path);
}

// Names the scrape spells differently from the club's official listing.
const LOGO_ALIASES: Record<string, string> = {
  PERSIKU: '/img/teams/persikutim-united.png',
  PERSEWAR9: '/img/teams/persewar.png',
  PERSELALAMONGAN: '/img/teams/persela.png',
};

export function localLogoFor(teamName: string): string | null {
  const key = logoKey(teamName);
  return LOGOS_BY_NAME.get(key) ?? LOGO_ALIASES[key] ?? null;
}

export function getMatchDetailByUrl(matchDetails: MatchDetail[], matchUrl: string): MatchDetail | undefined {
  // URLs differ only by casing/underscores between the fixture and detail scrapes.
  const key = matchUrl.toLowerCase().replace(/[^a-z0-9]/g, '');
  return matchDetails.find(md => md.match_url.toLowerCase().replace(/[^a-z0-9]/g, '') === key);
}

export function getMatchDetailSlug(match: MatchDetail | Fixture): string {
  const date = match.date || '';
  const homeTeam = 'home_team' in match ? match.home_team : '';
  const awayTeam = 'away_team' in match ? match.away_team : '';

  // Extract date part (e.g., "29 November 2025" from "Sabtu, 29 November 2025")
  const dateMatch = date.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  let datePart = '';
  if (dateMatch) {
    const day = dateMatch[1].padStart(2, '0');
    const monthNames: Record<string, string> = {
      'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
      'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
      'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
    };
    const month = monthNames[dateMatch[2].toLowerCase()] || dateMatch[2].toLowerCase();
    const year = dateMatch[3];
    datePart = `${year}-${month}-${day}`;
  }

  const homeSlug = homeTeam.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').substring(0, 20);
  const awaySlug = awayTeam.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').substring(0, 20);

  return `${datePart}-${homeSlug}-vs-${awaySlug}`;
}
