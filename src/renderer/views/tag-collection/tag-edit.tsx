import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { Form, Tag, Icon, Input, Modal, Tooltip, message } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import { TagData } from 'renderer/lib/tag';

import {
    useRef,
    useForm,
    useEffect,
    useReactive,
    useCallback,
    useListCallback,
} from 'renderer/use';

export enum FormType {
    Tag,
    TagGroup,
}

/** 别名显示的最大长度 */
const longLimit = 10;

interface AliasProps {
    defaultValue: string[];
    onChange(alias: string[]): void;
}

/** 别名列表 */
function AliasList({ defaultValue, onChange }: AliasProps) {
    /** Input 组件引用 */
    const inputRef = useRef<Input>(null);
    /** 当前组件状态 */
    const state = useReactive({
        inputVisible: false,
        inputName: '',
        tags: defaultValue,
    });

    const tagsRemoveCb = useListCallback(defaultValue, (origin) => () => {
        state.tags = state.tags.filter((item) => item !== origin);
    });

    useEffect(() => {
        if (state.inputVisible && inputRef.current) {
            inputRef.current.focus();
        }
    }, [state.inputVisible]);

    const inputConfirm = useCallback(() => {
        const val = state.inputName;

        // 重复
        if (state.tags.includes(val)) {
            state.inputName = '';
            message.error('别名重复');
            return;
        }

        state.inputName = '';
        state.tags = state.tags.concat([val]);
        onChange(state.tags);
    }, []);

    const showInput = useCallback(() => (state.inputVisible = true), []);
    const hiddenInput = useCallback(() => {
        inputConfirm();
        state.inputVisible = false;
    }, []);
    const updateInput = useCallback(({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
        state.inputName = currentTarget.value;
    }, []);

    return (
        <>
            {state.tags.map((tag, i) => {
                const isLongTag = tag.length > longLimit;
                const tagElem = (
                    <Tag closable key={tag} onClose={tagsRemoveCb[i]}>
                        {isLongTag ? `${tag.slice(0, longLimit)}...` : tag}
                    </Tag>
                );
                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
            })}
            {state.inputVisible
                ? <Input
                    ref={inputRef}
                    type='text'
                    size='small'
                    style={{ width: 100 }}
                    value={state.inputName}
                    className='tag-input'
                    onInput={updateInput}
                    onPressEnter={inputConfirm}
                    onBlur={hiddenInput}
                />
                : <Tag
                    onClick={showInput}
                    style={{
                        background: '#fff',
                        borderStyle: 'dashed',
                        paddingTop: '1px',
                        paddingBottom: '1px',
                    }}
                >
                    <Icon type='plus' /> 添加别名
                </Tag>}
        </>
    );
}

interface TagEditDialogProps {
    data: TagData;
    type: FormType;
    destroy?: ModalProps['afterClose'];
    getContainer?: ModalProps['getContainer'];
    onConfirm: (data: Omit<TagData, 'id'>) => void;
}

/** 标签表单组件 */
export default function TagEditDialog({ data, type, destroy, getContainer, onConfirm }: TagEditDialogProps) {
    const isCreate = !data.id || data.id <= 0;
    const label = type === FormType.Tag ? '标签' : '标签集';
    const method = isCreate ? '创建' : '编辑';

    const title = `${method}${label}`;
    const nameLabel = `${label}名称`;

    const [visible, setVisible] = useState(true);
    const { getFields, validateFields, formInputBinding, setFormItem, input } = useForm({
        name: data.name,
        comment: data.comment,
        alias: data.alias,
    });

    const aliasList = formInputBinding<AliasProps, 'onChange'>('onChange', (val: string[]) => val);

    const closeDialog = useCallback(() => setVisible(false), []);

    return (
        <Modal
            title={title}
            width={400}
            visible={visible}
            maskClosable={false}
            onCancel={closeDialog}
            afterClose={destroy}
            getContainer={getContainer}
            okText={isCreate ? '创建' : '保存'}
            cancelText='取消'
            style={{
                top: '20%',
            }}
            onOk={() => {
                validateFields().then((result) => {
                    if (result) {
                        onConfirm(getFields());
                        closeDialog();
                    }
                });
            }}
        >
            <Form labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} layout='horizontal'>
                <Form.Item label='名称' {...setFormItem('name')}>
                    <Input placeholder={`请输入${nameLabel}`} {...input('name', {
                        rules: [
                            {
                                trigger: 'onChange',
                                required: true,
                                message: `${nameLabel}不能为空`,
                            },
                        ],
                    })} />
                </Form.Item>
                <Form.Item label='注释' {...setFormItem('comment')}>
                    <Input {...input('comment')} />
                </Form.Item>
                <Form.Item label='别名' {...setFormItem('alias')}>
                    <AliasList {...aliasList('alias')} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

interface EditTag {
    type: FormType;
    data?: Partial<TagData>;
}

/** 修改标签 */
export function editTagByModal({ type, data }: EditTag) {
    return new Promise<Omit<TagData, 'id'>>((resolve) => {
        const container = document.createElement('div');

        // 标签数据初始化
        const initTag: TagData = {
            id: 0,
            name: '',
            comment: '',
            alias: [],
            ...data,
        };

        /** 销毁当前对话框 */
        function destroy() {
            const unmountResult = ReactDOM.unmountComponentAtNode(container);

            if (unmountResult && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }

        /** 渲染对话框 */
        function render() {
            ReactDOM.render(
                <TagEditDialog
                    data={initTag}
                    type={type}
                    destroy={destroy}
                    getContainer={() => container}
                    onConfirm={resolve}
                />,
                container,
            );
        }

        document.body.appendChild(container);

        render();
    });
}
