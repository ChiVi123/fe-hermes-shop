'use client';

import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import { RoutePath } from '~/lib/route';

export default function HeaderAccount() {
  return (
    <Link href={RoutePath.Login}>
      <UserIcon />
    </Link>
  );
}
