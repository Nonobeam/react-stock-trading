import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  generateSetups,
  generateSignals,
  updateSetupPrices,
  type Setup,
  type Signal,
} from "../services/mock/setups";
import { signalsApi, marketApi } from "../services/api";
import { API_CONFIG, REFRESH_CONFIG } from "../shared/constants/config";
import type { SignalResponse } from "../shared/types/dashboard";

interface SetupsContextValue {
  setups: Setup[];
  signals: Signal[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
  clearError: () => void;
  filterSetups: (status?: Setup["status"]) => Setup[];
  filterSignals: (
    type?: Signal["signalType"],
    strength?: Signal["strength"],
  ) => Signal[];
}

const SetupsContext = createContext<SetupsContextValue | undefined>(undefined);

/**
 * Map API signal response to internal Signal type
 */
function mapSignalResponse(sig: SignalResponse): Signal {
  return {
    id: sig.id,
    symbol: sig.symbol,
    name: sig.name,
    exchange: sig.exchange,
    currentPrice: sig.currentPrice,
    signalType: sig.signalType,
    strength: sig.strength,
    score: sig.score,
    indicators: sig.indicators,
    generatedAt: new Date(sig.generatedAt),
    expiresAt: new Date(sig.expiresAt),
    reason: sig.reason,
  };
}

/**
 * Derive a Trade Setup from a live Signal.
 * Entry = current price, Target = +8%, Stop = -5%.
 */
function signalToSetup(sig: Signal): Setup {
  const entry = sig.currentPrice;
  const target = Math.round(entry * 1.08);
  const stop = Math.round(entry * 0.95);
  const riskPct = ((entry - stop) / entry) * 100;
  const gainPct = ((target - entry) / entry) * 100;
  const rr = Math.round((gainPct / riskPct) * 10) / 10;

  // Derive a setup-level status from signal type
  const status: Setup["status"] =
    sig.signalType === "buy"
      ? "pending"
      : sig.signalType === "sell"
        ? "invalidated"
        : "triggered";

  return {
    id: `${sig.id}-setup`,
    symbol: sig.symbol,
    name: sig.name,
    exchange: sig.exchange,
    currentPrice: sig.currentPrice,
    entryPrice: entry,
    stopPrice: stop,
    targetPrice: target,
    score: sig.score,
    pattern: sig.indicators?.[0] ?? "Live Signal",
    timeframe: "1D",
    addedDate: sig.generatedAt,
    status,
    notes: sig.reason,
    riskRewardRatio: rr,
    potentialGainPercent: Math.round(gainPct * 10) / 10,
    riskPercent: Math.round(riskPct * 10) / 10,
  };
}

export function SetupsProvider({ children }: { children: React.ReactNode }) {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    // Use mock data if configured
    if (API_CONFIG.useMockData) {
      try {
        const newSetups = generateSetups(10);
        const newSignals = generateSignals(8);
        setSetups(newSetups);
        setSignals(newSignals);
        setLastUpdated(new Date());
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load setups");
        setIsLoading(false);
      }
      return;
    }

    // --- Live API path ---
    try {
      // Fetch supported universe (for informational breadcrumbs) and live signals concurrently
      const [universeResult, signalsResult] = await Promise.allSettled([
        marketApi.getUniverse(),
        signalsApi.getSignals(),
      ]);

      // Map signals
      let liveSignals: Signal[] = [];
      if (signalsResult.status === "fulfilled") {
        liveSignals = signalsResult.value.signals.map(mapSignalResponse);
      }

      // Build setups from live signals (buy / watch signals only, exclude expired)
      const now = new Date();
      const activeSignals = liveSignals.filter(
        (s) => s.signalType !== "sell" && s.expiresAt > now,
      );
      const liveSetups = activeSignals.map(signalToSetup);

      // If universe loaded OK but signals were empty, log it for debugging
      if (universeResult.status === "fulfilled") {
        const universe = universeResult.value;
        if (universe.length > 0 && liveSetups.length === 0) {
          console.info(
            `[Scanner] Universe has ${universe.length} stocks but no active buy signals right now.`,
          );
        }
      }

      setSignals(liveSignals);
      setSetups(liveSetups.length > 0 ? liveSetups : []);
      setLastUpdated(new Date());
      setError(null);
      setIsLoading(false);
    } catch (err) {
      console.warn("Scanner API unavailable, falling back to mock data:", err);

      if (API_CONFIG.enableFallback) {
        try {
          setSetups(generateSetups(10));
          setSignals(generateSignals(8));
          setLastUpdated(new Date());
          setIsLoading(false);
        } catch (mockErr) {
          setError(
            mockErr instanceof Error
              ? mockErr.message
              : "Failed to load setups",
          );
          setIsLoading(false);
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to load signals");
        setIsLoading(false);
      }
    }
  }, []); // no dependencies — refresh is stable

  const filterSetups = useCallback(
    (status?: Setup["status"]): Setup[] => {
      if (!status) return setups;
      return setups.filter((s) => s.status === status);
    },
    [setups],
  );

  const filterSignals = useCallback(
    (type?: Signal["signalType"], strength?: Signal["strength"]): Signal[] => {
      let filtered = signals;
      if (type) filtered = filtered.filter((s) => s.signalType === type);
      if (strength) filtered = filtered.filter((s) => s.strength === strength);
      return filtered;
    },
    [signals],
  );

  // Initialize and set up auto-refresh
  useEffect(() => {
    refresh();

    if (API_CONFIG.useMockData) {
      // Simulate live price movement for mock data
      const interval = setInterval(() => {
        setSetups((prev) => updateSetupPrices(prev));
        setLastUpdated(new Date());
      }, 5000);
      return () => clearInterval(interval);
    } else if (REFRESH_CONFIG.enabled) {
      const intervalId = setInterval(refresh, REFRESH_CONFIG.intervals.signals);
      return () => clearInterval(intervalId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value: SetupsContextValue = {
    setups,
    signals,
    isLoading,
    error,
    lastUpdated,
    refresh,
    clearError,
    filterSetups,
    filterSignals,
  };

  return (
    <SetupsContext.Provider value={value}>{children}</SetupsContext.Provider>
  );
}

export function useSetups() {
  const context = useContext(SetupsContext);
  if (context === undefined) {
    throw new Error("useSetups must be used within SetupsProvider");
  }
  return context;
}
