import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_OPERATIONS_FOLDER_UUID, NAV_SALES_QUEUE_UUID, VIEW_SALES_QUEUE_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_SALES_QUEUE_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconTrophy',
  position: 1,
  folderUniversalIdentifier: NAV_OPERATIONS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_SALES_QUEUE_UUID,
});
