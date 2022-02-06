import { Process, FileData, ChangeEvent } from './types';

import Glob from 'fast-glob';

type CopyOption = {
  from: string;
  to: string;
  ignore?: string[];
}[];

export interface CopyInput {
  name: string;
  type: 'copy';
  options: CopyOption;
}

export class CopyProcess implements Process {
  static type = 'copy' as const;

  private event: ChangeEvent[] = [];

  name: string;
  options: CopyOption;

  log = '';
  files: FileData[] = [];

  constructor(option: CopyInput) {
    this.name = option.name;
    this.options = option.options;
  }

  onChange() {
    // ..
  }

  build() {
    // ..
  }

  watch() {
    // ..
  }
}
