import './component.styl';

import * as React from 'react';

import { TagData } from 'store';
import { remove } from 'lib/utils';
import { Row, Col, Modal, Input, Icon, Tag, Tooltip } from 'antd';

type TagType = Omit<TagData, 'id'>;

interface State {
    tags: string[];
    tagInput: string;
    nameInput: string;
    isGroup?: boolean;
    isCreate?: boolean;
    modalVisible: boolean;
    inputVisible: boolean;
}

export default class TagEditer extends React.Component<{}, State> {
    state: State = {
        tags: [],
        tagInput: '',
        nameInput: '',
        modalVisible: false,
        inputVisible: false,
    };

    /** 新 tag 文本输入 */
    private tagInput!: Input;

    /** 内部 Promise 状态保存 */
    private _switch!: (val: TagType) => void;

    /** 新标签输入确认 */
    private tagInputConfirm = () => {
        const { tagInput, tags } = this.state;

        if (tagInput && tags.indexOf(tagInput) === -1) {
            this.setState({
                tags: tags.concat([tagInput]),
            });
        }

        this.setState({
            tagInput: '',
            inputVisible: false,
        });
    }

    private modalConfirm = () => {
        this._switch({
            name: this.state.nameInput,
            alias: this.state.tags.slice(),
        });

        this.setState({ modalVisible: false });
    }

    setModal({ name = '', alias = [] }: Partial<TagType> = {}) {
        return new Promise<TagType>((resolve) => {
            this.setState({
                tags: alias.slice(),
                tagInput: '',
                nameInput: name,
                modalVisible: true,
                inputVisible: false,
            });

            this._switch = resolve;
        });
    }

    render() {
        const { tags, nameInput, tagInput, modalVisible, inputVisible, isGroup, isCreate } = this.state;

        const tagText = `标签${isGroup ? '集' : ''}`;
        const title = `${isCreate ? '创建' : '编辑'}${tagText}`;

        const saveInput = (input: Input) => this.tagInput = input;
        const showInput = () => this.setState({ inputVisible: true }, () => this.tagInput.focus());
        const inputNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => this.setState({ nameInput: ev.target.value });
        const inputTagChange = (ev: React.ChangeEvent<HTMLInputElement>) => this.setState({ tagInput: ev.target.value });

        return <Modal
            visible={modalVisible}
            title={title}
            wrapClassName='tag-editer'
            width='420px'
            cancelText='取消'
            okText='保存'
            onOk={this.modalConfirm}
            onCancel={() => this.setState({ modalVisible: false })}
        >
            <Row gutter={6} type='flex'>
                <Col span={4}>名称</Col>
                <Col span={20}>
                    <Input
                        value={nameInput}
                        placeholder={`请输入${tagText}名称`}
                        onChange={inputNameChange}
                    />
                </Col>
            </Row>
            <Row gutter={6} type='flex'>
                <Col span={4}>
                    <span>别名</span>
                    <Tooltip title='用于兼容不同情况下的同一个标签'>
                        <Icon type='question-circle' style={{ marginLeft: '4px', fontSize: '80%' }} />
                    </Tooltip>
                </Col>
                <Col span={20}>
                    {tags.map((tag) => {
                        const longLimit = 12;
                        const isLongTag = tag.length > longLimit;
                        const tagElem = (
                            <Tag closable key={tag} afterClose={() => remove(tags, tag)}>
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
                            value={tagInput}
                            onChange={inputTagChange}
                            onBlur={this.tagInputConfirm}
                            onPressEnter={this.tagInputConfirm}
                        />
                    )}
                    {!inputVisible && (
                        <Tag
                            onClick={showInput}
                            style={{ background: '#fff', borderStyle: 'dashed' }}
                        >
                            <Icon type='plus' /> 新别名
                        </Tag>
                    )}
                </Col>
            </Row>
        </Modal>;
    }
}
