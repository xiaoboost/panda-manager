import React from 'react';

import { HashRouter, Switch } from 'react-router-dom';

import { Layout } from '../components/layout';
// import { RouterViewer } from '../router';

export const App = () => (
  <HashRouter>
    <Switch>
      <Layout>
        <div>123</div>
        {/* <RouterViewer /> */}
      </Layout>
    </Switch>
  </HashRouter>
);
