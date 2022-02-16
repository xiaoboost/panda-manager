// import 'antd/es/modal/style/index.css';
// import 'antd/es/switch/style/index.css';
// import 'antd/es/select/style/index.css';
// import 'antd/es/button/style/index.css';
// import 'antd/es/progress/style/index.css';

import {
  createStyles,
  Black,
  BlackLight,
  FontDefault,
  FontDefaultSize,
} from '@panda/renderer-utils';

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
    'body, body *': {
      display: 'flex',
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
  },
});
