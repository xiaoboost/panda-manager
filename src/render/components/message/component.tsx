import './component.styl';

import * as React from 'react';
import { render } from 'react-dom';

interface Props {
    message?: string;
    progress?: {
        total: number;
        finish: number;
    };
}

function Notice({ message = '', progress }: Props = {}) {
    return <footer id='footer-message'>
        <span className='footer-message__main'>{message}</span>
        {progress && <span className='footer-message__progress'>({progress.finish} / {progress.total})</span>}
    </footer>;
}

export default class Message {
    comp: JSX.Element;
    dom: Element;

    constructor() {
        const div = document.createElement('div');

        this.comp = Notice();
        this.dom = render(this.comp, div) as Element;
    }

    mount() {

    }

    destroy() {

    }

    setMessage() {

    }
}
