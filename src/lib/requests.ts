import { TokenName } from '~/constants';
import { FetchClient, HeaderKeys, HttpStatus, isFetchError } from '~/lib/fetchClient';
import { FetchConfig } from '~/lib/fetchClient/types';
import { RoutePath } from '~/lib/route';
import { isClient, isServer } from '~/lib/utils';

export const apiRequest = new FetchClient(process.env.NEXT_PUBLIC_SERVER_API || '');

const URL_PRIVATE: string[] = ['/api/v1/users/me'] as const;

apiRequest.interceptor.request.use(async (config) => {
  if (isServer() && URL_PRIVATE.includes(config.url)) {
    return handleAuthorization(config);
  }

  return config;
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
      return Promise.reject(error);
    }

    handleRedirect();
  }
);

const handleAuthorization = async (config: FetchConfig): Promise<FetchConfig> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cookies } = require('next/headers');
    const accessToken = (await cookies()).get(TokenName.ACCESS_TOKEN);
    if (accessToken?.value) {
      config.headers = new Headers(config.headers);
      config.headers.set(HeaderKeys.Authorization, `Bearer ${accessToken.value}`);
    }
  } catch (error) {
    console.log(error);
  } finally {
    return config;
  }
};
const handleRedirect = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { redirect } = require('next/navigation');
    redirect(RoutePath.Login);
  } catch (error) {
    console.log(error);
  }
};
