import './css/main.styl';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import MainList from 'views/main-list/component';
import ItemDetail from 'views/item-detail/component';

ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route exact path="/" component={MainList} />
            <Route path="/detail/:id(\d+)" component={ItemDetail} />
        </Switch>
    </HashRouter>,
    document.getElementById('app')!,
);
