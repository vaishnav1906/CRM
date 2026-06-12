import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_HOT_LEADS_SCORE_UUID, NAV_SCORE_FOLDER_UUID, VIEW_HOT_LEADS_SCORE_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_HOT_LEADS_SCORE_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconFlame',
  position: 0,
  folderUniversalIdentifier: NAV_SCORE_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_HOT_LEADS_SCORE_UUID,
});
