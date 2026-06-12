import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_TASKS_FOLDER_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_TASKS_FOLDER_UUID,
  type: NavigationMenuItemType.FOLDER,
  icon: 'IconCheckbox',
  name: 'Tasks',
  position: 4,
});
