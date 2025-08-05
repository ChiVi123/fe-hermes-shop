import { SearchIcon, ShoppingCartIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import HeaderAccount from '~/components/layout/HeaderAccount';
import { Separator } from '~/components/ui/separator';
import { TokenName } from '~/constants';

export default async function Header() {
  const accessToken = (await cookies()).get(TokenName.ACCESS_TOKEN)?.value;
  return (
    <header>
      <div className='flex justify-between items-center px-7 py-3 shadow-black/9 shadow-[0px_2px_24px_0px]'>
        <nav className='flex items-center gap-8'>
          <Link href='/' className='font-bold hover:underline'>
            Men
          </Link>
          <Link href='/' className='font-bold hover:underline'>
            Women
          </Link>
          <Link href='/' className='font-bold text-red-900 hover:underline'>
            Sale
          </Link>
        </nav>

        <h1 className='text-3xl font-bold italic'>HermesShop</h1>

        <div className='flex items-center gap-6 h-6'>
          <Link href='/' className='font-bold hover:underline'>
            ReRun
          </Link>

          <Separator orientation='vertical' />

          <div className='flex items-center gap-4'>
            <SearchIcon />
            <HeaderAccount accessToken={accessToken} />
            <ShoppingCartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
