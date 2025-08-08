import { FETCH_ERROR } from '~/lib/fetchClient/constants';
import { FetchError } from '~/lib/fetchClient/FetchError';
import { HttpStatus } from '~/lib/fetchClient/httpStatus';
import {
  BodyTypeKey,
  FetchErrorHandler,
  FetchErrorKey,
  GetBaseType,
  InnerParseFunction,
} from '~/lib/fetchClient/types';
import { isFetchError, isObject } from '~/lib/fetchClient/utils';

export class FetchResolver {
  private _catchers: Map<FetchErrorKey, FetchErrorHandler<unknown>>;
  private _promise: Promise<Response>;

  constructor(catchers: Map<FetchErrorKey, FetchErrorHandler<unknown>>, promise: Promise<Response>) {
    this._catchers = catchers;
    this._promise = promise;
  }

  public error<T>(status: FetchErrorKey, callback: FetchErrorHandler<T>): this {
    this._catchers.set(status, callback);
    return this;
  }

  public badRequest<T>(callback: FetchErrorHandler<T>): this {
    return this.error(HttpStatus.BAD_REQUEST, callback);
  }

  public unauthorized<T>(callback: FetchErrorHandler<T>): this {
    return this.error(HttpStatus.UNAUTHORIZED, callback);
  }

  public forbidden<T>(callback: FetchErrorHandler<T>): this {
    return this.error(HttpStatus.FORBIDDEN, callback);
  }

  public notFound<T>(callback: FetchErrorHandler<T>): this {
    return this.error(HttpStatus.NOT_FOUND, callback);
  }

  public gone<T>(callback: FetchErrorHandler<T>): this {
    return this.error(HttpStatus.GONE, callback);
  }

  public conflict<T>(callback: FetchErrorHandler<T>): this {
    return this.error(HttpStatus.CONFLICT, callback);
  }

  public unprocessableEntity<T>(callback: FetchErrorHandler<T>): this {
    return this.error(HttpStatus.UNPROCESSABLE_ENTITY, callback);
  }

  public internalServerError<T>(callback: FetchErrorHandler<T>): this {
    return this.error(HttpStatus.INTERNAL_SERVER_ERROR, callback);
  }

  public fetchError<T>(callback: FetchErrorHandler<T> = (err) => err): this {
    return this.error(FETCH_ERROR, callback);
  }

  /**
   * Returns the parsed response body directly without applying any further transformations.
   * @returns A Promise that resolves to the base parsed type `TBase`.
   */
  public json<T>(): Promise<FetchError | T>;
  /**
   * Processes the parsed response body using a provided callback.
   * The callback can return a value directly or a Promise that resolves to a value.
   * The returned Promise will resolve to the final type `U`.
   * @template U The expected final type after the callback is applied and awaited.
   * @param callback A function that receives the parsed data and returns `U` or `Promise<U>`.
   * @returns A Promise that resolves to the type `U`.
   */
  public json<T, U = unknown>(cb: (v: T) => U | Promise<U>): Promise<FetchError | U>;
  public json<T, U = unknown>(cb?: (v: T) => U | Promise<U>) {
    return this.catchWrap(this._promise.then((res) => res.json()).then<T | U>((data) => (cb ? cb(data) : data)));
  }

  /**
   * Returns the parsed response body directly without applying any further transformations.
   * @returns A Promise that resolves to the base parsed type `TBase`.
   */
  public blob(): Promise<Blob | FetchError>;
  /**
   * Processes the parsed response body using a provided callback.
   * The callback can return a value directly or a Promise that resolves to a value.
   * The returned Promise will resolve to the final type `U`.
   * @template U The expected final type after the callback is applied and awaited.
   * @param callback A function that receives the parsed data and returns `U` or `Promise<U>`.
   * @returns A Promise that resolves to the type `U`.
   */
  public blob<U>(callback: (data: Blob) => U | Promise<U>): Promise<U | FetchError>;
  public blob<U>(callback?: (data: Blob) => U | Promise<U>) {
    return this.bodyParse('blob', this._promise).call(callback);
  }

  /**
   * Returns the parsed response body directly without applying any further transformations.
   * @returns A Promise that resolves to the base parsed type `TBase`.
   */
  public formData(): Promise<FormData | FetchError>;
  public formData<U>(callback: (data: FormData) => U | Promise<U>): Promise<U | FetchError>;
  /**
   * Processes the parsed response body using a provided callback.
   * The callback can return a value directly or a Promise that resolves to a value.
   * The returned Promise will resolve to the final type `U`.
   * @template U The expected final type after the callback is applied and awaited.
   * @param callback A function that receives the parsed data and returns `U` or `Promise<U>`.
   * @returns A Promise that resolves to the type `U`.
   */
  public formData<U>(callback?: (data: FormData) => U | Promise<U>) {
    return this.bodyParse('formData', this._promise).call(callback);
  }

  /**
   * Returns the parsed response body directly without applying any further transformations.
   * @returns A Promise that resolves to the base parsed type `TBase`.
   */
  public arrayBuffer(): Promise<ArrayBuffer | FetchError>;
  public arrayBuffer<U>(callback: (data: ArrayBuffer) => U | Promise<U>): Promise<U | FetchError>;
  /**
   * Processes the parsed response body using a provided callback.
   * The callback can return a value directly or a Promise that resolves to a value.
   * The returned Promise will resolve to the final type `U`.
   * @template U The expected final type after the callback is applied and awaited.
   * @param callback A function that receives the parsed data and returns `U` or `Promise<U>`.
   * @returns A Promise that resolves to the type `U`.
   */
  public arrayBuffer<U>(callback?: (data: ArrayBuffer) => U | Promise<U>) {
    return this.bodyParse('arrayBuffer', this._promise).call(callback);
  }

  /**
   * Returns the parsed response body directly without applying any further transformations.
   * @returns A Promise that resolves to the base parsed type `TBase`.
   */
  public text(): Promise<string | FetchError>;
  public text<U>(callback: (data: string) => U | Promise<U>): Promise<U | FetchError>;
  /**
   * Processes the parsed response body using a provided callback.
   * The callback can return a value directly or a Promise that resolves to a value.
   * The returned Promise will resolve to the final type `U`.
   * @template U The expected final type after the callback is applied and awaited.
   * @param callback A function that receives the parsed data and returns `U` or `Promise<U>`.
   * @returns A Promise that resolves to the type `U`.
   */
  public text<U>(callback?: (data: string) => U | Promise<U>) {
    return this.bodyParse('text', this._promise).call(callback);
  }

  /**
   * Returns the parsed response body directly without applying any further transformations.
   * @returns A Promise that resolves to the base parsed type `TBase`.
   */
  public res(): Promise<Response | FetchError>;
  public res<U>(callback: (data: Response) => U | Promise<U>): Promise<U | FetchError>;
  /**
   * Processes the parsed response body using a provided callback.
   * The callback can return a value directly or a Promise that resolves to a value.
   * The returned Promise will resolve to the final type `U`.
   * @template U The expected final type after the callback is applied and awaited.
   * @param callback A function that receives the parsed data and returns `U` or `Promise<U>`.
   * @returns A Promise that resolves to the type `U`.
   */
  public res<U>(callback?: (data: Response) => U | Promise<U>) {
    return this.bodyParse(null, this._promise).call(callback);
  }

  private bodyParse<K extends BodyTypeKey>(key: K, promise: Promise<Response>): InnerParseFunction<GetBaseType<K>> {
    return <U>(cb?: (v: GetBaseType<K>) => U | Promise<U>) =>
      this.catchWrap(
        promise
          .then((res) => (key ? (res[key]() as Promise<GetBaseType<K>>) : (res as unknown as GetBaseType<K>)))
          .then((data) => (cb ? cb(data) : data))
      );
  }

  private async catchWrap<T>(promise: Promise<T>): Promise<T | FetchError> {
    try {
      return await promise;
    } catch (reason) {
      if (!isObject(reason)) throw reason;
      if (!(FETCH_ERROR in reason)) throw reason;

      const error = reason[FETCH_ERROR];
      if (isFetchError(error)) {
        const catcher = this._catchers.get(error.status) ?? this._catchers.get(FETCH_ERROR);
        if (!catcher) throw reason;

        return catcher(error) as FetchError;
      }

      console.error(error);
      throw error;
    }
  }
}
