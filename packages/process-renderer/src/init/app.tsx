import * as React from 'react';

import { HashRouter, Route, Switch } from 'react-router-dom';

import { Layout } from '../components/layout';

import { Setting } from '../views/setting';
import { ObjectsList } from '../views/object-list';
import { ObjectDetail } from '../views/object-detail';
import { TagCollection } from '../views/tag-collection';

export const App = () => (
    <HashRouter>
        <Switch>
            <Layout>
                <Route exact path='/' component={ObjectsList} />
                <Route path='/setting' component={Setting} />
                <Route path='/detail/:id' component={ObjectDetail} />
                <Route path='/tags' component={TagCollection} />
            </Layout>
        </Switch>
    </HashRouter>
);
