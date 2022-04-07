import { createStyles, WhiteBg, Shadow, BlackExtraLight } from '@panda/renderer-utils';

const radius = 4;

export const styles = createStyles({
  search: {
    position: 'absolute',
    width: 300,
    top: 0,
    right: 28,
    minHeight: 28,
    zIndex: 99,
    lineHeight: '19px',
    padding: [0, 4],
    overflow: 'hidden',
    boxSizing: 'border-box',
    boxShadow: `0 0 8px 2px ${Shadow.toString()}`,
    backgroundColor: WhiteBg.toString(),
    borderLeft: `2px solid ${BlackExtraLight.toString()}`,
  },
  queryList: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  queryItem: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,

    '& > *': {},
  },
  queryIcon: {
    padding: 6,
  },
  queryText: {
    padding: 4,
  },
  leftRadius: {
    borderTopLeftRadius: radius,
    borderBottomLeftRadius: radius,
  },
  rightRadius: {
    borderTopRightRadius: radius,
    borderBottomRightRadius: radius,
  },
  queryInput: {
    // ..
  },
});
