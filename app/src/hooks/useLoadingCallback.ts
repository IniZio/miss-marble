/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type DependencyList, useState, useCallback } from 'react';

export function useLoadingCallback<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  deps: DependencyList = [],
  loading = false,
) {
  const [isLoading, setIsLoading] = useState(false);

  const wrappedCallback = useCallback(async (...args: any[]) => {
    setIsLoading(true);
    try {
      const res = await callback(...args);
      return res;
    } finally {
      setIsLoading(false);
    }
  }, deps);

  return [wrappedCallback as T, { isLoading: loading || isLoading }] as const;
}