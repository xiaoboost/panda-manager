import type React from 'react';

export interface OptionProps {
  label?: React.ReactNode;
  value?: string | number | null;
  disabled?: string;
  children?: React.ReactNode;
}

export interface OptionFC extends React.FC<OptionProps> {
  isSelectOption: boolean;
}

export const Option: OptionFC = () => null;

Option.isSelectOption = true;
