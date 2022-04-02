import { createStyles, Color, BlackLight, WhiteBg } from '@panda/renderer-utils';

export const styles = createStyles({
  disabled: {},

  panelContainer: {
    position: 'static',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    minWidth: 100,
    padding: [4, 1],
    zIndex: 10,
    boxShadow: `0px 1px 4px ${Color.rgb(0, 0, 0, 0.2).toString()}`,
    backgroundColor: WhiteBg.toString(),
    color: BlackLight.toString(),
  },
});
