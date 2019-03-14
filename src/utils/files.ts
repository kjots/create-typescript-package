import { observableStream } from '@kjots/observable-stream';
import { streamObservable } from '@kjots/stream-observable';

import { EMPTY, Observable } from 'rxjs';

import vinylFs, { DestOptions, SrcOptions } from 'vinyl-fs';

import File from 'vinyl';

export function readFiles(globs: string | Array<string>, opt?: SrcOptions): Observable<File> {
  return Array.isArray(globs) && globs.length === 0 ? EMPTY : streamObservable(vinylFs.src(globs, opt));
}

export function writeFiles(files: Observable<File>, folder: string, opt?: DestOptions): Observable<File> {
  return streamObservable(observableStream(files).pipe(vinylFs.dest(folder, opt)));
}
