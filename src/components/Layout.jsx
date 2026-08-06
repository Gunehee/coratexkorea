import { NavLink, Link } from 'react-router-dom';
import { nav, company, telHref, telHrefLine, href } from '../data/site';

/** 국문 아래 영문을 병기하는 공통 표기 */
export function En({ children }) {
  return <span className="en">{children}</span>;
}

/** data/site.js 의 <b> 태그를 안전하게 렌더링 */
export function Rich({ html }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link className="brand" to={href('/')}>
          코라텍스 CORATEX
          <span className="brand-tag">✮ Honest is our policy</span>
        </Link>
        <nav aria-label="주 메뉴">
          <ul className="nav-menu">
            {nav.map((n) => (
              <li key={n.path}>
                <NavLink to={href(n.path)} end>
                  {n.ko} <En>{n.en}</En>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <a className="nav-call" href={telHref}>전화 {company.mobile}</a>
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
            <h2>{company.nameKo} <En>{company.nameEn}</En></h2>
            <span className="footer-sole">✳ 독점권자 · Sole Distributorship in Korea</span>
            <ul className="contact-list">
              <li>
                <span className="label">주소</span>
                <span>{company.addressKo}<En>{company.addressEn}</En></span>
              </li>
              <li><span className="label">전화</span><span><a href={telHrefLine}>{company.tel}</a></span></li>
              <li><span className="label">팩스</span><span>{company.fax}</span></li>
              <li><span className="label">휴대전화</span><span><a href={telHref}>{company.mobile}</a></span></li>
              <li><span className="label">이메일</span><span><a href={`mailto:${company.email}`}>{company.email}</a></span></li>
            </ul>
          </div>

          <div className="footer-panel">
            <h2>바로 가기 <En>Quick Links</En></h2>
            <ul className="contact-list">
              <li>
                <span className="label">공정</span>
                <span>
                  <Link to={href('/injection')}>사출</Link> · <Link to={href('/extrusion')}>압출</Link> · <Link to={href('/blow_molding')}>블로우</Link>
                </span>
              </li>
              <li>
                <span className="label">고객사</span>
                <span>
                  <Link to={href('/injection_companies')}>사출</Link> · <Link to={href('/extrusion_companies')}>압출</Link> · <Link to={href('/blow_molding_companies')}>블로우</Link>
                </span>
              </li>
              <li>
                <span className="label">안내</span>
                <span>
                  <Link to={href('/about')}>소개</Link> · <Link to={href('/effectiveness')}>제품 효과</Link> · <Link to={href('/contact')}>문의</Link>
                </span>
              </li>
            </ul>
            <p style={{ marginTop: 16 }}>
              ※ 가격은 전화로 문의해 주십시오.
              <En>Please call for pricing.</En>
            </p>
          </div>
        </div>

        <div className="footer-legal">
          <p>Coratex HT® and productivity with marks purging® are registered trademarks of SAINT-GOBAIN Abrasives.</p>
          <p>© 2024 All Rights Reserved by JI PYEONG Corp (지평상사)</p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <>
      <a className="skip-link" href="#main">본문 바로가기</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <a className="floating-call" href={telHref}>📞 전화 문의</a>
    </>
  );
}
