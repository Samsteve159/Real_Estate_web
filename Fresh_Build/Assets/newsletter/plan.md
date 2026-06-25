# LinkedIn Automation — Project Plan

## Overview

This project automates the LinkedIn presence of **Girish VS**, Dean and Head of Research at a supply chain institute with 30+ years of experience and ~15,000 followers. He currently writes and publishes all content manually.

The system handles two things:
1. **Post drafting** — AI generates LinkedIn posts on a given topic; Girish reviews and approves via email before anything is published.
2. **Interaction management** — AI drafts replies to comments and flags opportunities to comment on others' posts; Girish approves each one before it goes live.

All actions are **human-in-the-loop**. Nothing posts to LinkedIn without Girish's explicit approval.

> **Current build status**: see [PROGRESS.md](PROGRESS.md)
> **Ground rules + module map + current-state one-liner**: see [CLAUDE.md](CLAUDE.md)

---

## Client Profile

| Field | Detail |
|---|---|
| Name | Girish VS |
| Role | Dean + Head of Research, Supply Chain Institute |
| Experience | 30+ years |
| LinkedIn followers | ~15,000 |
| Age | 65+ |
| Tech comfort | Low — needs zero-friction UX |
| LinkedIn | https://www.linkedin.com/in/girish-vs/ |

---

## Confirmed Configuration

| Setting | Value |
|---|---|
| Interface channel | **Email only** (SendGrid) |
| Post frequency | 2x / week — Monday + Thursday |
| Post time | **12:00pm IST** |
| Draft delivery | 9:00am IST on post days (3h before publishing) |
| Language | English only |
| Tech setup | Sameer (consultant) handles initial setup; Girish uses only email |

---

## Architecture

```
Girish
  │
  └─ Email (SendGrid Inbound Parse) ──┐
                                       ▼
                               Input Handler
                               (channels/email.py)
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                   ▼
            Topic Manager       Content Gen          Comment Mgr
            (queue CRUD)       (Claude API)         (Claude API)
                    │                  │                   │
                    └──────────────────┴───────────────────┘
                                       │
                               Approval Router
                               (state machine per sender)
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                      ▼
             Post Now / Schedule                  Post Comment / Reply
             (LinkedIn Posts API)                 (LinkedIn Comments API)
                                       │
                    Confirmation email → Girish
```

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Backend | Python + FastAPI | Async webhooks, simple deployment |
| AI | Claude API (`claude-sonnet-4-6`) | Best content quality + style matching |
| Email | SendGrid Inbound Parse + SMTP | Simple inbound parsing; Girish already uses email |
| LinkedIn | LinkedIn API v2 (Posts + Comments) | Official, ToS-compliant |
| Database | SQLite via SQLAlchemy | No server needed, portable |
| Scheduler | APScheduler | In-process cron for scheduled posts |
| Hosting | Oracle Cloud Always Free (ARM VM) | Free forever, always-on, 4 cores + 24GB RAM |

---

## Modules

### 1. Style Profiler (`modules/style_profiler.py`)
- Ingests Girish's past LinkedIn posts (from LinkedIn data export CSV or API)
- Sends to Claude: "Analyze this person's writing style — tone, vocabulary, structure, how they open/close posts, what they emphasise"
- Saves result as `data/style_profile.json`
- Used as system-prompt context for all future content generation
- Run once at setup; refresh any time

### 2. Content Generator (`modules/content_generator.py`)
- Input: topic text + loaded style profile + optional `length_guidance` (e.g. "600 words", "short")
- Default length: 150–300 words
- Output: 3 post variations
  - **Option 1** — Data/statistic-led hook
  - **Option 2** — Personal story / experience hook
  - **Option 3** — Provocative question / contrarian take
- Each post: hook → 3–4 paragraphs → CTA + hashtags
- Also handles `refine_draft(draft, instruction)` for on-demand edits

### 3. LinkedIn Publisher (`modules/linkedin_publisher.py`)
- OAuth 2.0 flow: generates auth URL → handles callback → stores encrypted tokens
- Auto-refreshes tokens before they expire; warns Sameer 7 days before expiry
- `post_content(text)` — publishes to LinkedIn via UGC Posts API
- `post_comment(post_urn, text)` — posts a comment
- `get_post_comments(post_urn)` — fetches comments for polling
- `get_recent_posts()` — fetches Girish's recent posts

### 4. Approval Router (`modules/approval_router.py`)
State machine stored in SQLite. One session per sender at a time.

**States:**
- `idle` — no pending action
- `awaiting_post_selection` — 3 drafts sent, waiting for choice
- `awaiting_free_edit` — asked Girish to send his own version
- `awaiting_refined_confirmation` — AI-refined draft sent, waiting for "OK"
- `awaiting_comment_approvals` — daily comment digest sent
- `awaiting_scout_approvals` — scout opportunities sent

**Post approval commands:**

| Command | Action |
|---|---|
| `1` / `2` / `3` | Schedule that draft for 12pm |
| `redo` | Regenerate 3 new drafts |
| `redo make it shorter` | Regenerate with guidance |
| `2 edit` | Ask Girish to send his own version |
| `2 edit make it punchier` | AI refines draft 2 with his instruction |
| `ok` / `yes` | Confirm the last refined draft and schedule |

**Topic management commands:**

| Command | Action |
|---|---|
| `topic: supply chain resilience` | Add topic to queue (standard length) |
| `topic: [topic] · 600 words` | Add topic with custom word count |
| `I want to write an article of 600 words on [topic]` | Natural-language add with length |
| `list topics` | Email back numbered list of queued topics |
| `remove topic 2` | Remove topic #2 from queue |
| `edit topic 3: new topic text` | Replace topic #3's text |
| `topic 2 first` | Move topic #2 to top of queue |

**Topic suggestion commands (after system sends weekly suggestions):**

| Command | Action |
|---|---|
| `add 1` | Queue suggested topic #1 |
| `add 2 3` | Queue suggestions #2 and #3 |
| `add all` | Queue all 3 suggestions |

**Comment commands:**

| Command | Action |
|---|---|
| `approve 1 3` | Approve comment replies 1 and 3 |
| `skip 2` | Skip comment reply 2 |
| `approve 1 3, skip 2` | Combined batch |

### 5. Comment Manager (`modules/comment_manager.py`)
- Polls LinkedIn every 2 hours for new comments on recent posts
- Claude drafts a contextual reply per comment (in Girish's voice)
- Sends a morning digest at 8:00am IST daily
- Girish replies with approval/skip commands
- Approved replies posted to LinkedIn via Comments API

### 6. Scout Engine (`modules/scout_engine.py`)
- Finds relevant LinkedIn posts in supply chain / logistics / procurement
- Claude drafts a thoughtful, expert comment for each
- Sends 2–3 opportunities per day for Girish to approve
- Approved comments posted via LinkedIn API

---

## User Workflow (Girish's View)

### Adding topics to the queue (any time)

```
Girish → Email:
"topic: How the 2025 Red Sea disruptions reshaped Indian import strategies"

Bot → "Added to your topic queue (position 1). Reply 'list topics' to see your full queue."
```

Or with a custom length:
```
Girish → Email:
"I want to write an article of 600 words on the Mauryan Empire's grain network"

Bot → "Added to your topic queue (position 2) — 600 words noted."
```

### Weekly topic suggestions (every Sunday 10am IST)

```
Bot → Email:
"Good morning Girish! Here are 3 topic ideas for your upcoming posts:

💡 1. How the 2025 Red Sea disruptions reshaped Indian import strategies
💡 2. Why procurement teams underestimate the last mile in B2B supply chains
💡 3. Lessons from the Mughal Empire's grain logistics for modern cold chains

Reply: add 1 · add 2 3 · add all — or ignore and add your own topic any time."
```

### Monday / Thursday — Draft delivery (9:00am IST)

```
Bot → Email:
"Good morning Girish! Here are 3 drafts for today's post.
Topic: Supply chain resilience after the 2025 port strikes

1️⃣ [Data-led hook draft]

2️⃣ [Personal story hook draft]

3️⃣ [Provocative question hook draft]

Reply: 1 / 2 / 3 to post at 12pm · redo · 2 edit · 2 edit [instruction]"
```

**Straight approval:**
> Girish: `2` → Bot: "Scheduled for 12pm today ✅"

**Doesn't like any option:**
> Girish: `redo — make it more formal`
> Bot: 3 new drafts (formal tone)
> Girish: `1` → Bot: "Scheduled for 12pm ✅"

**Wants to write his own version:**
> Girish: `2 edit`
> Bot: "Send me your final version and I'll post it at 12pm."
> Girish: [sends his text] → Bot: "Scheduled ✅"

**AI refines a specific draft:**
> Girish: `2 edit make it shorter and end with a question`
> Bot: "Here's the updated version: [...] — reply OK to schedule"
> Girish: `ok` → Bot: "Scheduled for 12pm ✅"

### 12:00pm IST — Auto-publish

System publishes the approved draft. Girish gets:
> "Posted to LinkedIn ✅ [link]"

**If no approval received by 12pm:**
> "No post today — you didn't select a draft. Reply 1/2/3 to post now."

**If topic queue is empty at 9am:**
> "Your queue is empty — no drafts to generate. Reply: topic: [your topic] to add one."

### Comment digest (daily, 8am IST)

```
Bot → "Good morning Girish! 3 new comments:

1. Priya Sharma: 'Great point about vendor risk'
   Suggested reply: 'Thank you Priya! In my experience...'

2. Rajesh Kumar: 'What tools do you recommend?'
   Suggested reply: 'Good question Rajesh! I'd start with...'

Reply: approve 1 2, skip 3"
```

---

## Project Structure

```
Linkedin_Automation/
├── main.py                     # FastAPI app — routes + startup
├── config.py                   # All env vars, loaded from .env
├── requirements.txt
├── .env                        # Real secrets (never committed)
├── .env.example                # Template for onboarding
├── .gitignore
├── plan.md                     # This file
├── CLAUDE.md                   # Context for Claude Code sessions
│
├── database/
│   ├── __init__.py
│   ├── models.py               # SQLAlchemy ORM models (incl. topics table)
│   └── db.py                   # Engine, session factory, init_db()
│
├── modules/
│   ├── __init__.py
│   ├── style_profiler.py       # Analyze Girish's writing voice
│   ├── content_generator.py    # Generate + refine post drafts via Claude
│   ├── approval_router.py      # State machine: parse commands, manage sessions
│   ├── linkedin_publisher.py   # OAuth, post, comment via LinkedIn API
│   ├── comment_manager.py      # Poll comments, draft replies, send digest
│   └── scout_engine.py         # Find posts to comment on, draft comments
│
├── channels/
│   ├── __init__.py
│   └── email.py                # SendGrid webhook handler + sender
│
├── scheduler/
│   ├── __init__.py
│   └── jobs.py                 # APScheduler jobs (see schedule below)
│
└── data/                       # Runtime data (gitignored)
    ├── style_profile.json      # Girish's voice profile (generated once)
    └── linkedin.db             # SQLite database
```

---

## Scheduler Jobs

| Job | Schedule | Action |
|---|---|---|
| Draft generation | Mon + Thu, 9:00am IST | Pick next queued topic → generate 3 drafts → email Girish |
| Auto-publish | Mon + Thu, 12:00pm IST | Post approved draft; skip + notify if none |
| Comment polling | Every 2 hours | Fetch new comments on recent posts |
| Comment digest | Daily, 8:00am IST | Email digest of pending comment replies |
| Topic suggestions | Every Sunday, 10:00am IST | Email 3 AI-generated topic ideas |
| Low-queue alert | When queue ≤ 1 topic | Also send topic suggestions early |

---

## Database Schema

| Table | Purpose |
|---|---|
| `linkedin_tokens` | Encrypted OAuth access + refresh tokens |
| `topics` | Topic queue: text, length_guidance, status, order_index, source |
| `posts` | Post lifecycle: topic → drafts → approved text → published |
| `pending_approvals` | Conversation state per sender (email) |
| `comments` | Comments on Girish's posts + suggested replies |
| `scout_opportunities` | External posts scouted for Girish to comment on |

---

## LinkedIn API Setup (One-Time, Done by Sameer)

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/) → Create App
2. Add products: **Sign In with LinkedIn using OpenID Connect** + **Share on LinkedIn**
3. Request scopes: `openid`, `profile`, `email`, `w_member_social`, `r_member_social`
4. Set Redirect URL: `http://localhost:8000/auth/linkedin/callback`
5. Run `python main.py` → open `http://localhost:8000/auth/linkedin` in browser
6. Girish logs in and approves → tokens saved automatically
7. LinkedIn access tokens last **60 days**; refresh tokens last **1 year** (auto-refreshed)

---

## Cost Breakdown

| Service | Cost | Notes |
|---|---|---|
| Claude API (`claude-sonnet-4-6`) | ~₹170/month | AI drafts + refinements + comment replies + topic suggestions |
| SendGrid | ₹0 | Free up to 100 emails/day — well above Girish's usage |
| LinkedIn API | ₹0 | Official API, free |
| Oracle Cloud Always Free VM | ₹0 | 4 cores, 24GB RAM, always-on, no charges |
| **Total** | **~₹170/month** | |
