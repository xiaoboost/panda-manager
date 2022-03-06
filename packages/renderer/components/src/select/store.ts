import React from 'react';

// import type { RawValueType, RenderNode } from './BaseSelect';
// import type { FlattenOptionData } from './interface';
// import type { BaseOptionType, FieldNames, OnActiveValue, OnInternalSelect } from './Select';
import { OptionProps } from './option';
import { style } from './style';

export interface SelectContextProps {
  options: OptionProps[];
  // flattenOptions: FlattenOptionData<BaseOptionType>[];
  // onActiveValue: OnActiveValue;
  // defaultActiveFirstOption?: boolean;
  // onSelect: OnInternalSelect;
  // menuItemSelectedIcon?: RenderNode;
  // rawValues: Set<RawValueType>;
  // fieldNames?: FieldNames;
  // virtual?: boolean;
  // listHeight?: number;
  // listItemHeight?: number;
  // childrenAsData?: boolean;
}

export const Context = React.createContext<SelectContextProps>({
  options: [],
});

/** 下拉列表容器 */
export const dropDownContainer = document.createElement('div');

document.body.appendChild(dropDownContainer);
dropDownContainer.setAttribute('class', style.classes.container);
