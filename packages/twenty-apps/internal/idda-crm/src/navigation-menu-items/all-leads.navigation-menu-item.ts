import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import {
  ALL_LEADS_NAV_UUID,
  ALL_LEADS_TABLE_VIEW_UUID,
  LEADS_FOLDER_NAV_UUID,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: ALL_LEADS_NAV_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconList',
  position: 1,
  folderUniversalIdentifier: LEADS_FOLDER_NAV_UUID,
  viewUniversalIdentifier: ALL_LEADS_TABLE_VIEW_UUID,
});
