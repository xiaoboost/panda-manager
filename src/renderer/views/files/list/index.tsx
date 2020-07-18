import React from 'react';
import styles from './index.styl';

import { ipcRenderer, shell } from 'electron';
import { useEffect } from 'react';
import { Cover as MangaCover } from 'src/manga/renderer';

// import { useHistory } from 'react-router';
import { useServer } from 'src/utils/react-use';
import { stringifyClass } from 'src/utils/web/dom';
import { BaseFileData, EventName, FileKind } from 'src/utils/typings';

import { LoadingOutlined } from '@ant-design/icons';

interface CoverProps {
    id: number;
    kind: FileKind;
    isSelected: boolean;
    onLeftClick: (ev: React.MouseEvent) => void;
    onRightClick: (ev: React.MouseEvent) => void;
}

function Cover(props: CoverProps) {
    const { loading, fetch: openFile } = useServer(EventName.OpenFile, {
        id: props.id,
    });

    // const history = useHistory();

    const clickHandler = (ev: React.MouseEvent) => {
        if (ev.button === 0) {
            props.onLeftClick(ev);
        }
        else if (ev.button === 2) {
            props.onRightClick(ev);
        }
    };

    // 双击解压
    const dbClickHandler = (ev: React.MouseEvent) => {
        // 左键
        if (ev.button === 0) {
            if (!loading) {
                openFile();
            }
            // history.push(`/detail/${props.id}`);
        }
    };

    return (
        <div
            onClick={clickHandler}
            onDoubleClick={dbClickHandler}
            className={stringifyClass(styles.fileCover, {
                [styles.fileCoverSelected]: props.isSelected,
            })}>
            <div className={styles.fileSeletedMask}>
                <div className={styles.fileSeletedMaskOutside}></div>
                <div className={styles.fileSeletedMaskInside}></div>
            </div>
            {loading &&
                <div className={styles.fileProgressMask}>
                    <LoadingOutlined />
                </div>
            }
            <div className={styles.fileCoverInner}>
                <MangaCover id={props.id} />
            </div>
        </div>
    );
}

export function Render() {
    const { data, fetch } = useServer<BaseFileData[]>(EventName.GetFilesList, true);

    // 绑定列表更新事件
    useEffect(() => {
        const cb = () => {
            console.log('update');
            fetch();
        };

        ipcRenderer.on(EventName.UpdateFilesList, cb);

        return () => {
            ipcRenderer.off(EventName.UpdateFilesList, cb);
        };
    }, []);

    return (
        <main className={styles.filesList}>
            {data && data.map((item) =>
                <Cover
                    key={item.id}
                    id={item.id}
                    kind={item.kind}
                    isSelected={false}
                    onLeftClick={() => ({})}
                    onRightClick={() => ({})}
                />,
            )}
        </main>
    );
}
