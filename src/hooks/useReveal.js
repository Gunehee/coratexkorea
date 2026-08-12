import { useEffect } from 'react';

/**
 * 스크롤 진입 애니메이션.
 *
 * .reveal 요소가 화면에 들어오면 .is-in 을 붙여 서서히 나타나게 합니다.
 *
 * 안전장치:
 *  · JS 가 실행되지 않으면 CSS 가 .reveal 을 그대로 보이게 두므로
 *    콘텐츠가 사라지지 않습니다. (프리렌더 HTML·검색엔진 대응)
 *  · 사용자가 "동작 줄이기"를 켜 두었으면 즉시 표시하고 관찰하지 않습니다.
 *  · IntersectionObserver 미지원 환경에서도 즉시 표시합니다.
 */
export function useReveal(deps = []) {
  useEffect(() => {
    /* JS 가 동작함을 CSS 에 알립니다 — 이때부터 .reveal 이 숨겨집니다. */
    document.documentElement.classList.add('js');

    const targets = document.querySelectorAll('.reveal:not(.is-in)');
    if (!targets.length) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);   /* 한 번만 실행 */
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
