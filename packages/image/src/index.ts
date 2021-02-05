import Jimp from 'jimp';
import { isMainThread, parentPort } from 'worker_threads';

interface CompressOption {
  type?: 'jpg' | 'png';
  width?: number;
  height?: number;
  quality?: number;
}

const imageMime = {
  jpg: Jimp.MIME_JPEG,
  png: Jimp.MIME_PNG,
  bmp: Jimp.MIME_BMP,
};

export async function compress(image: Buffer, opt: CompressOption = {}) {
  if (!Buffer.isBuffer(image)) {
    image = Buffer.from(image);
  }

  const img = await Jimp.create(image);
  const toMime = imageMime[opt.type || 'jpg'];
  const height = opt.height || 1e6;
  const width = opt.width || 1e6;

  return img
    .quality(opt.quality || 80)
    .scaleToFit(width, height)
    .getBufferAsync(toMime);
}

interface ExtendOption {
  type?: 'jpg' | 'png';
  quality?: number;
}

export async function extend(
  main: Buffer,
  extended: Buffer,
  opt: ExtendOption = {},
) {
  if (!Buffer.isBuffer(main)) {
    main = Buffer.from(main);
  }

  if (!Buffer.isBuffer(extended)) {
    extended = Buffer.from(extended);
  }

  const toMime = imageMime[opt.type || 'jpg'];
  const quality = opt.quality || 80;

  const img1 = await Jimp.create(main);
  const img2 = await Jimp.create(extended);

  const height1 = img1.getHeight();
  const height2 = img2.getHeight();
  const width1 = img1.getWidth();
  const width2 = img2.getWidth();

  const maxHeight = height1 < height2 ? height2 : height1;
  const alignOpt = Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP;

  img1.contain(width1 + width2, maxHeight, alignOpt);

  if (maxHeight !== height2) {
    img2.contain(width2, maxHeight, alignOpt).background(0xffffffff);
  }

  const result = await img1
    .quality(quality)
    .background(0xffffffff)
    .composite(img2, width1, 0)
    .getBufferAsync(toMime);

  return result;
}

function install() {
  interface EventData {
    name: string;
    params: any[];
    meta: any;
  }

  parentPort!.on('message', async ({ meta = {}, name, params }: EventData) => {
    let data,
      error = '';

    try {
      if (name === 'compress') {
        data = await compress(...(params as [any, any]));
      } else if (name === 'extend') {
        data = await extend(...(params as [any, any, any]));
      } else {
        error = `unknow method: ${name}.`;
      }
    } catch (e) {
      error = e.message;
    }

    if (Buffer.isBuffer(data)) {
      meta.isBuffer = true;
    }

    parentPort!.postMessage({ meta, name, data, error });
  });
}

if (!isMainThread) {
  install();
}
