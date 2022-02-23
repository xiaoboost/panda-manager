import {
  createStyles,
  Black,
  Color,
  White,
  BlackLight,
  BlackLighter,
  Red,
} from '@panda/renderer-utils';

const height = 32;
const highlightBgColor = Color(Black.rgbNumber() + 0x242424).toString();

export const style = createStyles({
  iconClose: {},
  headerUnFocus: {},
  highlightTabItem: {},

  header: {
    height,
    fontSize: 12,
    color: BlackLighter.toString(),
    backgroundColor: Black.toString(),

    flexGrow: 0,
    flexShrink: 0,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    userSelect: 'none',
    '-webkit-app-region': 'drag',

    '& > span': {
      display: 'inline-flex',
      alignItems: 'center',
    },

    '&$headerUnFocus': {
      backgroundColor: BlackLight.toString(),

      '& $icon': {
        backgroundColor: BlackLight.toString(),
      },
    },
  },
  icon: {
    cursor: 'default !important',
    padding: [10, 17],
    display: 'flex',
    '-webkit-app-region': 'no-drag',

    '&:hover': {
      backgroundColor: highlightBgColor,
    },

    '&$iconClose:hover': {
      backgroundColor: `${Red.toString()} !important`,
      color: White.toString(),
    },
  },
  logo: {
    padding: [6, 12],
    fontSize: 20,
  },
  title: {
    fontSize: 13,
  },
  tabItem: {
    fontSize: 14,
    padding: [6, 12],
    '-webkit-app-region': 'no-drag',

    '&:hover, &$highlightTabItem': {
      backgroundColor: highlightBgColor,
    },
  },
});
