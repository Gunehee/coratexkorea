import { En, Kr } from './Layout';
import { useCountUp } from '../hooks/useCountUp';

/**
 * 방문 현황 대시보드 — 홈과 /stats 가 함께 씁니다.
 *
 * 같은 화면을 두 벌 만들면 한쪽만 고치는 사고가 나므로 하나로 관리합니다.
 * 홈에서는 제품 소개가 주인공이므로 조금 더 낮은 밀도로 보여줍니다.
 */

export const fmt = (n) => (n ?? 0).toLocaleString('ko-KR');

/** 0에서 목표값까지 올라가는 숫자 */
export function CountUp({ value, duration }) {
  const n = useCountUp(value, duration);
  return <>{fmt(n)}</>;
}

const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];
const WEEKDAY_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function weekdayIndex(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function Trend({ trend }) {
  if (!trend?.length) return null;
  const max = Math.max(...trend.map((t) => t.count), 1);

  return (
    <div className="trend">
      {trend.map((t) => {
        const wi = weekdayIndex(t.date);
        const weekend = wi === 0 || wi === 6;
        return (
          <div className="trend-col" key={t.date}>
            <span className="trend-value">{fmt(t.count)}</span>
            <div className="trend-bar-wrap">
              <div
                className={`trend-bar ${weekend ? 'is-weekend' : ''}`}
                style={{ height: `${Math.max((t.count / max) * 100, 3)}%` }}
              />
            </div>
            <span className={`trend-day ${weekend ? 'is-weekend' : ''}`}>
              <Kr>{WEEKDAY_KO[wi]}</Kr><En>{WEEKDAY_EN[wi]}</En>
            </span>
            <span className="trend-date">{t.date.slice(5).replace('-', '/')}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function VisitDashboard({ data, compact = false }) {
  if (!data) return null;

  return (
    <div className={`visit-board ${compact ? 'is-compact' : ''}`}>
      {/* 누적 — 가장 크게 */}
      <div className="stat-hero appear">
        <span className="stat-hero-label">
          <Kr>누적 방문자</Kr><En>Total visitors</En>
        </span>
        <strong className="stat-hero-num">
          <CountUp value={data.total} duration={1400} />
        </strong>
        <span className="stat-hero-unit"><Kr>명</Kr></span>
      </div>

      {/* 기간별 */}
      <div className="grid grid-2 visit-board-tiles">
        <div className="appear" style={{ animationDelay: '.05s' }}>
          <div className="card stat-tile">
            <span className="stat-tile-label"><Kr>최근 7일</Kr><En>Last 7 days</En></span>
            <strong className="stat-tile-num"><CountUp value={data.week} /></strong>
            <span className="stat-tile-sub">
              <Kr>명 · 하루 평균 {fmt(Math.round(data.week / 7))}명</Kr>
              <En>visitors · {fmt(Math.round(data.week / 7))} per day</En>
            </span>
          </div>
        </div>
        <div className="appear" style={{ animationDelay: '.13s' }}>
          <div className="card stat-tile">
            <span className="stat-tile-label"><Kr>이번 달</Kr><En>This month</En></span>
            <strong className="stat-tile-num"><CountUp value={data.month} /></strong>
            <span className="stat-tile-sub">
              <Kr>명 (1일부터 오늘까지)</Kr><En>visitors (month to date)</En>
            </span>
          </div>
        </div>
      </div>

      {/* 추이 */}
      <div className="appear" style={{ animationDelay: '.21s' }}>
        <div className="card visit-board-trend">
          <h3>
            <Kr>최근 7일 추이</Kr> <En>Last 7 days</En>
          </h3>
          <p className="field-hint">
            <Kr>주말은 회색으로 구분했습니다.</Kr>
            <En>Weekends are shown in grey.</En>
          </p>
          <Trend trend={data.trend} />
        </div>
      </div>
    </div>
  );
}
