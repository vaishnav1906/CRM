import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_REJECTED_LEADS_UUID, NAV_SEGMENTS_FOLDER_UUID, VIEW_REJECTED_LEADS_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_REJECTED_LEADS_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconX',
  position: 5,
  folderUniversalIdentifier: NAV_SEGMENTS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_REJECTED_LEADS_UUID,
});
