# IDDA Assurance CRM

A customized lead and task management system built on top of [Twenty CRM](https://twenty.com) for IDDA Assurance's B2B outreach to dental and dermatology clinics.

---

## Overview

IDDA Assurance operates a subscription model targeting doctors and clinics in the dental and dermatology space. This CRM centralizes lead tracking, team assignment, follow-up scheduling, task automation, and AI-assisted insights — all within a single workspace.

It is built as a **Twenty Apps SDK plugin** (`packages/twenty-apps/internal/idda-crm/`) that installs into a self-hosted Twenty workspace without modifying Twenty's core.

---

## Tech Stack

| Layer | Technology |
|---|---|
| CRM Platform | [Twenty CRM](https://twenty.com) (self-hosted) |
| Backend | NestJS, TypeORM, PostgreSQL, Redis |
| Frontend | React 18, TypeScript, Jotai, Vite |
| Job Queue | BullMQ |
| Monorepo | Nx + Yarn 4 |
| Plugin System | Twenty Apps SDK (`twenty-sdk/define`) |

---

## Core Features

### Lead Management
- Central **Lead** object combining Doctor + Clinic information
- Full pipeline: `New Lead` → `Research Completed` → `Contacted` → `Follow-Up Pending` → `Interested` → `Meeting Scheduled` → `Onboarded` / `Rejected`
- Priority levels: Low, Medium, High, Urgent
- Lead source tracking: Cold Call, Referral, Instagram, and more
- Specialization segmentation: Dentist, Dermatologist, etc.

### Team & Ownership
- Leads assigned to workspace members
- Role-based access: Manager and Employee roles
- Views filtered by assignee, priority, and stage

### Task Engine
- `crmTask` object tracks follow-up calls, demos, and check-ins
- Automated task creation triggered by lead stage transitions

### Follow-Up Reminders
- Daily cron at **08:00 IST** scans leads with overdue `nextFollowUpAt`
- Automatically creates a `FOLLOW_UP_CALL` task and logs a `FOLLOW_UP_DUE` activity

### Lead Activity Timeline
- `LeadActivity` object records every interaction
- Fields: channel (call/email/WhatsApp), direction (inbound/outbound), duration, sentiment, AI summary, attachments

### Lead Scoring Engine
- Computes a numeric `leadScore` per lead
- Assigns a `scoreBand` (Hot / Warm / Cold / Dormant)
- Stores a human-readable `scoreExplanation`

### AI Infrastructure
- Fields on Lead: `aiLeadSummary`, `aiNextAction`, `aiConfidence`, `aiTags`
- Enrichment hooks and recommendation hooks wired up
- `lead-summarizer.interface.ts` is the stub for LLM integration

### Import System
- Adapters for CSV, Apollo, Google Maps, and Instagram
- Normalizer → Validator → Enricher → Retry Queue pipeline
- Tracks import metadata: `importBatchId`, `enrichmentSource`, `dataConfidenceScore`, `scrapedAt`

### Analytics & KPIs
- `kpi-calculator.ts` and `metrics.ts` compute conversion rates, activity volume, stage velocity, and team productivity

### Bulk Operations
- `scripts/bulk-operations.ts` for mass reassignment, stage updates, and data backfills

---

## Data Model

### Lead Object (key fields)

| Field | Type | Description |
|---|---|---|
| `doctorName` | FULL_NAME | Primary contact |
| `clinicName` | TEXT | Practice name |
| `phones` / `emails` | PHONES / EMAILS | Contact details |
| `city`, `state` | TEXT | Location |
| `specialization` | SELECT | Dentist, Dermatologist, etc. |
| `stage` | SELECT | Pipeline stage |
| `priority` | SELECT | Low / Medium / High / Urgent |
| `leadSource` | SELECT | How the lead was sourced |
| `assignedTo` | RELATION | WorkspaceMember |
| `lastContactedAt` | DATE_TIME | Last interaction timestamp |
| `nextFollowUpAt` | DATE_TIME | Scheduled follow-up |
| `leadScore` | NUMBER | Computed score |
| `scoreBand` | SELECT | Hot / Warm / Cold / Dormant |

---

## Project Structure

```
packages/
├── twenty-front/                    # React frontend (Twenty core)
├── twenty-server/                   # NestJS backend (Twenty core)
├── twenty-ui/                       # Shared UI components
├── twenty-shared/                   # Common types and utilities
└── twenty-apps/
    └── internal/
        └── idda-crm/                # IDDA plugin (all customizations live here)
            ├── objects/             # Lead, LeadActivity, crmTask definitions
            ├── views/               # Pipeline, all-leads, segment views
            ├── logic-functions/     # Task automation, lead scoring, follow-up cron
            ├── scripts/             # Bulk operations, ingest-leads
            ├── import/              # CSV/Apollo/GoogleMaps/Instagram adapters
            ├── ai/                  # Enrichment hooks, prompt templates, summarizer stub
            ├── analytics/           # KPI calculator and metrics
            └── constants/           # Universal identifiers (UUIDs)
```

---

## Complete Setup Guide

Follow these steps **in order**. Every command is copy-pasteable — no guesswork needed.

---

### Step 1 — Install Prerequisites

You need **Node.js 24**, **Yarn 4**, and **Docker Desktop** on your machine.

**Install Node.js 24** (using nvm — recommended):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
```bash
source ~/.bashrc   # or source ~/.zshrc on Mac
```
```bash
nvm install 24 && nvm use 24
```

**Enable Yarn 4:**
```bash
corepack enable && corepack prepare yarn@stable --activate
```

**Verify everything is installed:**
```bash
node --version    # should show v24.x.x
yarn --version    # should show 4.x.x
docker --version  # should show Docker version x.x.x
```

Install Docker Desktop if `docker --version` fails: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

Then open Docker Desktop and make sure it is **running** before continuing.

---

### Step 2 — Clone the Repository

```bash
git clone https://github.com/vaishnav1906/CRM.git
```
```bash
cd CRM
```

---

### Step 3 — Install Dependencies

```bash
yarn install
```

This will take a few minutes the first time.

---

### Step 4 — Start PostgreSQL and Redis via Docker

Make sure Docker Desktop is open and running, then:

```bash
docker compose -f packages/twenty-docker/docker-compose.dev.yml up -d
```

This starts:
- **PostgreSQL 16** on port `5432`
- **Redis 7** on port `6379`

Verify both are healthy:
```bash
docker compose -f packages/twenty-docker/docker-compose.dev.yml ps
```

Both services should show `healthy` under the Status column. Wait a few seconds and re-run if they show `starting`.

---

### Step 5 — Set Up Environment Files

```bash
bash packages/twenty-utils/setup-dev-env.sh --docker
```

This copies `.env.example → .env` for both the frontend and backend. Safe to re-run any time.

---

### Step 6 — Initialize the Database

```bash
npx nx run twenty-server:database:init:prod
```

This runs all migrations and seeds the initial workspace data.

---

### Step 7 — Start the Application

```bash
yarn start
```

This starts all three services:
- **Frontend** → [http://localhost:3001](http://localhost:3001)
- **Backend API** → [http://localhost:3000](http://localhost:3000)
- **Background worker** → handles jobs, automations, and cron tasks

Wait until all three services print their ready messages, then open [http://localhost:3001](http://localhost:3001) in your browser.

---

### Step 8 — Log In

1. Open [http://localhost:3001](http://localhost:3001)
2. Click **"Continue with Email"**
3. The email and password fields are pre-filled — just click **Sign In**

---

### Step 9 — Get Your API Key

1. In the top-left, click your workspace name → **Settings**
2. Go to **APIs & Webhooks**
3. Click **Generate API Key**, give it a name (e.g. `idda-plugin`), and copy the key

---

### Step 10 — Deploy the IDDA CRM Plugin

Open a **new terminal tab** (keep `yarn start` running in the first one), then:

```bash
cd packages/twenty-apps/internal/idda-crm
```
```bash
cp .env.example .env.local
```

Open `.env.local` in any text editor and paste your API key on the last line:
```
TWENTY_API_URL=http://localhost:2020
TWENTY_API_KEY=your_api_key_here
```

Then install and deploy:
```bash
yarn install
```
```bash
yarn twenty sync
```

---

### Done!

Refresh [http://localhost:3001](http://localhost:3001) in your browser.

You will now see the full IDDA CRM with:
- **Leads** pipeline and all-leads table
- **Task management** panel
- **Team views** filtered by assignee and priority
- **Lead scoring** and segment views
- **Follow-up reminders** running on schedule

---

## Exposing the CRM Over the Internet with ngrok

By default the CRM only runs on `localhost`. If you want to access it from another device, share it with a teammate, or receive webhooks from external services, use **ngrok** to create a public HTTPS tunnel.

---

### Step 1 — Install ngrok

**Mac:**
```bash
brew install ngrok/ngrok/ngrok
```

**Windows / Linux:** Download the binary from [https://ngrok.com/download](https://ngrok.com/download) and add it to your PATH.

---

### Step 2 — Create a free ngrok account and add your auth token

1. Sign up at [https://dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup)
2. After logging in, go to **Your Authtoken** in the dashboard and copy it
3. Run:

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

---

### Step 3 — Start tunnels for both frontend and backend

ngrok needs to tunnel two ports: **3001** (frontend) and **3000** (backend). The easiest way is to use an ngrok config file.

Create the config file:
```bash
mkdir -p ~/.config/ngrok
```
```bash
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

Start both tunnels in one command (open a **new terminal tab** for this):
```bash
ngrok start --all
```

You will see output like this:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3001   (frontend)
Forwarding  https://xyz789.ngrok-free.app -> http://localhost:3000   (backend)
```

Copy both HTTPS URLs — you'll need them in the next step.

---

### Step 4 — Update the environment files with your ngrok URLs

Open `packages/twenty-server/.env` in a text editor and update these two lines (replace with your actual URLs from the previous step):

```
FRONTEND_URL=https://abc123.ngrok-free.app
SERVER_URL=https://xyz789.ngrok-free.app
```

---

### Step 5 — Allow your ngrok domain in the frontend config

Open `packages/twenty-front/vite.config.ts` and add your ngrok frontend domain to the `allowedHosts` array:

```ts
allowedHosts: [
  '*/*',
  'localhost',
  '127.0.0.1',
  'abc123.ngrok-free.app',   // add your frontend ngrok domain here
],
```

---

### Step 6 — Restart the app

```bash
yarn start
```

The CRM is now accessible at your frontend ngrok URL (e.g. `https://abc123.ngrok-free.app`) from any device or browser.

> **Note:** Free ngrok URLs change every time you restart ngrok. If you restart ngrok, repeat Steps 3–6 with the new URLs. To get a stable permanent URL, upgrade to a paid ngrok plan and reserve a static domain.

---

## Stopping and Restarting

**Stop the app** — press `Ctrl+C` in the terminal running `yarn start`

**Stop Docker services:**
```bash
docker compose -f packages/twenty-docker/docker-compose.dev.yml down
```

**Start again next time** (Steps 4 and 7 only):
```bash
docker compose -f packages/twenty-docker/docker-compose.dev.yml up -d
yarn start
```

**Wipe everything and start completely fresh:**
```bash
docker compose -f packages/twenty-docker/docker-compose.dev.yml down -v
bash packages/twenty-utils/setup-dev-env.sh --docker
npx nx run twenty-server:database:init:prod
yarn start
```

---

## Roadmap

- [ ] Duplicate detection on lead creation (phone / email / clinic+city matching)
- [ ] LLM-backed AI summarizer (stub ready in `lead-summarizer.interface.ts`)
- [ ] WhatsApp / SMS outbound automation

---

## License

Private — IDDA Assurance internal tooling.
