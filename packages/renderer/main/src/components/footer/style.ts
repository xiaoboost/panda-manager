import { createStyles, White, Purple } from '@panda/renderer-utils';

export const height = 20;

export const style = createStyles({
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Purple.toString(),
    color: White.toString(),
    height,
    fontSize: 12,
    padding: [0, 18],
  },
  footerItem: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
