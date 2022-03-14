import {
  createStyles,
  Color,
  WhiteBg,
  FontSecondColor,
  FontThirdColor,
} from '@panda/renderer-utils';

const WhiteBgHighlight = Color(WhiteBg.rgbNumber() - 0x060606);
const listHover = Color(0xe0e0e0);
const listHeight = 24;

export const styles = createStyles({
  form: {
    maxWidth: 800,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: [0, 24],
    boxSizing: 'border-box',

    '&:first-child $formTitle': {
      marginTop: 20,
    },
  },
  formTitle: {
    margin: [8, 14],
    fontSize: 24,
    fontWeight: 600,
    color: FontSecondColor.toString(),
    display: 'inline-block',
    boxSizing: 'border-box',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  formItem: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: [12, 14, 18],
    whiteSpace: 'normal',

    '&:hover': {
      backgroundColor: WhiteBgHighlight.toString(),
    },
  },
  formItemTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: FontSecondColor.toString(),
  },
  formItemLink: {
    margin: 4,
  },
  formItemDescription: {
    fontSize: 13,
    fontWeight: 'normal',
    color: FontThirdColor.toString(),
  },
  formItemBody: {
    marginTop: 9,
    width: '100%',
    display: 'flex',
  },
  formItemWrapper: {
    display: 'flex',
    width: '100%',
  },
  formItemError: {
    // TODO:
  },
  listWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
  listContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    whiteSpace: 'normal',
    marginBottom: 1,
    padding: 1,
    fontSize: 12,
  },
  listPlaceholder: {
    color: FontThirdColor.toString(),
    margin: [6, 0],
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: listHeight,
    lineHeight: `${listHeight}px`,
    color: FontThirdColor.toString(),

    '&:hover': {
      backgroundColor: listHover.toString(),
    },

    '&:hover $listActions': {
      opacity: 1,
    },
  },
  listContext: {
    whiteSpace: 'pre',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: [0, 2],
  },
  listActions: {
    opacity: 0,
    display: 'inline-flex',
    marginLeft: 8,
    padding: 0,
    height: listHeight,
    alignItems: 'center',
  },
  listAction: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    height: listHeight,
    width: listHeight,
  },
});
