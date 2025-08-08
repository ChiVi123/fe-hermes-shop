'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { retryActiveAction } from '~/actions/authActions';
import { Form, FormItem, FormLabel, FormMessage } from '~/components/form';
import LoadingButton from '~/components/LoadingButton';
import { Input } from '~/components/ui/input';

interface Props {
  email?: string;
  onSuccess(id: string): void;
}

export default function RetryActivateForm({ email, onSuccess }: Props) {
  const [state, action, pending] = useActionState(retryActiveAction, { message: '', toMail: email });

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
      <p className='my-1 text-muted-foreground text-sm'>Your account is inactivate.</p>

      <Form id='retryActiveForm' action={action}>
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
            readOnly
            required
            defaultValue={state.toMail}
          />
          <FormMessage name='toMail' errors={state.fieldErrors} />
        </FormItem>

        <div>
          <LoadingButton type='submit' form='retryActiveForm' load={pending}>
            Send
          </LoadingButton>
        </div>
      </Form>
    </>
  );
}
