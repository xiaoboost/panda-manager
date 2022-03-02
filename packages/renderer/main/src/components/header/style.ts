import {
  createStyles,
  Black,
  White,
  Black3,
  BlackLight,
  BlackLighter,
  Red,
} from '@panda/renderer-utils';

const height = 32;

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
      backgroundColor: Black3.toString(),
    },

    '&$iconClose:hover': {
      backgroundColor: `${Red.toString()} !important`,
      color: White.toString(),
    },
  },
  logo: {
    padding: [2, 12],
    fontSize: 18,
    transform: 'translateY(2px)',
  },
  title: {
    fontSize: 13,
  },
  tabItem: {
    fontSize: 14,
    padding: [5, 12],
    '-webkit-app-region': 'no-drag',

    '&:hover, &$highlightTabItem': {
      backgroundColor: Black3.toString(),
    },
  },
});
