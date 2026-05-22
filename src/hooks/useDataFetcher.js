import { useState, useEffect, useCallback, useRef } from 'react';

export function useDataFetcher(fetchFn, interval = 30000, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await fetchFn();
      if (mountedRef.current) {
        setData(result);
        setError(null);
        setLastUpdate(new Date());
        setLoading(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn, ...deps]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    const id = setInterval(fetchData, interval);
    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [fetchData, interval]);

  return { data, loading, error, lastUpdate, refetch: fetchData };
}

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const idRef = useRef(0);

  const addAlert = useCallback((alert) => {
    const id = ++idRef.current;
    const newAlert = { ...alert, id, timestamp: Date.now(), read: false };
    setAlerts(prev => [newAlert, ...prev].slice(0, 50));
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 15000);
  }, []);

  const dismissAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  return { alerts, addAlert, dismissAlert };
}
