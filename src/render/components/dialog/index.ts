import './component.styl';

import * as React from 'react';
import { Modal } from 'antd';

export function confirmDialog(title: React.ReactNode, content: React.ReactNode) {
    return new Promise((resolve) => {
        const modal = Modal.confirm({
            title, content,
            cancelText: '取消',
            okText: '确认',
            className: 'app-warning-dialog',
            onOk: () => {
                resolve();
                modal.destroy();
            },
        });
    });
}
