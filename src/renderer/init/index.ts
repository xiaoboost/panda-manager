import './style';

import { render } from 'react-dom';
import { createElement } from 'react';

import { App } from './app';
import { install } from 'src/server/renderer';

install();

render(
    createElement(App),
    document.getElementById('root')!,
);
