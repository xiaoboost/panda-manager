import React from 'react';

import { Manga } from 'renderer/lib/manga';

interface Props {
    manga: Manga;
}

export default function PreviewsList({ manga }: Props) {
    const basePath = manga.previewPath.replace(/\\/g, '\\\\');
    const positions = manga.previewPositions;

    return (
        <div className='card-box' id='manga-previews'>
            {positions.map(([endX, endY], i, arr) => (
                <div className='image-block' key={i}>
                    <div
                        className='image-background'
                        style={{
                            backgroundImage: `url('${basePath}')`,
                            backgroundPositionY: '0px',
                            backgroundPositionX: `${i === 0 ? 0 : -arr[i - 1][0]}px`,
                            width: `${i === 0 ? endX : endX - arr[i - 1][0]}px`,
                            height: `${endY}px`,
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
