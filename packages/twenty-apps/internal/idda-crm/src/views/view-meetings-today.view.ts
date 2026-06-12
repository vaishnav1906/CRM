import { defineView, ViewFilterOperand, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_MEETING_DATE_FIELD_UUID,
  LEAD_MEETING_MODE_FIELD_UUID,
  LEAD_MEETING_OUTCOME_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_MEETINGS_TODAY_UUID,
} from 'src/constants/universal-identifiers';

// Meetings scheduled for today — daily planning view
export default defineView({
  universalIdentifier: VIEW_MEETINGS_TODAY_UUID,
  name: 'Meetings Today',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCalendarStar',
  position: 5,
  fields: [
    { universalIdentifier: '94c51300-88c9-4ada-9d59-9c0a31979554', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '14c8b7fc-9d59-41ec-a1f2-ec8f06283582', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: 'c8f6f570-f89e-42e3-b10d-36123c003d52', fieldMetadataUniversalIdentifier: LEAD_MEETING_DATE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '17a3d34d-4c96-44e9-aae8-e12c150d0b74', fieldMetadataUniversalIdentifier: LEAD_MEETING_MODE_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: '5866de68-490b-4342-8ede-5f8559f1c6eb', fieldMetadataUniversalIdentifier: LEAD_MEETING_OUTCOME_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'ddedffce-aa0c-40a2-a604-f9465b47f678', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '17da2134-2783-4efa-9ac8-9bd2a8afb0a7', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: '2829a6b2-73de-48de-9538-bc58967e366c', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '7f759bc0-9d4b-4b78-884f-f7bf63f85f6c',
      fieldMetadataUniversalIdentifier: LEAD_MEETING_DATE_FIELD_UUID,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: 'TODAY',
    },
  ],
  sorts: [
    {
      universalIdentifier: '424cddb9-5cc6-4c86-88a8-87bfee615212',
      fieldMetadataUniversalIdentifier: LEAD_MEETING_DATE_FIELD_UUID,
      direction: ViewSortDirection.ASC,
    },
  ],
});
