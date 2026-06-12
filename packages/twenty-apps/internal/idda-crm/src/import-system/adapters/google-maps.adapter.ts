// Phase 14 — Google Maps Scraper Adapter
// Converts Google Maps Places API / scraper payload to RawLead format.

import { inferSpecializationFromText } from '../normalizers/lead-normalizer';

export type GoogleMapsPlace = {
  place_id?: string;
  name?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  formatted_address?: string;
  vicinity?: string;
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: unknown;
};

export type RawLead = Record<string, unknown>;

const CITY_PATTERN = /,\s*([^,]+),\s*[A-Z]{2,}/;

function inferCityFromAddress(address: string | undefined): string | null {
  if (!address) return null;
  const match = address.match(CITY_PATTERN);
  return match ? match[1].trim() : null;
}

// Indian addresses: "Street, Locality/Town, City, State PIN, Country"
// Town is the segment immediately before the city segment.
function inferTownFromAddress(address: string | undefined): string | null {
  if (!address) return null;
  const city = inferCityFromAddress(address);
  if (!city) return null;
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  const cityIdx = parts.findIndex((p) => p.toLowerCase() === city.toLowerCase());
  if (cityIdx <= 0) return null;
  const candidate = parts[cityIdx - 1];
  // Skip bare street numbers or single-word fragments that are likely not towns
  if (!candidate || candidate.length < 3 || /^\d+$/.test(candidate)) return null;
  return candidate;
}

function inferSpecializationFromTypes(types: string[] | undefined): string | null {
  if (!types) return null;
  if (types.some((t) => t.includes('dentist'))) return 'DENTIST';
  if (types.some((t) => t.includes('skin') || t.includes('cosmet'))) return 'DERMATOLOGIST';
  if (types.some((t) => t.includes('ophthal') || t.includes('eye'))) return 'OPHTHALMOLOGIST';
  if (types.some((t) => t.includes('pediatr'))) return 'PEDIATRICIAN';
  return null;
}

export function adaptGoogleMapsPlace(place: GoogleMapsPlace): RawLead {
  const phone = place.international_phone_number ?? place.formatted_phone_number;
  const fullAddress = place.formatted_address ?? place.vicinity;
  const city = inferCityFromAddress(fullAddress);
  const town = inferTownFromAddress(fullAddress);
  // types[] is authoritative; fall back to place name so "Sabka dentist" → DENTIST
  const specialization =
    inferSpecializationFromTypes(place.types) ??
    inferSpecializationFromText(place.name ?? '');
  return {
    externalId: `gmaps_${place.place_id ?? ''}`,
    clinicName: place.name,
    phone,
    website: place.website,
    town,
    city,
    specialization,
    leadSource: 'SCRAPER',
    scrapedAt: new Date().toISOString(),
    // Confidence bonus fields
    _gmapsRating: place.rating,
    _gmapsReviews: place.user_ratings_total,
  };
}

export function adaptGoogleMapsBatch(places: GoogleMapsPlace[]): RawLead[] {
  return places.map(adaptGoogleMapsPlace);
}
