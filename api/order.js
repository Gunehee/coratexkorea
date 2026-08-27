/**
 * 발주 메일 발송 — 사진 첨부를 지원합니다.
 *
 * 왜 별도 엔드포인트인가:
 *   기존 Web3Forms 는 첨부 기능이 유료(PRO)라 무료로 쓸 수 없습니다.
 *   Resend 무료 요금제(월 3,000통)로 사업자등록증·명함 사진을
 *   메일에 그대로 붙여 보냅니다.
 *
 * 저장하지 않습니다:
 *   사진은 이 함수의 메모리를 거쳐 메일로 전달될 뿐,
 *   디스크·데이터베이스 어디에도 남지 않습니다.
 *
 * 키가 없으면 501 을 돌려주고, 화면은 첨부 없는 기존 방식으로 폴백합니다.
 */

/* 첨부 한도 — Resend 총 40MB 제한보다 넉넉히 낮게 잡습니다.
   (base64 인코딩 시 약 1.37배로 커지는 점을 감안) */
const MAX_FILES = 2;
const MAX_FILE_BYTES = 8 * 1024 * 1024;   // 파일 1개당 8MB
const MAX_TOTAL_BYTES = 16 * 1024 * 1024; // 합계 16MB

const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp',
  'application/pdf',
]);

/* 본문에 사용자 입력을 넣을 때 HTML 로 해석되지 않도록 막습니다. */
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const config = {
  api: { bodyParser: { sizeLimit: '20mb' } },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_TO_EMAIL;
  const from = process.env.ORDER_FROM_EMAIL;

  /* 아직 키가 설정되지 않았다면 화면이 기존 방식으로 폴백하도록 알립니다. */
  if (!apiKey || !to || !from) {
    return res.status(501).json({ error: 'not_configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'bad_request' });
  }

  const { subject, bodyLines, attachments } = body;

  if (typeof subject !== 'string' || !subject.trim() || !Array.isArray(bodyLines)) {
    return res.status(400).json({ error: 'bad_request' });
  }

  /* 첨부 검증 — 개수·형식·용량을 서버에서 다시 확인합니다.
     (화면에서 이미 막지만, 화면 검사는 우회될 수 있으므로) */
  const files = Array.isArray(attachments) ? attachments : [];
  if (files.length > MAX_FILES) {
    return res.status(400).json({ error: 'too_many_files' });
  }

  let total = 0;
  const prepared = [];
  for (const f of files) {
    if (!f || typeof f.content !== 'string' || typeof f.filename !== 'string') {
      return res.status(400).json({ error: 'bad_attachment' });
    }
    if (f.type && !ALLOWED_TYPES.has(f.type)) {
      return res.status(400).json({ error: 'unsupported_type' });
    }
    /* base64 길이로 원본 바이트 수를 역산합니다. */
    const bytes = Math.floor((f.content.length * 3) / 4);
    if (bytes > MAX_FILE_BYTES) {
      return res.status(400).json({ error: 'file_too_large' });
    }
    total += bytes;
    if (total > MAX_TOTAL_BYTES) {
      return res.status(400).json({ error: 'total_too_large' });
    }
    prepared.push({
      filename: f.filename.slice(0, 120),
      content: f.content,
    });
  }

  const lines = bodyLines
    .filter((l) => l !== undefined && l !== null)
    .map(String);

  const attachNote = prepared.length
    ? `<p style="margin:16px 0 0;color:#475569">첨부 ${prepared.length}개: ` +
      prepared.map((p) => esc(p.filename)).join(', ') + '</p>'
    : '<p style="margin:16px 0 0;color:#94a3b8">첨부 없음</p>';

  const html =
    '<div style="font-family:system-ui,-apple-system,\'Segoe UI\',sans-serif;' +
    'font-size:15px;line-height:1.7;color:#0f172a">' +
    lines.map((l) => `<div>${esc(l) || '&nbsp;'}</div>`).join('') +
    attachNote +
    '</div>';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text: lines.join('\n'),
        ...(prepared.length ? { attachments: prepared } : {}),
      }),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('resend failed', r.status, detail.slice(0, 300));
      return res.status(502).json({ error: 'send_failed' });
    }

    return res.status(200).json({ ok: true, attached: prepared.length });
  } catch (e) {
    console.error('order send error', e?.message);
    return res.status(502).json({ error: 'send_failed' });
  }
}
