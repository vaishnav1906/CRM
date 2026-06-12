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
  VIEW_MEETINGS_THIS_WEEK_UUID,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW_MEETINGS_THIS_WEEK_UUID,
  name: 'Meetings This Week',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCalendarEvent',
  position: 5,
  fields: [
    { universalIdentifier: 'fcefc089-e59f-4de6-9309-8fae2164445d', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: 'd7943957-c6fb-4d8b-a252-deb06399bd67', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '37ac9518-b5e1-4a11-8bb9-c40e60ca1268', fieldMetadataUniversalIdentifier: LEAD_MEETING_DATE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '41776826-56c5-4200-9835-36381b77b5be', fieldMetadataUniversalIdentifier: LEAD_MEETING_MODE_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: '7f3f21b6-fb5c-45a1-9868-41e1dfab27e6', fieldMetadataUniversalIdentifier: LEAD_MEETING_OUTCOME_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: '65937389-fe49-4ccd-bd0a-d3b464c035f4', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: 'cf62fe61-1efd-42ec-8d42-c408a96d89a2', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: 'dc55c2d3-4626-4adb-a732-dcabf2bd2395', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: 'aeadbfe0-6c0d-45b0-8dd6-6f0d4bd7c895',
      fieldMetadataUniversalIdentifier: LEAD_MEETING_DATE_FIELD_UUID,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: 'THIS_WEEK',
    },
  ],
  sorts: [
    {
      universalIdentifier: 'dbae8ba5-8f27-48af-ba90-fa305724e940',
      fieldMetadataUniversalIdentifier: LEAD_MEETING_DATE_FIELD_UUID,
      direction: ViewSortDirection.ASC,
    },
  ],
});
