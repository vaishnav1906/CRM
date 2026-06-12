import { defineView, ViewFilterOperand, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_CONVERSION_PROBABILITY_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_SCORE_BAND_FIELD_UUID,
  LEAD_SCORE_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_HOT_LEADS_SCORE_UUID,
} from 'src/constants/universal-identifiers';

// Leads with HOT score band (leadScore >= 80) — priority closing targets
export default defineView({
  universalIdentifier: VIEW_HOT_LEADS_SCORE_UUID,
  name: 'Hot Leads',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconFlame',
  position: 0,
  fields: [
    { universalIdentifier: '3d9e6c8e-8158-47a7-bdd4-81867b126106', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '4f2dc418-7e96-4dbe-9bb6-6bd535d43335', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: 'd96ba89c-13b9-4828-96be-401992f8c3ee', fieldMetadataUniversalIdentifier: LEAD_SCORE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: 'b7451ec8-0b39-46c1-b5a0-849028ae557c', fieldMetadataUniversalIdentifier: LEAD_SCORE_BAND_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: 'a27d2ce4-f304-4c47-92a6-36e4981409ae', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: '189305d8-9487-44f5-8600-de7eb1ec9f49', fieldMetadataUniversalIdentifier: LEAD_CONVERSION_PROBABILITY_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: 'b29bdeb9-527d-4d80-9708-a9ed50f21e35', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: 'cdaa8c7c-31da-439d-ac15-1c071f9759b0', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: 'a99a0473-3164-481a-9224-a76b6fbe0643',
      fieldMetadataUniversalIdentifier: LEAD_SCORE_BAND_FIELD_UUID,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(['HOT']),
    },
  ],
  sorts: [
    {
      universalIdentifier: '686b2cd0-127e-4c67-951f-082b1e512e68',
      fieldMetadataUniversalIdentifier: LEAD_SCORE_FIELD_UUID,
      direction: ViewSortDirection.DESC,
    },
  ],
});
