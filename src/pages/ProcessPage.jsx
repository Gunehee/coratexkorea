import { Link } from 'react-router-dom';
import { En, Kr, Rich } from '../components/Layout';
import DosageTable from '../components/DosageTable';
import { commonSteps, blackSpotNote, principle, href } from '../data/site';

function Step({ n, ko, en, items }) {
  return (
    <div className="step">
      <div className="step-title">
        <span className="step-num">{n}</span>
        <Kr>{ko}</Kr><En>{en}</En>
      </div>
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <Kr><Rich html={it.ko} /></Kr>
            <En>{it.en}</En>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProcessPage({ process }) {
  const p = process;
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2><Kr>{p.title}</Kr><En>{p.en}</En></h2>
            <p><Kr>{p.subtitleKo}</Kr><En>{p.subtitleEn}</En> <strong>{p.ratio}</strong></p>
            <p><span className="badge"><Kr>{p.typesKo}</Kr><En>{p.typesEn}</En></span></p>
          </div>

          <DosageTable process={p} />

          <div className="note" style={{ marginTop: 22 }}>
            <p><strong><Kr>{blackSpotNote.titleKo}</Kr><En>{blackSpotNote.titleEn}</En></strong></p>
            <p>
              <Kr><Rich html={blackSpotNote.bodyKo} /></Kr>
              <En>{blackSpotNote.bodyEn}</En>
            </p>
          </div>

          <p style={{ marginTop: 22 }}>
            <Link className="btn btn-outline" to={href(`/${p.slug}_companies`)}>
              <Kr>{p.ko} 고객사 보기</Kr><En>{p.en} customers</En>
            </Link>
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2><Kr>사용법</Kr> <En>Instructions</En></h2>
            <p><Kr>색상 변경 / 원료 교체 / 흑점 제거</Kr><En>Color Change / Material Replacement / Black Spot Removal</En></p>
          </div>

          <Step n={1} ko="혼합" en="Mix" items={commonSteps.mix} />
          <Step n={2} ko="온도" en="Temperature" items={commonSteps.temp} />
          <Step n={3} ko="투입" en="Input" items={p.input} />
          <Step n={4} ko="체류 및 짜내기" en="Waiting &amp; Purging" items={p.purge} />
          <Step n={5} ko="향후 효과" en="Future effects" items={p.effects} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><h2><Kr>원리</Kr> <En>Principle</En></h2></div>
          <div className="grid grid-2">
            {principle.map((x, i) => (
              <div className="card effect-card" key={i}>
                <p><Kr>{x.ko}</Kr><En>{x.en}</En></p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
