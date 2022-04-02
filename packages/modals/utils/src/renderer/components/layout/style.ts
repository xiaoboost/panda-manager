import { createStyles, White, Red } from '@panda/renderer-utils';

const headerHeight = 28;

export const styles = createStyles({
  layout: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 12,
    border: `1px solid rgba(184, 184, 184, 0.5)`,
  },
  header: {
    width: '100%',
    height: headerHeight,
    lineHeight: `${headerHeight}px`,
    backgroundColor: White.toString(),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: [0, 0, 0, 8],
    '-webkit-app-region': 'drag',
  },
  headerIcon: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: headerHeight,
    '-webkit-app-region': 'no-drag',

    '&:hover': {
      backgroundColor: `${Red.toString()} !important`,
      color: White.toString(),
    },
  },
  article: {
    flexGrow: 1,
    padding: 12,
    backgroundColor: '#F0F0F0',
  },
  footer: {
    width: '100%',
    height: 28,
    backgroundColor: White.toString(),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: [0, 12],
  },
});
