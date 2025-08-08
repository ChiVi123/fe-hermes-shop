'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { verifyAccountAction } from '~/actions/authActions';
import { Form, FormItem, FormLabel, FormMessage } from '~/components/form';
import LoadingButton from '~/components/LoadingButton';
import { Input } from '~/components/ui/input';

interface Props {
  userId?: string;
  onSuccess(): void;
}

export default function VerifyAccountFormDialog({ userId, onSuccess }: Props) {
  const [state, action, pending] = useActionState(verifyAccountAction, { message: '' });

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
      <p className='my-1 text-muted-foreground text-sm'>Enter your code.</p>

      <Form id='verifyMailForm' action={action}>
        <FormItem>
          <Input
            id='userId'
            name='userId'
            required
            hidden={process.env.NODE_ENV !== 'development'}
            defaultValue={userId}
          />
          {process.env.NODE_ENV === 'development' && <FormMessage name='userId' errors={state.fieldErrors} />}
        </FormItem>

        <FormItem>
          <FormLabel htmlFor='codeId' error={state.fieldErrors?.codeId} required>
            Code
          </FormLabel>
          <Input id='codeId' name='codeId' required defaultValue={state.codeId} />
          <FormMessage name='codeId' errors={state.fieldErrors} />
        </FormItem>

        <div>
          <LoadingButton type='submit' form='verifyMailForm' load={pending}>
            Verify
          </LoadingButton>
        </div>
      </Form>
    </>
  );
}
