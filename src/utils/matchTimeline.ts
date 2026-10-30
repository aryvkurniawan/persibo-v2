import type { MatchDetailEvent, MatchDetailLineup } from '../types';

export type EventSide = 'home' | 'away';

export interface TimelineEvent {
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'other';
  /** Minute as shown to readers, e.g. "45+2'". */
  label: string;
  /** Sortable minute. Stoppage time folds into the preceding minute. */
  sortKey: number;
  /** Score after this event, when it was a goal. */
  score?: { home: number; away: number };
  side: EventSide | null;
  player: string;
  /** For substitutions: the player coming off and the one coming on. */
  swapped?: { off: string; on: string };
}

/**
 * iLeague writes minutes three ways: "40'", "70(1)'" (stoppage, first half of
 * extra time) and "90+1'". Fold them onto one sortable scale so a timeline is
 * actually chronological rather than in scrape order.
 */
export function parseMinute(raw: string): { label: string; sortKey: number } {
  const text = (raw ?? '').trim();

  const stoppage = text.match(/^(\d+)\s*\(\s*(\d+)\s*\)/);
  if (stoppage) {
    const base = Number(stoppage[1]);
    const extra = Number(stoppage[2]);
    return { label: `${base}+${extra}'`, sortKey: base + extra / 100 };
  }

  const plus = text.match(/^(\d+)\s*\+\s*(\d+)/);
  if (plus) {
    const base = Number(plus[1]);
    const extra = Number(plus[2]);
    return { label: `${base}+${extra}'`, sortKey: base + extra / 100 };
  }

  const plain = text.match(/(\d+)/);
  if (plain) {
    const base = Number(plain[1]);
    return { label: `${base}'`, sortKey: base };
  }

  return { label: text, sortKey: 0 };
}

/**
 * Turn scraped events into a chronological, side-attributed timeline with a
 * running score. `teamName` is the club each side refers to; events whose team
 * matches neither are kept but left side-less rather than silently dropped.
 */
export function buildTimeline(
  events: MatchDetailEvent[],
  homeTeam: string,
  awayTeam: string,
  lineups?: { home_team?: MatchDetailLineup; away_team?: MatchDetailLineup },
  finalScore?: { home: number; away: number }
): TimelineEvent[] {
  const matches = (eventTeam: string, club: string) => {
    const a = (eventTeam ?? '').toUpperCase();
    const b = (club ?? '').toUpperCase();
    if (!a || !b) return false;
    // Names differ between sources ("PERSIBO Bojonegoro" vs "PERSIBO BOJONEGORO"),
    // and short forms appear in the tables, so compare the leading word too.
    if (a === b || a.includes(b) || b.includes(a)) return true;
    const [aHead] = a.split(/\s+/);
    const [bHead] = b.split(/\s+/);
    return aHead === bHead && aHead.length > 3;
  };

  const sideOf = (event: MatchDetailEvent): EventSide | null => {
    if (matches(event.team, homeTeam)) return 'home';
    if (matches(event.team, awayTeam)) return 'away';
    return null;
  };

  // The 2025-26 scrape never captured an event's team. Those events still belong
  // on the timeline; attribute them by looking the scorer up in the lineups.
  const lineupSide = new Map<string, EventSide>();
  for (const [key, side] of [
    ['home_team', 'home'],
    ['away_team', 'away'],
  ] as const) {
    const lineup = lineups?.[key];
    if (!lineup) continue;
    for (const player of [...(lineup.starting_xi ?? []), ...(lineup.substitutes ?? [])]) {
      const name = (player.name ?? '').toUpperCase().trim();
      if (name) lineupSide.set(name, side);
    }
  }

  const normalised = events.map((event, index) => {
    const { label, sortKey } = parseMinute(event.minute);
    const type =
      event.type === 'goal' || event.type === 'yellow_card' || event.type === 'red_card' || event.type === 'substitution'
        ? event.type
        : 'other';

    // Some scraped names carry a stray club prefix or newlines ("FC  \n\n MUHAMAD").
    const player = (event.player ?? '').replace(/\s+/g, ' ').trim().replace(/^FC\s+/i, '');

    const swapped =
      type === 'substitution' && player.includes('->')
        ? (() => {
            const [off, on] = player.split('->').map((part) => part.trim());
            return { off: off.replace(/^\d+\s+/, ''), on: on.replace(/^\d+\s+/, '') };
          })()
        : undefined;

    return {
      index,
      type: type as TimelineEvent['type'],
      label,
      sortKey,
      side: sideOf(event) ?? lineupSide.get(player.toUpperCase()) ?? null,
      player: swapped ? swapped.on : player,
      swapped,
    };
  });

  // Goals decide the running score, so they must be walked in real order.
  normalised.sort((a, b) => a.sortKey - b.sortKey || a.index - b.index);

  let home = 0;
  let away = 0;
  const withScore = normalised.map((event) => {
    const out: TimelineEvent = {
      type: event.type,
      label: event.label,
      sortKey: event.sortKey,
      side: event.side,
      player: event.player,
    };
    if (event.swapped) out.swapped = event.swapped;

    if (event.type === 'goal') {
      if (event.side === 'home') home += 1;
      else if (event.side === 'away') away += 1;
      out.score = { home, away };
    }
    return out;
  });

  // Some iLeague pages list goals that contradict the recorded result (a 3:1
  // match carrying four goals for one side). Showing a running score that ends
  // somewhere other than the scoreline would be worse than showing none, so drop
  // the per-goal score and keep the goals themselves.
  const consistent =
    !finalScore ||
    (home === finalScore.home && away === finalScore.away);

  return consistent ? withScore : withScore.map(({ score, ...rest }) => rest);
}
