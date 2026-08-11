import { useState, useRef } from 'react';
import { En, Kr } from '../components/Layout';
import { useLanguage } from '../i18n/LanguageContext';
import { company, telHref, telHrefLine } from '../data/site';

/** 문의 페이지 — 백엔드가 없으므로 mailto: 로 사용자의 메일 앱을 엽니다.
 *  입력값은 어디에도 저장되지 않습니다. */
export default function Contact() {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ name: '', phone: '', company: '', message: '' });
  const [msg, setMsg] = useState(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const t = (ko, en) => (lang === 'en' ? en : ko);

  function onSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setMsg({
        ok: false,
        text: t('성함과 연락처를 입력해 주세요.', 'Please enter your name and phone number.'),
      });
      /* 오류 시 첫 번째 빈 칸으로 포커스를 옮깁니다. */
      (!form.name.trim() ? nameRef : phoneRef).current?.focus();
      return;
    }

    const subject = `[홈페이지 문의] ${form.name}${form.company ? ` / ${form.company}` : ''}`;
    const body =
      `성함: ${form.name}\n` +
      `연락처: ${form.phone}\n` +
      `회사: ${form.company || '-'}\n\n` +
      `문의 내용:\n${form.message || '-'}\n`;

    window.location.href =
      `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setMsg({
      ok: true,
      text: t(
        `메일 프로그램이 열립니다. 열리지 않으면 ${company.mobile} 으로 전화 주십시오.`,
        `Your email app should open. If it does not, please call ${company.mobile}.`
      ),
    });
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2><Kr>문의</Kr> <En>Contact</En></h2>
          <p>
            <Kr>전화로 문의하시면 가장 빠르게 안내해 드립니다.</Kr>
            <En>Calling us is the fastest way to get an answer.</En>
          </p>
        </div>

        <div className="grid grid-2">
          <div className="card buy-card">
            <h3><Kr>바로 연락하기</Kr> <En>Reach us directly</En></h3>
            <div className="btn-row" style={{ margin: '18px 0' }}>
              <a className="btn btn-primary" href={telHref}>📞 {company.mobile}</a>
              <a className="btn btn-outline" href={`mailto:${company.email}`}>✉ <Kr>이메일 보내기</Kr><En>Send email</En></a>
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

          <div className="card buy-card">
            <h3><Kr>문의 남기기</Kr> <En>Request a call back</En></h3>
            <p style={{ marginBottom: 18 }}>
              <Kr>아래 내용을 작성하시면 메일 프로그램이 열립니다. 서버에 저장되지 않습니다.</Kr>
              <En>
                Filling this in opens your email app. Nothing is stored on a server.
              </En>
            </p>
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

            <form onSubmit={onSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="f-name">
                  <Kr>성함</Kr> <En>Name</En>
                  <span className="required" aria-hidden="true">*</span>
                </label>
                <input ref={nameRef} type="text" id="f-name" value={form.name}
                  onChange={set('name')} autoComplete="name" required />
              </div>
              <div className="form-field">
                <label htmlFor="f-phone">
                  <Kr>연락처</Kr> <En>Phone</En>
                  <span className="required" aria-hidden="true">*</span>
                </label>
                <input ref={phoneRef} type="tel" id="f-phone" value={form.phone}
                  onChange={set('phone')} autoComplete="tel" required />
              </div>
              <div className="form-field">
                <label htmlFor="f-company"><Kr>회사</Kr> <En>Company</En></label>
                <input type="text" id="f-company" value={form.company} onChange={set('company')} autoComplete="organization" />
              </div>
              <div className="form-field">
                <label htmlFor="f-message"><Kr>문의 내용</Kr> <En>Message</En></label>
                <textarea id="f-message" value={form.message} onChange={set('message')} />
              </div>
              <button type="submit" className="btn btn-primary"><Kr>보내기</Kr><En>Send</En></button>
              <p className={`form-msg ${msg ? 'is-visible' : ''} ${msg?.ok ? 'is-ok' : 'is-error'}`}
                role="status" aria-live="polite">
                {msg?.text}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
