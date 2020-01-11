import './index.less';

import React from 'react';

import { useParams } from 'react-router';
import { Database } from '../../store';
import { getExtension } from '@panda/extension-controller';

export default function ItemDetail() {
    const params = useParams<{ id: string }>();
    const [file] = Database.Objects.where((data) => data.id === +params.id).limit(1).toQuery();

    if (!file) {
        return <div>项目不存在</div>;
    }

    const ex = getExtension(file.data.extension);

    if (!ex?.DetailPage) {
        return <div>插件不存在</div>;
    }

    return <ex.DetailPage {...file.data} />;
}
