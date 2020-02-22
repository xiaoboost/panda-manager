import * as React from 'react';

import { HashRouter, Switch } from 'react-router-dom';

import { Layout } from '../components/layout';
import { RouterViewr } from '../router';

export const App = () => (
    <HashRouter>
        <Switch>
            <Layout>
                <RouterViewr />
            </Layout>
        </Switch>
    </HashRouter>
);
