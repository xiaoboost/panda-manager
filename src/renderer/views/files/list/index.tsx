import React from 'react';
import styles from './index.styl';

import { ipcRenderer } from 'electron';
import { useState, useEffect } from 'react';
import { useServer } from 'src/utils/react-use';
import { BaseFileData, EventName } from 'src/utils/typings';

type List = BaseFileData[];

export function Render() {
    const [list, setList] = useState<List>([]);
    const { data: origin, fetch } = useServer<List>(EventName.GetFilesList, true);

    // 绑定列表更新事件
    useEffect(() => {
        const name = String(EventName.UpdateConfig);
        const cb = () => {
            debugger;
            fetch().then(setList);
        };

        ipcRenderer.on(name, cb);

        return () => {
            ipcRenderer.off(name, cb);
        };
    }, []);

    // 列表初始化
    useEffect(() => {
        if (origin) {
            setList(origin);
        }
    }, [origin]);

    return (
        <main className={styles.filesList}>
            {JSON.stringify(list)}
        </main>
    );
}
