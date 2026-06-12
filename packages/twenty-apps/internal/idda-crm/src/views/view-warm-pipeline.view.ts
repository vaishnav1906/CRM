import { defineView, ViewFilterOperand, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  LEAD_ASSIGNED_TO_FIELD_UUID,
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_CONVERSION_PROBABILITY_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_SCORE_BAND_FIELD_UUID,
  LEAD_SCORE_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_WARM_PIPELINE_UUID,
} from 'src/constants/universal-identifiers';

// Leads with WARM score band (leadScore 50–79) — active nurturing pipeline
export default defineView({
  universalIdentifier: VIEW_WARM_PIPELINE_UUID,
  name: 'Warm Pipeline',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconSun',
  position: 1,
  fields: [
    { universalIdentifier: 'c175ed36-ccb0-452c-84f3-58b8807e9b5d', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: 'ca54fa76-837e-42ee-a6b5-35a7a10bb2cc', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: '02eff25e-b927-4e56-ba4d-b3b3f806c328', fieldMetadataUniversalIdentifier: LEAD_SCORE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: 'e3c4f5cd-40ff-435d-bcaa-ea11853f5123', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: '62da24b3-9774-4f43-9421-cb81752e1aad', fieldMetadataUniversalIdentifier: LEAD_CONVERSION_PROBABILITY_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'bb12c325-3bd5-4ac4-8fc6-90e2ae8c9923', fieldMetadataUniversalIdentifier: LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '9c0b3681-fbec-4899-bece-09653b32554e', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: '6235c90c-53c8-4e4e-83ed-bce7f1643ea8', fieldMetadataUniversalIdentifier: LEAD_ASSIGNED_TO_FIELD_UUID, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '7c39dbea-f666-4307-bee3-f30d5c0bb3f3',
      fieldMetadataUniversalIdentifier: LEAD_SCORE_BAND_FIELD_UUID,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(['WARM']),
    },
  ],
  sorts: [
    {
      universalIdentifier: 'c1faaf3c-cbd5-47f6-90fb-14439725d396',
      fieldMetadataUniversalIdentifier: LEAD_SCORE_FIELD_UUID,
      direction: ViewSortDirection.DESC,
    },
  ],
});
