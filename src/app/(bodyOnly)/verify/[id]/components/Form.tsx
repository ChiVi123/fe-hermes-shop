'use client';

import { ArrowLeftIcon, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { verifyEmailAction } from '~/actions/authActions';
import FormMessage from '~/components/FormMessage';
import { Button } from '~/components/ui/button';
import { CardContent, CardFooter } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { getLoginPath, LoginStatus, RoutePath } from '~/lib/route';

export default function Form() {
  const { id } = useParams();
  const [state, action, pending] = useActionState(verifyEmailAction, { errors: undefined, message: '' });
  const router = useRouter();

  useEffect(() => {
    if (pending === true) return;

    const description = state.message;
    if (state.errors) {
      toast.error('Verify Error', { description });
      return;
    }
    if (state.success) {
      toast.success('Auth', { description });
      router.push(getLoginPath({ status: LoginStatus.Activated }));
    }
  }, [pending, router, state.errors, state.message, state.success]);

  return (
    <>
      <CardContent>
        <form id='signUpForm' noValidate action={action}>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Input
                id='userId'
                name='userId'
                required
                hidden={process.env.NODE_ENV !== 'development'}
                defaultValue={id}
              />
              <FormMessage errorId='userId' error={state.errors} />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='codeId'>
                Verification code<span className='text-destructive'>*</span>
              </Label>
              <Input id='codeId' name='codeId' required defaultValue={state.codeId} />
              <FormMessage errorId='codeId' error={state.errors} />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className='flex-col gap-2'>
        <Button type='submit' form='signUpForm' disabled={pending} className='w-full'>
          {pending && <Loader2Icon className='animate-spin' />}
          {pending ? 'Please wait' : 'Verify'}
        </Button>

        <div className='flex items-center gap-x-3.5 w-full my-4'>
          <Separator className='flex-1 w-auto' />
        </div>

        <Button variant='link' asChild>
          <Link href={RoutePath.Home} className='self-start'>
            <ArrowLeftIcon />
            Back to Home
          </Link>
        </Button>
      </CardFooter>
    </>
  );
}
