import { Process, FileData } from './types';

export class PackageProcess implements Process {
  static type = 'package' as const;
  // ..
}
