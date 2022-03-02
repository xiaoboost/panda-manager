import SourceHan from '../assets/fonts/SourceHanSansSC.otf';

import { createStyles } from './styles';
import { FontDefault } from './constant';

createStyles({
  '@font-face': {
    fontFamily: FontDefault,
    fontStyle: 'normal',
    fontWeight: 'normal',
    src: `url('${SourceHan}')`,
  },
});
