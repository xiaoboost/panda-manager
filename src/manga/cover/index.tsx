import React from 'react';

import { cover } from '../utils/path';

interface Props {
    id: number;
}

export function Render(props: Props) {
    return <img src={cover(props.id)} height='200' />;
}
