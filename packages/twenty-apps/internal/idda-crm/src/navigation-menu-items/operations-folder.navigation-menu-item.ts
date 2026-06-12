import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_OPERATIONS_FOLDER_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_OPERATIONS_FOLDER_UUID,
  type: NavigationMenuItemType.FOLDER,
  icon: 'IconBriefcase',
  name: 'Operations',
  position: 2,
});
