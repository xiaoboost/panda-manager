import './component.styl';
import 'antd/lib/icon/style';

import * as React from 'react';
import Icon from 'antd/lib/icon';
import { Link } from 'react-router-dom';

export default class ItemDetail extends React.Component {
    render() {
        return <main id='main-setting'>
            <header className='page-header setting-header'>
                <Link to={'/'}>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>设置</span>
            </header>
            <article className='setting-article'>
                <section className='settings-section'>
                    <header className='settings-title'>文件夹</header>
                    <article className='settings-card'>
                        <div className='settings-box'>
                            <span className='settings-box__name'>包括的文件夹</span>
                        </div>
                    </article>
                </section>
            </article>
        </main>;
    }
}
