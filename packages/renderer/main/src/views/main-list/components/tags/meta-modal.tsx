import React, { useEffect } from 'react';

import { styles } from './style';
import { useState, useRef, PropsWithChildren } from 'react';
import { Modal, Input, InputRef, Select, SelectOption } from '@panda/components';
import { stringifyClass as cla } from '@xiao-ai/utils';

export interface FormItemProps {
  label: string;
  required?: boolean;
}

export function FormItem({ label, required, children }: PropsWithChildren<FormItemProps>) {
  const { classes: cln } = styles;

  return (
    <div className={cln.metaFormItem}>
      <div
        className={cla(cln.metaFormLabel, {
          [cln.metaRequired]: required,
        })}
      >
        {label}
      </div>
      <div className={cln.metaFormContent}>{children}</div>
    </div>
  );
}

export interface ModalFormData {
  name: string;
  alias: string;
  comment: string;
  groupId: number;
}

export interface ModalFormOption {
  groups: {
    name: string;
    id: number;
  }[];
}

export interface MetaModalProps {
  visible: boolean;
  title: string;
  value?: ModalFormData;
  option?: ModalFormOption;
  nameValidate?(val: string): void;
  aliasValidate?(val: string): void;
  onOk?(data: ModalFormData): void;
  onCancel?(): void;
}

const defaultData: ModalFormData = {
  name: '',
  alias: '',
  comment: '',
  groupId: -1,
};

const defaultOption: ModalFormOption = {
  groups: [],
};

export function MetaModal({
  visible,
  title,
  value = defaultData,
  option = defaultOption,
  nameValidate,
  aliasValidate,
  onCancel,
  onOk,
}: MetaModalProps) {
  const [data, setData] = useState(value);
  const nameInputRef = useRef<InputRef>(null);
  const changeHandler = (key: keyof ModalFormData) => (val: string) => {
    setData({
      ...data,
      [key]: val,
    });
  };
  const okHandler = () => {
    onOk?.(data);
  };

  useEffect(() => {
    if (visible) {
      setData(value);
      nameInputRef.current?.focus();
    }
  }, [visible]);

  return (
    <Modal
      title={title}
      width={320}
      maskClosable={false}
      escClosable={false}
      visible={visible}
      onClose={onCancel}
      onCancel={onCancel}
      onOk={okHandler}
    >
      <FormItem label='名称' required>
        <Input
          ref={nameInputRef}
          value={data.name}
          validate={nameValidate}
          onChange={changeHandler('name')}
        />
      </FormItem>
      {option.groups.length > 0 && (
        <FormItem label='标签集' required>
          <Select value={data.groupId}>
            {option.groups.map((v) => (
              <SelectOption key={v.id} value={v.id} label={v.name} />
            ))}
          </Select>
        </FormItem>
      )}
      <FormItem label='别名'>
        <Input value={data.alias} validate={aliasValidate} onChange={changeHandler('alias')} />
      </FormItem>
      <FormItem label='注释'>
        <Input
          type='textarea'
          value={data.comment}
          style={{ height: 64 }}
          onChange={changeHandler('comment')}
        />
      </FormItem>
    </Modal>
  );
}
