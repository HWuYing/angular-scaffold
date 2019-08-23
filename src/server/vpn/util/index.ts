export const hasOwnProperty = (object: any, name: string) => Object.prototype.hasOwnProperty.call(object, name);
export const type = (object: any) => Object.prototype.toString.call(object).replace(/^\[object ([\S]+)\]$/, '$1');
export const isType = (typeName: string) => (object: any) => type(object) === typeName;
export const isObject = isType('Object');
export const isFunction = isType('Function');
export const isArray = isType('Array');

export type Handler = (...arg: any[]) => void;

export class EventEmitter {
  protected events:  {[key: string]: any[]} = {};
  constructor() { }

  on(key: string, handler: Handler) {
    if (!isFunction(handler)) {
      throw new Error('handler Must function');
    }
    if (!hasOwnProperty(this.events, key)) {
      this.events[key] = [];
    }
    this.events[key].push(handler);
  }

  pipe(...arg: any[]) {
    const key = arg[0];
    const handlers = arg.slice(1);
    handlers.forEach((handler: Handler) => this.on(key, handler));
  }

  emitSync(...arg: any[]) {
    const key = arg[0];
    if (!hasOwnProperty(this.events, key)) {
      return ;
    }
    const handler = this.events[key].reverse().reduce((first: Handler, handler: Handler) => 
      (...arg: any[]) => handler(...arg, first) , (data: any) => { console.log('last: ', data) });
    handler(...arg.slice(1));
  }

  emitAsync(...arg: any[]) {
    const key = arg[0];
    if (!hasOwnProperty(this.events, key)) {
      return ;
    }
    this.events[key].forEach((handler: Handler) => handler(...arg.slice(1)));
  }
}