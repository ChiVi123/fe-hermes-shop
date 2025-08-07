import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import DialogActivateAccount from './components/DialogActivateAccount';
import LoginForm from './components/LoginForm';
import { ResendEmailProvider } from './components/ResendEmailProvider';

export const metadata: Metadata = {
  title: 'Login - Hermes Shop',
  description: '',
};

export default function LoginPage() {
  return (
    <main className='flex justify-center min-h-screen'>
      <ResendEmailProvider>
        <Card className='w-full max-w-sm my-4'>
          <Link href='/' className='mx-6 text-3xl font-bold italic'>
            HermesShop
          </Link>

          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
          </CardHeader>

          <LoginForm />
        </Card>

        <DialogActivateAccount />
      </ResendEmailProvider>
    </main>
  );
}
