import { styles } from './style';

/** 面板容器 */
export const errorContainer = document.createElement('div');

document.body.appendChild(errorContainer);
errorContainer.setAttribute('class', styles.classes.errorPanelContainer);
