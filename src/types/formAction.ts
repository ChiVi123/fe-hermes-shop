import { $ZodFlattenedError } from 'zod/v4/core';

export type FormActionResolver<T, A = unknown> = {
  fieldErrors?: $ZodFlattenedError<T>['fieldErrors'];
  error?: string;
  success?: true;
  message: string;
} & Partial<T & A>;
export type FormActionState<T> = (currentState: T, formData: FormData) => Promise<T>;
