import { defineView, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  TASK_ASSIGNED_TO_FIELD_UUID,
  TASK_DUE_DATE_FIELD_UUID,
  TASK_LEAD_RELATION_FIELD_UUID,
  TASK_OBJECT_UUID,
  TASK_PRIORITY_FIELD_UUID,
  TASK_STATUS_FIELD_UUID,
  TASK_TITLE_FIELD_UUID,
  TASK_TYPE_FIELD_UUID,
  VIEW_TASK_BOARD_UUID,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW_TASK_BOARD_UUID,
  name: 'Task Board',
  objectUniversalIdentifier: TASK_OBJECT_UUID,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 0,
  mainGroupByFieldMetadataUniversalIdentifier: TASK_STATUS_FIELD_UUID,
  fields: [
    { universalIdentifier: '2ee56e98-988a-4e0b-a72d-bbe2dab3ae99', fieldMetadataUniversalIdentifier: TASK_TITLE_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '505ebe53-79d9-4790-a9fc-f6cbfd3c64c9', fieldMetadataUniversalIdentifier: TASK_TYPE_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: 'a687c34b-afd2-43ea-9397-0997031c4801', fieldMetadataUniversalIdentifier: TASK_PRIORITY_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: 'f6bdcf15-6a25-4536-9b4f-073771415407', fieldMetadataUniversalIdentifier: TASK_DUE_DATE_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: 'b701432b-34ee-46c0-a4b4-280f831aa6fe', fieldMetadataUniversalIdentifier: TASK_ASSIGNED_TO_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: '3bd9db80-b750-4e6b-931a-8a519b45c585', fieldMetadataUniversalIdentifier: TASK_LEAD_RELATION_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '5fb6f482-e8f9-4015-a831-9cf0a517823b', fieldMetadataUniversalIdentifier: TASK_STATUS_FIELD_UUID, position: 6, isVisible: false },
  ],
  groups: [
    { universalIdentifier: 'd6ae6c51-57d7-42bb-aea0-c4209ff866e8', fieldValue: 'TODO', position: 0, isVisible: true },
    { universalIdentifier: '2c7eed38-d29d-4879-bc65-5632f4814662', fieldValue: 'IN_PROGRESS', position: 1, isVisible: true },
    { universalIdentifier: 'e3167612-a42b-43ad-8d5b-38e9767ebda3', fieldValue: 'DONE', position: 2, isVisible: true },
    { universalIdentifier: '05920a80-9ef6-46fa-94de-309c56351513', fieldValue: 'CANCELLED', position: 3, isVisible: false },
    { universalIdentifier: '51b40e34-2c63-4216-80e9-df3355b7115b', fieldValue: 'OVERDUE', position: 4, isVisible: true },
  ],
  sorts: [
    {
      universalIdentifier: '1ff5dc56-ac0e-4b8e-9f84-97d2fecefb25',
      fieldMetadataUniversalIdentifier: TASK_PRIORITY_FIELD_UUID,
      direction: ViewSortDirection.DESC,
    },
  ],
});
