import { ContentType, FETCH_ERROR, FetchMethod, HeaderKeys } from '~/lib/fetchClient/constants';
import { FetchError } from '~/lib/fetchClient/FetchError';
import { FetchResolver } from '~/lib/fetchClient/FetchResolver';
import {
  FetchConfig,
  FetchConfigInit,
  FetchErrorHandler,
  FetchErrorKey,
  FetchGetMethodConfig,
} from '~/lib/fetchClient/types';
import { createFullPath, joinQueryToURL, mergeConfig } from '~/lib/fetchClient/utils';

export class FetchClient {
  private _config: FetchConfig;
  private _catchers: Map<FetchErrorKey, FetchErrorHandler>;

  constructor(baseURL: string, config: Omit<FetchConfigInit, 'body' | 'data'> = {}) {
    this._config = { ...config, baseURL, url: '' };
    this._catchers = new Map();
  }

  public request(config: FetchConfig) {
    const promise = this.fetching(config).catch((error) => {
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
}
