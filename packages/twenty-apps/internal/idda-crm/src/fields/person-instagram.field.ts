import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_INSTAGRAM_FIELD_UUID } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_INSTAGRAM_FIELD_UUID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.LINKS,
  name: 'instagram',
  label: 'Instagram',
  icon: 'IconBrandInstagram',
  isNullable: true,
});
