import { ModuleBaseData, ModuleType, Module } from '../';

import {  } from 'path';
import {  } from 'fs-extra';

import ListCover from './list-cover';
import DetailPage from './detail-page';

/** 数据库中的数据 */
export interface MangaData extends ModuleBaseData {
    /** 指定为 manga 类型 */
    type:  ModuleType.Manga;
}

const module: Module = {
    type: ModuleType.Manga,

    ListCover,
    DetailPage,

    async test(file: string) {
        return false;
    },

    async from(file: string) {

    },
};

export default module;

// export default class Manga implements ModuleInstance {
//     static async testFile(path: string) {
//         return true;
//     }

//     static async testMeta(path: string) {
//         return true;
//     }

//     static async fromMeta(path: string) {
//         return '';
//     }

//     static async fromFile(path: string) {
//         return '';
//     }

//     static ListCover = ListCover;
//     static DetailPage = DetailPage;

//     id = uid();
//     name = '';
    
//     filePath = '';
//     fileSize = 0;

//     get metaDir() {
//         return '';
//     }

//     get tempDir() {
//         return '';
//     }

//     createMeta() {

//     }
// }
