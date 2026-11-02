"""Fill src/data/seasons/2025-26/matchDetails.json from iLeague.

The 2024-25 scraper already parses an iLeague result page (lineups, coaches,
officials), so this reuses it instead of copying it. The 2025-26 competition
differs in three ways the shared parser cannot know about:

  * the timeline tab is empty, but the hero block lists every goal and card per
    team, so events are rebuilt from there (verified to match every scoreline);
  * the statistics tab is rendered with empty spans - nothing was ever
    published, so null stats are dropped rather than written as zeros;
  * officials are spelled "Cadangan Wasit" and "Asisten Wasit 2", which the
    shared regex misses.

Run:  python .scratch/scrape_ileague_2025_26.py [--force]
"""

import importlib.util
import json
import re
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEASON = "2025-26"
OUT = ROOT / "src/data/seasons" / SEASON
FORCE = "--force" in sys.argv[1:]

spec = importlib.util.spec_from_file_location("base", ROOT / ".scratch/scrape_ileague_2024_25.py")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
base.now = datetime.now().isoformat()
clean = base.clean

OFFICIAL_LABELS = {
    "Pengawas Pertandingan": "match_commissioner",
    "Wasit": "referee",
    "Asisten Wasit 1": "assistant_referee_1",
    "Asisten Wasit 2": "assistant_referee_2",
    "Cadangan Wasit": "fourth_official",
    "Wasit Cadangan": "fourth_official",
}


def officials_from(soup):
    """The perangkat table labels each role in <b> and the name after a <br>."""
    out = {key: "" for key in OFFICIAL_LABELS.values()}
    for bold in soup.select("#perangkat b"):
        label = clean(bold.get_text(" ", strip=True))
        key = OFFICIAL_LABELS.get(label)
        if not key:
            continue
        value = clean(bold.parent.get_text(" ", strip=True))[len(label):]
        out[key] = clean(re.sub(r"\s*Histori$", "", value))
    return out


def venue_from(soup):
    for li in soup.select(".result-location li"):
        if li.find("i", class_="fa-map-marker"):
            return clean(li.get_text(" ", strip=True)).replace(" ,", ",")
    return ""


def hero_events(soup):
    """Goal/card list under each team crest. One <li> per offence: name, icon, minute."""
    events = []
    for block in soup.select("div.match-hero-team"):
        name_el = block.select_one(".match-hero-name")
        team = clean(name_el.get_text(" ", strip=True)) if name_el else ""
        for li in block.select("ul li"):
            kind = None
            for icon in li.find_all("i"):
                classes = " ".join(icon.get("class") or [])
                style = (icon.get("style") or "").lower()
                if "futbol" in classes:
                    kind = "goal"
                elif "square" in classes:
                    kind = "red_card" if "red" in style else "yellow_card"
            text = clean(li.get_text(" ", strip=True))
            # Own goals read "90' (OG)" and are listed under the side that
            # benefits, so the block's club stays the scoring side.
            minute = re.search(r"(\d+(?:[+()]\d+)?)'(\s*\(OG\))?\s*$", text)
            if not kind or not minute:
                continue
            player = re.sub(r"\s+C$", "", text[: minute.start()].strip())
            if minute.group(2):
                player = f"{player} (OG)"
            events.append({
                "minute": minute.group(1) + "'",
                "player": player,
                "type": kind,
                "team": team,
            })
    return events


def detail_for(fixture):
    url = fixture["match_url"]
    soup = base.BeautifulSoup(base.get(url), "html.parser")

    d = base.scrape_detail(url)
    d.update({
        "home_team": fixture["home_team"],
        "away_team": fixture["away_team"],
        "score": fixture["score"],
        "events": hero_events(soup),
        "officials": officials_from(soup),
        "venue": venue_from(soup) or d.get("venue", ""),
    })
    home, _, away = fixture["score"].partition(":")
    d["home_score"] = int(home) if home.isdigit() else 0
    d["away_score"] = int(away) if away.isdigit() else 0

    # Nothing was published: drop the keys instead of shipping 0:0 rows.
    d["statistics"] = {
        key: value for key, value in (d.get("statistics") or {}).items()
        if value and (value.get("home") is not None or value.get("away") is not None)
    }
    return d


def main():
    target = OUT / "matchDetails.json"
    if target.exists() and not FORCE:
        sys.exit("refusing to overwrite %s; re-run with --force" % target.relative_to(ROOT))

    fixtures = [fx for fx in json.load(open(OUT / "fixtures.json", encoding="utf-8")) if fx.get("match_url")]
    details, failed = [], []
    for i, fx in enumerate(fixtures, 1):
        try:
            d = detail_for(fx)
            details.append(d)
            goals = sum(1 for e in d["events"] if e["type"] == "goal")
            print("[%d/%d] %s %s %s (xi %d/%d events %d, goals %d/%s)"
                  % (i, len(fixtures), fx["home_team"], fx["score"], fx["away_team"],
                     len(d["lineups"]["home_team"]["starting_xi"]),
                     len(d["lineups"]["away_team"]["starting_xi"]),
                     len(d["events"]), goals, fx["score"].replace(":", ":")))
        except Exception as exc:  # noqa: BLE001
            failed.append(fx["match_url"])
            print("[%d/%d] FAILED %s: %s" % (i, len(fixtures), fx["match_url"], exc))

    if failed:
        sys.exit("aborting, %d match(es) failed: %s" % (len(failed), failed))

    json.dump(details, open(target, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    print("wrote", target.relative_to(ROOT), "(%d matches)" % len(details))


if __name__ == "__main__":
    main()
