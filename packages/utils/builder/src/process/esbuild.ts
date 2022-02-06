import { Process, FileData } from './types';

export class EsbuildProcess implements Process {
  static type = 'esbuild' as const;
  // ..
}
