import './component.styl';

import * as React from 'react';

interface State {
    tags: string[];
}

export default class Header extends React.Component<{}, State> {
    state = {
        tags: ['测试'],
    };

    render() {
        return <div id="main-list-header">
            header 内容
        </div>;
    }
}
