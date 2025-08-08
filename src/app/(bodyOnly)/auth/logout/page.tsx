'use client';

import { LoaderCircleIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { getLoginPath } from '~/lib/route';
import { logoutClientApi } from '~/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const reason = useMemo(() => new DOMException('Fetching twice', 'Fetching abort'), []);

  useEffect(() => {
    const controller = new AbortController();

    logoutClientApi(controller.signal).finally(() => {
      router.push(getLoginPath({ redirectFrom: pathname }));
    });

    return () => {
      controller.abort(reason);
    };
  }, [pathname, reason, router]);

  return (
    <Card className='self-start w-full max-w-sm mt-8'>
      <CardHeader>
        <CardTitle className='pb-4 mb-4 border-b text-2xl text-center font-bold italic'>HermesShop</CardTitle>
        <CardDescription className='flex justify-center items-center gap-2'>
          <LoaderCircleIcon strokeWidth={4} className='animate-[spin_2s_linear_infinite]' />
          <span className='text-xl font-semibold'>Logout...</span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
