// import { getInitData } from '@panda/modal-utils/renderer';

// getInitData().then((data) => {
//   console.log(data);
// });

// import './style';

import { render } from 'react-dom';
import { createElement } from 'react';

import { App } from './components/app';

render(createElement(App), document.getElementById('root')!);
