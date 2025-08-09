'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import z from 'zod';
import { cookieOptions, TokenName } from '~/constants';
import { HttpError, isHttpError } from '~/lib/fetchain';
import { apiRequest } from '~/lib/requests';
import { getVerifyEmailPath } from '~/lib/route';
import {
  createServerInvalidResponse,
  createZodResponse,
  FieldErrors,
  isNonNullable,
  isObject,
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

  const result = await apiRequest
    .post('/auth/login', { data: validatedFields.data })
    .forbidden((error) => {
      let message = error.message;
      let isInActivate = false;
      const { body } = error;
      if (isNonNullable(body) && isObject(body) && 'message' in body && isString(body.message)) {
        message = body.message;
        isInActivate = body.message.includes('Account is not active');
      }
      return { error: error.toJSON(), isInActivate, message, ...obj } as LoginResolver;
    })
    .fetchError((error) => {
      let message = error.message;
      const { body } = error;
      if (isNonNullable(body) && isObject(body) && 'message' in body && isString(body.message)) {
        message = body.message;
      }

      return { error: error.toJSON(), message, ...obj } as LoginResolver;
    })
    .json(async (user: User) => {
      const cookieStore = await cookies();
      cookieStore.set(TokenName.ACCESS_TOKEN, user.accessToken, cookieOptions);
      cookieStore.set(TokenName.REFRESH_TOKEN, user.refreshToken, cookieOptions);
      return { message: 'Login successfully', success: true, accessToken: user.accessToken, ...obj } as LoginResolver;
    });

  return result;
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
    .post('/auth/retry-active', { data: validatedFields.data })
    .unprocessableEntity((error) => {
      const fieldErrors = fromErrorToFieldErrors<RetryActiveValues>(error);
      if (isHttpError(fieldErrors)) {
        throw fieldErrors;
      }
      return createServerInvalidResponse(fieldErrors, obj);
    })
    .fetchError((error) => fromFetchErrorToActionError(error, obj))
    .json((data: { _id: string }) => {
      return { message: 'Send mail successfully', success: true, ...data, ...obj } as RetryActiveResolver;
    });

  return result;
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
    .post('/auth/register', { data })
    .conflict((error) => {
      const fieldErrors = fromErrorToFieldErrors<RegisterValues>(error);
      if (isHttpError(fieldErrors)) {
        throw fieldErrors;
      }
      return createServerInvalidResponse(fieldErrors, obj);
    })
    .fetchError((error) => fromFetchErrorToActionError(error, obj))
    .json((data: { _id: string }) => data._id);

  if (isString(result)) {
    redirect(getVerifyEmailPath(result));
  } else {
    return result;
  }
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
    .post('/auth/verify', { data: validatedFields.data })
    .fetchError((error) => fromFetchErrorToActionError(error, obj))
    .json((data: { message: string }) => ({ message: data.message, success: true, ...obj } as VerifyAccountResolver));

  return result;
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
    .post('/auth/retry-password', { data: validatedFields.data })
    .unprocessableEntity((error) => {
      const fieldErrors = fromErrorToFieldErrors<RetryPasswordValues>(error);
      if (isHttpError(fieldErrors)) {
        throw fieldErrors;
      }
      return createServerInvalidResponse(fieldErrors, obj);
    })
    .fetchError((error) => fromFetchErrorToActionError(error, obj))
    .json((data: { _id: string }) => {
      return { message: 'Send mail successfully', success: true, ...data, ...obj } as RetryPasswordResolver;
    });

  return result;
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
    .post('/auth/change-password', { data: validatedFields.data })
    .fetchError((error) => fromFetchErrorToActionError(error, obj))
    .json((data: { message: string }) => ({ message: data.message, success: true, ...obj } as ChangePasswordResolver));

  return result;
};

const fromFetchErrorToActionError = <T>(error: HttpError, obj: T): FormActionResolver<T> => {
  let message = error.message;
  const { body } = error;
  if (isNonNullable(body) && isObject(body) && 'message' in body && isString(body.message)) {
    message = body.message;
  }

  return { error: error.toJSON(), message, ...obj };
};
const fromErrorToFieldErrors = <U, T extends HttpError = HttpError>(error: T): T | FieldErrors<U> => {
  const { body } = error;
  if (!isNonNullable(body) || !('message' in body) || !Array.isArray(body.message)) {
    return error;
  }

  const fieldErrors = { isFieldErrors: true } as FieldErrors<U>;
  body.message.forEach((current) => {
    fieldErrors[current.property as keyof U] = current.constraints;
  });
  return fieldErrors;
};
