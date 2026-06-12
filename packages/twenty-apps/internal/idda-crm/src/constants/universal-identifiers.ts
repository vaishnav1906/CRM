// IDDA Assurance CRM — Universal Identifiers
// WARNING: Never mutate these values after deployment.

// Application
export const APPLICATION_UNIVERSAL_IDENTIFIER =
  '1c7374ce-be90-4f8e-a65f-7b3120b0d597';

// ─── Roles ───────────────────────────────────────────────────────────────────
export const MANAGER_ROLE_UNIVERSAL_IDENTIFIER =
  '78dbcb4c-853d-4b87-bed6-eba11ded288b';
export const EMPLOYEE_ROLE_UNIVERSAL_IDENTIFIER =
  '9e414b0f-d6f3-46ef-9877-a5af71845935';
export const RESEARCH_AGENT_ROLE_UNIVERSAL_IDENTIFIER =
  '68e856a8-9f4d-4532-aa8a-ae21d9e6c380';
export const CALLING_AGENT_ROLE_UNIVERSAL_IDENTIFIER =
  '90a50c52-9d7f-4d0b-8acd-1881a212222b';
export const SALES_AGENT_ROLE_UNIVERSAL_IDENTIFIER =
  'dc2f5d38-0e1d-453c-a64d-ca5156f6bc68';

// ─── Lead object ─────────────────────────────────────────────────────────────
export const LEAD_OBJECT_UNIVERSAL_IDENTIFIER =
  '053b9916-b725-428b-ada1-4676a25c343f';

// Lead core fields (original — do not mutate)
export const LEAD_DOCTOR_NAME_FIELD_UUID =
  'fe54e2bc-33af-4362-a729-1e250ee1b8c6';
export const LEAD_CLINIC_NAME_FIELD_UUID =
  '58d2d560-66be-4d93-9afd-0058cafccbde';
export const LEAD_PHONES_FIELD_UUID = '2ab02782-c881-4535-8765-0f49a987733d';
export const LEAD_EMAILS_FIELD_UUID = 'c0e08156-5033-4aca-9475-dc7c3abe339f';
export const LEAD_CITY_FIELD_UUID = 'af63338c-4ac7-49a2-bce7-ea04ef3d9d21';
export const LEAD_STATE_FIELD_UUID = 'f8731af9-747b-41f5-909c-35cc18f6d713';
export const LEAD_SPECIALIZATION_FIELD_UUID =
  '8063f8c0-984b-4a9f-8f9a-cfc681464744';
export const LEAD_WEBSITE_FIELD_UUID = 'e7d0db28-6e6f-45ae-90b9-3958aee2cf0b';
export const LEAD_INSTAGRAM_FIELD_UUID =
  '97b319b1-e5b4-4903-88ce-67a0c2e028da';
export const LEAD_SOURCE_FIELD_UUID = 'a24b3766-53e0-41d2-94fc-4ef56595e526';
export const LEAD_STAGE_FIELD_UUID = '4b5d4e86-0639-42ab-8f76-276bc8f0d4bf';
export const LEAD_LAST_CONTACTED_AT_FIELD_UUID =
  '080ef7df-7281-4181-9071-a6636bc2cef9';
export const LEAD_NEXT_FOLLOW_UP_AT_FIELD_UUID =
  'd3a35415-eb86-4ffc-8daf-02cece0249aa';
export const LEAD_PRIORITY_FIELD_UUID =
  'b13e4083-42a3-4452-bc78-c4a0dd98fe3b';
export const LEAD_POSITION_FIELD_UUID =
  '15865def-0a3f-4f87-9c6e-e7a03a39e6de';

// Lead ↔ WorkspaceMember (assignedTo)
export const LEAD_ASSIGNED_TO_FIELD_UUID =
  '9cbcaceb-3ac0-4574-b2bf-e1d0cee1d872';
export const WORKSPACE_MEMBER_ASSIGNED_LEADS_FIELD_UUID =
  '7d58cc32-7712-4266-9b75-3a10ee7f216b';

// Phase 2 — Team ownership
export const LEAD_ASSIGNED_TEAM_FIELD_UUID =
  '844b8281-51e3-44e8-9441-440975901172';

// Phase 4 — Calling & sales operation fields
export const LEAD_CALL_STATUS_FIELD_UUID =
  'cacd6527-464a-4c54-852c-3eb1b98c85d2';
export const LEAD_CALL_OUTCOME_FIELD_UUID =
  'dffc522b-10da-41ed-a59d-58c54ecfca41';
export const LEAD_LAST_CALL_DATE_FIELD_UUID =
  'afb1b1b4-67c0-48b0-b7d8-4e43ba30cc74';
export const LEAD_NEXT_CALL_DATE_FIELD_UUID =
  '55848123-190f-4849-bd6d-c176bd01247e';
export const LEAD_MEETING_DATE_FIELD_UUID =
  'e5f6de5b-ce3f-4b5f-a991-9fa0a423c192';
export const LEAD_MEETING_MODE_FIELD_UUID =
  '11761be9-953b-4e51-a9a1-792e13f16ea7';
export const LEAD_MEETING_OUTCOME_FIELD_UUID =
  'a2048186-b39a-4e58-98e8-6e4a9e6de899';
export const LEAD_INTEREST_LEVEL_FIELD_UUID =
  '26ac48ca-d9dd-4cd7-9898-a337dc3b3fac';
export const LEAD_BUDGET_RANGE_FIELD_UUID =
  '262f6229-14a2-4b6d-9868-267661d64426';
export const LEAD_CONVERSION_PROBABILITY_FIELD_UUID =
  '77b22840-87ba-4cb8-8f2f-3471c2fd6807';
export const LEAD_EXPECTED_CLOSURE_DATE_FIELD_UUID =
  '5542464d-7040-4a68-bf9b-41d292ac3b55';
export const LEAD_FOLLOW_UP_NOTES_FIELD_UUID =
  '5105dd4c-fd3f-4a1d-b2b9-6e64f13d00d6';
export const LEAD_OBJECTIONS_FIELD_UUID =
  'c5b2eda9-939b-449e-8845-45e67615764f';

// Phase 6 — Research ingestion metadata
export const LEAD_IMPORT_BATCH_ID_FIELD_UUID =
  '056c5b1b-8194-4d26-b24a-42f3c067801f';
export const LEAD_ENRICHMENT_SOURCE_FIELD_UUID =
  '5090b6d0-0a0d-4032-b529-94d54c0649aa';
export const LEAD_DATA_CONFIDENCE_SCORE_FIELD_UUID =
  '148ccb03-458a-4bac-b716-8212032f14c2';
export const LEAD_SCRAPED_AT_FIELD_UUID =
  '9f0dad2b-e503-42e5-ab62-185efb743419';

// Phase 3 — Lead ↔ LeadActivity back-refs
export const LEAD_LEAD_ACTIVITIES_FIELD_UUID =
  '86a3ed7d-3403-4e58-bbe8-a741b4a2a0d7';
export const WORKSPACE_MEMBER_LEAD_ACTIVITIES_FIELD_UUID =
  'ec57b23a-c6ec-42a7-b00b-73abe83fb10e';

// ─── LeadActivity object ──────────────────────────────────────────────────────
export const LEAD_ACTIVITY_OBJECT_UUID =
  '5ef470a5-4519-4d2f-bedd-1ce6f98811b8';
export const LEAD_ACTIVITY_EVENT_TYPE_FIELD_UUID =
  '6fa7c870-4001-42bc-b580-25ef47b6de83';
export const LEAD_ACTIVITY_FROM_VALUE_FIELD_UUID =
  '2f58aa8c-e6ba-4c8e-9855-5acd43b6871e';
export const LEAD_ACTIVITY_TO_VALUE_FIELD_UUID =
  'a655154d-4d34-4688-9636-b3cb27bb0d5f';
export const LEAD_ACTIVITY_DESCRIPTION_FIELD_UUID =
  'e4269ada-ea88-4eb6-9fe9-615684e143c9';
export const LEAD_ACTIVITY_OCCURRED_AT_FIELD_UUID =
  'dd3537b1-311b-47a8-9880-ba910d91652d';
export const LEAD_ACTIVITY_LEAD_RELATION_FIELD_UUID =
  '313ab21e-8446-4739-8054-8381dd3a1282';
export const LEAD_ACTIVITY_PERFORMED_BY_FIELD_UUID =
  'f0ac78ea-c4f2-49a7-a292-332164954da6';
export const LEAD_ACTIVITY_POSITION_FIELD_UUID =
  '7fa1e3c4-8b2d-4f9a-9c5e-2d1b3a4c6d8f';

// ─── Extended fields on Person / Company ─────────────────────────────────────
export const PERSON_SPECIALIZATION_FIELD_UUID =
  'dbeb606c-df36-443f-b8ca-60205c30cfe6';
export const PERSON_INSTAGRAM_FIELD_UUID =
  '991a4971-d609-44ee-ae16-5eedb3fd58e2';
export const PERSON_LEAD_STATE_FIELD_UUID =
  '76a8c6b4-8a23-4b12-aaea-2d42be938a69';
export const COMPANY_CLINIC_TYPE_FIELD_UUID =
  '688cb8f6-0c87-460a-a6bb-02c919877801';
export const COMPANY_STATE_FIELD_UUID =
  '04cd4e99-405f-4892-b163-331d8122c68a';

// Phase 7 — Data model enrichment fields
export const LEAD_EXTERNAL_ID_FIELD_UUID =
  '9fe9658b-4952-44a7-a147-e713c8cd85d5';
export const LEAD_ENRICHMENT_STATUS_FIELD_UUID =
  '5b00907c-fb69-4a67-a5dc-e161ff83281a';
export const LEAD_IMPORTED_AT_FIELD_UUID =
  '3d19eec2-1ea1-44fd-9099-5ea8ca1be214';

// ─── Logic functions ──────────────────────────────────────────────────────────
export const LEAD_ACTIVITY_LOGGER_UUID =
  '4687e430-6f27-449b-8d18-77c290c07ae8';
export const LEAD_CREATED_LOGGER_UUID =
  '9c413aff-54cf-4a89-b015-0616eedaa84f';

// ─── Views ────────────────────────────────────────────────────────────────────
// Phase 4 — Operational task views
export const VIEW_TODAY_FOLLOWUPS_UUID =
  'be681436-f835-4a53-a1c4-c29fcbf33f49';
export const VIEW_MEETINGS_TODAY_UUID =
  'c6b5b85b-7c19-44e3-be48-164e49bcb722';
// Phase 5 — Advanced segmentation
export const VIEW_HIGH_PRIORITY_UUID =
  '3e3f57da-a8ae-4bbb-a1f2-bc36c2a4283a';
export const VIEW_REJECTED_LEADS_UUID =
  'da95a2ab-6c98-4198-bc50-d4c2005c6560';
export const VIEW_UNASSIGNED_LEADS_UUID =
  'c3a4157e-5151-4cc0-8b32-220237096878';
export const VIEW_RECENTLY_IMPORTED_UUID =
  '390733c0-9b2d-471c-8b69-1e2b4db074e2';

// ─── Views ───────────────────────────────────────────────────────────────────
export const ALL_LEADS_TABLE_VIEW_UUID =
  'a48cefb5-2a00-4892-ada0-e4027e1211f8';
export const LEADS_PIPELINE_BOARD_VIEW_UUID =
  '9e95b311-e739-4ebc-9cbf-5758aa9cf27e';
export const LEAD_ACTIVITY_ALL_VIEW_UUID =
  '27e8c92f-c4f6-4acc-a81b-7eb40d146897';
// Segmented views
export const VIEW_MUMBAI_DENTISTS_UUID =
  '60f831da-c542-4a7d-8cb0-380dfd6653c6';
export const VIEW_DELHI_DERMATOLOGISTS_UUID =
  '527f6884-9f97-48a7-b858-c51fce2560bf';
export const VIEW_INTERESTED_LEADS_UUID =
  'd1e991ea-9ad3-4504-8db9-24d16bc8148b';
export const VIEW_PENDING_FOLLOWUPS_UUID =
  'ce31665a-87b7-4720-a97e-f171d266efca';
export const VIEW_HOT_LEADS_UUID = '8c72d10b-bdb7-4cdf-8876-a88205a6d205';
export const VIEW_RESEARCH_QUEUE_UUID =
  '04985245-fded-4b6b-a252-dc3cf0572351';
export const VIEW_SALES_QUEUE_UUID = 'c8385c55-403a-48e8-b782-c7230443dd7a';
export const VIEW_MEETINGS_THIS_WEEK_UUID =
  'f050cf76-3133-4bac-bfe3-78d738fe8a3f';

// ─── Navigation ───────────────────────────────────────────────────────────────
export const LEADS_FOLDER_NAV_UUID = 'ab2db377-bad2-44b2-a1c0-ceac4b4a39de';
export const PIPELINE_NAV_UUID = '563162ac-f56c-41d7-9b04-7a2b601810cd';
export const ALL_LEADS_NAV_UUID = 'd85236eb-77a5-498d-9f93-0d77e57d1e65';
export const LEAD_ACTIVITY_NAV_UUID = '3350275e-8f67-48bb-a326-4f34963cddde';
// Segments folder + items
export const NAV_SEGMENTS_FOLDER_UUID =
  '9b620988-0f08-4752-9b5a-4e2eb47f1c7d';
export const NAV_MUMBAI_DENTISTS_UUID =
  'e04c5a0d-a5ff-4513-a669-e7ceb9f70da1';
export const NAV_DELHI_DERMATOLOGISTS_UUID =
  '04a41031-90c3-4c62-a40d-415fb09216bc';
export const NAV_INTERESTED_LEADS_UUID =
  '78c578fc-b243-46f4-a3d1-337769635ee1';
export const NAV_PENDING_FOLLOWUPS_UUID =
  'c16e568f-46ba-4173-bbc8-1df95ee927c9';
export const NAV_HOT_LEADS_UUID = 'db631402-417b-4259-85d0-e1fc10541e55';
// Operations folder + items
export const NAV_OPERATIONS_FOLDER_UUID =
  '97815f48-5e14-411a-9b90-6d3e8716752c';
export const NAV_RESEARCH_QUEUE_UUID =
  '12081b1d-0344-4d13-ad18-07e87d374242';
export const NAV_SALES_QUEUE_UUID = '060438d1-d9a0-481a-8a75-f1a698695f1e';
export const NAV_MEETINGS_THIS_WEEK_UUID =
  '1242a164-9f79-4605-895c-ee82b02fdc2e';
// Phase 4 — Operational task nav items
export const NAV_TODAY_FOLLOWUPS_UUID =
  '557f342c-fea6-4962-822d-a9bce4e536c9';
export const NAV_MEETINGS_TODAY_UUID =
  '9d7392f8-44eb-4191-8979-d93e8b9bff7c';
// Phase 5 — Advanced segmentation nav items
export const NAV_HIGH_PRIORITY_UUID =
  '01cffc83-d5c4-4415-9d71-a5ffbea70132';
export const NAV_REJECTED_LEADS_UUID =
  '4d8a28f0-a803-4ba2-9fde-95e0045c196f';
export const NAV_UNASSIGNED_LEADS_UUID =
  '5ad9a163-fb21-42b6-bf73-28bd206841bd';
export const NAV_RECENTLY_IMPORTED_UUID =
  'b9ede26a-c72d-42cc-80ca-cfef33dfa8bf';

// ─── Phase 9 — Lead Scoring Engine ───────────────────────────────────────────
export const LEAD_SCORE_FIELD_UUID =
  '63305849-e331-47cf-8dee-3de26a1d11d6';
export const LEAD_SCORE_BAND_FIELD_UUID =
  'c181c480-00ce-40c0-ae46-a722b29924d9';
export const LEAD_SCORE_EXPLANATION_FIELD_UUID =
  '40f616d0-8c99-423d-9eb9-3c2c723479bf';
export const LEAD_SCORE_CALCULATOR_UUID =
  'b5fec6ff-d768-4a39-89f7-ec394a326e8c';
export const VIEW_HOT_LEADS_SCORE_UUID =
  '6d0dde15-0e78-40d5-8886-ec8de0c7d554';
export const VIEW_WARM_PIPELINE_UUID =
  'ec56dc9c-894d-45f1-bcfb-45796ee3bf0a';
export const VIEW_COLD_AT_RISK_UUID =
  '0aa73a02-ea17-427f-9790-45227f1c1111';
export const NAV_SCORE_FOLDER_UUID =
  '673ad8cc-9698-421d-bc47-eb7b718a6f7d';
export const NAV_HOT_LEADS_SCORE_UUID =
  '8c54c12a-5dce-4d3f-ab48-d931d3766907';
export const NAV_WARM_PIPELINE_UUID =
  'c019692a-3a6e-4735-b0d4-90154e2ca236';
export const NAV_COLD_AT_RISK_UUID =
  'a42dae7c-13b3-4c36-8375-4bea77be9d3e';

// ─── Phase 10 — Communication Timeline (LeadActivity fields) ─────────────────
export const LEAD_ACTIVITY_COMM_CHANNEL_FIELD_UUID =
  'adc8ce12-3378-4161-85ac-425ef53ae7d3';
export const LEAD_ACTIVITY_DIRECTION_FIELD_UUID =
  'de663231-f7d4-4388-85f8-4178e1ed5668';
export const LEAD_ACTIVITY_DURATION_FIELD_UUID =
  '11a6c378-4c37-4650-9731-e8e11ee8b43b';
export const LEAD_ACTIVITY_ATTACHMENT_URLS_FIELD_UUID =
  '89a33788-e688-48f3-aa22-28eae07ef290';
export const LEAD_ACTIVITY_SENTIMENT_FIELD_UUID =
  'cbc8326c-b4bf-4030-a83a-4b77cdd01eae';
export const LEAD_ACTIVITY_AI_SUMMARY_FIELD_UUID =
  '51c30d32-de9e-48df-bb1c-7c231bd4af53';

// ─── Phase 11 — Task Engine ───────────────────────────────────────────────────
export const TASK_OBJECT_UUID = 'a66577b8-3c66-46d9-9b63-c933ffbc0eda';
export const TASK_TITLE_FIELD_UUID = '18f389c4-a589-4a29-a4c1-eaa2c89f1c31';
export const TASK_DESCRIPTION_FIELD_UUID =
  '3658bbf1-c1dd-4587-ae9b-8a45ee84339a';
export const TASK_DUE_DATE_FIELD_UUID =
  '22699ef1-2b0c-4ac0-84ea-1a59ca4cb4aa';
export const TASK_PRIORITY_FIELD_UUID =
  '1de6a29d-add9-40aa-8217-7cfa3d1ee042';
export const TASK_STATUS_FIELD_UUID = 'dba75d0f-b08d-4189-87a1-bc911eb9ddf4';
export const TASK_COMPLETED_AT_FIELD_UUID =
  '0cc06379-ce9a-4d9c-a589-8c8fcfc7d8a2';
export const TASK_TYPE_FIELD_UUID = '8aa7f043-fd95-479f-960f-fedbf0a17974';
export const TASK_REMINDER_AT_FIELD_UUID =
  '1e7123e1-066e-419e-8d41-b5f7bdff8fd9';
export const TASK_LEAD_RELATION_FIELD_UUID =
  'fdcc8832-be67-4c55-b360-a5da3e3cb0f4';
export const TASK_ASSIGNED_TO_FIELD_UUID =
  '56ed75bb-d8b1-4b51-934e-f45e84f190d7';
export const TASK_POSITION_FIELD_UUID =
  '50445001-8b2d-4809-b4fa-b5379cb8f81b';
export const LEAD_TASKS_REVERSE_FIELD_UUID =
  '1410cbb0-7198-40eb-8330-91d704182fae';
export const WORKSPACE_MEMBER_TASKS_REVERSE_FIELD_UUID =
  '4bb442bf-4515-4303-90bc-8bc903c39946';
export const TASK_AUTOMATION_UUID = '2c85fc20-7702-4fc5-be60-8e01e79a7d22';
export const VIEW_TASK_BOARD_UUID = 'dedcfce2-ce9d-4c55-be75-75dda314d42d';
export const VIEW_MY_TASKS_UUID = 'e1a309bf-2311-486a-82df-1b73c08c7064';
export const VIEW_OVERDUE_TASKS_UUID =
  '2600d982-02a7-40b5-82a2-f65a4add9c98';
export const NAV_TASKS_FOLDER_UUID = 'f4705d2f-819f-478d-af14-92cd22cf0f39';
export const NAV_TASK_BOARD_UUID = '753b4ec6-e55d-4739-b3a0-c2542f228402';
export const NAV_MY_TASKS_UUID = '7460797c-4570-48cf-96f2-d10d87d16fc8';
export const NAV_OVERDUE_TASKS_UUID =
  '191406ce-dbb4-441e-b69a-de0e7775b383';

// ─── Phase 16 — Follow-Up Cron Reminder ──────────────────────────────────────
export const FOLLOW_UP_REMINDER_CRON_UUID =
  'fdda0016-0000-4000-8000-000000000001';

// ─── Phase 17 — Extended location & chain-clinic detection ───────────────────
export const LEAD_TOWN_FIELD_UUID =
  'c9d8e7f6-a5b4-4321-8765-def012345678';
export const LEAD_WEBSITE_ADDRESS_FIELD_UUID =
  'd0e9f8a7-b6c5-4432-9876-ef0123456789';

// ─── Phase 12 — AI Infrastructure (Lead fields) ──────────────────────────────
export const LEAD_AI_SUMMARY_FIELD_UUID =
  '95331296-fd0b-4967-88ca-761d1db31d2a';
export const LEAD_AI_NEXT_ACTION_FIELD_UUID =
  'dbf999b3-f2ab-415e-8e06-ea9a0c44e5d2';
export const LEAD_AI_CONFIDENCE_FIELD_UUID =
  '5bf276d2-339b-4874-a58e-b7945fb5fc3f';
export const LEAD_AI_TAGS_FIELD_UUID =
  '500c54f3-0fd0-47a8-9520-f1af37b83086';
