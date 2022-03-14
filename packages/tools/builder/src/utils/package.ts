import fs from 'fs-extra';
import path from 'path';

import { appData } from './env';

export async function buildManifest(output: string) {
  await fs.mkdirp(output);
  await fs.writeFile(
    path.join(output, 'package.json'),
    JSON.stringify({
      name: appData.name,
      version: appData.version,
      description: appData.description,
      main: appData.main,
      author: appData.author,
      license: appData.license,
    }),
  );
}
