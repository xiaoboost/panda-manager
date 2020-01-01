import React from 'react';

import { coverPath } from '../utils';
import { ListCoverProps } from '@panda/extension-controller';

export function ListCover({ id }: ListCoverProps) {
    return <img src={coverPath(id)} height='200' />;
}
