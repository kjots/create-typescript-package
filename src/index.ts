import { promises as fs } from 'fs';

import decompress from 'decompress';
import handlebars from 'handlebars';
import path from 'path';

import { camelCase } from 'lodash';

import { from, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { concatMap, filter, map, mergeAll, tap } from 'rxjs/operators';

import File = require('vinyl');

import { dest } from '@kjots/vinyl-fs-observable';

export interface Opts {
  output: string;
  name: string;
  description: string;
  keywords: Array<string>;
}

export const defaults: Partial<Opts> = {
  output: '.',
  name: path.basename(process.cwd()),
  keywords: []
};

interface TemplateContext {
  name: string;
  nameCamelCase: string;
  description?: string;
  keywords: Array<{ keyword: string, first: boolean, last: boolean }>;
}

const templateZip = path.resolve(__dirname, '../lib/typescript-package-template.zip');

export function createTypescriptPackage(opts: Opts) {
  const { name, description } = opts;
  const nameCamelCase = camelCase(name);
  const keywords = opts.keywords.map((keyword, i) => ({ keyword, first: i === 0, last: i === opts.keywords.length - 1 }));

  readTemplateFiles()
    .pipe(
      applyTemplate({ name, nameCamelCase, description, keywords }),
      dest(opts.output),
      concatMap(file => from(fs.chmod(file.path, file.mode)))
    )
    .subscribe();
}

function readTemplateFiles(): Observable<File> {
  return from(decompress(templateZip))
    .pipe(
      mergeAll(),
      filter(file => file.type === 'file'),
      map(file => new File({
        cwd: process.cwd(),
        base: templateZip,
        path: path.resolve(templateZip, file.path),
        mode: file.mode,
        contents: file.data
      }))
    );
}

function applyTemplate(templateContext: TemplateContext): MonoTypeOperatorFunction<File> {
  return tap(file => {
    if (file.path.endsWith('.mustache') && file.contents) {
      const template = handlebars.compile(file.contents.toString());

      file.path = file.path.substring(0, file.path.length - 9);
      file.contents = Buffer.from(template(templateContext));
    }
  });
}
