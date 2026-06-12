/**
 * IDDA Assurance — Email Enrichment Script
 *
 * For each lead that has a website URL but no email, scrapes the clinic's
 * website (homepage → /contact → /about) to find a contact email address.
 * Also backfills the `websiteAddress` plain-text field from websitePrimaryLinkUrl.
 *
 * Rules:
 *   - Never overwrites a field that already has a value.
 *   - Skips chain clinic domains (sabkadentist.com — no per-location email).
 *   - Skips unreachable / timed-out sites gracefully.
 *   - Supports --dry-run for safe preview.
 *
 * Usage:
 *   TWENTY_API_KEY=<key> npx tsx scripts/enrich-email.ts
 *   TWENTY_API_KEY=<key> npx tsx scripts/enrich-email.ts --dry-run
 *   TWENTY_API_KEY=<key> npx tsx scripts/enrich-email.ts --id <leadId>
 */

const API_URL = process.env.TWENTY_API_URL ?? 'http://localhost:3000';
const API_KEY = process.env.TWENTY_API_KEY ?? '';

if (!API_KEY) {
  console.error('❌  TWENTY_API_KEY env var is required.');
  process.exit(1);
}

// ── Types ─────────────────────────────────────────────────────────────────────

type LeadRecord = {
  id: string;
  clinicName: string;
  emailsPrimaryEmail: string | null;
  websiteAddress: string | null;
  websitePrimaryLinkUrl: string | null;
  importBatchId: string | null;
};

type EmailPatch = {
  emails?: { primaryEmail: string };
  websiteAddress?: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────

// Chain clinic domains that share a single info email — not useful per location
const CHAIN_DOMAINS = new Set([
  'sabkadentist.com',
  'sabkadentist.in',
]);

// Paths to try in order — stop at first email found
const CONTACT_PATHS = ['', '/contact', '/contact-us', '/about', '/about-us'];

const FETCH_TIMEOUT_MS = 8000;

// Regex to find email addresses in HTML
const EMAIL_RE = /\b[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}\b/g;

// Domains (and their subdomains) to ignore — analytics, CDNs, social, Wix internals
const JUNK_DOMAIN_SUFFIXES = [
  'example.com', 'sentry.io', 'wixpress.com', 'wix.com', 'googleapis.com',
  'googletagmanager.com', 'facebook.com', 'twitter.com', 'instagram.com',
  'w3.org', 'schema.org', 'openstreetmap.org', 'cloudflare.com', 'amazonaws.com',
  'sendgrid.net', 'mailchimp.com', 'klaviyo.com',
];

function isJunkDomain(domain: string): boolean {
  const d = domain.toLowerCase();
  return JUNK_DOMAIN_SUFFIXES.some((s) => d === s || d.endsWith(`.${s}`));
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function isChainClinic(url: string): boolean {
  const domain = extractDomain(url);
  return domain != null && CHAIN_DOMAINS.has(domain);
}

function pickBestEmail(emails: string[], siteHostname: string): string | null {
  const siteDomain = siteHostname.replace(/^www\./, '');
  // Prefer emails on the clinic's own domain
  const ownDomain = emails.find((e) => e.endsWith(`@${siteDomain}`));
  if (ownDomain) return ownDomain.toLowerCase();

  // Filter out junk domains and noreply/do-not-reply
  const clean = emails.filter((e) => {
    const [local, domain] = e.split('@');
    if (!domain) return false;
    if (isJunkDomain(domain)) return false;
    if (/no.?reply|do.not.reply|noreply|bounce|mailer-daemon/i.test(local)) return false;
    // Skip image/asset file extensions disguised as emails
    if (/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff)$/i.test(domain)) return false;
    return true;
  });

  return clean.length > 0 ? clean[0].toLowerCase() : null;
}

async function fetchHtml(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IDDABot/1.0; +https://idda.in)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('html')) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function scrapeEmailFromSite(websiteUrl: string): Promise<string | null> {
  let baseUrl: URL;
  try {
    baseUrl = new URL(websiteUrl);
  } catch {
    return null;
  }

  if (isChainClinic(websiteUrl)) return null;

  for (const path of CONTACT_PATHS) {
    const url = `${baseUrl.origin}${path}`;
    const html = await fetchHtml(url);
    if (!html) continue;

    // Extract mailto: hrefs first (most reliable)
    const mailtoEmails: string[] = [];
    const mailtoRe = /mailto:([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/gi;
    let m: RegExpExecArray | null;
    while ((m = mailtoRe.exec(html)) !== null) {
      mailtoEmails.push(m[1]);
    }

    if (mailtoEmails.length > 0) {
      const best = pickBestEmail(mailtoEmails, baseUrl.hostname);
      if (best) return best;
    }

    // Fall back to bare email regex in text
    const allEmails = [...new Set(html.match(EMAIL_RE) ?? [])];
    const best = pickBestEmail(allEmails, baseUrl.hostname);
    if (best) return best;
  }

  return null;
}

// ── GraphQL helpers ────────────────────────────────────────────────────────────

async function gql(query: string, variables?: Record<string, unknown>): Promise<unknown> {
  const url = API_URL.replace('localhost', '[::1]');
  const res = await fetch(`${url}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data?: unknown; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data;
}

async function fetchLeads(leadId?: string): Promise<LeadRecord[]> {
  const filterPart = leadId
    ? `filter: { id: { eq: "${leadId}" } }`
    : `filter: {
        and: [
          { or: [{ emails: { primaryEmail: { is: NULL } } }, { emails: { primaryEmail: { eq: "" } } }] },
          { website: { primaryLinkUrl: { is: NOT_NULL } } },
          { website: { primaryLinkUrl: { neq: "" } } }
        ]
      }`;

  const data = (await gql(`
    query EmailEnrichFetch {
      leads(${filterPart}, first: 500) {
        edges {
          node {
            id
            clinicName
            emails { primaryEmail }
            websiteAddress
            website { primaryLinkUrl }
            importBatchId
          }
        }
      }
    }
  `)) as {
    leads: {
      edges: {
        node: {
          id: string;
          clinicName: string;
          emails: { primaryEmail: string | null } | null;
          websiteAddress: string | null;
          website: { primaryLinkUrl: string | null } | null;
          importBatchId: string | null;
        };
      }[];
    };
  };

  return data.leads.edges.map((e) => ({
    id: e.node.id,
    clinicName: e.node.clinicName,
    emailsPrimaryEmail: e.node.emails?.primaryEmail ?? null,
    websiteAddress: e.node.websiteAddress ?? null,
    websitePrimaryLinkUrl: e.node.website?.primaryLinkUrl ?? null,
    importBatchId: e.node.importBatchId,
  }));
}

async function updateLead(id: string, patch: EmailPatch): Promise<void> {
  await gql(
    `mutation EmailEnrichUpdate($id: ID!, $data: LeadUpdateInput!) {
      updateLead(id: $id, data: $data) { id }
    }`,
    { id, data: patch },
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const leadId = (() => {
    const i = args.indexOf('--id');
    return i >= 0 ? args[i + 1] : undefined;
  })();

  console.log('\n📧  IDDA Lead Enrichment — Email Pass');
  console.log(`   Server:    ${API_URL}`);
  console.log(`   Dry run:   ${dryRun}`);
  if (leadId) console.log(`   Lead ID:   ${leadId}`);
  console.log('');

  const leads = await fetchLeads(leadId);
  console.log(`📋  Fetched ${leads.length} leads to process\n`);

  const stats = { email: 0, websiteAddress: 0, skippedChain: 0, noSite: 0, notFound: 0, failed: 0 };

  for (const lead of leads) {
    const label = lead.clinicName || lead.id;
    const siteUrl = lead.websitePrimaryLinkUrl;

    if (!siteUrl) {
      console.log(`  ⏭  ${label} — no website URL`);
      stats.noSite++;
      continue;
    }

    if (isChainClinic(siteUrl)) {
      console.log(`  ⛓  ${label} — chain clinic, skipping`);
      stats.skippedChain++;
      continue;
    }

    const domain = extractDomain(siteUrl);
    process.stdout.write(`  🔍  ${label} (${domain}) … `);

    const email = await scrapeEmailFromSite(siteUrl);

    const patch: EmailPatch = {};
    if (email && !lead.emailsPrimaryEmail) {
      patch.emails = { primaryEmail: email };
    }
    // Backfill websiteAddress (plain text) from the website URL
    if (!lead.websiteAddress && siteUrl) {
      patch.websiteAddress = siteUrl;
    }

    if (Object.keys(patch).length === 0) {
      console.log('no new data');
      stats.notFound++;
      continue;
    }

    if (dryRun) {
      console.log(`[DRY-RUN] → ${JSON.stringify(patch)}`);
      if (patch.emails) stats.email++;
      if (patch.websiteAddress) stats.websiteAddress++;
      continue;
    }

    try {
      await updateLead(lead.id, patch);
      const parts: string[] = [];
      if (patch.emails) { parts.push(`email: ${patch.emails.primaryEmail}`); stats.email++; }
      if (patch.websiteAddress) { parts.push('websiteAddress ✓'); stats.websiteAddress++; }
      console.log(parts.join(', '));
    } catch (err) {
      console.log(`FAILED: ${(err as Error).message}`);
      stats.failed++;
    }

    // Polite delay between website requests
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log('\n─────────────────────────────────────────────────');
  console.log(`📧  Emails found:        ${stats.email}`);
  console.log(`🌐  websiteAddress set:  ${stats.websiteAddress}`);
  console.log(`⛓   Chain clinics skip:  ${stats.skippedChain}`);
  console.log(`⏭   No website URL:      ${stats.noSite}`);
  console.log(`❓  Email not found:     ${stats.notFound}`);
  console.log(`❌  Errors:              ${stats.failed}`);
  console.log('─────────────────────────────────────────────────\n');
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
