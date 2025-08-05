'use client';

import { CircleAlertIcon, PlusIcon } from 'lucide-react';
import { Alert, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { useFetch } from '~/hooks/fetch';
import { isFetchError } from '~/lib/fetchClient';
import { getAllAddressClientApi, getMeExternalApi } from '~/services/users';

export default function Addresses() {
  const result = useFetch(getAllAddressClientApi, []);
  const user = useFetch(getMeExternalApi, null);

  return (
    <div className='mx-7 p-5 bg-accent rounded-2xl space-y-2'>
      <div className='flex items-center gap-x-1.5 mb-5'>
        <div className='text-2xl font-semibold'>Addresses</div>
        <Button variant='ghost' className='font-bold'>
          <PlusIcon />
          Add for {isFetchError(user) || user?.email}
        </Button>
      </div>

      {isFetchError(result) && (
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>No addresses added</AlertTitle>
        </Alert>
      )}

      <div className='grid grid-cols-12 gap-x-4 gap-y-2 -mx-2'>
        {Array.isArray(result) &&
          result.map((item, index) => (
            <div
              key={index}
              className='col-span-3 p-2 rounded-lg transition-[background-color] duration-700 hover:bg-accent'
            >
              <div className='flex flex-col flex-start cursor-pointer'>
                {item.isDefault && <div className='font-semibold text-muted-foreground'>Default address</div>}
                <div className='text-sm font-semibold'>{`${item.firstName} ${item.lastName}`}</div>
                <div className='text-sm font-semibold'>{item.district}</div>
                <div className='text-sm font-semibold'>{item.ward}</div>
                <div className='text-sm font-semibold'>{item.province}</div>
                <div className='text-sm font-semibold'>{item.country}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
