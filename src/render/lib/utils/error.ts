import 'antd/lib/message/style';
import Message from 'antd/lib/message';

/** 错误码 */
const errorCode = {
    // 100 ~ 199 文件与文件夹
    100: '文件夹不存在',
    101: '不允许重复添加文件夹',
    102: '只允许刷新已经添加的文件夹',
    103: '此漫画已经被删除，它将会被移出列表',

    // 200 ~ 299
    200: '压缩包损坏',
};

export function handleError(code: keyof typeof errorCode, info?: string) {
    Message.error(
        info
            ? errorCode[code]
            : `${errorCode[code]}：\n ${info}`
    );
}
