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
- Full pipeline from `New Lead` → `Research Completed` → `Contacted` → `Follow-Up Pending` → `Interested` → `Meeting Scheduled` → `Onboarded` / `Rejected`
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

## Getting Started

### Prerequisites
- Node.js 18+, Yarn 4
- PostgreSQL and Redis running locally (or via Docker)

### Setup

```bash
# 1. Start infrastructure
bash packages/twenty-utils/setup-dev-env.sh

# 2. Start the full dev environment
yarn start

# 3. Deploy the IDDA plugin into your workspace
cd packages/twenty-apps/internal/idda-crm
cp .env.example .env.local
# Fill TWENTY_API_KEY from Settings → APIs & Webhooks in the Twenty UI
yarn install
yarn twenty sync
```

### Running Tests

```bash
npx nx test twenty-front
npx nx test twenty-server
npx nx run twenty-server:test:integration:with-db-reset
```

---

## Roadmap

- [ ] Duplicate detection on lead creation (phone / email / clinic+city matching)
- [ ] LLM-backed AI summarizer (stub ready in `lead-summarizer.interface.ts`)
- [ ] WhatsApp / SMS outbound automation

---

## License

Private — IDDA Assurance internal tooling.
