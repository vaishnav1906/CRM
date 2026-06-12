import { defineView, ViewFilterOperand, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_INTEREST_LEVEL_FIELD_UUID,
  LEAD_LAST_CONTACTED_AT_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_REJECTED_LEADS_UUID,
} from 'src/constants/universal-identifiers';

// Leads in REJECTED stage — for re-engagement tracking
export default defineView({
  universalIdentifier: VIEW_REJECTED_LEADS_UUID,
  name: 'Rejected Leads',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconX',
  position: 5,
  fields: [
    { universalIdentifier: '81c04895-e977-4e18-824c-f32427666999', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '84e2a238-d336-4b1e-b1d9-51fe8d34d8d0', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '58178c59-e6d8-4542-a8f7-ac30b408a36b', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '6e930dfb-e35c-416b-9753-0e748763fa20', fieldMetadataUniversalIdentifier: LEAD_INTEREST_LEVEL_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: '05010652-8751-473d-9144-228a64a53814', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'aa60aaac-1438-4b28-a899-57318b4459bc', fieldMetadataUniversalIdentifier: LEAD_LAST_CONTACTED_AT_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '32cd4a0b-c418-4b2f-8887-77ea1c6c711d', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 6, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '9d65b621-1ebf-4d03-933c-351a4a068f6f',
      fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(['REJECTED']),
    },
  ],
});
