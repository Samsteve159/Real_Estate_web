# CLAUDE.md — LinkedIn Automation for Girish VS

## What this project does

Automates the LinkedIn presence of **Girish VS** (Dean, Supply Chain Institute, ~15k followers).
- AI drafts posts from a topic queue; Girish approves via email before anything publishes
- AI drafts comment replies; Girish approves via daily email digest
- Scout engine suggests proactive comments on others' posts
- Everything is human-in-the-loop — nothing posts without Girish's explicit reply

## Client

- **Girish VS** — 65+, not tech-savvy, communicates entirely via email
- **Sameer** — consultant/developer, handles all technical setup
- Girish never logs into the system; he only reads and replies to emails

## Interface: Email only

- **Inbound**: SendGrid Inbound Parse webhook (`channels/email.py`)
- **Outbound**: SendGrid SMTP
- No WhatsApp, no Twilio, no web UI

## Post schedule

| Draft email sent | Post published |
|---|---|
| **Sunday 9:00am IST** | Monday 12:00pm IST |
| **Wednesday 9:00am IST** | Thursday 12:00pm IST |

Drafts go out **24h before publish** so Girish has a full day to approve (changed 2026-05-24 from same-day Mon/Thu drafts). Configured via `DRAFT_DAYS=sun,wed` and `POST_DAYS=mon,thu` in `.env`.

Weekly topic suggestions: every Sunday at 10:00am IST. **Low-queue trigger fires immediately when queue drops to ≤1 — but skips if a draft-approval flow is active** (otherwise it would clobber Girish's `awaiting_post_selection` state; see Ground rules below).

## Topic queue system

Girish controls all topics via email commands:

| Command | What it does |
|---|---|
| `topic: [text]` | Add topic to queue |
| `topic: [text] · 600 words` | Add with custom word count |
| `I want to write 500 words on [topic]` | Natural-language add with length |
| `list topics` | See numbered queue |
| `remove topic 2` | Remove topic #2 |
| `edit topic 3: new text` | Replace topic #3 |
| `topic 2 first` | Move topic #2 to top |
| `add 1` / `add 2 3` / `add all` | Accept AI-suggested topics |

## Draft approval commands

Sent after the 9am draft email:

| Command | What it does |
|---|---|
| `1` / `2` / `3` | Schedule that draft for 12pm |
| `redo` | New 3 drafts, same topic |
| `redo [instruction]` | New drafts with guidance |
| `2 edit` | Girish sends his own version |
| `2 edit [instruction]` | AI refines draft 2 |
| `ok` / `yes` | Confirm refined draft |

## Module map

| File | Responsibility |
|---|---|
| `channels/email.py` | Inbound webhook; routes commands to router |
| `modules/approval_router.py` | State machine; parses all commands |
| `modules/content_generator.py` | Claude API; 3 variations + refinement + length support |
| `modules/style_profiler.py` | One-time voice analysis → `data/style_profile.json` |
| `modules/linkedin_publisher.py` | OAuth + post + comment via LinkedIn API v2 |
| `modules/comment_manager.py` | Poll comments, draft replies, send digest |
| `modules/scout_engine.py` | Find supply chain posts, draft proactive comments |
| `scheduler/jobs.py` | APScheduler: draft gen (9am), publish (12pm), digest (8am), polling (2h), suggestions (Sun 10am) |
| `database/models.py` | SQLAlchemy ORM: topics, posts, pending_approvals, comments, scout_opportunities, linkedin_tokens |
| `config.py` | All env vars; loaded once at startup |

## Key database tables

- **`topics`** — Girish's topic queue. Fields: `text`, `length_guidance`, `status` (queued/used/removed), `order_index`, `source` (girish/suggested)
- **`posts`** — Full post lifecycle: topic → 3 drafts → approved → published
- **`pending_approvals`** — One row per active email session; tracks state machine state + context JSON

## Scheduler edge cases

- **No approval by 12pm**: skip post, send reminder email
- **Empty queue at 9am**: email Girish asking for a topic instead of drafts
- **Queue drops to ≤ 1 topic**: trigger topic suggestions immediately (don't wait for Sunday)

## Content generation

- Default post length: 150–300 words
- Custom length stored in `topics.length_guidance` and passed to `content_generator.py`
- Style profile loaded from `data/style_profile.json` on every generation call
- 3 hook angles: data/statistic-led · personal story · provocative question
- **Em dashes (—) and en dashes (–) are banned in posts** — added 2026-05-24 after live smoke showed Claude defaulting to AI-tell levels of em-dash usage. Rule is enforced via explicit "NEVER use em dashes" lines in `_system_prompt()`. The prompt itself contains zero em dashes so Claude isn't pattern-matching against them. If you re-edit `_system_prompt()`, preserve this constraint.

## LinkedIn API

- OAuth scopes (current): `openid profile email w_member_social`
- `r_member_social` will be added in Phase 5 (comment polling) — requires extra LinkedIn approval
- Access tokens: 60 days; refresh tokens: 1 year (auto-refreshed)
- Tokens stored encrypted in SQLite (`linkedin_tokens` table)
- OAuth setup is one-time, done by Sameer with Girish present

## Ground rules

- **Do not make any change until you have 95% confidence in what you need to build. Ask follow-up questions until you reach that confidence.**
- **At any point in the project, if you are unsure about anything — requirements, design, edge cases, naming, scope — ask Sameer. Two heads find the best possible outcome; assumptions cause rework.**
- **After completing each phase, test it end-to-end and confirm it actually works before marking the phase done.** Write/run the relevant tests, walk the happy path, hit the obvious edge cases. Do not move to the next phase until the current one is verified working.
- **Always ask Sameer for approval before executing any code changes, file writes, or commands** — plan first, act only after explicit go-ahead
- **Never commit or push** without Sameer's explicit approval
- **Never post to LinkedIn** without Girish's email approval
- All secrets in `.env` only — never in code
- All commands are case-insensitive and parsed fuzzily (typo-tolerant)
- **Approval state machine invariant**: anything that writes to `PendingApproval` (scheduler jobs, new flows) must early-return if the sender is already in `awaiting_post_selection` / `awaiting_free_edit` / `awaiting_refined_confirmation`. One row per sender means writes are destructive; clobbering an active flow loses Girish's draft conversation. See `topic_suggestions_job` in `scheduler/jobs.py` for the canonical pattern.
- **Inbound bodies always go through `channels.email.strip_quoted_reply()`** before reaching the router. SendGrid Inbound Parse returns the full Gmail/Outlook body including reply chains, which breaks the router's anchored regexes. If you add a new inbound entry point, wire it through the same strip.

## Cost

~₹170/month total (Claude API only). SendGrid, LinkedIn API, Oracle Cloud VM are all free tier.

## Where to start

See `plan.md` for full architecture, implementation phases, and workflow examples.
See `PROGRESS.md` for a live build tracker — what's done, what's next, what's not started.

Current state (2026-05-31): **LIVE IN PRODUCTION** on Oracle Cloud Always Free VM (Melbourne, E2.1.Micro, Ubuntu 22.04). Both `linkedin-bot.service` (uvicorn + APScheduler) and `ngrok-bot.service` are active under systemd with `Restart=always`. Mac runtime is stopped — VM is sole runtime, survives reboots. First production draft email was manually sent to Girish on 2026-05-31 11:31 IST (Post #50, topic "Supply Chains in a Fragmented World"). The auto-cron will fire next at Wed 2026-06-03 09:00 IST. Phase 4 is shipped. **Next: Phase 5 (comment management) and Phase 6 (scout engine) — both currently roadmap, not started.** See `output/post-deployment.md` for production ops, `output/girish-guide.html` for the client-facing usage guide.

Sender pattern (important — bit us once): SendGrid's Sender Identity check does *not* extend domain authentication to subdomains. So even with `sameeriyer.com` authenticated, sending from `girish@mail.sameeriyer.com` returns 403. Fix: send from the apex (`SENDGRID_FROM_EMAIL=girish@sameeriyer.com`) and set a Reply-To header (`EMAIL_REPLY_TO=girish@mail.sameeriyer.com`) so Gmail routes replies to our inbound MX. Standard newsletter pattern.
