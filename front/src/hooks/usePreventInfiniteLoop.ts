import { useRef, useEffect, useCallback, useState } from 'react';

// Hook para prevenir loops infinitos em useEffect
export function usePreventInfiniteLoop(
  fn: () => void | (() => void),
  deps: React.DependencyList,
  maxExecutions: number = 3
) {
  const executionCount = useRef(0);
  const lastDepsRef = useRef<React.DependencyList>([]);
  const isExecuting = useRef(false);

  const resetCounter = useCallback(() => {
    executionCount.current = 0;
  }, []);

  useEffect(() => {
    // Verificar se as dependências realmente mudaram
    const depsChanged = deps.some((dep, index) => dep !== lastDepsRef.current[index]);
    
    if (!depsChanged && executionCount.current > 0) {
      return;
    }

    // Prevenir execução se já está executando
    if (isExecuting.current) {
      console.warn('Tentativa de execução durante execução em andamento - prevenindo loop');
      return;
    }

    // Verificar limite de execuções
    if (executionCount.current >= maxExecutions) {
      console.error(`Loop infinito detectado! Máximo de ${maxExecutions} execuções atingido.`);
      return;
    }

    // Executar função
    isExecuting.current = true;
    executionCount.current++;
    lastDepsRef.current = [...deps];

    try {
      const cleanup = fn();
      isExecuting.current = false;
      
      return () => {
        if (cleanup && typeof cleanup === 'function') {
          cleanup();
        }
      };
    } catch (error) {
      isExecuting.current = false;
      console.error('Erro durante execução:', error);
    }
  }, deps);

  return { resetCounter, executionCount: executionCount.current };
}

// Hook para debounce de funções
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

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
export function useThrottle<T extends (...args: any[]) => any>(
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
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

// Hook para controle de estado de loading
export function useLoadingState(initialState: boolean = false) {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const isExecuting = useRef(false);

  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorHandler?: (error: Error) => void
  ): Promise<T | null> => {
    if (isExecuting.current) {
      console.warn('Operação assíncrona já em andamento');
      return null;
    }

    try {
      isExecuting.current = true;
      setLoading(true);
      setError(null);
      
      const result = await asyncFn();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error.message);
      
      if (errorHandler) {
        errorHandler(error);
      } else {
        console.error('Erro durante operação assíncrona:', error);
      }
      
      return null;
    } finally {
      isExecuting.current = false;
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
    isExecuting.current = false;
  }, []);

  return {
    loading,
    error,
    executeAsync,
    reset,
    isExecuting: isExecuting.current
  };
} 