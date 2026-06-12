// Phase 14 — Apollo.io Export Adapter
// Converts Apollo CSV/JSON export to RawLead format.

export type ApolloContact = {
  'First Name'?: string;
  'Last Name'?: string;
  'Title'?: string;
  'Company'?: string;
  'Email'?: string;
  'Phone'?: string;
  'Town'?: string;
  'City'?: string;
  'State'?: string;
  'Country'?: string;
  'Website'?: string;
  'LinkedIn URL'?: string;
  'Person Linkedin Url'?: string;
  id?: string;
};

export type RawLead = Record<string, unknown>;

function mapTitleToSpecialization(title: string | undefined): string | null {
  if (!title) return null;
  const t = title.toLowerCase();
  if (t.includes('dentist') || t.includes('dental')) return 'DENTIST';
  if (t.includes('dermat') || t.includes('skin')) return 'DERMATOLOGIST';
  if (t.includes('ophthal') || t.includes('eye')) return 'OPHTHALMOLOGIST';
  if (t.includes('pediatr')) return 'PEDIATRICIAN';
  if (t.includes('gynecol') || t.includes('obs')) return 'GYNECOLOGIST';
  if (t.includes('ortho')) return 'ORTHOPEDIC';
  if (t.includes('ent') || t.includes('ear nose')) return 'ENT';
  if (t.includes('doctor') || t.includes('physician') || t.includes('gp')) return 'GENERAL_PHYSICIAN';
  return 'OTHER';
}

export function adaptApolloContact(contact: ApolloContact): RawLead {
  return {
    externalId: `apollo_${contact.id ?? contact['Email'] ?? ''}`,
    doctorFirstName: contact['First Name'] ?? '',
    doctorLastName: contact['Last Name'] ?? '',
    clinicName: contact['Company'] ?? '',
    phone: contact['Phone'],
    email: contact['Email'],
    town: contact['Town'],
    city: contact['City'],
    state: contact['State'],
    website: contact['Website'],
    specialization: mapTitleToSpecialization(contact['Title']),
    leadSource: 'LINKEDIN',
    scrapedAt: new Date().toISOString(),
  };
}

export function adaptApolloBatch(contacts: ApolloContact[]): RawLead[] {
  return contacts.map(adaptApolloContact);
}
