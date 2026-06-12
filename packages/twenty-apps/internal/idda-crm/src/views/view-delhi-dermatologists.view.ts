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
  VIEW_DELHI_DERMATOLOGISTS_UUID,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW_DELHI_DERMATOLOGISTS_UUID,
  name: 'Delhi Dermatologists',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconMapPin',
  position: 7,
  fields: [
    { universalIdentifier: '27c58627-2923-4d90-bb76-42d36deb9c01', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '4f1ecfdc-5796-4a60-9ad5-1d1832dc596f', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: 'e2fd057c-5294-48a3-a4ce-5b3ba819f09a', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: 'f3935ac1-3008-47c5-b4ec-a6a66f0919b4', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: '6bf0f153-5304-461b-8641-6fd557213203', fieldMetadataUniversalIdentifier: LEAD_EMAILS_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: '06a3d4b0-79ff-4435-afa1-757f0dbb3f08', fieldMetadataUniversalIdentifier: LEAD_SPECIALIZATION_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: 'd5c86d4f-8c03-425b-8fb7-17bac33722b2', fieldMetadataUniversalIdentifier: LEAD_CITY_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: '80a001d4-fa11-4005-b070-86635797b254', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: 'c7905b2b-40a5-453c-b7f8-e43877d47873',
      fieldMetadataUniversalIdentifier: LEAD_CITY_FIELD_UUID,
      operand: ViewFilterOperand.CONTAINS,
      value: 'Delhi',
    },
    {
      universalIdentifier: '68c62f7e-bf74-4019-9e5b-a9fd067e1bb4',
      fieldMetadataUniversalIdentifier: LEAD_SPECIALIZATION_FIELD_UUID,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(['DERMATOLOGIST']),
    },
  ],
});
