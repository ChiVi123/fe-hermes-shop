import { useEffect, useMemo, useState } from 'react';

export const useFetch = <T>(fetchFn: (signal: AbortSignal) => Promise<T>, init: T) => {
  const [value, setValue] = useState<T>(init);
  const reason = useMemo(() => new DOMException('Fetching twice', 'Fetching abort'), []);

  useEffect(() => {
    const controller = new AbortController();
    fetchFn(controller.signal).then((data) => {
      setValue(data);
    });

    return () => {
      controller.abort(reason);
    };
  }, [fetchFn, reason]);

  return value;
};
