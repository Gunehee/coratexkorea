import { useEffect } from 'react';

/**
 * 방문 기록 — 사이트에 들어올 때마다 1회 집계합니다.
 *
 * · 같은 사람이 나중에 다시 들어오면 다시 집계됩니다(재방문 포함).
 * · 다만 사이트 안에서 메뉴를 이동하는 동안에는 중복으로 세지 않습니다.
 *   (그렇게 하면 방문자 수가 아니라 페이지 조회수가 됩니다)
 *   → 브라우저 탭을 닫았다가 다시 들어오면 새 방문으로 집계됩니다.
 * · 개인정보를 전혀 다루지 않습니다.
 * · 실패해도 사이트 동작에는 영향이 없습니다(조용히 무시).
 */
const SESSION_KEY = 'coratex_visit_sent';

export function useVisitTracker() {
  useEffect(() => {
    /* 내부 관리 페이지는 집계 제외 */
    if (window.location.pathname.includes('/edit')) return;

    try {
      /* 같은 탭에서 메뉴만 옮겨다니는 경우는 한 번의 방문으로 봅니다.
         탭을 닫으면 이 값이 사라지므로, 다시 들어오면 새로 집계됩니다. */
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* 사생활 보호 모드 등 저장 불가 — 그대로 집계 진행 */
    }

    fetch('/api/visit', { method: 'POST', keepalive: true }).catch(() => {
      /* 집계 실패는 무시합니다. 사이트 이용에 영향 없음 */
    });
  }, []);
}
