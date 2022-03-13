import React, { Children } from 'react';

import { style } from './style';
import { Description, DescriptionKind } from './types';
import { PropsWithChildren } from 'react';
import { EmptyObject, stringifyClass, isArray } from '@xiao-ai/utils';

export * from './types';

export interface FormProps {
  title: string;
}

export function Form(props: PropsWithChildren<FormProps>) {
  return (
    <section className={style.classes.form}>
      <header className={style.classes.formTitle}>{props.title}</header>
      {props.children}
    </section>
  );
}

export interface FormItemProps {
  title: string;
  description: Description;
  error?: string;
}

export function FormItem({
  title,
  description,
  children,
  error,
}: PropsWithChildren<FormItemProps>) {
  const { classes: cla } = style;

  return (
    <div className={cla.formItem}>
      <div className={cla.formItemTitle}>{title}</div>
      <div className={cla.formItemDescription}>
        {isArray(description)
          ? description.map((item, i) => (
              <div key={i}>
                {item.kind === DescriptionKind.Text ? (
                  item.content
                ) : (
                  <a href={item.href} className={cla.formItemLink}>
                    {item.content}
                  </a>
                )}
              </div>
            ))
          : description}
      </div>
      <div className={cla.formItemContent}>
        <div className={cla.formItemFormItem}>{children}</div>
        {error && <div className={cla.formItemError}>{error}</div>}
      </div>
    </div>
  );
}
