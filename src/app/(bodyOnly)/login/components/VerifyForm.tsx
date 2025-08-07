'use client';

import { Loader2Icon } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { verifyEmailAction } from '~/actions/authActions';
import FormMessage from '~/components/FormMessage';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

interface Props {
  id?: string;
  onSuccess(): void;
}

export default function VerifyForm({ id, onSuccess }: Props) {
  const [state, action, pending] = useActionState(verifyEmailAction, { errors: undefined, message: '' });

  useEffect(() => {
    if (pending === true) return;

    const description = state.message;
    if (state.errors) {
      toast.error('Auth Error', { description });
      return;
    }
    if (state.success) {
      toast.success('Auth', { description });
      onSuccess();
    }
  }, [onSuccess, pending, state.errors, state.message, state.success]);

  return (
    <>
      <p className='my-1 text-muted-foreground text-sm'>Enter your code.</p>

      <form id='sendMailForm' action={action} noValidate>
        <div className='grid grid-cols-1 gap-6'>
          <div className='grid gap-2'>
            <Input id='id' name='id' required hidden={process.env.NODE_ENV !== 'development'} defaultValue={id} />
            <FormMessage errorId='id' error={state.errors} />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='codeId'>Code</Label>
            <Input id='codeId' name='codeId' required defaultValue={state.id} />
            <FormMessage errorId='codeId' error={state.errors} />
          </div>

          <div>
            <Button type='submit' form='sendMailForm' disabled={pending}>
              {pending && <Loader2Icon className='animate-spin' />}
              {pending ? 'Please wait' : 'Verify'}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
