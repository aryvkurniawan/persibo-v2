"""Build src/data/history.json from RSSSF and Wikipedia.

The club's seasons before 2024-25 exist only as text archives. iLeague keeps no
history: /fixtures/index/PEGADAIAN_LIGA_2_2018 returns the 2026 schedule, so
scraping it by season name writes this year's fixtures into a 2018 file.

RSSSF serves plain <pre> tables with one match per line, which is why it can be
parsed exactly. Match lists exist for 2003, 2004-2008 (partial), 2009-10 (full
treble season), 2011-12, and 2013; 2010-11 only has a final table.

No era before 2024-25 has lineups, cards, goal minutes or referees anywhere. The
output records that as `detail: false` instead of writing empty arrays that the
UI would render as "0 pemain".

Run: python .scratch/scrape_history_rsssf.py
"""

import json
import re
import subprocess
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(r"C:/Pawon/sites/persibo")
OUT = ROOT / "src/data/history.json"
STANDINGS_OUT = ROOT / "src/data/historyStandings.json"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"

MATCH = re.compile(r"^(\S.*?)\s{1,}(\d+)-(\d+)\s{1,}(\S.*?)\s*(\[.*\])?\s*$")
NOT_CLUB = re.compile(r"^\s*[\d-]+\.|\bQualified\b|\bRelegated\b|do not enter|^\s*R\s*$")
MARKER = re.compile(r"^(Grup [IVX]+|Grup [A-Za-z]|Wilayah [IVX]+|Wilayah [A-Za-z]|Babak \d+ Besar|Babak Final|Semifinals.*|Final \[.*|Quarterfinals.*|Divisi (Utama|Satu|Dua|Tiga)\b|Liga (Esia|Primer|Indonesia)\b.*|Piala Indonesia\b.*)$")


def get(url):
    out = subprocess.run(
        ["curl", "-sS", "-L", "-m", "60", "-A", UA, url],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    )
    if out.returncode != 0 or not out.stdout:
        raise RuntimeError(f"curl failed for {url}: {out.stderr[:200]}")
    return out.stdout


def is_persibo(name):
    return re.search(r"\bPersibo\b", name, re.I) is not None


def parse_matches(html, competition_filter=None, start_at=None, end_at=None):
    """Return Persibo matches, each tagged with the nearest preceding round marker.

    start_at/end_at limit parsing to a global line range across <pre> blocks; the
    caller uses them when one page mixes several competitions (2008-09).
    """
    soup = BeautifulSoup(html, "html.parser")
    matches = []
    cursor = 0

    for pre in soup.find_all("pre"):
        lines = pre.get_text().split("\n")
        lo = max(0, (start_at or 0) - cursor)
        hi = len(lines) if end_at is None else min(len(lines), end_at - cursor)
        sub = lines[lo:hi] if (start_at is not None or end_at is not None) else lines
        marks = [(i, l.strip()) for i, l in enumerate(sub) if MARKER.match(l.strip())]

        def phase(index):
            current = None
            for mi, mt in marks:
                if mi < index:
                    current = mt
                else:
                    break
            return current

        for i, line in enumerate(sub):
            if not is_persibo(line) or NOT_CLUB.search(line):
                continue
            m = MATCH.match(line)
            if not m:
                continue
            home, hs, as_, away, note = m.groups()
            away = re.sub(r"\s{2,}.*$", "", away).strip()
            if not (is_persibo(home) or is_persibo(away)):
                continue
            matches.append({
                "round": phase(i),
                "home": home.strip(),
                "away": away,
                "home_score": int(hs),
                "away_score": int(as_),
                "note": (note or "").strip(" []"),
            })
        cursor += len(lines)
    return matches


def first_line_index(html, needle):
    """Global line index of the first line containing needle, across <pre> blocks."""
    cursor = 0
    for pre in BeautifulSoup(html, "html.parser").find_all("pre"):
        lines = pre.get_text().split("\n")
        for i, l in enumerate(lines):
            if needle in l:
                return cursor + i
        cursor += len(lines)
    return None


def split_competitions(html):
    """2009-10 mixes Piala Indonesia and Divisi Utama on one page."""
    soup = BeautifulSoup(html, "html.parser")
    comp = None
    buckets = {}
    for el in soup.body.descendants:
        name = getattr(el, "name", None)
        if name == "h4":
            comp = el.get_text(" ", strip=True)
        elif name == "pre" and comp:
            for line in el.get_text().split("\n"):
                if is_persibo(line) and re.search(r"\d-\d", line) and not NOT_CLUB.search(line):
                    m = MATCH.match(line)
                    if m:
                        buckets.setdefault(comp, 0)
                        buckets[comp] += 1
    return buckets


CREDIT = re.compile(r"Authors?:\s+(.+?)\s+Last updated:", re.S)


def credit(html):
    """RSSSF allows copying only with the authors acknowledged, so read them."""
    text = BeautifulSoup(html, "html.parser").get_text(" ")
    text = re.sub(r"\s+", " ", text)
    m = CREDIT.search(text)
    if not m:
        return None
    names = re.sub(r"\s+and\s+", ", ", m.group(1).strip())
    names = re.sub(r"\([^)]*@[^)]*\)", "", names)
    names = re.sub(r"\s+", " ", names)
    return [n.strip() for n in names.split(",") if n.strip()]


def tally(matches):
    """Win/draw/loss record, counted from the parsed scores, not trusted from a table."""
    w = d = l = gf = ga = 0
    for m in matches:
        mine = m["home_score"] if is_persibo(m["home"]) else m["away_score"]
        theirs = m["away_score"] if is_persibo(m["home"]) else m["home_score"]
        gf += mine
        ga += theirs
        if mine > theirs:
            w += 1
        elif mine == theirs:
            d += 1
        else:
            l += 1
    return {"played": len(matches), "won": w, "drawn": d, "lost": l,
            "goals_for": gf, "goals_against": ga, "points": w * 3 + d}


def league_only(matches):
    """Drop the knock-out games.

    RSSSF labels the whole regular season "Final Table:" (the table comes first and
    the 20 fixtures follow), so the round name cannot identify the league phase.
    The table itself says 20 matches, which is the check that matters.
    """
    return [m for m in matches
            if not re.match(r"^(Semifinals|Final \[|Quarterfinals|Babak \d+ Besar)", m["round"] or "")]


# From en.wikipedia.org/wiki/Persibo_Bojonegoro. The honours bullets list only the
# league and cup wins; the two lower-division titles come from the prose.
HONOURS = [
    {"year": "2003-04", "title": "Juara Divisi Dua Liga Indonesia", "tier": "Divisi Dua"},
    {"year": "2007-08", "title": "Juara Divisi Satu Liga Indonesia", "tier": "Divisi Satu"},
    {"year": "2009-10", "title": "Juara Divisi Utama Liga Indonesia", "tier": "Divisi Utama"},
    {"year": "2012", "title": "Juara Piala Indonesia", "tier": "Piala"},
    {"year": "2013", "title": "Peserta Piala AFC (fase grup)", "tier": "AFC"},
    {"year": "2013", "title": "Juara kedua Community Shield", "tier": "Piala"},
    {"year": "2023-24", "title": "Juara Liga 3 Jawa Timur", "tier": "Liga 3"},
    {"year": "2023-24", "title": "Juara kedua Liga 3 Nasional", "tier": "Liga 3"},
]


# ------------------------------------------------------------------ standings
ROW = re.compile(r"\s*(\d+)\.\s*(.+?)\s{2,}(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*-\s*(\d+)\s+(\d+)(.*)$")
DASH = re.compile(r"\s*[-\s]{4,}$")

NOISE_NOTE = re.compile(r"^(Divisi (Utama|Satu|Dua|Tiga)\b.*|Liga Esia [IV]+\b.*|Promoted\b.*|Championship Playoff\b.*)$")

def keep_note(note):
    """RSSSF repeats the destination division on every row; drop that, keep the rest."""
    note = re.sub(r"\[.*?\]", "", note).strip()
    note = re.sub(r"\s{2,}", " ", note)
    if not note or NOISE_NOTE.match(note):
        return ""
    return note

def parse_table(lines, start):
    """Walk outwards from a Persibo row to the whole table it belongs to."""
    top = start
    while top > 0 and (ROW.match(lines[top - 1]) or DASH.match(lines[top - 1])):
        top -= 1
    bottom = start
    while bottom + 1 < len(lines) and (ROW.match(lines[bottom + 1]) or DASH.match(lines[bottom + 1])):
        bottom += 1
    rows = []
    for raw in lines[top:bottom + 1]:
        m = ROW.match(raw)
        if m:
            rows.append({
                "pos": int(m.group(1)),
                "club": re.sub(r"\s*\(.*$", "", m.group(2)).strip(),
                "p": int(m.group(3)), "w": int(m.group(4)), "d": int(m.group(5)),
                "l": int(m.group(6)), "gf": int(m.group(7)), "ga": int(m.group(8)),
                "pts": int(m.group(9)), "note": keep_note(m.group(10).strip()),
            })
    return rows

def persibo_row(rows):
    for row in rows:
        if row["club"].split()[0] == "Persibo":
            return row
    return None

def standings_table(html, season, competition, stage, level, source, nth=0):
    """RSSSF splits a season over several <pre> blocks, so scan all of them."""
    found = []
    for pre in BeautifulSoup(html, "html.parser").find_all("pre"):
        lines = pre.get_text().split("\n")
        for i, line in enumerate(lines):
            if re.match(r"\s*\d+\.\s*Persibo\b", line):
                rows = parse_table(lines, i)
                row = persibo_row(rows)
                if row and len(rows) > 1:
                    found.append({"season": season, "competition": competition,
                                  "stage": stage, "level": level, "group": stage,
                                  "source": source, "persibo": row, "rows": rows})
    return found[nth] if len(found) > nth else None

def build():
    seasons = []

    # ---- 2009-10: the treble season. Full group stage + league + knock-out.
    html = get("https://rsssf.org/tablesi/indo2010.html")
    all_2009 = parse_matches(html)
    # The league phase is the 20 matches labelled "Grup III"; "Grup B" is the
    # Piala Indonesia group stage. Record counts league only; matches keep all of
    # them so the page shows the full treble run.
    league = [m for m in all_2009 if m["round"] == "Grup III"]
    season_2009 = all_2009
    seasons.append({
        "credit": credit(html),
        "season": "2009-10",
        "window": "Juli 2009 – Mei 2010",
        "label": "Divisi Utama 2009-10",
        "competition": "Liga Indonesia Premier Division",
        "result": "Juara",
        "note": "Juara lewat adu penalti 3-1 atas Deltras. Stadion Manahan, Solo.",
        "detail": False,
        "record": tally(league),
        "matches": season_2009,
        "source": "https://rsssf.org/tablesi/indo2010.html",
    })

    # ---- 2011-12: Liga Prima Indonesia, Persibo finished 4th.
    html = get("https://rsssf.org/tablesi/indo2012.html")
    m2012 = parse_matches(html)
    seasons.append({
        "credit": credit(html),
        "season": "2011-12",
        "window": "Desember 2011 – Juli 2012",
        "label": "Liga Prima Indonesia 2011-12",
        "competition": "Liga Prima Indonesia",
        "result": "Peringkat 4",
        "note": "Peringkat 4. Liga pecahan PSSI.",
        "detail": False,
        "record": {"played": 22, "won": 11, "drawn": 3, "lost": 8,
                   "goals_for": 31, "goals_against": 24, "points": 36},
        "matches": m2012,
        "source": "https://rsssf.org/tablesi/indo2012.html",
    })

    # ---- 2013: disqualified after 15 matches.
    html = get("https://rsssf.org/tablesi/indo2013.html")
    m2013 = parse_matches(html)
    seasons.append({
        "credit": credit(html),
        "season": "2013",
        "window": "Januari – Desember 2013",
        "label": "Indonesia Super League 2013",
        "competition": "Indonesia Super League",
        "result": "Didiskualifikasi",
        "note": "Didiskualifikasi di laga ke-15.",
        "detail": False,
        "record": {"played": 15, "won": 2, "drawn": 1, "lost": 12,
                   "goals_for": 6, "goals_against": 37, "points": 7},
        "matches": m2013,
        "source": "https://rsssf.org/tablesi/indo2013.html",
    })


    # ---- earlier seasons. RSSSF carries a final table for each of these; for
    # most of them it also lists the matches themselves (group and knock-out
    # rounds), which we parse here. 2010-11 has only a table.
    EARLY = [
        ("2003", "indo03", "Divisi Satu", ["Grup B"], "divisi-satu", None, None),
        ("2004", "indo04", "Divisi Dua", ["Grup C", "Grup L", "Grup Q"], "divisi-dua", None, None),
        ("2005", "indo05", "Piala Indonesia", ["Wilayah II", "Wilayah III"], "piala", None, None),
        ("2006", "indo06", "Divisi Satu", ["Wilayah III"], "divisi-satu", None, None),
        ("2007", "indo07", "Divisi Satu", ["Wilayah IV"], "divisi-satu", None, None),
        ("2008-09", "indo08", "Liga Esia II", ["Grup"], "divisi-utama", "Liga Esia II", None),
        ("2010-11", "indo2011", "Liga Primer Indonesia", [""], "lpi", None, None),
    ]
    tables_out = []
    for season, page, competition, stages, level, slice_start, slice_end in EARLY:
        html = get(f"https://rsssf.org/tablesi/{page}.html")
        found = []
        for nth, stage in enumerate(stages):
            table = standings_table(html, season, competition, stage, level,
                                    f"https://rsssf.org/tablesi/{page}.html", nth=nth)
            if table:
                found.append(table)
        # Drop a short playoff table when a full league table covers the same
        # competition. Sibling groups (2004) are different tables and both stay.
        if len(found) > 1:
            best = max(found, key=lambda t: t["persibo"]["p"])
            found = [t for t in found
                     if t["stage"] != best["stage"]
                     or t["persibo"]["p"] >= best["persibo"]["p"] * 0.5]
        if not found:
            print(f"  !! no table for {season}")
            continue
        tables_out.extend(found)
        table = found[0]
        r = table["persibo"]
        if slice_start:
            start_i = first_line_index(html, slice_start)
            matches = parse_matches(html, start_at=start_i) if start_i is not None else []
        else:
            matches = parse_matches(html)
        seasons.append({
            "credit": credit(html),
            "season": season,
            "window": "",
            "label": f"{competition} {season}".strip(),
            "competition": competition,
            "result": f'Peringkat {r["pos"]}',
            "note": r["note"].capitalize() if r["note"] else "",
            "detail": False,
            "record": {"played": r["p"], "won": r["w"], "drawn": r["d"],
                       "lost": r["l"], "goals_for": r["gf"], "goals_against": r["ga"],
                       "points": r["pts"]},
            "matches": matches,
            "source": f"https://rsssf.org/tablesi/{page}.html",
        })

    # 2004 also has the group and the final round; keep them as separate tables.
    seasons.sort(key=lambda s: (s["season"] != "2003", s["season"]))

    # Full tables for the three detailed seasons, same source pages.
    for season, page, competition, stage, level in [
        ("2009-10", "indo2010", "Divisi Utama", "Grup III", "divisi-utama"),
        ("2011-12", "indo2012", "Liga Prima Indonesia", "", "lpi"),
        ("2013", "indo2013", "Liga Prima Indonesia", "", "lpi"),
    ]:
        html = get(f"https://rsssf.org/tablesi/{page}.html")
        candidates = []
        for nth in range(4):
            table = standings_table(html, season, competition, stage, level,
                                    f"https://rsssf.org/tablesi/{page}.html", nth=nth)
            if table and table["persibo"]["p"] not in {c["persibo"]["p"] for c in candidates}:
                candidates.append(table)
        if candidates:
            tables_out.append(max(candidates, key=lambda t: t["persibo"]["p"]))

    order = ["2003", "2004", "2005", "2006", "2007", "2008-09", "2009-10",
             "2010-11", "2011-12", "2013"]
    tables_out.sort(key=lambda t: (order.index(t["season"]), t["stage"]))

    payload = {"honours": HONOURS, "seasons": seasons}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    for s in seasons:
        r = s["record"]
        print(f'{s["season"]:<9} {r["played"]:>3} laga  {r["won"]}-{r["drawn"]}-{r["lost"]}  '
              f'{r["goals_for"]}-{r["goals_against"]}  {r["points"]} poin  '
              f'| {len(s["matches"])} pertandingan tersimpan')
    STANDINGS_OUT.write_text(json.dumps({
        "source": "RSSSF",
        "source_url": "https://rsssf.org/tablesi/",
        "note": "Tabel apa adanya dari RSSSF. Dua baris tidak cocok aritmetika "
                "(Persela 2003, Persedikab 2006) dan dibiarkan seperti sumbernya.",
        "tables": tables_out,
    }, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    print(f"\nwrote {OUT.relative_to(ROOT)}")
    print(f"wrote {STANDINGS_OUT.relative_to(ROOT)} ({len(tables_out)} tabel)")


if __name__ == "__main__":
    build()
