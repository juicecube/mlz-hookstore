export const isFunction = (fn:any) => typeof fn === 'function';

export const isUndefined = (prop:any) => typeof prop === 'undefined';

export const isObject = (o:any) => typeof o === 'object';

export const isArray = (o:any) => Array.isArray(o);

export const isPromise = (fn:any) => {
  if (fn instanceof Promise) { return true; }
  return isObject(fn) && isFunction(fn.then);
};

export const addProxy = (o:any, handler:any) => {
  if (!isObject(o) || o === null) { return o; }
  if (isArray(o)) {
    o.forEach((item:any, index:number) => {
      if (isObject(item)) {
        o[index] = addProxy(item, handler);
      }
    });
  } else if (isObject(o)) {
    Object.keys(o).forEach((key) => {
      if (isObject(o[key])) {
        o[key] = addProxy(o[key], handler);
      }
    });
  }
  return new Proxy(o, handler);
};