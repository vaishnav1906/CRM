import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { PERSON_SPECIALIZATION_FIELD_UUID } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: PERSON_SPECIALIZATION_FIELD_UUID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.SELECT,
  name: 'specialization',
  label: 'Specialization',
  icon: 'IconHeartRateMonitor',
  isNullable: true,
  options: [
    {
      id: 'e022275f-551b-48fb-8546-de359d562bf9',
      value: 'DENTIST',
      label: 'Dentist',
      position: 0,
      color: 'sky',
    },
    {
      id: 'd4d64dda-0043-4351-b3df-87527edddf85',
      value: 'DERMATOLOGIST',
      label: 'Dermatologist',
      position: 1,
      color: 'pink',
    },
    {
      id: '90734f30-63c7-4e96-8c6d-d51b170007e5',
      value: 'GENERAL_PHYSICIAN',
      label: 'General Physician',
      position: 2,
      color: 'green',
    },
    {
      id: 'ec458313-4ffe-44d2-abbf-71d089525d5d',
      value: 'PEDIATRICIAN',
      label: 'Pediatrician',
      position: 3,
      color: 'turquoise',
    },
    {
      id: 'f70fe909-fe34-484b-90f4-ee301eba9ae2',
      value: 'ENT',
      label: 'ENT',
      position: 4,
      color: 'blue',
    },
    {
      id: '301cf4b3-5238-47eb-ba7a-82b8cd048a0b',
      value: 'OPHTHALMOLOGIST',
      label: 'Ophthalmologist',
      position: 5,
      color: 'purple',
    },
    {
      id: '2a08e364-df48-4d69-8504-b549393ddccf',
      value: 'GYNECOLOGIST',
      label: 'Gynecologist',
      position: 6,
      color: 'orange',
    },
    {
      id: 'b9f51712-cc47-4088-8e8c-6e4a71cedeca',
      value: 'ORTHOPEDIC',
      label: 'Orthopedic',
      position: 7,
      color: 'yellow',
    },
    {
      id: '4e42e8a1-1e56-4592-8d81-945f91c2bcf8',
      value: 'OTHER',
      label: 'Other',
      position: 8,
      color: 'gray',
    },
  ],
});
