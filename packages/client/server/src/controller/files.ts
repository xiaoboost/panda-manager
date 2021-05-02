import * as Files from '../service/files';

import { EventData } from '@panda/shared';

export const ready = Promise.resolve();

export async function remove() {
  // ..
}

export async function get({ data }: EventData) {
  // ..
}

export async function open({ data }: EventData<{ id: number }>) {
  // ..
}
