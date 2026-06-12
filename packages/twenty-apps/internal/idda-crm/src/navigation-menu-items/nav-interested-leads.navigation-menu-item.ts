import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_INTERESTED_LEADS_UUID, NAV_SEGMENTS_FOLDER_UUID, VIEW_INTERESTED_LEADS_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_INTERESTED_LEADS_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconStar',
  position: 2,
  folderUniversalIdentifier: NAV_SEGMENTS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_INTERESTED_LEADS_UUID,
});
