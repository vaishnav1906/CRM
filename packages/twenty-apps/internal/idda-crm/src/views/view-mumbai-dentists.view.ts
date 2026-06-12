import { defineView, ViewFilterOperand, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_CITY_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_EMAILS_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_SPECIALIZATION_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_MUMBAI_DENTISTS_UUID,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW_MUMBAI_DENTISTS_UUID,
  name: 'Mumbai Dentists',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconMapPin',
  position: 6,
  fields: [
    { universalIdentifier: 'bcb5dcb6-5f83-420b-9be2-09a5af2425e2', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '08072d0c-e770-44be-ae3d-7d9d26353d30', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '9c9abbbd-1d1f-46ee-a26e-31f2d6f653de', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '088728ee-b9ed-4ac7-842c-ffce347b9b5c', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: 'ca90e113-2acc-430e-af7a-475942073536', fieldMetadataUniversalIdentifier: LEAD_EMAILS_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'a99de8b8-482b-4eb8-9b47-15f35f8daa17', fieldMetadataUniversalIdentifier: LEAD_SPECIALIZATION_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '93dc0fbb-4531-45ec-8442-f9a66e5a08b0', fieldMetadataUniversalIdentifier: LEAD_CITY_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: 'f8db53d2-0e4d-4bb9-83f4-1ab2a5270947', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '348f9bfc-9958-441e-a308-32f8c174cbcd',
      fieldMetadataUniversalIdentifier: LEAD_CITY_FIELD_UUID,
      operand: ViewFilterOperand.CONTAINS,
      value: 'Mumbai',
    },
    {
      universalIdentifier: '93aade9e-4b11-4eb0-99c0-be9d907a95b0',
      fieldMetadataUniversalIdentifier: LEAD_SPECIALIZATION_FIELD_UUID,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(['DENTIST']),
    },
  ],
});
