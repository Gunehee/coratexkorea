import { useEffect } from 'react';

/**
 * 방문 기록 — 사이트 진입 시 1회만 서버에 알립니다.
 *
 * · 같은 방문자의 중복 집계는 서버에서 걸러냅니다(하루 1회).
 * · 브라우저 세션 내 재방문은 아예 요청조차 보내지 않습니다.
 * · 실패해도 사이트 동작에는 전혀 영향이 없습니다(조용히 무시).
 * · 내부 통계 페이지(/stats)에서의 접속은 집계하지 않습니다.
 */
const SESSION_KEY = 'coratex_visit_sent';

export function useVisitTracker() {
  useEffect(() => {
    /* 내부 관리 페이지만 집계 제외 */
    if (window.location.pathname.includes('/edit')) return;

    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* 사생활 보호 모드 등 저장 불가 — 그대로 진행 */
    }

    fetch('/api/visit', { method: 'POST', keepalive: true }).catch(() => {
      /* 집계 실패는 무시합니다. 사이트 이용에 영향 없음 */
    });
  }, []);
}
