import { useState, useEffect } from "react";
import {
  userService,
  depositService,
  stablecoinService,
  forexPairService,
  marketService,
} from "@/services/api";
import {
  User,
  Deposit,
  Stablecoin,
  ForexPair,
  UserPosition,
  Transaction,
  MarketData,
  CryptoBubbleData,
  PaginatedResponse,
} from "@/types";

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall();

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || "An error occurred");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const runFetch = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall();

        if (isMounted) {
          if (response.success && response.data) {
            setData(response.data);
          } else {
            setError(response.error || "An error occurred");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    runFetch();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// User-related hooks
export function useUser() {
  return useApi<User>(userService.getProfile);
}

export function useWallet() {
  return useApi<any>(userService.getWallet);
}

export function useTransactions(page: number = 1, limit: number = 20) {
  return useApi<PaginatedResponse<Transaction>>(
    () => userService.getTransactions(page, limit),
    [page, limit]
  );
}

export function useUserPositions() {
  return useApi<UserPosition[]>(userService.getPositions);
}

// Deposit hooks
export function useDeposits(page: number = 1, limit: number = 20) {
  return useApi<PaginatedResponse<Deposit>>(
    () => depositService.getAll(page, limit),
    [page, limit]
  );
}

export function useDepositStatus(depositId: string) {
  return useApi<Deposit>(
    () => depositService.getStatus(depositId),
    [depositId]
  );
}

// Stablecoin hooks
export function useStablecoins() {
  return useApi<Stablecoin[]>(stablecoinService.getAll);
}

export function useStablecoinPrice(symbol: string) {
  return useApi<{ price: number; change24h: number }>(
    () => stablecoinService.getPrice(symbol),
    [symbol]
  );
}

// Forex pair hooks
export function useForexPairs() {
  return useApi<ForexPair[]>(forexPairService.getAll);
}

export function useForexPairPrice(symbol: string) {
  return useApi<MarketData>(() => forexPairService.getPrice(symbol), [symbol]);
}

export function useForexPairChart(
  symbol: string,
  interval: string = "1d",
  limit: number = 100
) {
  return useApi<any[]>(
    () => forexPairService.getChart(symbol, interval, limit),
    [symbol, interval, limit]
  );
}

// Market data hooks
export function useMarketData() {
  return useApi<MarketData[]>(marketService.getData);
}

export function usePrices(symbols: string[]) {
  return useApi<Record<string, number>>(
    () => marketService.getPrices(symbols),
    [symbols.join(",")]
  );
}

export function useCryptoBubbles() {
  return useApi<CryptoBubbleData[]>(marketService.getBubbles);
}

// Real-time price updates hook
export function useRealTimePrices(
  symbols: string[],
  intervalMs: number = 5000
) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let isMounted = true;

    const fetchPrices = async () => {
      try {
        const response = await marketService.getPrices(symbols);

        if (isMounted) {
          if (response.success && response.data) {
            setPrices(response.data);
            setError(null);
          } else {
            setError(response.error || "Failed to fetch prices");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "An error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrices();
    interval = setInterval(fetchPrices, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbols.join(","), intervalMs]);

  return { prices, loading, error };
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Debounced value hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Previous value hook
export function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState<T>(value);
  const [previous, setPrevious] = useState<T | undefined>(undefined);

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  return previous;
}

// Window size hook
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

// Click outside hook
export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: Event) => void
) {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;

    const listener = (event: Event) => {
      if (startedInside || !startedWhenMounted) return;
      if (!ref.current || ref.current.contains(event.target as Node)) return;

      handler(event);
    };

    const validateEventStart = (event: Event) => {
      startedWhenMounted = ref.current !== null;
      startedInside = ref.current?.contains(event.target as Node) ?? false;
    };

    document.addEventListener("mousedown", validateEventStart);
    document.addEventListener("touchstart", validateEventStart);
    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("mousedown", validateEventStart);
      document.removeEventListener("touchstart", validateEventStart);
      document.removeEventListener("click", listener);
    };
  }, [ref, handler]);
}
