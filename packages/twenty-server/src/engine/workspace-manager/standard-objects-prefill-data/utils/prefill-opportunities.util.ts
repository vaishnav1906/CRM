import { FieldActorSource } from 'twenty-shared/types';
import { type EntityManager } from 'typeorm';

import {
  AFCARE_ID,
  GOREGAON_DENTAL_ID,
  KAYA_CLINIC_ID,
  ORCHID_MEDICAL_ID,
  URBAN_SMILES_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-companies.util';
import {
  ANJALI_PATEL_ID,
  DEV_MEHTA_ID,
  NEHA_GUPTA_ID,
  PRIYA_SHARMA_ID,
  RAHUL_KUMAR_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-people.util';

export const DEAL_KAYA_DENTAL_COVERAGE_ID =
  'idda3001-0001-4001-8001-000000000001';
export const DEAL_URBAN_SMILES_CHECKUP_ID =
  'idda3001-0001-4001-8001-000000000002';
export const DEAL_AFCARE_WELLNESS_ID = 'idda3001-0001-4001-8001-000000000003';
export const DEAL_GOREGAON_ANNUAL_PLAN_ID =
  'idda3001-0001-4001-8001-000000000004';
export const DEAL_ORCHID_SPECIALIST_COVER_ID =
  'idda3001-0001-4001-8001-000000000005';

export const prefillOpportunities = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  const workspaceMember = await entityManager
    .createQueryBuilder()
    .select('id')
    .from(`${schemaName}.workspaceMember`, 'workspaceMember')
    .limit(1)
    .getRawOne();

  const ownerId = workspaceMember?.id ?? null;

  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.opportunity`, [
      'id',
      'name',
      'amountAmountMicros',
      'amountCurrencyCode',
      'closeDate',
      'stage',
      'position',
      'companyId',
      'pointOfContactId',
      'ownerId',
      'createdBySource',
      'createdByWorkspaceMemberId',
      'createdByName',
      'updatedBySource',
      'updatedByWorkspaceMemberId',
      'updatedByName',
    ])
    .orIgnore()
    .values([
      {
        id: DEAL_KAYA_DENTAL_COVERAGE_ID,
        name: 'Dental Coverage Package',
        amountAmountMicros: 12000000000,
        amountCurrencyCode: 'INR',
        closeDate: new Date('2026-03-31T12:00:00.000Z'),
        stage: 'PROPOSAL',
        position: 1,
        companyId: KAYA_CLINIC_ID,
        pointOfContactId: PRIYA_SHARMA_ID,
        ownerId,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: DEAL_URBAN_SMILES_CHECKUP_ID,
        name: 'Annual Checkup Cover',
        amountAmountMicros: 5000000000,
        amountCurrencyCode: 'INR',
        closeDate: new Date('2026-04-15T12:00:00.000Z'),
        stage: 'CUSTOMER',
        position: 2,
        companyId: URBAN_SMILES_ID,
        pointOfContactId: RAHUL_KUMAR_ID,
        ownerId,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: DEAL_AFCARE_WELLNESS_ID,
        name: 'Wellness Insurance Bundle',
        amountAmountMicros: 8500000000,
        amountCurrencyCode: 'INR',
        closeDate: new Date('2026-04-30T12:00:00.000Z'),
        stage: 'MEETING',
        position: 3,
        companyId: AFCARE_ID,
        pointOfContactId: ANJALI_PATEL_ID,
        ownerId,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: DEAL_GOREGAON_ANNUAL_PLAN_ID,
        name: 'Annual Group Plan',
        amountAmountMicros: 3000000000,
        amountCurrencyCode: 'INR',
        closeDate: new Date('2026-05-15T12:00:00.000Z'),
        stage: 'SCREENING',
        position: 4,
        companyId: GOREGAON_DENTAL_ID,
        pointOfContactId: DEV_MEHTA_ID,
        ownerId,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: DEAL_ORCHID_SPECIALIST_COVER_ID,
        name: 'Specialist Consultation Cover',
        amountAmountMicros: 15000000000,
        amountCurrencyCode: 'INR',
        closeDate: new Date('2026-06-01T12:00:00.000Z'),
        stage: 'NEW',
        position: 5,
        companyId: ORCHID_MEDICAL_ID,
        pointOfContactId: NEHA_GUPTA_ID,
        ownerId,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
    ])
    .returning('*')
    .execute();
};
