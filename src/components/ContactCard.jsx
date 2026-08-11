import { En, Kr } from './Layout';
import { company, telHref, telHrefLine } from '../data/site';

/** 바로 연락하기 — 문의·발주 페이지가 함께 씁니다.
 *  연락처는 전부 data/site.js 단일 출처에서 옵니다. */
export default function ContactCard() {
  return (
    <div className="card buy-card">
      <h3><Kr>바로 연락하기</Kr> <En>Reach us directly</En></h3>
      <div className="btn-row" style={{ margin: '18px 0' }}>
        <a className="btn btn-primary" href={telHref}>📞 {company.mobile}</a>
        <a className="btn btn-outline" href={`mailto:${company.email}`}>
          ✉ <Kr>이메일 보내기</Kr><En>Send email</En>
        </a>
      </div>
      <dl>
        <dt><Kr>전화</Kr> <En>Tel</En></dt>
        <dd><a href={telHrefLine}>{company.tel}</a></dd>
        <dt><Kr>팩스</Kr> <En>Fax</En></dt>
        <dd>{company.fax}</dd>
        <dt><Kr>휴대전화</Kr> <En>Mobile</En></dt>
        <dd><a href={telHref}>{company.mobile}</a></dd>
        <dt><Kr>이메일</Kr> <En>Email</En></dt>
        <dd><a href={`mailto:${company.email}`}>{company.email}</a></dd>
        <dt><Kr>주소</Kr> <En>Address</En></dt>
        <dd><Kr>{company.addressKo}</Kr><En>{company.addressEn}</En></dd>
      </dl>
    </div>
  );
}

/** 메일 앱이 열리지 않는 환경(모바일 등)을 위한 대체 연락 안내 */
export function MailFallbackHint() {
  return (
    <p className="form-hint">
      <Kr>
        ※ 메일 앱이 열리지 않으면 <a href={telHref}>{company.mobile}</a> 로
        전화 주시거나 <a href={`mailto:${company.email}`}>{company.email}</a> 로
        보내 주십시오.
      </Kr>
      <En>
        ※ If your email app does not open, please call{' '}
        <a href={telHref}>{company.mobile}</a> or email{' '}
        <a href={`mailto:${company.email}`}>{company.email}</a>.
      </En>
    </p>
  );
}
