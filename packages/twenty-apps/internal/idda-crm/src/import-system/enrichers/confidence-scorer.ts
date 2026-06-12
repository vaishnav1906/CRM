// Phase 14 — Confidence Scorer
// Computes data confidence score (0–100) and enrichment status from a normalized lead.

import { NormalizedLead } from '../normalizers/lead-normalizer';

export type ConfidenceResult = {
  score: number;
  enrichmentStatus: 'ENRICHED' | 'PENDING' | 'FAILED' | 'SKIPPED';
  breakdown: string[];
};

export function computeConfidence(lead: NormalizedLead, baseConfidence = 70): ConfidenceResult {
  let score = baseConfidence;
  const breakdown: string[] = [`base:${baseConfidence}`];

  if (lead.phone) { score += 10; breakdown.push('+10 phone'); }
  else { score -= 10; breakdown.push('-10 no phone'); }

  if (lead.email) { score += 8; breakdown.push('+8 email'); }

  if (lead.clinicName) { score += 5; breakdown.push('+5 clinic'); }

  if (lead.specialization && lead.specialization !== 'OTHER') { score += 5; breakdown.push('+5 specialization'); }

  if (lead.city) { score += 5; breakdown.push('+5 city'); }

  if (lead.website) { score += 4; breakdown.push('+4 website'); }

  if (lead.instagram) { score += 3; breakdown.push('+3 instagram'); }

  if (lead.externalId) { score += 5; breakdown.push('+5 externalId'); }

  const finalScore = Math.max(0, Math.min(100, score));

  let enrichmentStatus: ConfidenceResult['enrichmentStatus'];
  if (finalScore >= 75) enrichmentStatus = 'ENRICHED';
  else if (finalScore >= 45) enrichmentStatus = 'PENDING';
  else if (finalScore < 30) enrichmentStatus = 'FAILED';
  else enrichmentStatus = 'PENDING';

  return { score: finalScore, enrichmentStatus, breakdown };
}
