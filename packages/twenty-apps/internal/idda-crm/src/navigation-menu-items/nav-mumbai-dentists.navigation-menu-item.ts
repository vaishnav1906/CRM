import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_MUMBAI_DENTISTS_UUID, NAV_SEGMENTS_FOLDER_UUID, VIEW_MUMBAI_DENTISTS_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_MUMBAI_DENTISTS_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconMapPin',
  position: 0,
  folderUniversalIdentifier: NAV_SEGMENTS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_MUMBAI_DENTISTS_UUID,
});
