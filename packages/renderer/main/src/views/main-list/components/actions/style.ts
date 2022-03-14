import { createStyles, Color, Black, BlackLight } from '@panda/renderer-utils';

const actionColor = Color(BlackLight.rgbNumber() - Black.rgbNumber());

export const style = createStyles({
  container: {
    display: 'flex',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    height: '100%',
    alignItems: 'center',
  },
  item: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    marginLeft: 4,

    '& > a': {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  label: {
    padding: 2,
    textDecoration: 'none',
    textRendering: 'auto',
    textAlign: 'center',
    textTransform: 'none',
    borderRadius: 4,

    '& > *': {
      fontSize: 14,
      color: actionColor.toString(),
    },

    '&:hover': {
      backgroundColor: '#dddddd',
    },
  },
});
