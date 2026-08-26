import { createClient } from 'redis';

/**
 * 방문자 집계 API — Vercel 서버리스 함수 + Redis
 *
 * POST /api/visit  : 방문 1회 기록 (같은 방문자는 하루 1회만 집계)
 * GET  /api/visit  : 누적·오늘·이번주·이번달 수치 조회
 *
 * 개인정보를 전혀 다루지 않습니다.
 *  · IP·브라우저 정보를 읽지도, 저장하지도 않습니다.
 *  · 단순히 방문 횟수만 1씩 더합니다.
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

      /* 방문할 때마다 집계합니다 (같은 사람의 재방문도 포함) */
      await redis.incr('visits:total');
      await redis.incr(`visits:day:${today}`);
      /* 일자별 수치는 400일 뒤 자동 정리 */
      await redis.expire(`visits:day:${today}`, 34560000);

      return res.status(200).json({ ok: true, counted: true });
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
