'use client';

import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from '~/components/Image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { FALLBACK_AVATAR_URL } from '~/constants';
import { clientSessionToken } from '~/lib/requests';
import { getLoginRedirectFrom, RoutePath } from '~/lib/route';
import { logoutClientApi } from '~/services/auth';

export default function HeaderAccount({ accessToken }: { accessToken?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = Boolean(accessToken || clientSessionToken.value);

  const handleLogout = () => {
    logoutClientApi().finally(() => {
      router.push(getLoginRedirectFrom(pathname));
    });
  };

  return (
    <DropdownMenu>
      {/* NOTE: prevent warning hydrate */}
      <DropdownMenuTrigger disabled={!isAuthenticated} asChild={!isAuthenticated}>
        {isAuthenticated ? (
          <Image
            src={FALLBACK_AVATAR_URL} // TODO: replace user.avatar
            alt='avatar'
            width={24}
            height={24}
            fallback={FALLBACK_AVATAR_URL}
          />
        ) : (
          <Link href={RoutePath.Login}>
            <UserIcon />
          </Link>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={RoutePath.Profile}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
