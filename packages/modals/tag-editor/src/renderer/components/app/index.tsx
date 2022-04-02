import React from 'react';

import { styles } from './style';
import { Form } from '../form';
import { InitData } from '../../../shared';
import { useEffect, useState } from 'react';
import { Layout, getInitData } from '@panda/modal-utils/renderer';

export function App() {
  const { classes: cla } = styles;
  const [{ title, ...formData }, setData] = useState<InitData>({
    title: '',
    name: '',
    comment: '',
    alias: '',
  });

  useEffect(() => {
    getInitData<InitData>().then(setData);
  }, []);

  return (
    <Layout title={title} className={cla.app}>
      <Form data={formData} />
    </Layout>
  );
}
