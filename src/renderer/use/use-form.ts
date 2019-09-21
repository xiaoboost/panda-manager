import { InputProps } from 'antd/es/input';
import { FormItemProps } from 'antd/es/form/FormItem';

import { useRef } from 'react';
import { useMap } from 'react-use';
import { useForceUpdate } from './index';

import { isString, isArray, unique } from 'utils/shared';

import { default as Schema, Rules, RuleItem } from 'async-validator';

/** 表单验证规则选项扩展 */
interface FormRule<T extends string> extends RuleItem {
    trigger?: T | T[];
}

/** 表单输入属性包装 */
type PropsWarpper<P extends object, T extends string> = P & {
    rules?: FormRule<T> | FormRule<T>[];
};

function getTriggers<T extends string>(rules: FormRule<T> | FormRule<T>[], all: T[]): T[] {
    const triggers: T[] = [];

    rules = isArray(rules) ? rules : [rules];

    for (let rule of rules) {
        // 当前验证规则没有触发条件，则返回全部
        if (!rule.trigger) {
            return all;
        }

        if (isString(rule.trigger)) {
            triggers.push(rule.trigger);
        }
        else {
            triggers.push(...rule.trigger);
        }
    }

    return unique(triggers);
}

export default function useForm<T extends object>(initVal: T) {
    /** 初始化对象的键名数组 */
    type Keys = Array<keyof T>;

    /** 保存初始值 */
    const initState = useRef<T>(initVal);
    /** 当前状态 */
    const nowState = useRef<T>(initVal);
    /** 强制更新 */
    const $forceUpdate = useForceUpdate();

    /** 当前规则集合 */
    const fieldsRule: Rules = {};
    /** 当前表单验证状态 */
    const [status, setStatus] = useMap<Partial<Record<keyof T, FormItemProps>>>({});

    /** 表单验证器实例 */
    let schema: Schema | undefined = void 0;

    /** 初始化表单对应字段输入 */
    function resetFields(names: Keys = Object.keys(initState.current) as Keys) {
        // 更新状态值
        nowState.current = names.reduce((ans, key) => (ans[key] = nowState.current[key], ans), {} as T);
        // 更新视图
        $forceUpdate();
    }

    /** 校验表单对应字段 */
    function validateFields(names: Keys = Object.keys(initState.current) as Keys) {
        if (!schema) {
            schema = new Schema(fieldsRule);
        }

        const values = names.reduce((ans, key) => (ans[key] = nowState.current[key], ans), {} as T);

        for (let name of names) {
            setStatus.set(name, {
                help: '',
                validateStatus: 'success',
            });
        }

        schema.validate(values, undefined, (errs) => {
            for (let err of errs) {
                setStatus.set(err.field as keyof T, {
                    help: err.message,
                    validateStatus: 'error',
                });
            }
        });
    }

    /** 返回当前表单数据 */
    function getFields() {
        return { ...nowState.current };
    }

    /** Input 组件输入 props 和校验规则 */
    type InputPropsWithRule = PropsWarpper<InputProps, 'onChange' | 'onBlur' | 'onPressEnter'>;
    /** input 组件 props 包装器 */
    function input(key: keyof T, props: InputPropsWithRule): InputProps {
        const result: InputProps = props;

        // 初始值为输入的表单值
        result.defaultValue = initVal[key] as any;

        // 没有规则则直接返回
        if (!props.rules) {
            return result;
        }

        const { rules } = props;
        const allTrigger = ['onChange', 'onBlur', 'onPressEnter'] as const;
        const triggers = getTriggers(rules, allTrigger as any);

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
            // 更新表单值
            nowState.current[key] = ev.currentTarget.value as any;
            // 更新视图
            $forceUpdate();

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
