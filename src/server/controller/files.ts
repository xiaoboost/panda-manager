import * as Files from '../service/files';

import {
    EventData,
    EventContext,
} from 'src/utils/typings';

export async function search({ data }: EventData) {
    return (await Files.search()).map(({ data }) => ({ ...data }));
}

export async function remove() {
    // ..
}

export async function get() {
    // ..
}

export async function open({ data }: EventData<{ id: number }>, context: EventContext) {
    await Files.open(data.id, context.onProgress);
}
