import { useRef, useEffect, useCallback, useState, useMemo } from 'react';

interface CallbackFunction {
  (...args: unknown[]): void | Promise<void>;
}

// Hook para prevenir loops infinitos em useEffect
export function usePreventInfiniteLoop(
  callback: CallbackFunction,
  delay: number,
  dependencies: unknown[] = []
) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Criar um hash estável das dependências para evitar o spread warning
  const dependenciesHash = useMemo(() => {
    return JSON.stringify(dependencies);
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const executeCallback = () => {
      callbackRef.current();
    };

    timeoutRef.current = setTimeout(executeCallback, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, dependenciesHash]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return { clear };
}

// Hook para debounce de funções
export function useDebounce<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, []);

  return debouncedCallback;
}

// Hook para throttle de funções
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const isThrottled = useRef(false);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (isThrottled.current) return;

      isThrottled.current = true;
      callback(...args);

      setTimeout(() => {
        isThrottled.current = false;
      }, delay);
    },
    [callback, delay]
  ) as T;

  return throttledCallback;
}

// Hook para memoização estável de objetos
export function useStableCallback<T extends (...args: unknown[]) => unknown>(callback: T): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

// Hook para controle de estado de loading
export function useLoadingState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const executeAsync = useCallback(async (callback: CallbackFunction) => {
    setIsLoading(true);
    setError(null);

    try {
      await callback();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, executeAsync };
} 