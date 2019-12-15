import React from 'react';

import { coverPath } from '../utils';
import { ListCoverProps } from 'renderer/modules';

export default function ListCover({ id }: ListCoverProps) {
    return <img src={coverPath(id)} height='200' />;
}
