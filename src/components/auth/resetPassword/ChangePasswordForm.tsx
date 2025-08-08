'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { changePasswordAction } from '~/actions/authActions';
import { Form, FormItem, FormLabel, FormMessage } from '~/components/form';
import LoadingButton from '~/components/LoadingButton';
import { Input } from '~/components/ui/input';

interface Props {
  userId?: string;
  onSuccess(): void;
}

export default function ChangePasswordForm({ userId, onSuccess }: Props) {
  const [state, action, pending] = useActionState(changePasswordAction, { message: '', userId });

  useEffect(() => {
    if (pending === true) return;

    const description = state.message;
    if (state.error) {
      toast.error('Auth Error', { description });
      return;
    }
    if (state.success) {
      toast.success('Auth', { description });
      onSuccess();
    }
  }, [onSuccess, pending, state.error, state.message, state.success]);

  return (
    <>
      <p className='my-1 text-muted-foreground text-sm'>Enter your code, and type new password.</p>

      <Form id='changePasswordForm' action={action}>
        <FormItem>
          <Input
            id='userId'
            name='userId'
            hidden={process.env.NODE_ENV !== 'development'}
            readOnly
            required
            defaultValue={state.userId}
          />
          {process.env.NODE_ENV === 'development' && <FormMessage name='userId' errors={state.fieldErrors} />}
        </FormItem>

        <FormItem>
          <FormLabel htmlFor='codeId' error={state.fieldErrors?.codeId} required>
            Code
          </FormLabel>
          <Input id='codeId' name='codeId' autoComplete='username' required defaultValue={state.codeId} />
          <FormMessage name='codeId' errors={state.fieldErrors} />
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

        <div>
          <LoadingButton type='submit' form='changePasswordForm' load={pending}>
            Change
          </LoadingButton>
        </div>
      </Form>
    </>
  );
}
