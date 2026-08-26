/**
 * 방문자 집계 API — Vercel 서버리스 함수 + Upstash Redis
 *
 * POST /api/visit  : 방문 1회 기록 (같은 방문자는 하루 1회만 집계)
 * GET  /api/visit  : 누적·오늘·이번주·이번달 수치 조회
 *
 * 개인정보를 저장하지 않습니다.
 *  · IP 는 저장하지 않고, 해시로 바꿔 "오늘 이미 셌는지" 판별에만 씁니다.
 *  · 해시 키는 24시간 뒤 자동 삭제됩니다.
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
  const today = todayKST(now);
  const day = Number(today.slice(8, 10));
  return recentDays(day, now);
}

/** Upstash Redis REST 호출 */
async function redis(commands) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('REDIS_NOT_CONFIGURED');

  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`REDIS_HTTP_${res.status}`);
  return (await res.json()).map((r) => r.result);
}

/** 방문자 식별용 해시 — 원본 IP 는 저장하지 않습니다. */
async function visitorHash(req) {
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.headers['x-real-ip'] || 'unknown';
  const ua = req.headers['user-agent'] || '';
  const data = new TextEncoder().encode(`${ip}|${ua}|coratex`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).slice(0, 12)
    .map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'POST') {
      const today = todayKST();
      const hash = await visitorHash(req);

      /* 같은 방문자가 오늘 이미 집계됐는지 확인 (24시간 유효) */
      const [isNew] = await redis([['SET', `seen:${today}:${hash}`, '1', 'NX', 'EX', '86400']]);

      if (isNew) {
        await redis([
          ['INCR', 'visits:total'],
          ['INCR', `visits:day:${today}`],
          /* 일자별 수치는 400일 뒤 자동 정리 */
          ['EXPIRE', `visits:day:${today}`, '34560000'],
        ]);
      }
      return res.status(200).json({ ok: true, counted: Boolean(isNew) });
    }

    /* GET — 조회 */
    const days7 = recentDays(7);
    const days30 = monthDays();
    const today = todayKST();

    const keys = [...new Set([...days7, ...days30])];
    const results = await redis([
      ['GET', 'visits:total'],
      ...keys.map((d) => ['GET', `visits:day:${d}`]),
    ]);

    const total = Number(results[0] || 0);
    const byDay = {};
    keys.forEach((d, i) => { byDay[d] = Number(results[i + 1] || 0); });

    const sum = (list) => list.reduce((acc, d) => acc + (byDay[d] || 0), 0);

    return res.status(200).json({
      total,
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
