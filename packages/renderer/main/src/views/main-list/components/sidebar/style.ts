import { createStyles, Color, WhiteBg, Black, BlackLight } from '@panda/renderer-utils';

const titleBgColor = Color(0xede8ef);
const tagListBgColor = Color(WhiteBg.rgbNumber() - 0x050505);
const actionColor = Color(BlackLight.rgbNumber() - Black.rgbNumber());

export const style = createStyles({
  main: {
    width: 200,
    display: 'flex',
    flexDirection: 'column',

    '&:hover $actionsContainer': {
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
  actionsContainer: {
    display: 'none',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    height: '100%',
    alignItems: 'center',
  },
  actionItem: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    marginLeft: 4,

    '& > a': {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  actionLabel: {
    fontSize: 14,
    padding: 2,
    textDecoration: 'none',
    textRendering: 'auto',
    textAlign: 'center',
    textTransform: 'none',
    borderRadius: 4,
    color: actionColor.toString(),

    '&:hover': {
      backgroundColor: '#dddddd',
    },
  },
});
