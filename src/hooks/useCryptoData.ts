import { useState, useEffect } from "react";
import { CryptoBubbleData } from "@/types";
import {
  fetchTopCryptos,
  getMarketOverview,
} from "@/services/coinGeckoService";

interface CryptoDataState {
  bubbleData: CryptoBubbleData[];
  totalMarketCap: number;
  totalVolume: number;
  isLoading: boolean;
  error: string | null;
}

export function useCryptoData(limit: number = 10) {
  const [state, setState] = useState<CryptoDataState>({
    bubbleData: [],
    totalMarketCap: 0,
    totalVolume: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Fetch crypto data and market overview in parallel
        const [cryptoData, marketOverview] = await Promise.all([
          fetchTopCryptos(limit),
          getMarketOverview(),
        ]);

        setState({
          bubbleData: cryptoData,
          totalMarketCap: marketOverview.totalMarketCap,
          totalVolume: marketOverview.totalVolume,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error in useCryptoData hook:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load crypto data",
        }));
      }
    }

    loadData();
  }, [limit]);

  // Calculate derived stats
  const gainers = state.bubbleData.filter(
    (item) => item.priceChange24h > 0
  ).length;
  const losers = state.bubbleData.filter(
    (item) => item.priceChange24h < 0
  ).length;

  return {
    ...state,
    gainers,
    losers,
    refresh: () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      // This will trigger the useEffect to run again
    },
  };
}
