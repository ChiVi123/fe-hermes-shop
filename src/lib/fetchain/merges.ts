import { transformRequest } from '~/lib/fetchain/transforms';
import { FetchConfig, FetchConfigInit } from '~/lib/fetchain/types';

type MergeConfigFn = (original: FetchConfig, ...configs: FetchConfigInit[]) => FetchConfig;
export const mergeConfig: MergeConfigFn = (original, ...configs) => {
  const headerList: HeadersInit[] = [];
  let body: BodyInit | null | undefined = null;

  if (original.headers) {
    headerList.push(original.headers);
  }

  const mergedConfig = configs.reduce<FetchConfigInit>(
    (acc, { headers, ...items }) => {
      if (headers) {
        headerList.push(headers);
      }
      return { ...acc, ...items };
    },
    { ...original }
  );
  if (mergedConfig.data) {
    const headerForBody = {};
    body = transformRequest(headerForBody, mergedConfig.data);
    headerList.push(headerForBody);

    delete mergedConfig.data;
  }

  const mergedHeaders = mergeHeaders(...headerList);

  if (mergedConfig.baseURL === undefined) {
    mergedConfig.baseURL = original.baseURL;
  }
  mergedConfig.headers = mergedHeaders;
  mergedConfig.body = body;
  return mergedConfig as FetchConfig;
};

const mergeHeaders = (...headerSources: HeadersInit[]): Record<string, string> => {
  const merged: Record<string, string> = {};

  for (const source of headerSources) {
    if (source instanceof Headers) {
      source.forEach((value, key) => {
        merged[key] = value;
      });
    } else if (Array.isArray(source)) {
      source.forEach(([key, value]) => {
        merged[key] = value;
      });
    } else {
      Object.entries(source).forEach(([key, value]) => {
        merged[key] = value;
      });
    }
  }

  return merged;
};
