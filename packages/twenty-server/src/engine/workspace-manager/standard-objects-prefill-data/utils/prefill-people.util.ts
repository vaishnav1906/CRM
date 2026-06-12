import { FieldActorSource } from 'twenty-shared/types';
import { type EntityManager } from 'typeorm';

import {
  AFCARE_ID,
  GOREGAON_DENTAL_ID,
  KAYA_CLINIC_ID,
  ORCHID_MEDICAL_ID,
  URBAN_SMILES_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-companies.util';

export const PRIYA_SHARMA_ID = 'idda2001-0001-4001-8001-000000000001';
export const RAHUL_KUMAR_ID = 'idda2001-0001-4001-8001-000000000002';
export const ANJALI_PATEL_ID = 'idda2001-0001-4001-8001-000000000003';
export const DEV_MEHTA_ID = 'idda2001-0001-4001-8001-000000000004';
export const NEHA_GUPTA_ID = 'idda2001-0001-4001-8001-000000000005';

export const prefillPeople = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.person`, [
      'id',
      'nameFirstName',
      'nameLastName',
      'city',
      'emailsPrimaryEmail',
      'avatarUrl',
      'position',
      'createdBySource',
      'createdByWorkspaceMemberId',
      'createdByName',
      'updatedBySource',
      'updatedByWorkspaceMemberId',
      'updatedByName',
      'phonesPrimaryPhoneNumber',
      'phonesPrimaryPhoneCallingCode',
      'companyId',
    ])
    .orIgnore()
    .values([
      {
        id: PRIYA_SHARMA_ID,
        nameFirstName: 'Priya',
        nameLastName: 'Sharma',
        city: 'Mumbai',
        emailsPrimaryEmail: 'priya.sharma@iddaassurance.com',
        avatarUrl: null,
        position: 1,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
        phonesPrimaryPhoneNumber: '9876543210',
        phonesPrimaryPhoneCallingCode: '+91',
        companyId: KAYA_CLINIC_ID,
      },
      {
        id: RAHUL_KUMAR_ID,
        nameFirstName: 'Rahul',
        nameLastName: 'Kumar',
        city: 'Mumbai',
        emailsPrimaryEmail: 'rahul.kumar@iddaassurance.com',
        avatarUrl: null,
        position: 2,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
        phonesPrimaryPhoneNumber: '9876543211',
        phonesPrimaryPhoneCallingCode: '+91',
        companyId: URBAN_SMILES_ID,
      },
      {
        id: ANJALI_PATEL_ID,
        nameFirstName: 'Anjali',
        nameLastName: 'Patel',
        city: 'Mumbai',
        emailsPrimaryEmail: 'anjali.patel@iddaassurance.com',
        avatarUrl: null,
        position: 3,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
        phonesPrimaryPhoneNumber: '9876543212',
        phonesPrimaryPhoneCallingCode: '+91',
        companyId: AFCARE_ID,
      },
      {
        id: DEV_MEHTA_ID,
        nameFirstName: 'Dev',
        nameLastName: 'Mehta',
        city: 'Mumbai',
        emailsPrimaryEmail: 'dev.mehta@iddaassurance.com',
        avatarUrl: null,
        position: 4,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
        phonesPrimaryPhoneNumber: '9876543213',
        phonesPrimaryPhoneCallingCode: '+91',
        companyId: GOREGAON_DENTAL_ID,
      },
      {
        id: NEHA_GUPTA_ID,
        nameFirstName: 'Neha',
        nameLastName: 'Gupta',
        city: 'Mumbai',
        emailsPrimaryEmail: 'neha.gupta@iddaassurance.com',
        avatarUrl: null,
        position: 5,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
        phonesPrimaryPhoneNumber: '9876543214',
        phonesPrimaryPhoneCallingCode: '+91',
        companyId: ORCHID_MEDICAL_ID,
      },
    ])
    .returning('*')
    .execute();
};
