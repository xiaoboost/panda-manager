import React from 'react';
import styles from './index.styl';

import { ipcRenderer } from 'electron';
import { useEffect } from 'react';
import { Cover as MangaCover } from 'src/manga/renderer';

import { useHistory } from 'react-router';
import { useServer } from 'src/utils/react-use';
import { stringifyClass } from 'src/utils/web/dom';
import { BaseFileData, EventName, FileKind } from 'src/utils/typings';

interface CoverProps {
    id: number;
    kind: FileKind;
    isSelected: boolean;
    onLeftClick: (ev: React.MouseEvent) => void;
    onRightClick: (ev: React.MouseEvent) => void;
}

function Cover(props: CoverProps) {
    let inner: JSX.Element | undefined;

    const history = useHistory();

    const clickHandler = (ev: React.MouseEvent) => {
        if (ev.button === 0) {
            props.onLeftClick(ev);
        }
        else if (ev.button === 2) {
            props.onRightClick(ev);
        }
    };

    const dbClickHandler = (ev: React.MouseEvent) => {
        if (ev.button !== 0) {
            return;
        }

        history.push(`/detail/${props.id}`);
    };

    if (props.kind === FileKind.Mange) {
        inner = <MangaCover id={props.id} />;
    }

    if (!inner) {
        return <></>;
    }

    return (
        <div
            onClick={clickHandler}
            onDoubleClick={dbClickHandler}
            className={stringifyClass(styles.fileCover, {
                [styles.fileCoverSelected]: props.isSelected,
            })}>
            <div className={styles.fileCoverMask}>
                <div className={styles.fileCoverMaskOutside}></div>
                <div className={styles.fileCoverMaskInside}></div>
            </div>
            <div className={styles.fileCoverInner}>
                {inner}
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
