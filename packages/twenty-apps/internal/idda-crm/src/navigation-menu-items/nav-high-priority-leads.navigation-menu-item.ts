import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_HIGH_PRIORITY_UUID, NAV_SEGMENTS_FOLDER_UUID, VIEW_HIGH_PRIORITY_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_HIGH_PRIORITY_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconAlertTriangle',
  position: 4,
  folderUniversalIdentifier: NAV_SEGMENTS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_HIGH_PRIORITY_UUID,
});
