import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_OPERATIONS_FOLDER_UUID, NAV_RESEARCH_QUEUE_UUID, VIEW_RESEARCH_QUEUE_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_RESEARCH_QUEUE_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconSearch',
  position: 0,
  folderUniversalIdentifier: NAV_OPERATIONS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_RESEARCH_QUEUE_UUID,
});
