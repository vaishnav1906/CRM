import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_CLINIC_TYPE_FIELD_UUID } from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier: COMPANY_CLINIC_TYPE_FIELD_UUID,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'clinicType',
  label: 'Clinic Type',
  icon: 'IconBuildingHospital',
  isNullable: true,
  options: [
    {
      id: 'e190bb49-3ae2-4b6f-9cf9-d2153ba02793',
      value: 'DENTAL_CLINIC',
      label: 'Dental Clinic',
      position: 0,
      color: 'sky',
    },
    {
      id: '5365845f-ea0a-4df4-9a1a-61f2358c108c',
      value: 'DERMA_CLINIC',
      label: 'Derma Clinic',
      position: 1,
      color: 'pink',
    },
    {
      id: '386d4882-398d-478e-8061-98d4322003d9',
      value: 'MULTI_SPECIALTY',
      label: 'Multi-Specialty',
      position: 2,
      color: 'green',
    },
    {
      id: '9da1fd99-1adf-4662-a0c5-ed9e0ca804d9',
      value: 'HOSPITAL',
      label: 'Hospital',
      position: 3,
      color: 'blue',
    },
    {
      id: '5a505790-0609-4788-8657-31ad36122338',
      value: 'POLYCLINIC',
      label: 'Polyclinic',
      position: 4,
      color: 'purple',
    },
    {
      id: '9bca714d-aeb8-427c-aee0-224ed5f5d25e',
      value: 'OTHER',
      label: 'Other',
      position: 5,
      color: 'gray',
    },
  ],
});
