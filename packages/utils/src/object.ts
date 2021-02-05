import { checkCircularStructure } from './clone';
import { isFunc, isArray, isBaseType, isObject } from './assert';
import { AnyObject } from './types';

/**
 * 检查 key 是否存在于 obj 对象中
 * @param obj 检查对象
 * @param key 检查的属性名称
 */
export function hasOwn(obj: AnyObject, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 对象是否为空
 * @param obj 待检测对象
 */
export function isEmpty(obj: AnyObject) {
  return Object.keys(obj).length === 0;
}

/**
 * 比较两个值是否相等
 * @param from 被比较值
 * @param to 比较值
 */
export function isEqual(from: any, to: any, deepCheck = false): boolean {
  if (isBaseType(from)) {
    return from === to;
  }

  if (deepCheck && checkCircularStructure(from)) {
    throw new Error('(isEqual) Can not have circular structure.');
  }

  if (isFunc(from.isEqual)) {
    return Boolean(from.isEqual(to));
  }

  if (isArray(from)) {
    if (!isArray(to) || from.length !== to.length) {
      return false;
    } else {
      return from.every((item, i) =>
        isBaseType(item) ? item === to[i] : isEqual(item, to[i]),
      );
    }
  } else {
    if (
      !isObject(to) ||
      !Object.keys(from).every((key) => to.hasOwnProperty(key)) ||
      !Object.keys(to).every((key) => from.hasOwnProperty(key))
    ) {
      return false;
    } else {
      return Object.entries(from).every(([key, value]) =>
        isBaseType(value) ? value === to[key] : isEqual(value, to[key]),
      );
    }
  }
}

/**
 * 在对象中添加隐藏属性
 * @param from 待添加属性的对象
 * @param properties 添加的属性
 */
export function def(from: AnyObject, properties: AnyObject) {
  Object.entries(properties).forEach(([key, value]) =>
    Object.defineProperty(from, key, {
      configurable: true,
      writable: true,
      enumerable: false,
      value,
    }),
  );
}

/** 编译 JSON */
export function parserBody<T = AnyObject>(body: T | string): T {
  let data = body;

  if (!body) {
    data = {} as any;
  } else if (typeof body === 'string') {
    try {
      data = JSON.parse(body);
    } catch (e) {
      data = {} as any;
      console.warn(`JSON 格式错误: ${body}`);
    }
  }

  return data as T;
}
