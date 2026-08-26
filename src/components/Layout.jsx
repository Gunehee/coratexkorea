import { NavLink, Link } from 'react-router-dom';
import { nav, company, telHref, telHrefLine, href, globalCopy } from '../data/site';
import { LanguageProvider, LanguageSwitch } from '../i18n/LanguageContext';
import { useReveal } from '../hooks/useReveal';
import { useVisitTracker } from '../hooks/useVisitTracker';

/** 국문 아래 영문을 병기하는 공통 표기.
 *  body[data-lang="kr"] 이면 숨겨지고, "en" 이면 본문 크기로 표시됩니다. */
export function En({ children }) {
  return <span className="en">{children}</span>;
}

/** 국문 전용 표기 — EN 선택 시 숨겨집니다.
 *  CSS 는 텍스트 노드를 숨길 수 없으므로, En 과 짝을 이루는 국문은
 *  이 컴포넌트로 감싸야 언어 전환이 정확히 동작합니다. */
export function Kr({ children }) {
  return <span className="kr-only">{children}</span>;
}

/** 국/영문을 한 번에 표기 — <T ko="…" en="…" />
 *  프리렌더 HTML 에는 두 언어가 모두 남으므로 SEO/무자바스크립트에도 안전합니다. */
export function T({ ko, en }) {
  return (
    <>
      <Kr>{ko}</Kr>
      <En>{en}</En>
    </>
  );
}

/** data/site.js 의 <b> 태그를 안전하게 렌더링 */
export function Rich({ html }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" to={href('/')} aria-label="코라텍스 CORATEX 홈으로">
          {/* 워드마크 — 한글은 부제, 영문 CORATEX 가 주가 되도록 분리했습니다. */}
          <span className="brand-name">
            {/* 아래 CORATEX 와 중복되므로 EN 에서는 부제를 숨깁니다. */}
            <span className="brand-ko"><Kr>코라텍스</Kr></span>
            <span className="brand-en">CORATEX</span>
          </span>
          {/* 원본 태그라인 그대로 — 한자(地平商社) 포함.
              "✮ 정직이 원칙입니다" 부분만 흰색으로 강조합니다. */}
          <span className="brand-tag">
            <Kr>
              {globalCopy.taglinePrefixKo}{' '}
              <span className="brand-tag-emphasis">{globalCopy.taglineEmphasisKo}</span>
            </Kr>
            <En>
              {globalCopy.taglinePrefixEn}{' '}
              <span className="brand-tag-emphasis">{globalCopy.taglineEmphasisEn}</span>
            </En>
          </span>
        </Link>
        <nav aria-label="주 메뉴">
          <ul className="nav-menu">
            {nav.map((n) => (
              <li key={n.path}>
                <NavLink to={href(n.path)} end>
                  <Kr>{n.ko}</Kr> <En>{n.en}</En>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-actions">
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-panel">
            <h2>
              <Kr>{globalCopy.companyLineLongKo}</Kr>
              <En>{globalCopy.companyLineLongEn}</En>
            </h2>
            <ul className="contact-list">
              <li>
                <span className="label"><Kr>주소</Kr><En>Address</En></span>
                <span><Kr>{company.addressKo}</Kr><En>{company.addressEn}</En></span>
              </li>
              <li><span className="label"><Kr>전화</Kr><En>Tel</En></span><span><a href={telHrefLine}>{company.tel}</a></span></li>
              <li><span className="label"><Kr>팩스</Kr><En>Fax</En></span><span>{company.fax}</span></li>
              <li><span className="label"><Kr>휴대전화</Kr><En>Mobile</En></span><span><a href={telHref}>{company.mobile}</a></span></li>
              <li><span className="label"><Kr>이메일</Kr><En>Email</En></span><span><a href={`mailto:${company.email}`}>{company.email}</a></span></li>
            </ul>
          </div>

          <div className="footer-panel">
            <h2><Kr>바로 가기</Kr> <En>Quick Links</En></h2>
            <ul className="contact-list">
              <li>
                <span className="label"><Kr>공정</Kr><En>Process</En></span>
                <span>
                  <Link to={href('/injection')}><Kr>사출</Kr><En>Injection</En></Link> · <Link to={href('/extrusion')}><Kr>압출</Kr><En>Extrusion</En></Link> · <Link to={href('/blow_molding')}><Kr>블로우</Kr><En>Blow-Molding</En></Link>
                </span>
              </li>
              <li>
                <span className="label"><Kr>고객사</Kr><En>Customers</En></span>
                <span>
                  <Link to={href('/injection_companies')}><Kr>사출</Kr><En>Injection</En></Link> · <Link to={href('/extrusion_companies')}><Kr>압출</Kr><En>Extrusion</En></Link> · <Link to={href('/blow_molding_companies')}><Kr>블로우</Kr><En>Blow-Molding</En></Link>
                </span>
              </li>
              <li>
                <span className="label"><Kr>안내</Kr><En>Info</En></span>
                <span>
                  <Link to={href('/about')}><Kr>소개</Kr><En>About</En></Link> · <Link to={href('/effectiveness')}><Kr>제품 효과</Kr><En>Effectiveness</En></Link> · <Link to={href('/order')}><Kr>발주</Kr><En>Order</En></Link> · <Link to={href('/contact')}><Kr>문의</Kr><En>Contact</En></Link>
                </span>
              </li>
            </ul>
            <p style={{ marginTop: 16 }}>
              <Kr>※ 가격은 전화로 문의해 주십시오.</Kr>
              <En>Please call for pricing.</En>
            </p>
          </div>
        </div>

        <div className="footer-legal">
          <p className="footer-privacy">
            <Link to={href('/privacy-policy')}>
              <Kr>{globalCopy.privacyKo}</Kr> <En>{globalCopy.privacyEn}</En>
            </Link>
            <span className="footer-privacy-lead">
              <Kr>{globalCopy.privacyLeadKo}</Kr>
              <En>{globalCopy.privacyLeadEn}</En>
            </span>
          </p>
          <p>
            <Kr>{globalCopy.trademarkKo}</Kr>
            <En>{globalCopy.trademarkEn}</En>
          </p>
          <p>{globalCopy.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  /* 페이지가 바뀔 때마다 새로 나타난 .reveal 요소를 관찰합니다.
     (훅 내부에서 라우트 경로를 감지합니다) */
  useReveal();
  /* 방문 1회 기록 (내부 페이지 제외, 실패해도 사이트에 영향 없음) */
  useVisitTracker();

  return (
    <LanguageProvider>
      <a className="skip-link" href="#main"><Kr>본문 바로가기</Kr><En>Skip to content</En></a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <a className="floating-call" href={telHref}>📞 <Kr>전화 문의</Kr><En>Call us</En></a>
    </LanguageProvider>
  );
}
