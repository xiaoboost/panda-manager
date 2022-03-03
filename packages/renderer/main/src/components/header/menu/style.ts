import {
  createStyles,
  Color,
  BlackLight,
  WhiteBg,
  Green,
  BlackExtraLight,
} from '@panda/renderer-utils';

const bgColor = WhiteBg;
const itemFocusBgColor = Green;
const fontColor = BlackLight;
const fontFocusColor = Color(BlackLight.rgbNumber() + 0x0b0b0b);
const fontDisableColor = BlackExtraLight;
const splitColor = Color(BlackExtraLight.rgbNumber() - 0x101010);

export const style = createStyles({
  panelShow: {},
  panelItemDisabled: {},

  menu: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  panel: {
    position: 'fixed',
    minWidth: 180,
    display: 'none',
    flexDirection: 'column',
    padding: [4, 1],
    zIndex: 10,
    boxShadow: `0px 1px 4px ${Color.rgb(0, 0, 0, 0.2).toString()}`,
    backgroundColor: bgColor.toString(),
    color: fontColor.toString(),

    '&$panelShow': {
      display: 'flex',
    },
  },
  panelItem: {
    height: 24,
    lineHeight: '24px',
    fontSize: 12,
    margin: [2, 0],
    padding: [0, 20],

    '&:hover': {
      color: fontFocusColor.toString(),
      backgroundColor: itemFocusBgColor.toString(),
    },

    '&$panelItemDisabled': {
      color: `${fontDisableColor.toString()} !important`,
      backgroundColor: 'transparent !important',
    },
  },
  panelSplit: {
    height: 1,
    margin: [4, 10],
    backgroundColor: splitColor.toString(),
  },
});
