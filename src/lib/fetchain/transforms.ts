import queryString from 'query-string';
import {
  isArrayBuffer,
  isArrayBufferView,
  isBlob,
  isFile,
  isFormData,
  isHTMLForm,
  isReadableStream,
  isString,
  isURLSearchParams,
} from '~/lib/fetchain/checkTypes';
import { ContentType, HeaderKeys } from '~/lib/fetchain/constants';
import { FetchConfigIgnoreBody } from '~/lib/fetchain/types';

const isAbsoluteURL = (url: string): boolean => {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};
export const combineURLs = (baseURL: string, relativeURL: string): string => {
  return relativeURL ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};
export const createFullPath = (baseURL: string, requestedURL?: string): string => {
  if (!requestedURL) return '';

  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }

  return requestedURL;
};
export const queryToString = (url: string, query?: FetchConfigIgnoreBody['query']): string => {
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

type TransformRequest = (headers: Record<string, string>, data: BodyInit | Record<string, unknown>) => BodyInit;
export const transformRequest: TransformRequest = (headers, data) => {
  if (isHTMLForm(data)) {
    return new FormData(data);
  }

  if (isFormData(data) || isArrayBuffer(data) || isFile(data) || isBlob(data) || isReadableStream(data)) {
    return data;
  }

  if (isArrayBufferView(data)) {
    return data.buffer;
  }

  if (isURLSearchParams(data)) {
    headers[HeaderKeys.ContentType] = ContentType.Json;
    return data.toString();
  }

  headers[HeaderKeys.ContentType] = ContentType.Json;
  return isString(data) ? data : JSON.stringify(data);
};
