import React from 'react';

import { HashRouter, Routes, Route } from 'react-router-dom';

import { Layout } from '../components/layout';
import { MainList } from 'src/views/main-list';
import { Setting } from 'src/views/setting';
import { Detail } from 'src/views/detail';

export const App = () => (
  <HashRouter>
    <Layout>
      <Routes>
        <Route path='/detail/:id' element={<Detail />} />
        <Route path='/setting' element={<Setting />} />
        <Route path='/' element={<MainList />} />
      </Routes>
    </Layout>
  </HashRouter>
);
