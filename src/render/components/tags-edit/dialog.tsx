import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import {
    default as TagEditForm,
    Props,
    FormData,
} from './component';

export function editTag(title: string, formData: Props = {}) {
    return new Promise<FormData>((resolve) => {
        // 表格组件引用
        let formEle: TagEditForm;

        const div = document.createElement('div');
        const baseConfig: ModalProps = {
            title,
            width: 400,
            visible: true,
            maskClosable: false,
            onCancel: close,
            afterClose: destroy,
            okText: '确定',
            cancelText: '取消',
            getContainer: () => div,
            onOk: () => {
                if (formEle && formEle.validate()) {
                    resolve(formEle.getData());
                    close();
                }
            },
        };

        /** 销毁当前对话框 */
        function destroy() {
            const unmountResult = ReactDOM.unmountComponentAtNode(div);

            if (unmountResult && div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }

        /** 关闭对话框 */
        function close() {
            render({
                ...baseConfig,
                visible: false,
            });
        }

        /** 渲染对话框 */
        function render(props: ModalProps) {
            ReactDOM.render(
                <Modal {...props}>
                    <TagEditForm
                        {...formData}
                        ref={(el: TagEditForm) => formEle = el}
                    />
                </Modal>,
                div,
            );
        }

        document.body.appendChild(div);

        render(baseConfig);
    });
}
