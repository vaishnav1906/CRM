# IDDA Assurance CRM — Operational Testing Playbook

**Version:** Phase 16  
**Audience:** QA operators, team leads, implementation managers  
**Goal:** Verify the CRM can support a real healthcare lead generation team in production today

---

## HOW TO READ THIS DOCUMENT

Each section has a **Severity** column for failures:

| Level | Meaning |
|-------|---------|
| P0 | Blocks production launch — fix before go-live |
| P1 | Significant operational pain — fix within one week |
| P2 | UX friction or edge case — fix before scale |
| P3 | Nice-to-have improvement |

**PASS criteria** are marked ✅ and **FAIL criteria** are marked ❌.

---

## PART 1 — ENVIRONMENT SETUP

### 1.1 Required Services

```
PostgreSQL 15+          — primary database
Redis 7+                — Twenty session store and job queue
Node.js 20+             — Twenty server and frontend build
Yarn 4                  — monorepo package manager
```

Verify all services are healthy before any testing:

```bash
# From repo root
bash packages/twenty-utils/setup-dev-env.sh

# Start all services
yarn start

# Verify frontend responds
curl -s http://localhost:3001 | grep -c "<title>" # expect: 1

# Verify API responds
curl -s http://localhost:3000/healthz | grep -c "ok" # expect: 1
```

**Environment checklist:**

| Check | Command | Expected |
|-------|---------|----------|
| Postgres up | `pg_isready -h localhost -p 5432` | `accepting connections` |
| Redis up | `redis-cli ping` | `PONG` |
| Frontend running | GET `http://localhost:3001` | HTTP 200 |
| API running | GET `http://localhost:3000/healthz` | `{ "status": "ok" }` |
| IDDA app installed | Settings → Apps | `IDDA Assurance CRM` visible |

### 1.2 Required Environment Variables

```bash
# packages/twenty-apps/internal/idda-crm/.env.local
TWENTY_API_KEY=<from Settings → APIs & Webhooks>
TWENTY_API_URL=http://localhost:3000
```

For ingestion scripts:
```bash
TWENTY_API_URL=http://localhost:3000
TWENTY_API_KEY=your_key_here
```

### 1.3 Test Accounts — Create These Before Testing

Create five workspace member accounts. Record their workspace member IDs — you will need them for import scripts.

| Email | Role | Name | Simulates |
|-------|------|------|-----------|
| `manager@idda.test` | Manager | Priya Sharma | Team lead, daily oversight |
| `research1@idda.test` | Research Agent | Amit Verma | Clinic data gathering |
| `calling1@idda.test` | Calling Agent | Rohit Patel | Outbound calls |
| `sales1@idda.test` | Sales Agent | Sneha Joshi | Meetings, closes |
| `employee1@idda.test` | Employee | Karan Singh | General field agent |

### 1.4 Fake Healthcare Dataset — Seed Data

Save this as `test-data/batch-clean.json` before running import tests:

```json
[
  {
    "externalId": "test_001",
    "doctorFirstName": "Anita",
    "doctorLastName": "Kulkarni",
    "clinicName": "Kulkarni Dental Clinic",
    "phone": "+919876543210",
    "email": "anita@kulkarnidental.com",
    "city": "Pune",
    "state": "Maharashtra",
    "specialization": "DENTIST",
    "website": "https://kulkarnidental.com",
    "instagram": "https://instagram.com/kulkarnidental",
    "leadSource": "SCRAPER",
    "scrapedAt": "2026-05-28T08:00:00Z"
  },
  {
    "externalId": "test_002",
    "doctorFirstName": "Rahul",
    "doctorLastName": "Mehta",
    "clinicName": "Mehta Skin & Laser Centre",
    "phone": "+918765432109",
    "email": "rahul@mehtaskin.in",
    "city": "Mumbai",
    "state": "Maharashtra",
    "specialization": "DERMATOLOGIST",
    "website": "https://mehtaskin.in",
    "leadSource": "SCRAPER",
    "scrapedAt": "2026-05-28T08:00:00Z"
  },
  {
    "externalId": "test_003",
    "doctorFirstName": "Deepa",
    "doctorLastName": "Nair",
    "clinicName": "Nair Eye Hospital",
    "phone": "+917654321098",
    "email": "deepa@naireyehospital.com",
    "city": "Delhi",
    "state": "Delhi",
    "specialization": "OPHTHALMOLOGIST",
    "leadSource": "COLD_CALL",
    "scrapedAt": "2026-05-28T08:00:00Z"
  },
  {
    "externalId": "test_004",
    "doctorFirstName": "Suresh",
    "doctorLastName": "Iyer",
    "clinicName": "Iyer Children's Clinic",
    "phone": "+916543210987",
    "email": "suresh@iyerkids.com",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "specialization": "PEDIATRICIAN",
    "leadSource": "REFERRAL"
  },
  {
    "externalId": "test_005",
    "doctorFirstName": "Meera",
    "doctorLastName": "Singh",
    "clinicName": "Singh Orthopaedic Centre",
    "phone": "+915432109876",
    "email": "meera@singhortho.com",
    "city": "Bengaluru",
    "state": "Karnataka",
    "specialization": "ORTHOPEDIC",
    "website": "https://singhortho.com",
    "leadSource": "INSTAGRAM",
    "instagram": "https://instagram.com/singhortho"
  }
]
```

Also prepare these failure-case files:

**`test-data/batch-duplicates.json`** — identical `externalId` and phone as `test_001` and `test_002`

**`test-data/batch-malformed.json`:**
```json
[
  { "doctorFirstName": "NoPhone", "clinicName": "Ghost Clinic", "city": "Unknown" },
  { "externalId": "bad_002", "phone": "not-a-number", "clinicName": "Bad Phone Clinic" },
  { "externalId": "bad_003", "doctorFirstName": "", "clinicName": "", "city": "" },
  { "externalId": "bad_004", "phone": "+919999999999", "email": "not-an-email", "clinicName": "Bad Email Clinic" },
  { "externalId": "bad_005", "specialization": "WIZARD", "clinicName": "Invalid Spec Clinic", "phone": "+918888888888" }
]
```

### 1.5 Browser Setup

- **Primary browser:** Chrome (latest) — all smoke tests run here
- **Secondary:** Firefox — verify filter panel, kanban drag
- Open DevTools → Network tab before loading views with many leads to measure load time
- Set viewport to 1440×900 for desktop testing, then 375×812 for mobile check
- Disable browser extensions that inject content (password managers can conflict with form fields)

---

## PART 2 — ROLE-BASED TESTING

### 2.1 Research Agent (`research1@idda.test`)

**Simulated scenario:** Amit has a list of 10 dental clinics from Google Maps. He needs to create leads, fill in all research data, and push them to "Research Completed."

**Screens to use:**
- Leads → All Leads (table view)
- Leads → Research Queue
- Individual lead detail panel

#### Test Steps

**Step R-01: Create a lead manually**
1. Log in as `research1@idda.test`
2. Navigate to Leads → All Leads
3. Click + New Lead
4. Fill in: `doctorFirstName=Vijay`, `doctorLastName=Bhat`, `clinicName=Bhat Dental`, `city=Hyderabad`, `state=Telangana`, `specialization=DENTIST`, `phone=+919000000001`, `email=vijay@bhatdental.com`, `leadSource=SCRAPER`
5. Set `enrichmentStatus=ENRICHED`, `dataConfidenceScore=75`
6. Save

**Expected:** Lead appears in All Leads table with stage `NEW_LEAD`, score band recalculates (should be COLD initially). ✅  
**Fail indicator:** Lead does not appear, or score calculator fires on creation and errors in server logs. ❌ P0

**Step R-02: Attempt to update call fields (permission boundary)**
1. Open the Vijay Bhat lead
2. Attempt to edit `callStatus` field
3. Attempt to edit `meetingDate` field
4. Attempt to edit `assignedToId` field

**Expected:** Fields are read-only or the save is rejected. Research Agents cannot update these fields per role definition. ✅  
**Fail indicator:** Research Agent can update call/meeting/assignment fields. ❌ P0 (RBAC violation)

**Step R-03: Push lead to Research Completed**
1. Update `stage` from `NEW_LEAD` to `RESEARCH_COMPLETED`
2. Check activity timeline on the lead

**Expected:** `STAGE_CHANGED` activity entry appears: "Stage changed: New Lead → Research Completed". `lead-activity-logger` fired. ✅  
**Fail indicator:** No activity log entry. ❌ P1

**Step R-04: Research Queue view**
1. Navigate to Segments → Research Queue
2. Verify Vijay Bhat does NOT appear (stage is now RESEARCH_COMPLETED, should be filtered out)

**Expected:** Research Queue shows only leads still in `NEW_LEAD`. ✅

**Edge cases to test:**
- Save a lead with no phone AND no email (confidence score should auto-adjust down)
- Enter an Instagram URL — verify LINKS field stores it
- Set `importBatchId` manually — verify it saves
- Attempt to delete a lead — ❌ should be blocked (Research Agents have no `canSoftDeleteObjectRecords`)

#### Research Agent Bug Watch List
| Symptom | Likely Cause | Severity |
|---------|-------------|---------|
| callStatus field is editable | fieldPermissions not applied | P0 |
| Activity log missing on stage change | lead-activity-logger not registered | P1 |
| Lead score does not change on enrichmentStatus update | SCORE_TRIGGER_FIELDS missing enrichmentStatus | P1 |
| Research Queue shows already-completed leads | View filter wrong | P2 |

---

### 2.2 Calling Agent (`calling1@idda.test`)

**Simulated scenario:** Rohit's morning queue has 15 leads in `READY_FOR_CALLING`. He calls each, updates status, and books meetings for interested leads.

**Screens to use:**
- Operations → Today's Follow-Ups
- Operations → Calling Queue (Sales Queue view)
- Individual lead record

#### Test Steps

**Step C-01: Verify calling queue**
1. Log in as `calling1@idda.test`
2. Navigate to Operations → Calling Queue
3. Verify only leads with `assignedTeam=CALLING` or `stage=READY_FOR_CALLING` appear

**Step C-02: Log a call attempt — No Answer**
1. Open a lead in `READY_FOR_CALLING`
2. Set `callStatus=NO_ANSWER`
3. Set `lastCallDate=now`
4. Save

**Expected:**
- Activity entry `CALL_ATTEMPTED` appears on timeline
- A `FOLLOW_UP_CALL` task is automatically created by `task-automation` with priority HIGH and dueDate=tomorrow ✅
- Lead score recalculates (no positive signal, likely stays COLD) ✅

**Fail indicator:** No task created after NO_ANSWER callStatus. ❌ P1

**Step C-03: Log a positive call**
1. Set `callStatus=CALLED`, `callOutcome=POSITIVE`
2. Set `interestLevel=WARM`
3. Set `nextFollowUpAt` to tomorrow at 10:00 AM
4. Add `followUpNotes`: "Doctor interested in dental subscription. Wants to know pricing for 10-seat plan. Callback tomorrow."
5. Push `stage` to `CONTACT_ATTEMPTED`
6. Save

**Expected:**
- Activity entries: `CALL_OUTCOME_UPDATED`, `INTEREST_LEVEL_UPDATED`, `FOLLOW_UP_SCHEDULED`, `NOTE_ADDED`, `STAGE_CHANGED` — all five should appear ✅
- Score band upgrades: callOutcome=POSITIVE (+15), interestLevel=WARM (+8) → should move from COLD toward WARM ✅

**Step C-04: Schedule a meeting**
1. Set `meetingDate` to 3 days from now
2. Set `meetingMode=VIDEO_CALL`
3. Push `stage` to `MEETING_SCHEDULED`

**Expected:**
- `task-automation` creates a "Prepare for meeting" task with `dueDate=meetingDate` and `reminderAt=1 hour before meeting` ✅
- Activity entry `MEETING_SCHEDULED` appears ✅
- Score jumps significantly (+20 meeting, +10 meeting stage) — should breach 80 → HOT band ✅

**Step C-05: Permission boundary — cannot update meetingOutcome**
1. After setting meeting, attempt to update `meetingOutcome`

**Expected:** Field blocked. Only Sales Agents and Managers can write `meetingOutcome`. ✅  
**Fail:** ❌ P0 — Calling Agent closing deals they haven't run.

**Edge cases:**
- Set `callStatus=WRONG_NUMBER` — verify lead is not automatically rejected (no automation should touch stage)
- Set `callStatus=BUSY` — verify FOLLOW_UP_CALL task created (same as NO_ANSWER path)
- Attempt to update `importBatchId` — must be blocked ❌ P0
- Delete any lead — must be blocked ❌ P0

#### Calling Agent Automation Chain Check

```
callStatus=NO_ANSWER  →  task-automation  →  task FOLLOW_UP_CALL (tomorrow)
callStatus=BUSY       →  task-automation  →  task FOLLOW_UP_CALL (tomorrow)
callOutcome=FOLLOW_UP →  task-automation  →  task SEND_WHATSAPP (tomorrow)
meetingDate set       →  task-automation  →  task PREPARE_FOR_MEETING (1h before)
stage=MEETING_COMPLETED → task-automation →  task SEND_PROPOSAL (2d deadline, 1d reminder)
```

Run each path. Verify exactly one task per trigger — not duplicates.

---

### 2.3 Sales Agent (`sales1@idda.test`)

**Simulated scenario:** Sneha's pipeline has 5 leads in `MEETING_SCHEDULED`. She runs the meetings, updates outcomes, handles negotiation, and closes.

**Screens to use:**
- Segments → Interested Leads
- Score → Hot Leads
- Operations → Meetings This Week
- Operations → Meetings Today
- Individual lead records

#### Test Steps

**Step S-01: Pre-meeting review**
1. Open Operations → Meetings Today
2. Verify the lead from Step C-04 appears
3. Open the lead — verify "Prepare for meeting" task exists and is TODO

**Step S-02: Post-meeting — mark outcome**
1. Set `meetingOutcome=PROPOSAL_SENT`
2. Set `stage=MEETING_COMPLETED`
3. Set `conversionProbability=60`
4. Set `interestLevel=HOT`
5. Add `objections`: "Price concern — wants monthly billing. Legal team needs to review contract."
6. Set `expectedClosureDate` to 7 days from now

**Expected:**
- `task-automation` creates "Send proposal / contract" task (URGENT, 2-day deadline) ✅
- Score recomputes: meetingDate(+20) + interestLevel HOT(+15) + conversionProbability 60(+6) + MEETING_COMPLETED stage... should be HOT band ✅
- All field changes logged as activities ✅

**Step S-03: Negotiation stage**
1. Push `stage=NEGOTIATION`
2. Update `conversionProbability=80`
3. Set `budgetRange=RANGE_10K_25K`
4. Update `followUpNotes`: "Agreed on 12-seat plan at Rs 18k/month. Contract being drafted."

**Expected:** Stage change logged, score climbs further (+12 NEGOTIATION stage). ✅

**Step S-04: Close — Won**
1. Push `stage=ONBOARDED`
2. Set `meetingOutcome=CLOSED_WON`
3. Set `conversionProbability=100`

**Expected:**
- Lead disappears from active pipeline views (Hot Leads, Research Queue, Calling Queue) ✅
- Lead remains visible in All Leads table ✅
- Score: +10 onboarded; lead is now ONBOARDED — REJECTED penalty does NOT fire ✅

**Step S-05: Close — Lost**
1. Create a separate test lead, push to NEGOTIATION
2. Set `stage=REJECTED`, `meetingOutcome=CLOSED_LOST`
3. Set `callOutcome=NOT_INTERESTED`

**Expected:**
- Score tanks: -30 rejected, -10 not interested call → drops to COLD or near zero ✅
- Lead appears in Segments → Rejected Leads view ✅
- Cron follow-up reminder will NOT fire for this lead (REJECTED is excluded) ✅

**Permission boundary checks for Sales Agent:**
- Can edit `meetingOutcome` ✅ (Sales-only field)
- Cannot edit `importBatchId`, `enrichmentSource`, `dataConfidenceScore`, `scrapedAt` ❌ if editable → P0

---

### 2.4 Manager (`manager@idda.test`)

**Simulated scenario:** Priya's Monday morning review — 30 leads in pipeline, needs to identify stale leads, reassign two agents, and spot blocked deals.

**Screens to use:**
- All Leads (table + kanban)
- Leads Pipeline (kanban)
- Score → Hot Leads, Warm Pipeline, Cold/At-Risk
- Operations → All operation views
- Segments → All segment views

#### Test Steps

**Step M-01: Pipeline review**
1. Open Leads → Pipeline (kanban)
2. Verify each stage column shows correct leads
3. Drag a lead from `RESEARCH_COMPLETED` to `READY_FOR_CALLING`

**Expected:** Stage updates, activity log fires `STAGE_CHANGED`. ✅  
**Fail:** Drag-and-drop does not update the stage value. ❌ P1

**Step M-02: Stale lead detection**
1. Navigate to Score → Cold / At-Risk
2. Leads with `scoreBand=COLD` sorted by score ASC should appear
3. Pick one with `lastContactedAt` > 14 days ago

**Expected:** Lead score shows `-20 inactive >14d` in `scoreExplanation` field. ✅

**Step M-03: Reassign a lead**
1. Open a stale lead
2. Change `assignedToId` to `calling1@idda.test`'s workspace member ID
3. Change `assignedTeam` to `CALLING`

**Expected:**
- `ASSIGNED_TO_CHANGED` activity logged ✅
- `TEAM_CHANGED` activity logged ✅
- Score recalculates (+5 assigned) ✅

**Step M-04: Bulk assign unassigned leads**
```bash
cd packages/twenty-apps/internal/idda-crm
npx ts-node scripts/bulk-operations.ts \
  --op assign \
  --filter assignedToId="" \
  --value <calling1_workspace_member_id>
```

**Expected:** All unassigned leads get assigned, each gets a `BULK_ACTION` LeadActivity entry. ✅  
**Fail:** Script errors, or activities not logged. ❌ P1

**Manager-specific permission checks:**
- Can soft-delete leads (Manager has `canSoftDeleteObjectRecords: true` on leads) ✅
- Cannot HARD destroy leads (`canDestroyObjectRecords: false`) ✅
- Cannot update global settings (`canUpdateAllSettings: false`) ✅

---

## PART 3 — IMPORT PIPELINE TESTING

### 3.1 Clean Import

```bash
cd packages/twenty-apps/internal/idda-crm
TWENTY_API_KEY=<key> npx ts-node scripts/ingest-leads.ts \
  --file ../../test-data/batch-clean.json \
  --source GoogleMaps \
  --confidence 80
```

**Validation checklist:**

| Check | Expected | Pass/Fail |
|-------|----------|-----------|
| 5 leads created | Exactly 5 new records in All Leads | |
| All stages set | Each lead stage=NEW_LEAD | |
| enrichmentStatus | All set to PENDING or ENRICHED | |
| importedAt | Timestamp populated on all 5 | |
| importBatchId | Same batch UUID on all 5 | |
| dataConfidenceScore | ~80 (passed via --confidence flag) | |
| LEAD_CREATED activity | 5 activities in LeadActivity | |
| Score calculated | Each lead has leadScore, scoreBand set | |
| Specialization inferred | kulkarnidental.com → DENTIST via enrichment hook | |

### 3.2 Duplicate Import

Run the clean import a second time with the same file. The ingest script should detect duplicates by `externalId`, phone, and email.

**Expected:**
- 0 new leads created ✅
- Script outputs duplicate detection report ✅
- No `LEAD_CREATED` activities for existing leads ✅

**Fail indicators:**
- 5 duplicate leads created → ❌ P0 (data corruption, ingest script dedup logic broken)
- Existing leads overwritten silently → ❌ P0

### 3.3 Malformed Row Import

```bash
TWENTY_API_KEY=<key> npx ts-node scripts/ingest-leads.ts \
  --file ../../test-data/batch-malformed.json \
  --source GoogleMaps \
  --confidence 50 \
  --dry-run
```

First run with `--dry-run` to see what would happen. Then without:

**Expected per row:**

| Row | Issue | Expected Behavior |
|-----|-------|-------------------|
| bad_001 | No phone, no email | Created with low confidence score, enrichmentStatus=PENDING |
| bad_002 | Invalid phone `not-a-number` | Enrichment hook normalizePhone fails, phoneValid=false, confidence penalized -15 |
| bad_003 | All empty strings | Validator should reject or create with minimal data, no crash |
| bad_004 | Invalid email format | emailValid=false in enrichment, confidence penalized |
| bad_005 | Invalid specialization `WIZARD` | normalizer falls back to null or OTHER |

**Critical:** The import must NOT crash mid-batch if one row is invalid. Remaining valid rows should process. ❌ P0 if any valid row is skipped due to earlier row failure.

### 3.4 Large Import Test

Generate 1,000 test leads:

```bash
# Quick generator (paste in Node REPL or a temp script)
const rows = Array.from({ length: 1000 }, (_, i) => ({
  externalId: `perf_${String(i).padStart(4,'0')}`,
  doctorFirstName: `Doctor${i}`,
  doctorLastName: `Test`,
  clinicName: `Test Clinic ${i}`,
  phone: `+9190${String(i).padStart(8,'0')}`,
  city: ['Mumbai','Delhi','Pune','Chennai','Bengaluru'][i % 5],
  state: ['Maharashtra','Delhi','Maharashtra','Tamil Nadu','Karnataka'][i % 5],
  specialization: ['DENTIST','DERMATOLOGIST','OPHTHALMOLOGIST','PEDIATRICIAN','ORTHOPEDIC'][i % 5],
  leadSource: 'SCRAPER',
}));
require('fs').writeFileSync('test-data/batch-1000.json', JSON.stringify(rows, null, 2));
```

Then run:
```bash
TWENTY_API_KEY=<key> npx ts-node scripts/ingest-leads.ts \
  --file ../../test-data/batch-1000.json \
  --source GoogleMaps \
  --confidence 60
```

**Measure:**
- Total ingestion time (expect < 5 minutes for 1,000 leads via HTTP batch)
- Memory usage during ingest (watch for heap growth)
- DB row count post-import: `SELECT COUNT(*) FROM workspace_<id>."lead"`
- Any errors in server logs

**Pass threshold:** < 5 min, 0 crashes, all 1,000 leads visible in All Leads table.

### 3.5 Retry Queue Test

1. Start an import with `TWENTY_API_URL` pointing to a stopped server
2. Verify the retry-queue module logs failures
3. Restart the server, re-run the ingest
4. Verify leads eventually land (no phantom duplicates from retries)

---

## PART 4 — CRM WORKFLOW TESTING

This simulates a complete IDDA sales lifecycle from first contact to close. Use `calling1` and `sales1` accounts.

### Stage Map

```
NEW_LEAD
  └─ [Research Agent enriches] ──→ RESEARCH_COMPLETED
       └─ [Manager assigns team] ──→ READY_FOR_CALLING
            └─ [Calling Agent calls] ──→ CONTACT_ATTEMPTED
                 ├─ [No answer/busy] ──→ FOLLOW_UP_PENDING
                 └─ [Positive call] ──→ INTERESTED
                      └─ [Meeting booked] ──→ MEETING_SCHEDULED
                           └─ [Meeting done] ──→ MEETING_COMPLETED
                                └─ [Negotiation] ──→ NEGOTIATION
                                     ├─ [Deal won] ──→ ONBOARDED
                                     └─ [Deal lost] ──→ REJECTED
```

### 4.1 Per-Stage Test Matrix

**Stage: NEW_LEAD**

| Action | Field Updated | Automation Expected | Activity Expected |
|--------|--------------|--------------------|--------------------|
| Lead created via import | All ingestion fields | lead-created-logger fires | LEAD_CREATED |
| Lead created manually | doctorName, clinicName | lead-created-logger fires | LEAD_CREATED |
| Score calculated | leadScore, scoreBand | lead-score-calculator fires | — |

Expected score range for a fresh lead with phone+email but no engagement: 18–27 (COLD band).

**Stage: RESEARCH_COMPLETED → READY_FOR_CALLING**

| Action | Field Updated | Automation Expected | Activity Expected |
|--------|--------------|--------------------|--------------------|
| Research Agent sets stage | stage | activity-logger | STAGE_CHANGED |
| Manager assigns agent | assignedToId, assignedTeam | activity-logger | ASSIGNED_TO_CHANGED, TEAM_CHANGED |
| Score recalculates | leadScore | score-calculator | — |

Score should improve: +5 assigned agent. New range: 23–32 (still COLD, not enough engagement).

**Stage: CONTACT_ATTEMPTED**

| callStatus value | Task Created | Task Type | Priority |
|-----------------|-------------|-----------|----------|
| NO_ANSWER | ✅ Yes | FOLLOW_UP_CALL | HIGH |
| BUSY | ✅ Yes | FOLLOW_UP_CALL | HIGH |
| WRONG_NUMBER | ❌ No | — | — |
| CALLED | ❌ No | — | — |
| CALL_BACK | ❌ No | — | — |

| callOutcome value | Task Created | Task Type |
|------------------|-------------|-----------|
| FOLLOW_UP | ✅ Yes | SEND_WHATSAPP |
| POSITIVE | ❌ No | — |
| NOT_INTERESTED | ❌ No | — |
| NEUTRAL | ❌ No | — |

**Stage: MEETING_SCHEDULED**

| Action | Expected Task | Due Date | Reminder |
|--------|--------------|---------|---------|
| meetingDate set | "Prepare for meeting" | meetingDate | 1 hour before |

Score impact: +20 meeting scheduled, +10 MEETING_SCHEDULED stage → total boost of 30 points.  
A previously COLD lead with phone+email+assigned: ~57 → WARM band. ✅

**Stage: MEETING_COMPLETED**

| Action | Expected Task | Priority | Due | Reminder |
|--------|--------------|---------|-----|---------|
| stage→MEETING_COMPLETED | "Send proposal / contract" | URGENT | +2 days | +1 day |

**Stage: NEGOTIATION → ONBOARDED**

| Check | Expected |
|-------|---------|
| Lead disappears from active pipeline | ✅ |
| Lead stays in All Leads | ✅ |
| score recalculates (+10 ONBOARDED) | ✅ |
| No follow-up tasks created | ✅ — cron excludes ONBOARDED |
| No cron reminder fires | ✅ — `EXCLUDED_STAGES` includes `ONBOARDED` |

**Stage: REJECTED**

| Check | Expected |
|-------|---------|
| score drops to near 0 (-30 stage, -10 callOutcome if NOT_INTERESTED) | ✅ |
| scoreBand = COLD | ✅ |
| Lead appears in Rejected Leads view | ✅ |
| Cron excludes lead | ✅ — `EXCLUDED_STAGES` includes `REJECTED` |
| No automation tasks fire | ✅ |

---

## PART 5 — AUTOMATION TESTING

### 5.1 lead-created-logger

**Trigger:** `lead.created` event  
**Expected:** One `LEAD_CREATED` LeadActivity per new lead

**Test:**
1. Create a lead via UI → verify 1 activity
2. Create via import script → verify 1 activity per lead, NOT 2 (no duplicate fire)
3. Update an existing lead → verify `lead-created-logger` does NOT fire

**Bug watch:** If the logger fires on `lead.updated` as well → ❌ P1 (duplicate activities, polluted timeline)

### 5.2 lead-activity-logger

**Trigger:** `lead.updated` on watched fields  
**Watched fields:** `stage`, `assignedToId`, `assignedTeam`, `priority`, `callStatus`, `callOutcome`, `meetingDate`, `interestLevel`, `nextFollowUpAt`, `followUpNotes`, `objections`, `conversionProbability`

**Test matrix:**

| Field Changed | Event Type Expected | Verify |
|--------------|--------------------|----|
| stage | STAGE_CHANGED | "Stage changed: X → Y" with human labels |
| assignedToId | ASSIGNED_TO_CHANGED | Entry created |
| callStatus | CALL_ATTEMPTED | "Call status updated: none → NO_ANSWER" |
| callOutcome | CALL_OUTCOME_UPDATED | "Call outcome: POSITIVE" |
| meetingDate | MEETING_SCHEDULED | "Meeting scheduled for [date]" |
| interestLevel | INTEREST_LEVEL_UPDATED | "Interest level: none → HOT" |
| followUpNotes (>80 chars) | NOTE_ADDED | Note truncated to 80 chars + "…" |
| conversionProbability | INTEREST_LEVEL_UPDATED | "Conversion probability: 0% → 60%" |

**Multi-field update test:**
1. In one save, update `stage`, `callOutcome`, and `interestLevel` simultaneously
2. Expected: 3 separate activity entries, all with the same `occurredAt` timestamp ✅

**Ignored fields test:**
1. Update `clinicName` only — no LeadActivity should be created
2. Update `leadScore` only — no LeadActivity (score fields not in WATCHED_FIELDS) ✅ (prevents infinite loop)

### 5.3 lead-score-calculator

**Trigger:** `lead.updated` on SCORE_TRIGGER_FIELDS  
**Score fields NOT in trigger:** `leadScore`, `scoreBand`, `scoreExplanation` — critical for loop prevention

**Scoring validation table:**

| Setup | Expected Score | Expected Band |
|-------|---------------|---------------|
| No data, no engagement | 0–5 | COLD |
| Phone + email only | 18 | COLD |
| Phone + email + assigned | 23 | COLD |
| + callOutcome=POSITIVE | 38 | COLD |
| + interestLevel=WARM | 46 | COLD |
| + meetingDate set | 66 | WARM |
| + interestLevel=HOT | 81 | HOT |
| All above + enriched + HIGH priority | 99 | HOT |
| HOT lead not contacted >14 days | -20 penalty applied | May drop band |

**Loop prevention test (P0 check):**
1. Update `stage` on a lead
2. Watch server logs — `lead-score-calculator` should fire **once**, update `leadScore`
3. That `leadScore` update should NOT re-trigger `lead-score-calculator`
4. Total invocations: exactly 1 ✅

**Fail:** Multiple cascading fires, server logs show repeated score calculation → ❌ P0

### 5.4 task-automation

**Trigger:** `lead.updated` on `callStatus`, `callOutcome`, `meetingDate`, `stage`

**Deduplication concern:** If a lead's `callStatus` is set to `NO_ANSWER` twice in a row (agent forgets it was already set), a second FOLLOW_UP_CALL task should ideally not be created. Test:

1. Set `callStatus=NO_ANSWER` → 1 task created
2. Save again with no change (re-save same value) — task automation fires again only if field value changed
3. Set `callStatus=CALLED` → `callStatus=NO_ANSWER` — task automation fires on the NO_ANSWER change → 2nd task

**Verdict:** Two tasks WILL be created if the agent changes status back to NO_ANSWER. This is a known limitation — not a bug, but operators should be aware. Log as P3 improvement (dedup by checking existing open tasks).

### 5.5 follow-up-reminder (cron)

**Trigger:** Cron `30 2 * * *` (02:30 UTC = 08:00 IST daily)

**Test setup:**
1. Create 3 leads with `nextFollowUpAt` set to yesterday
2. Set one to `stage=REJECTED`, one to `stage=ONBOARDED`, one to `stage=INTERESTED`
3. Wait for cron to fire, OR manually invoke the logic function via the Twenty admin panel

**Expected:**
- INTERESTED lead: 1 task created (FOLLOW_UP_CALL, HIGH priority) ✅
- REJECTED lead: no task ✅ (excluded stage)
- ONBOARDED lead: no task ✅ (excluded stage)

**Idempotency concern:**
If the cron runs but the follow-up date is not updated after task creation, the same task will be re-created tomorrow. Test:
1. Let cron fire on an overdue lead
2. Do NOT update `nextFollowUpAt`
3. Check if cron fires again next day — if so, a second task is created

**Current behavior:** The cron creates a task and logs an activity but does NOT automatically update `nextFollowUpAt`. The agent must manually reschedule. If they don't, the cron will fire again tomorrow.  
**Severity:** P2 — agents must be trained to always update `nextFollowUpAt` after a reminder is generated.

**Workaround until fixed:** Include in agent training: "After receiving a reminder task, always set a new nextFollowUpAt."

---

## PART 6 — VIEW AND UX TESTING

### 6.1 Navigation Structure Validation

```
Leads
  ├── Pipeline (kanban, grouped by stage)
  └── All Leads (table)
  └── Lead Activities

Segments
  ├── Mumbai Dentists
  ├── Delhi Dermatologists
  ├── Interested Leads
  ├── Pending Follow-Ups
  ├── Hot Leads
  ├── Research Queue
  ├── Sales Queue
  └── Meetings This Week

Operations
  ├── Today's Follow-Ups
  ├── Meetings Today
  ├── High Priority
  ├── Rejected Leads
  ├── Unassigned Leads
  └── Recently Imported

Score
  ├── Hot Leads (Score)
  ├── Warm Pipeline
  └── Cold / At-Risk

Tasks
  ├── Task Board
  ├── My Tasks
  └── Overdue Tasks
```

Verify every nav item loads without error. Record load time for each.

**UX check — "Good" signals:**
- Kanban board shows doctor name + clinic name on card ✅
- Score band (HOT/WARM/COLD) visible on cards ✅
- Next follow-up date visible in table ✅
- Assigned agent name visible in table ✅

**UX check — "Poor" signals:**
- Cards show only UUID or blank name → ❌ P1 (labelIdentifier misconfigured)
- Kanban stage columns are out of order → ❌ P2
- Operations views return 0 results even with qualifying leads → ❌ P1 (filter issue)

### 6.2 Kanban Usability

1. Load Pipeline with 20+ leads across stages
2. Drag a card from `CONTACT_ATTEMPTED` to `INTERESTED`
3. Verify stage update persists on page refresh
4. Verify activity log fires for the drag operation

**Measuring "usable" kanban:**
- Each stage column shows count badge ✅
- Cards are scannable in < 2 seconds (doctor name, clinic, score band, assigned agent) ✅
- Stage columns scroll independently if > 15 cards ✅

### 6.3 Filter Responsiveness

With 200+ leads loaded:
1. Filter by `state=Maharashtra` — measure time to results
2. Filter by `scoreBand=HOT` — measure
3. Filter by `assignedToId=calling1` AND `stage=FOLLOW_UP_PENDING` — compound filter
4. Sort by `leadScore DESC`

**Pass threshold:** < 1 second for all filters on 200 records in development environment.

### 6.4 Mobile Responsiveness Check

Resize viewport to 375×812 (iPhone 14):
1. Can you read lead names in table view?
2. Does the kanban board scroll horizontally?
3. Can you open a lead record and edit fields?
4. Are action buttons tappable (≥44px tap target)?

Twenty CRM is desktop-primary — mobile is for review, not data entry.  
**Accept:** Read-only browsing works on mobile ✅  
**Flag as P2:** Core data entry broken on mobile

---

## PART 7 — PERFORMANCE TESTING

### 7.1 Load Scenarios

**Scenario A: 100 leads (day 1 of operations)**

```bash
# Generate and import 100 leads
# Expected all views: < 500ms load
# Expected kanban: < 1 second render
# Expected filter: < 300ms
```

**Scenario B: 1,000 leads (month 1)**

Use the `batch-1000.json` file from Section 3.4.

| Metric | Target | Acceptable | Investigate If |
|--------|--------|------------|----------------|
| All Leads table load | < 1s | < 2s | > 3s |
| Pipeline kanban load | < 2s | < 4s | > 6s |
| Filter operation | < 500ms | < 1s | > 2s |
| Lead score recalc | < 5s | < 10s | > 15s |
| Import 1000 leads | < 5min | < 10min | > 15min |

**Scenario C: 10,000 leads (month 6)**

This is the critical stress test. With 10,000 leads:

1. Can the table view paginate correctly?
2. Does the kanban board cap display (e.g., first 50 per stage)?
3. Do GraphQL queries time out?
4. Does the cron function complete within `timeoutSeconds=120`? (500 leads per run, multiple runs needed for 10k)

**Expected bottlenecks:**

| Component | Bottleneck | Impact |
|-----------|-----------|--------|
| Cron follow-up reminder | Hardcoded `first: 500` | Will miss leads beyond 500 overdue | P1 |
| KPI calculator | `first: 10000` query | Slow at scale, may OOM | P2 |
| Pipeline kanban | All leads loaded | Pagination needed | P2 |
| Activity timeline | Unbounded query | Long timelines slow to render | P2 |

**Scaling concern — follow-up cron:** The `follow-up-reminder.logic-function.ts` uses `first: 500`. If more than 500 leads have overdue follow-ups (possible at scale), the excess are silently skipped. Solution: paginate using `after` cursor. Log as P1 for post-launch fix.

### 7.2 Automation Latency

Measure time from lead field update to automation firing:

```
lead.updated event fired
  ↓ (event propagation)
lead-activity-logger executes
  ↓ (API call)
LeadActivity record created
```

Target: < 5 seconds end-to-end.

Test: Set `stage=INTERESTED`, immediately open activity timeline. Refresh after 5 seconds. Activity should appear.

---

## PART 8 — SECURITY AND RBAC TESTING

### 8.1 Cross-Role Boundary Tests

Run these checks with each role account. All ❌ results are P0 issues.

| Operation | Research Agent | Calling Agent | Sales Agent | Manager |
|-----------|---------------|---------------|-------------|---------|
| Read any lead | ✅ | ✅ | ✅ | ✅ |
| Create lead | ✅ | ❌ block | ✅ | ✅ |
| Update callStatus | ❌ block | ✅ | ✅ | ✅ |
| Update meetingDate | ❌ block | ✅ | ✅ | ✅ |
| Update meetingOutcome | ❌ block | ❌ block | ✅ | ✅ |
| Update importBatchId | ✅ | ❌ block | ❌ block | ✅ |
| Update conversionProbability | ❌ block | ✅ | ✅ | ✅ |
| Update assignedToId | ❌ block | ✅ | ✅ | ✅ |
| Soft-delete lead | ❌ block | ❌ block | ❌ block | ✅ |
| Destroy lead | ❌ block | ❌ block | ❌ block | ❌ block |
| Run bulk operations | N/A (script-level) | N/A | N/A | ✅ |

### 8.2 API-Level RBAC Test

Permission enforcement must apply at API level, not just UI level. Test with curl:

```bash
# As calling agent — try to update importBatchId via GraphQL directly
curl -X POST http://localhost:3000/api \
  -H "Authorization: Bearer <calling_agent_api_key>" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { updateLead(id: \"<lead_id>\", data: { importBatchId: \"hacked\" }) { id } }"}'
```

**Expected:** `{ "errors": [{ "message": "Permission denied" }] }` ✅  
**Fail:** Field silently ignores the update ❌ P1, or update succeeds ❌ P0

### 8.3 Bulk Operation Authorization

The `scripts/bulk-operations.ts` script uses a raw API key. Verify:
1. Using a Research Agent API key, attempt a bulk `--op assign` → server should reject the reassignment (assignedToId is field-restricted for Research Agents)
2. Using a Manager API key → operation should succeed

### 8.4 Audit Trail Completeness

For a go-live audit readiness check:

| Auditable Event | Logged In | Accessible By |
|----------------|-----------|--------------|
| Lead created | LeadActivity (LEAD_CREATED) | Manager ✅ |
| Stage change | LeadActivity (STAGE_CHANGED) | Manager ✅ |
| Agent assignment | LeadActivity (ASSIGNED_TO_CHANGED) | Manager ✅ |
| Call attempted | LeadActivity (CALL_ATTEMPTED) | Manager ✅ |
| Meeting scheduled | LeadActivity (MEETING_SCHEDULED) | Manager ✅ |
| Bulk operation | LeadActivity (BULK_ACTION) | Manager ✅ |
| Follow-up reminder | LeadActivity (FOLLOW_UP_DUE) | Manager ✅ |

**Gap:** Soft-deletes are not logged as LeadActivities. If a lead is deleted, there is no audit trail entry. **P1** — Managers should add a note before deleting.

---

## PART 9 — MANAGER DAILY WORKFLOW SIMULATION

This simulates a real Monday morning for `manager@idda.test`.

### Morning Review (30 minutes)

**09:00 — Pipeline Health Check**
1. Open Score → Hot Leads — how many HOT leads? All should have an assigned Sales Agent.
2. Open Score → Cold / At-Risk — any leads with `lastContactedAt` > 14 days? These need reassignment or follow-up.
3. Open Operations → Overdue Tasks — any tasks overdue by > 2 days? Agent may be blocked.

**09:10 — Overnight Cron Check**
1. Open Lead Activities feed (Lead Activities nav item)
2. Filter by `eventType=FOLLOW_UP_DUE`
3. How many reminders fired overnight? Each should have a corresponding open task.
4. If a reminder fired but no task exists — automation failure ❌ P1

**09:20 — Unassigned Lead Sweep**
1. Navigate to Operations → Unassigned Leads
2. Any leads here? If yes, assign via UI or bulk script
3. Target: zero unassigned leads in active stages

**09:30 — Team Queue Balance**
1. Open Calling Queue — count leads per agent using filter `assignedToId=each_agent`
2. If one agent has >30 open leads in READY_FOR_CALLING, redistribute via bulk assign script
3. Sales Queue — check Sales Agents are not holding >10 leads in NEGOTIATION

**Key manager KPIs to verify in the CRM:**

| KPI | How to Check | Target |
|-----|-------------|--------|
| New leads this week | KPI script or All Leads filter by createdAt | >20/week healthy |
| HOT leads with no meeting | Hot Leads view, filter meetingDate=null | Should be 0 |
| Average lead score | Run kpi-calculator.ts, check avgLeadScore | >40 means quality pipeline |
| Overdue tasks | Tasks → Overdue Tasks | Should be 0 before noon |
| Uncontacted leads >7 days | All Leads, filter lastContactedAt < 7 days ago | Flag for intervention |

---

## PART 10 — FAILURE TESTING

**IMPORTANT:** Run these on a test workspace, never on production data.

### 10.1 Invalid Import Data

```bash
# Empty file
echo "[]" > test-data/empty.json
TWENTY_API_KEY=<key> npx ts-node scripts/ingest-leads.ts --file ../../test-data/empty.json --source CSV
# Expected: "0 leads processed, 0 errors" — no crash
```

```bash
# Not JSON
echo "this is not json" > test-data/broken.json
TWENTY_API_KEY=<key> npx ts-node scripts/ingest-leads.ts --file ../../test-data/broken.json --source CSV
# Expected: JSON parse error printed, process exits with non-zero code — no crash loop
```

### 10.2 Missing API Key

```bash
TWENTY_API_KEY="" npx ts-node scripts/ingest-leads.ts --file ../../test-data/batch-clean.json --source CSV
# Expected: Immediate error "TWENTY_API_KEY is required" — no partial import
```

### 10.3 Duplicate Task Stress Test

1. Set a lead's `callStatus` from `CALLED` → `NO_ANSWER` 5 times rapidly (toggle via API)
2. Count tasks created

**Expected:** Up to 5 tasks (one per NO_ANSWER transition). This is the known limitation from Section 5.4.  
**Fail:** > 5 tasks, or server error on rapid updates ❌ P1

### 10.4 Malformed Phone Numbers

Test these phone values via UI and import:

| Phone Input | Expected Behavior |
|-------------|------------------|
| `9876543210` | Enrichment hook adds +91 → `+919876543210` ✅ |
| `09876543210` | Stripped to 10 digits, +91 added ✅ |
| `+1 555 123 4567` | Not Indian — phoneValid=false, confidence -15 |
| `abc123` | phoneValid=false |
| `(022) 2654-7890` | Landline — not a valid mobile (must start 6–9) |
| `+919999999999` | Valid format, passes |

### 10.5 Cron Overlap

Twenty's cron scheduler should prevent overlapping executions. Test:
1. Set `nextFollowUpAt` to yesterday for 600 leads (above the 500 limit)
2. When cron fires, it will process 500 — verify the 600th lead was NOT processed
3. Confirm no "double process" on the first 500

**This is a known P1 bug:** leads beyond 500 in a single cron run are silently skipped. Document and plan paginated cron for Phase 17.

### 10.6 Giant Note Fields

1. Paste 5,000 characters into `followUpNotes`
2. Save and reload
3. Verify the note saves correctly (TEXT field has no length limit in Twenty)
4. Verify the activity logger truncates to 80 chars in the preview ✅

### 10.7 Null/Missing Fields

1. Create a lead with only `clinicName` set — no phone, no email, no doctor name
2. Verify lead is created (all fields are `isNullable: true`)
3. Verify score calculator returns `score=0, band=COLD` gracefully (no NullPointerException)
4. Verify cron creates a task for this lead if `nextFollowUpAt` is overdue

### 10.8 Invalid Dates

1. Attempt to set `nextFollowUpAt` to a past date
2. Attempt to set `expectedClosureDate` to yesterday
3. Attempt to set `meetingDate` to 5 years from now

**Expected:** All save successfully (no server-side date validation beyond format). Future date validation is a UX concern, not a crash concern.

---

## PART 11 — AI-READINESS TESTING

The CRM has AI infrastructure in place (`aiLeadSummary`, `aiNextAction`, `aiConfidence`, `aiTags`). This section evaluates whether the data is good enough for LLM integration.

### 11.1 Notes Structure Quality

Review 20 leads that have been through a full lifecycle. For each, check:

| Quality Signal | Good | Needs Work |
|---------------|------|-----------|
| followUpNotes contains sentences | "Doctor wants monthly billing, 12 seats" ✅ | "called" ❌ |
| objections is specific | "Price too high, competitor offers Rs 5k less" ✅ | "no" ❌ |
| callOutcome matches notes | callOutcome=POSITIVE + positive note ✅ | callOutcome=POSITIVE + "not interested" ❌ |
| meetingDate set when stage=MEETING_SCHEDULED | Yes ✅ | No ❌ |
| Activity timeline has ≥3 entries for leads in NEGOTIATION | Yes ✅ | 1 entry ❌ |

**Score:** If > 70% of leads meet all criteria → data is AI-ready.  
**If < 50%:** Agent training required before enabling AI summarization.

### 11.2 Activity History Depth

Query: how many LeadActivity entries exist per lead in INTERESTED stage or beyond?

- 1–2 entries: insufficient for AI context
- 3–5 entries: minimal viable
- 6+ entries: good AI training signal

### 11.3 Enrichment Data Quality

Run the KPI script (`scripts/analytics/kpi-calculator.ts`) and check:
- What % of leads have `enrichmentStatus=ENRICHED`?
- What is the average `dataConfidenceScore`?
- How many leads have both phone AND email populated?

**AI-ready threshold:**
- ≥ 60% leads enriched
- avg confidence score ≥ 65
- ≥ 70% leads have phone

### 11.4 AI Field Population Test

Test the `aiLeadSummary` and `aiNextAction` fields with a dummy update:

1. Manually populate `aiLeadSummary` on 3 leads: "Dental clinic, 8 seats, HOT interest, meeting done, proposal pending"
2. Populate `aiNextAction` on same leads: "Send pricing proposal by EOD Friday"
3. Verify fields save and display in lead detail panel
4. Verify fields do NOT trigger activity logger (not in WATCHED_FIELDS) ✅

**This confirms the AI field plumbing is correct** — LLM integration is wiring the model's output into these fields.

### 11.5 AI Recommendation Engine Smoke Test

The `recommendation-hooks.ts` provides rule-based recommendations. Test manually by invoking it against real lead states:

```typescript
import { getRecommendation } from './src/ai-services/recommendation-hooks';

// Overdue follow-up
getRecommendation({
  stage: 'INTERESTED',
  interestLevel: 'WARM',
  callOutcome: 'FOLLOW_UP',
  lastContactedAt: new Date(Date.now() - 20 * 86400000).toISOString(), // 20 days ago
  meetingDate: null,
  nextFollowUpAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days overdue
  leadScore: 45,
  enrichmentStatus: 'ENRICHED',
  assignedToId: 'some-id',
});
// Expected: { action: 'Call now — follow-up is overdue', urgency: 'high', taskType: 'FOLLOW_UP_CALL' }
```

Verify the priority ordering is logical for your team's workflow. If "Re-engage with WhatsApp" ranks higher than "Overdue follow-up call," the priority rules need tuning.

---

## PART 12 — FINAL GO-LIVE CHECKLIST

### 12.1 Operational Readiness

| Check | Owner | Status |
|-------|-------|--------|
| All 5 roles created and assigned to users | Manager | |
| IDDA app deployed via `yarn twenty sync` | DevOps | |
| Test workspace seeded with real pilot data (20 leads) | Research Agent | |
| All team members completed a 30-min CRM walkthrough | Manager | |
| Cron schedule confirmed (08:00 IST = 02:30 UTC) | DevOps | |
| API keys rotated from dev to production values | DevOps | |
| `.env.local` set with production TWENTY_API_KEY | DevOps | |
| Playwright E2E tests passing in CI | DevOps | |

### 12.2 Data Quality Gates

Before importing your full lead database:

| Gate | Minimum Threshold | Action if Fails |
|------|------------------|----------------|
| % leads with valid phone | ≥ 70% | Run enrichment pass first |
| % leads with email | ≥ 50% | Acceptable, mark as PENDING |
| % leads with specialization | ≥ 80% | Normalizer should infer from clinic name |
| Duplicate rate in import | ≤ 5% | Review source data |
| Avg confidence score | ≥ 60 | Additional manual verification needed |

### 12.3 Automation Reliability

Run each of these and verify ✅ before launch:

- [ ] Create a lead → LEAD_CREATED activity appears within 10 seconds
- [ ] Update `stage` → STAGE_CHANGED activity appears within 10 seconds
- [ ] Set `callStatus=NO_ANSWER` → FOLLOW_UP_CALL task created within 15 seconds
- [ ] Set `meetingDate` → PREPARE_FOR_MEETING task created within 15 seconds
- [ ] Set `stage=MEETING_COMPLETED` → SEND_PROPOSAL task created within 15 seconds
- [ ] Update `stage` → leadScore recalculates within 15 seconds
- [ ] Overdue `nextFollowUpAt` → cron creates task at 08:00 IST next day
- [ ] Import 100 leads → all visible in All Leads within 5 minutes

### 12.4 Must-Fix Before Launch (P0)

| ID | Issue | Fix Required |
|----|-------|-------------|
| SEC-01 | RBAC API-level enforcement for field permissions not verified | Run Section 8.2 tests; fix if blocked by UI only |
| AUT-01 | Score calculator infinite loop risk | Verify `SCORE_TRIGGER_FIELDS` excludes score fields (already done) |
| IMP-01 | Import crashes on partial-invalid batch | Test Section 3.3 — batch continues after invalid row |
| PERM-01 | Research Agent can edit callStatus | Section 2.1 R-02 must pass |

### 12.5 Fix Before First Month (P1)

| ID | Issue | Fix |
|----|-------|-----|
| CRON-01 | Follow-up cron silently drops leads beyond 500 | Paginate using cursor |
| AUD-01 | Soft-deletes not in audit log | Add pre-delete hook that writes LEAD_DELETED activity |
| TASK-01 | Duplicate tasks on repeated callStatus toggle | Check for existing open task before creating |
| UX-01 | No validation on future-dating meetingDate in the past | Add frontend warning |

### 12.6 Scaling Concerns (P2 — Address at 5,000 leads)

| Concern | Trigger Point | Solution |
|---------|--------------|---------|
| KPI calculator queries all leads | > 5k leads | Add date range filter, paginate |
| Kanban loads all records per stage | > 100 per stage | Implement virtual scrolling / pagination |
| Activity timeline renders all events | > 200 activities per lead | Paginate timeline |
| Cron 500-lead cap | > 500 overdue leads | Paginate cron with cursor |
| GraphQL N+1 in bulk operations | > 200 leads bulk update | Batch mutations |

### 12.7 Monitoring Requirements

Set up these alerts before launch:

| Alert | Condition | Response |
|-------|-----------|---------|
| Logic function timeout | Any LF exceeds 80% of `timeoutSeconds` | Increase limit or optimize |
| Cron skipped execution | Follow-up cron doesn't fire at 08:00 IST | Check Redis queue, restart worker |
| Import error rate | > 10% rows failing in a batch | Inspect normalizer and validator logs |
| Zero activities on lead > 7 days old | `lastContactedAt=null` for 7+ days | Uncontacted lead alert |
| Unusual score drops | > 20 leads drop to COLD in 24h | Possible stale batch or data issue |

### 12.8 Backup Strategy

| Data | Backup Method | Frequency |
|------|--------------|-----------|
| PostgreSQL (all leads, activities, tasks) | pg_dump to S3 | Daily |
| Activity log | Separate export via KPI script | Weekly |
| App configuration (UUID constants) | Git — already in `universal-identifiers.ts` | Every commit |
| `.env.local` | Secrets manager (not Git) | On change |

### 12.9 Nice-to-Have Improvements (P3)

These do not block launch but improve operations:

| Improvement | Value |
|-------------|-------|
| Cron pagination via cursor | Handles > 500 overdue leads |
| Duplicate task prevention in task-automation | Cleaner task list |
| LLM-backed AI summarizer (lead-summarizer.interface.ts is stubbed) | Auto-fills aiLeadSummary |
| Row-level filtering for Employee role | Agents see only assigned leads |
| WhatsApp / SMS outbound webhook | Close the loop on `taskType=SEND_WHATSAPP` |
| Mobile-optimized view for calling agents in field | Quick update on the go |
| Weekly KPI email digest | Manager doesn't need to run script manually |

---

## APPENDIX A — QUICK TEST COMMANDS

```bash
# Run lint before any test session
cd packages/twenty-apps/internal/idda-crm && yarn lint

# Seed 5 clean leads
TWENTY_API_KEY=<key> npx ts-node scripts/ingest-leads.ts \
  --file test-data/batch-clean.json --source GoogleMaps --confidence 80

# Seed 1,000 leads for perf testing
TWENTY_API_KEY=<key> npx ts-node scripts/ingest-leads.ts \
  --file test-data/batch-1000.json --source GoogleMaps --confidence 60

# Bulk assign all unassigned leads
TWENTY_API_KEY=<key> npx ts-node scripts/bulk-operations.ts \
  --op assign --filter assignedToId="" --value <workspace_member_id>

# Dry-run bulk stage update
TWENTY_API_KEY=<key> npx ts-node scripts/bulk-operations.ts \
  --op stage --filter assignedTeam=RESEARCH --value RESEARCH_COMPLETED --dry-run

# Generate KPI report
TWENTY_API_KEY=<key> npx ts-node -e "
const { computeKPIs } = require('./src/analytics/kpi-calculator');
computeKPIs().then(r => console.log(JSON.stringify(r, null, 2)));
"
```

## APPENDIX B — SEVERITY REFERENCE

| Failure | Severity | Definition |
|---------|---------|-----------|
| RBAC bypass via API | P0 | Security violation — halts launch |
| Infinite automation loop | P0 | System stability — halts launch |
| Import crash on invalid row | P0 | Data integrity risk |
| Activity log not firing | P1 | Audit gap, operational confusion |
| Cron silently dropping leads | P1 | Missed follow-ups, lost revenue |
| Duplicate tasks on re-trigger | P1 | Agent confusion |
| Kanban drag not persisting | P1 | Core workflow broken |
| Soft-delete audit gap | P1 | Compliance concern |
| Note truncation in activity | P2 | UX friction |
| Mobile layout broken | P2 | Inconvenience at scale |
| Kanban card missing score band | P2 | UX signal value |
| Cron pagination missing | P2 | Scales out at > 500 overdue |
| Duplicate task on callStatus re-set | P3 | Known limitation |
| AI summaries not auto-populated | P3 | Future phase |

---

---

## PART 13 — PHASE 17 FEATURE TESTING

Phase 17 covers the three remaining TODOs. These tests are forward-looking — run them once the feature is built.

### 13.1 Duplicate Detection Logic Function

**Feature spec:** On `lead.created`, check for existing leads matching any of:
- Same `phone`
- Same `email`
- Same `clinicName` + same `city` (case-insensitive)

**Expected output per match:** Creates a `LeadActivity` with `eventType=DUPLICATE_DETECTED` containing a JSON payload of `{ matchedLeadId, matchField, confidence }`.

#### Test Setup

Create these three leads in advance (they are the "originals"):

```json
{ "externalId": "orig_001", "phone": "+919876543210", "email": "a@clinic.com", "clinicName": "Alpha Dental", "city": "Pune" }
{ "externalId": "orig_002", "phone": "+918888888888", "email": "b@clinic.com", "clinicName": "Beta Skin", "city": "Mumbai" }
{ "externalId": "orig_003", "phone": "+917777777777", "email": "c@clinic.com", "clinicName": "Gamma Eye", "city": "Delhi" }
```

#### Test Cases

**Test D-01: Phone match**
1. Create lead with `phone=+919876543210` (matches orig_001)
2. Expected: `DUPLICATE_DETECTED` activity on the new lead → `{ matchedLeadId: orig_001.id, matchField: "phone", confidence: 0.95 }` ✅
3. Verify: `DUPLICATE_DETECTED` also appears on orig_001's timeline ✅ (both leads flagged)
4. Fail: No activity created → ❌ P0

**Test D-02: Email match**
1. Create lead with `email=b@clinic.com` (matches orig_002)
2. Expected: `DUPLICATE_DETECTED` activity, `matchField: "email"` ✅

**Test D-03: Clinic+City match**
1. Create lead with `clinicName="alpha dental"` (lowercase), `city="pune"` — case-insensitive match on orig_001
2. Expected: `DUPLICATE_DETECTED` activity, `matchField: "clinicName+city"` ✅
3. Fail: Case sensitivity causes match miss → ❌ P1

**Test D-04: Multiple matches**
1. Create a lead matching orig_001 on phone AND email
2. Expected: One `DUPLICATE_DETECTED` activity (not two) — highest-confidence match wins ✅
3. Or: Two separate activities, one per match field — either is acceptable, verify it's consistent
4. Fail: Two identical `DUPLICATE_DETECTED` activities → ❌ P1 (duplicate detection is itself creating duplicates)

**Test D-05: No false positives**
1. Create a lead with completely unique phone, email, clinicName
2. Expected: NO `DUPLICATE_DETECTED` activity ✅
3. Fail: Activity fires for no match → ❌ P1

**Test D-06: Import dedup interaction**
The ingest script already does pre-flight dedup by `externalId`. The logic function is a second layer catching UI-created and different-source duplicates.
1. Import a lead with `externalId=new_999` but `phone=+919876543210` (matches orig_001)
2. Ingest script should NOT block this (different externalId)
3. Logic function SHOULD fire and flag the phone match
4. Verify: Lead created + `DUPLICATE_DETECTED` activity ✅

**Test D-07: Self-trigger prevention**
1. Update `phone` on an existing lead to a new number, then back to the original
2. Logic function fires on `lead.updated` if wired to that event — verify it does NOT fire on updates, only `lead.created`
3. Fail: Update triggers duplicate check on the lead against itself → ❌ P1 (infinite loop risk)

#### Duplicate Detection Bug Watch List

| Symptom | Likely Cause | Severity |
|---------|-------------|---------|
| No activity on phone match | Query using `phones.primaryPhoneNumber` wrong field path | P0 |
| Case-sensitive clinic match fails | Missing `.toLowerCase()` in comparison | P1 |
| Two DUPLICATE_DETECTED activities for same match | Guard clause missing | P1 |
| Self-match (lead matches itself) | `id !== currentLeadId` filter missing in query | P1 |
| Fires on update, not just create | Event hook wired to `lead.updated` too | P1 |

---

### 13.2 LLM-Backed AI Summarizer

**Feature spec:** The `lead-summarizer.interface.ts` stub becomes a real integration. On-demand (or on stage change to INTERESTED/NEGOTIATION), calls an LLM with the lead's activity history + field values and writes a summary to `aiLeadSummary` and a next action to `aiNextAction`.

#### Pre-Integration Test (Stub Validation)

Before wiring a real LLM, verify the interface contract works:

1. Open `src/ai-services/lead-summarizer.interface.ts`
2. Call `summarizeLead(leadId)` directly from a test script
3. Expected: Returns `{ summary: string, nextAction: string, confidence: number, tags: string[] }` — even from stub ✅
4. Verify stub writes to `aiLeadSummary` field on the lead ✅

#### Post-Integration Test Cases

**Test AI-01: Minimum viable context**
1. Create a lead with 1 activity (LEAD_CREATED) and minimal fields
2. Trigger summarizer
3. Expected: Returns a low-confidence summary (confidence < 0.5) ✅
4. `aiLeadSummary`: something like "New lead with limited data. No engagement history."
5. `aiNextAction`: "Research clinic and attempt first contact"

**Test AI-02: Full pipeline context**
1. Use a lead that has been through the full lifecycle (RESEARCH → CALLING → MEETING → NEGOTIATION)
2. Lead has 8+ activity entries, `followUpNotes`, `objections`, `callOutcome=POSITIVE`, `interestLevel=HOT`
3. Trigger summarizer
4. Expected: `aiConfidence > 0.8`, `aiTags` contains `["hot-lead", "meeting-done", "price-concern"]`, `aiNextAction` is specific ✅

**Test AI-03: Summarizer does NOT trigger activity logger**
1. After summarizer runs, check LeadActivity timeline
2. `aiLeadSummary` update must NOT create a LeadActivity (field not in WATCHED_FIELDS)
3. Fail: Activity logger fires on AI field write → ❌ P1 (pollutes timeline with AI noise)

**Test AI-04: LLM error handling**
1. Point `OPENAI_API_KEY` (or whichever LLM key) to an invalid value
2. Trigger summarizer
3. Expected: Graceful failure — no crash, `aiLeadSummary` unchanged, error logged to server logs ✅
4. Fail: Unhandled promise rejection crashes the logic function → ❌ P0

**Test AI-05: Rate limit behavior**
1. Trigger summarizer for 20 leads simultaneously
2. Expected: Queue or backoff, no 429 errors escaping to the server crash handler ✅
3. LLM calls should be serialized or batched

**Test AI-06: Sensitive data handling**
1. Verify the prompt sent to the LLM does NOT include: workspace API keys, workspace member personal emails, authentication tokens
2. Only lead business data (`clinicName`, `city`, `followUpNotes`, activity event types) should be in the prompt
3. Audit the prompt template in `src/ai-services/prompt-templates/` before enabling in production

---

### 13.3 WhatsApp/SMS Outbound Automation

**Feature spec:** When `taskType=SEND_WHATSAPP` is created by `task-automation`, a webhook fires to send a WhatsApp message (via Twilio, Interakt, or similar) to the lead's primary phone.

#### Test Setup

Before testing, configure in `.env.local`:
```bash
WHATSAPP_API_KEY=<provider_api_key>
WHATSAPP_SENDER_NUMBER=+91XXXXXXXXXX  # Your registered sender
WHATSAPP_TEMPLATE_ID=<approved_template_id>  # Pre-approved by Meta
```

**Test WA-01: SEND_WHATSAPP task triggers webhook**
1. Trigger `callOutcome=FOLLOW_UP` on a lead (this creates a SEND_WHATSAPP task via task-automation)
2. Verify the outbound webhook fires within 30 seconds
3. Check provider dashboard for message delivery status
4. Expected: Message sent to lead's `phones.primaryPhoneNumber` ✅

**Test WA-02: Invalid phone — no crash**
1. Create a lead with phone `abc123` (invalid)
2. Trigger SEND_WHATSAPP task
3. Expected: Webhook fires, provider returns error, CRM logs it as `WHATSAPP_FAILED` LeadActivity ✅
4. Fail: Server crash or unhandled rejection → ❌ P0

**Test WA-03: Missing phone — skip gracefully**
1. Create a lead with NO phone set
2. Trigger SEND_WHATSAPP task
3. Expected: Webhook skips silently (no crash, no phantom send), `WHATSAPP_SKIPPED` activity logged ✅

**Test WA-04: Opt-out handling**
1. Mark a lead as `doNotContact=true` (if this field is added in Phase 17)
2. Trigger SEND_WHATSAPP
3. Expected: Message NOT sent, `WHATSAPP_BLOCKED_OPT_OUT` activity ✅
4. Fail: Message sent to opt-out contact → ❌ P0 (legal violation)

**Test WA-05: Delivery status callback**
1. Confirm your provider (Twilio/Interakt) sends delivery receipts via webhook
2. Verify the CRM webhook receiver updates the LeadActivity with `DELIVERED` or `FAILED` status
3. This closes the loop: agent knows if the WhatsApp was actually received

**Regulatory note:** WhatsApp Business API requires Meta-approved message templates for outbound cold messages. Verify template approval before any production send. Test-mode sends may work with sandbox numbers only.

---

## APPENDIX C — AGENT ONBOARDING GUIDE

This is the day-1 guide for each role. Print or share this with new team members.

---

### Research Agent — Day 1 Guide

**Your job:** Find clinics and doctors online. Create their records in the CRM so the calling team can contact them.

**Your workspace:**
- **Leads → All Leads** — your main view (table)
- **Segments → Research Queue** — leads needing your attention (stage=NEW_LEAD)

**How to create a lead:**
1. Open Leads → All Leads
2. Click `+ New Lead`
3. Fill in what you know: doctor name, clinic name, city, state, phone, email
4. Set `Specialization` from the dropdown (Dentist, Dermatologist, etc.)
5. Set `Lead Source` (where you found this — Google Maps, Instagram, Cold Call)
6. Set `Enrichment Status` to `ENRICHED` if you confirmed the data is accurate
7. Set `Data Confidence Score`: 80 if you called to confirm, 60 if scraped, 40 if you're unsure
8. Save

**When you're done researching a lead:**
- Change `Stage` to `Research Completed`
- This moves it out of your Research Queue and alerts the manager to assign a calling agent

**Fields you CAN edit:** Clinic name, doctor name, phone, email, city, state, specialization, website, Instagram, lead source, enrichment status, data confidence score, import batch ID

**Fields you CANNOT edit:** Call status, call outcome, meeting date, assigned agent — these belong to the calling and sales teams

**Common mistake:** Do not create duplicate leads. Before creating a new lead, search by phone number or clinic name to check if it already exists.

---

### Calling Agent — Day 1 Guide

**Your job:** Call leads assigned to you. Log every call. Book meetings for interested doctors.

**Your workspace:**
- **Operations → Calling Queue** — leads assigned to your team in READY_FOR_CALLING
- **Operations → Today's Follow-Ups** — follow-ups due today (check this FIRST every morning)
- **Tasks → My Tasks** — your pending tasks

**Morning routine (10 minutes):**
1. Open Today's Follow-Ups — these are overdue, call these first
2. Open My Tasks — check for any FOLLOW_UP_CALL or SEND_WHATSAPP tasks
3. Open Calling Queue — work down the list

**After every call, update the lead:**

| Outcome | What to set |
|---------|------------|
| No answer | `Call Status` = No Answer, `Next Follow-Up` = tomorrow |
| Busy / call back | `Call Status` = Busy, `Next Follow-Up` = in 2 hours |
| Spoke, not interested | `Call Status` = Called, `Call Outcome` = Not Interested, `Stage` = Follow-Up Pending |
| Spoke, interested | `Call Status` = Called, `Call Outcome` = Positive, `Interest Level` = Warm, add notes |
| Wants to think about it | `Call Outcome` = Follow Up, `Next Follow-Up` = specific date, add note on what they said |
| Agreed to meeting | Set `Meeting Date`, `Meeting Mode`, push `Stage` to Meeting Scheduled |

**ALWAYS update `Next Follow-Up At` after every interaction.** If you don't, the system will send you a reminder tomorrow for the same lead.

**After adding notes,** write complete sentences. "Doctor interested in 10-seat plan, wants pricing for annual contract" is useful. "interested" is not.

---

### Sales Agent — Day 1 Guide

**Your job:** Run meetings, send proposals, close deals.

**Your workspace:**
- **Operations → Meetings Today** — your meetings today
- **Segments → Interested Leads** — warm leads ready for a push
- **Score → Hot Leads** — highest-priority leads
- **Tasks → My Tasks** — your action items

**Before every meeting:**
1. Open the lead record
2. Read all `Follow-Up Notes`, `Objections`, `Call Outcome` history
3. Check the `Lead Score` — if it's high, this is a quality lead
4. Review the `Activity Timeline` to see full conversation history

**After every meeting:**
1. Set `Meeting Outcome` (Proposal Sent, Follow-Up Required, Closed Won, Closed Lost)
2. Update `Stage` accordingly
3. Add your meeting notes to `Follow-Up Notes`
4. Record any objections in `Objections` field
5. Set `Conversion Probability` (0–100%) honestly
6. Set `Expected Closure Date`

**Closing a deal:**
- Won: `Stage = Onboarded`, `Meeting Outcome = Closed Won`, `Conversion Probability = 100`
- Lost: `Stage = Rejected`, `Meeting Outcome = Closed Lost` — add a note WHY (price, competitor, timing)

**Tip:** When you close a deal (won or lost), your manager reviews the rejection reason or win context. Be specific — "Too expensive vs. competitor X at Rs 5k less" is actionable. "No budget" is not.

---

### Manager — Day 1 Guide

**Your job:** Monitor the pipeline, assign leads, unblock your team, and make decisions.

**Morning routine (20 minutes):**

| Time | Action | View |
|------|--------|------|
| 09:00 | Pipeline health check | Score → Hot Leads |
| 09:05 | Identify at-risk leads | Score → Cold / At-Risk |
| 09:10 | Overnight cron check | Lead Activities, filter FOLLOW_UP_DUE |
| 09:15 | Sweep unassigned leads | Operations → Unassigned Leads |
| 09:20 | Check overdue tasks | Tasks → Overdue Tasks |
| 09:30 | Balance team queues | Filter Calling Queue by agent |

**Assigning leads in bulk:**
```bash
cd packages/twenty-apps/internal/idda-crm
TWENTY_API_KEY=<key> npx ts-node scripts/bulk-operations.ts \
  --op assign \
  --filter assignedToId="" \
  --value <workspace_member_id>
```

**Key numbers to watch daily:**

| Metric | How to Check | Red Flag |
|--------|-------------|----------|
| Unassigned leads | Unassigned Leads view | > 0 in active stages |
| HOT leads without meeting | Hot Leads view | meetingDate=null on any HOT lead |
| Overdue tasks | Tasks → Overdue Tasks | > 5 overdue tasks at noon |
| Leads not contacted in 7 days | All Leads, filter lastContactedAt | Any in active stages |

**Deleting a lead:**
Only Managers can soft-delete. Before deleting, add a note to `Follow-Up Notes` explaining why (e.g., "Merged with orig_001 — duplicate clinic"). Deleted leads cannot be restored without database access.

---

## APPENDIX D — TROUBLESHOOTING RUNBOOK

Use this when something in the CRM isn't working. Start at the top of each section.

---

### D-01: Lead activity log not appearing

**Symptom:** Updated a lead field, but no new entry in the activity timeline.

**Step 1:** Check the field you updated is in `WATCHED_FIELDS` in `lead-activity-logger.logic-function.ts`. If it's not in that list, no activity is created — this is correct behavior, not a bug.

**Step 2:** Check the Twenty server logs for errors:
```bash
# In development
yarn start  # and watch the console output
# Look for errors from lead-activity-logger
```

**Step 3:** Verify the logic function is registered. In the Twenty admin panel: Settings → Logic Functions → confirm `lead-activity-logger` is listed and enabled.

**Step 4:** Check the logic function's last execution log. Settings → Logic Functions → lead-activity-logger → Logs.

**Step 5:** If the logic function shows a timeout or error, check the `timeoutSeconds` setting. The activity logger should complete in < 2 seconds — if it's timing out, there's a network issue between the logic function and the Twenty API.

---

### D-02: Lead score is not recalculating

**Symptom:** Updated a field that should trigger a score change, but `leadScore` and `scoreBand` are unchanged.

**Step 1:** Verify the updated field is in `SCORE_TRIGGER_FIELDS` in `lead-score-calculator.logic-function.ts`. Fields like `clinicName`, `city`, `instagram` are intentionally NOT triggers.

**Step 2:** Check the logic function logs for `lead-score-calculator`. Look for JavaScript errors in the scoring logic.

**Step 3:** Check for the infinite loop guard: `leadScore`, `scoreBand`, `scoreExplanation` must NOT be in `SCORE_TRIGGER_FIELDS`. If they are, every score write triggers another score calculation.

**Step 4:** Manually invoke the score calculator by making a trivial update to a trigger field (e.g., set `priority` to the same value it already has — some frameworks still fire the event on a same-value save).

**Step 5:** If score shows `0` for all leads after a server restart, the logic function may have failed silently on a previous update. Run a bulk re-score:
```bash
TWENTY_API_KEY=<key> npx ts-node scripts/bulk-operations.ts \
  --op rescore --filter "" --dry-run
# Review then run without --dry-run
```

---

### D-03: Follow-up cron not firing

**Symptom:** Leads with overdue `nextFollowUpAt` did not get a task created at 08:00 IST.

**Step 1:** Verify Redis is running. The cron scheduler depends on Redis:
```bash
redis-cli ping  # expect: PONG
```

**Step 2:** Verify the background worker is running:
```bash
npx nx run twenty-server:worker
```

**Step 3:** Check the cron schedule. In `follow-up-reminder.logic-function.ts`, the schedule is `30 2 * * *` (02:30 UTC). Verify your server time is UTC, not IST:
```bash
date -u  # should show UTC time
```

**Step 4:** Check if the cron ran but found 0 qualifying leads. Open Lead Activities, filter `eventType=FOLLOW_UP_DUE`. If nothing from this morning, cron either didn't run or found nothing.

**Step 5:** Verify leads have `nextFollowUpAt` set to a past date AND are NOT in `EXCLUDED_STAGES` (ONBOARDED, REJECTED). Check a specific lead's `nextFollowUpAt` field directly:
```sql
-- via Postgres MCP
SELECT id, "nextFollowUpAt", stage FROM workspace_<id>."lead"
WHERE "nextFollowUpAt" < NOW()
AND stage NOT IN ('ONBOARDED', 'REJECTED')
LIMIT 10;
```

**Step 6:** Manually trigger the cron via admin panel to test: Settings → Logic Functions → follow-up-reminder → Run Now.

---

### D-04: Import script failing or producing 0 leads

**Symptom:** Ran `ingest-leads.ts` but no leads appear in the CRM.

**Step 1:** Check the API key:
```bash
echo $TWENTY_API_KEY  # must be set
```
Verify it's a valid key from Settings → APIs & Webhooks → API Keys.

**Step 2:** Check `TWENTY_API_URL`. Default is `http://localhost:3000`. If running in a different environment, this must match.

**Step 3:** Run with a single-row test file first:
```bash
echo '[{"externalId":"test","clinicName":"Test Clinic","phone":"+911234567890","city":"Mumbai","leadSource":"SCRAPER"}]' > /tmp/one-lead.json
TWENTY_API_KEY=<key> npx ts-node scripts/ingest-leads.ts --file /tmp/one-lead.json --source GoogleMaps
```

**Step 4:** If the above succeeds, the issue is data-specific. Run the full file with `--dry-run` first to see validation errors before any writes.

**Step 5:** Check for schema mismatch. If the Lead object was modified recently (new required fields added), the ingest script may be sending outdated payloads. Review `src/import/adapters/googlemaps-adapter.ts` for the field mapping.

---

### D-05: Task not created after callStatus change

**Symptom:** Set `callStatus=NO_ANSWER` on a lead but no FOLLOW_UP_CALL task appeared in My Tasks.

**Step 1:** Verify the task-automation logic function is registered and enabled.

**Step 2:** Check the logic function logs for errors. The most common failure: `assignedToId` is null on the lead, and the task creator tries to set `assignedTo` from a null value.

**Step 3:** Verify the lead has `assignedToId` set. Tasks created by `task-automation` are assigned to the same agent as the lead. If the lead is unassigned, the task may be created but appear in no one's queue.

**Step 4:** Check `Tasks → Task Board` — not `My Tasks`. The task may exist but be unassigned. Filter by `leadId` to find it.

**Step 5:** If tasks exist but duplicates are appearing (multiple FOLLOW_UP_CALL tasks for one lead), this is the known P3 limitation: toggling callStatus multiple times creates one task per transition. Known behavior — not a bug.

---

### D-06: RBAC not enforced — wrong role can edit restricted field

**Symptom:** A Research Agent can edit `callStatus`, or a Calling Agent can edit `importBatchId`.

**Step 1:** This is a P0 issue. Do not deploy to production until fixed.

**Step 2:** Check `src/roles/research-agent.role.ts` (or the relevant role file). Verify `fieldPermissions` explicitly lists the field as `{ read: true, write: false }`.

**Step 3:** Field permissions in Twenty Apps SDK are applied at the API resolver level. If the Twenty version being used does not support field-level permissions, this must be enforced via a custom `lead.updated` hook that rejects writes to restricted fields by unauthorized roles.

**Step 4:** Test via API directly (not just UI) using the curl test from Section 8.2. If the API accepts the write, the permission is not enforced.

**Step 5:** Open a GitHub issue on the Twenty Apps SDK repo if field permissions are being silently ignored — this may be a framework-level bug.

---

### D-07: Kanban drag-and-drop not updating stage

**Symptom:** Dragged a card to a new column, but after refresh the card is back in the original column.

**Step 1:** Open DevTools → Network. After the drag, look for a `mutation updateLead` GraphQL call. If you see it with a 200 response, the update was sent but may not have persisted. If you see a 4xx/5xx, the update failed.

**Step 2:** Check the `stage` field on the lead — is it the `labelIdentifier` or the internal value? The kanban must be grouping by the `stage` SELECT field and updating via its internal value (e.g., `RESEARCH_COMPLETED`), not the display label ("Research Completed").

**Step 3:** If using Firefox: Twenty CRM kanban has known drag-and-drop quirks in Firefox due to native HTML5 drag events. Retry in Chrome.

**Step 4:** Check server logs for mutation errors. A common issue: the destination stage column value does not exist in the SELECT field's `options` array.

---

### D-08: All Leads view loads slowly (> 5 seconds)

**Symptom:** The All Leads table takes a long time to load or times out.

**Step 1:** Check how many leads are in the database:
```sql
SELECT COUNT(*) FROM workspace_<id>."lead";
```

**Step 2:** If > 5,000 leads: This is a known scaling concern (Section 7.1). The view is loading all records. Workaround: Apply a filter (e.g., `stage != ONBOARDED`) to reduce the result set.

**Step 3:** Check PostgreSQL query logs for slow queries. Look for missing indexes on `stage`, `assignedToId`, `scoreBand`, `nextFollowUpAt` — these are the most-filtered fields.

**Step 4:** Check if `leadScore` computation is running on every page load. The score should be stored on the lead record, not computed on read.

**Step 5:** If > 10,000 leads: Contact the Twenty core team about pagination for custom object views. This is a framework-level fix.

---

## APPENDIX E — PRODUCTION DEPLOYMENT CHECKLIST

Run this checklist when deploying to a hosted environment (VPS, cloud server, managed Kubernetes).

### E-01: Infrastructure Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 4 GB | 8 GB |
| Disk | 20 GB SSD | 50 GB SSD |
| PostgreSQL | 15+ | 15+ with connection pooler (PgBouncer) |
| Redis | 7+ | 7+ with persistence enabled |
| Node.js | 20+ | 20 LTS |

### E-02: Environment Variables — Production Values

Copy `.env.example` from Twenty root to `.env` and set ALL of these for production:

```bash
# Twenty core — CHANGE ALL OF THESE
APP_SECRET=<generate: openssl rand -hex 32>
PG_DATABASE_URL=postgresql://user:pass@host:5432/twenty_prod
REDIS_URL=redis://host:6379

# IDDA CRM app
TWENTY_API_KEY=<generate from Settings → APIs & Webhooks in your workspace>
TWENTY_API_URL=https://your-crm-domain.com

# AI summarizer (Phase 17)
OPENAI_API_KEY=<if using GPT>
ANTHROPIC_API_KEY=<if using Claude>

# WhatsApp (Phase 17)
WHATSAPP_API_KEY=<provider key>
WHATSAPP_SENDER_NUMBER=<your registered sender>
WHATSAPP_TEMPLATE_ID=<Meta-approved template>

# Security
CORS_ALLOWED_ORIGINS=https://your-crm-domain.com
```

**Never commit `.env` to Git.** Use a secrets manager (AWS Secrets Manager, Doppler, Vault) in production.

### E-03: Pre-Deployment Steps

```bash
# 1. Build all packages in order
npx nx build twenty-shared
npx nx build twenty-front
npx nx build twenty-server

# 2. Run database migrations
npx nx run twenty-server:database:migrate:prod

# 3. Initialize default workspace data
npx nx run twenty-server:database:init:prod

# 4. Deploy IDDA CRM app into workspace
cd packages/twenty-apps/internal/idda-crm
yarn twenty deploy

# 5. Verify app is installed
# Settings → Apps → IDDA Assurance CRM should be visible
```

### E-04: Post-Deployment Verification

Run these checks within 30 minutes of going live:

- [ ] Frontend loads at your domain: GET `https://your-domain.com` → HTTP 200
- [ ] API health: GET `https://your-domain.com/api/healthz` → `{ "status": "ok" }`
- [ ] Can log in with `manager@idda.test` credentials
- [ ] IDDA CRM app appears in Settings → Apps
- [ ] All Leads view loads (even if empty)
- [ ] Create one test lead via UI — verify it appears
- [ ] Update that lead's `stage` — verify activity log appears
- [ ] Delete the test lead (as manager)
- [ ] Run cron manually: Settings → Logic Functions → follow-up-reminder → Run Now
- [ ] Check server logs for any startup errors

### E-05: SSL / HTTPS

Twenty CRM must run on HTTPS in production. Recommended approach:

1. Use a reverse proxy (Nginx or Caddy) in front of the Twenty Node server
2. Obtain a TLS certificate via Let's Encrypt (certbot) or your cloud provider
3. Configure Nginx to proxy `443 → localhost:3000` (API) and `443/app → localhost:3001` (frontend)

Sample Nginx config:
```nginx
server {
  listen 443 ssl;
  server_name your-crm-domain.com;

  ssl_certificate /etc/letsencrypt/live/your-crm-domain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/your-crm-domain.com/privkey.pem;

  location /api {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location / {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
  }
}
```

### E-06: Backup Configuration

Set up automated backups before the first real data is imported:

```bash
# Daily PostgreSQL backup (add to crontab)
0 2 * * * pg_dump $PG_DATABASE_URL | gzip > /backups/twenty_$(date +%Y%m%d).sql.gz

# Weekly: copy backups to S3
0 3 * * 0 aws s3 sync /backups s3://your-bucket/crm-backups/

# Verify backup is readable (run weekly)
# zcat /backups/twenty_YYYYMMDD.sql.gz | psql -d test_restore
```

**Retention policy:** Keep 7 daily backups + 4 weekly backups + 3 monthly backups.

### E-07: Process Management

Run Twenty server processes under a process manager so they restart on crash:

**Option A: PM2 (simple)**
```bash
npm install -g pm2

pm2 start "npx nx start twenty-server" --name twenty-server
pm2 start "npx nx run twenty-server:worker" --name twenty-worker
pm2 start "npx nx start twenty-front" --name twenty-front

pm2 save
pm2 startup  # follow the instructions to auto-start on reboot
```

**Option B: systemd (production-grade)**
Create `/etc/systemd/system/twenty-server.service`:
```ini
[Unit]
Description=Twenty CRM Server
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=twenty
WorkingDirectory=/opt/twenty
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10
EnvironmentFile=/opt/twenty/.env

[Install]
WantedBy=multi-user.target
```

### E-08: Monitoring Checklist (Production)

| Monitor | Tool | Alert Condition |
|---------|------|----------------|
| Server uptime | UptimeRobot (free) | API `healthz` down for > 2 min |
| Disk usage | Cloud monitoring | > 80% disk |
| PostgreSQL connections | pgBadger / cloud metrics | > 80% connection pool |
| Redis memory | Redis INFO memory | > 80% maxmemory |
| Logic function errors | Twenty admin panel | Any LF failure rate > 5% |
| Failed import batches | Server logs | Any batch with > 10% error rate |

### E-09: User Account Setup in Production

Do NOT use test accounts (`@idda.test`) in production. For each real team member:
1. Manager creates their workspace account via Settings → Members → Invite
2. Manager assigns the correct role (Manager / Calling Agent / Research Agent / Sales Agent / Employee)
3. Team member sets their own password on first login
4. Manager shares the workspace URL and confirms they can log in
5. New member runs through Section 2.X for their role as a self-onboarding walkthrough

---

*Last updated: Phase 16 — Follow-Up Reminder Cron*  
*Maintained alongside `src/logic-functions/`, `src/objects/`, and `scripts/`*  
*Appendices C/D/E and Part 13 added post-Phase 16 — covers Phase 17 features and operational readiness*
