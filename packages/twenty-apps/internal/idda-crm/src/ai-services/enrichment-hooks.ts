// Phase 12 — AI Enrichment Hooks
// Called after lead import to validate and enhance data quality.

export type EnrichmentInput = {
  phone?: string;
  email?: string;
  clinicName?: string;
  city?: string;
  website?: string;
  instagram?: string;
};

export type EnrichmentResult = {
  phoneValid: boolean;
  emailValid: boolean;
  normalizedPhone: string | null;
  inferredCity: string | null;
  suggestedSpecialization: string | null;
  confidenceAdjustment: number;
};

// Phone number validation (Indian numbers)
function validateIndianPhone(phone: string): { valid: boolean; normalized: string | null } {
  const digits = phone.replace(/\D/g, '');
  const last10 = digits.slice(-10);
  // Indian mobile: starts with 6-9
  if (/^[6-9]\d{9}$/.test(last10)) {
    return { valid: true, normalized: `+91${last10}` };
  }
  return { valid: false, normalized: null };
}

// Email format validation
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Infer specialization from clinic name keywords
function inferSpecialization(clinicName: string): string | null {
  const name = clinicName.toLowerCase();
  if (name.includes('dental') || name.includes('dent') || name.includes('teeth') || name.includes('orthodont')) return 'DENTIST';
  if (name.includes('derma') || name.includes('skin') || name.includes('cosmet')) return 'DERMATOLOGIST';
  if (name.includes('eye') || name.includes('ophthal') || name.includes('vision')) return 'OPHTHALMOLOGIST';
  if (name.includes('ent') || name.includes('ear') || name.includes('nose')) return 'ENT';
  if (name.includes('ortho') || name.includes('bone') || name.includes('joint')) return 'ORTHOPEDIC';
  if (name.includes('child') || name.includes('pediatr') || name.includes('kids')) return 'PEDIATRICIAN';
  if (name.includes('gyn') || name.includes('women') || name.includes('obst')) return 'GYNECOLOGIST';
  return null;
}

export function runEnrichmentHooks(input: EnrichmentInput): EnrichmentResult {
  const phoneResult = input.phone ? validateIndianPhone(input.phone) : { valid: false, normalized: null };
  const emailValid = input.email ? validateEmail(input.email) : false;
  const suggestedSpecialization = input.clinicName ? inferSpecialization(input.clinicName) : null;

  // Adjust confidence based on data quality
  let confidenceAdjustment = 0;
  if (phoneResult.valid) confidenceAdjustment += 10;
  if (!phoneResult.valid && input.phone) confidenceAdjustment -= 15;
  if (emailValid) confidenceAdjustment += 8;
  if (suggestedSpecialization) confidenceAdjustment += 5;
  if (input.website) confidenceAdjustment += 5;

  return {
    phoneValid: phoneResult.valid,
    emailValid,
    normalizedPhone: phoneResult.normalized,
    inferredCity: input.city ?? null,
    suggestedSpecialization,
    confidenceAdjustment,
  };
}
