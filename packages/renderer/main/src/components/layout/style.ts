import {
  createStyles,
  Black,
  BlackLight,
} from '@panda/renderer-utils';

export const style = createStyles({
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    border: `1px solid ${Black.toString()}`,
  },
  appUnFocus: {
    borderColor: BlackLight.toString(),
  },
  appBody: {
    flexGrow: 1,
    flexShrink: 1,
    height: 'calc(100% - 32px)',
  },
  appContent: {
    flexGrow: 1,
    flexShrink: 1,
    padding: '10px 18px',
    overflow: 'hidden auto',
  },
});
