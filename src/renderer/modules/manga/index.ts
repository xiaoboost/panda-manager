import { ModuleInstance } from '../';

import {  } from 'path';
import {  } from 'fs-extra';

import ListCover from './list-cover';
import DetailPage from './detail-page';

export default class Manga implements ModuleInstance {
    static async testFile(path: string) {
        return true;
    }

    static async testMeta(path: string) {
        return true;
    }

    static async fromMeta(path: string) {
        return '';
    }

    static async fromFile(path: string) {
        return '';
    }

    static ListCover = ListCover;
    static DetailPage = DetailPage;

    id = 0;
    name = '';
    
    filePath = '';
    fileSize = 0;

    get metaDir() {
        return '';
    }

    get tempDir() {
        return '';
    }

    createMeta() {

    }
}
