import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { parse, sep } from 'path';
import { delay, isString } from 'lib/utils';

export interface MessageState {
    /** 当前正在压缩的漫画路径 */
    currentPath: string;
    /** 总的压缩任务进度 */
    jobProgress?: {
        total: number;
        current: number;
    };
    /** 当前漫画的压缩进度 */
    mangaProgress?: {
        total: number;
        current: number;
    };
}

export enum translationClass {
    enter = 'message-enter',
    enterActive = 'message-enter-active',
    enterTo = 'message-enter-to',
    leave = 'message-leave',
    leaveActive = 'message-leave-active',
    leaveTo = 'message-leave-to',
}

// 提示信息进入进出动画持续时长
const enterTime = 200;
const leaveTime = 200;
const enterAnimations = [translationClass.enter, translationClass.enterActive, translationClass.enterTo];
const leaveAnimations = [translationClass.leave, translationClass.leaveActive, translationClass.leaveTo];

// 设置动画
async function setMessageAnimeClass(dom: Element, clas: translationClass[], time: number) {
    dom.classList.add(clas[0]);

    await delay();

    dom.classList.replace(clas[0], clas[1]);

    await delay(time);

    dom.classList.replace(clas[1], clas[2]);

    await delay();

    dom.classList.remove(clas[2]);
}

export function createMessage() {
    const contentDiv = document.createElement('div');
    const warpperDiv = document.createElement('div');

    warpperDiv.appendChild(contentDiv);
    document.body.appendChild(warpperDiv);

    function update(content: string | MessageState) {
        const {
            currentPath,
            jobProgress,
            mangaProgress,
        }: MessageState = isString(content)
            ? { currentPath: content }
            : content;

        const { dir, base } = parse(currentPath);

        ReactDOM.render(
            <footer id='footer-message'>
                <span className='footer-message__path'>{dir}</span>
                <span className='footer-message__name'>{sep + base}</span>
                {
                    jobProgress &&
                        <span className='footer-message__progress'>
                            第 {jobProgress.current} 项，共 {jobProgress.total} 项
                        </span>
                }
                {
                    mangaProgress &&
                        <span className='footer-message__progress'>
                            第 {mangaProgress.current} 页，共 {mangaProgress.total} 页
                        </span>
                }
            </footer>,
            contentDiv,
        );
    }

    function show() {
        setMessageAnimeClass(warpperDiv, enterAnimations, enterTime);
    }

    function close() {
        return setMessageAnimeClass(warpperDiv, leaveAnimations, leaveTime);
    }

    function destroy() {
        const unmountResult = ReactDOM.unmountComponentAtNode(contentDiv);

        if (unmountResult && contentDiv.parentNode) {
            if (contentDiv.parentNode) {
                contentDiv.parentNode.removeChild(contentDiv);
            }
            if (warpperDiv.parentNode) {
                warpperDiv.parentNode.removeChild(warpperDiv);
            }
        }
    }

    show();

    return {
        update,
        close,
        destroy,
    };
}
