import { defineView, ViewFilterOperand, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_LAST_CONTACTED_AT_FIELD_UUID,
  LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_SCORE_BAND_FIELD_UUID,
  LEAD_SCORE_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_COLD_AT_RISK_UUID,
} from 'src/constants/universal-identifiers';

// Leads with COLD score band — at-risk, need re-engagement
export default defineView({
  universalIdentifier: VIEW_COLD_AT_RISK_UUID,
  name: 'Cold / At-Risk',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconSnowflake',
  position: 2,
  fields: [
    { universalIdentifier: 'd3f0a85c-805f-4a10-8e1c-b8306aba523a', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: 'e617df2d-9d25-4503-ac2d-9e320b38a0f1', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: 'd76ba82f-bbb2-4cef-bdae-4becc0044263', fieldMetadataUniversalIdentifier: LEAD_SCORE_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: 'a32d5b0d-089c-4eee-ab2d-3ef79919f00a', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: '001ec5aa-b35c-4e7a-b668-77a63e056ca8', fieldMetadataUniversalIdentifier: LEAD_LAST_CONTACTED_AT_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'b139de14-499c-4056-9baa-f785a3151da8', fieldMetadataUniversalIdentifier: LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: '7fb99750-6f78-4fdf-aa27-4096e51f919a', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 6, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '15f194b6-2880-491a-8bbf-736735d355f3',
      fieldMetadataUniversalIdentifier: LEAD_SCORE_BAND_FIELD_UUID,
      operand: ViewFilterOperand.IS,
      value: JSON.stringify(['COLD']),
    },
  ],
  sorts: [
    {
      universalIdentifier: '792c2054-f0d8-4ac0-8d03-b23f2b353fc0',
      fieldMetadataUniversalIdentifier: LEAD_SCORE_FIELD_UUID,
      direction: ViewSortDirection.ASC,
    },
  ],
});
