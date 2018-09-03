import './component.styl';

import * as React from 'react';

import { delay } from 'lib/utils';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

React.createRef()

interface TagProps {
    /** 标签是否可以关闭 */
    closable?: boolean;
    /** 标签内容 */
    tags: string[];
    /** 标签内容改变时的回调 */
    onClose?: (i: number) => void;
}

export default class Tag extends React.Component<TagProps> {
    static defaultProps: Partial<TagProps> = {
        closable: false,
    };

    /** 动画持续时间 */
    duration = 300;
    /** class 名称前缀 */
    prefixCls = 'fm-tag';

    async beforeExited(el: HTMLElement) {
        el.style.width = `${el.getBoundingClientRect().width}px`;

        await delay();
        el.style.width = '0px';
    }

    async beforeEnter(el: HTMLElement) {
        el.style.opacity = '0';
        el.style.width = 'auto';

        const width = el.getBoundingClientRect().width;

        el.style.opacity = '';
        el.style.width = '0px';

        await delay();

        el.style.width = `${width}px`;
        el.style.boxSizing = 'content-box';
        el.className = el.className.replace(/ [a-z-]+-enter/, '');
    }

    clearStyle(el: HTMLElement) {
        el.removeAttribute('style');
    }

    render() {
        const { children, closable, onClose } = this.props;

        return <TransitionGroup className={`${this.prefixCls}-list`}>
            {this.props.tags.map((tag, i) =>
                <CSSTransition
                    key={tag}
                    timeout={this.duration}
                    classNames={`${this.prefixCls}-fade`}
                    onEntered={this.clearStyle}
                    onEnter={this.beforeEnter}
                    onExit={this.beforeExited}>
                    <span className={this.prefixCls}>
                        {tag}
                        {closable &&
                            <i
                                className="fm-icon"
                                onClick={() => onClose && onClose(i)}>&#xe7fc;</i>}
                    </span>
                </CSSTransition>
            )}
            {children}
        </TransitionGroup>;
    }
}
