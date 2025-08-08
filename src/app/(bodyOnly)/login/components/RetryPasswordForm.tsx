'use client';

import { Loader2Icon } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { retryPasswordAction } from '~/actions/authActions';
import FormMessage from '~/components/FormMessage';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

interface Props {
  onSuccess(id: string): void;
}

export default function RetryPasswordForm({ onSuccess }: Props) {
  const [state, action, pending] = useActionState(retryPasswordAction, {
    errors: undefined,
    message: '',
  });

  useEffect(() => {
    if (pending === true) return;

    const description = state.message;
    if (state.errors) {
      toast.error('Auth Error', { description });
      return;
    }
    if (state._id) {
      toast.success('Auth', { description });
      onSuccess(state._id);
    }
  }, [onSuccess, pending, state._id, state.errors, state.message]);

  return (
    <>
      <p className='my-1 text-muted-foreground text-sm'>Enter your email for process change password.</p>

      <form id='retryPasswordForm' action={action} noValidate>
        <div className='grid grid-cols-1 gap-6'>
          <div className='grid gap-2'>
            <Label htmlFor='toMail'>Email</Label>
            <Input
              id='toMail'
              type='email'
              name='toMail'
              autoComplete='username'
              placeholder='example@gmail.com'
              required
              defaultValue={state.toMail}
            />
            <FormMessage errorId='toMail' error={state.errors} />
          </div>

          <div>
            {/* TODO: refactor to reuse button */}
            <Button type='submit' form='retryPasswordForm' disabled={pending}>
              {pending && <Loader2Icon className='animate-spin' />}
              {pending ? 'Please wait' : 'Send'}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
