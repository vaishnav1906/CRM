import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_LEAD_STATE_FIELD_UUID } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_LEAD_STATE_FIELD_UUID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.TEXT,
  name: 'leadState',
  label: 'State',
  icon: 'IconMap',
  isNullable: true,
});
