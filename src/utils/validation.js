/**
 * 문의·발주 폼 입력 검증 — 안내 문구는 모두 한국어/영어 병기.
 *
 * 설계 원칙:
 *  · 입력 자체를 과하게 막지 않습니다. 정상적인 값까지 막으면
 *    (예: "김철수2팀장", 외국인 이름, 사서함 주소) 고객을 놓칩니다.
 *  · 형식이 명확한 값(전화·수량)은 자동으로 정리해 드립니다.
 *  · 명백히 잘못된 값만 막고, 왜 잘못됐는지 구체적으로 알려줍니다.
 */

/* ──────────────────────────────────────────
   입력 중 자동 정리 (사용자가 타이핑하는 동안)
   ────────────────────────────────────────── */

/** 전화번호 — 숫자·+ 만 남기고 자동으로 하이픈을 넣어줍니다.
 *  "01085965562" → "010-8596-5562"
 *  "0229087907"  → "02-2908-7907" 이 아니라 "02-908-7907" 로 올바르게 처리 */
export function formatPhone(input) {
  /* 국제번호(+82…)는 사용자가 직접 관리하도록 숫자와 + 만 유지 */
  if (input.trim().startsWith('+')) {
    return '+' + input.replace(/[^\d]/g, '').slice(0, 15);
  }

  const d = input.replace(/[^\d]/g, '').slice(0, 11);
  if (!d) return '';

  /* 서울 02 — 국번이 3자리(02-908-7907)인 번호와 4자리(02-1234-5678)가
     모두 있으므로, 전체 자릿수로 구분합니다.
     9자리 → 3자리 국번 / 10자리 → 4자리 국번 */
  if (d.startsWith('02')) {
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
    if (d.length <= 9) {
      /* 02 + 3 + 4 = 9자리 */
      return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5, 9)}`;
    }
    /* 02 + 4 + 4 = 10자리 */
    return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}`;
  }

  /* 휴대전화·기타 지역번호 (3자리) */
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

/** 수량 — 숫자만, 앞자리 0 제거, 최대 4자리(9999통) */
export function formatQty(input) {
  const d = input.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');
  return d.slice(0, 4);
}

/* ──────────────────────────────────────────
   제출 시 검증
   ────────────────────────────────────────── */

const RE = {
  /* 한글·영문·공백·점·하이픈만 — 숫자와 특수문자를 막습니다 */
  nameOk: /^[가-힣a-zA-Z][가-힣a-zA-Z\s.\-']*$/,
  /* 한글 자음/모음만 있는 미완성 입력 (ㅁㄴㅇㄹ, ㅏㅏㅏ 등) */
  hangulJamo: /[ㄱ-ㅎㅏ-ㅣ]/,
  /* 같은 문자 4번 이상 반복 (ㅋㅋㅋㅋ, 1111, aaaa) */
  repeated: /(.)\1{3,}/,
  /* 국내 전화번호: 02-XXX(X)-XXXX 또는 0NN-XXX(X)-XXXX */
  phoneKr: /^(0\d{1,2})-(\d{3,4})-(\d{4})$/,
  /* 국제 전화번호 */
  phoneIntl: /^\+\d{8,15}$/,
  /* 주소에 최소한의 숫자(번지)가 있는지 */
  hasNumber: /\d/,
};

/** 성함 / 담당자명 */
export function validateName(v, t) {
  const s = v.trim();
  if (!s) return t('성함을 입력해 주세요.', 'Please enter your name.');
  if (s.length < 2) return t('성함을 2자 이상 입력해 주세요.', 'Name must be at least 2 characters.');
  if (s.length > 30) return t('성함이 너무 깁니다. (30자 이내)', 'Name is too long (max 30 characters).');
  if (RE.hangulJamo.test(s)) {
    return t('성함을 올바르게 입력해 주세요. (예: 홍길동)', 'Please enter a valid name.');
  }
  if (!RE.nameOk.test(s)) {
    return t('성함에는 숫자나 특수문자를 사용할 수 없습니다. (예: 홍길동)',
      'Name cannot contain numbers or special characters.');
  }
  if (RE.repeated.test(s)) {
    return t('성함을 올바르게 입력해 주세요.', 'Please enter a valid name.');
  }
  return null;
}

/** 회사명 — 숫자·특수문자가 들어갈 수 있어 이름보다 느슨하게 검사합니다.
 *  (예: "3M코리아", "㈜지평상사", "A&B산업") */
export function validateCompany(v, t, { required = false } = {}) {
  const s = v.trim();
  if (!s) return required ? t('회사명을 입력해 주세요.', 'Please enter your company name.') : null;
  if (s.length < 2) return t('회사명을 2자 이상 입력해 주세요.', 'Company name must be at least 2 characters.');
  if (s.length > 60) return t('회사명이 너무 깁니다. (60자 이내)', 'Company name is too long (max 60 characters).');
  if (RE.hangulJamo.test(s)) {
    return t('회사명을 올바르게 입력해 주세요. (예: 지평상사)', 'Please enter a valid company name.');
  }
  if (RE.repeated.test(s)) {
    return t('회사명을 올바르게 입력해 주세요.', 'Please enter a valid company name.');
  }
  return null;
}

/** 연락처 */
export function validatePhone(v, t) {
  const s = v.trim();
  if (!s) return t('연락처를 입력해 주세요.', 'Please enter your phone number.');

  if (s.startsWith('+')) {
    if (!RE.phoneIntl.test(s)) {
      return t('국제번호는 + 와 숫자만 입력해 주세요. (예: +821085965562)',
        'For international numbers, use + followed by digits.');
    }
    return null;
  }

  if (!RE.phoneKr.test(s)) {
    return t('연락처를 올바르게 입력해 주세요. (예: 010-8596-5562 또는 02-908-7907)',
      'Please enter a valid phone number (e.g. 010-8596-5562).');
  }
  return null;
}

/** 받는 주소 */
export function validateAddress(v, t) {
  const s = v.trim();
  if (!s) return t('받는 주소를 입력해 주세요.', 'Please enter the delivery address.');
  if (s.length < 8) {
    return t('주소를 자세히 입력해 주세요. (예: 서울특별시 도봉구 마들로 11가길 12)',
      'Please enter a complete address.');
  }
  if (s.length > 120) return t('주소가 너무 깁니다. (120자 이내)', 'Address is too long (max 120 characters).');
  if (RE.hangulJamo.test(s)) {
    return t('주소를 올바르게 입력해 주세요.', 'Please enter a valid address.');
  }
  if (!RE.hasNumber.test(s)) {
    return t('주소에 건물번호나 번지를 함께 입력해 주세요.',
      'Please include the building or street number.');
  }
  if (RE.repeated.test(s)) {
    return t('주소를 올바르게 입력해 주세요.', 'Please enter a valid address.');
  }
  return null;
}

/** 수량(통) */
export function validateQty(v, t) {
  const s = v.trim();
  if (!s) return t('수량을 입력해 주세요.', 'Please enter the quantity.');
  const n = Number(s);
  if (!Number.isInteger(n) || n < 1) {
    return t('수량은 1 이상의 숫자로 입력해 주세요.', 'Quantity must be a whole number of 1 or more.');
  }
  if (n > 999) {
    return t('수량이 많습니다. 999통을 초과하는 발주는 전화로 문의해 주세요.',
      'For orders over 999, please contact us by phone.');
  }
  return null;
}

/** 문의 내용 */
export function validateMessage(v, t, { required = false } = {}) {
  const s = v.trim();
  if (!s) return required ? t('문의 내용을 입력해 주세요.', 'Please enter your message.') : null;
  if (s.length > 1000) {
    return t('문의 내용이 너무 깁니다. (1000자 이내)', 'Message is too long (max 1000 characters).');
  }
  /* "견적요청" 같은 짧고 정상적인 문의를 막지 않도록 4자까지 허용합니다. */
  if (s.length < 4) {
    return t('문의 내용을 4자 이상 입력해 주세요.', 'Message must be at least 4 characters.');
  }
  /* 자음/모음만 나열한 미완성 입력 (ㅁㄴㅇㄹ 등) */
  if (RE.hangulJamo.test(s) && s.replace(/[ㄱ-ㅎㅏ-ㅣ\s]/g, '').length === 0) {
    return t('문의 내용을 올바르게 입력해 주세요.', 'Please enter a valid message.');
  }
  if (RE.repeated.test(s) && s.length < 20) {
    return t('문의 내용을 올바르게 입력해 주세요.', 'Please enter a valid message.');
  }
  return null;
}
