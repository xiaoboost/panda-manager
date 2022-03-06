import { createStyles, Color, Black, White, PurpleLight, Red } from '@panda/renderer-utils';

export const height = 30;
const mainBgColor = PurpleLight;
const mainBlurBgColor = Color(mainBgColor.rgbNumber() + 0x12180b);
const mainFocusBgColor = Color(mainBgColor.rgbNumber() - 0x141316); // B0A4C1
const fontColor = Color(Black.rgbNumber() + 0x121212);
const fontBlurColor = Color(fontColor.rgbNumber() + 0x404040);

export const style = createStyles({
  iconClose: {},
  headerUnFocus: {},
  highlightTabItem: {},

  header: {
    height,
    fontSize: 12,
    color: fontColor.toString(),
    backgroundColor: mainBgColor.toString(),

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
      height: '100%',
    },

    '&$headerUnFocus': {
      backgroundColor: mainBlurBgColor.toString(),
      color: fontBlurColor.toString(),

      '& $icon': {
        backgroundColor: mainBlurBgColor.toString(),
        color: fontBlurColor.toString(),
      },
    },
  },
  icon: {
    cursor: 'default !important',
    padding: [10, 17],
    display: 'flex',
    '-webkit-app-region': 'no-drag',

    '&:hover': {
      backgroundColor: mainFocusBgColor.toString(),
    },

    '&$iconClose:hover': {
      backgroundColor: `${Red.toString()} !important`,
      color: White.toString(),
    },
  },
  logo: {
    padding: [1, 12],
    fontSize: 18,
    transform: 'translateY(2px)',
  },
  title: {
    fontSize: 12,
  },
  tabItem: {
    fontSize: 13,
    padding: [4, 12],
    height: '100%',
    '-webkit-app-region': 'no-drag',

    '&:hover, &$highlightTabItem': {
      backgroundColor: mainFocusBgColor.toString(),
    },
  },
  nav: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
