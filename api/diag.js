/** 임시 진단 — Redis 연결 형식 확인용. 확인 후 삭제합니다. */
export default function handler(req, res) {
  const keys = Object.keys(process.env).filter((k) =>
    /REDIS|KV_|UPSTASH/i.test(k)
  );
  const info = {};
  for (const k of keys) {
    const v = process.env[k] || '';
    info[k] = {
      length: v.length,
      protocol: v.includes('://') ? v.split('://')[0] : '(없음)',
      /* 자격증명은 노출하지 않고 호스트만 */
      host: v.includes('@') ? v.split('@')[1]?.split(/[:/]/)[0] : v.split('://')[1]?.split(/[:/]/)[0],
    };
  }
  res.status(200).json({ found: keys, info });
}
