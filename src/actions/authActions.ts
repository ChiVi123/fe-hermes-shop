'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import z from 'zod';
import { cookieOptions, TokenName } from '~/constants';
import { FetchError, HttpStatus, isFetchError } from '~/lib/fetchClient';
import { apiRequest } from '~/lib/requests';
import { getVerifyEmailPath } from '~/lib/route';
import {
  createServerInvalidResponse,
  createZodResponse,
  FieldErrors,
  fromErrorToFieldErrors,
  isFieldErrors,
  isNonNullable,
  isString,
} from '~/lib/utils';
import {
  changePasswordFormSchema,
  loginFormSchema,
  registerFormSchema,
  retryActiveFormSchema,
  retryPasswordFormSchema,
  verifyAccountFormSchema,
} from '~/lib/validates/authValidate';
import { FormActionResolver, FormActionState } from '~/types/formAction';
import { User } from '~/types/user';

type LoginValues = z.infer<typeof loginFormSchema>;
type LoginResolver = FormActionResolver<LoginValues, { accessToken?: string; isInActivate?: boolean }>;
export const loginAction: FormActionState<LoginResolver> = async (_, formData) => {
  const obj = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };
  const validatedFields = loginFormSchema.safeParse(obj);

  if (!validatedFields.success) {
    return createZodResponse(validatedFields, obj);
  }

  const result = await apiRequest.post('/api/v1/auth/login', { data: validatedFields.data }).fetchError().json<User>();

  if (isFetchError(result)) {
    let message = result.message;
    let isInActivate = false;
    const { data, status } = result;
    if (isNonNullable(data) && isString(data.message)) {
      message = data.message;
      isInActivate = status === HttpStatus.FORBIDDEN && data.message.includes('Account is not active');
    }

    return { error: result.toJSON(), isInActivate, message, ...obj };
  }

  const cookieStore = await cookies();
  cookieStore.set(TokenName.ACCESS_TOKEN, result.accessToken, cookieOptions);
  cookieStore.set(TokenName.REFRESH_TOKEN, result.refreshToken, cookieOptions);

  return { message: 'Login successfully', success: true, accessToken: result.accessToken, ...obj };
};

type RetryActiveValues = z.infer<typeof retryActiveFormSchema>;
type RetryActiveResolver = FormActionResolver<RetryActiveValues, { _id?: string }>;
export const retryActiveAction: FormActionState<RetryActiveResolver> = async (currentState, formData) => {
  const obj = { toMail: (formData.get('toMail') as string) ?? currentState.toMail };
  const validatedFields = retryActiveFormSchema.safeParse(obj);

  if (!validatedFields.success) {
    return createZodResponse(validatedFields, obj);
  }

  const result = await apiRequest
    .post('/api/v1/auth/retry-active', { data: validatedFields.data })
    .unprocessableEntity((error) => fromErrorToFieldErrors<RetryActiveValues>(error))
    .fetchError()
    .json<{ _id: string } | RetryActiveResolver['fieldErrors']>();

  if (isFetchError(result)) {
    return fromFetchErrorToActionError(result, obj);
  } else if (isFieldErrors(result)) {
    return createServerInvalidResponse(result, obj);
  }

  return { message: 'Send mail successfully', success: true, ...result, ...obj };
};

type RegisterValues = z.infer<typeof registerFormSchema>;
type RegisterResolver = FormActionResolver<RegisterValues>;
export const registerAction: FormActionState<RegisterResolver> = async (_, formData) => {
  const obj = {
    email: formData.get('email') as string,
    username: formData.get('username') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };
  const validatedFields = registerFormSchema.safeParse(obj);

  if (!validatedFields.success) {
    return createZodResponse(validatedFields, obj);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirmPassword, ...data } = validatedFields.data;

  const result = await apiRequest
    .post('/api/v1/auth/register', { data })
    .conflict((error) => fromErrorToFieldErrors<RegisterValues>(error))
    .fetchError()
    .json<{ _id: string } | FieldErrors<RegisterValues>>();

  if (isFetchError(result)) {
    return fromFetchErrorToActionError(result, obj);
  } else if (isFieldErrors(result)) {
    return createServerInvalidResponse(result, obj);
  }

  redirect(getVerifyEmailPath(result._id));
};

type VerifyAccountValues = z.infer<typeof verifyAccountFormSchema>;
type VerifyAccountResolver = FormActionResolver<VerifyAccountValues>;
export const verifyAccountAction: FormActionState<VerifyAccountResolver> = async (_, formData) => {
  const obj = {
    userId: formData.get('userId') as string,
    codeId: formData.get('codeId') as string,
  };
  const validatedFields = verifyAccountFormSchema.safeParse(obj);
  if (!validatedFields.success) {
    return createZodResponse(validatedFields, obj);
  }

  const result = await apiRequest
    .post('/api/v1/auth/verify', { data: validatedFields.data })
    .fetchError()
    .json<{ message: string }>();

  if (isFetchError(result)) {
    return fromFetchErrorToActionError(result, obj);
  }

  return { message: result.message, success: true, ...obj };
};

type RetryPasswordValues = z.infer<typeof retryPasswordFormSchema>;
type RetryPasswordResolver = FormActionResolver<RetryPasswordValues, { _id?: string }>;
export const retryPasswordAction: FormActionState<RetryPasswordResolver> = async (currentState, formData) => {
  const obj = { toMail: (formData.get('toMail') as string) ?? currentState.toMail };
  const validatedFields = retryPasswordFormSchema.safeParse(obj);

  if (!validatedFields.success) {
    return createZodResponse(validatedFields, obj);
  }

  const result = await apiRequest
    .post('/api/v1/auth/retry-password', { data: validatedFields.data })
    .unprocessableEntity((error) => fromErrorToFieldErrors<RetryPasswordValues>(error))
    .fetchError()
    .json<{ _id: string } | FieldErrors<RetryPasswordValues>>();

  if (isFetchError(result)) {
    return fromFetchErrorToActionError(result, obj);
  } else if (isFieldErrors(result)) {
    return createServerInvalidResponse(result, obj);
  }

  return { message: 'Send mail successfully', success: true, ...result, ...obj };
};

type ChangePasswordValues = z.infer<typeof changePasswordFormSchema>;
type ChangePasswordResolver = FormActionResolver<ChangePasswordValues>;
export const changePasswordAction: FormActionState<ChangePasswordResolver> = async (currentState, formData) => {
  const obj = {
    userId: (formData.get('userId') as string) ?? currentState.userId,
    codeId: formData.get('codeId') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };
  const validatedFields = changePasswordFormSchema.safeParse(obj);
  if (!validatedFields.success) {
    return createZodResponse(validatedFields, obj);
  }

  const result = await apiRequest
    .post('/api/v1/auth/change-password', { data: validatedFields.data })
    .fetchError()
    .json<{ message: string }>();

  if (isFetchError(result)) {
    return fromFetchErrorToActionError(result, obj);
  }

  return { message: result.message, success: true, ...obj };
};

const fromFetchErrorToActionError = <T>(error: FetchError, obj: T): FormActionResolver<T> => {
  let message = error.message;
  const { data } = error;
  if (isNonNullable(data) && isString(data.message)) {
    message = data.message;
  }

  return { error: error.toJSON(), message, ...obj };
};
