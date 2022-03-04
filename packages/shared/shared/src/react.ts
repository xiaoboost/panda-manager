import { CSSProperties } from 'react';

export interface BaseProps {
  className?: string;
  style?: CSSProperties;
  onClick?(ev: React.MouseEvent<HTMLElement, MouseEvent>): any;
}
