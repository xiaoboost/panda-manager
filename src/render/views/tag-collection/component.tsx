import './component.styl';

import * as React from 'react';

import { Link } from 'react-router-dom';
import { Icon, Button, Card, Col } from 'antd';
import { Reactive, State, StoreProps } from 'store';

import TagEditer from 'components/tags-edit/component';

// type EditData = Writeable<Pick<TagEditer['props'], 'name' | 'alias' | 'isGroup' | 'isCreate'>>;

@Reactive
export default class TagCollection extends React.Component<StoreProps> {
    editer!: TagEditer;

    addTagGroup = async () => {
        const result = await this.editer.setModal();

        console.log(result);
    }

    render() {
        const { tagsGroups } = this.props.store;
        const saveEditerModal = (editer: TagEditer) => this.editer = editer;

        return <main id='tag-collection'>
            <header className='page-header tag-collection-header'>
                <Link to='/'>
                    <Icon type='arrow-left' theme='outlined' />
                </Link>
                <span className='page-title'>Tag 聚合</span>
            </header>
            <article className='tag-collection-article'>
                <div>
                    {Object.values(tagsGroups).map((item) =>
                        <Card
                            type='inner'
                            title={item}
                            key={item.id}
                            extra={<a href='#'>More</a>}
                        >
                            测试
                        </Card>,
                    )}
                </div>
                <Button onClick={this.addTagGroup}><Icon type='plus-circle' />添加标签集</Button>
            </article>

            <TagEditer ref={saveEditerModal} />
        </main>;
    }
}
