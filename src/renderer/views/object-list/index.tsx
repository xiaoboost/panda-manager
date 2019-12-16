import styles from './index.less';

import React from 'react';

import { stringifyClass } from 'utils/web';
import { Database, Config } from 'renderer/store';
import { getModule, BaseModuleData } from 'renderer/modules';
import { useWatcher, useMap, useListCallback } from 'utils/react';

import stringNaturalCompare from 'string-natural-compare';

export default function ObjectsList() {
    const [rows] = useWatcher(Database.Objects);
    const [{ sort }] = useWatcher(Config.data);
    const sortMethod = (() => {
        const val = Math.pow(-1, Number(!sort.asc));
        if (sort.by === Config.SortBy.name) {
            return (pre: BaseModuleData, next: BaseModuleData) => {
                return val * stringNaturalCompare(pre.name, next.name);
            };
        }
        else if (sort.by === Config.SortBy.size) {
            return (pre: BaseModuleData, next: BaseModuleData) => {
                return pre.fileSize > next.fileSize ? val : -1 * val;
            };
        }
        else {
            return (pre: BaseModuleData, next: BaseModuleData) => {
                return pre.lastModified > next.lastModified ? val : -1 * val;
            };
        }
    })();

    const datas = rows.map(({ data }) => data)
        .sort(sortMethod)
        .filter(({ type }) => Boolean(getModule(type)));

    const [selected, setSelected] = useMap<Record<number, boolean>>({});
    const itemClickHandler = useListCallback(datas, (data) => (ev: React.MouseEvent) => {
        // 左键
        if (ev.button === 0) {
            setSelected.set(data.id, !selected[data.id]);
        }
        // 右键
        else if (ev.button === 2) {
            console.log(`右键：${data.id}`)
        }
    });
    const backgroundClickHandler = (ev: React.MouseEvent) => {
        if (ev.currentTarget === ev.target) {
            setSelected.reset();
        }
    };

    return (
        <main id={styles.objectsList} onClick={backgroundClickHandler}>
            {datas.map((data, i) => (
                <div
                    key={data.id}
                    onClick={itemClickHandler[i]}
                    className={stringifyClass(styles.objectItem, {
                        [styles.objectItemSelected]: selected[data.id],
                    })}>
                    <div className={styles.objectItemMask}>
                        <div className={styles.objectItemMaskOutside}></div>
                        <div className={styles.objectItemMaskInside}></div>
                    </div>
                    {(() => {
                        const { ListCover } = getModule(data.type)!;
                        return <ListCover id={data.id} />
                    })()}
                </div>
            ))}
        </main>
    );
}
