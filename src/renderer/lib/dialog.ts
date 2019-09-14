import { default as Modal, ModalFuncProps } from 'antd/es/modal'

type DeleteOptions = Omit<ModalFuncProps, 'okType' | 'onOk' | 'onCancel' | 'keyboard'>;

export function deleteConfirm(props: DeleteOptions) {
    return new Promise<void>((resolve, reject) => {
        Modal.confirm({
            okText: '确定',
            cancelText: '取消',
            ...props,
            style: {
                top: '30%',
                ...props.style,
            },
            keyboard: true,
            okType: 'danger',
            onOk: () => resolve(),
            onCancel: () => reject(),
        });
    });
}
