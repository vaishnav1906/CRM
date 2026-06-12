import { defineView, ViewFilterOperand, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_BUDGET_RANGE_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_CONVERSION_PROBABILITY_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_EXPECTED_CLOSURE_DATE_FIELD_UUID,
  LEAD_INTEREST_LEVEL_FIELD_UUID,
  LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_HOT_LEADS_UUID,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW_HOT_LEADS_UUID,
  name: 'Hot Leads',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconFlame',
  position: 4,
  fields: [
    { universalIdentifier: '5affd4ad-aa92-48da-8286-06f4a5c33fd5', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '5f616feb-9c41-487d-954f-cb64a2a8dd08', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '27b93428-a36c-4f43-a081-f2bb4c95191f', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '40983f6c-0eb0-4380-baaf-10bb3e3cdd73', fieldMetadataUniversalIdentifier: LEAD_INTEREST_LEVEL_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: 'cf423008-6ee6-4961-bd6d-718de73973f1', fieldMetadataUniversalIdentifier: LEAD_CONVERSION_PROBABILITY_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'bca8a4df-a290-4023-8157-2ed6355e436d', fieldMetadataUniversalIdentifier: LEAD_BUDGET_RANGE_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '79545d21-8967-4e29-ab0b-a7a29792fadb', fieldMetadataUniversalIdentifier: LEAD_EXPECTED_CLOSURE_DATE_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: 'c3931c1f-4741-4189-b2c3-b4e510dcac46', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 7, isVisible: true },
    { universalIdentifier: 'c2084fd2-0387-48a2-a147-6e0e14ba533f', fieldMetadataUniversalIdentifier: LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID, position: 8, isVisible: true },
    { universalIdentifier: 'd798d09d-de37-47f0-9756-4198a88b90a4', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 9, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '0c926f53-464b-4bd1-a439-3d6bd7d7bcb7',
      fieldMetadataUniversalIdentifier: LEAD_INTEREST_LEVEL_FIELD_UUID,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(['HOT']),
    },
  ],
});
