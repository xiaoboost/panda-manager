import './css';
import 'renderer/lib/native';

import * as React from 'react';

import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Header from 'renderer/components/header';
import Sidebar from 'renderer/components/sidebar';

import Setting from 'renderer/views/setting';
import MangaList from 'renderer/views/manga-list';
// import ItemDetail from 'renderer/views/manga-detail';
// import TagCollection from 'renderer/views/tag-collection';

render(
    <HashRouter>
        <Header />
        <article className='app-body'>
            <Sidebar />
            <div className="app-content__wrapper">
                <Switch>
                    <Route exact path='/' component={MangaList} />
                    <Route path='/setting' component={Setting} />
                    {/* <Route path='/tags' component={TagCollection} /> */}
                    {/* <Route path='/detail/:id' component={ItemDetail} */}
                </Switch>
            </div>
        </article>
    </HashRouter>,
    document.getElementById('app')!,
);
