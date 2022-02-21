import './style';

import { render } from 'react-dom';
import { createElement } from 'react';
// import { fetchInit } from '@panda/fetch';

import { App } from './app';

// fetchInit();

render(createElement(App), document.getElementById('root')!);
