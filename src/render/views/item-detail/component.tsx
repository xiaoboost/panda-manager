import './component.styl';

import * as fs from 'fs';
import * as React from 'react';

interface Props {
    id: number;
}

export default class ItemDetail extends React.Component<Props> {
    render() {
        return <main id='item-detail'>
            项目详情
        </main>;
    }
}
