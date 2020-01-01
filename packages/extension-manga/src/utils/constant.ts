import { BaseFileData } from '@panda/extension-controller';

/** 漫画模块储存数据 */
export interface MangaData extends BaseFileData {
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

export const CategoryMap = {
    [Category.Doujinshi]: {
        label: 'Doujinshi',
        color: '#9E2720',
    },
    [Category.Manga]: {
        label: 'Manga',
        color: '#DB6C24',
    },
    [Category.ArtistCG]: {
        label: 'Artist CG',
        color: '#D38F1D',
    },
    [Category.GameCG]: {
        label: 'Game CG',
        color: '#6A936D',
    },
    [Category.Western]: {
        label: 'Western',
        color: '#AB9F60',
    },
    [Category.NonH]: {
        label: 'Non-H',
        color: '#5FA9CF',
    },
    [Category.ImageSet]: {
        label: 'Image Set',
        color: '#325CA2',
    },
    [Category.Cosplay]: {
        label: 'Cosplay',
        color: '#6A32A2',
    },
    [Category.AsianPorn]: {
        label: 'Asian Porn',
        color: '#A23282',
    },
    [Category.Misc]: {
        label: 'Misc',
        color: '#777777',
    },
};
