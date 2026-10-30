const MONTHS: Record<string, number> = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12,
};

const WEEKDAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/** iLeague stores dates as "13 November 2026", sometimes already prefixed
 *  with the weekday ("Jumat, 13 November 2026"). Parse both. */
export function parseFixtureDate(date: string): Date | null {
  const cleaned = date.replace(/^[^,]+,\s*/, '').trim();
  const match = cleaned.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = MONTHS[match[2].toLowerCase()];
  const year = Number(match[3]);
  if (!month) return null;

  return new Date(Date.UTC(year, month - 1, day));
}

/** "Jumat" — Indonesian weekday for a fixture date, or '' when unparseable. */
export function getWeekday(date: string): string {
  const parsed = parseFixtureDate(date);
  return parsed ? WEEKDAYS[parsed.getUTCDay()] : '';
}

/** "Jumat, 13 November 2026" — the full form used in match detail headers. */
export function formatDateLong(date: string): string {
  const weekday = getWeekday(date);
  const bare = date.replace(/^[^,]+,\s*/, '').trim();
  return weekday ? `${weekday}, ${bare}` : bare;
}

/** "Jum, 13 Nov" — compact form for cards and lists. */
export function formatDateShort(date: string): string {
  const parsed = parseFixtureDate(date);
  if (!parsed) return date;

  const day = parsed.getUTCDate();
  const month = MONTHS_SHORT[parsed.getUTCMonth()];
  const weekday = WEEKDAYS[parsed.getUTCDay()].slice(0, 3);
  return `${weekday}, ${day} ${month}`;
}

/** "Jumat" — weekday only, for the hero block where the date is split apart. */
export function getWeekdayShort(date: string): string {
  const weekday = getWeekday(date);
  return weekday ? weekday.slice(0, 3) : '';
}
