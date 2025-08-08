'use client';

import { useActionState } from 'react';
import { registerAction } from '~/actions/authActions';
import { Form, FormItem, FormLabel, FormMessage } from '~/components/form';
import LoadingButton from '~/components/LoadingButton';
import { CardContent, CardFooter } from '~/components/ui/card';
import { Input } from '~/components/ui/input';

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, { message: '' });

  return (
    <>
      <CardContent>
        <Form id='signUpForm' action={action}>
          <FormItem>
            <FormLabel htmlFor='email' error={state.fieldErrors?.email} required>
              Email
            </FormLabel>
            <Input
              id='email'
              type='email'
              name='email'
              autoComplete='email'
              placeholder='example@gmail.com'
              required
              defaultValue={state.email}
            />
            <FormMessage name='email' errors={state.fieldErrors} />
          </FormItem>

          <FormItem>
            <FormLabel htmlFor='username' error={state.fieldErrors?.username} required>
              Username
            </FormLabel>
            <Input
              id='username'
              type='username'
              name='username'
              autoComplete='username'
              placeholder='username'
              required
              defaultValue={state.username}
            />
            <FormMessage name='username' errors={state.fieldErrors} />
          </FormItem>

          <FormItem>
            <FormLabel htmlFor='password' error={state.fieldErrors?.password} required>
              Password
            </FormLabel>
            <Input
              id='password'
              type='password'
              name='password'
              autoComplete='new-password'
              placeholder='********'
              required
              defaultValue={state.password}
            />
            <FormMessage name='password' errors={state.fieldErrors} />
          </FormItem>

          <FormItem>
            <FormLabel htmlFor='confirmPassword' error={state.fieldErrors?.confirmPassword} required>
              Password confirmation
            </FormLabel>
            <Input
              id='confirmPassword'
              type='password'
              name='confirmPassword'
              autoComplete='new-password'
              placeholder='********'
              required
              defaultValue={state.confirmPassword}
            />
            <FormMessage name='confirmPassword' errors={state.fieldErrors} />
          </FormItem>
        </Form>
      </CardContent>

      <CardFooter className='flex-col gap-2'>
        <LoadingButton type='submit' form='signUpForm' load={pending} className='w-full'>
          Create account
        </LoadingButton>
      </CardFooter>
    </>
  );
}
