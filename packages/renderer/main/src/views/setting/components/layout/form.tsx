import React from 'react';

import { styles } from './style';
import { Description, DescriptionKind } from './types';
import { PropsWithChildren } from 'react';
import { isArray } from '@xiao-ai/utils';

export * from './types';

export interface FormProps {
  title: string;
}

export function Form(props: PropsWithChildren<FormProps>) {
  return (
    <section className={styles.classes.form}>
      <header className={styles.classes.formTitle}>{props.title}</header>
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
  const { classes: cla } = styles;

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
      <div className={cla.formItemBody}>
        <div className={cla.formItemWrapper}>{children}</div>
        {error && <div className={cla.formItemError}>{error}</div>}
      </div>
    </div>
  );
}
