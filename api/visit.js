import { createClient } from 'redis';

/**
 * 방문자 집계 API — Vercel 서버리스 함수 + Redis
 *
 * POST /api/visit               : 방문 1회 기록 (같은 방문자는 하루 1회만 집계)
 * GET  /api/visit                : 누적·오늘·이번주·이번달 수치 조회
 * GET  /api/visit?history=1      : 방문이 있었던 달만 월별 합계로 반환 (최대 24개월, 전체 기록 보기용)
 * GET  /api/visit?month=YYYY-MM  : 해당 월의 일별 추이
 *
 * 개인정보를 전혀 다루지 않습니다.
 *  · IP·브라우저 정보를 읽지도, 저장하지도 않습니다.
 *  · 단순히 방문 횟수만 1씩 더합니다.
 *
 * 저장 구조:
 *  · visits:day:YYYY-MM-DD   — 일별 카운트, 400일 뒤 만료 (기존 그대로)
 *  · visits:month:YYYY-MM    — 월별 합계, 만료 없이 영구 보관.
 *    일별 키가 만료된 뒤에도 월별 총계는 계속 조회할 수 있도록
 *    방문 시점에 두 키를 함께 올립니다.
 */

const KST_OFFSET = 9 * 60 * 60 * 1000; // 한국 시간 기준으로 날짜를 끊습니다

/** 한국 시간 기준 오늘 날짜 (YYYY-MM-DD) */
function todayKST(now = new Date()) {
  return new Date(now.getTime() + KST_OFFSET).toISOString().slice(0, 10);
}

/** 최근 N일의 날짜 목록 (오늘 포함) */
function recentDays(n, now = new Date()) {
  const out = [];
  for (let i = 0; i < n; i += 1) {
    out.push(todayKST(new Date(now.getTime() - i * 86400000)));
  }
  return out;
}

/** 이번 달 1일부터 오늘까지의 날짜 목록 */
function monthDays(now = new Date()) {
  const day = Number(todayKST(now).slice(8, 10));
  return recentDays(day, now);
}

/** 해당 연/월의 마지막 날짜 (28~31) */
function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** 특정 월(YYYY-MM)의 전체 날짜 목록 */
function allDaysInMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  const last = daysInMonth(y, m);
  return Array.from({ length: last }, (_, i) =>
    `${ym}-${String(i + 1).padStart(2, '0')}`);
}

/** 최근 N개월의 YYYY-MM 목록 (이번 달 포함, 최신순) */
function recentMonths(n, now = new Date()) {
  const today = todayKST(now);
  const [y, m] = today.slice(0, 7).split('-').map(Number);
  const out = [];
  for (let i = 0; i < n; i += 1) {
    const idx = m - 1 - i;
    const yy = y + Math.floor(idx / 12);
    const mm = ((idx % 12) + 12) % 12 + 1;
    out.push(`${yy}-${String(mm).padStart(2, '0')}`);
  }
  return out;
}

/** YYYY-MM 형식 검증 — 잘못된 값으로 임의 키를 조회하지 못하게 막습니다 */
function isValidMonth(ym) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(ym);
}

/* 서버리스 인스턴스가 살아있는 동안 연결을 재사용합니다.
   매 요청마다 새로 연결하면 느리고 연결 수 한도에 걸립니다. */
let clientPromise = null;

function getClient() {
  const url = process.env.REDIS_URL || process.env.KV_URL;
  if (!url) throw new Error('REDIS_NOT_CONFIGURED');

  if (!clientPromise) {
    const client = createClient({
      url,
      socket: { connectTimeout: 5000, reconnectStrategy: (n) => (n > 2 ? false : 200) },
    });
    /* 연결이 끊기면 다음 요청에서 새로 만들도록 초기화 */
    client.on('error', () => { clientPromise = null; });
    clientPromise = client.connect().then(() => client).catch((e) => {
      clientPromise = null;
      throw e;
    });
  }
  return clientPromise;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    const redis = await getClient();

    if (req.method === 'POST') {
      const today = todayKST();
      const thisMonth = today.slice(0, 7);

      /* 방문할 때마다 집계합니다 (같은 사람의 재방문도 포함) */
      await redis.incr('visits:total');
      await redis.incr(`visits:day:${today}`);
      /* 일자별 수치는 400일 뒤 자동 정리 */
      await redis.expire(`visits:day:${today}`, 34560000);
      /* 월별 합계는 만료 없이 영구 보관 — 일별 키가 정리된 뒤에도
         "이 달에 몇 명 왔는지"는 계속 남습니다 */
      await redis.incr(`visits:month:${thisMonth}`);

      return res.status(200).json({ ok: true, counted: true });
    }

    /* GET — 특정 월의 일별 추이 (지난 달 이전 조회용) */
    if (req.query?.month) {
      const ym = String(req.query.month);
      if (!isValidMonth(ym)) {
        return res.status(400).json({ error: 'invalid_month' });
      }
      const days = allDaysInMonth(ym);
      const values = await redis.mGet(days.map((d) => `visits:day:${d}`));
      return res.status(200).json({
        month: ym,
        trend: days.map((d, i) => ({ date: d, count: Number(values[i] || 0) })),
        updatedAt: new Date().toISOString(),
      });
    }

    /* GET — 전체 기록(월별 합계, 최근 24개월) */
    if (req.query?.history) {
      const months = recentMonths(24);
      const values = await redis.mGet(months.map((m) => `visits:month:${m}`));
      const counts = values.map(Number);

      /* 월별 키가 아직 없는 달(이 집계 기능을 붙이기 전 방문분)은
         일별 키가 살아있는 동안(400일 이내)에는 그걸 합산해 보정하고,
         그 결과를 월별 키에 저장해 다음부터는 바로 조회되게 합니다. */
      await Promise.all(months.map(async (m, i) => {
        if (counts[i] > 0) return;
        const days = allDaysInMonth(m).filter((d) => d <= todayKST());
        if (!days.length) return;
        const dayValues = await redis.mGet(days.map((d) => `visits:day:${d}`));
        const sum = dayValues.reduce((acc, v) => acc + Number(v || 0), 0);
        if (sum > 0) {
          counts[i] = sum;
          await redis.set(`visits:month:${m}`, sum);
        }
      }));

      /* 실제로 방문이 있었던 가장 오래된 달까지만 보여줍니다.
         24개월을 늘 다 채워서 보여주면 서비스 초기엔 빈 막대가
         대부분이라 어색합니다 — 데이터가 쌓이는 만큼만 늘어나야
         자연스럽습니다. 이번 달은 방문이 0이어도 항상 포함합니다
         (오늘 막 시작했을 수도 있으므로). */
      let lastIdx = 0;
      for (let i = months.length - 1; i >= 0; i -= 1) {
        if (counts[i] > 0) { lastIdx = i; break; }
      }
      const visibleMonths = months.slice(0, lastIdx + 1);
      const visibleCounts = counts.slice(0, lastIdx + 1);

      /* recentMonths() 는 이미 최신순(이번 달이 먼저)이므로 그대로 반환합니다.
         화면에서 이번 달이 맨 왼쪽에 오도록 하기 위함입니다. */
      return res.status(200).json({
        months: visibleMonths.map((m, i) => ({ month: m, count: visibleCounts[i] || 0 })),
        updatedAt: new Date().toISOString(),
      });
    }

    /* GET — 조회 */
    const days7 = recentDays(7);
    const days30 = monthDays();
    const today = todayKST();
    const keys = [...new Set([...days7, ...days30])];

    const [total, ...dayValues] = await redis.mGet([
      'visits:total',
      ...keys.map((d) => `visits:day:${d}`),
    ]);

    const byDay = {};
    keys.forEach((d, i) => { byDay[d] = Number(dayValues[i] || 0); });
    const sum = (list) => list.reduce((acc, d) => acc + (byDay[d] || 0), 0);

    return res.status(200).json({
      total: Number(total || 0),
      today: byDay[today] || 0,
      week: sum(days7),
      month: sum(days30),
      /* 최근 7일 추이 (오래된 순) */
      trend: days7.slice().reverse().map((d) => ({ date: d, count: byDay[d] || 0 })),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    const notConfigured = String(err.message).includes('REDIS_NOT_CONFIGURED');
    return res.status(notConfigured ? 503 : 500).json({
      error: notConfigured ? 'not_configured' : 'failed',
      message: notConfigured
        ? '방문자 저장소가 아직 연결되지 않았습니다.'
        : '집계 처리 중 오류가 발생했습니다.',
    });
  }
}
