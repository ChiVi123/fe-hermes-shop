'use client';

import { Loader2Icon } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { resendMailAction } from '~/actions/authActions';
import FormMessage from '~/components/FormMessage';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

interface Props {
  email?: string;
  onSuccess(id: string): void;
}

export default function ResendMailForm({ email, onSuccess }: Props) {
  const [state, action, pending] = useActionState(resendMailAction, { errors: undefined, message: '', toMail: email });

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
      <p className='my-1 text-muted-foreground text-sm'>Your account is inactivate.</p>

      <form id='sendMailForm' action={action} noValidate>
        <div className='grid grid-cols-1 gap-6'>
          <div className='grid gap-2'>
            <Label htmlFor='toMail'>Email</Label>
            <Input
              id='toMail'
              type='email'
              name='toMail'
              autoComplete='username'
              placeholder='example@gmail.com'
              disabled
              required
              defaultValue={state.toMail}
            />
            <FormMessage errorId='toMail' error={state.errors} />
          </div>

          <div>
            <Button type='submit' form='sendMailForm' disabled={pending}>
              {pending && <Loader2Icon className='animate-spin' />}
              {pending ? 'Please wait' : 'Send'}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
