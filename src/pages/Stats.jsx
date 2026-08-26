import { useState, useEffect, useCallback } from 'react';
import { En, Kr } from '../components/Layout';

/**
 * 방문 현황 — 공개 페이지.
 * 누적 방문자 수를 중심으로, 오늘/최근 7일/이번 달을 함께 보여줍니다.
 */
const REFRESH_MS = 60000; // 1분마다 갱신 (탭이 보일 때만)

function useStats() {
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading'); // loading | ok | error

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/visit', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      setData(await res.json());
      setState('ok');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
    /* 탭이 화면에 보일 때만 갱신합니다. */
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

const fmt = (n) => (n ?? 0).toLocaleString('ko-KR');

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

export default function Stats() {
  const { data, state, reload } = useStats();

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
            {/* 누적 — 가장 크게 */}
            <div className="stat-hero reveal">
              <span className="stat-hero-label">
                <Kr>누적 방문자</Kr><En>Total visitors</En>
              </span>
              <strong className="stat-hero-num">{fmt(data.total)}</strong>
              <span className="stat-hero-unit"><Kr>명</Kr></span>
            </div>

            {/* 기간별 */}
            <div className="grid grid-3" style={{ marginTop: 26 }}>
              <div className="reveal">
                <div className="card stat-tile">
                  <span className="stat-tile-label"><Kr>오늘</Kr><En>Today</En></span>
                  <strong className="stat-tile-num">{fmt(data.today)}</strong>
                  <span className="stat-tile-sub"><Kr>명</Kr><En>visitors</En></span>
                </div>
              </div>
              <div className="reveal" data-delay="1">
                <div className="card stat-tile">
                  <span className="stat-tile-label"><Kr>최근 7일</Kr><En>Last 7 days</En></span>
                  <strong className="stat-tile-num">{fmt(data.week)}</strong>
                  <span className="stat-tile-sub">
                    <Kr>명 · 하루 평균 {fmt(Math.round(data.week / 7))}명</Kr>
                    <En>visitors · {fmt(Math.round(data.week / 7))} per day</En>
                  </span>
                </div>
              </div>
              <div className="reveal" data-delay="2">
                <div className="card stat-tile">
                  <span className="stat-tile-label"><Kr>이번 달</Kr><En>This month</En></span>
                  <strong className="stat-tile-num">{fmt(data.month)}</strong>
                  <span className="stat-tile-sub">
                    <Kr>명 (1일부터 오늘까지)</Kr><En>visitors (month to date)</En>
                  </span>
                </div>
              </div>
            </div>

            {/* 추이 */}
            <div className="reveal">
              <div className="card" style={{ marginTop: 26, padding: 24 }}>
                <h3 style={{ marginBottom: 4 }}>
                  <Kr>최근 7일 추이</Kr> <En>Last 7 days</En>
                </h3>
                <p className="field-hint" style={{ marginBottom: 18 }}>
                  <Kr>주말은 회색으로 구분했습니다.</Kr>
                  <En>Weekends are shown in grey.</En>
                </p>
                <Trend trend={data.trend} />
              </div>
            </div>

            <p className="stats-updated">
              <Kr>
                같은 방문자는 하루에 한 번만 집계됩니다. 개인을 식별할 수 있는
                정보는 저장하지 않습니다.
              </Kr>
              <En>
                Each visitor is counted once per day. No personally identifiable
                information is stored.
              </En>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
