import { privacyPolicy, globalCopy } from '../data/site';
import { En, Kr } from '../components/Layout';

/**
 * 개인정보처리방침 — 원본 privacy-policy.html 의 문구를 그대로 옮겼습니다.
 * ⚠ 법적 고지 문구이므로 임의로 수정하지 마세요.
 */
export default function PrivacyPolicy() {
  const p = privacyPolicy;

  return (
    <article className="page page--doc">
      <div className="container">
        <h1>
          <Kr>{p.titleKo}</Kr> <En>{p.titleEn}</En>
        </h1>

        <p className="lead">
          <Kr>{p.leadKo}</Kr>
          <En>{p.leadEn}</En>
        </p>

        {p.sections.map((s) => (
          <section className="doc-section" key={s.ko}>
            <h2>
              <Kr>{s.ko}</Kr> <En>{s.en}</En>
            </h2>
            <ul className="doc-list">
              {s.itemsKo.map((item, i) => (
                <li key={item}>
                  <Kr>{item}</Kr>
                  <En>{s.itemsEn[i]}</En>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="doc-trademark">
          <Kr>{globalCopy.trademarkKo}</Kr>
          <En>{globalCopy.trademarkEn}</En>
        </p>
      </div>
    </article>
  );
}
