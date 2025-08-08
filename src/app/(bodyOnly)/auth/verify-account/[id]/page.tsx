import { Metadata } from 'next';
import Link from 'next/link';
import VerifyAccountForm from '~/components/auth/VerifyAccountForm';
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export const metadata: Metadata = {
  title: 'Verify account - Hermes Shop',
  description: '',
};

export default function VerifyPage() {
  return (
    <main className='flex justify-center items-center min-h-screen'>
      <Card className='w-full max-w-md my-4'>
        <Link href='/' className='mx-6 text-3xl font-bold italic'>
          HermesShop
        </Link>

        <CardHeader>
          <CardTitle>Email verification</CardTitle>
          <CardDescription>
            Check the email that&apos;s associated with your account for the verification code.
          </CardDescription>
        </CardHeader>

        <VerifyAccountForm />
      </Card>
    </main>
  );
}
