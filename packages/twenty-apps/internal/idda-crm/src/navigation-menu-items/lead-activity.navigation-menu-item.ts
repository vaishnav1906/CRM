import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import {
  LEAD_ACTIVITY_ALL_VIEW_UUID,
  LEAD_ACTIVITY_NAV_UUID,
  LEADS_FOLDER_NAV_UUID,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: LEAD_ACTIVITY_NAV_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconActivity',
  position: 2,
  folderUniversalIdentifier: LEADS_FOLDER_NAV_UUID,
  viewUniversalIdentifier: LEAD_ACTIVITY_ALL_VIEW_UUID,
});
