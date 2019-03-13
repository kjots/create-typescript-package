declare module 'stream-to-observable' {
  import { Observable } from 'rxjs';

  import ReadableStream = NodeJS.ReadableStream;

  function streamToObservable<T>(stream: ReadableStream): Observable<T>;

  export = streamToObservable;
}
