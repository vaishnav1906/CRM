export const STANDARD_ROLE = {
  admin: { universalIdentifier: '20202020-02c2-43f2-b94d-cab1f2b532eb' },
  ceo: { universalIdentifier: '1dda0001-0000-4000-8000-000000000001' },
  coo: { universalIdentifier: '1dda0002-0000-4000-8000-000000000001' },
  cto: { universalIdentifier: '1dda0003-0000-4000-8000-000000000001' },
  businessDevelopmentManager: {
    universalIdentifier: '1dda0004-0000-4000-8000-000000000001',
  },
  researchTeam: { universalIdentifier: '1dda0005-0000-4000-8000-000000000001' },
  marketingCommunication: {
    universalIdentifier: '1dda0006-0000-4000-8000-000000000001',
  },
  salesPerson: { universalIdentifier: '1dda0007-0000-4000-8000-000000000001' },
  engineer: { universalIdentifier: '1dda0008-0000-4000-8000-000000000001' },
} as const satisfies Record<string, { universalIdentifier: string }>;
