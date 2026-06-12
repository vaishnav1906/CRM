/**
 * IDDA Assurance — Retroactive Lead Enrichment Script
 *
 * Fixes existing MedLeads records that are missing:
 *   - specialization  (inferred from clinic name + importBatchId)
 *   - town            (extracted from importBatchId pattern "X in TOWN CITY")
 *   - city            (extracted from importBatchId or kept as-is)
 *   - state           (derived from city via Indian city→state map)
 *   - email           (kept null here — requires a separate Practo/website pass)
 *
 * Rules:
 *   - Never overwrites a field that already has a value.
 *   - Skips leads where nothing would change.
 *   - Supports --dry-run for safe preview.
 *
 * Usage:
 *   TWENTY_API_KEY=<key> npx tsx scripts/enrich-existing-leads.ts
 *   TWENTY_API_KEY=<key> npx tsx scripts/enrich-existing-leads.ts --dry-run
 *   TWENTY_API_KEY=<key> npx tsx scripts/enrich-existing-leads.ts --batch-id "Dentist in Bandra Mumbai"
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
  doctorName: { firstName: string | null; lastName: string | null };
  specialization: string | null;
  emailsPrimaryEmail: string | null;
  town: string | null;
  city: string | null;
  state: string | null;
  importBatchId: string | null;
  enrichmentSource: string | null;
};

type EnrichmentPatch = {
  specialization?: string;
  town?: string;
  city?: string;
  state?: string;
};

// ── Specialization keyword rules ──────────────────────────────────────────────

const SPECIALIZATION_RULES: Array<{ pattern: RegExp; value: string }> = [
  {
    pattern:
      /dental|dentist|dentistry|orthodont|periodont|endodont|oral\s*surg|cosmetic\s*dent|implant|braces|smile\s*(clinic|studio|care|dental|dentist)|tooth|teeth|dent\s*(care|clinic|heal|bandra|hub|world)/i,
    value: 'DENTIST',
  },
  {
    pattern:
      /dermat|skin\s*(clinic|care|studio|hair|laser|and)|cosmetolog|tricholog|hair\s*(clinic|care|laser)|laser\s*(clinic|care|skin)|aesthetic|skinworks|skin\s*&|&\s*hair|hair\s*&/i,
    value: 'DERMATOLOGIST',
  },
  { pattern: /pediatr|paediatr|child\s*(specialist|care|clinic)|children/i, value: 'PEDIATRICIAN' },
  { pattern: /\bent\b|ear\s*nose|otolaryngol/i, value: 'ENT' },
  { pattern: /ophthal|eye\s*(care|clinic|hospital|center)|vision\s*care/i, value: 'OPHTHALMOLOGIST' },
  { pattern: /gynecol|gynaecol|women.s\s*(clinic|care|hospital)|maternity|obs\s*&\s*gyn/i, value: 'GYNECOLOGIST' },
  { pattern: /orthop|orthopaed|bone\s*(and|&)\s*joint|joint\s*(care|clinic)|spine/i, value: 'ORTHOPEDIC' },
  {
    pattern:
      /general\s*(physician|practice|doctor|clinic)|family\s*(medicine|doctor|clinic)|medical\s*(center|clinic|centre)|health\s*(center|clinic|centre)|multispecial|multi.special/i,
    value: 'GENERAL_PHYSICIAN',
  },
];

// ImportBatchId often encodes the search query: "Dentist in Kandivali Mumbai"
// This prefix map covers the query terms used in MedLeads exports.
const BATCH_ID_SPEC_MAP: Record<string, string> = {
  dentist: 'DENTIST',
  dental: 'DENTIST',
  dermatologist: 'DERMATOLOGIST',
  dermatology: 'DERMATOLOGIST',
  'skin clinic': 'DERMATOLOGIST',
  pediatrician: 'PEDIATRICIAN',
  pediatrics: 'PEDIATRICIAN',
  'child specialist': 'PEDIATRICIAN',
  ent: 'ENT',
  ophthalmologist: 'OPHTHALMOLOGIST',
  'eye clinic': 'OPHTHALMOLOGIST',
  gynecologist: 'GYNECOLOGIST',
  orthopedic: 'ORTHOPEDIC',
  'general physician': 'GENERAL_PHYSICIAN',
};

// ── Indian city → state map ───────────────────────────────────────────────────

const CITY_STATE_MAP: Record<string, string> = {
  mumbai: 'Maharashtra', pune: 'Maharashtra', nagpur: 'Maharashtra',
  thane: 'Maharashtra', nashik: 'Maharashtra', aurangabad: 'Maharashtra',
  delhi: 'Delhi', 'new delhi': 'Delhi',
  bangalore: 'Karnataka', bengaluru: 'Karnataka', mysore: 'Karnataka',
  hyderabad: 'Telangana', warangal: 'Telangana',
  chennai: 'Tamil Nadu', coimbatore: 'Tamil Nadu', madurai: 'Tamil Nadu',
  kolkata: 'West Bengal', howrah: 'West Bengal',
  ahmedabad: 'Gujarat', surat: 'Gujarat', vadodara: 'Gujarat',
  jaipur: 'Rajasthan', jodhpur: 'Rajasthan', udaipur: 'Rajasthan',
  lucknow: 'Uttar Pradesh', noida: 'Uttar Pradesh', agra: 'Uttar Pradesh',
  kanpur: 'Uttar Pradesh', varanasi: 'Uttar Pradesh', ghaziabad: 'Uttar Pradesh',
  chandigarh: 'Punjab',
  bhopal: 'Madhya Pradesh', indore: 'Madhya Pradesh', gwalior: 'Madhya Pradesh',
  patna: 'Bihar', gaya: 'Bihar',
  kochi: 'Kerala', thiruvananthapuram: 'Kerala', kozhikode: 'Kerala',
  gurgaon: 'Haryana', gurugram: 'Haryana', faridabad: 'Haryana',
  bhubaneswar: 'Odisha', cuttack: 'Odisha',
  guwahati: 'Assam',
  ranchi: 'Jharkhand',
  raipur: 'Chhattisgarh',
};

function inferStateFromCity(city: string | null): string | null {
  if (!city) return null;
  return CITY_STATE_MAP[city.toLowerCase().trim()] ?? null;
}

// ── Specialization inference ──────────────────────────────────────────────────

function inferSpecFromText(text: string | null | undefined): string | null {
  if (!text) return null;
  for (const { pattern, value } of SPECIALIZATION_RULES) {
    if (pattern.test(text)) return value;
  }
  return null;
}

// Extract specialization from importBatchId like "Dentist in Kandivali Mumbai"
function inferSpecFromBatchId(batchId: string | null): string | null {
  if (!batchId) return null;
  const lower = batchId.toLowerCase().trim();
  for (const [key, val] of Object.entries(BATCH_ID_SPEC_MAP)) {
    if (lower.startsWith(key)) return val;
  }
  return null;
}

// ── Location extraction from importBatchId ────────────────────────────────────

type BatchLocation = { town: string | null; city: string | null };

// Pattern: "Dentist in Kandivali Mumbai" → town=Kandivali, city=Mumbai
// Pattern: "Dentist in Mumbai"           → town=null, city=Mumbai
function extractLocationFromBatchId(batchId: string | null): BatchLocation {
  if (!batchId) return { town: null, city: null };
  // Match "in WORD1 WORD2" or "in WORD1"
  const match = batchId.match(/\bin\s+([A-Za-z]+(?:\s+[A-Za-z]+)*)/i);
  if (!match) return { town: null, city: null };
  const parts = match[1].trim().split(/\s+/);
  if (parts.length === 1) return { town: null, city: parts[0] };
  // Last word is the city; everything before is the town
  const city = parts[parts.length - 1];
  const town = parts.slice(0, -1).join(' ');
  return { town, city };
}

// ── Build enrichment patch for a single lead ──────────────────────────────────

function buildPatch(lead: LeadRecord): EnrichmentPatch | null {
  const patch: EnrichmentPatch = {};

  // Specialization
  if (!lead.specialization) {
    const spec =
      inferSpecFromBatchId(lead.importBatchId) ??
      inferSpecFromText(lead.clinicName) ??
      inferSpecFromText(lead.importBatchId);
    if (spec) patch.specialization = spec;
  }

  // Town / city from importBatchId
  const loc = extractLocationFromBatchId(lead.importBatchId);
  if (!lead.town && loc.town) patch.town = loc.town;
  if (!lead.city && loc.city) patch.city = loc.city;

  // City fallback: already on lead — don't touch
  const effectiveCity = patch.city ?? lead.city;

  // State inferred from city
  if (!lead.state) {
    const state = inferStateFromCity(effectiveCity);
    if (state) patch.state = state;
  }

  return Object.keys(patch).length > 0 ? patch : null;
}

// ── GraphQL helpers ────────────────────────────────────────────────────────────

async function gql(query: string, variables?: Record<string, unknown>): Promise<unknown> {
  // Server binds to IPv6 (::1) — resolve localhost to [::1] explicitly
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

async function fetchLeads(batchIdFilter?: string): Promise<LeadRecord[]> {
  const filterPart = batchIdFilter
    ? `filter: { importBatchId: { eq: "${batchIdFilter}" } }`
    : 'filter: { or: [{ specialization: { is: NULL } }, { state: { is: NULL } }, { town: { is: NULL } }] }';

  const data = (await gql(`
    query EnrichFetch {
      leads(${filterPart}, first: 2000) {
        edges {
          node {
            id
            clinicName
            doctorName { firstName lastName }
            specialization
            emails { primaryEmail }
            town
            city
            state
            importBatchId
            enrichmentSource
          }
        }
      }
    }
  `)) as { leads: { edges: { node: LeadRecord & { emails?: { primaryEmail?: string } } }[] } };

  return data.leads.edges.map((e) => ({
    ...e.node,
    emailsPrimaryEmail: (e.node as { emails?: { primaryEmail?: string } }).emails?.primaryEmail ?? null,
  }));
}

async function updateLead(id: string, patch: EnrichmentPatch): Promise<void> {
  await gql(
    `mutation EnrichLead($id: ID!, $data: LeadUpdateInput!) {
      updateLead(id: $id, data: $data) { id }
    }`,
    { id, data: patch },
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const batchIdFilter = (() => {
    const i = args.indexOf('--batch-id');
    return i >= 0 ? args[i + 1] : undefined;
  })();

  console.log('\n🔬  IDDA Lead Enrichment — Retroactive Pass');
  console.log(`   Server:    ${API_URL}`);
  console.log(`   Dry run:   ${dryRun}`);
  if (batchIdFilter) console.log(`   Batch ID:  ${batchIdFilter}`);
  console.log('');

  const leads = await fetchLeads(batchIdFilter);
  console.log(`📋  Fetched ${leads.length} leads to evaluate\n`);

  const stats = { patched: 0, skipped: 0, failed: 0 };
  const changes: Record<string, number> = {};

  for (const lead of leads) {
    const label = `${lead.doctorName?.firstName ?? ''} ${lead.doctorName?.lastName ?? ''} / ${lead.clinicName}`.trim();
    const patch = buildPatch(lead);

    if (!patch) {
      stats.skipped++;
      continue;
    }

    // Track which fields are being enriched
    for (const key of Object.keys(patch)) changes[key] = (changes[key] ?? 0) + 1;

    if (dryRun) {
      console.log(`  ✅  [DRY-RUN] ${label}`);
      console.log(`       ${JSON.stringify(patch)}`);
      stats.patched++;
      continue;
    }

    try {
      await updateLead(lead.id, patch);
      console.log(`  ✅  ${label} → ${JSON.stringify(patch)}`);
      stats.patched++;
    } catch (err) {
      console.error(`  ❌  ${label}: ${(err as Error).message}`);
      stats.failed++;
    }
  }

  console.log('\n─────────────────────────────────────────────────');
  console.log(`✅  Enriched:   ${stats.patched}`);
  console.log(`⏭   Skipped:    ${stats.skipped}  (already complete)`);
  console.log(`❌  Failed:     ${stats.failed}`);
  if (Object.keys(changes).length > 0) {
    console.log('\n📊  Fields populated:');
    for (const [field, count] of Object.entries(changes)) {
      console.log(`     ${field.padEnd(20)} ${count}`);
    }
  }
  console.log('─────────────────────────────────────────────────\n');
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
