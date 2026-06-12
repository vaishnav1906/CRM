import { defineView, ViewFilterOperand, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_CITY_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_SPECIALIZATION_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_RESEARCH_QUEUE_UUID,
} from 'src/constants/universal-identifiers';

// Leads that are new or ready for research
export default defineView({
  universalIdentifier: VIEW_RESEARCH_QUEUE_UUID,
  name: 'Research Queue',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconSearch',
  position: 0,
  fields: [
    { universalIdentifier: '27d6274c-ecc1-47d3-89fc-c4b3db4bef45', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: 'e93d7353-a922-41e6-a5c8-c8c5cd2347d9', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '60b9d490-a091-461f-b92a-14a7c9fecd5d', fieldMetadataUniversalIdentifier: LEAD_SPECIALIZATION_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '5286c172-c6eb-441e-9dab-7d98eece80c6', fieldMetadataUniversalIdentifier: LEAD_CITY_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: 'c36fa749-3728-4e57-bbb8-6e2d800dd04a', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: '7c626245-2ec5-4356-b526-a777404a2959', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '58c003f7-bc71-4bc3-bfcd-c9fe00811566', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 6, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '8dd014e1-8aed-4e18-88dc-8f380126313f',
      fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(['NEW_LEAD', 'RESEARCH_COMPLETED']),
    },
  ],
});
