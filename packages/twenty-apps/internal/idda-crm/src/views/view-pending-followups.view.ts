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
  VIEW_PENDING_FOLLOWUPS_UUID,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW_PENDING_FOLLOWUPS_UUID,
  name: 'Pending Follow-Ups',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCalendarClock',
  position: 3,
  fields: [
    { universalIdentifier: 'f7c949d4-fc21-461b-9447-8ca973f64c8d', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '7b062faa-66a1-4546-8cbd-b7e33f98799c', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '7f60b6c0-301a-41e4-bdd2-0eebbe8d2a93', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '94d63f8f-6d90-43b0-b66b-1afd866f3cd9', fieldMetadataUniversalIdentifier: LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: '9c2df424-ed29-4c5c-87c1-3267f975e0c5', fieldMetadataUniversalIdentifier: LEAD_PRIORITY_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'f18d6703-7362-4784-af0a-64cf7f95da3b', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: 'fad136bf-656c-4c2c-ac1a-debfa551d3e9', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 6, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '93cb95bc-438a-448e-9db2-6484ab598060',
      fieldMetadataUniversalIdentifier: LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '9e3993fa-2541-4f1c-8616-a58fe3f2379c',
      fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID,
      operand: ViewFilterOperand.IS_NOT,
      value: JSON.stringify(['ONBOARDED', 'REJECTED']),
    },
  ],
  sorts: [
    {
      universalIdentifier: '891ef981-a020-437b-a0be-72d6a865a0ae',
      fieldMetadataUniversalIdentifier: LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID,
      direction: ViewSortDirection.ASC,
    },
  ],
});
