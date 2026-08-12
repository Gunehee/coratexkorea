import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 스크롤 진입 애니메이션.
 *
 * .reveal 요소가 화면에 들어오면 .is-in 을 붙여 서서히 나타나게 합니다.
 *
 * 안전장치 (콘텐츠가 안 보이는 사고를 막는 장치들):
 *  · JS 가 실행되지 않으면 CSS 가 .reveal 을 그대로 보이게 둡니다.
 *  · "동작 줄이기" 설정이면 즉시 표시합니다.
 *  · IntersectionObserver 미지원 환경에서도 즉시 표시합니다.
 *  · 관찰 등록 직후, 이미 화면 안에 있는 요소는 즉시 표시합니다.
 *    (페이지 이동으로 새 콘텐츠가 이미 보이는 위치에 그려진 경우)
 *  · 최후의 보루: 1.2초 뒤에도 숨겨진 요소가 있으면 강제로 표시합니다.
 */
export function useReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    /* JS 가 동작함을 CSS 에 알립니다 — 이때부터 .reveal 이 숨겨집니다. */
    document.documentElement.classList.add('js');

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    /* DOM 이 새 페이지로 교체된 뒤에 관찰을 시작해야 합니다.
       (교체 전에 등록하면 옛 요소를 관찰하게 되어 새 콘텐츠가 숨겨진 채 남습니다) */
    let io;
    let failSafe;

    const raf = requestAnimationFrame(() => {
      const targets = document.querySelectorAll('.reveal:not(.is-in)');
      if (!targets.length) return;

      const showAll = () => targets.forEach((el) => el.classList.add('is-in'));

      if (reduce || typeof IntersectionObserver === 'undefined') {
        showAll();
        return;
      }

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );

      targets.forEach((el) => {
        /* 이미 화면 안(또는 위쪽)에 있으면 관찰을 기다리지 않고 바로 표시 */
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          el.classList.add('is-in');
        } else {
          io.observe(el);
        }
      });

      /* 어떤 이유로든 표시되지 않은 요소가 남으면 강제로 보이게 합니다.
         애니메이션보다 콘텐츠 노출이 항상 우선입니다. */
      failSafe = setTimeout(showAll, 1200);
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failSafe);
      io?.disconnect();
    };
  }, [pathname]);
}
