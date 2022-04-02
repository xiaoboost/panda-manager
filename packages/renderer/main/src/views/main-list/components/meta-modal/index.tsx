import React from 'react';

import { styles } from './style';
import { FormItem } from './form-item';
import { useState } from 'react';
import { Modal, Input, Select, SelectOption } from '@panda/components';

export interface MetaModalProps {
  visible: boolean;
  isGroup: boolean;
  onOk?(): void;
  onCancel?(): void;
}

export function MetaModal({ visible, isGroup, onCancel, onOk }: MetaModalProps) {
  const [name, setName] = useState('测试');
  const nameValidate = (val: string) => {
    if (val.length === 0) {
      return '名称不能为空';
    }
  };
  const aliasValidate = (val: string) => {
    if (val === name) {
      return '别名不能和名称相等';
    }
  };

  return (
    <Modal
      title='测试对话框'
      width={300}
      maskClosable={false}
      escClosable={false}
      visible={visible}
      onClose={onCancel}
      onCancel={onCancel}
    >
      <FormItem label='名称' required>
        <Input value={name} validate={nameValidate} onChange={setName} />
      </FormItem>
      {!isGroup && (
        <FormItem label='标签集' required>
          {/* <Input /> */}内容
        </FormItem>
      )}
      <FormItem label='别名'>
        <Input value='别名' validate={aliasValidate} />
      </FormItem>
      <FormItem label='注释'>
        <Input type='textarea' value='别名' style={{ height: 64 }} />
      </FormItem>
    </Modal>
  );
}
