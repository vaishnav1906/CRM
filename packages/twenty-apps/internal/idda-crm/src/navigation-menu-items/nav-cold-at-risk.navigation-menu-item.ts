import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_COLD_AT_RISK_UUID, NAV_SCORE_FOLDER_UUID, VIEW_COLD_AT_RISK_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_COLD_AT_RISK_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconSnowflake',
  position: 2,
  folderUniversalIdentifier: NAV_SCORE_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_COLD_AT_RISK_UUID,
});
