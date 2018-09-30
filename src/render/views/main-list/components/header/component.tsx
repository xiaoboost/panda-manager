import './component.styl';
import 'antd/lib/button/style'

import * as React from 'react';
import Button from 'antd/lib/button';
import { selectDirectories } from 'lib/communicate';

export default class Header extends React.Component<{}, {}> {
    addFolder = async () => {
        const directories = await selectDirectories();
        console.log(directories);
    }

    render() {
        return <div id="main-list-header">
            <Button onClick={this.addFolder}>添加文件夹</Button>
        </div>;
    }
}
