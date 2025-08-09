import { HttpError } from '~/lib/fetchain/HttpError';
import { HttpStatus } from '~/lib/fetchain/httpStatus';

/**
 * Final config ready for fetch
 */
export type FetchConfig = RequestInit & {
  baseURL: string;
  prefix: string;
  url: string;
  isRouteHandler?: boolean;
};

/**
 * Init config http method
 */
export type FetchConfigInit = Partial<FetchConfig> & {
  data?: BodyInit | Record<string, unknown>;
};

/**
 * Config for http method no body request
 */
export type FetchConfigIgnoreBody = Omit<FetchConfigInit, 'body' | 'data'> & {
  query?: string | URL | Record<string, string | number | boolean> | URLSearchParams;
};

export type FulfilledHandler<T> = (value: T) => T | Promise<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RejectedHandler = (error: any) => any;
export type InterceptorHandler<T> = { onFulfilled?: FulfilledHandler<T> | null; onRejected?: RejectedHandler | null };

/**
 * Error key should symbol or http status (number), it ensure unique key. But type string is an option
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
 */
export type FetchErrorKey = string | symbol | HttpStatus;

/**
 * The handler map key of catcher
 */
export type FetchErrorHandler<T, K> = K extends string ? (error: Error) => T : (error: HttpError) => T;

/**
 * A type utility to determine the final error type. If no catchers are registered,
 * it defaults to HttpError. Otherwise, it's the union of the catchers' return types.
 */
export type FinalErrorType<T> = T extends never ? HttpError : T;
