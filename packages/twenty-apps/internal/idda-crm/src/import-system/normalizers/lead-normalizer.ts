// Phase 14 — Lead Normalizer
// Converts raw adapter output into a canonical LeadInput shape.

export type RawLead = Record<string, unknown>;

export type NormalizedLead = {
  externalId: string;
  doctorFirstName: string;
  doctorLastName: string;
  clinicName: string;
  phone: string | null;
  email: string | null;
  town: string | null;
  city: string | null;
  state: string | null;
  specialization: string | null;
  websiteAddress: string | null;
  website: string | null;
  instagram: string | null;
  leadSource: string;
  scrapedAt: string;
};

export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  // Strip leading country code
  const last10 = digits.slice(-10);
  if (last10.length !== 10) return null;
  return `+91${last10}`;
}

export function normalizeEmail(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const email = String(raw).trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

export function normalizeUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const url = String(raw).trim();
  if (!url) return null;
  if (!url.startsWith('http')) return `https://${url}`;
  return url;
}

// Ordered keyword rules — first match wins. Covers all dental sub-specialties,
// skin/cosmetic variants, and common clinic-name patterns scraped from MedLeads.
const SPECIALIZATION_RULES: Array<{ pattern: RegExp; value: string }> = [
  // Dentist — dental sub-specialties all map to DENTIST
  {
    pattern:
      /dental|dentist|dentistry|orthodont|periodont|endodont|oral\s*surg|cosmetic\s*dent|implant|braces|smile\s*(clinic|studio|care|dental|dentist)|tooth|teeth|dent\s*(care|clinic|heal|bandra|hub|world)/i,
    value: 'DENTIST',
  },
  // Dermatologist — skin / cosmetic / hair / laser
  {
    pattern:
      /dermat|skin\s*(clinic|care|studio|hair|laser|and)|cosmetolog|tricholog|hair\s*(clinic|care|laser)|laser\s*(clinic|care|skin)|aesthetic|skinworks|skin\s*&|&\s*hair|hair\s*&/i,
    value: 'DERMATOLOGIST',
  },
  // Pediatrician
  {
    pattern: /pediatr|paediatr|child\s*(specialist|care|clinic)|children/i,
    value: 'PEDIATRICIAN',
  },
  // ENT
  {
    pattern: /\bent\b|ear\s*nose|otolaryngol/i,
    value: 'ENT',
  },
  // Ophthalmologist
  {
    pattern: /ophthal|eye\s*(care|clinic|hospital|center)|vision\s*care/i,
    value: 'OPHTHALMOLOGIST',
  },
  // Gynecologist
  {
    pattern: /gynecol|gynaecol|women.s\s*(clinic|care|hospital)|maternity|obs\s*&\s*gyn/i,
    value: 'GYNECOLOGIST',
  },
  // Orthopedic
  {
    pattern: /orthop|orthopaed|bone\s*(and|&)\s*joint|joint\s*(care|clinic)|spine/i,
    value: 'ORTHOPEDIC',
  },
  // General physician — intentionally last; broad terms like "clinic" / "medical" match here
  {
    pattern:
      /general\s*(physician|practice|doctor|clinic)|family\s*(medicine|doctor|clinic)|medical\s*(center|clinic|centre)|health\s*(center|clinic|centre)|multispecial|multi.special/i,
    value: 'GENERAL_PHYSICIAN',
  },
];

// Infer specialization from any free text (clinic name, search query, bio, etc.)
export function inferSpecializationFromText(text: string | null | undefined): string | null {
  if (!text) return null;
  for (const { pattern, value } of SPECIALIZATION_RULES) {
    if (pattern.test(text)) return value;
  }
  return null;
}

// Normalize a raw specialization field value (exact → keyword fallback).
// Returns the Twenty enum value (e.g. "DENTIST") or null when nothing matches.
export function normalizeSpecialization(raw: string | null | undefined): string | null {
  if (!raw) return null;
  // Exact-match shortcuts for values already in enum form
  const exact: Record<string, string> = {
    dentist: 'DENTIST', dental: 'DENTIST',
    dermatologist: 'DERMATOLOGIST', derma: 'DERMATOLOGIST',
    pediatrician: 'PEDIATRICIAN', pediatric: 'PEDIATRICIAN',
    ent: 'ENT',
    ophthalmologist: 'OPHTHALMOLOGIST',
    gynecologist: 'GYNECOLOGIST', gynaecologist: 'GYNECOLOGIST',
    orthopedic: 'ORTHOPEDIC', orthopaedic: 'ORTHOPEDIC',
    general_physician: 'GENERAL_PHYSICIAN', general: 'GENERAL_PHYSICIAN',
    physician: 'GENERAL_PHYSICIAN', gp: 'GENERAL_PHYSICIAN',
    // Twenty enum values passed through as-is
    DENTIST: 'DENTIST', DERMATOLOGIST: 'DERMATOLOGIST',
    GENERAL_PHYSICIAN: 'GENERAL_PHYSICIAN', PEDIATRICIAN: 'PEDIATRICIAN',
    ENT: 'ENT', OPHTHALMOLOGIST: 'OPHTHALMOLOGIST',
    GYNECOLOGIST: 'GYNECOLOGIST', ORTHOPEDIC: 'ORTHOPEDIC',
    OTHER: 'OTHER',
  };
  const key = raw.trim();
  if (exact[key] ?? exact[key.toLowerCase()]) return exact[key] ?? exact[key.toLowerCase()];
  // Fall back to keyword scan for multi-word inputs like "cosmetic dentist"
  return inferSpecializationFromText(raw);
}

export function normalizeLead(raw: RawLead, source: string): NormalizedLead {
  const str = (v: unknown) => (v != null ? String(v).trim() : '');
  const opt = (v: unknown) => (v != null && String(v).trim() ? String(v).trim() : null);

  // Split doctor name if provided as single string
  const fullName = str(raw.doctorName ?? raw.doctor_name ?? raw.name ?? '');
  const nameParts = fullName.split(/\s+/);
  const doctorFirstName = str(raw.doctorFirstName ?? raw.first_name ?? nameParts[0] ?? '');
  const doctorLastName = str(raw.doctorLastName ?? raw.last_name ?? nameParts.slice(1).join(' ') ?? '');

  const websiteRaw = normalizeUrl(opt(raw.websiteAddress ?? raw.website_address ?? raw.website ?? raw.website_url ?? raw.url));

  return {
    externalId: str(raw.externalId ?? raw.external_id ?? raw.id ?? ''),
    doctorFirstName,
    doctorLastName,
    clinicName: str(raw.clinicName ?? raw.clinic_name ?? raw.business_name ?? raw.clinic ?? ''),
    phone: normalizePhone(opt(raw.phone ?? raw.phoneNumber ?? raw.mobile ?? raw.contact)),
    email: normalizeEmail(opt(raw.email ?? raw.emailAddress)),
    town: opt(raw.town ?? raw.locality ?? raw.neighborhood ?? raw.area ?? raw.suburb),
    city: opt(raw.city ?? raw.location),
    state: opt(raw.state ?? raw.province),
    specialization:
      normalizeSpecialization(opt(raw.specialization ?? raw.specialty ?? raw.type)) ??
      inferSpecializationFromText(opt(raw.clinicName ?? raw.clinic_name ?? raw.business_name ?? raw.clinic ?? raw.name ?? '')),
    websiteAddress: websiteRaw,
    website: websiteRaw,
    instagram: normalizeUrl(opt(raw.instagram ?? raw.instagram_url)),
    leadSource: str(raw.leadSource ?? raw.lead_source ?? source),
    scrapedAt: str(raw.scrapedAt ?? raw.scraped_at ?? raw.created_at ?? new Date().toISOString()),
  };
}
