import { Watcher } from '@xiao-ai/utils';
import { broadcast, BroadcastName } from '@panda/fetch/client';

/**
 * 当前正在读取的项目名称
 *   - 为空时表示未读取项目
 */
export const readingStatus = new Watcher('');

readingStatus.observe((val) => {
  broadcast(BroadcastName.ReadingStatusChange, val);
});
