import { En, Kr } from '../components/Layout';
import { effects, withBase } from '../data/site';

export default function Effectiveness() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="section-eyebrow"><En>EFFECTIVENESS</En></span>
            <h2><Kr>제품 효과</Kr> <En>Product effectiveness</En></h2>
            <p>제품 효과는 아래 4가지로 정리됩니다.<En>Four key effects proven in the field.</En></p>
          </div>
          <div className="grid grid-2">
            {effects.map((e) => (
              <div className="card effect-card" key={e.n}>
                <span className="effect-tag">효과 {e.n} · Effect {e.n}</span>
                <p>{e.ko}</p>
                <En>{e.en}</En>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2><Kr>퍼지 순서 예시</Kr> <En>Purge order (Example)</En></h2>
            <p>
              <Kr>최초 코라텍스 세정 시 노란색에서 흰색으로 변경되는 과정입니다.</Kr>
              <En>The progression from yellow to white during the first Coratex cleaning.</En>
            </p>
          </div>
          <div className="card" style={{ padding: 18 }}>
            <img src={withBase("images/purge-order.jpg")} alt="퍼징 순서 예시 — 최초 발포 상태(노란색)에서 최종 흰색 결과물까지의 단계별 사진" width="1600" height="400" />
          </div>
          <div className="note" style={{ marginTop: 22 }}>
            <p>※ 귀사 조건에 따라 달라집니다.<En>※ Results vary depending on your facility's conditions.</En></p>
          </div>
        </div>
      </section>
    </>
  );
}
