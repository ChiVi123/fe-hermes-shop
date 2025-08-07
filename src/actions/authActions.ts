'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import z from 'zod';
import { cookieOptions, TokenName } from '~/constants';
import { HttpStatus, isFetchError } from '~/lib/fetchClient';
import { isString } from '~/lib/fetchClient/utils';
import { apiRequest } from '~/lib/requests';
import { getVerifyEmailPath } from '~/lib/route';
import {
  createServerInvalidResponse,
  createZodResponse,
  FieldErrors,
  fromErrorToFieldErrors,
  isFieldErrors,
  isNonNullable,
} from '~/lib/utils';
import {
  loginFormSchema,
  registerFormSchema,
  sendMailFormSchema,
  verifyEmailSchema,
} from '~/lib/validates/authValidate';
import { User } from '~/types/user';

type LoginValues = z.infer<typeof loginFormSchema>;
type LoginReturnType = Promise<
  {
    errors?: ReturnType<typeof z.flattenError>['fieldErrors'];
    accessToken?: string;
    isInActivate?: boolean;
    message: string;
  } & Partial<LoginValues>
>;
export async function loginAction(_: unknown, formData: FormData): LoginReturnType {
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

    return { errors: result.toJSON(), isInActivate, message, ...obj };
  }

  const cookieStore = await cookies();
  cookieStore.set(TokenName.ACCESS_TOKEN, result.accessToken, cookieOptions);
  cookieStore.set(TokenName.REFRESH_TOKEN, result.refreshToken, cookieOptions);

  return { errors: undefined, message: 'Login successfully', accessToken: result.accessToken, ...obj };
}

type SendMailValues = z.infer<typeof sendMailFormSchema>;
type SendMailReturnType = {
  errors?: ReturnType<typeof z.flattenError>['fieldErrors'];
  _id?: string;
  message: string;
} & Partial<SendMailValues>;
export async function resendMailAction(
  currentState: SendMailReturnType,
  formData: FormData
): Promise<SendMailReturnType> {
  const obj = { toMail: (formData.get('toMail') as string) ?? currentState.toMail };
  const validatedFields = sendMailFormSchema.safeParse(obj);

  if (!validatedFields.success) {
    return createZodResponse(validatedFields, obj);
  }

  const result = await apiRequest
    .post('/api/v1/auth/resend-mail', { data: validatedFields.data })
    .unprocessableEntity((error) => fromErrorToFieldErrors<SendMailValues>(error))
    .fetchError()
    .json<{ _id: string } | FieldErrors<SendMailValues>>();

  if (isFetchError(result)) {
    let message = result.message;
    const { data } = result;
    if (isNonNullable(data) && isString(data.message)) {
      message = data.message;
    }

    return { errors: result.toJSON(), message, ...obj };
  } else if (isFieldErrors(result)) {
    return createServerInvalidResponse(result, obj);
  }

  return { errors: undefined, message: 'Send mail successfully', ...result, ...obj };
}

type RegisterValues = z.infer<typeof registerFormSchema>;
type RegisterReturnType = Promise<
  {
    errors?: ReturnType<typeof z.flattenError>['fieldErrors'];
    message: string;
  } & Partial<RegisterValues>
>;
export async function registerAction(_: unknown, formData: FormData): RegisterReturnType {
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
    let message = result.message;
    const { data } = result;
    if (isNonNullable(data) && isString(data.message)) {
      message = data.message;
    }

    return { errors: result.toJSON(), message, ...obj };
  } else if (isFieldErrors(result)) {
    return createServerInvalidResponse(result, obj);
  }

  redirect(getVerifyEmailPath(result._id));
}

type VerifyEmailValues = z.infer<typeof verifyEmailSchema>;
type VerifyEmailReturnType = Promise<
  {
    errors?: ReturnType<typeof z.flattenError>['fieldErrors'];
    success?: true;
    message: string;
  } & Partial<VerifyEmailValues>
>;
export async function verifyEmailAction(_: unknown, formData: FormData): VerifyEmailReturnType {
  const obj = {
    id: formData.get('id') as string,
    codeId: formData.get('codeId') as string,
  };
  const validatedFields = verifyEmailSchema.safeParse(obj);
  if (!validatedFields.success) {
    return createZodResponse(validatedFields, obj);
  }

  const result = await apiRequest
    .post('/api/v1/auth/verify', { data: validatedFields.data })
    .fetchError()
    .json<{ message: string }>();

  if (isFetchError(result)) {
    let message = result.message;
    const { data } = result;
    if (isNonNullable(data) && isString(data.message)) {
      message = data.message;
    }

    return { errors: result.toJSON(), message, ...obj };
  }

  return { errors: undefined, message: result.message, success: true, ...obj };
}
