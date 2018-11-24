import './component.styl';

import * as React from 'react';

import { ValidationRule } from 'antd/lib/form';
import { stringifyClass, remove } from 'lib/utils';
import { Row, Col, Input, Tooltip, Tag, Icon } from 'antd';

export interface Props {
    name: string;
    alias?: string[];
    nameRules?: ValidationRule[];
}

export interface State {
    alias: string[];
    nameInput: string;
    tagInput: string;
    nameInputError: boolean;
    nameInputErrorMessage: string;
    tagInputVisible: boolean;
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;

export default class TagEditForm extends React.Component<Props, State> {
    static baseNameRule: ValidationRule[] = [{
        required: true,
        message: '请输入名称',
    }];

    static tagLengthLimit = 12;

    // 组件状态
    state: State = {
        alias: this.props.alias || [],
        nameInput: this.props.name,
        tagInput: '',
        nameInputError: false,
        tagInputVisible: false,
        nameInputErrorMessage: '',
    };

    // tag input 元素
    private tagInputEle!: Input;

    /** 新标签输入确认 */
    private tagInputConfirm = () => {
        const { tagInput, alias } = this.state;

        if (tagInput && alias.indexOf(tagInput) === -1) {
            this.setState({
                alias: alias.concat([tagInput]),
            });
        }

        this.setState({
            tagInput: '',
            tagInputVisible: false,
        });
    }

    // 设置表单数据
    // setData({ name, alias, nameRules = [] }: PartPartial<FormData, 'nameRules'>) {
    //     this.setState({
    //         alias,
    //         nameInput: name,
    //         nameRules: TagEditForm.baseNameRule.concat(nameRules),
    //         nameInputError: false,
    //         tagInputVisible: false,
    //         nameInputErrorMessage: '',
    //     });
    // }

    // 验证
    validate() {
        return true;
    }

    // 取出当前数据
    getData() {
        return {
            name: this.state.nameInput,
            alias: this.state.alias.slice(),
        };
    }

    render() {
        const {
            nameInput,
            nameInputError,
            alias: tags,
            tagInput,
            tagInputVisible,
            nameInputErrorMessage,
        } = this.state;

        const saveInput = (input: Input) => this.tagInputEle = input;
        const showInput = () => this.setState({ tagInputVisible: true }, () => this.tagInputEle.focus());
        const inputTagChange = (ev: InputEvent) => this.setState({ tagInput: ev.target.value });
        const inputNameChange = (ev: InputEvent) => this.setState({ nameInput: ev.target.value }, () => this.validate());

        return (
            <div id='tag-edit-form' className='ant-form'>
                <Row gutter={6} type='flex' className='ant-form-item'>
                    <Col span={5} className='ant-form-item-label'>
                        <label className='ant-form-item-required'>名称</label>
                    </Col>
                    <Col span={19} className={stringifyClass(['ant-form-item-control', { 'has-error': nameInputError }])}>
                        <Input
                            value={nameInput}
                            placeholder='请输入'
                            onChange={inputNameChange}
                        />
                        {nameInputError && <div className='ant-form-explain'>{nameInputErrorMessage}</div>}
                    </Col>
                </Row>
                <Row gutter={6} type='flex' className='ant-form-item'>
                    <Col span={5} className='ant-form-item-label'>
                        <label>
                            <span>别名</span>
                            <Tooltip title='用于兼容不同情况'>
                                <Icon type='question-circle' style={{ marginLeft: '4px', fontSize: '80%' }} />
                            </Tooltip>
                        </label>
                    </Col>
                    <Col span={19} className='ant-form-item-control'>
                        {tags.map((tag) => {
                            const longLimit = TagEditForm.tagLengthLimit;
                            const isLongTag = tag.length > longLimit;
                            const tagElem = (
                                <Tag closable key={tag} afterClose={() => remove(tags, tag)}>
                                    {isLongTag ? `${tag.slice(0, longLimit)}...` : tag}
                                </Tag>
                            );
                            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                        })}
                        {tagInputVisible
                            ? <Input
                                ref={saveInput}
                                type='text'
                                size='small'
                                style={{ width: 78 }}
                                value={tagInput}
                                className='tag-input'
                                onChange={inputTagChange}
                                onBlur={this.tagInputConfirm}
                                onPressEnter={this.tagInputConfirm}
                            />
                            : <Tag
                                onClick={showInput}
                                style={{ background: '#fff', borderStyle: 'dashed' }}
                            >
                                <Icon type='plus' /> 新别名
                            </Tag>
                        }
                    </Col>
                </Row>
            </div>
        );
    }
}
