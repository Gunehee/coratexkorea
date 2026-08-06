import { Link } from 'react-router-dom';
import { href } from '../data/site';
import { En } from '../components/Layout';

export default function CompaniesPage({ list }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>{list.ko} <En>{list.en}</En></h2>
          <p>
            ※ 일부 표기는 고객사 보호를 위해 마스킹되어 있습니다.
            <En>※ Some names are partially masked to protect our customers.</En>
          </p>
        </div>

        <ul className="company-list">
          {list.names.map((n) => <li key={n}>{n}</li>)}
        </ul>

        <p className="company-more">{list.plus} · 총 {list.total} 개사</p>

        <div className="btn-row" style={{ marginTop: 26 }}>
          <Link className="btn btn-outline" to={href(list.backTo)}>{list.backLabel} 사용 방법 보기</Link>
          <Link className="btn btn-navy" to={href('/use')}>전체 공정 보기</Link>
        </div>
      </div>
    </section>
  );
}
