import * as path from 'path';
import * as Stream from 'stream';
import * as fs from 'fs-extra';

export * from 'fs-extra';

/** 遍历文件夹下的所有文件 */
async function filesOperation(
  base: string,
  opt: (file: string, stat: fs.Stats) => void | Promise<void>,
) {
  const files = await fs.readdir(base);

  for (let i = 0; i < files.length; i++) {
    const newPath = path.join(base, files[i]);
    const newStat = await fs.stat(newPath);

    if (newStat.isDirectory()) {
      await filesOperation(newPath, opt);
    } else {
      await opt(newPath, newStat);
    }
  }
}

/** 求文件夹大小 */
async function folderSize(base: string) {
  let result = 0;

  await filesOperation(base, (_, stat) => {
    result += stat.size;
  });

  return result;
}

/** 获取文件夹内所有文件路径 */
export async function readDirDeep(base: string) {
  const result: string[] = [];

  await filesOperation(base, (file) => {
    result.push(file);
  });

  return result;
}

/** 获取文件（夹）大小 */
export async function readFileSize(base: string) {
  const fileStat = await fs.stat(base);

  if (fileStat.isDirectory()) {
    return await folderSize(base);
  } else {
    return fileStat.size;
  }
}

class WriteSharedBuffer extends Stream.Writable {
  _buffer: SharedArrayBuffer;
  _view: Uint8Array;
  _index = 0;

  constructor(len = 0) {
    super();
    this._buffer = new SharedArrayBuffer(len);
    this._view = new Uint8Array(this._buffer);
  }

  _write(chunk: Buffer, encoding: BufferEncoding, next: (error?: Error | null) => void) {
    const chunkView = new Uint8Array(chunk.buffer);

    for (let i = 0; i < chunkView.byteLength; i++) {
      this._view[this._index + i] = chunkView[i];
    }

    this._index += chunkView.byteLength;

    next();
  }
}

/** 读取文件并设置为 SharedArrayBuffer */
export async function readFileAsShared(path: string) {
  const fileStat = await fs.stat(path);
  const writeStream = new WriteSharedBuffer(fileStat.size);
  const readStream = fs.createReadStream(path);

  return new Promise((resolve, reject) => {
    readStream
      .pipe(writeStream)
      .on('error', (err) => reject(err))
      .on('finish', () => {
        readStream.destroy();
        writeStream.destroy();
        resolve(writeStream._buffer);
      });
  });
}
