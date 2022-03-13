import React from 'react';

import { styles } from './style';
import { SelectOptionProps as OptionProps } from './utils/option';
import { stringifyClass as cla } from '@xiao-ai/utils';

export interface OptProps extends OptionProps {
  selected?: boolean;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
  onClick?(): void;
}

export function Option({
  label,
  selected = false,
  disabled = false,
  default: isDefault = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: OptProps) {
  const { classes } = styles;

  return (
    <div
      className={cla(classes.option, {
        [classes.optionDisabled]: disabled,
        [classes.optionHighlight]: selected,
      })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={classes.optionLabel}>{label}</div>
      <div className={classes.optionDefault}>{isDefault ? '默认' : ''}</div>
    </div>
  );
}
