'use client';

import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { verifyAccountAction } from '~/actions/authActions';
import { Form, FormItem, FormLabel, FormMessage } from '~/components/form';
import LoadingButton from '~/components/LoadingButton';
import { Button } from '~/components/ui/button';
import { CardContent, CardFooter } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { getLoginPath, LoginStatus, RoutePath } from '~/lib/route';

export default function VerifyAccountForm() {
  const { id } = useParams();
  const [state, action, pending] = useActionState(verifyAccountAction, { fieldErrors: undefined, message: '' });
  const router = useRouter();

  useEffect(() => {
    if (pending === true) return;

    const description = state.message;
    if (state.error) {
      toast.error('Verify Error', { description });
      return;
    }
    if (state.success) {
      toast.success('Auth', { description });
      router.push(getLoginPath({ status: LoginStatus.Activated }));
    }
  }, [pending, router, state.error, state.message, state.success]);

  return (
    <>
      <CardContent>
        <Form id='verifyForm' action={action}>
          <FormItem>
            <Input
              id='userId'
              name='userId'
              required
              hidden={process.env.NODE_ENV !== 'development'}
              defaultValue={id}
            />
            {process.env.NODE_ENV === 'development' && <FormMessage name='userId' errors={state.fieldErrors} />}
          </FormItem>

          <FormItem>
            <FormLabel htmlFor='codeId' error={state.fieldErrors?.codeId} required>
              Verification code
            </FormLabel>
            <Input id='codeId' name='codeId' required defaultValue={state.codeId} />
            <FormMessage name='codeId' errors={state.fieldErrors} />
          </FormItem>
        </Form>
      </CardContent>

      <CardFooter className='flex-col gap-2'>
        <LoadingButton type='submit' form='verifyForm' load={pending} className='w-full'>
          Verify
        </LoadingButton>

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
