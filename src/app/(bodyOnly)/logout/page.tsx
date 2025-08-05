'use client';

import { LoaderCircleIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { getLoginRedirectFrom } from '~/lib/route';
import { logoutClientApi } from '~/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const reason = useMemo(() => new DOMException('Fetching twice', 'Fetching abort'), []);

  useEffect(() => {
    const controller = new AbortController();

    logoutClientApi(controller.signal).finally(() => {
      router.push(getLoginRedirectFrom(pathname));
    });

    return () => {
      controller.abort(reason);
    };
  }, [pathname, reason, router]);

  return (
    <main className='flex justify-center pt-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='pb-4 mb-4 border-b text-2xl text-center font-bold italic'>HermesShop</CardTitle>
          <CardDescription className='flex justify-center items-center gap-2'>
            <LoaderCircleIcon strokeWidth={4} className='animate-[spin_2s_linear_infinite]' />
            <span className='text-xl font-semibold'>Logout...</span>
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
