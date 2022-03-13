import { createStyles, Color, WhiteBg } from '@panda/renderer-utils';

const FontBlock = Color(0x444444);
const FontBlackLight = Color(0x656565);
const WhiteBgHighlight = Color(WhiteBg.rgbNumber() - 0x060606);

export const style = createStyles({
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
    color: FontBlock.toString(),
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
    color: FontBlock.toString(),
  },
  formItemLink: {
    margin: 4,
  },
  formItemDescription: {
    fontSize: 13,
    fontWeight: 'normal',
    color: FontBlackLight.toString(),
  },
  formItemContent: {
    marginTop: 9,
    display: 'flex',
  },
  formItemFormItem: {
    // ..
  },
  formItemError: {
    // ..
  },
});
