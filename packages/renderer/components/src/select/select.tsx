import React from 'react';

import { Panel } from '../panel';
import { Option } from './option';
import { DownOutlined } from '@ant-design/icons';

import { useState, useEffect, useRef } from 'react';
import { BaseProps } from '@panda/shared';
import { isUndef, stringifyClass as cla } from '@xiao-ai/utils';
import { getOffset, useBlur } from '@panda/renderer-utils';

import { styles } from './style';
import { dropDownContainer } from './utils/store';
import { getOptions, getLabel, SelectChildren } from './utils/props';

export interface SelectProps extends BaseProps {
  value?: number | string | null;
  filter?: boolean;
  disabled?: boolean;
  children?: SelectChildren;
  onChange?(val: number | string): void;
}

export function Select({
  className,
  style,
  value,
  disabled = false,
  filter = false,
  onChange,
  children,
}: SelectProps) {
  const { classes } = styles;
  const options = getOptions(children ?? []);
  const boxRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelPosition, setPanelPosition] = useState([0, 0, 0]);
  const [selected, setSelected] = useState(value);
  const [inputVal, setInputVal] = useState('');
  const [labelVal, setLabelVal] = useState('');
  const ref = useBlur<HTMLDivElement>(focus, () => {
    setFocus(false);
    setPanelVisible(false);
  });

  // 首次运行时，输入值为空，且待选项中有默认选项，则初始化为默认选项
  useEffect(() => {
    if (onChange && isUndef(value)) {
      const defaultValue = options.find((data) => data.disabled);

      if (defaultValue) {
        onChange(defaultValue.value);
      }
    }
  }, []);

  // 选择值变更
  useEffect(() => {
    const label = getLabel(options, value);
    setInputVal(label);
    setLabelVal(label);
  }, [value]);

  // 下拉列表面板状态更新
  useEffect(() => {
    if (panelVisible) {
      setSelected(value);
    } else {
      setSelected(null);
    }
  }, [panelVisible]);

  const selectClickHandler = () => {
    if (disabled) {
      return;
    }

    const { current: el } = boxRef;

    if (!el) {
      return;
    }

    const offset = getOffset(el);

    setFocus(true);

    if (panelVisible) {
      setPanelVisible(false);
    } else {
      setPanelVisible(true);
      setPanelPosition([offset[0], offset[1] + el.offsetHeight, el.offsetWidth]);
    }
  };
  const clickOptionHandler = (val: number | string) => {
    setPanelVisible(false);
    onChange?.(val);
  };

  return (
    <div
      ref={ref}
      style={style}
      onClick={selectClickHandler}
      className={cla(classes.selectContainer, className)}
    >
      <div
        className={cla(classes.select, {
          [classes.selectDisabled]: disabled,
          [classes.selectFocus]: focus,
        })}
        ref={boxRef}
      >
        {filter && <input className={classes.selectInput} value={inputVal} />}
        {<span className={classes.selectLabel}>{labelVal}</span>}
      </div>
      <span className={classes.selectIcon}>
        <DownOutlined />
      </span>
      <Panel
        stopPropagation
        className={classes.selectDropDown}
        visible={panelVisible}
        x={panelPosition[0]}
        y={panelPosition[1]}
        width={panelPosition[2]}
        renderElement={dropDownContainer}
      >
        {options.map((opt) => (
          <Option
            {...opt}
            key={opt.value}
            selected={selected === opt.value}
            onMouseEnter={() => setSelected(opt.value)}
            onClick={() => clickOptionHandler(opt.value)}
          />
        ))}
      </Panel>
    </div>
  );
}
