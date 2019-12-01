import './css';
import 'renderer/lib/native';

import * as React from 'react';

import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Header from 'renderer/components/header';
import Sidebar from 'renderer/components/sidebar';

import Setting from 'renderer/views/setting';
import ItemList from 'renderer/views/item-list';
import ItemDetail from 'renderer/views/item-detail';
import TagCollection from 'renderer/views/tag-collection';

render(
    <HashRouter>
        <Header />
        <article className='app-body'>
            <Sidebar />
            <div className='app-content__wrapper'>
                <Switch>
                    <Route exact path='/' component={ItemList} />
                    <Route path='/setting' component={Setting} />
                    <Route path='/detail/:id' component={ItemDetail} />
                    <Route path='/tags' component={TagCollection} />
                </Switch>
            </div>
        </article>
    </HashRouter>,
    document.getElementById('app')!,
);
