import React from 'react';

import { style } from './style';
import { FormData } from '../../../shared';

export interface FormProps {
  data: FormData;
  onChange?(data: FormData): void;
}

export function Form({ data, onChange }: FormProps) {
  return <article className={style.classes.form}>Form {JSON.stringify(data)}</article>;
}
