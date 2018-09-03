import './component.styl';

import * as React from 'react';
import Tag from 'components/tag/component';

interface State {
    tags: string[];
}

export default class Header extends React.Component<{}, State> {
    state = {
        tags: ['测试'],
    };

    render() {
        return <div id="main-list-header">
            {this.state.tags.map((tag, i) =>
                <Tag key={i} closable>{tag}</Tag>
            )}
        </div>;
    }
}
