import { createStyles, WhiteBg } from '@panda/renderer-utils';

export const style = createStyles({
  footer: {
    width: '100%',
    height: 40,
    padding: [0, 10],
    margin: 0,
    backgroundColor: WhiteBg.toString(),
    borderTop: '1px solid #DFDFDF',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
