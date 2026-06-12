import { defineView, ViewFilterOperand, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_CITY_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_PRIORITY_FIELD_UUID,
  LEAD_SPECIALIZATION_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_UNASSIGNED_LEADS_UUID,
} from 'src/constants/universal-identifiers';

// Leads with no assignedTo — need ownership
export default defineView({
  universalIdentifier: VIEW_UNASSIGNED_LEADS_UUID,
  name: 'Unassigned Leads',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconUserOff',
  position: 6,
  fields: [
    { universalIdentifier: '5bf7dabd-fd8c-493e-9797-68016e3d7f7c', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '22ac20ee-c1be-41a0-b066-53bcf50fe500', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: 'fedaeed7-4b44-4e5a-85e1-cf3534ea607f', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '56cc301a-b089-4fbc-9c0d-7aebba93f29a', fieldMetadataUniversalIdentifier: LEAD_SPECIALIZATION_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: '526f1513-8757-4a4a-af8c-ef89facfd269', fieldMetadataUniversalIdentifier: LEAD_CITY_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'c6f2b881-a340-4fa7-9b78-6af833241eb3', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: 'aadc2bc4-c273-45c6-bafa-ebb49c86ce76', fieldMetadataUniversalIdentifier: LEAD_PRIORITY_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: '4912e91f-b6ef-4833-9cb4-c071259c1c97', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '688495ce-095f-41b4-8b1b-3ab81bcf4919',
      fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID,
      operand: ViewFilterOperand.IS_EMPTY,
      value: '',
    },
  ],
});
