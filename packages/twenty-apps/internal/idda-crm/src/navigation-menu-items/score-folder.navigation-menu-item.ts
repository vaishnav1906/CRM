import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_SCORE_FOLDER_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_SCORE_FOLDER_UUID,
  type: NavigationMenuItemType.FOLDER,
  icon: 'IconStar',
  name: 'Score',
  position: 3,
});
