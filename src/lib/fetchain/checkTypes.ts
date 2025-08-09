import { HttpError } from '~/lib/fetchain/HttpError';

export const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};
export const isHttpError = (value: unknown): value is HttpError => {
  return typeof HttpError !== 'undefined' && value instanceof HttpError;
};
export const isObject = (value: unknown): value is object => {
  return typeof value === 'object';
};
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};
export const isFormData = (value: unknown): value is FormData => {
  return typeof FormData !== 'undefined' && value instanceof FormData;
};
export const isHTMLForm = (value: unknown): value is HTMLFormElement => {
  return typeof HTMLFormElement !== 'undefined' && value instanceof HTMLFormElement;
};
export const isFile = (value: unknown): value is File => {
  return typeof File !== 'undefined' && value instanceof File;
};
export const isBlob = (value: unknown): value is Blob => {
  return typeof Blob !== 'undefined' && value instanceof Blob;
};
/**
 * Set content type application/x-www-form-urlencoded;charset=utf-8.
 *
 * @returns {boolean}
 */
export const isURLSearchParams = (value: unknown): value is URLSearchParams => {
  return typeof URLSearchParams !== 'undefined' && value instanceof URLSearchParams;
};
export const isArrayBufferView = (value: unknown): value is ArrayBufferView => {
  return ArrayBuffer.isView(value);
};
export const isArrayBuffer = (value: unknown): value is ArrayBuffer => {
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
export const isReadableStream = (value: unknown): value is ReadableStream => {
  return isWebReadableStream(value) || isNodeReadableStream(value);
};
