import { createStyles, Black, FontDefault, FontDefaultSize } from '@panda/renderer-utils';
import { ModalHeight, ModalWidth } from 'src/shared';

export const styles = createStyles({
  app: {
    height: process.env.NODE_ENV === 'development' ? `${ModalHeight}px !important` : '100%',
    width: process.env.NODE_ENV === 'development' ? `${ModalWidth}px !important` : '100%',
  },
});
