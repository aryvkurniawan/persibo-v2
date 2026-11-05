---
name: social-ad
description: >
  Write paid social ad copy variant sets for Meta (Facebook and Instagram),
  LinkedIn, X, and TikTok placements. Use when the user says "write ad copy",
  asks for "Facebook ad variants", wants a "LinkedIn ad for this offer", or
  asks for "ad angles for" a product or promotion. For each requested
  placement it produces 3–5 variants built from an angle matrix — pain,
  aspiration, social proof, objection-flip, honest urgency — with every copy
  part written to the platform's real character limits, plus a one-line
  creative brief per variant for the designer. It reads social-context.md for
  brand voice, audience, and offer positioning before drafting. Copy is
  checked against platform ad policies: no calling out sensitive personal
  attributes, no fabricated scarcity or invented social proof.
license: MIT
metadata:
  version: 0.1.0
  category: Ads
  topics:
    - ads
    - facebook
    - instagram
    - linkedin
  examplePrompt: "Write Meta and LinkedIn ad variants for our annual-plan offer"
---

Produce placement-ready ad copy variant sets — an angle matrix crossed with every copy part each platform needs, plus a one-line creative brief per variant.

## Context

Read `social-context.md` at the project root (also check `.agents/social-context.md`) for brand voice, audience, product positioning, and banned phrases (proof points come from the offer and landing page in step 1). If it's missing, offer to run the `social-context` skill first, but don't block — ask 2–3 quick inline questions and proceed:

- What's the offer, the price, and the single strongest proof point?
- Who's the audience, in one sentence?
- Any voice rules — words you never use, no exclamation marks, no "unlock"?

## Workflow

1. **Ingest the offer.** Get the landing page URL or offer description and read it closely. Extract four things: the concrete promise, the price/commitment, the strongest proof point (a number, a named customer, a guarantee), and where the CTA actually sends people. If the landing page's promise and the user's framing disagree, flag it before drafting — ad-to-page mismatch kills conversion and quality scores, and no copy fixes it.
2. **Ask audience temperature.** Cold, warm (engaged but never bought), or retargeting (visited or abandoned)? This is not optional — the copy is structurally different:
   - **Cold:** name the problem before the product; the reader doesn't know they're shopping yet.
   - **Warm:** lead with the offer and the proof; they know the category, sell the difference.
   - **Retargeting:** reference the visit ("Still thinking it over?") and lean on objection-flips and risk-reversal (trial, guarantee, cancel-anytime).
     If the user wants multiple temperatures, treat each as its own variant set — don't average them into mush.
3. **Confirm placements.** Which of Meta (Facebook/Instagram feed), LinkedIn (sponsored content), X, TikTok? Only draft what's requested; each placement is real work, not a find-and-replace.
4. **Build the angle matrix.** For this specific offer, write one crisp sentence per angle before drafting anything:
   - **Pain** — the ongoing cost of the status quo, in the audience's own units (hours, dollars, missed deals).
   - **Aspiration** — the after-state, concrete enough to picture, not "transform your workflow".
   - **Social proof** — a real number or a real name from context or the landing page. Never invented; if none exists, say so and drop the angle.
   - **Objection-flip** — name the #1 objection out loud and answer it head-on ("Yes, another tool. This one deletes three.").
   - **Honest urgency** — a real deadline or capacity limit only. If none exists, replace this angle with a second pain or proof variant. Never fake it.
5. **Draft per placement.** For each placement, write 3–5 variants, each from a different angle, each containing every copy part the platform uses (see Quality bar). Front-load ruthlessly: the visible-truncation point, not the hard limit, is your real budget for the first idea — a hook that dies at "…more" was never a hook.
6. **Write the creative brief line.** One line per variant telling the designer exactly what the visual is: subject, composition, text overlay if any. Concrete ("split screen: messy spreadsheet vs. clean dashboard, overlay '4 hours → 20 minutes'"), never mood-board vapor ("something clean and modern"). The brief should visualize the _angle_, not just the product.
7. **Compliance pass.** Check every variant against the rules that get ads rejected or accounts flagged:
   - No second-person call-outs of sensitive attributes — health conditions, financial hardship, religion, ethnicity, age. "Struggling with debt?" fails Meta review; "Debt doesn't have to be permanent" passes. Rewrite from "you are X" to "X exists / X is solvable".
   - No fake scarcity, invented countdowns, or "only 3 left" that isn't true.
   - No unverifiable superlatives ("the #1 tool") without a citable source.
   - Every claim in the ad must appear on, or be supported by, the landing page.
8. **Pick the CTA button per variant.** The button is part of the copy, chosen from each platform's actual vocabulary (see Quality bar). Default mapping: "Learn More" for cold, "Sign Up" / "Get Offer" for warm and retargeting, "Shop Now" only for direct purchase, "Download" / "Request Demo" when that's literally the next step.
9. **Label everything.** Tag each variant `[placement / angle / temperature]` so when performance data comes back, the user can map winners and losers to the matrix and commission the next round intelligently.
10. **Verify against the Quality bar.** Before handing off, count every copy part of every variant against its placement's real limits in the Quality bar — count, don't eyeball — and check every variant against the Additional bars. Fix any overflow or miss; a variant that overflows its placement is not placement-ready.

## Quality bar

| Placement          | Copy parts and limits                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Meta (FB/IG feed)  | Primary text: ~125 chars visible before "See more" — the hook lives inside that; headline ≤ 40 chars; description ≤ 30 chars; CTA button from Meta vocab |
| LinkedIn sponsored | Intro text: ≤ 150 chars visible before truncation; headline ≤ 70 chars; CTA button from LinkedIn vocab                                                   |
| X                  | Ad copy ≤ 280 chars total; keep ≤ 257 if a link card is attached (URL counts as 23)                                                                      |
| TikTok             | Ad text ≤ 100 chars visible, first ~40 doing the work; CTA button from TikTok vocab                                                                      |

CTA button vocabularies:

| Platform | Buttons                                                                    |
| -------- | -------------------------------------------------------------------------- |
| Meta     | Learn More, Sign Up, Shop Now, Get Offer, Subscribe, Download, Book Now    |
| LinkedIn | Learn More, Sign Up, Register, Download, Request Demo, Get Quote           |
| TikTok   | Learn More, Sign Up, Shop Now, Download, Get Quote                         |
| X        | No button vocab — the link card headline does CTA duty; make it imperative |

Additional bars:

- Every variant in a set opens with a different first word than its siblings.
- No variant restates the headline inside the primary text — they're read together; make them do different jobs.
- Numbers beat adjectives wherever proof exists ("cut onboarding from 3 weeks to 4 days" over "dramatically faster onboarding").
- Urgency only when real; if the deadline moves, the copy was a lie.
- Brand voice rules and the Never list from context apply to ad copy too — ads are not exempt from the voice.
- Hooks pass the truncation test: the first visible chunk carries a complete idea, not a wind-up.

## Deliverable

Per requested placement: a variant set of 3–5 entries, each labelled `[placement / angle / temperature]` and containing every copy part from the table (hook/primary text, headline, description where the platform uses one, CTA button choice) plus its one-line creative brief. Close with the angle matrix itself, so the user can commission more variants against untested angles later. These are drafts for the user to run in their ad manager of choice — hand them back and stop.
