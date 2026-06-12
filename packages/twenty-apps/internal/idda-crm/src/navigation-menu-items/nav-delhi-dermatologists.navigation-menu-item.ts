import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_DELHI_DERMATOLOGISTS_UUID, NAV_SEGMENTS_FOLDER_UUID, VIEW_DELHI_DERMATOLOGISTS_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_DELHI_DERMATOLOGISTS_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconMapPin',
  position: 1,
  folderUniversalIdentifier: NAV_SEGMENTS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_DELHI_DERMATOLOGISTS_UUID,
});
