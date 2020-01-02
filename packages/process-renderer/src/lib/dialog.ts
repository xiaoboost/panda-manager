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
export function selectDirectory() {
    const win = remote.getCurrentWindow();

    /**
     * 这里这么写是为了保证本函数的 then 触发时一定有选择路径
     * 如果直接返回 remote.dialog.showOpenDialog().then 的话，不管有没有选中都一定会返回
     */
    return new Promise<string>((resolve) => {
        remote.dialog.showOpenDialog(win, { properties: ['openDirectory'] }).then((paths) => {
            if (paths) {
                resolve(paths[0]);
            }
        });
    });
}
