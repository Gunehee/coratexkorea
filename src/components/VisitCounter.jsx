import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { En, Kr } from './Layout';
import { href } from '../data/site';
import { useCountUp } from '../hooks/useCountUp';

/**
 * 홈 화면용 방문 현황 — 문장형 띠.
 *
 * "국내 고객 4000+" 같은 큰 숫자와 나란히 두면 방문자 수가 적을 때
 * 대비되어 초라해 보이므로, 페이지 하단에 문장 형태로 조용히 둡니다.
 * 문장 안에서는 숫자가 작아도 자연스럽게 읽힙니다.
 *
 * 수치를 불러오지 못하면 아무것도 표시하지 않습니다.
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

  /* 훅은 조건문보다 먼저 호출되어야 합니다 (React 규칙) */
  const totalUp = useCountUp(data?.total ?? 0, 1400);

  if (!data) return null;

  const total = totalUp.toLocaleString('ko-KR');

  return (
    <div className="visit-strip">
      <p className="visit-strip-text">
        <Kr>
          지금까지 <strong>{total}</strong>명이 코라텍스 홈페이지를 찾아주셨습니다.
        </Kr>
        <En>
          <strong>{total}</strong> visits to the CORATEX website so far.
        </En>
      </p>
      <Link className="visit-strip-link" to={href('/stats')}>
        <Kr>방문 현황 자세히</Kr><En>See details</En> →
      </Link>
    </div>
  );
}
