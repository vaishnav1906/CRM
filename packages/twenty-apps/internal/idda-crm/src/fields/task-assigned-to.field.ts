import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  TASK_ASSIGNED_TO_FIELD_UUID,
  TASK_OBJECT_UUID,
  WORKSPACE_MEMBER_TASKS_REVERSE_FIELD_UUID,
} from 'src/constants/universal-identifiers';

// Forward: Task.assignedTo → WorkspaceMember
export default defineField({
  universalIdentifier: TASK_ASSIGNED_TO_FIELD_UUID,
  objectUniversalIdentifier: TASK_OBJECT_UUID,
  type: FieldType.RELATION,
  name: 'assignedTo',
  label: 'Assigned To',
  icon: 'IconUserCircle',
  isNullable: true,
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.workspaceMember.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    WORKSPACE_MEMBER_TASKS_REVERSE_FIELD_UUID,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'assignedToId',
  },
});
