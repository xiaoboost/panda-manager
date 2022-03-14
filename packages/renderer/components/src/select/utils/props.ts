import type { ReactElement } from 'react';
import type { SelectOptionProps as OptionProps } from './option';

import { isArray, isUndef } from '@xiao-ai/utils';

export type SelectChildren = ReactElement<OptionProps> | ReactElement<OptionProps>[];

export function getOptions(data: SelectChildren) {
  const nodes = isArray(data) ? data : [data];
  return nodes.map((node) => node.props);
}

export function getLabel(props: OptionProps[], val?: string | number | null) {
  if (isUndef(val)) {
    return '';
  }

  return props.find((prop) => prop.value === val)?.label ?? '';
}
