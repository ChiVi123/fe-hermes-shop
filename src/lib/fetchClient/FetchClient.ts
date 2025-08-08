import { ContentType, FETCH_ERROR, FetchMethod, HeaderKeys } from '~/lib/fetchClient/constants';
import { FetchError } from '~/lib/fetchClient/FetchError';
import { FetchResolver } from '~/lib/fetchClient/FetchResolver';
import { InterceptorManager } from '~/lib/fetchClient/InterceptorManager';
import {
  FetchConfig,
  FetchConfigInit,
  FetchErrorHandler,
  FetchErrorKey,
  FetchGetMethodConfig,
} from '~/lib/fetchClient/types';
import { createFullPath, joinQueryToURL, mergeConfig } from '~/lib/fetchClient/utils';

type Interceptors = {
  request: InterceptorManager<FetchConfig>;
  response: InterceptorManager<Response>;
};

export class FetchClient {
  private _config: FetchConfig;
  private _catchers: Map<FetchErrorKey, FetchErrorHandler>;
  private _interceptors: Interceptors;

  constructor(baseURL: string, config: Omit<FetchConfigInit, 'body' | 'data'> = {}) {
    this._config = { ...config, baseURL, url: '' };
    this._catchers = new Map();
    this._interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }

  public get interceptor(): Interceptors {
    return this._interceptors;
  }

  public request(config: FetchConfig) {
    let promise = this.handleInterceptorRequest(config, this._interceptors.request).then((value) =>
      this.fetching(value)
    );
    promise = this.handleInterceptorResponse(promise, this._interceptors.response).catch((error) => {
      throw { [FETCH_ERROR]: error };
    });

    return new FetchResolver(new Map(this._catchers), promise);
  }

  public get(url: string, config: FetchGetMethodConfig = {}) {
    url = joinQueryToURL(url, config?.query);
    const mergedConfig = mergeConfig({ url, method: FetchMethod.GET }, this._config, config);
    return this.request(mergedConfig);
  }

  public post(url: string, { data, ...config }: FetchConfigInit = {}) {
    const mergedConfig = mergeConfig({ url, method: FetchMethod.POST, data }, this._config, config);
    return this.request(mergedConfig);
  }

  public put(url: string, { data, ...config }: FetchConfigInit = {}) {
    const mergedConfig = mergeConfig({ url, method: FetchMethod.PUT, data }, this._config, config);
    return this.request(mergedConfig);
  }

  public patch(url: string, { data, ...config }: FetchConfigInit = {}) {
    const mergedConfig = mergeConfig({ url, method: FetchMethod.PATCH, data }, this._config, config);
    return this.request(mergedConfig);
  }

  public delete(url: string, { data, ...config }: FetchConfigInit = {}) {
    const mergedConfig = mergeConfig({ url, method: FetchMethod.DELETE, data }, this._config, config);
    return this.request(mergedConfig);
  }

  private async fetching(config: FetchConfig) {
    const fullPath = createFullPath(config.baseURL, config.url);
    const res = await fetch(fullPath, config);
    if (res.ok) {
      return res;
    }

    const text = await res.text();
    const contentType = res.headers.get(HeaderKeys.ContentType);
    let data = null;
    if (contentType && contentType.includes(ContentType.Json)) {
      data = JSON.parse(text);
    }
    throw new FetchError(res.status, config, data);
  }

  private handleInterceptorRequest(config: FetchConfig, requestInterceptors: InterceptorManager<FetchConfig>) {
    let promise = new Promise<FetchConfig>((resolve) => {
      resolve(config);
    });

    requestInterceptors.forEach((value) => {
      promise = promise.then(value.onFulfilled).catch(value.onRejected);
    });

    return promise;
  }

  private handleInterceptorResponse(promise: Promise<Response>, responseInterceptors: InterceptorManager<Response>) {
    responseInterceptors.forEach((value) => {
      promise = promise.then(value.onFulfilled, value.onRejected);
    });
    return promise;
  }
}
