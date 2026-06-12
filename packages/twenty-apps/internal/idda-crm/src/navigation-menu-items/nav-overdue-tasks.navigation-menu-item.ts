import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_OVERDUE_TASKS_UUID, NAV_TASKS_FOLDER_UUID, VIEW_OVERDUE_TASKS_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_OVERDUE_TASKS_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconAlertCircle',
  position: 2,
  folderUniversalIdentifier: NAV_TASKS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_OVERDUE_TASKS_UUID,
});
