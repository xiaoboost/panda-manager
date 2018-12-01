import './component.styl';
import { createMessage, MessageState } from './component';

export * from './component';

let progressBar: ReturnType<typeof createMessage> | undefined = void 0;

export function setProgress(data: MessageState) {
    if (!progressBar) {
        progressBar = createMessage();
    }

    progressBar.update(data);
}

export async function closeProgress() {
    if (!progressBar) {
        return;
    }

    await progressBar.close();

    progressBar.destroy();
    progressBar = void 0;
}
