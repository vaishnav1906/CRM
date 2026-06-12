import { type EntityManager } from 'typeorm';
import { FieldActorSource } from 'twenty-shared/types';

export const KAYA_CLINIC_ID = 'idda1001-0001-4001-8001-000000000001';
export const URBAN_SMILES_ID = 'idda1001-0001-4001-8001-000000000002';
export const AFCARE_ID = 'idda1001-0001-4001-8001-000000000003';
export const GOREGAON_DENTAL_ID = 'idda1001-0001-4001-8001-000000000004';
export const ORCHID_MEDICAL_ID = 'idda1001-0001-4001-8001-000000000005';

export const prefillCompanies = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.company`, [
      'id',
      'name',
      'domainNamePrimaryLinkUrl',
      'addressAddressStreet1',
      'addressAddressStreet2',
      'addressAddressCity',
      'addressAddressState',
      'addressAddressPostcode',
      'addressAddressCountry',
      'employees',
      'position',
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
        id: KAYA_CLINIC_ID,
        name: 'Kaya Clinic',
        domainNamePrimaryLinkUrl: 'https://kayaclinic.com',
        addressAddressStreet1: 'Linking Road',
        addressAddressStreet2: null,
        addressAddressCity: 'Mumbai',
        addressAddressState: 'Maharashtra',
        addressAddressPostcode: '400050',
        addressAddressCountry: 'India',
        employees: 120,
        position: 1,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: URBAN_SMILES_ID,
        name: 'Urban Smiles Dental Clinic',
        domainNamePrimaryLinkUrl: 'https://urbansmilesdental.in',
        addressAddressStreet1: 'Andheri West',
        addressAddressStreet2: null,
        addressAddressCity: 'Mumbai',
        addressAddressState: 'Maharashtra',
        addressAddressPostcode: '400058',
        addressAddressCountry: 'India',
        employees: 15,
        position: 2,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: AFCARE_ID,
        name: 'AFCare',
        domainNamePrimaryLinkUrl: 'https://afcare.in',
        addressAddressStreet1: 'Bandra East',
        addressAddressStreet2: null,
        addressAddressCity: 'Mumbai',
        addressAddressState: 'Maharashtra',
        addressAddressPostcode: '400051',
        addressAddressCountry: 'India',
        employees: 45,
        position: 3,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: GOREGAON_DENTAL_ID,
        name: 'Goregaon Dental Centre',
        domainNamePrimaryLinkUrl: 'https://goregaondental.com',
        addressAddressStreet1: 'Goregaon West',
        addressAddressStreet2: null,
        addressAddressCity: 'Mumbai',
        addressAddressState: 'Maharashtra',
        addressAddressPostcode: '400062',
        addressAddressCountry: 'India',
        employees: 8,
        position: 4,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: ORCHID_MEDICAL_ID,
        name: 'Orchid Medical Centre',
        domainNamePrimaryLinkUrl: 'https://orchidmedical.in',
        addressAddressStreet1: 'Vile Parle East',
        addressAddressStreet2: null,
        addressAddressCity: 'Mumbai',
        addressAddressState: 'Maharashtra',
        addressAddressPostcode: '400057',
        addressAddressCountry: 'India',
        employees: 60,
        position: 5,
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
