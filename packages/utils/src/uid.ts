/** 上次用于记录的时间戳 */
let lastTime = new Date().getTime();
/** 相同时间戳的下表 */
let lastIndex = 0;

/** 生成唯一编号 */
export function uid() {
    const now = new Date().getTime();

    if (now === lastTime) {
        lastIndex++;
        return lastTime * 100 + lastIndex;
    }
    else {
        lastIndex = 0;
        lastTime = now;
        return lastTime * 100;
    }
}
