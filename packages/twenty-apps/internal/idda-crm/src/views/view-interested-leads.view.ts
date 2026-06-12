import { defineView, ViewFilterOperand, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_INTEREST_LEVEL_FIELD_UUID,
  LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_PRIORITY_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_INTERESTED_LEADS_UUID,
} from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW_INTERESTED_LEADS_UUID,
  name: 'Interested Leads',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconStar',
  position: 2,
  fields: [
    { universalIdentifier: '89635484-6aa5-4cc5-967c-ecd7e4d0c559', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '2d9a66b7-61c7-4472-bd61-af64502f3c39', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '65baa711-adcd-40c3-bb21-7155c19ba3fa', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '1321fc97-d0e1-4a5d-8e8d-751f1889489c', fieldMetadataUniversalIdentifier: LEAD_INTEREST_LEVEL_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: '1c1d8c10-c20e-4ed9-8556-b20b87f0a39b', fieldMetadataUniversalIdentifier: LEAD_PRIORITY_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'a3fd4ae6-5b9f-42d5-af4a-faa726505174', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '3b891151-7a61-4d2d-ad4b-57a7231e19ce', fieldMetadataUniversalIdentifier: LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: '229c11c7-1004-47e8-a502-3ae26edbe0c2', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: 'c0a4c36e-9650-463c-9520-68ae86441a4e',
      fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(['INTERESTED']),
    },
  ],
});
