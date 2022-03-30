import { createStyles, ErrorMain, ErrorBg } from '@panda/renderer-utils';

export const styles = createStyles({
  errorPanelContainer: {
    position: 'static',
  },
  panel: {
    boxSizing: 'border-box',
    border: `1px solid ${ErrorMain.toString()}`,
    borderTop: 0,
    backgroundColor: ErrorBg.toString(),
    padding: 6,
    margin: 0,
    fontSize: 12,
    boxShadow: 'none',
  },
});
