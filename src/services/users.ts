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

export const getAllAddressFromNextServer = (signal: AbortSignal) => {
  return apiRequest.get('/api/address', { baseURL: '', signal }).fetchError().json<AddressItem[]>();
};
export const getMeFromServer = () => apiRequest.get('/api/v1/users/me').fetchError().json<User>();
