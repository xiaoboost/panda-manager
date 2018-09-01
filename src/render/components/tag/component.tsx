import './component.styl';

import * as React from 'react';
import { Transition } from 'react-transition-group';

import { omit, stringifyClass } from '../../lib/utils';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
    /** class 前缀 */
    prefixCls?: string;
    /** 标签是否可以关闭 */
    closable?: boolean;
    /** 关闭时的回调 */
    onClose?: Function;
    /** 动画关闭后的回调 */
    afterClose?: Function;
}

interface TagState {
    closing: boolean;
    closed: boolean;
}

export default class Tag extends React.Component<TagProps, TagState> {
    static defaultProps = {
        prefixCls: 'fm-tag',
        closable: false,
    };

    state = {
        closing: false,
        closed: false,
    };

    handleIconClick = (e: React.MouseEvent<HTMLElement>) => {
        const onClose = this.props.onClose;
        if (onClose) {
            onClose(e);
        }
    }

    render() {
        const { prefixCls, className, style, children, closable, ...otherProps } = this.props;
        const divProps = omit(otherProps, ['onClose', 'afterClose']);

        return <span className={stringifyClass([prefixCls, className])} {...divProps}>
            {children}
            {closable ?
                <i className="fm-icon" onClick={this.handleIconClick}>&#xe7fc;</i>
                : ''
            }
        </span>;

        // return <Transition
        //     appear
        //     mountOnEnter
        //     unmountOnExit
        //     timeout={300}>
        //     <span className={`${prefixCls} ${className}`} {...divProps}>
        //         {children}
        //         {closable ?
        //             <i className="fm-icon" onClick={this.handleIconClick}>&#xe7fc;</i>
        //             : ''
        //         }
        //     </span>
        // </Transition>;
    }
}
