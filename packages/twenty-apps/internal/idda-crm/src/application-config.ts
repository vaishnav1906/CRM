import { defineApplication } from 'twenty-sdk/define';

import {
  APPLICATION_UNIVERSAL_IDENTIFIER,
  EMPLOYEE_ROLE_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineApplication({
  universalIdentifier: APPLICATION_UNIVERSAL_IDENTIFIER,
  displayName: 'IDDA Assurance CRM',
  description:
    'Lead management, pipeline, and team productivity for IDDA Assurance — dental & dermatology subscription workflows.',
  defaultRoleUniversalIdentifier: EMPLOYEE_ROLE_UNIVERSAL_IDENTIFIER,
});
