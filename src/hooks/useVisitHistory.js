import { useState, useEffect, useCallback } from 'react';

/**
 * 방문 전체 기록(월별 합계) 조회 — /stats 페이지 전용.
 *
 * 홈 화면에는 쓰지 않습니다(요약만 보여주면 충분한 자리이므로).
 * 처음 열 때만 불러오고, 자동 갱신하지 않습니다(과거 기록은 자주 바뀌지 않음).
 */
export function useVisitHistory() {
  const [months, setMonths] = useState(null);
  const [state, setState] = useState('idle'); // idle | loading | ok | error

  const load = useCallback(async () => {
    setState('loading');
    try {
      const res = await fetch('/api/visit?history=1', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setMonths(json.months || []);
      setState('ok');
    } catch {
      setState('error');
    }
  }, []);

  return { months, state, load };
}

/** 특정 월의 일별 추이 — 월별 막대를 눌렀을 때만 불러옵니다. */
export function useMonthDetail() {
  const [cache, setCache] = useState({}); // { 'YYYY-MM': trend[] }
  const [loadingMonth, setLoadingMonth] = useState(null);

  const load = useCallback(async (ym) => {
    if (cache[ym]) return cache[ym];
    setLoadingMonth(ym);
    try {
      const res = await fetch(`/api/visit?month=${ym}`, { cache: 'no-store' });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setCache((prev) => ({ ...prev, [ym]: json.trend }));
      return json.trend;
    } catch {
      return null;
    } finally {
      setLoadingMonth(null);
    }
  }, [cache]);

  return { load, cache, loadingMonth };
}
