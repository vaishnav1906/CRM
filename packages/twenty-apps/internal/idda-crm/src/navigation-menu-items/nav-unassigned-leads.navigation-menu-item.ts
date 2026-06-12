import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_SEGMENTS_FOLDER_UUID, NAV_UNASSIGNED_LEADS_UUID, VIEW_UNASSIGNED_LEADS_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_UNASSIGNED_LEADS_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconUserOff',
  position: 6,
  folderUniversalIdentifier: NAV_SEGMENTS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_UNASSIGNED_LEADS_UUID,
});
