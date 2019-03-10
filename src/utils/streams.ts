import { Observable } from 'rxjs';

import { Readable } from 'readable-stream';

import streamToObservable from 'stream-to-observable';

import { onceify } from './functions';

import ReadableStream = NodeJS.ReadableStream;
import ReadWriteStream = NodeJS.ReadWriteStream;

export function fromStream<T>(stream: ReadableStream): Observable<T> {
  return streamToObservable(stream);
}

export function toStream<T>(observable: Observable<T>): ReadableStream {
  const stream = Readable({ objectMode: true });

  stream._read = onceify(() =>
    observable.subscribe(
      data => stream.push(data),
      error => stream.emit('error', error),
      () => stream.push(null)
    )
  );

  return stream;
}

export function throughStream<T, R = T>(...transforms: Array<ReadWriteStream>): (observable: Observable<T>) => Observable<R> {
  return (observable: Observable<T>) => fromStream(transforms.reduce((stream, transform) => stream.pipe(transform), toStream(observable)));
}
