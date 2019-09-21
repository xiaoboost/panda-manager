import React from 'react';
import ReactDOM from 'react-dom';

import { Form, Tag, Icon, Input, Modal, Tooltip } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import { TagData } from 'renderer/lib/tag';

import {
    useRef,
    useForm,
    useList,
    useState,
    useEffect,
    useCallback,
    useListCallback,
} from 'renderer/use';

export enum FormType {
    Tag,
    TagGroup,
}

interface FormProps extends Partial<TagData> {
    type: FormType;
}

/** 别名显示的最大长度 */
const longLimit = 12;

function useAliasInput() {
    const [input, setInput] = useState('');
    const [visible, setVisible] = useState(false);
    const ref = useRef<Input>(null);
    const show = useCallback(() => setVisible(true), []);
    const hidden = useCallback(() => setVisible(false), []);

    useEffect(() => {
        if (visible && ref.current) {
            ref.current.focus();
        }
    }, [visible]);

    return { visible, input, ref, setInput, show, hidden };
}

function TagEditForm(props: Required<FormProps>) {
    /** 表单标签名称 */
    const nameLabel = props.type === FormType.TagGroup ? '标签集名称' : '标签名称';
    /** 别名输入框状态 */
    const aliasInput = useAliasInput();

    // 别名列表部分
    const [alias, { filter, push }] = useList(props.alias);
    const tagsRemoveCb = useListCallback(alias, (origin) => () => {
        filter((val) => val !== origin);
    });

    const { getFields, resetFields, setFormItem, input } = useForm({
        name: props.name,
    });

    return (
        <Form layout='vertical'>
            <Form.Item label={nameLabel} {...setFormItem('name')}>
                <Input placeholder={`请输入${nameLabel}`} {...input('name', {
                    rules: {
                        trigger: 'onChange',
                        validator: (rule, value: string, cb) => {
                            debugger;
                            if (value.length > 4) {
                                cb('超过长度');
                            }
                        },
                    },
                })} />
            </Form.Item>
            {/* <Form.Item label="别名">
                {alias.map((tag, i) => {
                    const isLongTag = tag.length > longLimit;
                    const tagElem = (
                        <Tag closable key={tag} afterClose={tagsRemoveCb[i]}>
                            {isLongTag ? `${tag.slice(0, longLimit)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {aliasInput.visible
                    ? <Input
                        ref={aliasInput.ref}
                        type='text'
                        size='small'
                        style={{ width: 100 }}
                        value={aliasInput.input}
                        className='tag-input'
                        onChange={({ target }) => aliasInput.setInput(target.value)}
                        onBlur={aliasInput.hidden}
                    />
                    // onPressEnter={this.tagInputConfirm}
                    : <Tag
                        onClick={aliasInput.show}
                        style={{
                            background: '#fff',
                            borderStyle: 'dashed',
                            paddingTop: '1px',
                            paddingBottom: '1px',
                        }}
                    >
                        <Icon type='plus' /> 添加别名
                    </Tag>
                }
            </Form.Item> */}
        </Form>
    );
}

export function editTag(formData: FormProps) {
    return new Promise<FormData>((resolve) => {
        // 表格组件引用
        // let formEle: TagEditForm;

        const isCreate = !formData.id || formData.id <= 0;
        const title = (
            (isCreate ? '创建' : '编辑') +
            (formData.type === FormType.Tag ? '标签' : '标签集')
        )

        const div = document.createElement('div');
        const baseConfig: ModalProps = {
            title,
            width: 400,
            visible: true,
            maskClosable: false,
            onCancel: close,
            afterClose: destroy,
            okText: isCreate ? '创建' : '保存',
            cancelText: '取消',
            style: {
                top: '25%',
            },
            getContainer: () => div,
            onOk: () => {
                // if (formEle && formEle.validate()) {
                //     resolve(formEle.getData());
                //     close();
                // }
            },
        };

        /** 销毁当前对话框 */
        function destroy() {
            const unmountResult = ReactDOM.unmountComponentAtNode(div);

            if (unmountResult && div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }

        /** 关闭对话框 */
        function close() {
            render({
                ...baseConfig,
                visible: false,
            });
        }

        /** 渲染对话框 */
        function render(props: ModalProps) {
            ReactDOM.render(
                <Modal {...props}>
                    <TagEditForm
                        type={formData.type}
                        id={formData.id || 0}
                        name={formData.name || ''}
                        alias={formData.alias || []}
                    />
                </Modal>,
                div,
            );
        }

        document.body.appendChild(div);

        render(baseConfig);
    });
}
