import './component.styl';

import * as React from 'react';

import Header from './components/header/component';

export default class MainList extends React.Component {
    render() {
        return <div id="main-list">
            <Header></Header>
            缩略图列表
        </div>;
    }
}
