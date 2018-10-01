import './component.styl';
import 'antd/lib/button/style'

import * as React from 'react';
import Button from 'antd/lib/button';
import { selectDirectory } from 'lib/utils';

export default class MainList extends React.Component {
    addFolder = async () => {
        const directories = await selectDirectory();
        console.log(directories);
    }

    render() {
        return <div id="main-list">
            <header className="main-list-header">
                <Button onClick={this.addFolder}>添加文件夹</Button>
            </header>
            缩略图列表
        </div>;
    }
}
