import '../styles';
import 'antd/dist/antd.css';

import { render } from 'react-dom';
import { createElement } from 'react';

import { App } from './app';
import { install } from 'src/server/renderer';

install();

render(
    createElement(App),
    document.getElementById('root')!,
);
