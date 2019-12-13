import './css';
import 'antd/dist/antd.css';
import 'renderer/lib/native';

import * as React from 'react';

import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Header from 'renderer/components/header';
import Sidebar from 'renderer/components/sidebar';

import Setting from 'renderer/views/setting';
import ObjectList from 'renderer/views/object-list';
import ObjectDetail from 'renderer/views/object-detail';
import TagCollection from 'renderer/views/tag-collection';

render(
    <HashRouter>
        <Header />
        <article className='app-body'>
            <Sidebar />
            <div className='app-content__wrapper'>
                <Switch>
                    <Route exact path='/' component={ObjectList} />
                    <Route path='/setting' component={Setting} />
                    <Route path='/detail/:id' component={ObjectDetail} />
                    <Route path='/tags' component={TagCollection} />
                </Switch>
            </div>
        </article>
    </HashRouter>,
    document.getElementById('app')!,
);
