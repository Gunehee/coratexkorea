import { useState } from 'react';
import { company } from '../data/site';
import { WEB3FORMS_ACCESS_KEY, hasFormEndpoint } from '../data/formEndpoint';

/**
 * 문의·발주 폼 공통 전송 로직.
 *
 * - 키가 설정되어 있으면: Web3Forms 로 즉시 전송 → 버튼 한 번으로 끝.
 * - 키가 없으면: mailto: 로 메일 앱을 열어 방문자가 한 번 더 보내야 합니다.
 *   (지금까지의 동작 — 안전한 기본값)
 *
 * 두 경우 모두 서버·데이터베이스를 쓰지 않고, 입력값은 어디에도 저장되지 않습니다.
 *
 * 사용법:
 *   const { submit, msg, setMsg } = useFormSubmit(t);
 *   await submit({ subject, bodyLines: ['라벨: 값', ...] });
 */
export function useFormSubmit(t) {
  const [msg, setMsg] = useState(null);

  async function submit({ subject, bodyLines, attachments }) {
    const bodyText = bodyLines.filter((l) => l !== undefined && l !== null).join('\n');
    const files = (attachments || []).filter(Boolean);

    /* 사진이 있으면 첨부를 지원하는 자체 엔드포인트로 보냅니다.
       (Web3Forms 는 첨부가 유료라 쓸 수 없습니다)
       아직 메일 키가 설정되지 않았다면 501 이 오는데,
       그때는 발주 자체는 기존 경로로 접수하되, 사진이 빠졌다는 사실을
       반드시 알려 드립니다(보냈다고 오해하시면 안 되므로). */
    let attachDropped = false;

    if (files.length) {
      try {
        const res = await fetch('/api/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, bodyLines, attachments: files }),
        });
        if (res.ok) {
          setMsg({
            ok: true,
            text: t(
              '전송되었습니다. 첨부하신 사진도 함께 접수되었습니다.',
              'Sent. Your attachments were included.'
            ),
          });
          return true;
        }
        /* 501(미설정) 외의 오류는 사진을 못 보낸 것이므로 알려야 합니다. */
        if (res.status !== 501) {
          const data = await res.json().catch(() => null);
          setMsg({ ok: false, text: attachErrorText(data?.error, t, company) });
          return false;
        }
        attachDropped = true;
      } catch {
        /* 네트워크 오류 — 아래 기존 경로로 폴백합니다. */
        attachDropped = true;
      }
    }

    /* 사진이 빠진 채 접수될 때 덧붙일 안내. */
    const droppedNote = attachDropped
      ? t(
          ` 다만 첨부하신 사진은 함께 보내지 못했습니다. ${company.email} 로 사진을 보내주십시오.`,
          ` However, your photos could not be attached. Please email them to ${company.email}.`
        )
      : '';

    if (hasFormEndpoint) {
      try {
        /* FormData 로 보냅니다.
           JSON + Content-Type 헤더를 쓰면 브라우저가 preflight(OPTIONS)를
           먼저 보내는데, Web3Forms 는 이를 403 으로 거부해 전송이 실패합니다.
           FormData 는 preflight 없는 "단순 요청"이라 정상 전송됩니다. */
        const fd = new FormData();
        fd.append('access_key', WEB3FORMS_ACCESS_KEY);
        fd.append('subject', subject);
        fd.append('from_name', 'CORATEX 홈페이지');
        /* 수신처를 명시합니다. 키에 등록된 주소가 기본이지만,
           명시해 두면 계정 설정과 무관하게 이 주소로 발송됩니다. */
        fd.append('to', company.email);
        fd.append('replyto', company.email);
        fd.append('message', bodyText);

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: fd,
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success) {
          setMsg({
            ok: true,
            text: t(
              '전송되었습니다. 확인 후 빠르게 연락드리겠습니다.',
              'Sent. We will get back to you shortly.'
            ) + droppedNote,
          });
          return true;   /* 성공 — 폼을 비웁니다 */
        }
        throw new Error(data?.message || 'submit failed');
      } catch {
        /* 네트워크 오류 등으로 실패하면 mailto: 로 안전하게 폴백합니다. */
        openMailto(subject, bodyText);
        setMsg({
          ok: true,
          text: t(
            `자동 전송이 원활하지 않아 메일 프로그램을 열었습니다. 열리지 않으면 ${company.mobile} 으로 전화 주십시오.`,
            `Automatic sending failed, so we opened your email app instead. If it does not open, please call ${company.mobile}.`
          ),
        });
        return;
      }
    }

    /* 키 미설정 — 기존 mailto 방식 */
    openMailto(subject, bodyText);
    setMsg({
      ok: true,
      text: t(
        `메일 프로그램이 열립니다. 열리지 않으면 ${company.mobile} 으로 전화 주십시오.`,
        `Your email app should open. If it does not, please call ${company.mobile}.`
      ) + droppedNote,
    });
  }

  return { submit, msg, setMsg };
}

/** 첨부 전송 실패 사유를 방문자가 이해할 수 있는 말로 바꿉니다. */
function attachErrorText(code, t, co) {
  switch (code) {
    case 'file_too_large':
    case 'total_too_large':
      return t(
        '사진 용량이 너무 큽니다. 사진을 한 장만 첨부하거나 더 작은 사진으로 시도해 주세요.',
        'The photos are too large. Please attach just one, or use a smaller photo.'
      );
    case 'unsupported_type':
      return t(
        '지원하지 않는 파일 형식입니다. 사진(JPG·PNG) 또는 PDF 를 첨부해 주세요.',
        'Unsupported file type. Please attach a photo (JPG/PNG) or a PDF.'
      );
    default:
      return t(
        `전송에 실패했습니다. 잠시 후 다시 시도하시거나 ${co.mobile} 으로 전화 주십시오.`,
        `Sending failed. Please try again shortly or call ${co.mobile}.`
      );
  }
}

function openMailto(subject, bodyText) {
  window.location.href =
    `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
}
