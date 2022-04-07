import { createStyles, Color, WhiteBg, BlackLight } from '@panda/renderer-utils';

const titleBgColor = Color(0xede8ef);
const tagListBgColor = Color(WhiteBg.rgbNumber() - 0x050505);

export const style = createStyles({
  headerActions: {},

  main: {
    width: 240,
    display: 'flex',
    flexDirection: 'column',

    '& $headerActions': {
      display: 'none',
    },

    '&:hover $headerActions': {
      display: 'inline-flex',
    },
  },
  header: {
    height: 35,
    padding: [0, 18],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: BlackLight.toString(),
    backgroundColor: titleBgColor.toString(),
  },
  body: {
    flexGrow: 1,
    backgroundColor: tagListBgColor.toString(),
  },
  title: {
    fontSize: 12,
    cursor: 'default',
    fontWeight: 400,
    margin: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});
