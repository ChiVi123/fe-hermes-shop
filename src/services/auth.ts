import { apiRequest } from '~/lib/requests';

export const logoutClientApi = (signal?: AbortSignal | null) => {
  return apiRequest
    .get('/api/auth/logout', { isRouteHandler: true, signal })
    .fetchError((error) => {
      console.log(error);
    })
    .res();
};
