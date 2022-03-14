import { CSSProperties } from 'react';

export interface BaseProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  tabIndex?: number;
  onClick?(ev: React.MouseEvent<HTMLElement, MouseEvent>): any;
}
