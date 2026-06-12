import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_SCORE_FOLDER_UUID, NAV_WARM_PIPELINE_UUID, VIEW_WARM_PIPELINE_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_WARM_PIPELINE_UUID,
  type: NavigationMenuItemType.VIEW,
  icon: 'IconSun',
  position: 1,
  folderUniversalIdentifier: NAV_SCORE_FOLDER_UUID,
  viewUniversalIdentifier: VIEW_WARM_PIPELINE_UUID,
});
