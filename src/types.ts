export interface Official {
  name: string;
  position: string;
  team: string;
  team_url: string;
  photo_url?: string;
  /** Mirror of photo_url under public/img. */
  photo_local?: string;
  scraped_at: string;
}

export interface Player {
  name: string;
  jersey_number: string;
  country: string;
  appearances: string;
  age: string;
  position: string;
  team: string;
  team_url: string;
  detail_url: string;
  photo_url?: string;
  scraped_at: string;
}

export interface PlayerDetail {
  name: string;
  full_name: string;
  detail_url: string;
  scraped_at: string;
  club: string;
  position: string;
  age: string;
  country: string;
  photo_url?: string;
  statistics: {
    appearances: number;
    goals: number;
    yellow_cards: number;
    red_cards: number;
  };
  club_history: Array<{
    competition: string;
    year: string;
    klub_url: string;
    club: string;
    appearances: string;
    goals: string;
    saves: string;
    cards: string;
  }>;
  base_team: string;
}

export interface Standing {
  group: string;
  /** Competition phase. Liga 2 2024-25 ran Penyisihan -> Play-off -> 8 Besar; later seasons have a single stage. */
  stage?: string;
  league: string;
  scraped_at: string;
  position: number;
  klub_url: string;
  club: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
  form: string;
  selanjutnya_url: string;
}

export interface Fixture {
  date: string;
  home_team: string;
  away_team: string;
  score: string;
  status: 'COMPLETED' | 'SCHEDULED' | 'LIVE' | 'POSTPONED';
  venue: string;
  match_url: string | null;
  team: string;
  time?: string;
  kickoff_iso?: string;
  scraped_at: string;
}

export interface Team {
  name: string;
  url: string | null;
  logo_url: string;
  /** Mirror of logo_url under public/img, so the crest survives iLeague dropping it. */
  logo_local?: string;
  ileague_url: string;
  scraped_at: string;
}

export interface MatchDetailPlayer {
  name: string;
  jersey_number: number;
  position: string | null;
  /** Minutes this player was involved in a substitution, as scraped ("'90"). */
  substitution_minutes?: number[];
  /** Cards shown to this player during the match. */
  cards?: Array<'yellow' | 'red'>;
}

export interface MatchDetailLineup {
  starting_xi: MatchDetailPlayer[];
  substitutes: MatchDetailPlayer[];
  coach: string;
}

export interface MatchDetailEvent {
  type: string;
  /** Raw iLeague minute string: "40'", "70(1)'" (stoppage), "90+1'". */
  minute: string;
  player: string;
  jersey_number?: number | null;
  team: string;
}

export interface MatchDetail {
  match_url: string;
  scraped_at: string;
  date: string;
  venue: string;
  home_team: string;
  away_team: string;
  score: string;
  home_score: number;
  away_score: number;
  lineups: {
    home_team: MatchDetailLineup;
    away_team: MatchDetailLineup;
  };
  events: MatchDetailEvent[];
  statistics: Record<string, any>;
  /** Only the referee and first assistant are reliably published. */
  officials?: Record<string, string>;
  kickoff_time?: string;
  attendance?: number;
  base_team: string;
}

export interface FriendlyScorer {
  player: string;
  minute: number;
  team: string;
}

export interface FriendlySource {
  label: string;
  url: string;
}

/** Non-competitive fixtures (pre-season friendlies). iLeague does not publish
 *  these, so they are curated from local press reports. */
export interface Friendly {
  /** ISO date, or null when press reports only give a rough period. */
  date: string | null;
  date_label: string;
  competition: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  venue: string;
  /** Local logo for opponents iLeague does not carry (friendlies only). */
  opponent_logo?: string;
  scorers: FriendlyScorer[];
  note: string;
  sources: FriendlySource[];
}
