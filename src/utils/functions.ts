export function onceify(fn: (this: any, ...args: Array<any>) => any): (this: any, ...args: Array<any>) => any {
  let invoked = false;

  return function(this: any, ...args: Array<any>): any {
    if (!invoked) {
      invoked = true;

      return fn.call(this, ...args);
    }
  };
}
