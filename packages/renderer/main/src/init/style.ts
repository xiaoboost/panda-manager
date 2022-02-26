import 'antd/dist/antd.min.css';

import {
  createStyles,
  Black,
  WhiteBg,
  BlackLight,
  FontDefault,
  FontDefaultSize,
} from '@panda/renderer-utils';

const scrollWidth = 4;

createStyles({
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
    'html, body, #root': {
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
    '::-webkit-scrollbar': {
      width: scrollWidth,
      height: scrollWidth,
      backgroundColor: WhiteBg.toString(),
    },
    '::-webkit-scrollbar-track': {
      boxShadow: `inset 0 0 ${scrollWidth / 2}px rgba(0, 0, 0, 0.3)`,
      backgroundColor: WhiteBg.toString(),
    },
    '::-webkit-scrollbar-thumb': {
      boxShadow: `inset 0 0 ${scrollWidth / 2}px rgba(0, 0, 0, 0.3)`,
      backgroundColor: BlackLight.toString(),
      opacity: .7,
      transition: 'opacity ease-in-out 200ms',

      '&:hover': {
        opacity: 1,
      },
    },
  },
});
