import { ContentType, FETCH_ERROR, FetchMethod, HeaderKeys } from '~/lib/fetchain/constants';
import { HttpError } from '~/lib/fetchain/HttpError';
import { handleInterceptorRequest, handleInterceptorResponse } from '~/lib/fetchain/interceptorHandlers';
import { InterceptorManager } from '~/lib/fetchain/InterceptorManager';
import { mergeConfig } from '~/lib/fetchain/merges';
import { RequestChain } from '~/lib/fetchain/RequestChain';
import { combineURLs, createFullPath, queryToString } from '~/lib/fetchain/transforms';
import { FetchConfig, FetchConfigIgnoreBody, FetchConfigInit } from '~/lib/fetchain/types';

interface Fetchain {
  readonly interceptor: {
    request: InterceptorManager<FetchConfig>;
    response: InterceptorManager<Response>;
  };
  get(url: string, config?: FetchConfigIgnoreBody): RequestChain;
  post(url: string, config?: FetchConfigInit): RequestChain;
  put(url: string, config?: FetchConfigInit): RequestChain;
  patch(url: string, config?: FetchConfigInit): RequestChain;
  delete(url: string, config?: FetchConfigIgnoreBody): RequestChain;
  request(config: FetchConfig): RequestChain;
}

type FetchainFactory = (baseURL: string, original?: Omit<FetchConfigInit, 'body' | 'data'>) => Fetchain;

export const fetchainFactory: FetchainFactory = (baseURL, original = {}) => {
  const configDefault: FetchConfig = { baseURL, prefix: '', url: '', ...original };

  return {
    interceptor: {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    },
    get(url, config = {}) {
      url = queryToString(url, config?.query);
      const mergedConfig = mergeConfig(configDefault, config, { url, method: FetchMethod.GET });
      return this.request(mergedConfig);
    },
    post(url, config = {}) {
      const mergedConfig = mergeConfig(configDefault, config, { url, method: FetchMethod.POST });
      return this.request(mergedConfig);
    },
    put(url, config = {}) {
      const mergedConfig = mergeConfig(configDefault, config, { url, method: FetchMethod.PUT });
      return this.request(mergedConfig);
    },
    patch(url, config = {}) {
      const mergedConfig = mergeConfig(configDefault, config, { url, method: FetchMethod.PATCH });
      return this.request(mergedConfig);
    },
    delete(url, config = {}) {
      const mergedConfig = mergeConfig(configDefault, config, { url, method: FetchMethod.DELETE });
      return this.request(mergedConfig);
    },
    request(config) {
      const { request, response } = this.interceptor;
      let promise = handleInterceptorRequest(config, request).then((value) => execute(value));
      promise = handleInterceptorResponse(promise, response);

      return new RequestChain(new Map(), promise);
    },
  };
};

const execute = async (config: FetchConfig) => {
  if (config.isRouteHandler) {
    config.baseURL = '';
    config.prefix = '';
  }
  const fullPath = createFullPath(config.baseURL, combineURLs(config.prefix, config.url));

  return fetch(fullPath, config)
    .catch((error) => {
      throw { [FETCH_ERROR]: error };
    })
    .then(async (res) => {
      if (res.ok) return res;

      const text = await res.text();
      const contentType = res.headers.get(HeaderKeys.ContentType);
      let data = null;
      if (contentType && contentType.includes(ContentType.Json)) {
        data = JSON.parse(text);
      }
      throw new HttpError(config, res, data);
    });
};
