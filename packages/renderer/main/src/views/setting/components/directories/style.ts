import { createStyles, RedLight } from '@panda/renderer-utils';

export const style = createStyles({
  iconOpen: {
    color: 'rgba(0, 0, 0, .4)',
    fontSize: 14,
  },
  iconDelete: {
    color: RedLight.toString(),
    fontSize: 14,
    marginLeft: 8,
  },
});
