import { BaseModuleData } from '../../module';

/** 漫画模块储存数据 */
export interface MangaData extends BaseModuleData {
    /** 当前漫画类别 */
    category: Category;
    /** 当前漫画是否是文件夹 */
    isDirectory: boolean;
    /** 预览图片坐标列表 */
    previewPositions: [number, number][];
}

/** 漫画类别枚举 */
export const enum Category {
    Doujinshi,
    Manga,
    ArtistCG,
    GameCG,
    Western,
    NonH,
    ImageSet,
    Cosplay,
    AsianPorn,
    Misc,
}
