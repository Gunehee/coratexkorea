import { useState, useEffect, useRef } from 'react';

/**
 * 숫자가 0에서 목표값까지 올라가는 효과.
 *
 * · 감속 곡선(ease-out)이라 마지막에 부드럽게 멈춥니다.
 * · "동작 줄이기" 설정이면 즉시 최종값을 보여줍니다.
 * · elementRef 를 넘기면 그 요소가 "화면에 보일 때"만 재생합니다 —
 *   새로고침, 다른 페이지 갔다 돌아오기, 스크롤로 다시 들어오기 등
 *   실제로 눈에 보이는 순간마다 매번 0부터 다시 재생됩니다.
 *   (넘기지 않으면 기존처럼 마운트 시 바로 재생합니다)
 */
export function useCountUp(target, duration = 1200, elementRef = null) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(0);

  const play = (goal, reduce) => {
    if (reduce || goal === 0) {
      setValue(goal);
      return;
    }
    setValue(0);
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      /* ease-out cubic — 빠르게 올라가다 부드럽게 감속 */
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(goal * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const goal = Number(target) || 0;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const el = elementRef?.current;

    /* elementRef 가 없으면 기존 동작 — 마운트되는 즉시 재생 */
    if (!el || typeof IntersectionObserver === 'undefined') {
      play(goal, reduce);
      return () => cancelAnimationFrame(rafRef.current);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            /* 화면에 들어올 때마다 매번 재생 — 나갔다 들어오면 다시 재생되도록
               unobserve 하지 않습니다. */
            cancelAnimationFrame(rafRef.current);
            play(goal, reduce);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, elementRef?.current]);

  return value;
}
