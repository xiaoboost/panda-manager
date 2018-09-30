import './css/main';

import * as React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { init } from 'lib/cache';
import MainList from 'views/main-list/component';
import ItemDetail from 'views/item-detail/component';

init();

render(
    <HashRouter>
        <Switch>
            <Route exact path="/" component={MainList} />
            <Route path="/detail/:id(\d+)" component={ItemDetail} />
        </Switch>
    </HashRouter>,
    document.getElementById('app')!,
);
