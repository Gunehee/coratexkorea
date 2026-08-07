import { En, Kr } from '../components/Layout';
import { aboutFeatures, aboutEconomy, aboutAssumptions, withBase } from '../data/site';

function FeatureList({ items }) {
  return (
    <ul className="feature-list">
      {items.map((f) => (
        <li key={f.ko}><Kr>{f.ko}</Kr><En>{f.en}</En></li>
      ))}
    </ul>
  );
}

export default function About() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="section-eyebrow"><Kr>소개</Kr> <En>ABOUT</En></span>
          <h2><Kr>소개</Kr> <En>Who we are</En></h2>
          <p>
            <Kr>원재료 절약 / 100% 재활용 가능 / 스크류·실린더가 코팅되는 세정제</Kr>
            <En>Raw Material Saving / 100% Recyclable / Coating Cleaner for Screw and Cylinder</En>
          </p>
        </div>

        <div className="note">
          <p>
            <strong>사용할수록 세정 원리를 터득하는 코팅 세정제입니다.</strong>
            <En>-Coating cleaner that helps you grasp the cleaning principles more as you use it-</En>
          </p>
        </div>

        <div className="grid grid-2" style={{ marginTop: 34 }}>
          <div className="card buy-card">
            <h3><Kr>핵심 특징</Kr> <En>Key Features</En></h3>
            <FeatureList items={aboutFeatures} />
          </div>
          <div className="card buy-card">
            <h3><Kr>경제성 · 효율</Kr> <En>Cost Efficiency</En></h3>
            <FeatureList items={aboutEconomy} />
          </div>
        </div>

        <div className="card assumptions" style={{ marginTop: 34, padding: 20 }}>
          <h3>
            {aboutAssumptions.titleKo} <En>{aboutAssumptions.titleEn}</En>
          </h3>
          <p>
            {aboutAssumptions.leadKo}
            <En>{aboutAssumptions.leadEn}</En>
          </p>
          <dl>
            {aboutAssumptions.items.map((it) => (
              <div key={it.labelKo}>
                <dt>
                  {it.labelKo} <En>{it.labelEn}</En>
                </dt>
                <dd>
                  {it.ko}
                  <En>{it.en}</En>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="card" style={{ marginTop: 34, padding: 20 }}>
          <img src={withBase("images/coratex-bottles.png")} alt="코라텍스(CORATEX) 및 코라텍스 HT 세정제 용기" width="2000" height="1332" />
        </div>
      </div>
    </section>
  );
}
