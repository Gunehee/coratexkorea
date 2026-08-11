import { useState, useRef } from 'react';
import { En, Kr } from '../components/Layout';
import ContactCard, { MailFallbackHint } from '../components/ContactCard';
import { useLanguage } from '../i18n/LanguageContext';
import { company, telHref } from '../data/site';

/** 발주 페이지 — 문의와 동일하게 백엔드 없이 mailto: 로 메일 앱을 엽니다.
 *  입력값은 어디에도 저장되지 않습니다. */
export default function Order() {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ company: '', address: '', phone: '', qty: '' });
  const [msg, setMsg] = useState(null);

  const refs = {
    company: useRef(null),
    address: useRef(null),
    phone: useRef(null),
    qty: useRef(null),
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const t = (ko, en) => (lang === 'en' ? en : ko);

  function onSubmit(e) {
    e.preventDefault();

    /* 4개 항목 모두 필수 — 하나라도 비면 첫 번째 빈 칸으로 포커스를 옮깁니다. */
    const order = ['company', 'address', 'phone', 'qty'];
    const empty = order.find((k) => !form[k].trim());
    if (empty) {
      setMsg({
        ok: false,
        text: t('모든 항목을 입력해 주세요.', 'Please fill in every field.'),
      });
      refs[empty].current?.focus();
      return;
    }

    /* 수량은 1 이상의 숫자만 받습니다. */
    const qty = Number(form.qty);
    if (!Number.isFinite(qty) || qty < 1) {
      setMsg({
        ok: false,
        text: t('수량은 1 이상의 숫자로 입력해 주세요.', 'Quantity must be a number of 1 or more.'),
      });
      refs.qty.current?.focus();
      return;
    }

    const subject = `[홈페이지 발주] ${form.company} / 코라텍스 ${qty}통`;
    const body =
      `회사명: ${form.company}\n` +
      `받는 주소: ${form.address}\n` +
      `연락처: ${form.phone}\n` +
      `수량: ${qty}통\n\n` +
      `※ 사업자등록증 사본을 첨부해 주시면 처리가 빠릅니다.\n`;

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
          <h2><Kr>발주</Kr> <En>Order</En></h2>
          <p>
            <Kr>발주 내용을 남겨 주시면 확인 후 연락드립니다.</Kr>
            <En>Leave your order details and we will get back to you.</En>
          </p>
        </div>

        <div className="grid grid-2">
          <ContactCard />

          <div className="card buy-card">
            <h3><Kr>발주하기</Kr> <En>Place an order</En></h3>
            <p style={{ marginBottom: 18 }}>
              <Kr>아래 내용을 작성하시면 메일 프로그램이 열립니다. 서버에 저장되지 않습니다.</Kr>
              <En>Filling this in opens your email app. Nothing is stored on a server.</En>
            </p>
            <MailFallbackHint />

            <form onSubmit={onSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="o-company">
                  <Kr>회사명</Kr> <En>Company</En>
                  <span className="required" aria-hidden="true">*</span>
                </label>
                <input ref={refs.company} type="text" id="o-company" value={form.company}
                  onChange={set('company')} autoComplete="organization" required />
              </div>

              <div className="form-field">
                <label htmlFor="o-address">
                  <Kr>회사(받는) 주소</Kr> <En>Delivery address</En>
                  <span className="required" aria-hidden="true">*</span>
                </label>
                <input ref={refs.address} type="text" id="o-address" value={form.address}
                  onChange={set('address')} autoComplete="street-address" required />
              </div>

              <div className="form-field">
                <label htmlFor="o-phone">
                  <Kr>연락처</Kr> <En>Phone</En>
                  <span className="required" aria-hidden="true">*</span>
                </label>
                <input ref={refs.phone} type="tel" id="o-phone" value={form.phone}
                  onChange={set('phone')} autoComplete="tel" required />
              </div>

              <div className="form-field">
                <label htmlFor="o-qty">
                  <Kr>수량 (통)</Kr> <En>Quantity (containers)</En>
                  <span className="required" aria-hidden="true">*</span>
                </label>
                <input ref={refs.qty} type="number" id="o-qty" value={form.qty}
                  onChange={set('qty')} min="1" step="1" inputMode="numeric" required />
              </div>

              <button type="submit" className="btn btn-primary">
                <Kr>발주 보내기</Kr><En>Send order</En>
              </button>

              <p className={`form-msg ${msg ? 'is-visible' : ''} ${msg?.ok ? 'is-ok' : 'is-error'}`}
                role="status" aria-live="polite">
                {msg?.text}
              </p>
            </form>

            <p className="form-note">
              <Kr>
                ※ 가격은 <a href={telHref}>{company.mobile}</a> 로 문의해 주십시오.
                사업자등록증 사본을 함께 보내주시면 처리가 빠릅니다.
              </Kr>
              <En>
                ※ For pricing, please call <a href={telHref}>{company.mobile}</a>.
                Attaching your business registration certificate speeds things up.
              </En>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
