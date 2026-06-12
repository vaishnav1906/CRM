import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_OPERATIONS_FOLDER_UUID, NAV_TODAY_FOLLOWUPS_UUID, VIEW_TODAY_FOLLOWUPS_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_TODAY_FOLLOWUPS_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconCalendarDue',
  position: 4,
  folderUniversalIdentifier: NAV_OPERATIONS_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_TODAY_FOLLOWUPS_UUID,
});
