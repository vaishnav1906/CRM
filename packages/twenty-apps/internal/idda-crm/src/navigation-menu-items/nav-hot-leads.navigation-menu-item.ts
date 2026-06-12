import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_HOT_LEADS_UUID, NAV_SEGMENTS_FOLDER_UUID, VIEW_HOT_LEADS_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_HOT_LEADS_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconFlame',
  position: 3,
  folderUniversalIdentifier: NAV_SEGMENTS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_HOT_LEADS_UUID,
});
