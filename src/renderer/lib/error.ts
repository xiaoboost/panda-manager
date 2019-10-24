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

/** 错误信息 */
export const ErrorMessage = {
    notExist: '文件夹不存在',
    noRepeatFolder: '不允许重复添加文件夹',
    canNotWrite: '无法写入文件',
    zipBroken: '压缩包损坏',
};

export function handleError(code: keyof typeof ErrorMessage, info?: string) {
    Message.error(
        info
            ? ErrorMessage[code]
            : `${ErrorMessage[code]}：\n ${info}`,
    );
}
