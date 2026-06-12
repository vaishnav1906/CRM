import { defineNavigationMenuItem, NavigationMenuItemType } from 'twenty-sdk/define';

import { LEADS_FOLDER_NAV_UUID } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({
  universalIdentifier: LEADS_FOLDER_NAV_UUID,
  type: NavigationMenuItemType.FOLDER,
  icon: 'IconStethoscope',
  name: 'Leads',
  position: 0,
});
