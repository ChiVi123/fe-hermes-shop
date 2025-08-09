import { apiRequest } from '~/lib/requests';
import { User } from '~/types/user';

export type AddressItem = {
  firstName: string;
  lastName: string;
  province: string;
  ward: string;
  district: string;
  country: string;
  isDefault?: true;
};

export const getAllAddressClientApi = (signal: AbortSignal) => {
  return apiRequest
    .get('/api/address', { isRouteHandler: true, signal })
    .fetchError(() => [])
    .json<AddressItem[]>();
};
export const getMeServerApi = () => {
  return apiRequest.get('/users/me').json<User>();
};
export const getMeExternalApi = (signal?: AbortSignal | null) => {
  return apiRequest.get('/users/me', { signal }).json<User>();
};
