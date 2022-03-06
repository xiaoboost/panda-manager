import React from 'react';
import ReactDom from 'react-dom';

import { BaseProps } from '@panda/shared';
import { dropDownContainer } from './store';

export interface SelectProps extends BaseProps {
  value?: number | string | null;
  children?: React.ReactNode;
  disabled?: string;
}

export function Select(props: SelectProps) {
  return ReactDom.createPortal(<div></div>, dropDownContainer);
}
