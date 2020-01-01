import { Modal } from 'antd';
import { remote } from 'electron';
import { ModalFuncProps } from 'antd/es/modal';

type WarnOptions = Omit<ModalFuncProps, 'okType' | 'onOk' | 'onCancel' | 'keyboard'>;

export function warnDialog(props: WarnOptions) {
    return new Promise<void>((resolve, reject) => {
        Modal.confirm({
            okText: '确定',
            cancelText: '取消',
            okType: 'danger',
            ...props,
            style: {
                top: '30%',
                ...props.style,
            },
            keyboard: true,
            onOk: () => resolve(),
            onCancel: () => reject(),
        });
    });
}

/** 选择文件夹 */
export function selectDirectory(): Promise<string | undefined> {
    const win = remote.getCurrentWindow();

    return remote.dialog.showOpenDialog(win, { properties: ['openDirectory'] }).then((paths) => {
        return paths ? paths[0] : undefined;
    });
}
