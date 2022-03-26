import { createStyles, White, MainColor, SecondColor } from '@panda/renderer-utils';

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

    '&:hover': {
      '& $mask': {
        opacity: 1,
      },
      '& $maskOutside': {
        borderColor: SecondColor.toString(),
      },
    },
  },
  mask: {
    opacity: 0,
    ...fullBlock,
  },
  maskOutside: {
    zIndex: 10,
    border: '2px solid',
    ...fullBlock,
  },
  maskInside: {
    zIndex: 9,
    border: `3px solid ${White.toString()}`,
    ...fullBlock,
  },
  selected: {
    '& $mask': {
      opacity: 1,
      '& $maskOutside': {
        borderColor: MainColor.toString(),
      },
    },
  },
});
