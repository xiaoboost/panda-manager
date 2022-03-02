import jss from 'jss';
import preset from 'jss-preset-default';

import { Styles, StyleSheet } from 'jss';

export { jss };

export * from 'jss';

type JssStyle<C extends string | number = string> = Pick<StyleSheet<C>, 'classes'>;

export function createStyles<C extends string = string>(styles: Styles<C>): JssStyle<C> {
  if (!(jss as any)._$isSetup) {
    (jss as any)._$isSetup = true;
    jss.setup(preset());
  }

  const css = jss.createStyleSheet(styles, {
    link: false,
    index: 0,
    element: document.createElement('style'),
  });

  css.attach();

  return css;
}

export function createScrollbarWidth(width: number, prefix = ''): Styles {
  return {
    [`${prefix}::-webkit-scrollbar`]: {
      width,
      height: width,
    },
    [`${prefix}::-webkit-scrollbar-track`]: {
      boxShadow: `inset 0 0 ${width / 2}px rgba(0, 0, 0, .3)`,
    },
    [`${prefix}::-webkit-scrollbar-thumb`]: {
      boxShadow: `inset 0 0 ${width / 2}px rgba(0, 0, 0, .3)`,
    },
  };
}
