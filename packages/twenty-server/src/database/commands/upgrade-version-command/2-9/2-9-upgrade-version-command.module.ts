import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceIteratorModule } from 'src/database/commands/command-runners/workspace-iterator.module';
import { MigrateAiModelPreferencesCommand } from 'src/database/commands/upgrade-version-command/2-9/2-9-workspace-command-1799000000000-migrate-ai-model-preferences.command';
import { PinDeleteRecordsCommandMenuItemCommand } from 'src/database/commands/upgrade-version-command/2-9/2-9-workspace-command-1799000001000-pin-delete-records-command-menu-item.command';
import { RenameObjectsForIddaCommand } from 'src/database/commands/upgrade-version-command/2-9/2-9-workspace-command-1799000002000-rename-objects-for-idda.command';
import { SetupIddaRoleHierarchyCommand } from 'src/database/commands/upgrade-version-command/2-9/2-9-workspace-command-1799000003000-setup-idda-role-hierarchy.command';
import { SetupIddaPermissionsCommand } from 'src/database/commands/upgrade-version-command/2-9/2-9-workspace-command-1799000005000-setup-idda-permissions.command';
import { SetupSubscriptionObjectCommand } from 'src/database/commands/upgrade-version-command/2-9/2-9-workspace-command-1799000007000-setup-subscription-object.command';
import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { KeyValuePairEntity } from 'src/engine/core-modules/key-value-pair/key-value-pair.entity';
import { FieldMetadataModule } from 'src/engine/metadata-modules/field-metadata/field-metadata.module';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { ObjectPermissionEntity } from 'src/engine/metadata-modules/object-permission/object-permission.entity';
import { PermissionFlagEntity } from 'src/engine/metadata-modules/permission-flag/permission-flag.entity';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RolePermissionFlagEntity } from 'src/engine/metadata-modules/role-permission-flag/role-permission-flag.entity';
import { RowLevelPermissionPredicateGroupEntity } from 'src/engine/metadata-modules/row-level-permission-predicate/entities/row-level-permission-predicate-group.entity';
import { RowLevelPermissionPredicateEntity } from 'src/engine/metadata-modules/row-level-permission-predicate/entities/row-level-permission-predicate.entity';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { WorkspaceMigrationModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KeyValuePairEntity,
      ObjectMetadataEntity,
      FieldMetadataEntity,
      RoleEntity,
      ObjectPermissionEntity,
      PermissionFlagEntity,
      RolePermissionFlagEntity,
      RowLevelPermissionPredicateEntity,
      RowLevelPermissionPredicateGroupEntity,
    ]),
    WorkspaceIteratorModule,
    ApplicationModule,
    WorkspaceCacheModule,
    WorkspaceMigrationModule,
    ObjectMetadataModule,
    FieldMetadataModule,
  ],
  providers: [
    MigrateAiModelPreferencesCommand,
    PinDeleteRecordsCommandMenuItemCommand,
    RenameObjectsForIddaCommand,
    SetupIddaRoleHierarchyCommand,
    SetupIddaPermissionsCommand,
    SetupSubscriptionObjectCommand,
  ],
})
export class V2_9_UpgradeVersionCommandModule {}
