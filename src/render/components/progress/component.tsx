import './component.styl';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { parse } from 'path';
import { delay } from 'lib/utils';

interface State {
    message: string;
    progress?: {
        total: number;
        finish: number;
    };
}

class Notice extends React.Component<{}, State> {
    state: State = {
        message: '',
    };

    render() {
        const { message, progress } = this.state;
        const { dir, base } = parse(message);

        return <footer id='footer-message'>
            <span className='footer-message__path'>{dir}</span>
            <span className='footer-message__name'>\{base}</span>
            {progress && <span className='footer-message__progress'>{`(${progress.finish} / ${progress.total})`}</span>}
        </footer>;
    }
}

enum translationClass {
    enter = 'message-enter',
    enterActive = 'message-enter-active',
    enterTo = 'message-enter-to',
    leave = 'message-leave',
    leaveActive = 'message-leave-active',
    leaveTo = 'message-leave-to',
}

const enterTime = 200;
const leaveTime = 200;

async function setMessageAnimeClass(dom: Element, clas: translationClass[], time: number) {
    dom.classList.add(clas[0]);

    await delay();

    dom.classList.replace(clas[0], clas[1]);

    await delay(time);

    dom.classList.replace(clas[1], clas[2]);

    await delay();

    dom.classList.remove(clas[2]);
}

export default class ProgressMessage {
    comp: Notice;

    private _isMount = false;
    private container: Element;

    constructor() {
        this.container = document.createElement('div');
        this.comp = ReactDOM.render(
            React.createElement(Notice),
            this.container,
        );
    }

    async mount() {
        this.container.setAttribute('style', 'opacity: 0;');

        document.body.appendChild(this.container);

        await delay();

        this.container.removeAttribute('style');

        await setMessageAnimeClass(
            this.container,
            [
                translationClass.enter,
                translationClass.enterActive,
                translationClass.enterTo,
            ],
            enterTime,
        );

        this._isMount = true;
    }

    async unmount() {
        await setMessageAnimeClass(
            this.container,
            [
                translationClass.leave,
                translationClass.leaveActive,
                translationClass.leaveTo,
            ],
            leaveTime,
        );

        document.body.removeChild(this.container);
        this._isMount = false;
    }

    async destroy() {
        if (this._isMount) {
            await this.unmount();
        }

        ReactDOM.unmountComponentAtNode(this.container);
    }

    setProgress(state: State) {
        this.comp.setState(state);
    }
}
