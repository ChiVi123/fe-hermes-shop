import { FETCH_ERROR } from '~/lib/fetchain/constants';
import { HttpError } from '~/lib/fetchain/HttpError';
import { HttpStatus } from '~/lib/fetchain/httpStatus';
import { FetchErrorHandler, FetchErrorKey, FinalErrorType } from '~/lib/fetchain/types';

/**
 * ErrorTypes is a generic that will accumulate the return types of our errors.
 */
export class RequestChain<ErrorTypes = never> {
  constructor(
    private readonly catchers: Map<FetchErrorKey, ((error: HttpError) => unknown) | ((error: Error) => unknown)>,
    private readonly promise: Promise<Response>
  ) {}

  /**
   * Catches a 400 Bad Request error.
   * @template T A callback return type that will accumulate the return types.
   * @param cb A function to execute when a 400 error occurs. Its return value will be part of the final return type.
   * @category Catchers
   */
  public badRequest<T>(cb: FetchErrorHandler<T, number>): RequestChain<ErrorTypes | T> {
    return this.error(HttpStatus.BAD_REQUEST, cb);
  }

  /**
   * Catches a 401 Unauthorized error.
   * @template T A callback return type that will accumulate the return types.
   * @param cb A function to execute when a 401 error occurs. Its return value will be part of the final return type.
   * @category Catchers
   */
  public unauthorized<T>(cb: FetchErrorHandler<T, number>): RequestChain<ErrorTypes | T> {
    return this.error(HttpStatus.UNAUTHORIZED, cb);
  }

  /**
   * Catches a 403 Forbidden error.
   * @template T A callback return type that will accumulate the return types.
   * @param cb A function to execute when a 403 error occurs. Its return value will be part of the final return type.
   * @category Catchers
   */
  public forbidden<T>(cb: FetchErrorHandler<T, number>): RequestChain<ErrorTypes | T> {
    return this.error(HttpStatus.FORBIDDEN, cb);
  }

  /**
   * Catches a 404 Not Found error.
   * @template T A callback return type that will accumulate the return types.
   * @param cb A function to execute when a 404 error occurs. Its return value will be part of the final return type.
   * @category Catchers
   */
  public notFound<T>(cb: FetchErrorHandler<T, number>): RequestChain<ErrorTypes | T> {
    return this.error(HttpStatus.NOT_FOUND, cb);
  }

  /**
   * Catches a 409 Conflict error.
   * @template T A callback return type that will accumulate the return types.
   * @param cb A function to execute when a 409 error occurs. Its return value will be part of the final return type.
   * @category Catchers
   */
  public conflict<T>(cb: FetchErrorHandler<T, number>): RequestChain<ErrorTypes | T> {
    return this.error(HttpStatus.CONFLICT, cb);
  }

  /**
   * Catches a 410 Gone error.
   * @template T A callback return type that will accumulate the return types.
   * @param cb A function to execute when a 410 error occurs. Its return value will be part of the final return type.
   * @category Catchers
   */
  public gone<T>(cb: FetchErrorHandler<T, number>): RequestChain<ErrorTypes | T> {
    return this.error(HttpStatus.GONE, cb);
  }

  /**
   * Catches a 422 Unprocessable Entity error.
   * @template T A callback return type that will accumulate the return types.
   * @param cb A function to execute when a 422 error occurs. Its return value will be part of the final return type.
   * @category Catchers
   */
  public unprocessableEntity<T>(cb: FetchErrorHandler<T, number>): RequestChain<ErrorTypes | T> {
    return this.error(HttpStatus.UNPROCESSABLE_ENTITY, cb);
  }

  /**
   * Catches a 500 Internal Server error.
   * @template T A callback return type that will accumulate the return types.
   * @param cb A function to execute when a 500 error occurs. Its return value will be part of the final return type.
   * @category Catchers
   */
  public internalServerError<T>(cb: FetchErrorHandler<T, number>): RequestChain<ErrorTypes | T> {
    return this.error(HttpStatus.INTERNAL_SERVER_ERROR, cb);
  }

  /**
   * Catches any error thrown by the fetch function and perform the callback.
   * @template T A callback return type that will accumulate the return types.
   * @param cb A function to execute when any error occurs. Its return value will be part of the final return type.
   * @category Catchers
   */
  public fetchError<T>(cb: FetchErrorHandler<T, symbol>): RequestChain<ErrorTypes | T> {
    return this.error(FETCH_ERROR, cb);
  }

  /**
   * Catches an http response with a specific error code or name and performs a callback.
   * Common Error.name Values in fetch Errors
   * ```ts
   * type ErrorName =
   * | 'TypeError'
   * | 'AbortError'
   * | 'TimeoutError'
   * | 'FetchError'
   * | 'SystemError'
   * | 'NetworkError'
   * | 'SyntaxError';
   * ```
   * @template T A callback return type that will accumulate the return types.
   * @param key A key to map callback, is string (ErrorName), symbol (FETCH_ERROR), number (HttpStatus).
   * @param cb A function to execute when an error occurs. Its return value will be part of the final return type.
   * @category Catchers
   */
  public error<T>(key: FetchErrorKey, cb: FetchErrorHandler<T, FetchErrorKey>): RequestChain<ErrorTypes | T> {
    this.catchers.set(key, cb);
    return new RequestChain(this.catchers, this.promise);
  }
  /**
   *
   * The handler for the raw fetch Response.
   * Check the [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Response) documentation for more details on the Response class.
   * @category Response Type
   */
  public res<R>(cb?: (v: Response) => R | Promise<R>): Promise<R | Response | FinalErrorType<ErrorTypes>> {
    return this.catchersWrapper(this.promise.then((data) => (cb ? cb(data) : data)));
  }

  /**
   * Read the payload and deserialize it as JSON.
   *
   * ```ts
   * interface User {
   *   email: string;
   *   following: number;
   *   role: 'USER' | 'ADMIN';
   *   isActive: boolean;
   * }
   *
   * apiRequest
   *   .get('/users/me')
   *   .notFound((err) => err.status)
   *   .forbidden((err) => err.message)
   *   .json((user: User) => user.isActive); // or json<User>()
   * ```
   *
   * @note should declare generic type for method json like example
   *
   * @category Response Type
   */
  public json<V>(): Promise<V | FinalErrorType<ErrorTypes>>;
  public json<V, R>(cb: (v: V) => R | Promise<R>): Promise<R | FinalErrorType<ErrorTypes>>;
  public json<V, R>(cb?: (v: V) => R | Promise<R>): Promise<R | FinalErrorType<ErrorTypes>> {
    return this.catchersWrapper(this.promise.then((res) => res.json()).then((data) => (cb ? cb(data) : data)));
  }

  /**
   * Retrieves the payload as a string.
   * @category Response Type
   */
  public text<R>(cb?: (v: string) => R | Promise<R>): Promise<R | string | FinalErrorType<ErrorTypes>> {
    return this.catchersWrapper(this.promise.then((res) => res.text()).then((data) => (cb ? cb(data) : data)));
  }

  /**
   * Wraps the Promise in order to dispatch the error to a matching catcher.
   */
  private async catchersWrapper<T>(promise: Promise<T>): Promise<T | FinalErrorType<ErrorTypes>> {
    return promise.catch((reason) => {
      const fetchErrorFlag = Object.prototype.hasOwnProperty.call(reason, FETCH_ERROR);
      const error = fetchErrorFlag ? reason[FETCH_ERROR] : reason;

      const catcher =
        (error?.status && this.catchers.get(error?.status)) ||
        (error?.name && this.catchers.get(error.name)) ||
        this.catchers.get(FETCH_ERROR);

      if (catcher) {
        return catcher(error);
      }

      if (process.env.NODE_ENV !== 'production') {
        console.error(error);
      }
      throw error;
    });
  }
}
