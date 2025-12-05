import type { Official, Player, PlayerDetail, Standing, Fixture, Team, MatchDetail } from '../types';

// Astro can import JSON directly
export async function loadOfficials(): Promise<Official[]> {
  const module = await import('../data/officials.json');
  return (module.default || module) as Official[];
}

export async function loadPlayers(): Promise<Player[]> {
  const module = await import('../data/players.json');
  return (module.default || module) as Player[];
}

export async function loadPlayerDetails(): Promise<PlayerDetail[]> {
  const module = await import('../data/playerDetails.json');
  return (module.default || module) as PlayerDetail[];
}

export async function loadStandings(): Promise<Standing[]> {
  const module = await import('../data/standings.json');
  return (module.default || module) as Standing[];
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
      photo_url: player?.photo_url || detail.photo_url,
    };
  });
}

export function getPersiboStanding(standings: Standing[]): Standing | undefined {
  return standings.find((standing) => standing.club === 'PERSIBO Bojonegoro');
}

export function getStandingsByGroup(standings: Standing[], group: string): Standing[] {
  return standings.filter((standing) => standing.group === group).sort((a, b) => a.position - b.position);
}

export async function loadFixtures(): Promise<Fixture[]> {
  const module = await import('../data/fixtures.json');
  return (module.default || module) as Fixture[];
}

export function getCompletedFixtures(fixtures: Fixture[]): Fixture[] {
  return fixtures.filter((fixture) => fixture.status === 'COMPLETED');
}

export function getScheduledFixtures(fixtures: Fixture[]): Fixture[] {
  return fixtures.filter((fixture) => fixture.status === 'SCHEDULED');
}

export async function loadTeams(): Promise<Team[]> {
  const module = await import('../data/teams.json');
  return (module.default || module) as Team[];
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
  
  return team?.logo_url || null;
}

export async function loadMatchDetails(): Promise<MatchDetail[]> {
  const module = await import('../data/matchDetails.json');
  return (module.default || module) as MatchDetail[];
}

export function getMatchDetailByUrl(matchDetails: MatchDetail[], matchUrl: string): MatchDetail | undefined {
  return matchDetails.find(md => md.match_url === matchUrl);
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
