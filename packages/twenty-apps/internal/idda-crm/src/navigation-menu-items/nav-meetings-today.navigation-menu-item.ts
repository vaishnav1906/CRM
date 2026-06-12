import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_MEETINGS_TODAY_UUID, NAV_OPERATIONS_FOLDER_UUID, VIEW_MEETINGS_TODAY_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_MEETINGS_TODAY_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconCalendarStar',
  position: 5,
  folderUniversalIdentifier: NAV_OPERATIONS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_MEETINGS_TODAY_UUID,
});
