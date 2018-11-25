import './component.styl';

import * as React from 'react';

import { ValidationRule } from 'antd/lib/form';
import { stringifyClass, remove } from 'lib/utils';
import { Row, Col, Input, Tooltip, Tag, Icon } from 'antd';

export interface FormData {
    name: string;
    alias: string[];
}

export interface Props extends Partial<FormData> {
    nameRules?: ValidationRule[];
}

export interface State {
    alias: string[];
    nameInput: string;
    tagInput: string;
    tagInputVisible: boolean;
    nameInputErrorMessage: string;
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
        nameInput: this.props.name || '',
        alias: (this.props.alias && this.props.alias.slice() || []),
        tagInput: '',
        tagInputVisible: false,
        nameInputErrorMessage: '',
    };

    // tag input 元素
    private tagInputEle!: Input;
    // 名称输入规则集合
    private nameRules: ValidationRule[] = TagEditForm.baseNameRule.concat(this.props.nameRules || []);

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

    // 验证
    validate() {
        const { state, nameRules } = this;
        const { nameInput } = state;

        for (const rule of nameRules) {
            state.nameInputErrorMessage = '';

            if (rule.required && !nameInput) {
                state.nameInputErrorMessage = (rule.message || '') as string;
                break;
            }

            if (rule.validator) {
                let err: Error | undefined;

                rule.validator(rule, nameInput, (e: Error) => err = e);

                if (err) {
                    state.nameInputErrorMessage = err.message;
                    break;
                }
            }
        }

        this.setState({
            nameInputErrorMessage: state.nameInputErrorMessage,
        });

        return Boolean(state.nameInputErrorMessage);
    }

    // 取出当前数据
    getData(): FormData {
        return {
            name: this.state.nameInput,
            alias: this.state.alias.slice(),
        };
    }

    render() {
        const {
            nameInput,
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
                    <Col span={19} className={stringifyClass([
                        'ant-form-item-control',
                        { 'has-error': !!nameInputErrorMessage },
                    ])}>
                        <Input
                            value={nameInput}
                            placeholder='请输入'
                            onChange={inputNameChange}
                        />
                        {nameInputErrorMessage && <div className='ant-form-explain'>{nameInputErrorMessage}</div>}
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
