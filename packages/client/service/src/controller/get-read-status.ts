import { SyncService } from './types';
import { readingStatus } from '../store';

export const service: SyncService<void, string> = () => {
  return readingStatus.data;
};
