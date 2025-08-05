import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { RoutePath } from '~/lib/route';
import Form from './components/Form';

export const metadata: Metadata = {
  title: 'Register - Hermes Shop',
  description: '',
};

export default function RegisterPage() {
  return (
    <main className='flex justify-center min-h-screen'>
      <Card className='w-full max-w-md my-4'>
        <Link href='/' className='mx-6 text-3xl font-bold italic'>
          HermesShop
        </Link>

        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Already have an account?{' '}
            <Link href={RoutePath.Login} className='text-foreground font-medium hover:underline'>
              Sign in
            </Link>
          </CardDescription>
        </CardHeader>

        <Form />
      </Card>
    </main>
  );
}
