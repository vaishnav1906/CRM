import { defineView, ViewFilterOperand, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  TASK_ASSIGNED_TO_FIELD_UUID,
  TASK_DUE_DATE_FIELD_UUID,
  TASK_LEAD_RELATION_FIELD_UUID,
  TASK_OBJECT_UUID,
  TASK_PRIORITY_FIELD_UUID,
  TASK_REMINDER_AT_FIELD_UUID,
  TASK_STATUS_FIELD_UUID,
  TASK_TITLE_FIELD_UUID,
  TASK_TYPE_FIELD_UUID,
  VIEW_MY_TASKS_UUID,
} from 'src/constants/universal-identifiers';

// Active tasks with an owner — each agent's personal work queue
export default defineView({
  universalIdentifier: VIEW_MY_TASKS_UUID,
  name: 'My Tasks',
  objectUniversalIdentifier: TASK_OBJECT_UUID,
  type: ViewType.TABLE,
  icon: 'IconChecklist',
  position: 1,
  fields: [
    { universalIdentifier: 'b1b574bb-5722-4f20-a84c-39fa7ce86430', fieldMetadataUniversalIdentifier: TASK_TITLE_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '9e606604-4e94-45d9-b58d-4a24b5840d8c', fieldMetadataUniversalIdentifier: TASK_TYPE_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: 'ba4b382f-1d2d-46d1-a495-5cdbe5f177c9', fieldMetadataUniversalIdentifier: TASK_STATUS_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '6fb04a90-c57e-4814-bea7-b896835753c7', fieldMetadataUniversalIdentifier: TASK_PRIORITY_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: 'c0ab8643-da52-4dbc-b922-faad5ee50a45', fieldMetadataUniversalIdentifier: TASK_DUE_DATE_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: '83710ff6-5afc-4b9a-ac57-d874eb841ccd', fieldMetadataUniversalIdentifier: TASK_LEAD_RELATION_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '9439cbbb-5672-46c1-8da5-554bdbb4d4d6', fieldMetadataUniversalIdentifier: TASK_REMINDER_AT_FIELD_UUID, position: 6, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '7fc18d90-0b99-4053-bc87-2daf42088a4b',
      fieldMetadataUniversalIdentifier: TASK_ASSIGNED_TO_FIELD_UUID,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
    {
      universalIdentifier: '215f43fd-3d87-4e89-9f16-315facde1eae',
      fieldMetadataUniversalIdentifier: TASK_STATUS_FIELD_UUID,
      operand: ViewFilterOperand.IS_NOT,
      value: JSON.stringify(['DONE']),
    },
  ],
  sorts: [
    {
      universalIdentifier: '78452930-0d09-4647-baec-e4fa17694009',
      fieldMetadataUniversalIdentifier: TASK_DUE_DATE_FIELD_UUID,
      direction: ViewSortDirection.ASC,
    },
  ],
});
