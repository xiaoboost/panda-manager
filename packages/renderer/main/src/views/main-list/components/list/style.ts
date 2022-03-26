import { createStyles, Color, White, BlackLight } from '@panda/renderer-utils';

const fullBlock = {
  position: 'absolute',
  width: '100%',
  height: '100%',
};

export const styles = createStyles({
  list: {
    overflowX: 'hidden',
    overflowY: 'auto',

    margin: 0,
    padding: 0,

    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'self-start',
    alignContent: 'flex-start',
  },
  itemCover: {
    position: 'relative',
    margin: 10,
    flexShrink: 0,
    flexGrow: 0,
    height: 200,
    boxShadow: '2px 2px 4px Shadow',
    transition: 'box-shadow 200ms',
  },
  mask: {
    display: 'none',
    ...fullBlock,
  },
  maskOutside: {
    zIndex: 10,
    border: '2px solid #316AC5',
    ...fullBlock,
  },
  maskInside: {
    zIndex: 9,
    border: `3px solid ${White.toString()}`,
    ...fullBlock,
  },
  selected: {
    '& $mask': {
      display: 'block',
    },
  },
});
