import { createStyles, Gray, Black, Shadow, White, BlackLighter } from '@panda/renderer-utils';

export const style = createStyles({
  card: {
    '&:first-child $cardTitle': {
      marginTop: 14,
    },

    '@global': {
      '.anticon': {
        cursor: 'pointer',
      },
    },
  },
  cardTitle: {
    margin: [24, 0, 14, 0],
    fontSize: 18,
    color: Black.toString(),
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: 14,
    backgroundColor: White.toString(),
    borderRadius: 4,
    boxShadow: `0 1px 5px ${Shadow.toString()}`,
  },
  baseLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  baseBox: {
    borderBottom: `1px solid ${Gray.toString()}`,

    '&:last-child': {
      borderBottom: 'none',
    },
  },
  line: {
    fontSize: 14,
    minHeight: 48,
    padding: [8, 20],
  },
  subLine: {
    fontSize: 12,
    minHeight: 38,
    padding: [10, 20, 10, 30],
  },
  lineName: {
    fontSize: '100%',
  },
  lineSubName: {
    fontSize: '80%',
    color: BlackLighter.toString(),
  },
});
