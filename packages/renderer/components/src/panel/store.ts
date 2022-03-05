import { style } from './style';

/** 面板容器 */
export const panelContainer = document.createElement('div');

document.body.appendChild(panelContainer);
panelContainer.setAttribute('class', style.classes.container);
