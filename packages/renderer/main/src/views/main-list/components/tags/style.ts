import { createStyles, Color, Black, White, PurpleLight, Red } from '@panda/renderer-utils';

export const height = 30;
const mainBgColor = PurpleLight;
const fontColor = Color(Black.rgbNumber() + 0x121212);

export const RowHeight = 22;

const lineHeight = {
  height: RowHeight,
  lineHeight: `${RowHeight}px`,
};
const inlineFlex = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const staticFlex = {
  flexGrow: 0,
  flexShrink: 0,
};

export const styles = createStyles({
  indent: {
    height: '100%',
    width: 8,
    pointerEvents: 'none',
  },
  indentGuide: {
    display: 'inline-block',
    boxSizing: 'border-box',
    height: '100%',
    width: 8,
    borderLeft: '1px solid transparent',
    transition: 'border-color .1s linear',
  },
  row: {
    cursor: 'pointer',
    touchAction: 'none',
    display: 'flex',
    height: RowHeight,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    fontSize: 16,
    paddingLeft: 16,

    '&:hover': {
      // TODO:
      // backgroundColor: '',

      '& $rowIconAfter': {
        display: 'inline-flex',
      },
    },
  },
  title: {
    flex: 1,
    fontSize: 12,
    textOverflow: 'ellipsis',
    display: 'inline-flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    ...lineHeight,
  },
  innerInput: {
    padding: 2,
  },
  titleLabel: {
    color: 'inherit',
    whiteSpace: 'pre',
    textDecoration: 'none',
    display: 'inline-flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    ...staticFlex,
    ...lineHeight,
    ...inlineFlex,
    paddingRight: 6,
    fontSize: 10,
  },
});
