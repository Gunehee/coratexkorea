import { Link } from 'react-router-dom';
import { En } from '../components/Layout';
import { ProcessCard } from './Home';
import { processes, href } from '../data/site';

export default function Use() {
  const list = [processes.injection, processes.extrusion, processes.blow_molding];
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>사용 방법 <En>How to use</En></h2>
            <p>코라텍스의 특성과 간단 사용법입니다. 아래 공정 중 해당하는 항목을 선택해 주십시오.</p>
          </div>
          <div className="grid grid-3">
            {list.map((p) => <ProcessCard key={p.slug} p={p} cta="사용량·절차 보기" />)}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>고객사 <En>Companies</En></h2>
            <p>
              ※ 일부 표기는 고객사 보호를 위해 마스킹되어 있습니다.
              <En>※ Some names are partially masked to protect our customers.</En>
            </p>
          </div>
          <div className="btn-row">
            <Link className="btn btn-navy" to={href('/injection_companies')}>사출 고객사 보기</Link>
            <Link className="btn btn-navy" to={href('/extrusion_companies')}>압출 고객사 보기</Link>
            <Link className="btn btn-navy" to={href('/blow_molding_companies')}>블로우 고객사 보기</Link>
          </div>
        </div>
      </section>
    </>
  );
}
