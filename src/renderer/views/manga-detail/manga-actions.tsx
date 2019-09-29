import React from 'react';

import { Button } from 'antd';
import { shell } from 'electron';

import { Manga } from 'renderer/lib/manga';
import { deleteConfirm } from 'renderer/lib/dialog';
import { selectDirectory } from 'renderer/lib/interface';

interface Props {
    manga: Manga;
}

export default function PreviewsList({ manga }: Props) {
    const { file } = manga;

    const extractManga = () => selectDirectory().then((dir) => manga.extract(dir));
    const deleteManga = () => {
        deleteConfirm({
            title: '警告',
            content: `确定要删除此漫画？\n\n${file.path}`,
        })
            .then(() => manga.deleteSelf());
    };

    return (
        <div className='manga-action'>
            <Button
                type='primary'
                size='small'
                onClick={manga.viewManga.bind(manga)}>
                浏览漫画
            </Button>
            {file.isDirectory
                ? <Button
                    type='primary'
                    size='small'
                    onClick={manga.archive.bind(manga)}>
                    打包漫画
                </Button>
                : ''}
            <Button
                type='primary'
                size='small'
                onClick={extractManga}>
                {file.isDirectory
                    ? '复制到'
                    : '解压到'}
            </Button>
            <Button
                size='small'
                className='ant-btn-success'
                onClick={() => shell.showItemInFolder(file.path)}>
                打开文件夹
            </Button>
            {/* <Button
                size='small'
                className='ant-btn-warning'>
                压制漫画
            </Button> */}
            <Button
                type='danger'
                size='small'
                onClick={deleteManga}>
                删除漫画
            </Button>
        </div>
    );
}
