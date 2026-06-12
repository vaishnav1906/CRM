-- Fix SELECT/MULTI_SELECT viewFilter rows where value is a plain string
-- instead of a JSON-encoded array (e.g. "DENTIST" → '["DENTIST"]').
--
-- Root cause: IDDA CRM views were created with value: 'DENTIST' instead of
-- value: JSON.stringify(['DENTIST']), so the frontend's arrayOfStringsOrVariablesSchema
-- called JSON.parse("DENTIST") which threw SyntaxError and crashed the page.
--
-- Run once against your Twenty CRM database:
--   psql $DATABASE_URL -f fix-select-filter-values.sql

BEGIN;

-- Wrap each plain-string SELECT filter value into a single-element JSON array.
-- We target the 10 known bad rows by ID for safety.
UPDATE core."viewFilter"
SET value = to_jsonb('["' || (value #>> '{}') || '"]')
WHERE id IN (
  -- specialization field: DENTIST
  'a4eb6c45-adcf-48af-819c-d6f73b300172',
  -- specialization field: DERMATOLOGIST
  'e48959dc-e847-4f3b-a0e0-7f838c2afc9a',
  -- stage field: REJECTED
  '5c2579df-d964-43e1-b28a-24ff05f269ce',
  -- stage field: INTERESTED
  '46cd3f96-7dc5-46eb-af77-9b5ee036a923',
  -- interestLevel field: HOT
  '24b94820-1f05-49e8-a17a-4d0b4cd6e934',
  -- scoreBand field: HOT
  'e944746f-025b-45f2-875c-438c3da51be8',
  -- scoreBand field: WARM
  'f1553352-625a-48d7-bcd9-f11eedf62f0a',
  -- scoreBand field: COLD
  'a39f618e-78dd-43d6-8ff1-3be3dcbfa903',
  -- status field: DONE (overdue-tasks view)
  '60aed1ef-7360-4bff-9c6d-7cb157393b67',
  -- status field: DONE (my-tasks view)
  'fd959dd1-d7c6-4fca-b222-3532bbf0be87'
);

-- Verify: all 10 rows should now have values starting with '["'
SELECT id, value::text, "fieldMetadataId"
FROM core."viewFilter"
WHERE id IN (
  'a4eb6c45-adcf-48af-819c-d6f73b300172',
  'e48959dc-e847-4f3b-a0e0-7f838c2afc9a',
  '5c2579df-d964-43e1-b28a-24ff05f269ce',
  '46cd3f96-7dc5-46eb-af77-9b5ee036a923',
  '24b94820-1f05-49e8-a17a-4d0b4cd6e934',
  'e944746f-025b-45f2-875c-438c3da51be8',
  'f1553352-625a-48d7-bcd9-f11eedf62f0a',
  'a39f618e-78dd-43d6-8ff1-3be3dcbfa903',
  '60aed1ef-7360-4bff-9c6d-7cb157393b67',
  'fd959dd1-d7c6-4fca-b222-3532bbf0be87'
);

COMMIT;
