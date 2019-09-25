import 'antd/lib/message/style';
import Message from 'antd/lib/message';

const prefix = '(panda-manager)';

/**
 * 控制台中输出`info`日志
 *  - 只有调试模式才有效
 */
export function log(text: string) {
    if (process.env.NODE_ENV === 'development') {
        console.log(`${prefix} ${text}.`);
    }
}

/**
 * 控制台中输出`warn`日志
 * @param {string} text 日志文本
 * @param {boolean} [isDebug] 该日志是否只在调试模式下有效
 */
export function warn(text: string, isDebug = false) {
    const context = `${prefix} ${text}.`;

    if (isDebug) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(context);
        }
    }
    else {
        console.warn(context);
    }
}

/** 错误码 */
const errorCode = {
    // 100 ~ 199 文件与文件夹
    100: '文件夹不存在',
    101: '不允许重复添加文件夹',
    102: '只允许刷新已经添加的文件夹',
    103: '此漫画已经被删除，它将会被移出列表',
    104: '无法写入文件',

    // 200 ~ 299
    200: '压缩包损坏',
};

export function handleError(code: keyof typeof errorCode, info?: string) {
    Message.error(
        info
            ? errorCode[code]
            : `${errorCode[code]}：\n ${info}`,
    );
}
