'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { retryPasswordAction } from '~/actions/authActions';
import { Form, FormItem, FormLabel, FormMessage } from '~/components/form';
import LoadingButton from '~/components/LoadingButton';
import { Input } from '~/components/ui/input';

interface Props {
  onSuccess(id: string): void;
}

export default function RetryPasswordForm({ onSuccess }: Props) {
  const [state, action, pending] = useActionState(retryPasswordAction, { message: '' });

  useEffect(() => {
    if (pending === true) return;

    const description = state.message;
    if (state.error) {
      toast.error('Auth Error', { description });
      return;
    }
    if (state._id) {
      toast.success('Auth', { description });
      onSuccess(state._id);
    }
  }, [onSuccess, pending, state._id, state.error, state.message]);

  return (
    <>
      <p className='my-1 text-muted-foreground text-sm'>Enter your email for process change password.</p>

      <Form id='retryPasswordForm' action={action}>
        <FormItem>
          <FormLabel htmlFor='toMail' error={state.fieldErrors?.toMail} required>
            Email
          </FormLabel>
          <Input
            id='toMail'
            type='email'
            name='toMail'
            autoComplete='username'
            placeholder='example@gmail.com'
            required
            defaultValue={state.toMail}
          />
          <FormMessage name='toMail' errors={state.fieldErrors} />
        </FormItem>

        <div>
          <LoadingButton type='submit' form='retryPasswordForm' load={pending}>
            Send
          </LoadingButton>
        </div>
      </Form>
    </>
  );
}
