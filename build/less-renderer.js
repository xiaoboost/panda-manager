/**
 * 用于 typescript-plugin-css-modules 插件的 less 解析器
 * @link https://github.com/mrmckeb/typescript-plugin-css-modules#customRenderer
 */

module.exports = (css, { logger }) => {
    try {
        const context = css
            .replace(/@import[^\n]+/g, '')
            .match(/([.#][^ {\n,']+)/g)
            .filter((select) => !/#[0-9a-fA-F]/.test(select))
            .filter((select) => !/\.[0-9]/.test(select))
            .join(', ');

        return `${context} {\n    position: relative;\n}\n`;
    }
    catch (error) {
        logger.error(error.message);
    }
};
