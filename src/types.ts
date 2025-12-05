export interface Official {
  name: string;
  position: string;
  team: string;
  team_url: string;
  photo_url?: string;
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
  league: string;
  scraped_at: string;
  position: number;
  klub_url: string;
  club: string;
  played: number;
  won: number;
  drawn: number | string;
  lost: number | string;
  goals_for: number;
  goals_against: number;
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
  match_url: string;
  team: string;
  scraped_at: string;
}

export interface Team {
  name: string;
  url: string | null;
  logo_url: string;
  ileague_url: string;
  scraped_at: string;
}

export interface MatchDetailPlayer {
  name: string;
  jersey_number: number;
  position: string | null;
  substitution_minutes?: number[];
}

export interface MatchDetailLineup {
  starting_xi: MatchDetailPlayer[];
  substitutes: MatchDetailPlayer[];
  coach: string;
}

export interface MatchDetailEvent {
  type: string;
  minute: number;
  player: string;
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
  base_team: string;
}
