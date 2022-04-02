import { createRoot } from 'react-dom/client';
import { createElement } from 'react';

import { App } from './app';

createRoot(document.getElementById('root')!).render(createElement(App));
