import { useState } from 'react';
import { En } from '../components/Layout';
import { company, telHref, telHrefLine } from '../data/site';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', company: '', message: '' });
  const [msg, setMsg] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function onSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      setMsg({ ok: false, text: '성함과 연락처를 입력해 주세요.' });
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
      text: `메일 프로그램이 열립니다. 열리지 않으면 ${company.mobile} 으로 전화 주십시오.`,
    });
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>문의 <En>Contact</En></h2>
          <p>
            전화로 문의하시면 가장 빠르게 안내해 드립니다.
            <En>Calling us is the fastest way to get an answer.</En>
          </p>
        </div>

        <div className="grid grid-2">
          <div className="card buy-card">
            <h3>바로 연락하기 <En>Reach us directly</En></h3>
            <div className="btn-row" style={{ margin: '18px 0' }}>
              <a className="btn btn-primary" href={telHref}>📞 {company.mobile}</a>
              <a className="btn btn-outline" href={`mailto:${company.email}`}>✉ 이메일 보내기</a>
            </div>
            <dl>
              <dt>전화 <En>Tel</En></dt>
              <dd><a href={telHrefLine}>{company.tel}</a></dd>
              <dt>팩스 <En>Fax</En></dt>
              <dd>{company.fax}</dd>
              <dt>휴대전화 <En>Mobile</En></dt>
              <dd><a href={telHref}>{company.mobile}</a></dd>
              <dt>이메일 <En>Email</En></dt>
              <dd><a href={`mailto:${company.email}`}>{company.email}</a></dd>
              <dt>주소 <En>Address</En></dt>
              <dd>{company.addressKo}<En>{company.addressEn}</En></dd>
            </dl>
          </div>

          <div className="card buy-card">
            <h3>문의 남기기 <En>Request a call back</En></h3>
            <p className="en" style={{ marginBottom: 18 }}>
              아래 내용을 작성하시면 메일 프로그램이 열립니다.
            </p>

            <form onSubmit={onSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="f-name">성함 <En>Name</En></label>
                <input type="text" id="f-name" value={form.name} onChange={set('name')} autoComplete="name" required />
              </div>
              <div className="form-field">
                <label htmlFor="f-phone">연락처 <En>Phone</En></label>
                <input type="tel" id="f-phone" value={form.phone} onChange={set('phone')} autoComplete="tel" required />
              </div>
              <div className="form-field">
                <label htmlFor="f-company">회사 <En>Company</En></label>
                <input type="text" id="f-company" value={form.company} onChange={set('company')} autoComplete="organization" />
              </div>
              <div className="form-field">
                <label htmlFor="f-message">문의 내용 <En>Message</En></label>
                <textarea id="f-message" value={form.message} onChange={set('message')} />
              </div>
              <button type="submit" className="btn btn-primary">보내기</button>
              {msg && (
                <p className={`form-msg is-visible ${msg.ok ? 'is-ok' : 'is-error'}`} role="status">
                  {msg.text}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
