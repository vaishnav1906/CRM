/* @license Enterprise */

import { Command } from 'nest-commander';
import { RelationType } from 'twenty-shared/types';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { CreateFieldInput } from 'src/engine/metadata-modules/field-metadata/dtos/create-field.input';
import { FieldMetadataService } from 'src/engine/metadata-modules/field-metadata/services/field-metadata.service';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';
import { FieldMetadataType } from 'twenty-shared/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const SUBSCRIPTION_OBJECT_NAME = 'subscription';

@RegisteredWorkspaceCommand('2.9.0', 1799000007000)
@Command({
  name: 'upgrade:2-9:setup-subscription-object',
  description:
    'Create the Subscription custom object for the IDDA Renewal Pipeline with status, plan fields, and clinic/doctor/owner relations',
})
export class SetupSubscriptionObjectCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly fieldMetadataService: FieldMetadataService,
    @InjectRepository(ObjectMetadataEntity)
    private readonly objectMetadataRepository: Repository<ObjectMetadataEntity>,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;

    this.logger.log(
      `${isDryRun ? '[DRY RUN] ' : ''}Setting up Subscription object for workspace ${workspaceId}`,
    );

    const existing = await this.objectMetadataRepository.findOne({
      where: { workspaceId, nameSingular: SUBSCRIPTION_OBJECT_NAME },
    });

    if (existing) {
      this.logger.log(
        `Subscription object already exists in workspace ${workspaceId}, skipping`,
      );
      return;
    }

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Would create Subscription object and fields in workspace ${workspaceId}`,
      );
      return;
    }

    const [companyMeta, personMeta, workspaceMemberMeta] = await Promise.all([
      this.objectMetadataRepository.findOne({
        where: { workspaceId, nameSingular: 'company' },
      }),
      this.objectMetadataRepository.findOne({
        where: { workspaceId, nameSingular: 'person' },
      }),
      this.objectMetadataRepository.findOne({
        where: { workspaceId, nameSingular: 'workspaceMember' },
      }),
    ]);

    const createdObject = await this.objectMetadataService.createOneObject({
      workspaceId,
      createObjectInput: {
        nameSingular: SUBSCRIPTION_OBJECT_NAME,
        namePlural: 'subscriptions',
        labelSingular: 'Subscription',
        labelPlural: 'Subscriptions',
        description: 'A doctor subscription managed through the Renewal Pipeline',
        icon: 'IconCreditCard',
        isLabelSyncedWithName: false,
      },
    });

    const objectMetadataId = createdObject.id;

    const fields: Omit<CreateFieldInput, 'workspaceId'>[] = [
      {
        objectMetadataId,
        type: FieldMetadataType.SELECT,
        name: 'status',
        label: 'Status',
        description: 'Current renewal status of the subscription',
        icon: 'IconCircleDot',
        isNullable: false,
        defaultValue: "'ACTIVE'",
        options: [
          { id: 'idda4001-0000-4000-8000-000000000001', value: 'ACTIVE', label: 'Active', position: 0, color: 'green' },
          { id: 'idda4001-0000-4000-8000-000000000002', value: 'RENEWAL_DUE', label: 'Renewal Due', position: 1, color: 'orange' },
          { id: 'idda4001-0000-4000-8000-000000000003', value: 'RENEWAL_CONTACTED', label: 'Renewal Contacted', position: 2, color: 'sky' },
          { id: 'idda4001-0000-4000-8000-000000000004', value: 'NEGOTIATION', label: 'Negotiation', position: 3, color: 'purple' },
          { id: 'idda4001-0000-4000-8000-000000000005', value: 'RENEWED', label: 'Renewed', position: 4, color: 'turquoise' },
          { id: 'idda4001-0000-4000-8000-000000000006', value: 'CHURNED', label: 'Churned', position: 5, color: 'red' },
        ],
      },
      {
        objectMetadataId,
        type: FieldMetadataType.TEXT,
        name: 'planName',
        label: 'Plan Name',
        description: 'Name of the insurance or service plan',
        icon: 'IconFileDescription',
        isNullable: true,
      },
      {
        objectMetadataId,
        type: FieldMetadataType.DATE,
        name: 'startDate',
        label: 'Start Date',
        description: 'Date when the subscription started',
        icon: 'IconCalendarPlus',
        isNullable: true,
      },
      {
        objectMetadataId,
        type: FieldMetadataType.DATE,
        name: 'endDate',
        label: 'End Date',
        description: 'Date when the subscription expires',
        icon: 'IconCalendarMinus',
        isNullable: true,
      },
      {
        objectMetadataId,
        type: FieldMetadataType.NUMBER,
        name: 'durationMonths',
        label: 'Duration (Months)',
        description: 'Subscription duration in months',
        icon: 'IconClockHour4',
        isNullable: true,
        settings: { decimals: 0 },
      },
      {
        objectMetadataId,
        type: FieldMetadataType.SELECT,
        name: 'churnReason',
        label: 'Churn Reason',
        description: 'Reason the subscription was churned',
        icon: 'IconAlertCircle',
        isNullable: true,
        options: [
          { id: 'idda4002-0000-4000-8000-000000000001', value: 'PRICE', label: 'Price', position: 0, color: 'red' },
          { id: 'idda4002-0000-4000-8000-000000000002', value: 'SWITCHED_COMPETITOR', label: 'Switched to Competitor', position: 1, color: 'orange' },
          { id: 'idda4002-0000-4000-8000-000000000003', value: 'CLOSED_CLINIC', label: 'Closed Clinic', position: 2, color: 'yellow' },
          { id: 'idda4002-0000-4000-8000-000000000004', value: 'NOT_INTERESTED', label: 'Not Interested', position: 3, color: 'gray' },
          { id: 'idda4002-0000-4000-8000-000000000005', value: 'OTHER', label: 'Other', position: 4, color: 'gray' },
        ],
      },
    ];

    for (const field of fields) {
      await this.fieldMetadataService.createOneField({
        workspaceId,
        createFieldInput: field,
      });
      this.logger.log(`Created field '${field.name}' on Subscription`);
    }

    if (companyMeta) {
      await this.fieldMetadataService.createOneField({
        workspaceId,
        createFieldInput: {
          objectMetadataId,
          type: FieldMetadataType.RELATION,
          name: 'clinic',
          label: 'Clinic',
          description: 'The clinic (company) this subscription belongs to',
          icon: 'IconBuildingHospital',
          isNullable: true,
          relationCreationPayload: {
            type: RelationType.MANY_TO_ONE,
            targetObjectMetadataId: companyMeta.id,
            targetFieldLabel: 'Subscriptions',
            targetFieldIcon: 'IconCreditCard',
          },
        },
      });
      this.logger.log('Created clinic relation on Subscription');
    }

    if (personMeta) {
      await this.fieldMetadataService.createOneField({
        workspaceId,
        createFieldInput: {
          objectMetadataId,
          type: FieldMetadataType.RELATION,
          name: 'doctor',
          label: 'Doctor',
          description: 'The doctor (person) this subscription is for',
          icon: 'IconUser',
          isNullable: true,
          relationCreationPayload: {
            type: RelationType.MANY_TO_ONE,
            targetObjectMetadataId: personMeta.id,
            targetFieldLabel: 'Subscriptions',
            targetFieldIcon: 'IconCreditCard',
          },
        },
      });
      this.logger.log('Created doctor relation on Subscription');
    }

    if (workspaceMemberMeta) {
      await this.fieldMetadataService.createOneField({
        workspaceId,
        createFieldInput: {
          objectMetadataId,
          type: FieldMetadataType.RELATION,
          name: 'accountOwner',
          label: 'Account Owner',
          description: 'The workspace member who owns this account',
          icon: 'IconUserCircle',
          isNullable: true,
          relationCreationPayload: {
            type: RelationType.MANY_TO_ONE,
            targetObjectMetadataId: workspaceMemberMeta.id,
            targetFieldLabel: 'Owned Subscriptions',
            targetFieldIcon: 'IconCreditCard',
          },
        },
      });

      await this.fieldMetadataService.createOneField({
        workspaceId,
        createFieldInput: {
          objectMetadataId,
          type: FieldMetadataType.RELATION,
          name: 'salesPerson',
          label: 'Sales Person',
          description: 'The workspace member responsible for this sale',
          icon: 'IconUserStar',
          isNullable: true,
          relationCreationPayload: {
            type: RelationType.MANY_TO_ONE,
            targetObjectMetadataId: workspaceMemberMeta.id,
            targetFieldLabel: 'Sales Subscriptions',
            targetFieldIcon: 'IconCreditCard',
          },
        },
      });

      await this.fieldMetadataService.createOneField({
        workspaceId,
        createFieldInput: {
          objectMetadataId,
          type: FieldMetadataType.RELATION,
          name: 'renewalOwner',
          label: 'Renewal Owner',
          description: 'The workspace member responsible for renewal',
          icon: 'IconUserCheck',
          isNullable: true,
          relationCreationPayload: {
            type: RelationType.MANY_TO_ONE,
            targetObjectMetadataId: workspaceMemberMeta.id,
            targetFieldLabel: 'Renewal Subscriptions',
            targetFieldIcon: 'IconCreditCard',
          },
        },
      });

      this.logger.log('Created accountOwner, salesPerson, renewalOwner relations on Subscription');
    }

    this.logger.log(
      `Subscription object fully set up in workspace ${workspaceId}`,
    );
  }
}
