import './css/main';

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import store from 'store';

import Setting from 'views/setting/component';
import ItemsList from 'views/items-list/component';
import ItemDetail from 'views/item-detail/component';
import TagCollection from 'views/tag-collection';

render(
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route exact path='/' component={ItemsList} />
                <Route path='/setting' component={Setting} />
                <Route path='/tags' component={TagCollection} />
                <Route path='/detail/:id' component={ItemDetail} />
            </Switch>
        </HashRouter>
    </Provider>,
    document.getElementById('app')!,
);
