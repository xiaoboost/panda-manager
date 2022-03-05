import { createStyles, Black, FontDefault, FontDefaultSize } from '@panda/renderer-utils';
import { ModalHeight, ModalWidth } from 'src/shared';

export const style = createStyles({
  '@global': {
    '*': {
      margin: 0,
      padding: 0,
      border: 0,
      cursor: 'inherit',
      userSelect: 'inherit',
      boxSizing: 'border-box',
      '-webkit-margin-before': 0,
      '-webkit-margin-after': 0,
    },
    html: {
      overflow: 'hidden',
      width: ModalWidth,
      height: ModalHeight,
      border: process.env.NODE_ENV === 'development' ? '1px solid #000' : 'none',
    },
    'body, #root': {
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      userSelect: 'none',
      cursor: 'default',
      color: Black.toString(),
      fontFamily: FontDefault,
      fontSize: FontDefaultSize,
    },
    'input, textarea': {
      cursor: 'text',
    },
  },
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
});
