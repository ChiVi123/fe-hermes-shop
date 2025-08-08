import { apiRequest } from '~/lib/requests';

export const logoutClientApi = (signal?: AbortSignal | null) => {
  return apiRequest
    .get('/api/auth/logout', { baseURL: '', signal })
    .fetchError((error) => {
      console.log(error);
    })
    .res();
};
