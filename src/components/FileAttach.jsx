import { useRef, useState } from 'react';
import { En, Kr } from './Layout';

/**
 * 사진 첨부 — 사업자등록증 · 명함.
 *
 * 휴대폰으로 찍은 사진은 보통 3~8MB 라 그대로 보내면 메일 용량을 넘깁니다.
 * 그래서 보내기 전에 브라우저에서 긴 변 1600px 로 줄여 용량을 낮춥니다.
 * (글씨는 충분히 읽히면서 대개 1MB 아래로 떨어집니다)
 *
 * 선택한 사진은 전송 순간까지 브라우저 안에만 있습니다.
 */

const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;
/* 줄인 뒤에도 이보다 크면 받지 않습니다(서버 한도와 맞춤). */
const MAX_BYTES = 8 * 1024 * 1024;

export const ATTACH_SLOTS = [
  { key: 'license', ko: '사업자등록증', en: 'Business registration' },
  { key: 'card', ko: '명함', en: 'Business card' },
];

const prettySize = (b) =>
  b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)}MB` : `${Math.max(Math.round(b / 1024), 1)}KB`;

/** 이미지를 긴 변 기준으로 줄여 JPEG base64 로 만듭니다. PDF 는 그대로 둡니다. */
async function shrink(file) {
  if (file.type === 'application/pdf') {
    return { content: await toBase64(file), filename: file.name, type: file.type, size: file.size };
  }

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) {
    /* 브라우저가 못 여는 형식(일부 HEIC 등) — 원본 그대로 보냅니다. */
    return { content: await toBase64(file), filename: file.name, type: file.type, size: file.size };
  }

  const scale = Math.min(MAX_EDGE / Math.max(bitmap.width, bitmap.height), 1);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  const content = dataUrl.split(',')[1];
  const size = Math.floor((content.length * 3) / 4);
  const base = file.name.replace(/\.[^.]+$/, '') || 'photo';

  return { content, filename: `${base}.jpg`, type: 'image/jpeg', size };
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/**
 * @param {object}   props
 * @param {object}   props.files   { license?: {...}, card?: {...} }
 * @param {Function} props.onChange 다음 files 객체를 받습니다
 * @param {Function} props.t        번역 함수
 */
export default function FileAttach({ files, onChange, t }) {
  const [busy, setBusy] = useState(null);
  const [err, setErr] = useState(null);
  const inputs = { license: useRef(null), card: useRef(null) };

  async function pick(key, e) {
    const file = e.target.files?.[0];
    /* 같은 파일을 다시 고를 수 있도록 input 을 비웁니다. */
    e.target.value = '';
    if (!file) return;

    setErr(null);
    setBusy(key);
    try {
      const prepared = await shrink(file);
      if (prepared.size > MAX_BYTES) {
        setErr(t(
          `사진 용량이 너무 큽니다(${prettySize(prepared.size)}). 다른 사진을 선택해 주세요.`,
          `That file is too large (${prettySize(prepared.size)}). Please choose another.`
        ));
        return;
      }
      onChange({ ...files, [key]: prepared });
    } catch {
      setErr(t(
        '사진을 읽지 못했습니다. 다른 사진을 선택해 주세요.',
        'Could not read that file. Please choose another.'
      ));
    } finally {
      setBusy(null);
    }
  }

  const remove = (key) => () => {
    const next = { ...files };
    delete next[key];
    onChange(next);
    setErr(null);
  };

  return (
    <div className="attach">
      <span className="attach-title">
        <Kr>사진 첨부</Kr><En>Photo attachments</En>
        <span className="attach-optional"><Kr>선택</Kr><En>optional</En></span>
      </span>
      <span className="field-hint">
        <Kr>사업자등록증 사본과 명함을 첨부하시면 처리가 빨라집니다. 사진은 자동으로 용량을 줄여 보냅니다.</Kr>
        <En>Attaching your business registration and card speeds things up. Photos are resized automatically.</En>
      </span>

      <div className="attach-slots">
        {ATTACH_SLOTS.map(({ key, ko, en }) => {
          const f = files[key];
          const loading = busy === key;
          return (
            <div className={`attach-slot ${f ? 'is-filled' : ''}`} key={key}>
              <input
                ref={inputs[key]}
                type="file"
                id={`o-file-${key}`}
                accept="image/*,application/pdf"
                onChange={(e) => pick(key, e)}
                className="attach-input"
              />
              <label htmlFor={`o-file-${key}`} className="attach-label">
                <span className="attach-slot-name"><Kr>{ko}</Kr><En>{en}</En></span>

                {f ? (
                  <span className="attach-file">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="attach-file-name">{f.filename}</span>
                    <span className="attach-file-size">{prettySize(f.size)}</span>
                  </span>
                ) : (
                  <span className="attach-cta">
                    {loading ? (
                      <><Kr>불러오는 중…</Kr><En>Loading…</En></>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" />
                        </svg>
                        <Kr>사진 선택</Kr><En>Choose photo</En>
                      </>
                    )}
                  </span>
                )}
              </label>

              {f && (
                <button type="button" className="attach-remove" onClick={remove(key)}>
                  <Kr>삭제</Kr><En>Remove</En>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {err && <span className="field-error" role="alert">{err}</span>}
    </div>
  );
}
