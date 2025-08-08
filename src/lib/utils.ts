import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import z from 'zod';
import { ActionCodeError } from '~/constants';
import { FetchError } from '~/lib/fetchClient';
import { FormActionResolver } from '~/types/formAction';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FieldErrors<T> = {
  [P in keyof T]?: string[];
} & { isFieldErrors: true };

export function fromErrorToFieldErrors<U, T extends FetchError = FetchError>(error: T): T | FieldErrors<U> {
  const { data } = error;
  if (!isNonNullable(data) || !Array.isArray(data.message)) {
    return error;
  }

  const fieldErrors = { isFieldErrors: true } as FieldErrors<U>;
  data.message.forEach((current) => {
    fieldErrors[current.property as keyof U] = current.constraints;
  });
  return fieldErrors;
}
export function isFieldErrors<T>(value: unknown): value is FieldErrors<T> {
  return isObject(value) && 'isFieldErrors' in value && value.isFieldErrors === true;
}
export function createZodResponse<T>(validate: z.ZodSafeParseError<T>, obj: T): FormActionResolver<T> {
  return {
    fieldErrors: z.flattenError(validate.error).fieldErrors,
    message: ActionCodeError.ZOD_INVALID,
    ...obj,
  };
}
export function createServerInvalidResponse<T>(fieldErrors: FieldErrors<T>, obj: T): FormActionResolver<T> {
  return { fieldErrors, message: ActionCodeError.SERVER_INVALID, ...obj };
}

export const isObject = (value: unknown): value is object => typeof value === 'object';
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isNonNullable = <T>(value: T): value is NonNullable<T> => value !== undefined || value !== null;
export const isServer = (): boolean => typeof window === 'undefined';
export const isClient = (): boolean => typeof window !== 'undefined';
