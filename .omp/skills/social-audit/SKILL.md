---
name: social-audit
description: >
  Audit a social profile or content history the user pastes —
  LinkedIn, X, Instagram, Facebook, Threads, or Bluesky — against their stated
  goals. Use when the user says "audit my LinkedIn", asks "why isn't this
  growing", says "review my profile", or asks "what's wrong with my content".
  It scores posting consistency against intended cadence, pillar balance
  across recent posts, hook quality with verbatim rewrites, format mix,
  engagement patterns the user reports, and bio/profile completeness. It
  reads social-context.md for the user's goals, pillars, and stated cadence so
  the audit measures against their own intentions rather than generic
  benchmarks. It works entirely from pasted data — stating plainly what it
  cannot know without analytics exports and asking the user to paste what they
  have — and it ends in a prioritized gap list with a 3-move action plan,
  biggest lever first.
license: MIT
metadata:
  version: 0.1.0
  category: Check
  topics:
    - analytics
    - planning
  examplePrompt: "Audit my X profile — 4 months of posting, follower count flat"
---

Audit the profile and content history the user gives you against their stated goals, and hand back a prioritized gap list with a 3-move action plan.

## Context

Read `social-context.md` at the project root (also check `.agents/social-context.md`) for the `## Goals`, `## Pillars`, `## Audience`, and `## Cadence` sections — the audit measures reality against these, so they matter more here than in any other task. If it's missing, offer to run the `social-context` skill first, but don't block — ask 2–3 quick inline questions and proceed:

- What's the goal — leads, audience growth, hiring, authority?
- What pillars did you _intend_ to post about?
- What cadence did you _intend_ to keep?

## Workflow

1. **Collect the evidence.** Ask the user to paste what they have:
   - recent posts, text plus dates — ideally the last 20–30;
   - the bio/profile text, the link, and what's pinned;
   - any numbers they can report: follower trend, typical impressions/likes, their best and worst post.
     Work only from what's pasted. State clearly up front what you cannot assess without more — e.g. "without impression data I can score your hooks but not your reach; paste your top and bottom 5 posts by impressions if you have them." Never fill an evidence gap with a guess.
2. **Score posting consistency.** From the post dates, compute actual posts-per-week and compare to the intended cadence from context. Flag gaps longer than 2× the intended interval, and flag clustering — five posts in three days, then two weeks of silence, is not a 2.5/week cadence. Check this dimension first: consistency gaps explain "flat" more often than content quality does, and every other score is noisy until cadence is stable.
3. **Score pillar balance.** Tag each pasted post with its pillar, or "off-pillar" if it fits none. Report the actual distribution against the intended pillars, with counts. Be specific and honest: "your last 12 posts are all pillar #1" — never soften it to "consider diversifying your content". Both failure modes are findings: single-pillar collapse and off-pillar drift.
4. **Score hook quality.** Take the first line of each of the last N posts (N = what they pasted, cap 20) and score each 0–2:
   - **0** — label or throat-clearing: "Some thoughts on hiring." / "I've been meaning to write this."
   - **1** — clear topic, no tension: "How we run our onboarding."
   - **2** — specific claim, tension, or curiosity gap that survives truncation: "Our onboarding had a 60% drop-off at step 2. One email fixed it."
     Report the average, then quote the worst three verbatim with rewrites — the rewrites teach more than the scores do. Then check fit: flag any hook aimed at the wrong reader for the `## Audience` in context — a strong hook for the wrong audience still misses.
5. **Score format mix.** Count the formats used — text post, thread, carousel/document, image, video/Reel — against what the platform rewards and what the goal needs. Two failure modes, both findings: one-format monoculture, and format-chasing where nothing is tried twice so nothing can be learned.
6. **Read the engagement pattern — from their numbers only.** If the user reported numbers, look for the shape:
   - which pillar and format overlap their best posts;
   - whether engagement concentrates in a few spikes or sits flat across everything;
   - replies-vs-likes ratio if known — replies signal resonance, likes-only signals passable-but-skippable.
     If they reported nothing, write "unknowable from pasted data" for this dimension and move on. Do not infer engagement from post text.
7. **Audit the profile itself.** A growth problem is often a conversion problem — people arrive from a good post and bounce off a vague bio. Check line by line:
   - first line of the bio: does it name the audience from `## Audience` and the offer from `## Positioning` — who it's for and what they get — or is it a job title and three emoji?
   - credibility: any evidence — numbers, names, track record?
   - the link: present, working destination described, matched to the goal?
   - pinned post: their best converter, or just their newest?
   - profile photo and banner: present and legible at feed size, as described?
8. **Diagnose against the goal.** Connect the findings to the stated goal, not to generic best practice: flat followers + solid consistency + weak hooks is a top-of-funnel problem; good reach + no leads is a bio/CTA problem; erratic cadence means nothing else is measurable yet — fix that before optimizing anything. Name the single biggest lever explicitly, in one sentence.
9. **Build the gap list.** Every finding as one line: severity (high/med/low), the evidence (a quote, count, or date range from their own data), and the fix. Order by expected impact on _their_ goal, not by ease of fixing.
10. **Write the 3-move action plan.** Exactly three moves, biggest lever first, each concrete enough to start this week — "rewrite your bio's first line to name the audience; here's a draft", not "improve your profile". Wherever a move has a draft or example, include it inline.

## Quality bar

| Dimension      | Evidence required               | Verdict style                              |
| -------------- | ------------------------------- | ------------------------------------------ |
| Consistency    | Post dates vs stated cadence    | Actual number vs intended number           |
| Pillar balance | Per-post pillar tags            | Distribution counts, drift named           |
| Hooks          | First lines, scored 0–2         | Average, plus worst 3 quoted with rewrites |
| Format mix     | Format counts                   | Monoculture or scattershot, named          |
| Engagement     | User-reported numbers only      | Pattern, or "unknowable from pasted data"  |
| Profile        | Pasted bio / link / pinned post | Line-by-line, with rewrite drafts          |

Hard rules:

- Every claim cites the user's own data — a quote, a count, a date range. If you can't point at evidence, it isn't a finding.
- No invented benchmarks: "posts with images get 2.3× engagement" is not something you know from pasted data.
- Unknowns are stated as unknowns, never papered over with plausible-sounding filler.
- "Diversify your content"-grade advice is banned — name the posts, name the gap, show the fix.
- Severity reflects impact on _their_ stated goal, not general social-media hygiene.
- The 3-move plan is exactly three moves; a ten-item to-do list is an audit that dodged prioritization.
- Every dimension in the table above gets a verdict or an explicit "couldn't assess — need X"; a silently dropped dimension reads as a pass.

## Deliverable

The audit report: a one-paragraph verdict naming the single biggest lever, the dimension-by-dimension findings with quoted evidence, a "couldn't assess" list naming exactly what data would unlock each missing item, the prioritized gap list, and the 3-move action plan with inline drafts wherever a move includes one. This is analysis and a plan for the user to act on themselves — hand it back and stop.
