import Message from 'antd/lib/message';

export function handleError(error: Error, info?: string) {
    const text = info
        ? process.env.NODE_ENV === 'development'
            ? `${info}\n${error.message}`
            : info
        : error.message;

    Message.error(text);
    throw error;
}
