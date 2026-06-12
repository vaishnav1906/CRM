# IDDA CRM — Complete Operations Manual
### How to Fully Run Your CRM from Day One

---

> **Who is this for?**
> This manual is for everyone on the IDDA team — interns, callers, researchers, sales agents, and managers. No technical background needed. If you can use WhatsApp and Google Sheets, you can use this CRM.

---

## Table of Contents

1. [Welcome to IDDA CRM](#1-welcome-to-idda-crm)
2. [Understanding the CRM Workflow](#2-understanding-the-crm-workflow)
3. [Setting Up the CRM for the First Time](#3-setting-up-the-crm-for-the-first-time)
4. [Opening the CRM](#4-opening-the-crm)
5. [Creating Team Members](#5-creating-team-members)
6. [Research Team Guide](#6-research-team-guide)
7. [Calling Team Guide](#7-calling-team-guide)
8. [Sales Team Guide](#8-sales-team-guide)
9. [Manager Guide](#9-manager-guide)
10. [Importing Leads](#10-importing-leads)
11. [Understanding Lead Scores](#11-understanding-lead-scores)
12. [Tasks & Follow-Ups](#12-tasks--follow-ups)
13. [Daily Operations Guide](#13-daily-operations-guide)
14. [Common Problems & Fixes](#14-common-problems--fixes)
15. [Best Practices](#15-best-practices)
16. [Scaling the CRM](#16-scaling-the-crm)
17. [Advanced Features (Coming Soon)](#17-advanced-features-coming-soon)
18. [Final Team Operating Rules](#18-final-team-operating-rules)

---

# 1. Welcome to IDDA CRM

## What Is This CRM?

CRM stands for **Customer Relationship Manager**. Think of it as the central brain of your sales operation — every doctor, every clinic, every phone call, every follow-up, every deal in progress — all of it lives here, organized and searchable.

IDDA's CRM is built specifically for the dental and dermatology subscription business. It tracks leads (potential clinic clients), manages your outreach pipeline, and keeps the entire team on the same page.

**Without the CRM:** leads get lost, follow-ups get missed, two callers call the same doctor, deals fall through the cracks.

**With the CRM:** everyone knows the status of every lead, nothing slips, and the pipeline stays clean.

## Why Does IDDA Use This?

IDDA sells subscription plans to doctors and clinics — dentists, dermatologists, and similar specialists. That means:
- Hundreds of leads across multiple cities and states
- A research team that finds new leads
- A calling team that contacts them
- A sales team that closes deals
- A manager who watches the whole pipeline

Without a central system, this becomes chaos very quickly. The CRM gives every team member exactly what they need to do their job — and gives managers a live view of how everything is going.

## How the Workflow Works

The CRM follows a simple journey for every lead:

```
New Lead → Research Completed → Contacted → Follow-Up Pending
         → Interested → Meeting Scheduled → Onboarded (Won) or Rejected (Lost)
```

Each stage represents where the lead currently stands in the process. Your job, depending on your role, is to move leads forward through these stages — and to document everything that happens along the way.

---

# 2. Understanding the CRM Workflow

## The Complete Lead Journey

Think of a lead like a customer walking into a store. They start as a stranger. Your team's job is to turn that stranger into a paying subscriber.

Here's how each stage works in plain English:

| Stage | What It Means | Who Handles It |
|---|---|---|
| **New Lead** | A doctor's name and contact info has just been added. Nothing else has happened yet. | Research Team |
| **Research Completed** | The lead has been verified — correct phone, clinic type, city, etc. Ready to call. | Research Team |
| **Contacted** | A caller made the first call. May have spoken to the doctor or left a message. | Calling Team |
| **Follow-Up Pending** | The doctor asked to be called back later, or wasn't available. A reminder is set. | Calling Team |
| **Interested** | The doctor showed genuine interest. Wants to hear more or asked for details. | Calling / Sales Team |
| **Meeting Scheduled** | A proper sales meeting has been booked — over phone or in person. | Sales Team |
| **Onboarded** | The doctor signed up. Deal is closed and won. 🎉 | Sales Team |
| **Rejected** | The doctor said no, or the lead is not a good fit. | Any Team |

## A Real-World Example

Let's say your research team finds a dentist clinic in Pune:
- **Dr. Priya Sharma**, Smile Care Dental, Koregaon Park, Pune
- Phone: +91-98201-XXXXX
- Instagram: @smilecarepune

Here's how the journey looks:

1. **Research intern** adds Dr. Priya to the CRM as a **New Lead**, fills in her clinic name, city, phone, and specialization (Dentist). Moves her to **Research Completed**.

2. **Caller** gets assigned Dr. Priya. Calls her. She says "call me Thursday." Caller logs the call, sets a follow-up task for Thursday. Stage moves to **Follow-Up Pending**.

3. **Thursday** arrives. CRM automatically reminds the caller. Caller calls Dr. Priya again. She's interested! Caller updates the stage to **Interested** and writes a note about what she liked.

4. **Sales agent** is notified. Books a meeting with Dr. Priya for Monday. Stage moves to **Meeting Scheduled**.

5. **Monday meeting** happens. Dr. Priya signs up. Sales agent marks the lead as **Onboarded**.

That's the full lifecycle. Every single step is tracked. Nothing gets forgotten.

---

# 3. Setting Up the CRM for the First Time

> **Note:** This section is for the person responsible for running the CRM server — usually a manager or a designated technical point of contact. Regular team members can skip directly to Section 4.

## Before You Begin — Understanding the Tools

You need a few tools installed on your computer to run the CRM. Here's what each one is, explained simply:

### What Is Node.js?
Node.js is the engine that runs JavaScript on your computer — like how Chrome is needed to open a website, Node.js is needed to run the CRM server. Think of it as the car engine.

### What Is Docker?
Docker is a tool that packages software into a neat box so it runs the same way on any computer. We use Docker to run the database and the cache system without complex installation steps. Think of Docker as a pre-packed toolbox.

### What Is PostgreSQL?
PostgreSQL (or "Postgres") is the database — where all your lead data, notes, tasks, and pipeline information is permanently stored. Think of it as the filing cabinet.

### What Is Redis?
Redis is a fast temporary memory system. It keeps things like login sessions and frequently used data ready instantly. Think of it as a sticky notes board — fast to read, keeps things accessible.

### What Are Environment Variables?
Environment variables are settings your application reads before starting — like the database password, the API keys, and server configurations. They live in a file called `.env`. Think of it as the settings file that the CRM reads on startup.

---

## Step 1 — Install Required Tools

Open your **Terminal** (on Mac: press `Cmd + Space`, type "Terminal", press Enter).

### Install Node.js
Go to [nodejs.org](https://nodejs.org) and download the **LTS version** (the one labeled "Recommended for most users"). Install it like any other Mac/Windows app.

Verify it worked by typing this in Terminal:
```
node --version
```
You should see something like `v20.11.0`. If you do, Node.js is ready.

### Install Docker Desktop
Go to [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) and download Docker Desktop for your operating system. Install it. Open Docker Desktop — you'll see a whale icon in your menu bar when it's running.

Docker needs to be running before you start the CRM. Always open Docker first.

---

## Step 2 — Get the CRM Code

This downloads the CRM application to your computer.

```
git clone https://github.com/your-org/idda-crm.git
cd idda-crm
```

> **What does this do?** It downloads the CRM project files into a folder called `idda-crm` and moves you into that folder. Like unzipping a file.

---

## Step 3 — Set Up the Environment File

The CRM needs a settings file to know how to connect to the database, what passwords to use, etc.

```
cp .env.example .env
```

> **What does this do?** It copies the example settings file and creates a real one called `.env`. You'll then fill in the actual values.

Open the `.env` file in any text editor (Notepad, TextEdit, VS Code) and fill in:
- Your database name, username, and password (usually already pre-filled for local development)
- Your `TWENTY_API_KEY` — you get this from the CRM's Settings page after first login (more on that in Section 4)

---

## Step 4 — Install Dependencies

```
yarn install
```

> **What does this do?** Downloads all the code libraries the CRM depends on to run. Like installing apps on a new phone. This may take 2–5 minutes the first time.

---

## Step 5 — Start the Database and Cache

Run the setup script that starts everything automatically:

```
bash packages/twenty-utils/setup-dev-env.sh
```

> **What does this do?** This starts PostgreSQL (the database) and Redis (the cache) using Docker. It creates the necessary databases and copies configuration files. You only need to do this once per setup — after that, starting Docker is enough.

Wait for the script to finish. You'll see a success message when it's done.

---

## Step 6 — Start the CRM

Now start all three parts of the CRM:

```
yarn start
```

> **What does this do?** This starts the frontend (the visual website you'll use), the backend (the engine that processes everything), and the worker (the background system that handles reminders, imports, etc.) all at once.

Wait about 30–60 seconds. You'll see activity in the terminal as each piece starts up.

---

## Step 7 — Verify Everything Is Running

Open your browser and go to:
```
http://localhost:3000
```

If you see a login page, the CRM is running.

If the page doesn't load, check that Docker Desktop is open and running (look for the whale icon in your menu bar).

---

# 4. Opening the CRM

## The CRM Address

Once the server is running, every team member opens the CRM in their web browser at:

```
http://localhost:3000
```

Or, if your team is running the CRM on a shared server, your manager will give you the specific web address (like `https://crm.idda.in`).

> **Think of this like opening Gmail** — you just go to the URL, and there's your workspace.

## Logging In for the First Time

On first visit, you'll see a login screen.

**If you're the admin setting up for the first time:**
1. Click **"Continue with Email"**
2. Use the pre-filled credentials shown on screen (these are default admin credentials)
3. Change your password immediately after logging in — go to Settings → Profile

**If you're a team member being invited:**
You'll receive an email invitation. Click the link, set your password, and you're in.

## Setting Up Your Workspace

After first login, the CRM will walk you through workspace setup:
1. Enter your company name: `IDDA Assurance`
2. Choose your workspace logo if desired
3. Click Continue

This only needs to be done once.

## What You'll See — The Dashboard Overview

After logging in, you'll see the main screen. Here's what everything means:

| Area | What It Is |
|---|---|
| **Left sidebar** | Navigation — click here to go to Leads, Tasks, Team, Settings |
| **Leads** | Your full list of all leads in the system |
| **Pipeline** | Visual view of leads sorted by stage (like a Kanban board) |
| **Tasks** | All pending to-dos and follow-ups assigned to you |
| **People** | Individual contacts (doctors) |
| **Companies** | Clinics and hospitals |
| **Settings** | Account management, team invites, API keys |

---

# 5. Creating Team Members

## How to Invite Users

Only managers and admins can invite new users.

1. Click **Settings** in the left sidebar
2. Go to **Members**
3. Click **"Invite Member"**
4. Enter their email address
5. They'll receive an email with a link to set up their account

> **Pro Tip:** Send the invited person this operations manual so they're ready before they even log in.

## How to Assign Roles

IDDA's CRM has two roles:

### Manager Role
Managers can:
- See all leads across all team members
- Reassign leads to different team members
- Delete leads
- Invite and remove team members
- See performance reports and KPI dashboards
- Change any lead's information

### Employee Role
Employees can:
- See leads assigned to them
- Update leads they're working on
- Create new leads
- Complete tasks
- Cannot delete leads
- Cannot see other people's leads (by default)

**To assign a role:**
1. Go to **Settings → Members**
2. Click on the team member's name
3. Select **Manager** or **Employee** from the Role dropdown
4. Save

## What Each Role Does Daily

| Role | Main Job |
|---|---|
| **Manager** | Monitor pipeline, assign leads, check team performance |
| **Research Employee** | Find new leads, add them to CRM, verify data |
| **Calling Employee** | Call leads, update outcomes, set follow-ups |
| **Sales Employee** | Run meetings, negotiate, close deals |

> **Important:** Every team member should only do what their role covers. If a caller closes a deal, they should update the stage to Onboarded — but the sales agent should be the one running the actual meeting.

---

# 6. Research Team Guide

## Your Job in One Sentence
Find potential doctor/clinic leads, add them correctly to the CRM, and hand them off to the calling team.

## What "Research" Means Here

Research means finding doctors and clinics who might be interested in IDDA's subscription plan and adding their verified contact information into the CRM. Your output is a clean, accurate lead that the caller can immediately act on.

A good research lead includes:
- Doctor's full name
- Clinic name
- City and state
- Phone number (verified, not from a random directory)
- Email if available
- Specialization (Dentist or Dermatologist)
- Lead source (How did you find them? Instagram? Google Maps? Referral?)

## How to Create a Lead

1. Click **Leads** in the left sidebar
2. Click the **"+ New Lead"** button (top right)
3. Fill in the form:
   - **Doctor Name** — First and Last name
   - **Clinic Name** — Full clinic name as it appears publicly
   - **Phone** — Include country code (+91 for India)
   - **Email** — If available
   - **City / State** — Where the clinic is located
   - **Specialization** — Choose from the dropdown: Dentist, Dermatologist, etc.
   - **Lead Source** — How did you find this lead? (Cold Call, Instagram, Google Maps, Referral, etc.)
   - **Priority** — Start with Medium unless you have a reason to change
   - **Stage** — Set to **"Research Completed"** once all info is verified
4. Click **Save**

## How to Avoid Adding Duplicate Leads

Before adding a new lead, always search first.

1. Click **Leads** in the sidebar
2. Use the search bar at the top — search by doctor name OR phone number OR clinic name
3. If a result appears, that lead already exists. Update it instead of creating a new one.

> **Why this matters:** Duplicate leads waste everyone's time. Two callers might call the same doctor on the same day. It looks unprofessional and annoys the prospect.

**The golden rule: Search before you add.**

## How to Enrich Data

"Enrich" just means adding more information to a lead. After a lead is created, you might find:
- The doctor's Instagram handle
- Their clinic website
- A secondary phone number

Add all of this. A richer lead profile = better conversations = more conversions.

1. Find the lead in the **Leads** list
2. Click on the lead to open it
3. Click the **Edit** button
4. Add the new information
5. Save

## Research Team Daily Workflow

### Morning Routine (9:00 AM)
- [ ] Log into CRM
- [ ] Check your task list — any pending research tasks from yesterday?
- [ ] Open your lead sources (Google Maps, Instagram, directories)
- [ ] Begin searching for new leads in your assigned city/specialization

### During the Day
- [ ] Add 10–20 new leads (quality over quantity — every field must be correct)
- [ ] Search before adding to avoid duplicates
- [ ] Set stage to "Research Completed" only when ALL information is verified
- [ ] Add a note if something is unclear: "Phone number unverified — found on just directory listing"

### End of Day (6:00 PM)
- [ ] Review all leads you added today — are all fields complete?
- [ ] Any leads where info is missing, flag them with a note explaining what's missing
- [ ] Check with your manager: "X leads added today, Y from [city], Z from [city]"

## Common Mistakes — Research Team

| Mistake | Why It's a Problem | What to Do Instead |
|---|---|---|
| Adding a lead without verifying the phone number | Caller wastes time on wrong/disconnected numbers | Cross-check phone on Google Maps, Justdial, or Instagram |
| Forgetting to set Lead Source | Manager can't track where leads come from | Always set Lead Source before saving |
| Creating duplicate leads | Confuses callers, looks unprofessional | Search first, always |
| Leaving Stage as "New Lead" | Lead won't be picked up by callers | Set to "Research Completed" when ready |
| Adding a clinic instead of a doctor | CRM tracks doctors, not clinics | Fill in the Doctor Name field, not just Clinic Name |

---

# 7. Calling Team Guide

## Your Job in One Sentence
Call the leads in your queue, document every conversation honestly, and keep follow-ups moving.

## How to Find Your Leads

1. Log into the CRM
2. Click **Leads** in the sidebar
3. Use the **"My Leads"** filter (or ask your manager which view to use)
4. Look for leads with stage: **"Research Completed"** — these are ready to call
5. Pick the next lead and open it

## Before Every Call — Quick Prep (2 Minutes)

Before dialing, look at the lead profile:
- What's their specialization? (Dentist vs Dermatologist)
- What city are they in? (Match your pitch to local context)
- Any previous notes? (Has someone talked to them before?)
- What's the lead score? (HOT leads get priority — see Section 11)

## How to Log a Call

After every call — whether you spoke to them or not — log it:

1. Open the lead
2. Go to the **"Activity"** section
3. Click **"Add Activity"**
4. Select **"Call"** as the type
5. Fill in:
   - **Outcome**: Answered / No Answer / Voicemail / Wrong Number / Busy
   - **Duration**: Approximate call length in minutes
   - **Notes**: Write EXACTLY what happened (see note-writing guide below)
   - **Sentiment**: Positive / Neutral / Negative
6. Save

> **Never skip logging a call.** Even if they didn't pick up. Log "No Answer" and move on.

## How to Write Proper Notes

Good notes make your entire team smarter. Bad notes waste everyone's time.

### Good Note Example:
> "Spoke to Dr. Sharma. She's currently with Paytm Health plan, contract ends in March. Interested in comparing pricing. Asked to call back after 15th. Friendly, good candidate. Set follow-up for March 16."

### Bad Note Example:
> "Called. Will call later."

**The good note tells you:**
- What the doctor currently uses (competition intel)
- When to call back (and why)
- How they sounded (positive → good lead to invest time in)

**The bad note tells you nothing.** If you're sick tomorrow and someone else picks this lead up, they have zero information.

### Note-Writing Formula:
```
[Outcome] + [What they said] + [Key objection/interest] + [Next step]
```

Example:
```
Answered. Dr. Mehta is interested but wants to consult with his partner first.
Has concerns about pricing. Send WhatsApp with brochure. Call back next Monday.
```

## How to Update Call Outcomes

After logging the activity, update the **lead stage** based on what happened:

| What Happened | New Stage |
|---|---|
| First call made, no answer | Contacted |
| Spoke to them, they want a callback | Follow-Up Pending |
| They showed genuine interest | Interested |
| Meeting booked | Meeting Scheduled |
| They said no clearly | Rejected |

1. Open the lead
2. Click the **Stage** field
3. Select the new stage
4. Save

## How to Schedule a Follow-Up

1. Open the lead
2. Find the **"Next Follow-Up"** date field
3. Set the date and time you need to call them
4. The CRM will automatically create a follow-up task and remind you in the morning

> **Pro Tip:** Never leave a call logged without setting a next follow-up date (unless they said no completely). Every pending lead needs a next action.

## Calling Team Daily Workflow

### Morning Routine (9:00 AM)
- [ ] Log in to CRM
- [ ] Check **Tasks** — which follow-up calls are due today?
- [ ] Sort leads by priority: HOT first, then WARM, then COLD
- [ ] Check any notes from yesterday's calls

### During the Day
- [ ] Work through your call queue
- [ ] Log every call — no exceptions
- [ ] Update lead stage after each call
- [ ] Set follow-up dates for every pending lead
- [ ] If someone is highly interested, notify your manager immediately

### End of Day (6:00 PM)
- [ ] Check tasks — any follow-ups set for today that you missed?
- [ ] Review all leads you touched — are notes complete?
- [ ] Confirm tomorrow's follow-up list looks right

## Call Handling Examples

### Scenario 1: No Answer
> Doctor doesn't pick up.

Action:
- Log activity: "No Answer"
- Note: "Called at 10:30 AM. No answer."
- Set follow-up for tomorrow morning
- Stage: Remains "Contacted" (or set to "Follow-Up Pending" if you've tried multiple times)

### Scenario 2: They Ask to Call Back Later
> "I'm in surgery, call me at 6 PM."

Action:
- Log activity: "Answered — Call Back Requested"
- Note: "Spoke to receptionist. Doctor in surgery. Call back at 6 PM same day."
- Set follow-up for 6 PM today
- Stage: Follow-Up Pending

### Scenario 3: They're Interested
> "Yes, I'm interested. Tell me more about the pricing."

Action:
- Log activity: "Answered — Positive Response"
- Note: "Interested in pricing. Asked about annual vs monthly plans. Wants a comparison sheet."
- If you have the info, share it now. If not, connect them to sales.
- Stage: Interested
- Notify your manager or sales agent

### Scenario 4: Hard No
> "We're not interested, don't call again."

Action:
- Log activity: "Answered — Rejection"
- Note: "Firm no. Not interested in subscription plans."
- Stage: Rejected
- Do NOT follow up again unless manager specifically instructs

---

# 8. Sales Team Guide

## Your Job in One Sentence
Turn "interested" leads into signed subscribers by running great meetings and handling objections professionally.

## How to Pick Up Interested Leads

1. Log into CRM
2. Click **Leads**
3. Filter by Stage: **"Interested"** or **"Meeting Scheduled"**
4. These are your hot leads to focus on
5. Your manager may also directly assign leads to you

## How to Run a Meeting (Step by Step)

### Before the Meeting
1. Open the lead in CRM
2. Read ALL previous notes — call history, objections, what they're interested in
3. Check their clinic details — city, type, patient volume
4. Prepare your pitch specific to their situation

### During the Meeting
- Start by referencing what was discussed before ("You mentioned your concern about pricing…")
- Walk through the subscription plan clearly
- Answer objections as they come up
- If they say yes: confirm on the call, set up next steps
- If they need time: set a specific follow-up date ("I'll check back with you on Thursday — does that work?")

### After the Meeting
1. Immediately log a "Meeting" activity in CRM
2. Write detailed notes:
   - What you discussed
   - Their specific objections
   - What they liked
   - What the next step is
3. Update the stage:
   - If interested: **Meeting Scheduled** (if follow-up meeting needed)
   - If signed: **Onboarded**
   - If no: **Rejected**

## How to Track Negotiation

Use the **Notes** field as your running deal log. Every conversation, every objection, every concession:

> **"April 3:** Dr. Kapoor asked for 3-month trial instead of annual. Offered 15% discount on annual. He wants to discuss with clinic partner. Follow up April 10."
>
> **"April 10:** Spoke to Dr. Kapoor and his partner Dr. Jain. They agreed on annual plan with 10% discount. Sending agreement today."

This trail is invaluable — if you're sick or leave the company, whoever picks up this lead knows everything.

## How to Close a Deal

When a doctor agrees to sign up:
1. Update Stage to **"Onboarded"**
2. Log a "Meeting" or "Call" activity with note: "Subscription confirmed. Plan type: [annual/monthly]. Start date: [date]."
3. Notify your manager immediately
4. Begin the onboarding process per company procedure

## How to Handle Common Objections

| Objection | Response Strategy |
|---|---|
| "It's too expensive" | Ask what they're currently spending. Show ROI. Offer to compare plans. |
| "We already have a plan" | Ask when their contract ends. Position IDDA for renewal time. Set a reminder. |
| "I need to think about it" | Set a specific follow-up date. Ask what information would help them decide. |
| "I need to consult my partner" | Offer to schedule a call with all decision-makers together. |
| "We don't need this" | Ask about their current patient journey. Find a pain point to address. |

## Sales Team Daily Workflow

### Morning Routine (9:00 AM)
- [ ] Log into CRM
- [ ] Check Stage: "Meeting Scheduled" — any meetings today?
- [ ] Check Stage: "Interested" — any leads to move forward?
- [ ] Review notes from last meeting with each lead

### During the Day
- [ ] Run scheduled meetings
- [ ] Follow up on post-meeting leads
- [ ] Update every lead immediately after contact
- [ ] Flag deal blockers to manager

### End of Day (6:00 PM)
- [ ] Update all lead stages from today's activity
- [ ] Ensure every meeting has a follow-up action logged
- [ ] Confirm tomorrow's meetings are in calendar AND in CRM

---

# 9. Manager Guide

## Your Job in One Sentence
Keep the pipeline healthy, the team accountable, and the deals moving forward.

## How to Monitor Your Team

### Viewing All Leads Across the Team
1. Go to **Leads**
2. Use the **"All Leads"** view (managers see all leads, not just their own)
3. Filter by **Assigned To** to see any specific team member's load

### Checking for Stale Leads
A "stale" lead is one that hasn't been updated in too long. These are danger signs.

1. Go to **Leads**
2. Sort by **"Last Contacted"** date — oldest first
3. Leads with no activity in 3+ days need attention
4. Check the notes: Is there a follow-up set? Or has this lead been forgotten?

## How to Assign Leads

1. Open a lead
2. Find the **"Assigned To"** field
3. Click and select the team member who should own it
4. Save

> **Pro Tip:** When reassigning a lead, always check the notes first and make sure the new owner reads them before making contact.

## How to Track Team Performance

The CRM has built-in KPI tracking. Look for the **Analytics** or **KPIs** section in the sidebar.

Key metrics to review daily:

| Metric | What It Tells You |
|---|---|
| Leads Added Today | Is the research team productive? |
| Calls Made Today | Is the calling team working? |
| Follow-Ups Due Today (vs Completed) | Are callers executing on their follow-ups? |
| Leads in "Interested" Stage | How fat is the top of the funnel? |
| Leads in "Meeting Scheduled" | What's the near-term revenue pipeline? |
| Onboarded This Week | Actual wins |
| Rejected This Week | Understand why — is there a pattern? |

## How to Identify Blocked Deals

A "blocked" deal is one that's been sitting in the same stage for too long.

**Warning signs:**
- Lead has been "Interested" for 7+ days with no activity
- Lead has been "Meeting Scheduled" for 3+ days with no meeting logged
- Lead has 5+ "Follow-Up Pending" entries with no progress

**What to do:**
1. Open the lead
2. Read all the notes
3. Talk to the team member assigned: "What's holding this back?"
4. If the team member is stuck, jump in to help or reassign

## How to Manage Workloads

Fair distribution prevents burnout and keeps the pipeline moving.

1. Go to **Leads**
2. Group by **"Assigned To"**
3. Count leads per person
4. If one caller has 80 leads and another has 20 — redistribute

**Healthy load per team member:**
- Research: 30–50 new leads added per week
- Callers: 40–60 active leads at a time
- Sales: 10–20 active interested/meeting leads at a time

## Manager Daily Operational Routine

### Morning (9:00 AM)
- [ ] Check overnight activity: any leads updated after hours?
- [ ] Review today's follow-up task list: are team members on track?
- [ ] Check "High Priority" leads — are HOT leads being worked?
- [ ] Assign any unassigned leads from last night's imports

### Midday (1:00 PM)
- [ ] Quick pipeline review: how many calls made this morning?
- [ ] Any leads moved to "Interested" today? If so, assign to sales immediately.
- [ ] Check for any team member struggling — offer support

### End of Day (6:00 PM)
- [ ] Full pipeline review: what moved today vs. yesterday?
- [ ] Check stale leads — any leads with no activity in 3 days?
- [ ] Verify all meetings logged for today have notes
- [ ] Review rejected leads: any patterns? (e.g., price objection repeated 10 times → pricing issue to escalate)
- [ ] Plan for tomorrow: which leads need priority attention?

---

# 10. Importing Leads

## What Is a Lead Import?

Instead of adding leads one by one, the CRM lets you add hundreds of leads at once by uploading a list. This is called an "import."

Your research team might build a big spreadsheet of doctor contacts from Google Maps, a hospital directory, or a data provider — and then import the whole list in one go.

## Where Imports Come From

The CRM supports imports from:
- **Apollo.io** — Professional contact database
- **Google Maps** — Clinic listings scraped from maps
- **Instagram** — Doctors found via social media
- **Custom CSV** — Any spreadsheet your team has prepared

## How the Import Works

An import typically involves running a script (a pre-built tool) that takes your data file, cleans it up, and loads it into the CRM.

Your technical point of contact runs the import script like this (for reference):

```bash
cd packages/twenty-apps/internal/idda-crm
npx ts-node scripts/ingest-leads.ts --source=apollo --file=leads-may.json
```

> **What does this do?** It reads the leads file, checks for duplicates, validates phone numbers and email formats, and adds all valid leads to the CRM with stage "New Lead."

## After an Import — What Happens

1. New leads appear in the CRM under **Leads** with stage: **"New Lead"**
2. The CRM marks each imported lead with the import batch ID (so you can find them later)
3. Research team reviews the newly imported leads for accuracy
4. Research team updates them to **"Research Completed"** when verified
5. Calling team picks them up and starts calling

## How to Find Recently Imported Leads

1. Go to **Leads**
2. Use the **"Recently Imported"** view in the sidebar
3. This shows all leads from the latest import batch

## Common Import Problems

| Problem | What It Means | What to Do |
|---|---|---|
| Lead count is less than expected | Some leads failed validation (bad phone format, missing name, etc.) | Check the import log — your technical contact can show you which leads were skipped |
| Duplicate leads not loading | A phone/email already exists in the CRM | This is intentional — the CRM prevents exact duplicates |
| All leads show as "New Lead" | Import doesn't auto-verify | Research team needs to manually verify and update to "Research Completed" |
| Import script fails with error | Usually a file format issue | Check that your CSV has the right column names and no special characters |

---

# 11. Understanding Lead Scores

## What Is a Lead Score?

Every lead in the CRM gets a score automatically calculated based on several factors. This score tells you how likely a lead is to convert into a paying subscriber.

The score is shown as a **band** — a simple label that tells you what priority to give the lead.

## The Three Score Bands

### 🔴 HOT Lead
**What it means:** This doctor/clinic has strong signals of interest and readiness. High priority — call them today.

**Examples of HOT signals:**
- Recently responded positively to a call
- Located in a city where IDDA has active doctors (social proof)
- Works in a high-value specialization with clear need

**What to do:** Put HOT leads at the top of your call queue. Don't let a HOT lead sit untouched for more than 24 hours.

---

### 🟡 WARM Lead
**What it means:** This lead has potential, but needs more work. Medium priority.

**Examples of WARM signals:**
- Phone number verified, hasn't been called yet
- Expressed mild interest but hasn't committed
- Works in target specialization but in a lower-activity city

**What to do:** Call WARM leads after HOT leads. Aim to call all WARM leads within 48 hours.

---

### 🔵 COLD Lead
**What it means:** Low engagement signals, or the lead hasn't been touched in a while. Lower priority.

**Examples of COLD signals:**
- No response after 3+ call attempts
- Lead is in a city/specialization outside IDDA's primary focus
- Data was scraped from a generic directory with low confidence

**What to do:** Don't ignore COLD leads, but don't prioritize them over HOT and WARM. Work through them systematically.

---

## Why Lead Scores Matter

Without scores, every lead looks the same. With scores, callers know exactly who to call first. This means:
- Faster conversions (HOT leads close faster)
- Less time wasted on unresponsive leads
- Better team performance (callers feel the progress)

> **Pro Tip:** Check the lead score before every call. A HOT lead deserves a more prepared, confident pitch than a COLD one.

---

# 12. Tasks & Follow-Ups

## What Is a Task?

A task is a reminder to do something specific — usually a follow-up call, a meeting prep, or an action you promised to take.

Tasks in IDDA's CRM are automatically created in two ways:
1. **You create them manually** — when you set a follow-up date on a lead
2. **The system creates them automatically** — every morning at 8:00 AM, the CRM checks for all leads with a follow-up due today and creates tasks for the assigned team members

## How to See Your Tasks

1. Click **Tasks** in the left sidebar
2. You'll see a list of everything due today, plus upcoming tasks
3. Tasks are sorted by date — today's tasks are at the top

## What a Task Looks Like

Each task tells you:
- **Who**: Which lead the task is about
- **What**: What you need to do (e.g., "Follow-Up Call")
- **When**: The due date and time
- **Priority**: Inherited from the lead's priority level

## How to Complete a Task

1. Open the task (click on it)
2. Do the action (make the call, send the message, hold the meeting)
3. Log the activity on the lead (as described in the Calling Team Guide)
4. Mark the task as **Complete**
5. If you need another follow-up, set a new date on the lead — a new task will be created

## Why Follow-Ups Matter So Much

The hard truth: **most deals don't close on the first call.** Research shows it takes 5–8 touchpoints before a B2B prospect agrees to buy.

If you skip a follow-up:
- The doctor assumes you're not serious
- A competitor might reach them first
- A warm lead goes cold

**Following up consistently is one of the highest-leverage habits** in sales. The CRM makes this effortless — it reminds you automatically so you don't have to remember.

## Best Practices for Tasks

- **Complete tasks the day they're due** — not the day after
- **If you can't complete a task on time, reschedule it** — don't just ignore it
- **Never close a task without logging what happened** — future you (or your teammates) need to know
- **Check your task list first thing every morning** — before opening email or WhatsApp

---

# 13. Daily Operations Guide

## The Daily Rhythm of the CRM

Think of the CRM like a store. It needs to be opened in the morning, kept clean and updated throughout the day, and closed properly at night.

---

## Research Team — Daily Routine

| Time | Action |
|---|---|
| 9:00 AM | Log in. Check tasks. Review yesterday's additions. |
| 9:30 AM – 12:30 PM | Find new leads. Search → Verify → Add to CRM. |
| 12:30 PM | Lunch break |
| 1:30 PM – 5:30 PM | Continue adding leads. Focus on quality verification. |
| 5:30 PM | Review all leads added today. Complete all fields. |
| 6:00 PM | Update manager: "X leads added from [sources]. Y duplicates found and skipped." |

---

## Calling Team — Daily Routine

| Time | Action |
|---|---|
| 9:00 AM | Log in. Review today's follow-up tasks. Prioritize HOT leads. |
| 9:30 AM – 1:00 PM | Peak calling hours — make all urgent follow-up calls first. |
| 1:00 PM | Log the morning's calls. Update all lead stages. |
| 2:00 PM – 5:30 PM | Continue calling. Work WARM leads. |
| 5:30 PM | Set tomorrow's follow-ups. Ensure no lead is left without a next step. |
| 6:00 PM | Report to manager: "X calls made, Y answered, Z follow-ups set, W interested leads." |

---

## Sales Team — Daily Routine

| Time | Action |
|---|---|
| 9:00 AM | Log in. Review "Interested" and "Meeting Scheduled" leads. |
| 9:30 AM | Prep for today's meetings. Read all notes. |
| 10:00 AM – 5:00 PM | Run meetings. Follow up on post-meeting leads. |
| 5:00 PM | Log all meeting activities. Update all lead stages. |
| 5:30 PM | Identify any leads that need manager support. |
| 6:00 PM | Report to manager: "X meetings held, Y moved to Onboarded, Z need follow-up." |

---

## Manager — Daily Routine

| Time | Action |
|---|---|
| 8:45 AM | Review CRM before team logs in. Check overnight activity. |
| 9:00 AM | Stand-up with team (optional): any blockers? Any big opportunities? |
| 10:00 AM | Check HOT leads — are they being actioned? |
| 12:00 PM | Pipeline review: what moved this morning? |
| 3:00 PM | Check for stale leads. Redistribute unbalanced loads. |
| 5:30 PM | End-of-day review. Update leadership if needed. |
| 6:00 PM | Plan tomorrow's priorities. Any imports to schedule? |

---

# 14. Common Problems & Fixes

## Problem: CRM Is Not Opening in the Browser

**Symptoms:** You go to `http://localhost:3000` and see an error or blank page.

**Most common causes:**
1. The server isn't running yet
2. Docker isn't running (database isn't accessible)

**What to do:**
1. Check if Docker Desktop is open — look for the whale icon in your menu bar. If it's not running, open it and wait 1–2 minutes.
2. Check the Terminal where you ran `yarn start` — is it still running? If it stopped, run `yarn start` again.
3. Wait 30–60 seconds after starting and then try the URL again.

---

## Problem: I Can't Log In

**Symptoms:** You enter your email and password and get an error.

**What to do:**
1. Make sure you're using the exact email your manager invited you with
2. Try the "Forgot Password" link
3. If that doesn't work, ask your manager to resend the invitation email
4. Make sure you're connected to the right network (if the CRM is on a private server)

---

## Problem: A Lead I Added Isn't Showing Up

**Symptoms:** You added a lead but can't find it.

**What to do:**
1. Check if you saved — click the lead again after adding and verify the fields
2. Use the search bar to search by the phone number (not just the name)
3. Check filters — you might have a filter active that's hiding it. Clear all filters.
4. If still missing, ask your manager — they can see all leads regardless of filters

---

## Problem: Follow-Up Tasks Aren't Appearing

**Symptoms:** You set a follow-up date on a lead but it doesn't show up in your Tasks.

**What to do:**
1. Verify the follow-up date is set correctly on the lead (open the lead and check)
2. Check if the "Next Follow-Up" field is actually populated with a date
3. Wait until the next morning — the system generates tasks at 8:00 AM each day
4. If the date was in the past, the task should already be in your task list

---

## Problem: Duplicate Leads

**Symptoms:** You find two leads for the same doctor.

**What to do:**
1. Open both leads
2. Decide which one has more complete/accurate information
3. Copy any unique notes from the less complete one to the better one
4. Notify your manager — they can delete the duplicate (employees cannot delete leads)
5. Report it so the research team knows to double-check their search process

---

## Problem: The CRM Is Loading Very Slowly

**Symptoms:** Pages take 5–10 seconds to load.

**What to do:**
1. Try a hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
2. Clear your browser cache
3. Try a different browser
4. If the whole team is experiencing slowness, notify your manager — it may be a server issue

---

## Problem: A Lead's Stage Won't Update

**Symptoms:** You change the stage and save, but it reverts to the old stage.

**What to do:**
1. Make sure you have permission to edit this lead (employees can only edit leads assigned to them)
2. Try refreshing the page and editing again
3. If you don't have editing permission, ask your manager to make the update

---

# 15. Best Practices

## Writing Notes Properly

Good notes are the backbone of the operation. Here are the rules:

**DO:**
- Write what the person actually said
- Include specific objections and specific interests
- Note the best time to call them
- Include context: "His receptionist answers, ask for Dr. Arora directly"
- Write competitor names if mentioned: "Currently using MaxCare plan"

**DON'T:**
- Write vague notes like "will call back"
- Leave the notes field empty
- Write in shorthand only you understand
- Delete old notes (scroll down to see history — never erase it)

---

## Avoiding Duplicate Leads

1. **Before adding any lead:** Search by phone number first. If found, update, don't add.
2. **Use full names:** "Dr. Priya Sharma" not "Dr P Sharma" — prevents search misses.
3. **Research team morning rule:** Every morning, the first 5 minutes = check if any of yesterday's leads already existed.

---

## Managing Follow-Ups

- Every lead in "Follow-Up Pending" must have a "Next Follow-Up" date
- Never let more than 5 business days pass without touching a Follow-Up Pending lead
- If a lead doesn't respond after 5 attempts over 2 weeks, flag it to your manager — don't just abandon it

---

## Maintaining Clean Data

- City names should be consistent: "Mumbai" not "Bombay"
- State should be consistent: "Maharashtra" not "MH" or "Mah"
- Phone numbers should include country code: "+91-98201-XXXXX"
- Specialization should always be chosen from the dropdown, never typed manually

---

## Team Discipline

| Rule | Why |
|---|---|
| Update the CRM within 30 minutes of any call | Memory fades. Notes written later are less accurate. |
| Never close your laptop without setting tomorrow's follow-ups | One missed follow-up = one lost opportunity |
| Check the CRM before calling a lead | Always read the notes. Never call blind. |
| Notify manager of HOT leads immediately | Speed matters — hot leads go cold fast |

---

# 16. Scaling the CRM

## What Happens as You Grow

Right now, maybe you have 500 leads. In six months, you might have 5,000. The CRM is built to handle this — but your team's habits need to keep up.

Here's what changes as you scale:

### Lead Volume
- More leads = more duplicate risk → Research team must be even more disciplined about searching before adding
- More leads = slower search if data is messy → Clean data becomes critical

### Team Size
- More callers = leads need to be distributed fairly → Manager needs to check workloads daily
- More salespeople = pipeline coordination needed → Daily pipeline calls become essential

### Follow-Up Discipline
- The bigger the lead base, the more follow-ups pile up
- If your callers don't work through follow-ups daily, the queue becomes unmanageable within weeks
- Set a rule: **no caller should have more than 20 overdue follow-ups at any time**

## Why Clean Operations Matter More at Scale

When you have 100 leads, a mistake is easy to spot and fix. When you have 10,000 leads, a systematic mistake (like always forgetting to set follow-up dates) creates thousands of orphaned leads that no one is working.

**The habits you build today determine the quality of your data tomorrow.**

## Why Documentation Matters

If your best caller leaves, and they have no notes in the CRM — you lose everything they knew about their leads. Every conversation, every objection, every promise — gone.

If they write proper notes, the next caller can pick up exactly where they left off. That's the difference between a system that survives team changes and one that collapses.

---

# 17. Advanced Features (Coming Soon)

These are capabilities IDDA is building into the CRM. When they go live, this guide will be updated. Here's a plain-English preview:

## AI Lead Summaries

**What it will do:** After a few calls and notes, the CRM's AI will automatically write a one-paragraph summary of where the lead stands — so you don't have to read through 10 separate call notes.

**Why it matters:** Saves 2–3 minutes per lead when doing reviews. Especially useful for managers doing end-of-week pipeline checks.

## AI Next Action Recommendations

**What it will do:** Based on the lead's history, the AI will suggest what to do next — "Try calling Tuesday afternoon, that's when they're usually available" or "This lead's objection is pricing — lead with the annual plan discount."

**Why it matters:** Takes the guesswork out of lead strategy. Especially useful for newer callers and sales agents.

## WhatsApp Automations

**What it will do:** The CRM will be able to automatically send pre-approved WhatsApp messages to leads based on triggers — for example, sending a welcome message when a lead moves to "Interested."

**Why it matters:** Reduces manual messaging work. Keeps follow-ups happening even outside calling hours.

## Lead Intelligence Dashboard

**What it will do:** A dashboard showing which types of leads convert best (which cities, which specializations, which lead sources), so the research team can focus on finding more of those.

**Why it matters:** Smarter prospecting = less wasted effort = more deals closed.

---

# 18. Final Team Operating Rules

## The IDDA CRM Code of Operations

These are the non-negotiable standards for how every team member uses the CRM. These aren't just suggestions — they're the operational foundation of the company.

---

### Rule 1 — Update Every Lead, Every Time

Every interaction with a lead — call, message, meeting, voicemail — must be logged in the CRM before you move to the next task.

> **No exceptions. Even a 30-second call gets a 30-second log.**

---

### Rule 2 — Never Leave Follow-Ups Blank

Every lead that isn't won or rejected must have a "Next Follow-Up" date set.

If you don't know when to follow up, the answer is "in 3 days." Set it. The CRM will remind you.

> **An un-followed-up lead is a dead lead.**

---

### Rule 3 — Document Everything

Notes are institutional memory. When you write a note, you're not just writing for yourself — you're writing for the next person who works this lead, for your manager, and for future you when you've forgotten the details.

> **Write notes as if your manager will read them tomorrow morning. Because they will.**

---

### Rule 4 — Avoid Duplicate Work

Before adding a lead: search. Before calling a lead: check if a colleague has already called them. The CRM shows you this — use it.

> **Duplicates waste time, look unprofessional, and annoy doctors. Zero tolerance.**

---

### Rule 5 — Maintain Pipeline Hygiene

"Pipeline hygiene" means keeping your lead list accurate and current. This means:
- Moving leads to the correct stage promptly
- Rejecting leads that are clearly not going to convert (don't hoard)
- Reassigning leads you can't work within 48 hours

> **A clean pipeline is a trustworthy pipeline. A messy one is just noise.**

---

### Rule 6 — Communicate Wins and Blockers Fast

- Got an Interested lead? Tell your manager within the hour.
- Got an Onboarded deal? Message the team group — celebrate wins.
- Stuck on a lead for 5+ days? Ask for help. Don't sit on it silently.

> **Speed matters in sales. Information that travels fast enables the team to move fast.**

---

### Rule 7 — Own Your Leads

Leads assigned to you are your responsibility. Not your manager's, not your colleague's.

- If you're going to be away, reassign them.
- If you're behind on follow-ups, catch up or ask for help.
- If a lead is going cold, escalate.

> **"I forgot" is not an acceptable reason for a missed follow-up. The CRM reminded you. The question is whether you acted.**

---

### Rule 8 — Respect the Score

HOT leads get called first. WARM leads get called within 2 days. COLD leads get called in rotation.

Don't cherrypick. Don't call only the easy ones. Work the system as designed.

> **The score system exists because not all leads are equal. Use it.**

---

## Welcome Aboard

This CRM is your operational headquarters. The team that uses it consistently, updates it honestly, and follows the rules in this manual will outperform any team that doesn't — every single time.

Start every day with the CRM open. End every day with your CRM clean. And when in doubt, write it down.

---

*IDDA Assurance — Operations Manual v1.0*
*Document last updated: May 2026*
*For questions, contact your direct manager.*
