import { createContext, useContext, type ReactNode } from 'react';
import { useLiveMetrics, type LiveMetrics, type TechObservability } from './useLiveMetrics';

const TechMetricsContext = createContext<TechObservability | null>(null);

export function TechMetricsProvider({ children }: { children: ReactNode }) {
  const observability = useLiveMetrics();
  return <TechMetricsContext.Provider value={observability}>{children}</TechMetricsContext.Provider>;
}

export function useTechObservability(): TechObservability {
  const ctx = useContext(TechMetricsContext);
  if (!ctx) throw new Error('useTechObservability must be used within TechMetricsProvider');
  return ctx;
}

export function useTechMetrics(): LiveMetrics {
  return useTechObservability().metrics;
}
