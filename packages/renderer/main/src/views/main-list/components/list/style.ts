import { createStyles, White, MainColor, SecondColor, Shadow } from '@panda/renderer-utils';

const fullBlock = {
  position: 'absolute',
  width: '100%',
  height: '100%',
};

export const styles = createStyles({
  list: {
    margin: 0,
    padding: 0,
    outline: 0,

    flexGrow: 1,
    height: '100%',
    position: 'relative',
    alignItems: 'self-start',
  },
  listContainer: {
    overflowX: 'hidden',
    overflowY: 'auto',
    display: 'flex',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemCover: {
    position: 'relative',
    margin: 10,
    flexShrink: 0,
    flexGrow: 0,
    height: 200,
    boxShadow: `2px 2px 4px ${Shadow.toString()}`,
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
