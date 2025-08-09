import { InterceptorManager } from '~/lib/fetchain/InterceptorManager';
import { FetchConfig } from '~/lib/fetchain/types';

type HandleRequest = (config: FetchConfig, interceptor: InterceptorManager<FetchConfig>) => Promise<FetchConfig>;
export const handleInterceptorRequest: HandleRequest = (config, requestInterceptors) => {
  let promise = new Promise<FetchConfig>((resolve) => {
    resolve(config);
  });
  requestInterceptors.forEach((value) => {
    promise = promise.then(value.onFulfilled).catch(value.onRejected);
  });

  return promise;
};

type HandleResponse = (promise: Promise<Response>, interceptor: InterceptorManager<Response>) => Promise<Response>;
export const handleInterceptorResponse: HandleResponse = (promise, responseInterceptors) => {
  responseInterceptors.forEach((value) => {
    promise = promise.then(value.onFulfilled, value.onRejected);
  });
  return promise;
};
