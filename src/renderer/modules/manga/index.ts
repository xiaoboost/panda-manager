import * as Module from '../module';

import {  } from 'path';
import { remove } from 'fs-extra';

import ListCover from './list-cover';
import DetailPage from './detail-page';

export default class Manga extends Module.BaseModule implements Module.ModuleInstance {
    /** 指定为漫画类型 */
    static type = Module.ModuleType.Manga;

    /** 列表封面组件 */
    static ListCover = ListCover;
    /** 详情页面组件 */
    static DetailPage = DetailPage;

    /** 创建元数据 */
    static async from({ file, buffer }: Module.FromContext) {
        debugger;
        return '' as any;
    }

    /** 指定为漫画类型 */
    type = Module.ModuleType.Manga;

    name = '';
    filePath = '';
    fileSize = 0;
    lastModified = 0;
    tags: number[] = [];

    /** 生成储存用的元数据 */
    toData() {

    }
}
