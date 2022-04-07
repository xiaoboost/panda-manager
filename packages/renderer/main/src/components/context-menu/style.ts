import { createStyles, Color, BlackLight, Green, BlackExtraLight } from '@panda/renderer-utils';

const itemFocusBgColor = Green;
const fontFocusColor = Color(BlackLight.rgbNumber() + 0x0b0b0b);
const fontDisableColor = BlackExtraLight;
const splitColor = Color(BlackExtraLight.rgbNumber() - 0x101010);

export const styles = createStyles({
  disabled: {},
  split: {
    height: 1,
    margin: [4, 10],
    backgroundColor: splitColor.toString(),
  },
  item: {
    height: 24,
    lineHeight: '24px',
    fontSize: 12,
    margin: [2, 0],
    padding: [0, 20],

    '&:hover': {
      color: fontFocusColor.toString(),
      backgroundColor: itemFocusBgColor.toString(),
    },

    '&$disabled': {
      color: `${fontDisableColor.toString()} !important`,
      backgroundColor: 'transparent !important',
    },
  },
});
