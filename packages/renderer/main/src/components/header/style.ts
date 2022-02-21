import {
  createStyles,
  Black,
  BlackLight,
  White,
  Red,
} from '@panda/renderer-utils';

const height = 32;

export const style = createStyles({
  iconClose: {},
  headerUnFocus: {},

  header: {
    height,
    color: White.toString(),
    fontSize: 12,
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

      '& #icon': {
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
      backgroundColor: BlackLight.toString(),
    },

    '&$iconClose:hover': {
      backgroundColor: `${Red.toString()} !important`,
    },
  },
  logo: {
    padding: [4, 11],
    fontSize: 24,
  },
  title: {
    padding: [0, 13],
  },
});
