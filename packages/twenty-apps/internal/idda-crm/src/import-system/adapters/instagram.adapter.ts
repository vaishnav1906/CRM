// Phase 14 — Instagram Scraper Adapter
// Converts Instagram profile scraper output to RawLead format.

export type InstagramProfile = {
  username?: string;
  full_name?: string;
  biography?: string;
  external_url?: string;
  phone_number?: string;
  email?: string;
  town?: string;
  city?: string;
  category_name?: string;
  follower_count?: number;
  profile_url?: string;
};

export type RawLead = Record<string, unknown>;

function inferSpecFromBio(bio: string | undefined, category: string | undefined): string | null {
  const text = `${bio ?? ''} ${category ?? ''}`.toLowerCase();
  if (text.includes('dental') || text.includes('dentist')) return 'DENTIST';
  if (text.includes('skin') || text.includes('derma') || text.includes('cosmet')) return 'DERMATOLOGIST';
  if (text.includes('eye') || text.includes('ophthal')) return 'OPHTHALMOLOGIST';
  if (text.includes('pediatr') || text.includes('child')) return 'PEDIATRICIAN';
  if (text.includes('gynecol') || text.includes('women')) return 'GYNECOLOGIST';
  if (text.includes('ortho')) return 'ORTHOPEDIC';
  if (text.includes('ent') || text.includes('ear') || text.includes('nose')) return 'ENT';
  if (text.includes('doctor') || text.includes('dr.') || text.includes('clinic')) return 'GENERAL_PHYSICIAN';
  return null;
}

export function adaptInstagramProfile(profile: InstagramProfile): RawLead {
  const nameParts = (profile.full_name ?? '').trim().split(/\s+/);
  return {
    externalId: `ig_${profile.username ?? ''}`,
    doctorFirstName: nameParts[0] ?? '',
    doctorLastName: nameParts.slice(1).join(' '),
    clinicName: profile.full_name ?? profile.username ?? '',
    phone: profile.phone_number,
    email: profile.email,
    town: profile.town,
    city: profile.city,
    website: profile.external_url,
    instagram: profile.profile_url ?? `https://instagram.com/${profile.username ?? ''}`,
    specialization: inferSpecFromBio(profile.biography, profile.category_name),
    leadSource: 'INSTAGRAM',
    scrapedAt: new Date().toISOString(),
  };
}

export function adaptInstagramBatch(profiles: InstagramProfile[]): RawLead[] {
  return profiles.map(adaptInstagramProfile);
}
