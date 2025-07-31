import queryString from 'query-string';
import { ContentType, FetchMethod, HeaderKeys } from '~/lib/fetchClient/constants';
import { FetchError } from '~/lib/fetchClient/FetchError';
import { FetchConfig, FetchConfigInit, FetchGetMethodConfig } from '~/lib/fetchClient/types';

const isAbsoluteURL = (url: string): boolean => {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};
export const combineURLs = (baseURL: string, relativeURL: string): string => {
  return relativeURL ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};
export const createFullPath = (baseURL: string, requestedURL: string): string => {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }

  return requestedURL;
};
export const joinQueryToURL = (url: string, query?: FetchGetMethodConfig['query']): string => {
  if (!query) {
    return url;
  }
  if (typeof query === 'string') {
    return query.startsWith('?') ? `${url}${query}` : `${url}?${query}`;
  }
  if (query instanceof URL) {
    return `${url}${query.search}`;
  }
  if (query instanceof URLSearchParams) {
    return `${url}?${query.toString()}`;
  }

  return queryString.stringifyUrl({ url, query });
};
export const mergeHeaders = (...headerSources: HeadersInit[]): Record<string, string> => {
  const merged: Record<string, string> = {};

  for (const source of headerSources) {
    if (source instanceof Headers) {
      source.forEach((value, key) => {
        merged[key] = value;
      });
    } else if (Array.isArray(source)) {
      source.forEach(([key, value]) => {
        merged[key] = value;
      });
    } else {
      Object.entries(source).forEach(([key, value]) => {
        merged[key] = value;
      });
    }
  }

  return merged;
};

type Meta = { url: string; method: FetchMethod; data?: BodyInit | Record<string, unknown> };
type MergeConfigFn = (meta: Meta, original: FetchConfig, ...configs: FetchConfigInit[]) => FetchConfig;

export const mergeConfig: MergeConfigFn = ({ data, ...meta }, original, ...configs) => {
  const headerList: HeadersInit[] = [];
  let body: BodyInit | null | undefined = null;

  if (original.headers) {
    headerList.push(original.headers);
  }
  if (data) {
    const headerForBody = {};
    body = transformRequest(headerForBody, data);
    headerList.push(headerForBody);
  }

  const mergedConfig = configs.reduce<FetchConfig>(
    (acc, { headers, ...items }) => {
      if (headers) {
        headerList.push(headers);
      }
      return { ...acc, ...items };
    },
    { ...original, ...meta }
  );
  const mergedHeaders = mergeHeaders(...headerList);

  mergedConfig.headers = mergedHeaders;
  mergedConfig.body = body;
  return mergedConfig;
};

export const isFetchError = (value: unknown): value is FetchError => {
  return typeof FetchError !== 'undefined' && value instanceof FetchError;
};
export const isObject = (value: unknown): value is object => {
  return typeof value === 'object';
};
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};
const isFormData = (value: unknown): value is FormData => {
  return typeof FormData !== 'undefined' && value instanceof FormData;
};
const isHTMLForm = (value: unknown): value is HTMLFormElement => {
  return typeof HTMLFormElement !== 'undefined' && value instanceof HTMLFormElement;
};
const isFile = (value: unknown): value is File => {
  return typeof File !== 'undefined' && value instanceof File;
};
const isBlob = (value: unknown): value is Blob => {
  return typeof Blob !== 'undefined' && value instanceof Blob;
};
/**
 * Set content type application/x-www-form-urlencoded;charset=utf-8.
 *
 * @returns {boolean}
 */
const isURLSearchParams = (value: unknown): value is URLSearchParams => {
  return typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams;
};
const isBuffer = (value: unknown): value is Buffer => {
  return typeof Buffer !== 'undefined' && value instanceof Buffer;
};
const isArrayBufferView = (value: unknown): value is ArrayBufferView => {
  return ArrayBuffer.isView(value);
};
const isArrayBuffer = (value: unknown): value is ArrayBuffer => {
  return Object.prototype.toString.call(value) === '[object ArrayBuffer]';
};
const isNodeReadableStream = (value: unknown): value is ReadableStream => {
  return (
    typeof require !== 'undefined' &&
    (() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Readable } = require('stream');
        return value instanceof Readable;
      } catch {
        return false;
      }
    })()
  );
};
const isWebReadableStream = (value: unknown): value is ReadableStream => {
  return typeof ReadableStream !== 'undefined' && value instanceof ReadableStream;
};
const isReadableStream = (value: unknown): value is ReadableStream => {
  return isWebReadableStream(value) || isNodeReadableStream(value);
};

type TransformRequest = (headers: Record<string, string>, data: BodyInit | Record<string, unknown>) => BodyInit;
const transformRequest: TransformRequest = (headers, data) => {
  if (isHTMLForm(data)) {
    return new FormData(data);
  }

  if (
    isFormData(data) ||
    isArrayBuffer(data) ||
    isBuffer(data) ||
    isFile(data) ||
    isBlob(data) ||
    isReadableStream(data) ||
    isArrayBufferView(data) // may you will return data.buffer
  ) {
    return data;
  }

  if (isURLSearchParams(data)) {
    headers[HeaderKeys.ContentType] = ContentType.Json;
    return data.toString();
  }

  headers[HeaderKeys.ContentType] = ContentType.Json;
  return isString(data) ? data : JSON.stringify(data);
};
