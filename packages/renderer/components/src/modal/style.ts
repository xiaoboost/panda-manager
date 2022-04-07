import type React from 'react';
import { createStyles, Color, BlackLight, WhiteBg, White, Red } from '@panda/renderer-utils';

const radius = 3;
const headerHeight = 28;
const fullScreen: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

export const styles = createStyles({
  modalContainer: {
    position: 'static',
  },
  wrapper: {
    ...fullScreen,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mask: {
    ...fullScreen,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 200,
    padding: 0,
    margin: 0,
    zIndex: 10,
    borderRadius: radius,
    boxShadow: `0px 1px 4px ${Color.rgb(0, 0, 0, 0.2).toString()}`,
    backgroundColor: WhiteBg.toString(),
    color: BlackLight.toString(),
    border: '1px solid rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: [0, 0, 0, 6],
    fontSize: 12,
    height: headerHeight,
    lineHeight: `${headerHeight}px`,
    backgroundColor: White.toString(),
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
  },
  headerIcon: {
    width: 32,
    height: headerHeight,
    lineHeight: `${headerHeight}px`,

    '&:hover': {
      backgroundColor: Red.toString(),
      color: White.toString(),
    },
  },
  body: {
    flexGrow: 1,
    backgroundColor: WhiteBg.toString(),
    borderBottomLeftRadius: radius,
    borderBottomRightRadius: radius,
    padding: 10,
  },
  footer: {
    padding: [0, 10, 12, 10],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btn: {
    marginLeft: 8,
  },
});
