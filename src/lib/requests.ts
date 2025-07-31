import { FetchClient } from '~/lib/fetchClient';

export const apiRequest = new FetchClient(process.env.NEXT_PUBLIC_SERVER_API || '', {
  headers: {
    overwrite: 'header-value-1',
  },
});
