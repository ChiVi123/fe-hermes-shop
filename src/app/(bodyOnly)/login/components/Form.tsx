'use client';

import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { loginAction } from '~/actions/authActions';
import FormMessage from '~/components/FormMessage';
import { GoogleIcon } from '~/components/icon/GoogleIcon';
import { Button } from '~/components/ui/button';
import { CardContent, CardFooter } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { RoutePath } from '~/lib/route';

export default function Form() {
  const [state, action, pending] = useActionState(loginAction, { errors: undefined, message: '' });

  useEffect(() => {
    if (pending === true) return;

    const description = state.message;
    if (state.errors) {
      toast.error('Login Error', { description });
      return;
    }
  }, [pending, state.errors, state.message, state.success]);

  return (
    <>
      <CardContent>
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
                tabIndex={1}
                required
                defaultValue={state.email}
              />
              <FormMessage errorId='email' error={state.errors} />
            </div>

            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password'>Password</Label>
                <a href='#' tabIndex={5} className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
                  Forgot your password?
                </a>
              </div>
              <Input
                id='password'
                type='password'
                name='password'
                autoComplete='current-password'
                placeholder='********'
                tabIndex={2}
                required
                defaultValue={state.password}
              />
              <FormMessage errorId='password' error={state.errors} />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className='flex-col gap-2'>
        <Button type='submit' form='loginForm' tabIndex={3} disabled={pending} className='w-full'>
          {pending && <Loader2Icon className='animate-spin' />}
          {pending ? 'Please wait' : 'Login'}
        </Button>

        <div className='flex items-center gap-x-3.5 w-full my-4'>
          <Separator className='flex-1 w-auto' />
          or
          <Separator className='flex-1 w-auto' />
        </div>

        <Button variant='outline' tabIndex={4} className='w-full'>
          <GoogleIcon fill='currentColor' strokeWidth={0} />
          Continue with Google
        </Button>

        <Button variant='link' asChild>
          <Link href={RoutePath.Register}>Create an account</Link>
        </Button>
      </CardFooter>
    </>
  );
}
