import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import { default as TagEditForm, Props as TagEditerProps } from './component';

interface DialogProps {
    modalProps: ModalProps;
    formProps: TagEditerProps;
}

const ConfirmDialog = (config: DialogProps) => {
    let form: TagEditForm;

    const { modalProps, formProps } = config;
    const okCallback = modalProps.onOk;

    modalProps.onOk = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (form && form.validate()) {
            okCallback && okCallback(e);
        }
    };

    return (
        <Modal {...modalProps}>
            <TagEditForm
                {...formProps}
                ref={(el: TagEditForm) => form = el}
            />
        </Modal>
    );
};

export function editTag(title: string, data: Partial<TagEditerProps> = { name: '' }) {
    return new Promise((resolve) => {
        const div = document.createElement('div');
        const baseConfig: ModalProps = {
            title,
            width: 400,
            visible: true,
            onCancel: close,
            afterClose: destroy,
            getContainer: () => div,
        };

        function destroy() {
            const unmountResult = ReactDOM.unmountComponentAtNode(div);

            if (unmountResult && div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }

        function close() {
            render({
                ...baseConfig,
                visible: false,
            });
        }

        function render(props: ModalProps) {
            ReactDOM.render(
                <ConfirmDialog
                    modalProps={props}
                    formProps={data}
                />,
                div,
            );
        }

        document.body.appendChild(div);

        render(baseConfig);
    });
}
