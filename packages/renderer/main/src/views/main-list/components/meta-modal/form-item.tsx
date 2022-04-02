import React from 'react';

import { styles } from './style';
import { PropsWithChildren } from 'react';
import { stringifyClass as cla } from '@xiao-ai/utils';

export interface FormItemProps {
  label: string;
  required?: boolean;
}

export function FormItem({ label, required, children }: PropsWithChildren<FormItemProps>) {
  const { classes: cln } = styles;

  return (
    <div className={cln.item}>
      <div
        className={cla(cln.label, {
          [cln.required]: required,
        })}
      >
        {label}
      </div>
      <div className={cln.content}>{children}</div>
    </div>
  );
}
