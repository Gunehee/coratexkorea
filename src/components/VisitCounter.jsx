import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { En, Kr } from './Layout';
import { href } from '../data/site';

/**
 * 홈 화면용 방문 현황 요약.
 *
 * 전용 페이지(/stats)의 큰 대시보드와 달리, 홈에서는 한 줄로 간결하게
 * 보여주고 자세한 내용은 링크로 연결합니다.
 *
 * 수치를 불러오지 못하면 아무것도 표시하지 않습니다.
 * (홈 화면에 오류 문구가 뜨면 오히려 신뢰를 해칩니다)
 */
export default function VisitCounter() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/visit', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d && typeof d.total === 'number') setData(d); })
      .catch(() => { /* 실패 시 조용히 숨김 */ });
    return () => { alive = false; };
  }, []);

  if (!data) return null;

  const fmt = (n) => (n ?? 0).toLocaleString('ko-KR');

  return (
    <div className="visit-summary">
      <div className="visit-summary-main">
        <span className="visit-summary-label">
          <Kr>누적 방문자</Kr><En>Total visitors</En>
        </span>
        <strong className="visit-summary-num">{fmt(data.total)}</strong>
        <span className="visit-summary-unit"><Kr>명</Kr></span>
      </div>

      <div className="visit-summary-side">
        <span className="visit-summary-item">
          <span className="visit-summary-k"><Kr>오늘</Kr><En>Today</En></span>
          <strong>{fmt(data.today)}</strong>
        </span>
        <span className="visit-summary-divider" aria-hidden="true" />
        <span className="visit-summary-item">
          <span className="visit-summary-k"><Kr>이번 달</Kr><En>This month</En></span>
          <strong>{fmt(data.month)}</strong>
        </span>
        <Link className="visit-summary-link" to={href('/stats')}>
          <Kr>자세히 보기</Kr><En>Details</En> →
        </Link>
      </div>
    </div>
  );
}
