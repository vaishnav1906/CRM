import { defineView, ViewFilterOperand, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_PRIORITY_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_TODAY_FOLLOWUPS_UUID,
} from 'src/constants/universal-identifiers';

// Leads with follow-up scheduled for today — daily urgency view
export default defineView({
  universalIdentifier: VIEW_TODAY_FOLLOWUPS_UUID,
  name: "Today's Follow-Ups",
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCalendarDue',
  position: 4,
  fields: [
    { universalIdentifier: 'df039a59-f7fd-41c3-826c-6f6a9112855b', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: 'c7d3f0d0-55c5-4331-b836-9e12db1bd079', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '6b9905b6-6557-4212-897d-6a0b2d553463', fieldMetadataUniversalIdentifier: LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: 'e14abe3e-69fb-4486-8e1a-267da3d1d9d1', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: 'c40c9c05-2713-4fd2-83ba-f4b66839c591', fieldMetadataUniversalIdentifier: LEAD_PRIORITY_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'af00976f-638c-40d1-9214-954eb9a8cd9e', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: 'df4d243e-8ade-430e-be72-07097adf1aeb', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 6, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: 'b0d74b3c-fe34-42e8-b61b-e4de6e750683',
      fieldMetadataUniversalIdentifier: LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: 'TODAY',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'e5f7ca9d-52da-410d-9d10-3affe7dfd9c1',
      fieldMetadataUniversalIdentifier: LEAD_PRIORITY_FIELD_UUID,
      direction: ViewSortDirection.DESC,
    },
  ],
});
