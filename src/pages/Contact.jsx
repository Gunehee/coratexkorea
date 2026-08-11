import { useState, useRef } from 'react';
import { En, Kr } from '../components/Layout';
import ContactCard, { MailFallbackHint } from '../components/ContactCard';
import { useLanguage } from '../i18n/LanguageContext';
import { useFormSubmit } from '../hooks/useFormSubmit';
import { hasFormEndpoint } from '../data/formEndpoint';
import {
  formatPhone,
  validateName, validateCompany, validatePhone, validateMessage,
} from '../utils/validation';

/** 문의 페이지 — 백엔드·데이터베이스 없이 전송됩니다.
 *  (자동 전송 연동 시 버튼 한 번, 미연동 시 메일 앱을 통해 전송) */
export default function Contact() {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ name: '', phone: '', company: '', message: '' });
  const [errors, setErrors] = useState({});

  const refs = {
    name: useRef(null),
    phone: useRef(null),
    company: useRef(null),
    message: useRef(null),
  };

  const t = (ko, en) => (lang === 'en' ? en : ko);
  const { submit, msg, setMsg } = useFormSubmit(t);

  /* 전화번호는 입력하는 동안 자동으로 하이픈을 넣어줍니다. */
  const set = (k) => (e) => {
    const raw = e.target.value;
    const value = k === 'phone' ? formatPhone(raw) : raw;
    setForm((f) => ({ ...f, [k]: value }));
    /* 사용자가 고치기 시작하면 해당 칸의 오류 표시를 지웁니다. */
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: null }));
  };

  /* 칸을 벗어날 때 그 칸만 검사해 바로 알려줍니다. */
  const checkOn = (k, fn) => () => {
    const err = fn(form[k], t);
    setErrors((prev) => ({ ...prev, [k]: err }));
  };

  const validators = {
    name: (v) => validateName(v, t),
    phone: (v) => validatePhone(v, t),
    company: (v) => validateCompany(v, t, { required: true }),
    message: (v) => validateMessage(v, t, { required: true }),
  };

  async function onSubmit(e) {
    e.preventDefault();

    const found = {};
    for (const k of ['name', 'phone', 'company', 'message']) {
      const err = validators[k](form[k]);
      if (err) found[k] = err;
    }
    setErrors(found);

    const firstBad = ['name', 'phone', 'company', 'message'].find((k) => found[k]);
    if (firstBad) {
      setMsg({
        ok: false,
        text: t('입력하신 내용을 다시 확인해 주세요.', 'Please check the highlighted fields.'),
      });
      refs[firstBad].current?.focus();
      return;
    }

    const sent = await submit({
      subject: `[홈페이지 문의] ${form.name} / ${form.company}`,
      bodyLines: [
        `성함: ${form.name}`,
        `연락처: ${form.phone}`,
        `회사명: ${form.company}`,
        '',
        '문의 내용:',
        form.message,
      ],
    });

    /* 전송에 성공하면 입력 내용을 비웁니다. */
    if (sent) {
      setForm({ name: '', phone: '', company: '', message: '' });
      setErrors({});
    }
  }

  /* 4개 항목이 모두 채워지고 형식도 맞아야 보내기가 활성화됩니다. */
  const isComplete = ['name', 'phone', 'company', 'message']
    .every((k) => form[k].trim() && !validators[k](form[k]));

  /** 입력칸 + 오류 메시지 묶음 */
  const field = (k, { label, labelEn, type = 'text', required, autoComplete, hint, hintEn, textarea }) => (
    <div className={`form-field ${errors[k] ? 'has-error' : ''}`}>
      <label htmlFor={`f-${k}`}>
        <Kr>{label}</Kr> <En>{labelEn}</En>
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      {hint && (
        <span className="field-hint" id={`f-${k}-hint`}>
          <Kr>{hint}</Kr><En>{hintEn}</En>
        </span>
      )}
      {textarea ? (
        <textarea ref={refs[k]} id={`f-${k}`} value={form[k]}
          onChange={set(k)} onBlur={checkOn(k, validators[k])}
          aria-invalid={errors[k] ? 'true' : undefined}
          aria-describedby={hint ? `f-${k}-hint` : undefined} />
      ) : (
        <input ref={refs[k]} type={type} id={`f-${k}`} value={form[k]}
          onChange={set(k)} onBlur={checkOn(k, validators[k])}
          autoComplete={autoComplete}
          inputMode={k === 'phone' ? 'tel' : undefined}
          aria-invalid={errors[k] ? 'true' : undefined}
          aria-describedby={hint ? `f-${k}-hint` : undefined} />
      )}
      {errors[k] && <span className="field-error" role="alert">{errors[k]}</span>}
    </div>
  );

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
          <ContactCard />

          <div className="card buy-card">
            <h3><Kr>문의 남기기</Kr> <En>Request a call back</En></h3>
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
              {field('name', {
                label: '성함', labelEn: 'Name', required: true, autoComplete: 'name',
                hint: '숫자 없이 이름만 입력해 주세요. (예: 홍길동)',
                hintEn: 'Letters only (e.g. Hong Gil-dong)',
              })}
              {field('phone', {
                label: '연락처', labelEn: 'Phone', type: 'tel', required: true, autoComplete: 'tel',
                hint: '숫자만 입력하시면 하이픈(-)이 자동으로 들어갑니다.',
                hintEn: 'Type digits only — hyphens are added automatically.',
              })}
              {field('company', {
                label: '회사명', labelEn: 'Company', required: true, autoComplete: 'organization',
                hint: '사업자등록증상의 상호를 입력해 주세요.',
                hintEn: 'As shown on your business registration.',
              })}
              {field('message', {
                label: '문의 내용', labelEn: 'Message', required: true, textarea: true,
                hint: '궁금하신 점을 자유롭게 적어 주세요.',
                hintEn: 'Tell us what you need.',
              })}

              <button type="submit" className="btn btn-primary"
                disabled={!isComplete}
                aria-disabled={!isComplete}>
                <Kr>보내기</Kr><En>Send</En>
              </button>
              {!isComplete && (
                <span className="submit-hint">
                  <Kr>4개 항목을 모두 입력하시면 보내기가 활성화됩니다.</Kr>
                  <En>Fill in all four fields to enable sending.</En>
                </span>
              )}
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
