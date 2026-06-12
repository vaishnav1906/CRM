import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_TASK_BOARD_UUID, NAV_TASKS_FOLDER_UUID, VIEW_TASK_BOARD_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_TASK_BOARD_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconLayoutKanban',
  position: 0,
  folderUniversalIdentifier: NAV_TASKS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_TASK_BOARD_UUID,
});
