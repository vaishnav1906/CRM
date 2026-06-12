import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_STATE_FIELD_UUID } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_STATE_FIELD_UUID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'state',
  label: 'State',
  icon: 'IconMap',
  isNullable: true,
});
