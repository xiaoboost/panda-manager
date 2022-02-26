import {
  createStyles,
  Color,
  Gray,
  Black2,
  Black3,
  BlackLight,
  WhiteBg,
  BlackLighter,
} from '@panda/renderer-utils';

export const style = createStyles({
  panelShow: {},
  panelItemDisabled: {},

  menu: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignContent: 'center',
    position: 'relative',
  },
  panel: {
    position: 'fixed',
    minWidth: 180,
    display: 'none',
    flexDirection: 'column',
    backgroundColor: Black2.toString(),
    padding: [4, 1],
    zIndex: 10,
    boxShadow: `0 -2px 2px ${Color.rgb(0, 0, 0, 0.05).toString()}`,

    '&$panelShow': {
      display: 'flex',
    },
  },
  panelItem: {
    height: 24,
    lineHeight: '24px',
    margin: [2, 0],
    padding: [0, 20],
    color: WhiteBg.toString(),

    '&:hover': {
      color: Gray.toString(),
      backgroundColor: Black3.toString(),
    },

    '&$panelItemDisabled': {
      color: `${BlackLighter.toString()} !important`,
      backgroundColor: 'transparent !important',
    },
  },
  panelSplit: {
    height: 1,
    margin: [4, 10],
    backgroundColor: BlackLight.toString(),
  },
});
