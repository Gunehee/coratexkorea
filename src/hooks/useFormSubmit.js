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

  async function submit({ subject, bodyLines }) {
    const bodyText = bodyLines.filter((l) => l !== undefined && l !== null).join('\n');

    if (hasFormEndpoint) {
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject,
            from_name: 'CORATEX 홈페이지',
            message: bodyText,
          }),
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success) {
          setMsg({
            ok: true,
            text: t(
              '전송되었습니다. 확인 후 빠르게 연락드리겠습니다.',
              'Sent. We will get back to you shortly.'
            ),
          });
          return;
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
      ),
    });
  }

  return { submit, msg, setMsg };
}

function openMailto(subject, bodyText) {
  window.location.href =
    `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
}
