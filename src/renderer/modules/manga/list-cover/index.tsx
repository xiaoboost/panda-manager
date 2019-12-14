import styles from './index.less';
import React from 'react';

import { coverPath } from '../utils';
import { ListCoverProps } from 'renderer/modules';

export default function ListCover({ id, onClick }: ListCoverProps) {
    return <div onClick={onClick}>
        <img src={coverPath(id)} />
    </div>;
}
