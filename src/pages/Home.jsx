import { Link } from 'react-router-dom';
import { En, Kr } from '../components/Layout';
import { useLanguage } from '../i18n/LanguageContext';
import VisitCounter from '../components/VisitCounter';
import {
  processes, stats, sisterProducts, company, telHref, withBase, href,
  statsTotalKo, statsTotalEn,
} from '../data/site';

function ProcessCard({ p, cta }) {
  return (
    <Link className="card process-card" to={href(`/${p.slug}`)}>
      <img src={p.image} alt={p.imageAlt} width="600" height="380" />
      <div className="card-body">
        <h3><Kr>{p.ko}</Kr> <En>{p.en}</En></h3>
        <p className="card-desc">
          <Kr>{p.summaryKo}</Kr>
          <En>{p.summaryEn}</En>
        </p>
        <span className="badge">{p.ratio}</span>
        <div className="card-apps">
          <h4>
            <Kr>주요 적용</Kr> <En>(Key Applications)</En>
          </h4>
          <ul>
            {p.applications.map((a) => (
              <li key={a.ko}>
                <Kr>{a.ko}</Kr>
                <En>{a.en}</En>
              </li>
            ))}
          </ul>
        </div>
        <p className="card-hint">
          <Kr>이미지를 누르면 상세 페이지로 이동합니다.</Kr>
          <En>Click to open the detailed guide.</En>
        </p>
        <span className="card-go">{cta} →</span>
      </div>
    </Link>
  );
}

export { ProcessCard };

export default function Home() {
  const { lang } = useLanguage();
  const t = (ko, en) => (lang === 'en' ? en : ko);
  const list = [processes.injection, processes.extrusion, processes.blow_molding];

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-eyebrow">
              <Kr>환영합니다</Kr>
              <En>Welcome to</En>
            </span>
            <h1><Kr>코라텍스 CORATEX</Kr><En>CORATEX</En></h1>
            <p className="hero-tag"><Kr>사출 · 압출 · 블로우</Kr><En>Injection · Extrusion · Blow-Molding</En></p>
            <p className="hero-lead">
              <Kr>시장에서 검증된 No.1 독일 실린더 스크류 코팅 세정제</Kr>
              <En>Market-proven No. 1 German cylinder/screw coating cleaner</En>
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary" to={href('/use')}>
                <Kr>사용 방법 보기</Kr><En>View How to Use</En>
              </Link>
              <a className="btn btn-ghost-light" href={telHref}><Kr>전화 문의</Kr><En>Call</En> {company.mobile}</a>
            </div>
            <p className="hero-note">
              <Kr>※ 본 웹사이트 내용은 고객 의견에 맞게 업데이트됩니다.</Kr>
              <En>※ This website content is updated based on customer feedback</En>
            </p>
          </div>
          <div className="hero-media">
            <img src={withBase("images/coratex-bottles.png")} alt="코라텍스(CORATEX) 및 코라텍스 HT 세정제 용기" width="2000" height="1332" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2><Kr>사용 방법</Kr> <En>How to Use</En></h2>
            <p>
              <Kr>코라텍스 특성과 간단 사용법</Kr>
              <En>Coratex characteristics &amp; simple usage</En>
            </p>
            {/* 원본의 <*이미지를 클릭하세요> 안내를 별도 배지로 분리 —
                본문 설명과 조작 힌트를 시각적으로 구분해 고급스럽게 표현합니다. */}
            <span className="click-hint">
              {/* 아래에 있는 공정 카드를 가리키는 하향 화살표 */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4v13M12 17l-4.5-4.5M12 17l4.5-4.5" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Kr>이미지를 클릭하세요</Kr>
              <En>Click an image</En>
            </span>
          </div>
          <div className="grid grid-3">
            {list.map((p, i) => (
              <div className="reveal" data-delay={i} key={p.slug}>
                <ProcessCard p={p} cta={t('상세 보기', 'View details')} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="section-head">
            <h2><Kr>국내 고객</Kr> <En>Domestic customers</En></h2>
            <p>
              <Kr>{statsTotalKo}</Kr>
              <En>{statsTotalEn}</En>
            </p>
          </div>
          <div className="grid grid-4">
            {stats.map((s, i) => {
              const inner = (
                <>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label"><Kr>{s.ko}</Kr><En>{s.en}</En></div>
                  {s.to && (
                    <span className="stat-more">
                      <Kr>{s.linkKo}</Kr>
                      <En>{s.linkEn}</En> →
                    </span>
                  )}
                </>
              );
              const cls = 'stat-card reveal';
              return s.to
                ? <Link className={cls} data-delay={i} to={href(s.to)} key={s.num}>{inner}</Link>
                : <div className={cls} data-delay={i} key={s.num}>{inner}</div>;
            })}
          </div>

        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2><Kr>구매 방법 및 문의</Kr> <En>How to Buy &amp; Inquiries</En></h2>
            <p>
              <Kr>※ 가격은 문의 요청 드립니다</Kr><En>※ For pricing, please contact us</En> ( <a href={telHref}><strong>{company.mobile}</strong></a> )
            </p>
            <p className="section-note">
              <Kr>웹사이트 내 <Link to={href('/order')}>발주 창</Link>에서 구매 가능합니다 (할인 적용 가능)</Kr>
              <En>You can also order directly through our <Link to={href('/order')}>order page</Link> (discounts may apply)</En>
            </p>
          </div>
          <div className="grid grid-3">
            <div className="reveal">
              <div className="card buy-card">
                <h3><Kr>계좌 이체</Kr> <En>Bank Transfer</En></h3>
                <dl>
                  <dt><Kr>입금 계좌</Kr><En>Account</En></dt>
                  <dd><Kr>{company.bankKo}</Kr><En>Shinhan Bank 110-013-196656 (JI Pyeong Corp., Cho Kyung Bae)</En></dd>
                </dl>
              </div>
            </div>
            <div className="reveal" data-delay="1">
              <div className="card buy-card">
                <h3><Kr>팩스 주문</Kr> <En>Fax Order</En></h3>
                <dl>
                  <dt><Kr>주문 방법</Kr><En>How to order</En></dt>
                  <dd>
                    <Kr>주문서 작성 후 사업자등록증 사본과 함께 팩스 또는 이메일로 보내주세요.</Kr>
                    <En>Fill out the order form and send it with your business registration certificate via fax or email.</En>
                    FAX: <strong>{company.fax}</strong><br />
                    <Kr>이메일:</Kr><En>Email:</En> <a href={`mailto:${company.email}`}>{company.email}</a>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="reveal" data-delay="2">
              <div className="card buy-card">
                <h3><Kr>전화 / 이메일</Kr> <En>Phone / Email</En></h3>
                <dl>
                  <dt><Kr>전화 주문</Kr><En>Phone order</En></dt>
                  <dd>
                    <Kr>전화 주문 (사업자등록증 사본 사진 전송)</Kr>
                    <En>Order by phone (send a photo of your business registration certificate)</En>
                    <Kr>전화번호:</Kr><En>Phone:</En> <a href={telHref}>{company.mobile}</a><br />
                    <Kr>이메일:</Kr><En>Email:</En> <a href={`mailto:${company.email}`}>{company.email}</a>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><h2><Kr>자매 제품</Kr> <En>Sister Products</En></h2></div>
          <div className="grid grid-3">
            {sisterProducts.map((s, i) => (
              <div className="reveal" data-delay={i} key={s.en}>
                <div className="card product-card">
                  <img src={s.image} alt={s.alt} width="600" height="600" />
                  <h3><Kr>브랜드: {s.ko}</Kr> <En>Brand: {s.en}</En></h3>
                  <span className="origin"><Kr>독일산</Kr> <En>From Germany</En></span>
                  <dl>
                    <dt><Kr>용도:</Kr> <En>Use:</En></dt>
                    <dd><Kr>{s.useKo}</Kr><En>{s.useEn}</En></dd>
                    <dt><Kr>분야:</Kr> <En>Field:</En></dt>
                    <dd><Kr>{s.fieldKo}</Kr><En>{s.fieldEn}</En></dd>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 방문 현황 — 제품 정보를 다 본 뒤 마지막에 조용히 전합니다.
          "4000+ 고객사" 옆에 두면 방문자 수가 적을 때 대비되어
          오히려 초라해 보이므로 문장형으로 하단에 배치했습니다. */}
      <section className="section visit-section">
        <div className="container">
          <VisitCounter />
        </div>
      </section>
    </>
  );
}
