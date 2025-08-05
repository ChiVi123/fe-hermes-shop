'use client';

import { Loader2Icon } from 'lucide-react';
import { useActionState } from 'react';
import { registerAction } from '~/actions/authActions';
import FormMessage from '~/components/FormMessage';
import { Button } from '~/components/ui/button';
import { CardContent, CardFooter } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export default function Form() {
  const [state, action, pending] = useActionState(registerAction, { errors: undefined, message: '' });

  return (
    <>
      <CardContent>
        <form id='signUpForm' noValidate action={action}>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>
                Email<span className='text-destructive'>*</span>
              </Label>
              <Input
                id='email'
                type='email'
                name='email'
                autoComplete='email'
                placeholder='m@example.com'
                required
                defaultValue={state.email}
              />
              <FormMessage errorId='email' error={state.errors} />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='username'>
                Username<span className='text-destructive'>*</span>
              </Label>
              <Input
                id='username'
                type='username'
                name='username'
                autoComplete='username'
                placeholder='username'
                required
                defaultValue={state.username}
              />
              <FormMessage errorId='username' error={state.errors} />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='password'>
                Password<span className='text-destructive'>*</span>
              </Label>
              <Input
                id='password'
                type='password'
                name='password'
                autoComplete='new-password'
                placeholder='********'
                required
                defaultValue={state.password}
              />
              <FormMessage errorId='password' error={state.errors} />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>
                Password confirmation<span className='text-destructive'>*</span>
              </Label>
              <Input
                id='confirmPassword'
                type='password'
                name='confirmPassword'
                autoComplete='new-password'
                placeholder='********'
                required
                defaultValue={state.confirmPassword}
              />
              <FormMessage errorId='confirmPassword' error={state.errors} />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className='flex-col gap-2'>
        <Button type='submit' form='signUpForm' disabled={pending} className='w-full'>
          {pending && <Loader2Icon className='animate-spin' />}
          {pending ? 'Please wait' : 'Create account'}
        </Button>
      </CardFooter>
    </>
  );
}
