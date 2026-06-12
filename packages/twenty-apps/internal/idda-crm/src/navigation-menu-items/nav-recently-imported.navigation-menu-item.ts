import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_RECENTLY_IMPORTED_UUID, NAV_SEGMENTS_FOLDER_UUID, VIEW_RECENTLY_IMPORTED_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_RECENTLY_IMPORTED_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconCloudDownload',
  position: 7,
  folderUniversalIdentifier: NAV_SEGMENTS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_RECENTLY_IMPORTED_UUID,
});
