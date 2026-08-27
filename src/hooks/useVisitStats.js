import { useState, useEffect, useCallback } from 'react';

/**
 * 방문 현황 데이터 조회 — 홈과 /stats 가 함께 씁니다.
 *
 * · 탭이 화면에 보일 때만 갱신하고, 탭으로 돌아오면 즉시 새로 가져옵니다.
 * · 실패하면 state 가 'error' 가 되며, 화면에서 조용히 숨기거나
 *   안내를 띄울지는 사용하는 쪽이 결정합니다.
 */
const REFRESH_MS = 60000;

export function useVisitStats() {
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading'); // loading | ok | error

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/visit', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
      setState('ok');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
    const tick = () => { if (!document.hidden) load(); };
    const id = setInterval(tick, REFRESH_MS);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [load]);

  return { data, state, reload: load };
}
