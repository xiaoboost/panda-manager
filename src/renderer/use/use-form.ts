import { InputProps } from 'antd/es/input';
import { FormItemProps } from 'antd/es/form/FormItem';

import { useRef } from 'react';
import { useMap } from 'react-use';

import { isString, delay } from 'utils/shared';

import { default as Schema, Rules, RuleItem } from 'async-validator';

/** 表单验证规则选项扩展 */
interface FormRule<T extends string> extends RuleItem {
    trigger?: T | T[];
}

/** 表单输入属性包装 */
type PropsWarpper<P extends object, T extends string> = P & {
    rules?: FormRule<T>;
};


export default function useForm<T extends object>(initVal: T) {
    /** 初始化对象的键名数组 */
    type Keys = Array<keyof T>;

    /** 保存初始值 */
    const initState = useRef<T>(initVal);
    /** 当前表单状态 */
    const [state, setState] = useMap(initVal);

    /** 当前规则集合 */
    const fieldsRule: Rules = {};
    /** 当前表单验证状态 */
    const [status, setStatus] = useMap<Partial<Record<keyof T, FormItemProps>>>({});

    /** 表单验证器实例 */
    let schema: Schema | undefined = void 0;

    /** 初始化表单对应字段输入 */
    function resetFields(names: Keys = Object.keys(initState.current) as Keys) {
        // const oldState = { ...state };
        // setState.reset;
    }

    /** 校验表单对应字段 */
    async function validateFields(names: Keys = Object.keys(initState.current) as Keys) {
        if (!schema) {
            schema = new Schema(fieldsRule);
        }

        const values = names.reduce((ans, key) => (ans[key] = state[key], ans), {} as T);
        const result = await schema.validate(values, undefined, (errs) => {
            debugger;
            for (let err of errs) {
                setStatus.set(err.field as keyof T, {
                    help: err.message,
                    validateStatus: 'error',
                });
            }
        });

        debugger;
    }

    /** 返回当前表单数据 */
    function getFields() {
        return { ...state };
    }

    /** Input 组件输入 props 和校验规则 */
    type InputPropsWithRule = PropsWarpper<InputProps, 'onChange' | 'onBlur' | 'onPressEnter'>;
    /** input 组件 props 包装器 */
    function input(key: keyof T, props: InputPropsWithRule): InputProps {
        const result: InputProps = props;

        // 初始值为输入的表单值
        result.defaultValue = state[key] as any;

        // 没有规则则直接返回
        if (!props.rules) {
            return result;
        }

        const { rules } = props;
        const triggers = !rules.trigger
            ? ['onChange', 'onBlur', 'onPressEnter'] as const
            : isString(rules.trigger) ? [rules.trigger] : rules.trigger;

        for (let triggerType of triggers) {
            // 原本的回调函数
            const oldCb = result[triggerType];
            // 新的回调函数添加验证输入的钩子
            result[triggerType] = (ev: React.SyntheticEvent) => {
                if (oldCb) {
                    oldCb(ev as any);
                }

                validateFields([key]);
            };
        }

        // 外部 input 事件
        const oldInputEvent = result.onInput;
        // 双向绑定
        result.onInput = (ev: React.FormEvent<HTMLInputElement>) => {
            setState.set(key, ev.currentTarget.value as any);
            oldInputEvent && oldInputEvent(ev)
        };

        // 记录规则
        fieldsRule[key as string] = props.rules;

        return result;
    }

    /** 表单输入对应的表单元素 props 生成器 */
    function setFormItem(key: keyof T): FormItemProps {
        return (status[key] || {}) as FormItemProps;
    }

    return {
        input,
        setFormItem,

        getFields,
        resetFields,
        validateFields,
    };
}
