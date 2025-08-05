import { TokenName } from '~/constants';
import { FetchClient, HeaderKeys, HttpStatus, isFetchError } from '~/lib/fetchClient';
import { FetchConfig } from '~/lib/fetchClient/types';
import { RoutePath } from '~/lib/route';
import { SessionToken } from '~/lib/SessionToken';
import { isClient, isServer } from '~/lib/utils';

export const apiRequest = new FetchClient(process.env.NEXT_PUBLIC_SERVER_API || '');
export const clientSessionToken = new SessionToken();

apiRequest.interceptor.request.use(async (config) => {
  return handleAuthorization(config);
});
apiRequest.interceptor.response.use(
  (res) => res,
  (error) => {
    if (!isFetchError(error)) {
      return Promise.reject(error);
    }
    if (error.status !== HttpStatus.UNAUTHORIZED) {
      return Promise.reject(error);
    }
    if (isClient()) {
      clientSessionToken.value = '';
      return Promise.reject(error);
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { redirect } = require('next/navigation');
    redirect(RoutePath.Logout); // NOTE: I ignore error (NEXT_REDIRECT) and app not crash
  }
);

const handleAuthorization = async (config: FetchConfig): Promise<FetchConfig> => {
  if (isClient() && clientSessionToken.value) {
    config.headers = new Headers(config.headers);
    config.headers.set(HeaderKeys.Authorization, `Bearer ${clientSessionToken.value}`);
    return config;
  }

  if (isServer()) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cookies } = require('next/headers');
    const accessToken = (await cookies()).get(TokenName.ACCESS_TOKEN);
    if (accessToken?.value) {
      config.headers = new Headers(config.headers);
      config.headers.set(HeaderKeys.Authorization, `Bearer ${accessToken.value}`);
    }
  }

  return config;
};
