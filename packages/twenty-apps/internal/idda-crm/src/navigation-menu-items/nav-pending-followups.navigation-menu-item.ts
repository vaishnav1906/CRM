import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_OPERATIONS_FOLDER_UUID, NAV_PENDING_FOLLOWUPS_UUID, VIEW_PENDING_FOLLOWUPS_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_PENDING_FOLLOWUPS_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconCalendarClock',
  position: 2,
  folderUniversalIdentifier: NAV_OPERATIONS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_PENDING_FOLLOWUPS_UUID,
});
