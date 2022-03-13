import { createStyles, BlackLight, Purple, WhiteBg } from '@panda/renderer-utils';

import { height as headerHeight } from '../header/style';
import { height as footerHeight } from '../footer/style';

export const style = createStyles({
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    border: `1px solid ${Purple.toString()}`,
  },
  appUnFocus: {
    borderColor: BlackLight.toString(),
  },
  appBody: {
    flexGrow: 1,
    flexShrink: 1,
    height: `calc(100% - ${headerHeight}px - ${footerHeight}px)`,
    overflow: 'hidden auto',
    backgroundColor: WhiteBg.toString(),
  },
});
