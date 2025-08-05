import ms from 'ms';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const FALLBACK_IMAGE_URL = '/images/fallback.png';
export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!';
export const EMAIL_RULE_MESSAGE = 'Email is invalid. (example@gmail.com)';
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/;
export const PASSWORD_RULE_MESSAGE = 'Password must include at least 1 letter, a number, and at least 8 characters.';
export const PASSWORD_CONFIRMATION_MESSAGE = 'Password confirmation does not match!';

export enum TokenName {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}
export enum ActionCodeError {
  ZOD_INVALID = 'ERR_ZOD_INVALID',
  SERVER_INVALID = 'ERR_SERVER_INVALID',
}

export const cookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: ms((process.env.NEXT_PUBLIC_COOKIE_MAX_AGE as ms.StringValue) ?? '14d'),
};
