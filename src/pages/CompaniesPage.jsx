import { Link } from 'react-router-dom';
import { href } from '../data/site';
import { En, Kr } from '../components/Layout';

export default function CompaniesPage({ list }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2><Kr>{list.ko}</Kr> <En>{list.en}</En></h2>
          <p>
            <Kr>{list.maskNoteKo}</Kr>
            <En>{list.maskNoteEn}</En>
          </p>
        </div>

        <ul className="company-list">
          {list.names.map((n) => <li key={n}>{n}</li>)}
        </ul>

        <p className="company-more">
          <Kr>{list.plus}</Kr>
          <En>{list.plusEn}</En>
        </p>

        <div className="btn-row" style={{ marginTop: 26 }}>
          <Link className="btn btn-outline" to={href(list.backTo)}>{list.backLabel} 사용 방법 보기</Link>
          <Link className="btn btn-navy" to={href('/use')}>전체 공정 보기</Link>
        </div>
      </div>
    </section>
  );
}
