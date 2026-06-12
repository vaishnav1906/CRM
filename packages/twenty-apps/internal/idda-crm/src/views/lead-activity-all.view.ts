import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ACTIVITY_ALL_VIEW_UUID,
  LEAD_ACTIVITY_DESCRIPTION_FIELD_UUID,
  LEAD_ACTIVITY_EVENT_TYPE_FIELD_UUID,
  LEAD_ACTIVITY_FROM_VALUE_FIELD_UUID,
  LEAD_ACTIVITY_LEAD_RELATION_FIELD_UUID,
  LEAD_ACTIVITY_OBJECT_UUID,
  LEAD_ACTIVITY_OCCURRED_AT_FIELD_UUID,
  LEAD_ACTIVITY_PERFORMED_BY_FIELD_UUID,
  LEAD_ACTIVITY_TO_VALUE_FIELD_UUID,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: LEAD_ACTIVITY_ALL_VIEW_UUID,
  name: 'All Activity',
  objectUniversalIdentifier: LEAD_ACTIVITY_OBJECT_UUID,
  type: ViewType.TABLE,
  icon: 'IconActivity',
  position: 0,
  fields: [
    { universalIdentifier: 'c1695e43-13ae-4082-8dcd-1b012f48d9a7', fieldMetadataUniversalIdentifier: LEAD_ACTIVITY_DESCRIPTION_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '6267bda6-556f-45a7-8806-75b52bcb07da', fieldMetadataUniversalIdentifier: LEAD_ACTIVITY_EVENT_TYPE_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '092361ff-232c-425d-a887-76cb7f80c1ea', fieldMetadataUniversalIdentifier: LEAD_ACTIVITY_OCCURRED_AT_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '6a09b916-d98e-42c9-8048-cd3d49b5f4c2', fieldMetadataUniversalIdentifier: LEAD_ACTIVITY_LEAD_RELATION_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: 'd8acee08-9497-46ba-848f-4f7812765de6', fieldMetadataUniversalIdentifier: LEAD_ACTIVITY_FROM_VALUE_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: '27e18ad7-a6e5-470e-a99b-e1b154ae6c23', fieldMetadataUniversalIdentifier: LEAD_ACTIVITY_TO_VALUE_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: 'f6f66b25-696d-4244-83fb-2be27b9d7757', fieldMetadataUniversalIdentifier: LEAD_ACTIVITY_PERFORMED_BY_FIELD_UUID, position: 6, isVisible: true },
  ],
  sorts: [
    {
      universalIdentifier: '8c31f480-1cda-4d8f-9589-3d77e8d00685',
      fieldMetadataUniversalIdentifier: LEAD_ACTIVITY_OCCURRED_AT_FIELD_UUID,
      direction: ViewSortDirection.DESC,
    },
  ],
});
