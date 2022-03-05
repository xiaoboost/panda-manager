import React from 'react';

import { style } from './style';
import { Form } from '../form';
import { Footer } from '../footer';

export const App = () => (
  <div className={style.classes.app}>
    <Form />
    <Footer />
  </div>
);
