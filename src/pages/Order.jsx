import { useState, useRef } from 'react';
import { En, Kr } from '../components/Layout';
import ContactCard, { MailFallbackHint } from '../components/ContactCard';
import { useLanguage } from '../i18n/LanguageContext';
import { useFormSubmit } from '../hooks/useFormSubmit';
import FileAttach, { ATTACH_SLOTS } from '../components/FileAttach';
import { company, telHref } from '../data/site';
import { hasFormEndpoint } from '../data/formEndpoint';
import {
  formatPhone, formatQty,
  validateCompany, validateAddress, validatePhone, validateQty,
} from '../utils/validation';

/** 발주 페이지 — 백엔드·데이터베이스 없이 전송됩니다.
 *  (자동 전송 연동 시 버튼 한 번, 미연동 시 메일 앱을 통해 전송) */
export default function Order() {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ company: '', address: '', phone: '', qty: '' });
  const [errors, setErrors] = useState({});
  /* 첨부 사진 — { license?: {...}, card?: {...} } */
  const [attachFiles, setAttachFiles] = useState({});

  const refs = {
    company: useRef(null),
    address: useRef(null),
    phone: useRef(null),
    qty: useRef(null),
  };

  const t = (ko, en) => (lang === 'en' ? en : ko);
  const { submit, msg, setMsg } = useFormSubmit(t);

  /* 전화·수량은 입력하는 동안 자동으로 정리됩니다. */
  const set = (k) => (e) => {
    const raw = e.target.value;
    const value =
      k === 'phone' ? formatPhone(raw) :
      k === 'qty' ? formatQty(raw) : raw;
    setForm((f) => ({ ...f, [k]: value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: null }));
  };

  const checkOn = (k, fn) => () => {
    setErrors((prev) => ({ ...prev, [k]: fn(form[k], t) }));
  };

  const validators = {
    company: (v) => validateCompany(v, t, { required: true }),
    address: (v) => validateAddress(v, t),
    phone: (v) => validatePhone(v, t),
    qty: (v) => validateQty(v, t),
  };

  const order = ['company', 'address', 'phone', 'qty'];

  async function onSubmit(e) {
    e.preventDefault();

    const found = {};
    for (const k of order) {
      const err = validators[k](form[k]);
      if (err) found[k] = err;
    }
    setErrors(found);

    const firstBad = order.find((k) => found[k]);
    if (firstBad) {
      setMsg({
        ok: false,
        text: t('입력하신 내용을 다시 확인해 주세요.', 'Please check the highlighted fields.'),
      });
      refs[firstBad].current?.focus();
      return;
    }

    const qty = Number(form.qty);
    /* 첨부는 슬롯 순서(사업자등록증 → 명함)대로 보냅니다. */
    const attachments = ATTACH_SLOTS
      .map(({ key, ko }) => {
        const f = attachFiles[key];
        if (!f) return null;
        /* 받는 분이 무엇인지 바로 알 수 있게 파일명을 바꿔 둡니다. */
        const ext = f.filename.split('.').pop() || 'jpg';
        return { ...f, filename: `${ko}.${ext}` };
      })
      .filter(Boolean);

    const attachedLine = `첨부: ${attachments.map((a) => a.filename).join(', ')}`;

    const sent = await submit({
      subject: `[홈페이지 발주] ${form.company} / 코라텍스 ${qty}통`,
      bodyLines: [
        `회사명: ${form.company}`,
        `받는 주소: ${form.address}`,
        `연락처: ${form.phone}`,
        `수량: ${qty}통`,
        '',
        attachedLine,
      ],
      attachments,
    });

    /* 전송에 성공하면 입력 내용을 비웁니다. */
    if (sent) {
      setForm({ company: '', address: '', phone: '', qty: '' });
      setErrors({});
      setAttachFiles({});
    }
  }

  /* 4개 항목이 모두 채워지고 형식도 맞아야, 그리고 사진 2장이 모두
     첨부되어야 보내기가 활성화됩니다. */
  const attachComplete = ATTACH_SLOTS.every(({ key }) => attachFiles[key]);
  const isComplete = order.every((k) => form[k].trim() && !validators[k](form[k])) && attachComplete;

  const field = (k, { label, labelEn, type = 'text', autoComplete, hint, hintEn, extra }) => (
    <div className={`form-field ${errors[k] ? 'has-error' : ''}`}>
      <label htmlFor={`o-${k}`}>
        <Kr>{label}</Kr> <En>{labelEn}</En>
        <span className="required" aria-hidden="true">*</span>
      </label>
      {hint && (
        <span className="field-hint" id={`o-${k}-hint`}>
          <Kr>{hint}</Kr><En>{hintEn}</En>
        </span>
      )}
      <input ref={refs[k]} type={type} id={`o-${k}`} value={form[k]}
        onChange={set(k)} onBlur={checkOn(k, validators[k])}
        autoComplete={autoComplete}
        inputMode={k === 'phone' ? 'tel' : k === 'qty' ? 'numeric' : undefined}
        aria-invalid={errors[k] ? 'true' : undefined}
        aria-describedby={hint ? `o-${k}-hint` : undefined}
        {...extra} />
      {errors[k] && <span className="field-error" role="alert">{errors[k]}</span>}
    </div>
  );

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
          <div className="card buy-card">
            <h3><Kr>발주하기</Kr> <En>Place an order</En></h3>
            <p style={{ marginBottom: 18 }}>
              {hasFormEndpoint ? (
                <>
                  <Kr>보내기를 누르면 바로 접수됩니다. 서버에 저장되지 않습니다.</Kr>
                  <En>Submitting sends it right away. Nothing is stored on a server.</En>
                </>
              ) : (
                <>
                  <Kr>아래 내용을 작성하시면 메일 프로그램이 열립니다. 서버에 저장되지 않습니다.</Kr>
                  <En>Filling this in opens your email app. Nothing is stored on a server.</En>
                </>
              )}
            </p>
            {!hasFormEndpoint && <MailFallbackHint />}

            <form onSubmit={onSubmit} noValidate>
              {field('company', {
                label: '회사명', labelEn: 'Company', autoComplete: 'organization',
                hint: '사업자등록증상의 상호를 입력해 주세요.',
                hintEn: 'As shown on your business registration.',
              })}
              {field('address', {
                label: '회사(받는) 주소', labelEn: 'Delivery address', autoComplete: 'street-address',
                hint: '건물번호까지 정확히 입력해 주세요. (예: 서울특별시 도봉구 마들로 11가길 12)',
                hintEn: 'Include the building number.',
              })}
              {field('phone', {
                label: '연락처', labelEn: 'Phone', type: 'tel', autoComplete: 'tel',
                hint: '숫자만 입력하시면 하이픈(-)이 자동으로 들어갑니다.',
                hintEn: 'Type digits only — hyphens are added automatically.',
              })}
              {field('qty', {
                label: '수량(통)', labelEn: 'Quantity (containers)',
                hint: '숫자만 입력해 주세요. (1~999통)',
                hintEn: 'Numbers only (1–999).',
              })}

              <FileAttach files={attachFiles} onChange={setAttachFiles} t={t} />

              <button type="submit" className="btn btn-primary"
                disabled={!isComplete}
                aria-disabled={!isComplete}>
                <Kr>발주 보내기</Kr><En>Send order</En>
              </button>
              {!isComplete && (
                <span className="submit-hint">
                  <Kr>4개 항목과 사업자등록증·명함 사진을 모두 입력하시면 보내기가 활성화됩니다.</Kr>
                  <En>Fill in all four fields and attach both photos to enable sending.</En>
                </span>
              )}

              <p className={`form-msg ${msg ? 'is-visible' : ''} ${msg?.ok ? 'is-ok' : 'is-error'}`}
                role="status" aria-live="polite">
                {msg?.text}
              </p>
            </form>

            <p className="form-note">
              <Kr>
                ※ 가격은 <a href={telHref}>{company.mobile}</a> 로 문의해 주십시오.
              </Kr>
              <En>
                ※ For pricing, please call <a href={telHref}>{company.mobile}</a>.
              </En>
            </p>
          </div>

          <ContactCard />
        </div>
      </div>
    </section>
  );
}
