import { En } from '../components/Layout';
import { aboutFeatures, aboutEconomy, withBase } from '../data/site';

function FeatureList({ items }) {
  return (
    <ul className="feature-list">
      {items.map((f) => (
        <li key={f.ko}>{f.ko}<En>{f.en}</En></li>
      ))}
    </ul>
  );
}

export default function About() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>소개 <En>Who we are</En></h2>
          <p>
            원재료 절약 / 100% 재활용 가능 / 스크류·실린더가 코팅되는 세정제
            <En>Raw material saving / 100% recyclable / coating cleaner for screw and cylinder</En>
          </p>
        </div>

        <div className="note">
          <p>
            <strong>사용할수록 세정 원리를 터득하는 코팅 세정제입니다.</strong>
            <En>A coating cleaner that helps you grasp the cleaning principles the more you use it.</En>
          </p>
        </div>

        <div className="grid grid-2" style={{ marginTop: 34 }}>
          <div className="card buy-card">
            <h3>핵심 특징 <En>Key features</En></h3>
            <FeatureList items={aboutFeatures} />
          </div>
          <div className="card buy-card">
            <h3>경제성 · 효율 <En>Economy &amp; efficiency</En></h3>
            <FeatureList items={aboutEconomy} />
          </div>
        </div>

        <div className="card" style={{ marginTop: 34, padding: 20 }}>
          <img src={withBase("images/coratex-poster.png")} alt="코라텍스 제품 안내 포스터 — EINFACH BESSER REINIGEN" width="1200" height="900" />
        </div>
      </div>
    </section>
  );
}
