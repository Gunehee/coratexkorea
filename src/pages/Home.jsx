import { Link } from 'react-router-dom';
import { En } from '../components/Layout';
import { processes, stats, sisterProducts, company, telHref, withBase, href } from '../data/site';

function ProcessCard({ p, cta }) {
  return (
    <Link className="card process-card" to={href(`/${p.slug}`)}>
      <img src={p.image} alt={p.imageAlt} width="600" height="380" />
      <div className="card-body">
        <h3>{p.ko} <En>{p.en}</En></h3>
        <p className="card-desc">{p.summary}</p>
        <span className="badge">{p.ratio}</span>
        <span className="card-go">{cta} →</span>
      </div>
    </Link>
  );
}

export { ProcessCard };

export default function Home() {
  const list = [processes.injection, processes.extrusion, processes.blow_molding];

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="hero-eyebrow">Welcome to CORATEX</span>
            <h1>코라텍스 CORATEX</h1>
            <p className="hero-tag">사출 · 압출 · 블로우</p>
            <p className="hero-lead">
              시장에서 검증된 No.1 독일 실린더 스크류 코팅 세정제
              <En>Market-proven No.1 German cylinder &amp; screw coating cleaner</En>
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary" to={href('/use')}>사용 방법 보기</Link>
              <a className="btn btn-ghost-light" href={telHref}>전화 문의 {company.mobile}</a>
            </div>
            <p className="hero-note">
              ※ 본 웹사이트 내용은 고객 의견에 맞게 업데이트됩니다.
              <En>※ This website is updated to reflect customer feedback.</En>
            </p>
          </div>
          <div className="hero-media">
            <img src={withBase("images/coratex-bottles.png")} alt="코라텍스(CORATEX) 및 코라텍스 HT 세정제 용기" width="900" height="600" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>사용 방법 <En>How to use</En></h2>
            <p>코라텍스의 특성과 간단 사용법입니다. 공정을 선택하면 상세 사용량과 절차를 볼 수 있습니다.</p>
          </div>
          <div className="grid grid-3">
            {list.map((p) => <ProcessCard key={p.slug} p={p} cta="상세 보기" />)}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="section-head"><h2>국내 고객 <En>Domestic customers</En></h2></div>
          <div className="grid grid-4">
            {stats.map((s) => {
              const inner = (
                <>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.ko}<En>{s.en}</En></div>
                  {s.to && <span className="stat-more">고객사 보기 →</span>}
                </>
              );
              return s.to
                ? <Link className="stat-card" to={href(s.to)} key={s.num}>{inner}</Link>
                : <div className="stat-card" key={s.num}>{inner}</div>;
            })}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>구매 방법 및 문의 <En>How to buy &amp; inquiries</En></h2>
            <p>※ 가격은 문의 요청 드립니다. ( <a href={telHref}><strong>{company.mobile}</strong></a> )</p>
          </div>
          <div className="grid grid-3">
            <div className="card buy-card">
              <h3>계좌 이체 <En>Bank transfer</En></h3>
              <dl>
                <dt>입금 계좌</dt>
                <dd>{company.bankKo}<En>{company.bankEn}</En></dd>
              </dl>
            </div>
            <div className="card buy-card">
              <h3>팩스 주문 <En>Fax order</En></h3>
              <dl>
                <dt>사업자등본 팩스 발송</dt>
                <dd>FAX: <strong>{company.fax}</strong><En>Send your business registration by fax.</En></dd>
              </dl>
            </div>
            <div className="card buy-card">
              <h3>전화 / 이메일 <En>Phone / Email</En></h3>
              <dl>
                <dt>전화 주문</dt>
                <dd><a href={telHref}>{company.mobile}</a><br />사업자등본 사진을 찍어 보내 주십시오.</dd>
                <dt>이메일</dt>
                <dd><a href={`mailto:${company.email}`}>{company.email}</a></dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><h2>자매 제품 <En>Sister products</En></h2></div>
          <div className="grid grid-3">
            {sisterProducts.map((s) => (
              <div className="card product-card" key={s.en}>
                <img src={s.image} alt={s.alt} width="600" height="600" />
                <h3>{s.ko} <En>{s.en}</En></h3>
                <span className="origin">From Germany</span>
                <dl>
                  <dt>용도 <En>Use</En></dt>
                  <dd>{s.useKo}<En>{s.useEn}</En></dd>
                  <dt>분야 <En>Field</En></dt>
                  <dd>{s.fieldKo} <En>{s.fieldEn}</En></dd>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
