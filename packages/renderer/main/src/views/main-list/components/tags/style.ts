import { createStyles, Red } from '@panda/renderer-utils';

export const height = 30;

export const RowHeight = 22;

const lineHeight = {
  height: RowHeight,
  lineHeight: `${RowHeight}px`,
};
const inlineFlex = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const staticFlex = {
  flexGrow: 0,
  flexShrink: 0,
};

export const styles = createStyles({
  indent: {
    height: '100%',
    width: 8,
    pointerEvents: 'none',
  },
  indentGuide: {
    display: 'inline-block',
    boxSizing: 'border-box',
    height: '100%',
    width: 3,
    marginLeft: 4,
    borderLeft: '1px solid #bbb',
    transition: 'border-color .1s linear',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  tagRow: {
    cursor: 'pointer',
    touchAction: 'none',
    display: 'flex',
    height: RowHeight,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    fontSize: 12,
    paddingLeft: 16,

    '&:hover': {
      backgroundColor: '#E0E0E0',
    },
  },
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    display: 'inline-flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    ...lineHeight,
  },
  input: {
    flexGrow: 1,
  },
  innerInput: {
    padding: [2, 0],
  },
  titleLabel: {
    color: 'inherit',
    whiteSpace: 'pre',
    textDecoration: 'none',
    display: 'inline-flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    ...staticFlex,
    ...lineHeight,
    ...inlineFlex,
    paddingRight: 6,
    fontSize: 10,
  },
  spaceIcon: {
    width: 10,
    height: 10,
  },
  metaFormItem: {
    display: 'flex',
    fontSize: 12,
    lineHeight: '28px',
    marginBottom: 6,

    '&:last-child': {
      marginBottom: 0,
    },
  },
  metaRequired: {},
  metaFormLabel: {
    width: 56,
    textAlign: 'right',

    '&$metaRequired:before': {
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
  metaFormContent: {
    flexGrow: 1,
  },
});
