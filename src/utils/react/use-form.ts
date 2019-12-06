import { InputProps } from 'antd/es/input';
import { FormItemProps } from 'antd/es/form/FormItem';

import { useRef } from 'react';
import { useMap } from 'react-use';
import { useForceUpdate } from './index';

import { isString, isArray, unique } from 'utils/shared';

import { default as Schema, Rules, RuleItem } from 'async-validator';

/** 表单验证规则选项扩展 */
interface FormRule<T> extends RuleItem {
    trigger?: T | T[];
}

/** 表单输入属性包装 */
type PropsWarpper<P extends object, T extends keyof P> = P & {
    rules?: FormRule<T> | FormRule<T>[];
};

function getTriggers<T extends string>(rules: FormRule<T> | FormRule<T>[], all: T[]): T[] {
    const triggers: T[] = [];

    rules = isArray(rules) ? rules : [rules];

    for (const rule of rules) {
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
    const forceUpdate = useForceUpdate();

    /** 当前规则集合 */
    const fieldsRule: Rules = {};
    /** 当前表单验证状态 */
    const [status, setStatus] = useMap<Partial<Record<keyof T, FormItemProps>>>({});

    /** 表单验证器实例 */
    let schema: Schema | undefined = void 0;

    /** 初始化表单对应字段输入 */
    function resetFields(names: Keys = Object.keys(initState.current) as Keys) {
        // 更新状态值
        nowState.current = names.reduce((ans, key) => ((ans[key] = nowState.current[key]), ans), {} as T);
        // 更新视图
        forceUpdate();
    }

    /** 校验表单对应字段 */
    function validateFields(names: Keys = Object.keys(initState.current) as Keys) {
        return new Promise<boolean>((resolve) => {
            if (!schema) {
                schema = new Schema(fieldsRule);
            }

            const values = names.reduce((ans, key) => ((ans[key] = nowState.current[key]), ans), {} as T);

            for (const name of names) {
                setStatus.set(name, {
                    help: '',
                    validateStatus: 'success',
                });
            }

            schema.validate(values, undefined, (errs) => {
                if (errs) {
                    for (const err of errs) {
                        setStatus.set(err.field as keyof T, {
                            help: err.message,
                            validateStatus: 'error',
                        });
                    }

                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }

    /** 返回当前表单数据 */
    function getFields() {
        return { ...nowState.current };
    }

    /** 组件基础属性 */
    interface BaseProps {
        defaultValue?: any;
    }

    /**
     * 创建组件修饰器
     * @param {string} binding 双向绑定的事件名称
     * @param {(ev: any) => void} cb 双向绑定事件
     */
    function formInputBinding<P extends BaseProps, K extends GetString<keyof P>>(binding: keyof P, update: (ev: any) => void) {
        return (key: keyof T, props: PropsWarpper<P, K> = {} as P): P => {
            const result: P = props;

            // 初始值为输入的表单值
            result.defaultValue = initVal[key] as any;

            // 绑定触发规则
            if (props.rules) {
                const { rules } = props;
                const allTrigger = ['onChange', 'onBlur', 'onPressEnter'] as const;
                const triggers = getTriggers<K>(rules, allTrigger as any);

                // 记录规则
                fieldsRule[key as string] = rules;

                for (const triggerType of triggers) {
                    // 原本的回调函数
                    const oldCb: any = result[triggerType];
                    // 新的回调函数添加验证输入的钩子
                    result[triggerType] = ((ev: React.SyntheticEvent) => {
                        if (oldCb) {
                            oldCb(ev as any);
                        }

                        validateFields([key]);
                    }) as any;
                }
            }

            // 外部 input 事件
            const oldEvent: any = result[binding];
            // 双向绑定
            result[binding] = ((arg: any) => {
                // 更新表单值
                nowState.current[key] = update(arg) as any;
                // 更新视图
                forceUpdate();
                // 外部事件调用
                oldEvent && oldEvent(arg);
            }) as any;

            return result;
        };
    }

    /** Input 组件允许的验证规则事件 */
    type InputPropsTrigger = 'onChange' | 'onBlur' | 'onPressEnter';
    /** input 组件 props 包装器 */
    const input = formInputBinding<InputProps, InputPropsTrigger>('onInput', (ev: React.FormEvent<HTMLInputElement>) => {
        return ev.currentTarget.value;
    });

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

        formInputBinding,
    };
}
