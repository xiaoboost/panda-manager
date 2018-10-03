import './component.styl';
import 'antd/lib/button/style'

import * as React from 'react';
import Button from 'antd/lib/button';
import { appCache } from 'lib/cache';
import { selectDirectory } from 'lib/utils';

export default class MainList extends React.Component {
    addFolder = async () => {
        const directories = await selectDirectory();

        if (!directories) {
            return;
        }

        appCache.addDirectory(directories);
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
