'use client';

import { Loader2Icon } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { changePasswordAction } from '~/actions/authActions';
import FormMessage from '~/components/FormMessage';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

interface Props {
  userId?: string;
  onSuccess(): void;
}

export default function ChangePasswordForm({ userId, onSuccess }: Props) {
  const [state, action, pending] = useActionState(changePasswordAction, { errors: undefined, message: '' });

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
      <p className='my-1 text-muted-foreground text-sm'>Enter your code, and type new password.</p>

      <form id='changePasswordForm' action={action} noValidate>
        <div className='grid grid-cols-1 gap-6'>
          <div className='grid gap-2'>
            <Input
              id='userId'
              name='userId'
              required
              hidden={process.env.NODE_ENV !== 'development'}
              defaultValue={userId}
            />
            <FormMessage errorId='userId' error={state.errors} />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='codeId'>
              Code<span className='text-destructive'>*</span>
            </Label>
            <Input id='codeId' name='codeId' autoComplete='username' required defaultValue={state.codeId} />
            <FormMessage errorId='codeId' error={state.errors} />
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

          <div>
            <Button type='submit' form='changePasswordForm' disabled={pending}>
              {pending && <Loader2Icon className='animate-spin' />}
              {pending ? 'Please wait' : 'Change'}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
