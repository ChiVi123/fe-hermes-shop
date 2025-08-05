import { z } from 'zod';
import {
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from '~/constants';

export const loginFormSchema = z.object({
  email: z.email({ message: EMAIL_RULE_MESSAGE }).trim(),
  password: z.string().regex(PASSWORD_RULE, PASSWORD_RULE_MESSAGE).trim(),
});
export const registerFormSchema = z
  .object({
    email: z.email(EMAIL_RULE_MESSAGE).trim(),
    username: z.string().trim().nonempty('Please enter an username'),
    password: z.string().regex(PASSWORD_RULE, PASSWORD_RULE_MESSAGE).trim(),
    confirmPassword: z.string().regex(PASSWORD_RULE, PASSWORD_RULE_MESSAGE).trim(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({ code: 'custom', message: PASSWORD_CONFIRMATION_MESSAGE, path: ['confirmPassword'] });
    }
  });
export const verifyEmailSchema = z.object({
  id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE).trim(),
  codeId: z.string('Please enter the verify code').trim().nonempty('Please enter the verify code'),
});
