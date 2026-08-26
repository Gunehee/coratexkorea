import { useState, useEffect, useCallback } from 'react';
import { En, Kr } from '../components/Layout';

/**
 * 방문자 통계 — 내부 전용 페이지.
 * 검색엔진 색인 제외(robots.txt + noindex), 메뉴에도 노출하지 않습니다.
 */
const REFRESH_MS = 60000; // 1분마다 자동 갱신

function useStats() {
  const [data, setData] = useState(null);
  const [state, setState] = useState('loading'); // loading | ok | error | notReady

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/visit', { cache: 'no-store' });
      if (res.status === 503) { setState('notReady'); return; }
      if (!res.ok) throw new Error();
      setData(await res.json());
      setState('ok');
    } catch {
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  return { data, state, reload: load };
}

/** 숫자를 3자리 단위로 */
const fmt = (n) => (n ?? 0).toLocaleString('ko-KR');

/** 요일 (한국 시간 기준 날짜 문자열에서) */
const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
function weekdayOf(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return WEEKDAY[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

function Trend({ trend }) {
  if (!trend?.length) return null;
  const max = Math.max(...trend.map((t) => t.count), 1);

  return (
    <div className="trend">
      {trend.map((t) => {
        const day = weekdayOf(t.date);
        const weekend = day === '토' || day === '일';
        return (
          <div className="trend-col" key={t.date}>
            <span className="trend-value">{fmt(t.count)}</span>
            <div className="trend-bar-wrap">
              <div
                className={`trend-bar ${weekend ? 'is-weekend' : ''}`}
                style={{ height: `${Math.max((t.count / max) * 100, 3)}%` }}
              />
            </div>
            <span className={`trend-day ${weekend ? 'is-weekend' : ''}`}>{day}</span>
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
          <span className="section-eyebrow">내부 전용</span>
          <h2><Kr>방문자 통계</Kr> <En>Visitor statistics</En></h2>
          <p>
            같은 방문자는 하루에 한 번만 집계됩니다. 1분마다 자동으로 새로고침됩니다.
          </p>
        </div>

        {state === 'loading' && <p className="stats-msg">불러오는 중…</p>}

        {state === 'notReady' && (
          <div className="note">
            <p><strong>방문자 저장소가 아직 연결되지 않았습니다.</strong></p>
            <p>
              Vercel 대시보드 → Storage 에서 Upstash Redis 를 연결하면
              이 화면에 수치가 표시됩니다. 연결 전까지 사이트의 다른 기능에는
              아무 영향이 없습니다.
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className="note">
            <p><strong>수치를 불러오지 못했습니다.</strong></p>
            <p>
              잠시 후 다시 시도해 주세요.{' '}
              <button type="button" className="link-btn" onClick={reload}>다시 불러오기</button>
            </p>
          </div>
        )}

        {state === 'ok' && data && (
          <>
            {/* 누적 — 가장 크게 */}
            <div className="stat-hero">
              <span className="stat-hero-label">누적 방문자</span>
              <strong className="stat-hero-num">{fmt(data.total)}</strong>
              <span className="stat-hero-unit">명</span>
            </div>

            {/* 기간별 */}
            <div className="grid grid-3" style={{ marginTop: 26 }}>
              <div className="card stat-tile">
                <span className="stat-tile-label">오늘</span>
                <strong className="stat-tile-num">{fmt(data.today)}</strong>
                <span className="stat-tile-sub">명</span>
              </div>
              <div className="card stat-tile">
                <span className="stat-tile-label">최근 7일</span>
                <strong className="stat-tile-num">{fmt(data.week)}</strong>
                <span className="stat-tile-sub">
                  명 · 하루 평균 {fmt(Math.round(data.week / 7))}명
                </span>
              </div>
              <div className="card stat-tile">
                <span className="stat-tile-label">이번 달</span>
                <strong className="stat-tile-num">{fmt(data.month)}</strong>
                <span className="stat-tile-sub">명 (1일부터 오늘까지)</span>
              </div>
            </div>

            {/* 추이 */}
            <div className="card" style={{ marginTop: 26, padding: 24 }}>
              <h3 style={{ marginBottom: 4 }}>최근 7일 추이</h3>
              <p className="field-hint" style={{ marginBottom: 18 }}>
                주말은 회색으로 구분했습니다. 거래처는 주로 평일에 방문합니다.
              </p>
              <Trend trend={data.trend} />
            </div>

            <p className="stats-updated">
              마지막 갱신 {new Date(data.updatedAt).toLocaleString('ko-KR')}
              {' · '}
              <button type="button" className="link-btn" onClick={reload}>지금 새로고침</button>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
