import { createContext, useContext, type ReactNode } from 'react';
import { useLiveMetrics, type LiveMetrics } from './useLiveMetrics';

const TechMetricsContext = createContext<LiveMetrics | null>(null);

export function TechMetricsProvider({ children }: { children: ReactNode }) {
  const metrics = useLiveMetrics();
  return <TechMetricsContext.Provider value={metrics}>{children}</TechMetricsContext.Provider>;
}

export function useTechMetrics(): LiveMetrics {
  const ctx = useContext(TechMetricsContext);
  if (!ctx) throw new Error('useTechMetrics must be used within TechMetricsProvider');
  return ctx;
}
