import * as React from 'react';
import { Input, Tag, Icon, Tooltip } from 'antd';

interface TagsListState {
    inputValue: string;
    inputVisible: boolean;
}

interface TagsListProps {
    tags: string[];
    onAdd(val: string): void;
    onRemove(id: string): void;
}

/** 标签列表组件 */
export default class TagsList extends React.Component<TagsListProps, TagsListState> {
    state: TagsListState = {
        inputValue: '',
        inputVisible: false,
    };

    input!: Input;

    handleInputConfirm = () => {
        const { inputValue } = this.state;
        const { tags, onAdd } = this.props;

        if (inputValue && tags.indexOf(inputValue) === -1) {
            onAdd(inputValue);
        }

        this.setState({
            inputVisible: false,
            inputValue: '',
        });
    }

    render() {
        const { tags, onRemove } = this.props;
        const { inputVisible, inputValue } = this.state;

        const saveInput = (input: Input) => this.input = input;
        const inputChange = (ev: React.ChangeEvent<HTMLInputElement>) => this.setState({ inputValue: ev.target.value });
        const showInput = () => this.setState({ inputVisible: true }, () => this.input.focus());

        return <div>
            {tags.map((tag) => {
                const longLimit = 16;
                const isLongTag = tag.length > longLimit;
                const tagElem = (
                  <Tag key={tag} afterClose={() => onRemove(tag)}>
                    {isLongTag ? `${tag.slice(0, longLimit)}...` : tag}
                  </Tag>
                );
                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
            })}
            {inputVisible && (
                <Input
                    ref={saveInput}
                    type='text'
                    size='small'
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={inputChange}
                    onBlur={this.handleInputConfirm}
                    onPressEnter={this.handleInputConfirm}
                />
            )}
            {!inputVisible && (
                <Tag
                    onClick={showInput}
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                >
                    <Icon type='plus' /> New Tag
                </Tag>
            )}
        </div>;
    }
}
