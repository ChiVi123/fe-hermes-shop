import { FulfilledHandler, InterceptorHandler, RejectedHandler } from '~/lib/fetchain/types';

export class InterceptorManager<T> {
  private _handlers: InterceptorHandler<T>[];

  constructor() {
    this._handlers = [];
  }

  public use(onFulfilled?: FulfilledHandler<T> | null, onRejected?: RejectedHandler | null) {
    this._handlers.push({ onFulfilled, onRejected });
    return this._handlers.length;
  }

  public removeItem(index: number) {
    return this._handlers.splice(index, 1);
  }

  public forEach(callback: (value: InterceptorHandler<T>, index: number, array: InterceptorHandler<T>[]) => void) {
    this._handlers.forEach(callback);
  }
}
