export interface SelectOptionProps {
  label: string;
  value: string | number;
  disabled?: boolean;
  default?: boolean;
  detail?: string;
}

/** 选项 */
export const SelectOption: React.FC<SelectOptionProps> = () => null;
