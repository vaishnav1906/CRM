<div align="center">

# IDDA Assurance CRM

### Full-Stack CRM for Insurance Sales Operations

*A self-hosted CRM built on Twenty for IDDA Assurance's B2B outreach to dental and dermatology clinics — with lead pipeline management, automated follow-ups, task scheduling, lead scoring, and AI-ready enrichment infrastructure.*

---

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)

</div>

---

## What It Does

IDDA Assurance targets doctors and clinics in the dental and dermatology space through direct B2B outreach. This CRM centralises every stage of that process — from lead sourcing to onboarding — in a single self-hosted workspace.

Built as a plugin on top of [Twenty CRM](https://twenty.com), it gives the sales team:

1. A structured lead pipeline across 8 stages from first contact to onboarding
2. Automated task creation triggered by stage transitions
3. Daily follow-up reminders at 08:00 IST for overdue leads
4. A scoring engine that classifies every lead as Hot, Warm, Cold, or Dormant
5. Full activity timeline per lead — calls, WhatsApp, emails, with AI summary fields ready for integration
6. Role-based views filtered by assignee, priority, and segment

---

## Lead Pipeline

| Stage | Description |
|-------|-------------|
| **New Lead** | Just entered the system |
| **Research Completed** | Background info gathered, contact verified |
| **Contacted** | First outreach made |
| **Follow-Up Pending** | Awaiting response, reminder scheduled |
| **Interested** | Lead has expressed intent |
| **Meeting Scheduled** | Demo or in-person meeting booked |
| **Onboarded** | Converted — active subscriber |
| **Rejected** | Disqualified or declined |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   React 18 Frontend (port 3001)                 │
│                                                                 │
│  Lead Pipeline ──► Task Panel ──► Team Views ──► Analytics      │
│                (Jotai state, Apollo cache, Vite + Linaria)       │
└───────────────────────────┬─────────────────────────────────────┘
                            │  GraphQL (Apollo)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  NestJS Backend API (port 3000)                 │
│                                                                 │
│  GraphQL Yoga ──► Resolvers ──► TypeORM ──► PostgreSQL          │
│  BullMQ Worker ──► Job Queue ──► Cron (08:00 IST)              │
│  Redis ──► Sessions + Cache + Queue backing                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
     ┌──────────────────┐    ┌──────────────────────┐
     │  PostgreSQL 16   │    │     Redis 7           │
     │  (core + meta +  │    │  (sessions, cache,    │
     │  workspace data) │    │   BullMQ queues)      │
     └──────────────────┘    └──────────────────────┘
```

The IDDA CRM plugin (`packages/twenty-apps/internal/idda-crm/`) installs on top of Twenty's core without modifying it. All custom objects, views, logic functions, and automations are isolated inside the plugin.

---

## Plugin Structure

```
packages/twenty-apps/internal/idda-crm/
├── objects/             # Lead, LeadActivity, crmTask object definitions
├── views/               # Pipeline, all-leads, team, and segment views
├── logic-functions/     # Task automation, lead scoring, follow-up cron
├── scripts/             # Bulk reassignment, stage updates, data backfills
├── import/              # CSV, Apollo, Google Maps, Instagram adapters
├── ai/                  # Enrichment hooks, prompt templates, summarizer stub
├── analytics/           # KPI calculator and metrics
└── constants/           # Universal identifiers (UUIDs)
```

---

## Core Features

### Lead Management

- Unified **Lead** object combining doctor + clinic information
- Priority levels: Low, Medium, High, Urgent
- Lead source tracking: Cold Call, Referral, Instagram, and more
- Specialization segmentation: Dentist, Dermatologist, etc.

### Task Engine

- `crmTask` object tracks follow-up calls, demos, and check-ins
- Automated task creation on stage transitions
- Tasks linked to leads with assignee, due date, and type

### Follow-Up Reminders

- Daily cron at **08:00 IST** scans all leads with overdue `nextFollowUpAt`
- Automatically creates a `FOLLOW_UP_CALL` task and logs a `FOLLOW_UP_DUE` activity
- No manual intervention needed

### Lead Scoring Engine

| Band | Meaning |
|------|---------|
| **Hot** | High score — priority outreach |
| **Warm** | Active but not yet committed |
| **Cold** | Low engagement |
| **Dormant** | No activity for extended period |

Stores `leadScore` (numeric), `scoreBand`, and a human-readable `scoreExplanation` per lead.

### Activity Timeline

Full interaction history per lead with fields for: channel (call / email / WhatsApp), direction (inbound / outbound), duration, sentiment, AI summary, and attachments.

### AI Infrastructure

Fields ready on every lead for LLM integration: `aiLeadSummary`, `aiNextAction`, `aiConfidence`, `aiTags`. Enrichment hooks and a summarizer interface stub are wired up — plug in any LLM provider to activate.

### Import System

Multi-source ingestion pipeline with adapters for CSV, Apollo, Google Maps, and Instagram. Routes every record through: Normalizer → Validator → Enricher → Retry Queue. Tracks `importBatchId`, `enrichmentSource`, `dataConfidenceScore`, and `scrapedAt`.

---

## Tech Stack

### Frontend

| Component | Technology | Notes |
|-----------|-----------|-------|
| Framework | React 18 | Functional components only |
| Language | TypeScript 5 | Strict mode, no `any` |
| State | Jotai | Atoms for global state, atom families for collections |
| Styling | Linaria | Zero-runtime CSS-in-JS |
| Data | Apollo Client | GraphQL cache |
| Build | Vite | HMR configured for ngrok tunneling |

### Backend

| Component | Technology | Notes |
|-----------|-----------|-------|
| Framework | NestJS | Module-based feature organization |
| API | GraphQL Yoga | Code-first schema |
| ORM | TypeORM | PostgreSQL via entities |
| Queue | BullMQ | Background jobs and cron tasks |
| Cache | Redis 7 | Sessions, caching, queue backing |
| Database | PostgreSQL 16 | Multi-tenant schema (core, metadata, workspace) |

---

## Local Setup

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 24 or higher |
| Yarn | 4 (via Corepack) |
| Docker Desktop | Latest — must be running |

**Install Node.js 24** (via nvm):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc   # or ~/.zshrc on Mac
nvm install 24 && nvm use 24
```

**Enable Yarn 4:**
```bash
corepack enable && corepack prepare yarn@stable --activate
```

**Windows users:** Use **Git Bash** for all commands below.

---

### 1. Clone and install

```bash
git clone https://github.com/IDDAssurance/idda-tools.git
cd idda-tools/IDDA-CRM
yarn install
```

---

### 2. Start PostgreSQL and Redis

```bash
docker compose -f packages/twenty-docker/docker-compose.dev.yml up -d
docker compose -f packages/twenty-docker/docker-compose.dev.yml ps
```

Wait until both services show `healthy`. Re-run `ps` after a few seconds if they show `starting`.

---

### 3. Set up environment files

```bash
bash packages/twenty-utils/setup-dev-env.sh --docker
```

Copies `.env.example → .env` for both frontend and backend. Safe to re-run.

---

### 4. Initialize the database

```bash
npx nx run twenty-server:database:init:prod
```

Runs all migrations and seeds the initial workspace.

---

### 5. Start the application

```bash
yarn start
```

Starts all three services:

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:3001` |
| Backend API | `http://localhost:3000` |
| Background worker | (background process) |

Wait until all three print their ready messages, then open `http://localhost:3001`.

---

### 6. Log in

1. Open `http://localhost:3001`
2. Click **Continue with Email**
3. The credentials are pre-filled — click **Sign In**

---

### Next time (already set up)

```bash
docker compose -f packages/twenty-docker/docker-compose.dev.yml up -d
yarn start
```

---

## Exposing via ngrok

Use ngrok to access the CRM from another device, share with a teammate, or receive webhooks.

### 1. Install ngrok

**Mac:**
```bash
brew install ngrok/ngrok/ngrok
```

**Windows / Linux:** Download from [ngrok.com/download](https://ngrok.com/download) and add to PATH.

---

### 2. Add your authtoken

Get your token from [dashboard.ngrok.com](https://dashboard.ngrok.com), then:

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

---

### 3. Create the ngrok config

```bash
mkdir -p ~/.config/ngrok
cat > ~/.config/ngrok/ngrok.yml << 'EOF'
version: "3"
tunnels:
  frontend:
    proto: http
    addr: 3001
  backend:
    proto: http
    addr: 3000
EOF
```

---

### 4. Start tunnels

Open a new terminal tab (keep `yarn start` running in the other):

```bash
ngrok start --all
```

You'll see:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3001   (frontend)
Forwarding  https://xyz789.ngrok-free.app -> http://localhost:3000   (backend)
```

---

### 5. Update environment files

In `packages/twenty-server/.env`:
```
FRONTEND_URL=https://abc123.ngrok-free.app
SERVER_URL=https://xyz789.ngrok-free.app
```

In `packages/twenty-front/vite.config.ts`, add your frontend ngrok domain to `allowedHosts`:
```ts
allowedHosts: [
  '*/*',
  'localhost',
  '127.0.0.1',
  'abc123.ngrok-free.app',
],
```

Restart `yarn start`. The CRM is now live at your ngrok frontend URL.

> Free ngrok URLs change on every restart. To get a stable URL, upgrade to a paid plan and reserve a static domain.

---

## Environment Variables

### `packages/twenty-server/.env`

| Variable | Description |
|----------|-------------|
| `FRONTEND_URL` | Frontend origin. `http://localhost:3001` locally; your ngrok/production URL when tunneling. |
| `SERVER_URL` | Backend origin. `http://localhost:3000` locally; your ngrok/production URL when tunneling. |
| `PG_DATABASE_URL` | PostgreSQL connection string. Auto-set by `setup-dev-env.sh`. |
| `REDIS_URL` | Redis connection string. Auto-set by `setup-dev-env.sh`. |

### `packages/twenty-front/.env`

| Variable | Description |
|----------|-------------|
| `VITE_SERVER_BASE_URL` | Backend URL the browser connects to. Must match `SERVER_URL`. |

---

## Troubleshooting

**HMR disconnects when using ngrok**

The Vite dev server is configured with `hmr.host: localhost` and `hmr.clientPort: 3001`. If hot reload stops working through the tunnel, verify these settings are present in `packages/twenty-front/vite.config.ts`:

```ts
hmr: {
  host: 'localhost',
  clientPort: 3001,
},
```

**`403 Disallowed Host` error when accessing via ngrok**

Your ngrok domain is not in the `allowedHosts` array in `vite.config.ts`. Add it and restart `yarn start`.

**Database init fails on first run**

Ensure Docker services are `healthy` before running `database:init:prod`. Run:
```bash
docker compose -f packages/twenty-docker/docker-compose.dev.yml ps
```

**Worker not processing tasks**

The worker process (third service started by `yarn start`) requires Redis. Check that Redis is healthy in Docker and that `REDIS_URL` is set in `packages/twenty-server/.env`.

**Fresh start — wipe everything**

```bash
docker compose -f packages/twenty-docker/docker-compose.dev.yml down -v
bash packages/twenty-utils/setup-dev-env.sh --docker
npx nx run twenty-server:database:init:prod
yarn start
```

---

## Data Model — Lead Object

| Field | Type | Description |
|-------|------|-------------|
| `doctorName` | FULL_NAME | Primary contact |
| `clinicName` | TEXT | Practice name |
| `phones` / `emails` | PHONES / EMAILS | Contact details |
| `city`, `state` | TEXT | Location |
| `specialization` | SELECT | Dentist, Dermatologist, etc. |
| `stage` | SELECT | Pipeline stage |
| `priority` | SELECT | Low / Medium / High / Urgent |
| `leadSource` | SELECT | Cold Call, Referral, Instagram, etc. |
| `assignedTo` | RELATION | WorkspaceMember |
| `lastContactedAt` | DATE_TIME | Last interaction |
| `nextFollowUpAt` | DATE_TIME | Scheduled follow-up |
| `leadScore` | NUMBER | Computed score |
| `scoreBand` | SELECT | Hot / Warm / Cold / Dormant |
| `aiLeadSummary` | TEXT | LLM-generated summary (stub ready) |
| `aiNextAction` | TEXT | Recommended next step |
| `aiConfidence` | NUMBER | AI confidence score |
| `aiTags` | TEXT | AI-generated tags |

---

## Roadmap

- [ ] Duplicate detection on lead creation (phone / email / clinic+city matching)
- [ ] LLM-backed AI summarizer (stub ready in `lead-summarizer.interface.ts`)
- [ ] WhatsApp / SMS outbound automation
- [ ] Direct sync from MedLeads → IDDA CRM (push enriched leads straight into pipeline)
- [ ] Analytics dashboard — conversion rates, stage velocity, team productivity

---

<div align="center">

Part of the **IDDA Tools** internal tooling ecosystem

</div>
