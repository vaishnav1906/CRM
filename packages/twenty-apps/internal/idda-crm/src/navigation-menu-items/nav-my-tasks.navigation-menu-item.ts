import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_MY_TASKS_UUID, NAV_TASKS_FOLDER_UUID, VIEW_MY_TASKS_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_MY_TASKS_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconChecklist',
  position: 1,
  folderUniversalIdentifier: NAV_TASKS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_MY_TASKS_UUID,
});
