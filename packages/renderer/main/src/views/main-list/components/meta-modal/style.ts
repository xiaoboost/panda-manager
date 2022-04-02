import { createStyles, Red } from '@panda/renderer-utils';

export const styles = createStyles({
  item: {
    display: 'flex',
    fontSize: 12,
    lineHeight: '28px',
    marginBottom: 6,

    '&:last-child': {
      marginBottom: 0,
    },
  },
  required: {},
  label: {
    width: 48,
    textAlign: 'right',

    '&$required:before': {
      display: 'inline-block',
      marginRight: 2,
      color: Red.toString(),
      fontSize: 12,
      lineHeight: 1,
      content: '"*"',
    },
    '&:after': {
      content: '":"',
      position: 'relative',
      top: -0.5,
      margin: '0 6px 0 2px',
    },
  },
  content: {
    flexGrow: 1,
  },
});
