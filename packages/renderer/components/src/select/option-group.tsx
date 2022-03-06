import type React from 'react';

export interface OptionGroupProps {
  label: NonNullable<React.ReactNode>;
  children?: React.ReactNode;
}

export interface OptGroupFC extends React.FC<OptionGroupProps> {
  isSelectOptGroup: boolean;
}

export const OptGroup: OptGroupFC = () => null;

OptGroup.isSelectOptGroup = true;
