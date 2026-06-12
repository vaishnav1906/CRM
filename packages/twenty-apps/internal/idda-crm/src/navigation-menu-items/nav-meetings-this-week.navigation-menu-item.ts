import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_MEETINGS_THIS_WEEK_UUID, NAV_OPERATIONS_FOLDER_UUID, VIEW_MEETINGS_THIS_WEEK_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_MEETINGS_THIS_WEEK_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconCalendarEvent',
  position: 3,
  folderUniversalIdentifier: NAV_OPERATIONS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_MEETINGS_THIS_WEEK_UUID,
});
