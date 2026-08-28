import { En, Kr } from '../components/Layout';
import { useVisitStats } from '../hooks/useVisitStats';
import VisitDashboard from '../components/VisitDashboard';
import VisitHistory from '../components/VisitHistory';

/**
 * 방문 현황 — 공개 페이지.
 *
 * 홈에도 같은 내용이 표시되지만, 이 페이지는 직접 링크로 공유하거나
 * 북마크할 수 있도록 유지합니다. 화면은 VisitDashboard 하나를
 * 공유하므로 두 곳이 어긋날 일이 없습니다.
 */
export default function Stats() {
  const { data, state, reload } = useVisitStats();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2><Kr>방문 현황</Kr> <En>Visitors</En></h2>
          <p>
            <Kr>코라텍스 홈페이지를 찾아주신 분들의 현황입니다.</Kr>
            <En>Thank you for visiting the CORATEX website.</En>
          </p>
        </div>

        {state === 'loading' && (
          <p className="stats-msg">
            <Kr>불러오는 중…</Kr><En>Loading…</En>
          </p>
        )}

        {state === 'error' && (
          <div className="note">
            <p>
              <Kr>
                방문 현황을 잠시 불러올 수 없습니다.{' '}
                <button type="button" className="link-btn" onClick={reload}>다시 시도</button>
              </Kr>
              <En>
                Visitor data is temporarily unavailable.{' '}
                <button type="button" className="link-btn" onClick={reload}>Retry</button>
              </En>
            </p>
          </div>
        )}

        {state === 'ok' && data && (
          <>
            <VisitDashboard data={data} />
            <p className="visit-board-note">
              <Kr>
                사이트에 접속할 때마다 집계되며, 개인을 식별할 수 있는 정보는
                수집하지 않습니다.
              </Kr>
              <En>
                Counted on each visit. No personally identifiable information is collected.
              </En>
            </p>
            <VisitHistory />
          </>
        )}
      </div>
    </section>
  );
}
