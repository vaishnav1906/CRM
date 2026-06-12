import { InjectRepository } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import { Repository } from 'typeorm';

import { ActiveOrSuspendedWorkspaceCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspace.command-runner';
import { WorkspaceIteratorService } from 'src/database/commands/command-runners/workspace-iterator.service';
import { type RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspace.command-runner';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { RegisteredWorkspaceCommand } from 'src/engine/core-modules/upgrade/decorators/registered-workspace-command.decorator';

type ObjectRename = {
  nameSingular: string;
  labelSingular: string;
  labelPlural: string;
  description?: string;
};

@RegisteredWorkspaceCommand('2.9.0', 1799000002000)
@Command({
  name: 'upgrade:2-9:rename-objects-for-idda',
  description:
    'Rename standard CRM objects to IDDA Assurance terminology (Companies→Clinics, People→Team, Opportunities→Deals, Tasks→Follow Ups) and rename custom objects (Segments→Lists, Score→Lead Score)',
})
export class RenameObjectsForIddaCommand extends ActiveOrSuspendedWorkspaceCommandRunner {
  constructor(
    protected readonly workspaceIteratorService: WorkspaceIteratorService,
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
      `${isDryRun ? '[DRY RUN] ' : ''}Renaming objects for IDDA Assurance in workspace ${workspaceId}`,
    );

    const renames: ObjectRename[] = [
      {
        nameSingular: 'company',
        labelSingular: 'Clinic',
        labelPlural: 'Clinics',
        description: 'A healthcare clinic or hospital',
      },
      {
        nameSingular: 'person',
        labelSingular: 'Team Member',
        labelPlural: 'Team',
        description: 'An IDDA Assurance team member',
      },
      {
        nameSingular: 'opportunity',
        labelSingular: 'Deal',
        labelPlural: 'Deals',
        description: 'A sales deal',
      },
      {
        nameSingular: 'task',
        labelSingular: 'Follow Up',
        labelPlural: 'Follow Ups',
        description: 'A follow-up activity',
      },
      {
        nameSingular: 'segment',
        labelSingular: 'List',
        labelPlural: 'Lists',
      },
      {
        nameSingular: 'score',
        labelSingular: 'Lead Score',
        labelPlural: 'Lead Scores',
      },
    ];

    for (const rename of renames) {
      const existing = await this.objectMetadataRepository.findOne({
        where: {
          workspaceId,
          nameSingular: rename.nameSingular,
        },
      });

      if (!existing) {
        this.logger.log(
          `Object ${rename.nameSingular} not found in workspace ${workspaceId}, skipping`,
        );
        continue;
      }

      if (
        existing.labelSingular === rename.labelSingular &&
        existing.labelPlural === rename.labelPlural
      ) {
        this.logger.log(
          `Object ${rename.nameSingular} labels already correct in workspace ${workspaceId}`,
        );
        continue;
      }

      if (isDryRun) {
        this.logger.log(
          `[DRY RUN] Would rename ${rename.nameSingular} to ${rename.labelSingular}/${rename.labelPlural} in workspace ${workspaceId}`,
        );
        continue;
      }

      await this.objectMetadataRepository.update(
        { id: existing.id },
        {
          labelSingular: rename.labelSingular,
          labelPlural: rename.labelPlural,
          ...(rename.description ? { description: rename.description } : {}),
        },
      );

      this.logger.log(
        `Renamed ${rename.nameSingular} to ${rename.labelSingular}/${rename.labelPlural} in workspace ${workspaceId}`,
      );
    }

    this.logger.log(
      `Completed object renaming for IDDA Assurance in workspace ${workspaceId}`,
    );
  }
}
