import * as oPath from 'path';
import * as oFs from '@utils/node/file-system';
import * as oZip from '@utils/modules/zip';
import * as oImage from '@utils/modules/image';
import * as oTypes from 'packages/extension-controller/src/types';

declare global {
    export namespace panda {
        export const zip: typeof oZip;
        export const image: typeof oImage;
        export const fs: typeof oFs;
        export const path: typeof oPath;
        export const resolve: {
            userPath: (...paths: (string | number)[]) => string;
            tempPath: (...paths: (string | number)[]) => string;
        };

        export type FromContext = oTypes.FromContext;
        export type BaseFileData = oTypes.BaseFileData;
        export type ListCoverProps = oTypes.ListCoverProps;
        export type Extension = oTypes.Extension;
    }
}
