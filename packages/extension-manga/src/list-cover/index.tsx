import React from 'react';

import { coverPath } from '../utils';

export function ListCover({ id }: panda.ListCoverProps) {
    return <img src={coverPath(id)} height='200' />;
}
