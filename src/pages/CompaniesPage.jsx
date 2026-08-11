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

        {/* 고객사 상호는 한국 기업의 고유명사이므로 번역하지 않고 원문을 유지합니다.
            영문 사용자를 위해 아래에 안내만 덧붙입니다. */}
        <ul className="company-list" lang="ko">
          {list.names.map((n) => <li key={n}>{n}</li>)}
        </ul>
        <p className="company-note">
          <En>※ Customer names are shown in Korean as registered.</En>
        </p>

        <p className="company-more">
          <Kr>{list.plus}</Kr>
          <En>{list.plusEn}</En>
        </p>

        <div className="btn-row" style={{ marginTop: 26 }}>
          <Link className="btn btn-outline" to={href(list.backTo)}>
            <Kr>{list.backLabel} 사용 방법 보기</Kr><En>{list.en} — how to use</En>
          </Link>
          <Link className="btn btn-navy" to={href('/use')}><Kr>전체 공정 보기</Kr><En>All processes</En></Link>
        </div>
      </div>
    </section>
  );
}
