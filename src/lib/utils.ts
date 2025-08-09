import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import z from 'zod';
import { ActionCodeError } from '~/constants';
import { FormActionResolver } from '~/types/formAction';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FieldErrors<T> = {
  [P in keyof T]?: string[];
} & { isFieldErrors: true };

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
