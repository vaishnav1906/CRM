import { Command } from 'nest-commander';
import { isDefined } from 'twenty-shared/utils';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';
import { STANDARD_ROLE } from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-role.constant';
import { computeTwentyStandardApplicationAllFlatEntityMaps } from 'src/engine/workspace-manager/twenty-standard-application/utils/twenty-standard-application-all-flat-entity-maps.constant';
import { WorkspaceMigrationValidateBuildAndRunService } from 'src/engine/workspace-manager/workspace-migration/services/workspace-migration-validate-build-and-run-service';

const IDDA_ROLE_UNIVERSAL_IDENTIFIERS = [
  STANDARD_ROLE.ceo.universalIdentifier,
  STANDARD_ROLE.coo.universalIdentifier,
  STANDARD_ROLE.cto.universalIdentifier,
  STANDARD_ROLE.businessDevelopmentManager.universalIdentifier,
  STANDARD_ROLE.researchTeam.universalIdentifier,
  STANDARD_ROLE.marketingCommunication.universalIdentifier,
  STANDARD_ROLE.salesPerson.universalIdentifier,
  STANDARD_ROLE.engineer.universalIdentifier,
];

@RegisteredWorkspaceCommand('2.9.0', 1799000003000)
@Command({
  name: 'upgrade:2-9:setup-idda-role-hierarchy',
  description:
    'Create IDDA Assurance role hierarchy (CEO, COO, CTO, BDM, Research, MarketingComm, Sales, Engineer)',
})
export class SetupIddaRoleHierarchyCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
    private readonly applicationService: ApplicationService,
    private readonly workspaceMigrationValidateBuildAndRunService: WorkspaceMigrationValidateBuildAndRunService,
    private readonly workspaceCacheService: WorkspaceCacheService,
  ) {
    super(workspaceIteratorService);
  }

  override async runOnWorkspace({
    workspaceId,
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    const isDryRun = options.dryRun ?? false;

    this.logger.log(
      `${isDryRun ? '[DRY RUN] ' : ''}Setting up IDDA role hierarchy for workspace ${workspaceId}`,
    );

    const { twentyStandardFlatApplication } =
      await this.applicationService.findWorkspaceTwentyStandardAndCustomApplicationOrThrow(
        { workspaceId },
      );

    const { flatRoleMaps: existingFlatRoleMaps } =
      await this.workspaceCacheService.getOrRecompute(workspaceId, [
        'flatRoleMaps',
      ]);

    const { allFlatEntityMaps: standardAllFlatEntityMaps } =
      computeTwentyStandardApplicationAllFlatEntityMaps({
        now: new Date().toISOString(),
        workspaceId,
        twentyStandardApplicationId: twentyStandardFlatApplication.id,
      });

    const rolesToCreate = IDDA_ROLE_UNIVERSAL_IDENTIFIERS.flatMap(
      (universalIdentifier) => {
        const alreadyExists = isDefined(
          existingFlatRoleMaps.byUniversalIdentifier[universalIdentifier],
        );

        if (alreadyExists) {
          return [];
        }

        const standardRole =
          standardAllFlatEntityMaps.flatRoleMaps.byUniversalIdentifier[
            universalIdentifier
          ];

        if (!isDefined(standardRole)) {
          this.logger.warn(
            `Standard role ${universalIdentifier} not found for workspace ${workspaceId}`,
          );

          return [];
        }

        return [standardRole];
      },
    );

    if (rolesToCreate.length === 0) {
      this.logger.log(
        `All IDDA roles already exist for workspace ${workspaceId}, skipping`,
      );

      return;
    }

    if (isDryRun) {
      this.logger.log(
        `[DRY RUN] Would create ${rolesToCreate.length} IDDA roles for workspace ${workspaceId}: ${rolesToCreate.map((r) => r.label).join(', ')}`,
      );

      return;
    }

    const validateAndBuildResult =
      await this.workspaceMigrationValidateBuildAndRunService.validateBuildAndRunWorkspaceMigration(
        {
          allFlatEntityOperationByMetadataName: {
            role: {
              flatEntityToCreate: rolesToCreate,
              flatEntityToDelete: [],
              flatEntityToUpdate: [],
            },
          },
          workspaceId,
          applicationUniversalIdentifier:
            twentyStandardFlatApplication.universalIdentifier,
        },
      );

    if (validateAndBuildResult.status === 'fail') {
      this.logger.error(
        `Failed to create IDDA roles:\n${JSON.stringify(validateAndBuildResult, null, 2)}`,
      );

      throw new Error(
        `Failed to create IDDA roles for workspace ${workspaceId}`,
      );
    }

    this.logger.log(
      `Successfully created ${rolesToCreate.length} IDDA roles for workspace ${workspaceId}`,
    );
  }
}
