---
name: idk
description: >
  Point to the right social skill for what the user is trying to do, and map how the
  whole social-* family fits together across LinkedIn, X (Twitter), Instagram, Facebook,
  Threads, TikTok, YouTube, Bluesky, and Mastodon.
  Use when the user asks "which social skill should I use", "what can you do for my
  social media", "where do I start", "help me pick a skill", or "what social skills
  are there". Reads social-context.md to tell whether setup is done, and always points
  first-time users to the social-context skill before anything else.
disable-model-invocation: true
license: MIT
metadata:
  version: 0.1.0
  category: Foundation
  topics:
    - routing
    - planning
  examplePrompt: "Which skill should I use to turn my blog post into a week of content?"
---

Map what the user wants onto the one social skill whose procedure fits, and hand them the
phrase that triggers it. Route, don't perform — the named skill does the work.

## Context

Read `social-context.md` at the project root (also check `.agents/social-context.md`). If it
is missing, the user hasn't been set up: your first recommendation is always the
`social-context` skill ("set up my social context"), because every other skill reads that
file. If it exists, setup is done — route straight to the task skill.

## Workflow

1. **Name the job in one line.** Restate what the user is trying to produce or decide — one
   post, a thread, a week of content, a plan, ad copy, a fix, an audit. If it is ambiguous,
   ask one question; don't guess across two different procedures.
2. **Match the job to exactly one skill** using the Skill map below. Match on the _procedure_
   the user needs, not the platform — platform is a constraint each skill already handles.
3. **Check the prerequisite.** If `social-context.md` is missing, recommend `social-context`
   first, then the task skill. If the task leans on voice and the Voice section is thin,
   suggest `social-voice` alongside.
4. **Hand off.** Name the skill, say in one line why it fits, and give the trigger phrase the
   user can say to invoke it. If two skills genuinely both fit (one post vs many), present the
   pair with the one-line difference and let the user pick.

## Skill map

| The user wants to…                                   | Skill              | Trigger phrase                            |
| ---------------------------------------------------- | ------------------ | ----------------------------------------- |
| Set up who they are / audience / pillars / red lines | `social-context`   | "set up my social context"                |
| Teach the agent their writing voice                  | `social-voice`     | "learn my voice"                          |
| Write one post for one platform                      | `social-post`      | "write a LinkedIn post about…"            |
| Write a thread / multi-post sequence                 | `social-thread`    | "turn this into an X thread"              |
| Build an Instagram/LinkedIn carousel                 | `social-carousel`  | "make a carousel about…"                  |
| Get scored hook options for a draft                  | `social-hook`      | "give me hooks for this"                  |
| Adapt one message across many platforms at once      | `social-crosspost` | "post this on LinkedIn, X, and Instagram" |
| Mine one source into a week of different posts       | `social-repurpose` | "turn my blog into a week of posts"       |
| Triage and reply to comments/mentions/DMs            | `social-reply`     | "help me reply to these comments"         |
| Write paid ad copy variants                          | `social-ad`        | "write Facebook ad variants"              |
| Plan a 2-week content calendar                       | `social-calendar`  | "plan my next two weeks"                  |
| Validate a draft before posting                      | `social-check`     | "will this work on Instagram?"            |
| Audit a profile / content history vs goals           | `social-audit`     | "audit my LinkedIn"                       |

The two easily-confused pairs:

- **`social-post` vs `social-crosspost`** — one platform, deeply (two hook variants) vs the same message adapted across several platforms at once.
- **`social-crosspost` vs `social-repurpose`** — the _same_ message on many platforms now vs _many different_ posts mined from one source over a week.

## Quality bar

- Recommend exactly one skill per job unless two genuinely fit — then name both with the one-line difference.
- Never route past setup: if `social-context.md` is missing, `social-context` comes first.
- Match on procedure, not platform; every skill handles its own platforms.
- Always include the trigger phrase, so the user can act without asking how.

## Deliverable

A one-line recommendation: the skill to use, why it fits in a phrase, and the exact trigger
to say — plus the foundation prerequisite if setup isn't done. Then hand off; the named skill
does the work.
