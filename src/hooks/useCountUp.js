import { useState, useEffect, useRef } from 'react';

/**
 * 숫자가 0에서 목표값까지 올라가는 효과.
 *
 * · 감속 곡선(ease-out)이라 마지막에 부드럽게 멈춥니다.
 * · "동작 줄이기" 설정이면 즉시 최종값을 보여줍니다.
 * · 값이 바뀌면 현재 표시값에서 새 값으로 이어서 올라갑니다.
 */
export function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const goal = Number(target) || 0;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduce || goal === 0) {
      fromRef.current = goal;
      setValue(goal);
      return undefined;
    }

    const from = fromRef.current;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      /* ease-out cubic — 빠르게 올라가다 부드럽게 감속 */
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (goal - from) * eased));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = goal;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}
