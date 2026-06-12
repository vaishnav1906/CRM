import { defineView, ViewFilterOperand, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_BUDGET_RANGE_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_CONVERSION_PROBABILITY_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_EXPECTED_CLOSURE_DATE_FIELD_UUID,
  LEAD_INTEREST_LEVEL_FIELD_UUID,
  LEAD_MEETING_DATE_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_STAGE_FIELD_UUID,
  VIEW_SALES_QUEUE_UUID,
} from 'src/constants/universal-identifiers';

// Leads in the sales pipeline — Interested through Negotiation
export default defineView({
  universalIdentifier: VIEW_SALES_QUEUE_UUID,
  name: 'Sales Queue',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconTrophy',
  position: 1,
  fields: [
    { universalIdentifier: 'bc04a81f-6cc6-4288-aa2f-6a4f0a3ea511', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '63e02258-4daa-49b8-842b-bc83b06768d2', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '34b134d3-f44a-4f48-852b-25d302431421', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '796133d6-a8af-429b-ae88-6b79ce83b291', fieldMetadataUniversalIdentifier: LEAD_INTEREST_LEVEL_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: 'ba7d1b9b-d662-4846-a626-d3e76e974660', fieldMetadataUniversalIdentifier: LEAD_CONVERSION_PROBABILITY_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'd332637b-1380-40fa-b900-ca544f378df0', fieldMetadataUniversalIdentifier: LEAD_MEETING_DATE_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '46502de0-8754-46a7-9231-bf1a8164d8b5', fieldMetadataUniversalIdentifier: LEAD_BUDGET_RANGE_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: '0cf9191c-9ee5-411f-a921-12515a941d86', fieldMetadataUniversalIdentifier: LEAD_EXPECTED_CLOSURE_DATE_FIELD_UUID, position: 7, isVisible: true },
    { universalIdentifier: 'cf08a7e0-e57f-483e-8854-963d5fc9cbfb', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 8, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: 'f5c80983-bf5e-4ad3-bd2b-894745910563',
      fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(['INTERESTED', 'MEETING_SCHEDULED', 'MEETING_COMPLETED', 'NEGOTIATION']),
    },
  ],
});
