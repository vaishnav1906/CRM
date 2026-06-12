/* @license Enterprise */

import { InjectRepository } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import {
  RowLevelPermissionPredicateGroupLogicalOperator,
  RowLevelPermissionPredicateOperand,
} from 'twenty-shared/types';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { ObjectPermissionEntity } from 'src/engine/metadata-modules/object-permission/object-permission.entity';
import { PermissionFlagEntity } from 'src/engine/metadata-modules/permission-flag/permission-flag.entity';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RolePermissionFlagEntity } from 'src/engine/metadata-modules/role-permission-flag/role-permission-flag.entity';
import { RowLevelPermissionPredicateGroupEntity } from 'src/engine/metadata-modules/row-level-permission-predicate/entities/row-level-permission-predicate-group.entity';
import { RowLevelPermissionPredicateEntity } from 'src/engine/metadata-modules/row-level-permission-predicate/entities/row-level-permission-predicate.entity';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { STANDARD_ROLE } from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-role.constant';

// Stage values for row-level filtering (7-stage IDDA lead pipeline)
const RESEARCH_STAGES = ['NEW_LEAD'];
const MARKETING_STAGES = ['RESEARCH_COMPLETED', 'CONTACTED', 'FOLLOW_UP_PENDING'];
const SALES_STAGES = ['INTERESTED', 'MEETING_SCHEDULED', 'WON'];

// Objects that need permissions configured (standard nameSingular values)
const OBJECT_NAMES = [
  'opportunity',
  'company',
  'person',
  'task',
  'note',
] as const;

type ObjectName = (typeof OBJECT_NAMES)[number];

type ObjectPermissionSpec = {
  canReadObjectRecords: boolean;
  canUpdateObjectRecords: boolean;
  canSoftDeleteObjectRecords: boolean;
  canDestroyObjectRecords: boolean;
};

// Permission flags by key for feature access (feature flag types)
const BDM_FLAGS = ['VIEWS', 'IMPORT_CSV', 'EXPORT_CSV', 'PROFILE_INFORMATION'];
const RESEARCH_FLAGS = [
  'VIEWS',
  'UPLOAD_FILE',
  'DOWNLOAD_FILE',
  'PROFILE_INFORMATION',
];
const MARKETING_FLAGS = [
  'VIEWS',
  'SEND_EMAIL_TOOL',
  'UPLOAD_FILE',
  'DOWNLOAD_FILE',
  'CONNECTED_ACCOUNTS',
  'PROFILE_INFORMATION',
];
const SALES_FLAGS = [
  'VIEWS',
  'SEND_EMAIL_TOOL',
  'UPLOAD_FILE',
  'DOWNLOAD_FILE',
  'CONNECTED_ACCOUNTS',
  'PROFILE_INFORMATION',
];
const ENGINEER_FLAGS = [
  'WORKFLOWS',
  'APPLICATIONS',
  'API_KEYS_AND_WEBHOOKS',
  'DATA_MODEL',
];

// Object permission matrix for restricted roles
const PERMISSIONS_BY_ROLE: Record<
  string,
  Partial<Record<ObjectName, ObjectPermissionSpec>>
> = {
  [STANDARD_ROLE.businessDevelopmentManager.universalIdentifier]: {
    opportunity: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: true,
      canDestroyObjectRecords: false,
    },
    company: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    person: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    task: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: true,
      canDestroyObjectRecords: false,
    },
    note: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  },
  [STANDARD_ROLE.researchTeam.universalIdentifier]: {
    // canRead=true so nav shows; row-level filter restricts to NEW_LEAD, RESEARCH_QUEUE
    opportunity: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    company: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    person: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    note: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  },
  [STANDARD_ROLE.marketingCommunication.universalIdentifier]: {
    opportunity: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    company: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    person: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    task: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    note: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  },
  [STANDARD_ROLE.salesPerson.universalIdentifier]: {
    opportunity: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    company: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    person: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: false,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    task: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
    note: {
      canReadObjectRecords: true,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  },
  [STANDARD_ROLE.engineer.universalIdentifier]: {
    // canRead=false for all CRM objects; canUpdate=true on opportunity only
    // so engineers can create new leads (universal rule: anyone can CREATE NEW LEAD)
    opportunity: {
      canReadObjectRecords: false,
      canUpdateObjectRecords: true,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    },
  },
};

// Row-level predicates: which roles filter which stages on opportunity
const STAGE_FILTERS_BY_ROLE: Record<string, string[]> = {
  [STANDARD_ROLE.researchTeam.universalIdentifier]: RESEARCH_STAGES,
  [STANDARD_ROLE.marketingCommunication.universalIdentifier]: MARKETING_STAGES,
  [STANDARD_ROLE.salesPerson.universalIdentifier]: SALES_STAGES,
};

// Permission flags per role (restricted roles only)
const FLAGS_BY_ROLE: Record<string, string[]> = {
  [STANDARD_ROLE.businessDevelopmentManager.universalIdentifier]: BDM_FLAGS,
  [STANDARD_ROLE.researchTeam.universalIdentifier]: RESEARCH_FLAGS,
  [STANDARD_ROLE.marketingCommunication.universalIdentifier]: MARKETING_FLAGS,
  [STANDARD_ROLE.salesPerson.universalIdentifier]: SALES_FLAGS,
  [STANDARD_ROLE.engineer.universalIdentifier]: ENGINEER_FLAGS,
};

// Deal stage field universalIdentifier (from standard-object.constant.ts)
const OPPORTUNITY_STAGE_FIELD_UNIVERSAL_ID =
  '20202020-6f76-477d-8551-28cd65b2b4b9';

@RegisteredWorkspaceCommand('2.9.0', 1799000005000)
@Command({
  name: 'upgrade:2-9:setup-idda-permissions',
  description:
    'Set up IDDA Assurance role permissions: object access, row-level stage filtering, and feature flags',
})
export class SetupIddaPermissionsCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly applicationService: ApplicationService,
    private readonly workspaceCacheService: WorkspaceCacheService,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(ObjectMetadataEntity)
    private readonly objectMetadataRepository: Repository<ObjectMetadataEntity>,
    @InjectRepository(FieldMetadataEntity)
    private readonly fieldMetadataRepository: Repository<FieldMetadataEntity>,
    @InjectRepository(ObjectPermissionEntity)
    private readonly objectPermissionRepository: Repository<ObjectPermissionEntity>,
    @InjectRepository(PermissionFlagEntity)
    private readonly permissionFlagRepository: Repository<PermissionFlagEntity>,
    @InjectRepository(RolePermissionFlagEntity)
    private readonly rolePermissionFlagRepository: Repository<RolePermissionFlagEntity>,
    @InjectRepository(RowLevelPermissionPredicateGroupEntity)
    private readonly predicateGroupRepository: Repository<RowLevelPermissionPredicateGroupEntity>,
    @InjectRepository(RowLevelPermissionPredicateEntity)
    private readonly predicateRepository: Repository<RowLevelPermissionPredicateEntity>,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;

    this.logger.log(
      `${isDryRun ? '[DRY RUN] ' : ''}Setting up IDDA permissions for workspace ${workspaceId}`,
    );

    const { twentyStandardFlatApplication } =
      await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow(
        { workspaceId },
      );
    const applicationId = twentyStandardFlatApplication.id;

    // Resolve role IDs by universalIdentifier
    const allRoleUniversalIds = [
      ...Object.keys(PERMISSIONS_BY_ROLE),
      ...Object.keys(STAGE_FILTERS_BY_ROLE),
      ...Object.keys(FLAGS_BY_ROLE),
    ];
    const uniqueRoleUniversalIds = [...new Set(allRoleUniversalIds)];

    const roles = await this.roleRepository.find({
      where: uniqueRoleUniversalIds.map((uid) => ({
        workspaceId,
        universalIdentifier: uid,
      })),
    });

    const roleIdByUniversalId = Object.fromEntries(
      roles.map((r) => [r.universalIdentifier, r.id]),
    );

    // Resolve objectMetadata IDs by nameSingular
    const objectMetadatas = await this.objectMetadataRepository.find({
      where: OBJECT_NAMES.map((name) => ({ workspaceId, nameSingular: name })),
    });
    const objectIdByName = Object.fromEntries(
      objectMetadatas.map((o) => [o.nameSingular, o.id]),
    );

    // Resolve the Deal stage fieldMetadata ID
    const stageField = await this.fieldMetadataRepository.findOne({
      where: {
        workspaceId,
        universalIdentifier: OPPORTUNITY_STAGE_FIELD_UNIVERSAL_ID,
      },
    });

    if (!stageField) {
      this.logger.warn(
        `Stage field not found in workspace ${workspaceId}, skipping row-level predicates`,
      );
    }

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Would set up permissions for ${roles.length} roles, ` +
          `${objectMetadatas.length} objects, ` +
          `stage field: ${stageField ? 'found' : 'missing'}`,
      );

      return;
    }

    // ─── Object Permissions ───────────────────────────────────────────────────
    await this.upsertObjectPermissions({
      workspaceId,
      applicationId,
      roleIdByUniversalId,
      objectIdByName,
    });

    // ─── Row-Level Predicates (stage filtering) ────────────────────────────────
    if (stageField) {
      await this.upsertStagePredicates({
        workspaceId,
        applicationId,
        roleIdByUniversalId,
        objectIdByName,
        stageFieldId: stageField.id,
        opportunityObjectId: objectIdByName['opportunity'],
      });
    }

    // ─── Permission Flags ─────────────────────────────────────────────────────
    await this.upsertPermissionFlags({
      workspaceId,
      applicationId,
      roleIdByUniversalId,
    });

    // ─── Update existing fieldMetadata options for Deal stage ─────────────────
    if (stageField) {
      await this.updateDealStageOptions({
        stageField,
      });
    }

    // ─── Invalidate caches ────────────────────────────────────────────────────
    await this.workspaceCacheService.invalidateAndRecompute(workspaceId, [
      'rolesPermissions',
      'flatObjectPermissionMaps',
      'flatRolePermissionFlagMaps',
      'flatRowLevelPermissionPredicateMaps',
      'flatRowLevelPermissionPredicateGroupMaps',
    ]);

    this.logger.log(
      `Successfully configured IDDA permissions for workspace ${workspaceId}`,
    );
  }

  private async upsertObjectPermissions({
    workspaceId,
    applicationId,
    roleIdByUniversalId,
    objectIdByName,
  }: {
    workspaceId: string;
    applicationId: string;
    roleIdByUniversalId: Record<string, string>;
    objectIdByName: Record<string, string>;
  }): Promise<void> {
    for (const [roleUniversalId, objectSpecs] of Object.entries(
      PERMISSIONS_BY_ROLE,
    )) {
      const roleId = roleIdByUniversalId[roleUniversalId];

      if (!roleId) {
        this.logger.warn(
          `Role ${roleUniversalId} not found, skipping object permissions`,
        );
        continue;
      }

      for (const [objectName, spec] of Object.entries(objectSpecs)) {
        const objectMetadataId = objectIdByName[objectName];

        if (!objectMetadataId) {
          this.logger.warn(
            `Object ${objectName} not found, skipping permission`,
          );
          continue;
        }

        const existing = await this.objectPermissionRepository.findOne({
          where: { roleId, objectMetadataId },
        });

        if (existing) {
          await this.objectPermissionRepository.update(
            { id: existing.id },
            {
              canReadObjectRecords: spec.canReadObjectRecords,
              canUpdateObjectRecords: spec.canUpdateObjectRecords,
              canSoftDeleteObjectRecords: spec.canSoftDeleteObjectRecords,
              canDestroyObjectRecords: spec.canDestroyObjectRecords,
            },
          );
        } else {
          await this.objectPermissionRepository.save(
            this.objectPermissionRepository.create({
              id: v4(),
              universalIdentifier: v4(),
              workspaceId,
              applicationId,
              roleId,
              objectMetadataId,
              canReadObjectRecords: spec.canReadObjectRecords,
              canUpdateObjectRecords: spec.canUpdateObjectRecords,
              canSoftDeleteObjectRecords: spec.canSoftDeleteObjectRecords,
              canDestroyObjectRecords: spec.canDestroyObjectRecords,
            }),
          );
        }
      }
    }
  }

  private async upsertStagePredicates({
    workspaceId,
    applicationId,
    roleIdByUniversalId,
    objectIdByName,
    stageFieldId,
    opportunityObjectId,
  }: {
    workspaceId: string;
    applicationId: string;
    roleIdByUniversalId: Record<string, string>;
    objectIdByName: Record<string, string>;
    stageFieldId: string;
    opportunityObjectId: string;
  }): Promise<void> {
    if (!opportunityObjectId) {
      return;
    }

    for (const [roleUniversalId, allowedStages] of Object.entries(
      STAGE_FILTERS_BY_ROLE,
    )) {
      const roleId = roleIdByUniversalId[roleUniversalId];

      if (!roleId) {
        continue;
      }

      // Check if any predicate already exists for this role + opportunity
      const existing = await this.predicateRepository.findOne({
        where: { roleId, objectMetadataId: opportunityObjectId },
      });

      if (existing) {
        this.logger.log(
          `Stage predicates already exist for role ${roleUniversalId}, skipping`,
        );
        continue;
      }

      // Create an OR group so the role sees records matching ANY of the allowed stages
      const group = this.predicateGroupRepository.create({
        id: v4(),
        universalIdentifier: v4(),
        workspaceId,
        applicationId,
        roleId,
        objectMetadataId: opportunityObjectId,
        logicalOperator:
          RowLevelPermissionPredicateGroupLogicalOperator.OR,
        parentRowLevelPermissionPredicateGroupId: null,
        positionInRowLevelPermissionPredicateGroup: null,
      });
      const savedGroup = await this.predicateGroupRepository.save(group);

      for (let i = 0; i < allowedStages.length; i++) {
        const stageValue = allowedStages[i];

        await this.predicateRepository.save(
          this.predicateRepository.create({
            id: v4(),
            universalIdentifier: v4(),
            workspaceId,
            applicationId,
            roleId,
            objectMetadataId: opportunityObjectId,
            fieldMetadataId: stageFieldId,
            operand: RowLevelPermissionPredicateOperand.IS,
            value: stageValue,
            subFieldName: null,
            workspaceMemberFieldMetadataId: null,
            workspaceMemberSubFieldName: null,
            rowLevelPermissionPredicateGroupId: savedGroup.id,
            positionInRowLevelPermissionPredicateGroup: i,
          }),
        );
      }

      this.logger.log(
        `Created stage predicates for role ${roleUniversalId}: ${allowedStages.join(', ')}`,
      );
    }
  }

  private async upsertPermissionFlags({
    workspaceId,
    applicationId,
    roleIdByUniversalId,
  }: {
    workspaceId: string;
    applicationId: string;
    roleIdByUniversalId: Record<string, string>;
  }): Promise<void> {
    for (const [roleUniversalId, flagKeys] of Object.entries(FLAGS_BY_ROLE)) {
      const roleId = roleIdByUniversalId[roleUniversalId];

      if (!roleId) {
        continue;
      }

      for (const flagKey of flagKeys) {
        const permissionFlag = await this.permissionFlagRepository.findOne({
          where: { workspaceId, key: flagKey },
        });

        if (!permissionFlag) {
          this.logger.warn(
            `Permission flag ${flagKey} not found in workspace ${workspaceId}, skipping`,
          );
          continue;
        }

        const existingLink = await this.rolePermissionFlagRepository.findOne({
          where: { roleId, permissionFlagId: permissionFlag.id },
        });

        if (existingLink) {
          continue;
        }

        await this.rolePermissionFlagRepository.save(
          this.rolePermissionFlagRepository.create({
            id: v4(),
            universalIdentifier: v4(),
            workspaceId,
            applicationId,
            roleId,
            permissionFlagId: permissionFlag.id,
            flag: flagKey as never,
          }),
        );
      }
    }
  }

  private async updateDealStageOptions({
    stageField,
  }: {
    stageField: FieldMetadataEntity;
  }): Promise<void> {
    const iddaOptions = [
      {
        id: 'idda3001-0000-4000-8000-000000000001',
        value: 'NEW_LEAD',
        label: 'New Lead',
        position: 0,
        color: 'red',
      },
      {
        id: 'idda3001-0000-4000-8000-000000000002',
        value: 'RESEARCH_QUEUE',
        label: 'Research Queue',
        position: 1,
        color: 'orange',
      },
      {
        id: 'idda3001-0000-4000-8000-000000000003',
        value: 'RESEARCH_COMPLETED',
        label: 'Research Completed',
        position: 2,
        color: 'yellow',
      },
      {
        id: 'idda3001-0000-4000-8000-000000000004',
        value: 'CONTACTED',
        label: 'Contacted',
        position: 3,
        color: 'sky',
      },
      {
        id: 'idda3001-0000-4000-8000-000000000005',
        value: 'FOLLOW_UP_PENDING',
        label: 'Follow-Up Pending',
        position: 4,
        color: 'blue',
      },
      {
        id: 'idda3001-0000-4000-8000-000000000006',
        value: 'INTERESTED',
        label: 'Interested',
        position: 5,
        color: 'green',
      },
      {
        id: 'idda3001-0000-4000-8000-000000000007',
        value: 'MEETING_SCHEDULED',
        label: 'Meeting Scheduled',
        position: 6,
        color: 'turquoise',
      },
      {
        id: 'idda3001-0000-4000-8000-000000000008',
        value: 'PROPOSAL_SENT',
        label: 'Proposal Sent',
        position: 7,
        color: 'purple',
      },
      {
        id: 'idda3001-0000-4000-8000-000000000009',
        value: 'NEGOTIATION',
        label: 'Negotiation',
        position: 8,
        color: 'pink',
      },
      {
        id: 'idda3001-0000-4000-8000-000000000010',
        value: 'WON',
        label: 'Won',
        position: 9,
        color: 'light-green',
      },
    ];

    // Only update if options still have old twenty default values
    const hasOldValues = Array.isArray(stageField.options) &&
      (stageField.options as Array<{ value: string }>).some(
        (o) => o.value === 'NEW' || o.value === 'SCREENING',
      );

    if (!hasOldValues) {
      return;
    }

    await this.fieldMetadataRepository.update(
      { id: stageField.id },
      {
        options: iddaOptions as never,
        defaultValue: "'NEW_LEAD'",
      },
    );

    this.logger.log(
      `Updated Deal stage field options to IDDA pipeline stages`,
    );
  }
}
