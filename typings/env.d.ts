/** 全局环境变量补充 */
declare namespace NodeJS {
    interface ProcessEnv {
        /** 编译模式 */
        NODE_ENV: 'development' | 'production';
        /** 初始目录 */
        INIT_CWD: string;
        /** 临时目录 */
        TEMP: string;
    }
}
