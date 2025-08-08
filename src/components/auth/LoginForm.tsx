'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { loginAction } from '~/actions/authActions';
import AlertCalloutSuccess from '~/components/auth/AlertCalloutSuccess';
import { useReactivateAccountContext } from '~/components/auth/reactivateAccount/ReactivateAccountProvider';
import ResetPasswordDialog from '~/components/auth/resetPassword/ResetPasswordDialog';
import { Form, FormItem, FormLabel, FormMessage } from '~/components/form';
import { GoogleIcon } from '~/components/icon/GoogleIcon';
import LoadingButton from '~/components/LoadingButton';
import { Button } from '~/components/ui/button';
import { CardContent, CardFooter } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { clientSessionToken } from '~/lib/requests';
import { LoginStatus, resolveRedirectUrl, RoutePath } from '~/lib/route';

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { message: '' });
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectFrom = searchParams.get('redirectFrom');
  const loginStatus = searchParams.get('status');
  const { setValue: setReactivateAccount } = useReactivateAccountContext();

  useEffect(() => {
    if (pending === true) return;

    const description = state.message;
    if (state.error) {
      toast.error('Login Error', { description });
      if (state.isInActivate) {
        setReactivateAccount((prev) => ({ ...prev, email: state.email, open: true }));
      }
      return;
    }
    if (state.accessToken) {
      clientSessionToken.value = state.accessToken;
      toast.success('Auth', { description });
      router.push(resolveRedirectUrl(redirectFrom, RoutePath.Profile, { normalize: true }));
    }
  }, [
    pending,
    state.message,
    state.accessToken,
    router,
    state.isInActivate,
    state.email,
    setReactivateAccount,
    redirectFrom,
    state.error,
  ]);

  return (
    <>
      <CardContent>
        {redirectFrom && <AlertCalloutSuccess>You have been successfully logged out.</AlertCalloutSuccess>}
        {loginStatus === LoginStatus.Activated && (
          <AlertCalloutSuccess>Your account was activated.</AlertCalloutSuccess>
        )}
        {loginStatus === LoginStatus.PasswordChanged && (
          <AlertCalloutSuccess>Your password was changed.</AlertCalloutSuccess>
        )}

        <Form id='loginForm' action={action}>
          <FormItem>
            <FormLabel htmlFor='email' error={state.fieldErrors?.email} required>
              Email
            </FormLabel>
            <Input
              id='email'
              type='email'
              name='email'
              autoComplete='username'
              placeholder='example@email.com'
              required
              defaultValue={state.email}
            />
            <FormMessage name='email' errors={state.fieldErrors} />
          </FormItem>

          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel htmlFor='password' error={state.fieldErrors?.password} required>
                Password
              </FormLabel>
              <ResetPasswordDialog />
            </div>
            <Input
              id='password'
              type='password'
              name='password'
              autoComplete='current-password'
              placeholder='********'
              required
              defaultValue={state.password}
            />
            <FormMessage name='password' errors={state.fieldErrors} />
          </FormItem>
        </Form>
      </CardContent>

      <CardFooter className='flex-col gap-2'>
        <LoadingButton type='submit' form='loginForm' load={pending} className='w-full'>
          Login
        </LoadingButton>

        <div className='flex items-center gap-x-3.5 w-full my-4'>
          <Separator className='flex-1 w-auto' />
          or
          <Separator className='flex-1 w-auto' />
        </div>

        <div className='w-full space-y-2'>
          <Button type='button' variant='outline' className='w-full'>
            <GoogleIcon fill='#4285F4' strokeWidth={0} />
            Continue with Google
          </Button>
        </div>

        <Button type='button' variant='link' asChild>
          <Link href={RoutePath.Register}>Create an account</Link>
        </Button>
      </CardFooter>
    </>
  );
}
