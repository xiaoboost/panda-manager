import * as React from 'react';

import { isString } from 'lib/utils';
import { Select, Tag, Icon } from 'antd';
import { OptionProps, OptGroupProps } from 'antd/lib/select';
import { default as store, Manga, Computed, State } from 'store';

const { Option, OptGroup } = Select;
type OptComponent = React.ReactElement<OptionProps | OptGroupProps>;

interface State {
    showInput: boolean;
}

interface Props {
    onInput(tag: number): void;
}

export default class AddTag extends React.Component<Props, State> {
    state: State = {
        showInput: false,
    };

    // tag input 元素
    private tagSelect!: Select;

    showInput() {
        this.setState({ showInput: true }, () => {
            debugger;
            // TODO: 得到焦点，展开下拉列表
            this.tagSelect.focus();
        });
    }

    hiddenInput = () => {

    }

    selectInput = (val: string) => {
        const [group, tag] = val.split(':').map(Number);
    }

    render() {
        const { showInput } = this.state;
        const { tagGroups } = store;
        const saveSelect = (select: any) => this.tagSelect = select;
        const addButton = (
            <Tag
                onClick={() => this.showInput()}
                style={{ background: '#fff', borderStyle: 'dashed' }}
            >
                <Icon type='plus' /> 添加标签
            </Tag>
        );
        const inputSelect = (
            <Select
                ref={saveSelect}
                showSearch
                size='small'
                style={{ width: 150 }}
                placeholder='请选择标签'
                optionFilterProp='children'
                onBlur={this.hiddenInput}
                onChange={this.selectInput}
            >
                {tagGroups.map((group) =>
                    <OptGroup label={group.name} key={group.id}>
                        {group.tags.map((tag) =>
                            <Option
                                value={`${group.id}:${tag.id}`}
                                key={String(tag.id)}>
                                {tag.name}
                            </Option>,
                        )}
                    </OptGroup>,
                )}
            </Select>
        );

        return showInput ? inputSelect : addButton;
    }
}
