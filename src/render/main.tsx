import './css/main';

import * as React from 'react';

import { render } from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Setting from 'render/views/setting';
import MangaList from 'render/views/manga-list';
import ItemDetail from 'render/views/manga-detail';
import TagCollection from 'render/views/tag-collection';

render(
    <HashRouter>
        <Switch>
            <Route exact path='/' component={MangaList} />
            <Route path='/setting' component={Setting} />
            <Route path='/tags' component={TagCollection} />
            <Route path='/detail/:id' component={ItemDetail} />
        </Switch>
    </HashRouter>,
    document.getElementById('app')!,
);
