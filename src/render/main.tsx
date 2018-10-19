import './css/main';

import * as React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import ItemsList from 'views/items-list/component';
import ItemDetail from 'views/item-detail/component';

render(
    <HashRouter>
        <Switch>
            <Route exact path='/' component={ItemsList} />
            <Route path='/detail/:id(\d+)' component={ItemDetail} />
        </Switch>
    </HashRouter>,
    document.getElementById('app')!,
);
