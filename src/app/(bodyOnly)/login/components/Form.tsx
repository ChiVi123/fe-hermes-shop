'use client';

import { CircleCheckBigIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { loginAction } from '~/actions/authActions';
import FormMessage from '~/components/FormMessage';
import { GoogleIcon } from '~/components/icon/GoogleIcon';
import { Alert, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { CardContent, CardFooter } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { clientSessionToken } from '~/lib/requests';
import { RoutePath } from '~/lib/route';

export default function Form() {
  const [state, action, pending] = useActionState(loginAction, { errors: undefined, message: '' });
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectFrom = searchParams.get('redirectFrom');

  useEffect(() => {
    if (pending === true) return;

    const description = state.message;
    if (state.errors) {
      toast.error('Login Error', { description });
      return;
    }
    if (state.accessToken) {
      clientSessionToken.value = state.accessToken;
      toast.success('Auth', { description: state.message });
      router.push(RoutePath.Profile);
    }
  }, [pending, state.errors, state.message, state.accessToken, router]);

  return (
    <>
      <CardContent>
        {redirectFrom && (
          <Alert className='mb-4 bg-emerald-500/10 dark:bg-emerald-600/30 border-0 border-l-[10px] border-l-emerald-600'>
            <CircleCheckBigIcon size={16} className='!text-emerald-500' />
            <AlertTitle>You have been successfully logged out.</AlertTitle>
          </Alert>
        )}

        <form id='loginForm' action={action} noValidate>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                name='email'
                autoComplete='username'
                placeholder='m@example.com'
                required
                defaultValue={state.email}
              />
              <FormMessage errorId='email' error={state.errors} />
            </div>

            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password'>Password</Label>
                <a href='#' className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
                  Forgot your password?
                </a>
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
              <FormMessage errorId='password' error={state.errors} />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className='flex-col gap-2'>
        <Button type='submit' form='loginForm' disabled={pending} className='w-full'>
          {pending && <Loader2Icon className='animate-spin' />}
          {pending ? 'Please wait' : 'Login'}
        </Button>

        <div className='flex items-center gap-x-3.5 w-full my-4'>
          <Separator className='flex-1 w-auto' />
          or
          <Separator className='flex-1 w-auto' />
        </div>

        <div className='w-full space-y-2'>
          <Button variant='outline' className='w-full'>
            <GoogleIcon fill='#4285F4' strokeWidth={0} />
            Continue with Google
          </Button>
        </div>

        <Button variant='link' asChild>
          <Link href={RoutePath.Register}>Create an account</Link>
        </Button>
      </CardFooter>
    </>
  );
}
