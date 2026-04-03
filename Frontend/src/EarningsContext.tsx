import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { API_BASE_URL } from './config';

interface IncomeSource {
  name: string;
  amount: number;
  verified: boolean;
  source?: string;
  description?: string;
  upload_time?: string;
}

interface MonthlyData {
  month: string;
  amount: number;
}

interface EarningsContextType {
  incomeSources: IncomeSource[];
  monthlyData: MonthlyData[];
  totalEarnings: number;
  loading: boolean;
  error: string | null;
  refreshEarnings: () => Promise<void>;
}

const EarningsContext = createContext<EarningsContextType | null>(null);

export function EarningsProvider({ children }: { children: ReactNode }) {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshEarnings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard`);
      if (!res.ok) throw new Error('Backend not responding');
      const data = await res.json();
      setIncomeSources(data.incomeSources || []);
      setMonthlyData(data.earningsData || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setError('Unable to connect to backend. Please ensure the backend server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshEarnings();
  }, [refreshEarnings]);

  const totalEarnings = incomeSources.reduce((sum, s) => sum + s.amount, 0);

  return (
    <EarningsContext.Provider value={{ incomeSources, monthlyData, totalEarnings, loading, error, refreshEarnings }}>
      {children}
    </EarningsContext.Provider>
  );
}

export function useEarnings() {
  const ctx = useContext(EarningsContext);
  if (!ctx) throw new Error('useEarnings must be used within EarningsProvider');
  return ctx;
}
