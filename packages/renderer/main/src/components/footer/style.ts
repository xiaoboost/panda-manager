import { createStyles, White, Purple } from '@panda/renderer-utils';

export const height = 20;

export const styles = createStyles({
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Purple.toString(),
    color: White.toString(),
    height,
    fontSize: 10,
    padding: [0, 18],
  },
  footerIcon: {
    marginRight: 6,
  },
  footerItem: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  readStatus: {
    maxWidth: 180,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});
