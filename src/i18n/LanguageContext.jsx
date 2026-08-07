import { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * KR/EN 언어 상태 — 기존 js/lang-toggle.js 와 동일하게 동작합니다.
 *  · 저장 키: 'coratex_lang' (원본과 동일)
 *  · 기본값: 'kr'
 *  · <body data-lang="…"> 로 CSS 가 표시/숨김을 처리합니다.
 *  · 서버(백엔드) 없이 localStorage 만 사용합니다.
 */
const STORAGE_KEY = 'coratex_lang';
const DEFAULT_LANG = 'kr';

const LanguageContext = createContext({ lang: DEFAULT_LANG, setLang: () => {} });

export function useLanguage() {
  return useContext(LanguageContext);
}

/** SSR(프리렌더) 중에는 window 가 없으므로 기본값을 씁니다. */
function readStored() {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'kr' || saved === 'en' ? saved : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);

  /* 저장된 선택은 마운트 후에 적용합니다.
     (프리렌더 HTML 은 항상 기본값이므로 hydration 불일치가 없습니다.) */
  useEffect(() => {
    const saved = readStored();
    if (saved !== DEFAULT_LANG) setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.setAttribute('data-lang', lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'ko';
  }, [lang]);

  const setLang = useCallback((next) => {
    const value = next === 'kr' || next === 'en' ? next : DEFAULT_LANG;
    setLangState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* 사생활 보호 모드 등에서 저장이 막혀도 동작은 유지합니다. */
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** 헤더의 KR / EN 전환 버튼 */
export function LanguageSwitch() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="lang-switch" role="group" aria-label="언어 선택 / Language">
      {['kr', 'en'].map((code) => (
        <button
          key={code}
          type="button"
          data-lang={code}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
