import { EMPTY, Observable } from 'rxjs';

import vinylFs, { DestOptions, SrcOptions } from 'vinyl-fs';

import File from 'vinyl';

import { fromStream, toStream } from './streams';

export function readFiles(globs: string | Array<string>, opt?: SrcOptions): Observable<File> {
  return Array.isArray(globs) && globs.length === 0 ? EMPTY : fromStream(vinylFs.src(globs, opt));
}

export function writeFiles(files: Observable<File>, folder: string, opt?: DestOptions): Observable<File> {
  return fromStream(toStream(files).pipe(vinylFs.dest(folder, opt)));
}
