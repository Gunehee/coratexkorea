import { Link } from 'react-router-dom';
import { En, Rich } from '../components/Layout';
import DosageTable from '../components/DosageTable';
import { commonSteps, blackSpotNote, principle, href } from '../data/site';

function Step({ n, title, items }) {
  return (
    <div className="step">
      <div className="step-title"><span className="step-num">{n}</span>{title}</div>
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <Rich html={it.ko} />
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
            <h2>{p.title}</h2>
            <p>{p.subtitle} <strong>{p.ratio}</strong></p>
            <p><span className="badge">{p.types}</span></p>
          </div>

          <DosageTable process={p} />

          <div className="note" style={{ marginTop: 22 }}>
            <p><strong>{blackSpotNote.titleKo}</strong></p>
            <p>
              <Rich html={blackSpotNote.bodyKo} />
              <En>{blackSpotNote.bodyEn}</En>
            </p>
          </div>

          <p style={{ marginTop: 22 }}>
            <Link className="btn btn-outline" to={href(`/${p.slug}_companies`)}>
              {p.ko} 고객사 보기
            </Link>
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>사용법 <En>Instructions</En></h2>
            <p>색상 변경 (Color Change) / 원료 교체 (Material Replacement) / 흑점 제거 (Black Spot Removal)</p>
          </div>

          <Step n={1} title="혼합 (Mix)" items={commonSteps.mix} />
          <Step n={2} title="온도 (Temp.)" items={commonSteps.temp} />
          <Step n={3} title="투입 (Input)" items={p.input} />
          <Step n={4} title="체류 및 짜내기 (Waiting & Purging)" items={p.purge} />
          <Step n={5} title="향후 효과 (Future effects)" items={p.effects} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><h2>원리 <En>Principle</En></h2></div>
          <div className="grid grid-2">
            {principle.map((x, i) => (
              <div className="card effect-card" key={i}>
                <p>{x.ko}</p>
                <En>{x.en}</En>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
