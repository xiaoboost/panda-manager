import './component.styl';
import { createMessage, MessageState } from './component';

export * from './component';

let progressBar: ReturnType<typeof createMessage> | undefined = void 0;
let progressState: MessageState = { currentPath: '' };

export function setProgress(data: Partial<MessageState>) {
    const state = progressState = {
        ...progressState,
        ...data,
    };

    if (!progressBar) {
        progressBar = createMessage();
    }

    progressBar.update(state);
}

export async function closeProgress() {
    if (!progressBar) {
        return;
    }

    await progressBar.close();

    progressBar.destroy();

    progressBar = void 0;
    progressState = { currentPath: '' };
}
