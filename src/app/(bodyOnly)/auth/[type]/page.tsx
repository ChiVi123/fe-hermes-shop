import Link from 'next/link';
import { ReactNode } from 'react';
import LoginForm from '~/components/auth/LoginForm';
import ReactivateAccountDialog from '~/components/auth/reactivateAccount/ReactivateAccountDialog';
import { ReactivateAccountProvider } from '~/components/auth/reactivateAccount/ReactivateAccountProvider';
import RegisterForm from '~/components/auth/RegisterForm';
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { AuthType, RoutePath } from '~/lib/route';

const AUTH_TYPE_MAP: Map<string, { title: ReactNode; description: ReactNode; form: ReactNode }> = new Map();

AUTH_TYPE_MAP.set(AuthType.Login, {
  title: <CardTitle>Login to your account</CardTitle>,
  description: <CardDescription>Enter your email below to login to your account</CardDescription>,
  form: <LoginForm />,
});
AUTH_TYPE_MAP.set(AuthType.Register, {
  title: <CardTitle>Create account</CardTitle>,
  description: (
    <CardDescription>
      Already have an account?{' '}
      <Link href={RoutePath.Login} className='text-foreground font-medium hover:underline'>
        Sign in
      </Link>
    </CardDescription>
  ),
  form: <RegisterForm />,
});

export default async function AuthPage({ params }: { params: Promise<{ type: string }> }) {
  const { type: authType } = await params;

  return (
    <ReactivateAccountProvider>
      <Card className='w-full max-w-md my-4'>
        <Link href='/' className='mx-6 text-3xl font-bold italic'>
          HermesShop
        </Link>

        <CardHeader>
          {AUTH_TYPE_MAP.get(authType)?.title}
          {AUTH_TYPE_MAP.get(authType)?.description}
        </CardHeader>

        {AUTH_TYPE_MAP.get(authType)?.form}
      </Card>

      <ReactivateAccountDialog />
    </ReactivateAccountProvider>
  );
}
