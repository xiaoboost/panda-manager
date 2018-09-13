import Message from 'antd/lib/message';

export function handleError(error: Error, info?: string) {
    const text = info ? info : error.message;
    Message.error(text);
    throw error;
}
