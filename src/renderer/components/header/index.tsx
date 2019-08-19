import './index.styl';

import { default as React } from 'react';

import { remote } from 'electron';
import { stringifyClass } from 'renderer/lib/utils';
import { useIsFocus, useIsMaximize } from 'renderer/lib/use';

import Icon from 'antd/es/icon';

const Recover = () => (
    <i className="anticon app-title-bar__icon">
        <svg viewBox="64 64 1024 1024" version="1.1" fill="currentColor" aria-hidden="true" width="1em" height="1em">
            <path d="M890.41032533 75.09333333h-573.472768c-32.555008 0-59.04247467 26.279936-59.04247466 58.5728V255.91808H134.68194133c-32.56046933 0-59.04247467 26.279936-59.04247466 58.57826133v575.832064c0 32.29832533 26.48200533 58.57826133 59.04247466 58.57826134H708.149248c32.54954667 0 59.04247467-26.279936 59.04247467-58.57826134V768.07645867h123.21860266c32.555008 0 59.04247467-26.27447467 59.04247467-58.57826134v-575.832064c0-32.292864-26.48746667-58.5728-59.04247467-58.5728z m-188.82013866 808.72516267H141.24100267V321.00078933h560.349184V883.818496zM883.851264 702.99374933H767.19172267V314.49634133c0-32.29832533-26.492928-58.57826133-59.04247467-58.57826133H323.50208V140.17604267H883.851264V702.99374933z"></path>
        </svg>
    </i>
);

export default function Header() {
    const isFocus = useIsFocus();
    const isMaximize = useIsMaximize();
    const win = remote.getCurrentWindow();

    return (
        <header className={stringifyClass(['app-header',  {
            'app-header__focus': isFocus,
        }])}>
            <span>
                <i className='app-title-bar__icon'></i>
                <span className='app-title-bar__title'>Panda Manager</span>
            </span>
            <span>
                {/* 最小化 */}
                <Icon
                    type="minus"
                    className='app-title-bar__icon'
                    onClick={() => win.minimize()}
                />
                {isMaximize
                    /* 还原 */
                    ? <Recover />
                    /* 最大化 */
                    : <Icon
                        type="border"
                        className='app-title-bar__icon'
                        onClick={() => win.maximize()}
                    />}
                {/* 关闭 */}
                <Icon
                    type='close'
                    className='app-title-bar__icon icon-close'
                    onClick={() => win.close()}
                />
            </span>
        </header>
    );
}
