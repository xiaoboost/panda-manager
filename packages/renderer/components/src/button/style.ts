import { createStyles, MainColor, White } from '@panda/renderer-utils';
import type { ButtonProps } from './index';

export function getClassNameByType(type: NonNullable<ButtonProps['type']>): string {
  return styles.classes[`btn${type[0].toUpperCase()}${type.slice(1)}`] ?? '';
}

export const styles = createStyles({
  btnContainer: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    padding: [2, 14],
    fontSize: 12,
    cursor: 'pointer',

    '& $btnIcon, & $btn': {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
  },
  btn: {
    position: 'relative',
    whiteSpace: 'normal',
  },
  btnIcon: {
    marginRight: 4,
    fontSize: 10,
  },
  btnPrimary: {
    backgroundColor: MainColor.toString(),
    color: White.toString(),
  },
});
