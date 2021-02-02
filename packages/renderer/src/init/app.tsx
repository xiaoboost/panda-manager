import React from 'react';

import { HashRouter, Switch } from 'react-router-dom';

// import { Layout } from '../components/layout';
// import { RouterViewer } from '../router';

export const App = () => (
    <HashRouter>
        <Switch>
            <div>123</div>
            {/* <Layout>
                <RouterViewer />
            </Layout> */}
        </Switch>
    </HashRouter>
);
