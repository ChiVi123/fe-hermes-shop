import { FetchError } from '~/lib/fetchClient/FetchError';
import { HttpStatus } from '~/lib/fetchClient/httpStatus';

export type FetchConfig = RequestInit & {
  baseURL: string;
  url: string;
};
export type FetchConfigInit = Omit<FetchConfig, 'method' | 'baseURL' | 'url'> & {
  data?: BodyInit | Record<string, unknown>;
};
export type FetchGetMethodConfig = Omit<FetchConfigInit, 'body' | 'data'> & {
  query?: string | URL | Record<string, string | number | boolean> | URLSearchParams;
};
export type FetchErrorHandler = <T>(error: FetchError) => T | FetchError;
export type FetchErrorKey = string | symbol | HttpStatus;

export type BodyTypeKey = 'blob' | 'formData' | 'arrayBuffer' | 'text' | null;
export type BodyTypeMap = {
  blob: Blob;
  formData: FormData;
  arrayBuffer: ArrayBuffer;
  text: string;
  null: Response;
};
export type GetBaseType<K extends BodyTypeKey> = K extends keyof BodyTypeMap ? BodyTypeMap[K] : Response;
export type InnerParseFunction<TBase> = {
  /**
   * Processes the parsed response body using a provided callback.
   * The callback can return a value directly or a Promise that resolves to a value.
   * The returned Promise will resolve to the final type `U`.
   * @template U The expected final type after the callback is applied and awaited.
   * @param callback A function that receives the parsed data and returns `U` or `Promise<U>`.
   * @returns A Promise that resolves to the type `U`.
   */
  <U>(callback: (data: TBase) => U | Promise<U>): Promise<U | FetchError>;

  /**
   * Returns the parsed response body directly without applying any further transformations.
   * @returns A Promise that resolves to the base parsed type `TBase`.
   */
  (): Promise<TBase | FetchError>;
};
