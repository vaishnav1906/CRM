// Phase 14 — Lead Validator
// Returns errors for a normalized lead. Hard errors block import; warnings are logged.

import { NormalizedLead } from '../normalizers/lead-normalizer';

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export function validateLead(lead: NormalizedLead): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Hard requirements
  if (!lead.clinicName) errors.push('clinicName is required');
  if (!lead.doctorFirstName && !lead.doctorLastName) errors.push('At least one name field required');

  // Contact info — need at least one
  if (!lead.phone && !lead.email) {
    warnings.push('No phone or email — dedup and outreach will be limited');
  }

  // Phone format
  if (lead.phone && !/^\+91\d{10}$/.test(lead.phone)) {
    errors.push(`Invalid phone format: ${lead.phone}`);
  }

  // Email format
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    errors.push(`Invalid email format: ${lead.email}`);
  }

  // City recommended for dedup
  if (!lead.city) warnings.push('No city — clinic+city dedup disabled');

  // URL format
  if (lead.website && !lead.website.startsWith('http')) {
    warnings.push(`Website URL may be malformed: ${lead.website}`);
  }

  // Specialization
  const VALID_SPECS = ['DENTIST', 'DERMATOLOGIST', 'GENERAL_PHYSICIAN', 'PEDIATRICIAN', 'ENT', 'OPHTHALMOLOGIST', 'GYNECOLOGIST', 'ORTHOPEDIC', 'OTHER'];
  if (lead.specialization && !VALID_SPECS.includes(lead.specialization)) {
    warnings.push(`Unknown specialization value: ${lead.specialization}`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateBatch(leads: NormalizedLead[]): Map<number, ValidationResult> {
  const results = new Map<number, ValidationResult>();
  leads.forEach((lead, idx) => results.set(idx, validateLead(lead)));
  return results;
}
