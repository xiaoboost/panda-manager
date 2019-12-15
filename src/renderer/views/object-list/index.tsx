import styles from './index.less';

import React from 'react';

import { useWatcher } from 'utils/react';
import { stringifyClass } from 'utils/web';
import { getModule } from 'renderer/modules';
import { Objects } from 'renderer/store/database';

export default function ObjectsList() {
    const [rows] = useWatcher(Objects);

    return (
        <main id={styles.objectsList}>
            {rows.map(({ data }) => {
                const module = getModule(data.type);

                if (!module) {
                    return '';
                }
                
                // onClick={clickHandler}
                // onDoubleClick={dbClickHandler}

                return (
                    <div
                        className={stringifyClass(styles.objectItem, {
                            [styles.objectItemSelected]: true,
                        })}>
                        <div className={styles.objectItemMask}>
                            <div className={styles.objectItemMaskOutside}></div>
                            <div className={styles.objectItemMaskInside}></div>
                        </div>
                        <module.ListCover id={data.id} />
                    </div>
                );
            })}
        </main>
    );
}
