import { defineView, ViewFilterOperand, ViewSortDirection, ViewType } from 'twenty-sdk/define';

import {
  LEAD_CLINIC_NAME_FIELD_UUID,
  LEAD_DATA_CONFIDENCE_SCORE_FIELD_UUID,
  LEAD_DOCTOR_NAME_FIELD_UUID,
  LEAD_ENRICHMENT_SOURCE_FIELD_UUID,
  LEAD_ENRICHMENT_STATUS_FIELD_UUID,
  LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  LEAD_PHONES_FIELD_UUID,
  LEAD_SCRAPED_AT_FIELD_UUID,
  LEAD_STAGE_FIELD_UUID,
  VIEW_RECENTLY_IMPORTED_UUID,
} from 'src/constants/universal-identifiers';

// Leads imported/scraped in the last 7 days — quality assurance view
export default defineView({
  universalIdentifier: VIEW_RECENTLY_IMPORTED_UUID,
  name: 'Recently Imported',
  objectUniversalIdentifier: LEAD_OBJECT_UNIVERSAL_IDENTIFIER,
  type: ViewType.TABLE,
  icon: 'IconCloudDownload',
  position: 7,
  fields: [
    { universalIdentifier: '219afd60-dee0-478d-9dac-7d04c3131cd1', fieldMetadataUniversalIdentifier: LEAD_DOCTOR_NAME_FIELD_UUID, position: 0, isVisible: true },
    { universalIdentifier: '5c530872-94ca-4d27-b5ee-14e8020ab730', fieldMetadataUniversalIdentifier: LEAD_CLINIC_NAME_FIELD_UUID, position: 1, isVisible: true },
    { universalIdentifier: 'adf6fbac-ec2e-41fd-b174-4441ae65fd19', fieldMetadataUniversalIdentifier: LEAD_SCRAPED_AT_FIELD_UUID, position: 2, isVisible: true },
    { universalIdentifier: '54f43df6-97ef-4a65-95ac-fcf20113af72', fieldMetadataUniversalIdentifier: LEAD_ENRICHMENT_SOURCE_FIELD_UUID, position: 3, isVisible: true },
    { universalIdentifier: '98f1f256-093b-42ce-ac09-d934b22115ea', fieldMetadataUniversalIdentifier: LEAD_ENRICHMENT_STATUS_FIELD_UUID, position: 4, isVisible: true },
    { universalIdentifier: 'c3a43129-5be6-41d5-b01c-4fe697095617', fieldMetadataUniversalIdentifier: LEAD_DATA_CONFIDENCE_SCORE_FIELD_UUID, position: 5, isVisible: true },
    { universalIdentifier: 'b40081fc-6081-4410-9ea4-5d591dac7029', fieldMetadataUniversalIdentifier: LEAD_STAGE_FIELD_UUID, position: 6, isVisible: true },
    { universalIdentifier: '8945a870-5d1c-4bb5-82d1-9d2bbde239bb', fieldMetadataUniversalIdentifier: LEAD_PHONES_FIELD_UUID, position: 7, isVisible: true },
  ],
  filters: [
    {
      universalIdentifier: '76f3bb68-5505-446f-b416-a7fbb2fce8a9',
      fieldMetadataUniversalIdentifier: LEAD_SCRAPED_AT_FIELD_UUID,
      operand: ViewFilterOperand.IS_RELATIVE,
      value: 'PAST_7_DAYS',
    },
  ],
  sorts: [
    {
      universalIdentifier: '1a59e397-3a3e-4c34-8e08-3a48a1348fea',
      fieldMetadataUniversalIdentifier: LEAD_SCRAPED_AT_FIELD_UUID,
      direction: ViewSortDirection.DESC,
    },
  ],
});
