import React from 'react';
import styles from './index.styl';

import { useHistory } from 'react-router';
import { FileCoverData } from 'src/utils/typings';
import { stringifyClass } from 'src/utils/web/dom';

interface Props extends FileCoverData {
    isSelected: boolean;
    onLeftClick: (ev: React.MouseEvent) => void;
    onRightClick: (ev: React.MouseEvent) => void;
}

export function Render(props: Props) {
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

    return (
        <div
            onClick={clickHandler}
            onDoubleClick={dbClickHandler}
            className={stringifyClass(styles.mangaItem, {
                [styles.mangaItemSelected]: props.isSelected,
            })}>
            <div className={styles.mangaItemMask}>
                <div className={styles.mangaItemMaskOutside}></div>
                <div className={styles.mangaItemMaskInside}></div>
            </div>
            <img src={props.file} height='200' />
        </div>
    );
}
