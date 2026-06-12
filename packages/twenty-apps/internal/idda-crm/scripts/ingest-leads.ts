/**
 * IDDA Assurance — Lead Ingestion Script (Phase 2 upgrade)
 *
 * Accepts a JSON file (or array) from research/crawler tools and:
 *  1. Deduplicates by phone, email, externalId, and clinic+city similarity
 *  2. Creates new leads via the Twenty GraphQL API
 *  3. Sets enrichmentStatus, importedAt, and all ingestion metadata
 *  4. Supports dry-run mode and bulk upserts
 *
 * Usage:
 *   npx ts-node scripts/ingest-leads.ts --file ./leads-batch.json --source GoogleMaps --confidence 80
 *   npx ts-node scripts/ingest-leads.ts --file ./leads-batch.json --source Instagram --confidence 65 --dry-run
 *
 * Input JSON format (array of objects):
 * [
 *   {
 *     "externalId": "gmaps_abc123",               // optional: external system ID
 *     "doctorFirstName": "Anita",
 *     "doctorLastName": "Kulkarni",
 *     "clinicName": "Kulkarni Dental",
 *     "phone": "+919876543210",
 *     "email": "anita@kulkarnidental.com",
 *     "city": "Pune",
 *     "state": "Maharashtra",
 *     "specialization": "DENTIST",
 *     "website": "https://kulkarnidental.com",
 *     "instagram": "https://instagram.com/kulkarnidental",
 *     "leadSource": "SCRAPER",
 *     "scrapedAt": "2026-05-28T10:00:00Z"
 *   }
 * ]
 */

import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { inferSpecializationFromText } from '../src/import-system/normalizers/lead-normalizer';

const API_URL = process.env.TWENTY_API_URL ?? 'http://localhost:3000';
const API_KEY = process.env.TWENTY_API_KEY ?? '';

if (!API_KEY) {
  console.error('❌  TWENTY_API_KEY env var is required.');
  process.exit(1);
}

// ── Types ─────────────────────────────────────────────────────────────────────

type LeadInput = {
  externalId?: string;
  doctorFirstName?: string;
  doctorLastName?: string;
  clinicName?: string;
  phone?: string;
  email?: string;
  town?: string;
  city?: string;
  state?: string;
  specialization?: string;
  websiteAddress?: string;
  website?: string;
  instagram?: string;
  leadSource?: string;
  scrapedAt?: string;
};

type IngestOptions = {
  file: string;
  source: string;
  confidence: number;
  dryRun: boolean;
};

type DupeReason = 'phone' | 'email' | 'externalId' | 'clinic+city';

// ── GraphQL helpers ────────────────────────────────────────────────────────────

async function gql(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data?: unknown; errors?: unknown[] };
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

// ── Deduplication ──────────────────────────────────────────────────────────────

async function findByPhone(phone: string): Promise<boolean> {
  const normalised = phone.replace(/\D/g, '');
  const data = (await gql(`
    query CheckPhone {
      leads(filter: { phones: { primaryPhoneNumber: { like: "%${normalised.slice(-10)}%" } } }, first: 1) {
        edges { node { id } }
      }
    }
  `)) as { leads: { edges: { node: { id: string } }[] } };
  return data.leads.edges.length > 0;
}

async function findByEmail(email: string): Promise<boolean> {
  const data = (await gql(`
    query CheckEmail {
      leads(filter: { emails: { primaryEmail: { eq: "${email}" } } }, first: 1) {
        edges { node { id } }
      }
    }
  `)) as { leads: { edges: { node: { id: string } }[] } };
  return data.leads.edges.length > 0;
}

async function findByExternalId(externalId: string): Promise<boolean> {
  const data = (await gql(`
    query CheckExternalId {
      leads(filter: { externalId: { eq: "${externalId}" } }, first: 1) {
        edges { node { id } }
      }
    }
  `)) as { leads: { edges: { node: { id: string } }[] } };
  return data.leads.edges.length > 0;
}

// Clinic + city similarity: exact clinic name match in same city
async function findByClinicAndCity(clinicName: string, city: string): Promise<boolean> {
  const escapedClinic = clinicName.replace(/"/g, '\\"');
  const escapedCity = city.replace(/"/g, '\\"');
  const data = (await gql(`
    query CheckClinicCity {
      leads(filter: {
        and: [
          { clinicName: { like: "%${escapedClinic}%" } },
          { city: { like: "%${escapedCity}%" } }
        ]
      }, first: 1) {
        edges { node { id } }
      }
    }
  `)) as { leads: { edges: { node: { id: string } }[] } };
  return data.leads.edges.length > 0;
}

async function checkDuplicates(lead: LeadInput): Promise<DupeReason | null> {
  if (lead.externalId) {
    if (await findByExternalId(lead.externalId)) return 'externalId';
  }
  if (lead.phone) {
    if (await findByPhone(lead.phone)) return 'phone';
  }
  if (lead.email) {
    if (await findByEmail(lead.email)) return 'email';
  }
  if (lead.clinicName && lead.city) {
    if (await findByClinicAndCity(lead.clinicName, lead.city)) return 'clinic+city';
  }
  return null;
}

// ── Enrichment status heuristic ────────────────────────────────────────────────

function computeEnrichmentStatus(lead: LeadInput, confidence: number): string {
  const hasPhone = Boolean(lead.phone);
  const hasEmail = Boolean(lead.email);
  const hasClinic = Boolean(lead.clinicName);
  const hasSpecialization = Boolean(lead.specialization);
  const hasCity = Boolean(lead.city);

  const score = [hasPhone, hasEmail, hasClinic, hasSpecialization, hasCity].filter(Boolean).length;

  if (confidence >= 80 && score >= 4) return 'ENRICHED';
  if (confidence >= 60 && score >= 3) return 'PENDING';
  if (score < 2) return 'FAILED';
  return 'PENDING';
}

// ── Lead creation ──────────────────────────────────────────────────────────────

async function createLead(
  lead: LeadInput,
  batchId: string,
  source: string,
  confidence: number,
): Promise<string> {
  const enrichmentStatus = computeEnrichmentStatus(lead, confidence);
  const now = new Date().toISOString();

  const data = (await gql(
    `mutation CreateLead($data: LeadCreateInput!) {
      createLead(data: $data) { id doctorName { firstName lastName } stage }
    }`,
    {
      data: {
        doctorName: {
          firstName: lead.doctorFirstName ?? '',
          lastName: lead.doctorLastName ?? '',
        },
        clinicName: lead.clinicName ?? '',
        phones: lead.phone
          ? {
              primaryPhoneNumber: lead.phone.replace(/[^0-9]/g, '').slice(-10),
              primaryPhoneCountryCode: 'IN',
              primaryPhoneCallingCode: '+91',
            }
          : undefined,
        emails: lead.email ? { primaryEmail: lead.email } : undefined,
        town: lead.town ?? null,
        city: lead.city,
        state: lead.state,
        specialization:
          lead.specialization ??
          inferSpecializationFromText(lead.clinicName) ??
          inferSpecializationFromText(batchId),
        websiteAddress: lead.websiteAddress ?? lead.website ?? null,
        website: lead.website
          ? { primaryLinkLabel: 'Website', primaryLinkUrl: lead.website }
          : undefined,
        instagram: lead.instagram
          ? { primaryLinkLabel: 'Instagram', primaryLinkUrl: lead.instagram }
          : undefined,
        leadSource: lead.leadSource ?? 'SCRAPER',
        stage: 'NEW_LEAD',
        importBatchId: batchId,
        enrichmentSource: source,
        dataConfidenceScore: confidence,
        scrapedAt: lead.scrapedAt ?? now,
        externalId: lead.externalId ?? '',
        enrichmentStatus,
        importedAt: now,
      },
    },
  )) as { createLead: { id: string } };
  return data.createLead.id;
}

// ── Main ───────────────────────────────────────────────────────────────────────

function parseArgs(): IngestOptions {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const file = get('--file') ?? '';
  const source = get('--source') ?? 'manual';
  const confidence = parseInt(get('--confidence') ?? '70', 10);
  const dryRun = args.includes('--dry-run');
  if (!file) {
    console.error(
      'Usage: npx ts-node scripts/ingest-leads.ts --file <path> [--source <name>] [--confidence <0-100>] [--dry-run]',
    );
    process.exit(1);
  }
  return { file, source, confidence, dryRun };
}

async function main() {
  const opts = parseArgs();
  const batchId = `batch-${new Date().toISOString().slice(0, 10)}-${randomUUID().slice(0, 8)}`;

  console.log(`\n🚀  IDDA Lead Ingestion`);
  console.log(`   Batch:      ${batchId}`);
  console.log(`   Source:     ${opts.source}`);
  console.log(`   Confidence: ${opts.confidence}%`);
  console.log(`   Dry run:    ${opts.dryRun}`);
  console.log(`   File:       ${opts.file}\n`);

  const raw = fs.readFileSync(path.resolve(opts.file), 'utf8');
  const leads: LeadInput[] = JSON.parse(raw);
  console.log(`📋  ${leads.length} leads in file\n`);

  const stats = { created: 0, skippedDuplicate: 0, failed: 0 };

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const label =
      `${lead.doctorFirstName ?? ''} ${lead.doctorLastName ?? ''} / ${lead.clinicName ?? ''}`.trim();
    process.stdout.write(`[${i + 1}/${leads.length}] ${label} … `);

    try {
      const dupeReason = await checkDuplicates(lead);
      if (dupeReason) {
        console.log(`⚠️  SKIP (duplicate: ${dupeReason})`);
        stats.skippedDuplicate++;
        continue;
      }

      if (opts.dryRun) {
        const status = computeEnrichmentStatus(lead, opts.confidence);
        console.log(`✅  DRY-RUN (would create, enrichmentStatus=${status})`);
        stats.created++;
        continue;
      }

      const id = await createLead(lead, batchId, opts.source, opts.confidence);
      console.log(`✅  created ${id}`);
      stats.created++;
    } catch (err) {
      console.log(`❌  ERROR: ${(err as Error).message}`);
      stats.failed++;
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`✅  Created:           ${stats.created}`);
  console.log(`⚠️  Skipped (dup):     ${stats.skippedDuplicate}`);
  console.log(`❌  Failed:            ${stats.failed}`);
  console.log(`─────────────────────────────────────────\n`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
