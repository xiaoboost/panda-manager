import React from 'react';

import { HashRouter, Routes } from 'react-router-dom';

import { Layout } from '../components/layout';

export const App = () => (
  <HashRouter>
    <Layout>
      <div>123</div>
    </Layout>
  </HashRouter>
  // <HashRouter>
  //   <Routes>
  //     <div>123</div>
  //     {/* <Layout>
  //       <RouterViewer />
  //     </Layout> */}
  //   </Routes>
  // </HashRouter>
);
