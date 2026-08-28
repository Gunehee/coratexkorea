import { En, Kr } from './Layout';
import { useVisitStats } from '../hooks/useVisitStats';
import VisitDashboard from './VisitDashboard';
import VisitHistory from './VisitHistory';

/**
 * 홈 화면 방문 현황 섹션.
 *
 * 별도 페이지로 넘기지 않고 홈에서 바로 전체 수치를 보여줍니다.
 * (클릭을 한 번 더 요구하면 대부분 보지 않습니다)
 *
 * 수치를 불러오지 못하면 섹션 전체를 표시하지 않습니다.
 * 홈 화면에 오류 문구가 뜨면 오히려 신뢰를 해치기 때문입니다.
 */
export default function VisitCounter() {
  const { data, state } = useVisitStats();

  if (state !== 'ok' || !data) return null;

  return (
    <>
      <div className="section-head">
        <h2><Kr>방문 현황</Kr> <En>Visitors</En></h2>
        <p>
          <Kr>코라텍스 홈페이지를 찾아주신 분들의 현황입니다.</Kr>
          <En>Thank you for visiting the CORATEX website.</En>
        </p>
      </div>

      <VisitDashboard data={data} compact />

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
  );
}
