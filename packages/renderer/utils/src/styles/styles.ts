import jss from 'jss';
import preset from 'jss-preset-default';

import { Styles, StyleSheet } from 'jss';
import { mediaPhone, mediaPc } from './constant';

export { jss };

export * from 'jss';

type JssStyle<C extends string | number = string> = Pick<StyleSheet<C>, 'classes'>;

export function createStyles<C extends string = string>(styles: Styles<C>): JssStyle<C> {
  if (!(jss as any)._$isSetup) {
    (jss as any)._$isSetup = true;
    jss.setup(preset());
  }

  return jss.createStyleSheet(styles, {
    link: false,
    index: 0,
  });
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

export function createFontFaceStyles(
  family: string,
  style: string,
  weight: string,
  url: string
): JssStyle {
  return createStyles({
    '@font-face': {
      fontFamily: family,
      fontStyle: style,
      fontWeight: weight,
      src: `url('${url}.woff2') format('woff2')`,
    },
  });
}

export function mergeStyles(...styles: JssStyle[]): JssStyle {
  const style = createStyles({});

  for (const data of styles) {
    (style as any).rules.index.push(...(data as any).rules.index);
  }

  return style;
}

export function createMediaStyles<T>(
  pcParam: T,
  phoneParam: T,
  template: (param: T) => Styles,
) {
  return {
    [mediaPc]: template(pcParam),
    [mediaPhone]: template(phoneParam),
  };
}

/** 迭代标题元素 */
export function createHeadStyles(pre = '', cb: (level: number) => Styles) {
  const styles: Styles = {};

  for (let i = 1; i < 6; i++) {
    styles[`${pre}h${i}`] = cb(i);
  }

  return styles;
}
