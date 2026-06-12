import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { NAV_SEGMENTS_FOLDER_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: NAV_SEGMENTS_FOLDER_UUID,
  type: NavigationMenuItemType.FOLDER,
  icon: 'IconLayoutColumns',
  name: 'Segments',
  position: 1,
});
