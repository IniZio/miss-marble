/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { extract } from '@formatjs/cli-lib';
import glob from 'fast-glob';
import { readFile, writeFile } from 'fs/promises';

const files = await glob(['src/**/*.{ts,tsx}', '!**/*.d.ts']);
const defaultMessages = JSON.parse(await extract(files, { format: 'simple' }));

const messageIDs = Object.keys(defaultMessages).sort();

const checkOnly = process.argv.includes('--check');
let hasDiff = false;
for (const file of await glob('src/i18n/*.json')) {
  const inData = String(await readFile(file));
  const inMessages = JSON.parse(inData);

  const outMessages = {};
  for (const id of messageIDs) {
    outMessages[id] = inMessages[id] ?? defaultMessages[id];
  }
  const outData = JSON.stringify(outMessages, null, 2) + '\n';

  if (inData !== outData) {
    hasDiff = true;
    console.log('[!] ' + file);
    if (!checkOnly) {
      await writeFile(file, outData);
    }
  }
}

if (hasDiff && checkOnly) {
  process.exit(1);
}