import { defineView, ViewFilterOperand, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  TASK_ASSIGNED_TO_FIELD_UUID,
  TASK_DUE_DATE_FIELD_UUID,
  TASK_LEAD_RELATION_FIELD_UUID,
  TASK_OBJECT_UUID,
  TASK_PRIORITY_FIELD_UUID,
  TASK_STATUS_FIELD_UUID,
  TASK_TITLE_FIELD_UUID,
  TASK_TYPE_FIELD_UUID,
  VIEW_OVERDUE_TASKS_UUID,
} from 'src/constants/universal-identifiers';

// Tasks that are past due — requires immediate attention
export default defineView({
  universalIdentifier: VIEW_OVERDUE_TASKS_UUID,
  name: 'Overdue Tasks',
  objectUniversalIdentifier: TASK_OBJECT_UUID,
  type: ViewType.TABLE,
  icon: 'IconAlertCircle',
  position: 2,
  fields: [
    { universalIdentifier: '3e6af77a-705a-4925-b1d2-652811e39781', fieldMetadataUniversalIdentifier: TASK_TITLE_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '61cdaa78-7d56-4c66-a35f-573d1cf9d734', fieldMetadataUniversalIdentifier: TASK_TYPE_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '3e054f3c-f058-4762-a9fb-ee50c95908dd', fieldMetadataUniversalIdentifier: TASK_PRIORITY_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: 'de698cfc-bc9d-4538-9b91-6fedde325683', fieldMetadataUniversalIdentifier: TASK_DUE_DATE_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: '7f5677af-d7ad-4e99-aec2-3e7282d8035d', fieldMetadataUniversalIdentifier: TASK_LEAD_RELATION_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: '7e5a335c-c4ac-40a8-8b6a-c16d2c2535f5', fieldMetadataUniversalIdentifier: TASK_ASSIGNED_TO_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '740b6cde-878e-434e-a5a7-d1201ef39b6a', fieldMetadataUniversalIdentifier: TASK_STATUS_FIELD_UUID, position: 6, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: 'dcdfc919-c792-4873-ac87-763c23c5e5b4',
      fieldMetadataUniversalIdentifier: TASK_DUE_DATE_FIELD_UUID,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: 'PAST_7_DAYS',
    },
    {
      universalIdentifier: '248c8a84-4f80-4c08-b2f2-7b68018fde78',
      fieldMetadataUniversalIdentifier: TASK_STATUS_FIELD_UUID,
      operand: ViewFilterOperand.IS_NOT,
      value: JSON.stringify(['DONE']),
    },
  ],
  sorts: [
    {
      universalIdentifier: '8ac37501-d85a-46a0-893a-452ff03e1d06',
      fieldMetadataUniversalIdentifier: TASK_DUE_DATE_FIELD_UUID,
      direction: ViewSortDirection.ASC,
    },
  ],
});
