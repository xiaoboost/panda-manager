import {
  createStyles,
  Color,
  WhiteBg,
  HighlightColor,
  FontSecondColor,
} from '@panda/renderer-utils';

const BorderColor = Color(0xcecece);
const HighlightBgColor = Color(0xccdebb);
const DefaultColor = Color(0xaab69f);

export const styles = createStyles({
  selectDropDown: {},
  dropdownContainer: {
    position: 'static',

    '& $selectDropDown': {
      fontSize: 12,
      border: `1px solid ${HighlightColor.toString()}`,
      boxShadow: 'none',
      padding: 1,
    },
  },
  selectContainer: {
    position: 'relative',
    minWidth: 40,
  },
  selectFocus: {},
  select: {
    backgroundColor: WhiteBg.toString(),
    border: `1px solid ${BorderColor.toString()}`,
    fontSize: 12,
    height: 26,
    padding: [2, 8],

    '&$selectFocus': {
      borderColor: HighlightColor.toString(),
    },
  },
  selectIcon: {
    fontSize: 10,
    right: 0,
    top: 0,
    position: 'absolute',
    height: 26,
    width: 26,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectInput: {
    // ..
  },
  selectLabel: {
    // ..
  },
  option: {
    boxSizing: 'border-box',
    height: 20,
    lineHeight: '20px',
    fontSize: 12,
    padding: [0, 4],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: FontSecondColor.toString(),
    border: '1px solid transparent',
  },
  optionHighlight: {
    borderColor: HighlightColor.toString(),
    backgroundColor: HighlightBgColor.toString(),
    cursor: 'pointer',

    '& $optionDefault': {
      color: FontSecondColor.toString(),
    },
  },
  optionDisabled: {
    // TODO:
  },
  optionLabel: {
    position: 'relative',
  },
  optionDefault: {
    color: DefaultColor.toString(),
  },
});
