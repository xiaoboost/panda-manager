import * as React from 'react';

import { HashRouter, Switch } from 'react-router-dom';

// import { Layout } from '../components/layout';
// import { RouterViewr } from '../router';

export const App = () => (
    <HashRouter>
        <Switch>
            <div>测试</div>
            {/* <Layout>
                <RouterViewr />
            </Layout> */}
        </Switch>
    </HashRouter>
);
