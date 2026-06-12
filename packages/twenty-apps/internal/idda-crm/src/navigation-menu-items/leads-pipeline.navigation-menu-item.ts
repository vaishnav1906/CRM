import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import {
  LEADS_FOLDER_NAV_UUID,
  LEADS_PIPELINE_BOARD_VIEW_UUID,
  PIPELINE_NAV_UUID,
} from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: PIPELINE_NAV_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconLayoutKanban',
  position: 0,
  folderUniversalIdentifier: LEADS_FOLDER_NAV_UUID,
  viewUniversalIdentifier: LEADS_PIPELINE_BOARD_VIEW_UUID,
});
