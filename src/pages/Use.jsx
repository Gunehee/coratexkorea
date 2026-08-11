import { Link } from 'react-router-dom';
import { En, Kr } from '../components/Layout';
import { ProcessCard } from './Home';
import { processes, href } from '../data/site';
import { useLanguage } from '../i18n/LanguageContext';

export default function Use() {
  const { lang } = useLanguage();
  const t = (ko, en) => (lang === 'en' ? en : ko);
  const list = [processes.injection, processes.extrusion, processes.blow_molding];
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2><Kr>사용 방법</Kr> <En>(HOW TO USE?)</En></h2>
            <p>
              <Kr>코라텍스 특성과 간단 사용법</Kr>
              <En>(Characteristics of Coratex and Simple Usage)</En>
            </p>
            <p><Kr>* 아래 공정 카드를 선택하면 상세 사용방법으로 이동합니다.</Kr><En>* Select a process card below to see detailed instructions.</En></p>
          </div>
          <div className="grid grid-3">
            {list.map((p) => <ProcessCard key={p.slug} p={p} cta={t('사용량·절차 보기', 'View dosage & steps')} />)}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2><Kr>고객사</Kr> <En>Companies</En></h2>
            <p>
              <Kr>※ 일부 표기는 고객사 보호를 위해 일부 마스킹되어 있습니다.</Kr>
              <En>※ Some names are partially masked to protect customers.</En>
            </p>
          </div>
          <div className="btn-row">
            <Link className="btn btn-navy" to={href('/injection_companies')}><Kr>사출 고객사 보기</Kr><En>Injection customers</En></Link>
            <Link className="btn btn-navy" to={href('/extrusion_companies')}><Kr>압출 고객사 보기</Kr><En>Extrusion customers</En></Link>
            <Link className="btn btn-navy" to={href('/blow_molding_companies')}><Kr>블로우 고객사 보기</Kr><En>Blow-molding customers</En></Link>
          </div>
        </div>
      </section>
    </>
  );
}
