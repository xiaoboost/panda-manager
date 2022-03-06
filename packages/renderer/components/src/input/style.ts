import { createStyles } from '@panda/renderer-utils';

export const styles = createStyles({
  box: {
    position: 'relative',
    display: 'block',
    padding: 0,
    boxSizing: 'border-box',
    fontSize: 'inherit',
    height: '100%',
  },
  disabled: {
    // TODO: 待补
  },
  idle: {
    border: '1px solid transparent',
  },
  ibWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',

    input: {
      textOverflow: 'ellipsis',
    },
  },
  input: {
    display: 'inline-block',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    lineHeight: 'inherit',
    border: 'none',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    resize: 'none',
    color: 'inherit',
    padding: 4,
    outline: 0,
  },
  focus: {
    outlineWidth: 1,
    outlineStyle: 'solid',
    outlineOffset: -1,
    opacity: '1 !important',
    outlineColor: '#528bff',
  },
});
