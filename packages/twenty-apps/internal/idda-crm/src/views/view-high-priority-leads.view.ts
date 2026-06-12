import { defineView, ViewFilterOperand, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_INTEREST_LEVEL_FIELD_UUID,
  LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_PRIORITY_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_HIGH_PRIORITY_UUID,
} from 'src/constants/universal-identifiers';

// Leads marked HIGH or URGENT priority
export default defineView({
  universalIdentifier: VIEW_HIGH_PRIORITY_UUID,
  name: 'High Priority Leads',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconAlertTriangle',
  position: 4,
  fields: [
    { universalIdentifier: '5449dfac-199a-424f-a342-bd87c990d3dc', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '0faeab7f-a0ec-4fda-8446-a029e7b06c82', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '2821ea3e-689a-4333-b9a9-be7146514ddd', fieldMetadataUniversalIdentifier: LEAD_PRIORITY_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: 'f1e3b288-435b-4255-9024-eb6c7dea30a5', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: 'adb30d6a-6f7c-45f8-9799-67286d3dd860', fieldMetadataUniversalIdentifier: LEAD_INTEREST_LEVEL_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'b768a40f-77e0-40af-9739-4809c9869a5f', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '87a0aa73-9b8c-46f1-8a89-646289d2e99b', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: '35234b81-74e5-46ef-8937-da10d14c8c06', fieldMetadataUniversalIdentifier: LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '7e698566-45af-422d-8e2b-b1674bee8863',
      fieldMetadataUniversalIdentifier: LEAD_PRIORITY_FIELD_UUID,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(['HIGH', 'URGENT']),
    },
  ],
});
