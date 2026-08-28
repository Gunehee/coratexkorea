import { useMemo, useState } from 'react';
import { En, Kr } from './Layout';
import { fmt } from './VisitDashboard';
import { useVisitHistory, useMonthDetail } from '../hooks/useVisitHistory';

/**
 * 전체 기록(월별) — /stats 페이지 전용.
 *
 * 처음에는 접혀 있다가, "전체 기록 보기"를 누르면 최근 24개월을
 * 막대그래프로 보여줍니다. 막대를 누르면 그 달의 일별 추이가
 * 아래에 펼쳐집니다(다시 누르면 접힘).
 *
 * 방문 데이터가 없던 달(서비스 시작 전)은 0으로 그대로 표시합니다 —
 * 값을 숨기면 "그 달엔 없었나?"와 "아직 기록 전인가?"를 구분할 수 없기
 * 때문입니다.
 */

function monthLabel(ym) {
  const [y, m] = ym.split('-');
  return { y, m: String(Number(m)) };
}

function MonthDayTrend({ ym, trend }) {
  if (!trend) return null;
  const max = Math.max(...trend.map((t) => t.count), 1);
  return (
    <div className="history-daytrend appear">
      <div className="history-daytrend-bars">
        {trend.map((t) => (
          <div
            className="history-daybar"
            key={t.date}
            style={{ height: `${Math.max((t.count / max) * 100, 2)}%` }}
            title={`${t.date} · ${t.count}명`}
          />
        ))}
      </div>
      <div className="history-daytrend-foot">
        <span>1<Kr>일</Kr></span>
        <span>{trend.length}<Kr>일</Kr></span>
      </div>
    </div>
  );
}

export default function VisitHistory() {
  const { months, state, load } = useVisitHistory();
  const { load: loadMonth, cache, loadingMonth } = useMonthDetail();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const max = useMemo(
    () => Math.max(...(months || []).map((m) => m.count), 1),
    [months]
  );

  async function toggle() {
    if (!open && state === 'idle') load();
    setOpen((v) => !v);
  }

  async function selectMonth(ym) {
    if (selected === ym) { setSelected(null); return; }
    setSelected(ym);
    if (!cache[ym]) await loadMonth(ym);
  }

  return (
    <div className="history">
      <button type="button" className="history-toggle" onClick={toggle} aria-expanded={open}>
        <Kr>{open ? '전체 기록 접기' : '전체 기록 보기 (월별 · 연도별)'}</Kr>
        <En>{open ? 'Hide full history' : 'View full history (by month & year)'}</En>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
          className={`history-chevron ${open ? 'is-open' : ''}`}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="card history-panel appear">
          {state === 'loading' && (
            <p className="stats-msg"><Kr>불러오는 중…</Kr><En>Loading…</En></p>
          )}
          {state === 'error' && (
            <p className="stats-msg">
              <Kr>기록을 불러오지 못했습니다. </Kr><En>Could not load history. </En>
              <button type="button" className="link-btn" onClick={load}>
                <Kr>다시 시도</Kr><En>Retry</En>
              </button>
            </p>
          )}
          {state === 'ok' && months && (
            <>
              <p className="field-hint">
                <Kr>최근 24개월 방문자 수입니다. 막대를 누르면 일별 추이를 볼 수 있습니다.</Kr>
                <En>Visitors over the last 24 months. Click a bar to see daily detail.</En>
              </p>
              <div className="history-months">
                {months.map((m) => {
                  const { y, mo } = monthLabel(m.month);
                  const isSel = selected === m.month;
                  return (
                    <div className="history-month" key={m.month}>
                      <button
                        type="button"
                        className={`history-bar-btn ${isSel ? 'is-selected' : ''}`}
                        onClick={() => selectMonth(m.month)}
                        aria-expanded={isSel}
                      >
                        <span className="history-bar-value">{fmt(m.count)}</span>
                        <span className="history-bar-wrap">
                          <span
                            className="history-bar"
                            style={{ height: `${Math.max((m.count / max) * 100, 2)}%` }}
                          />
                        </span>
                        <span className="history-bar-label">{y}.{monthLabel(m.month).m.padStart(2, '0')}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {selected && (
                <div className="history-detail">
                  <h4>{selected} <Kr>일별 추이</Kr><En>Daily detail</En></h4>
                  {loadingMonth === selected && (
                    <p className="stats-msg"><Kr>불러오는 중…</Kr><En>Loading…</En></p>
                  )}
                  {cache[selected] && <MonthDayTrend ym={selected} trend={cache[selected]} />}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
