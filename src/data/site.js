/* ==========================================================
   CORATEX — 사이트 전체 데이터 (단일 출처 / Single Source of Truth)

   ✅ React 전환의 핵심 이점:
   기존 정적 사이트에서는 사용량 수치가 coratex.js 의 DATA 와
   각 HTML 의 <table> 두 곳에 중복 존재해서 항상 함께 고쳐야 했습니다.

   이제는 이 파일의 dosage 만 고치면 표가 자동으로 다시 그려집니다.
   중복이 없으므로 불일치가 발생할 수 없습니다.
   ========================================================== */

import { BASENAME } from '../base';

/** 이미지 등 정적 파일 경로에 GitHub Pages 서브경로를 붙입니다.
 *  상대경로(images/…)를 쓰면 /injection 처럼 슬래시 없는 URL 에서 깨지므로
 *  항상 절대경로로 만듭니다. */
export const withBase = (p) => `${BASENAME}/${p.replace(/^\//, '')}`;

/** 라우트 경로 → 실제 정적 파일 경로.
 *  GitHub Pages 에는 확장자 없는 /about 파일이 없으므로 /about.html 로 연결해야
 *  JS 가 꺼져 있어도, 새 탭으로 열어도 정상 동작합니다. */
export const href = (path) => (path === '/' ? '/index.html' : `${path}.html`);

export const company = {
  nameKo: '지평상사',
  nameEn: 'JI PYEONG Corp',
  tel: '02-908-7907',
  fax: '02-908-7909',
  mobile: '010-8596-5562',
  email: '0822gblessy@naver.com',
  addressKo: '서울특별시 도봉구 마들로 11가길 12 다모아빌딩 4층',
  addressEn: '12, Madeul-ro 11ga-gil, Dobong-gu, Seoul (Damoa Building, 4F)',
  bankKo: '신한은행 110-013-196656 (지평상사 조경배)',
  bankEn: 'Shinhan Bank 110-013-196656 (JI Pyeong Corp. Cho Kyung Bae)',
};

export const telHref = `tel:+8210${company.mobile.replace('010-', '').replace(/-/g, '')}`;
export const telHrefLine = `tel:+822${company.tel.replace('02-', '').replace(/-/g, '')}`;

export const nav = [
  { path: '/',               ko: '홈',        en: 'Home' },
  { path: '/about',          ko: '소개',      en: 'About' },
  { path: '/use',            ko: '사용 방법', en: 'How to use' },
  { path: '/effectiveness',  ko: '제품 효과', en: 'Effectiveness' },
  { path: '/order',          ko: '발주',      en: 'Order' },
  { path: '/contact',        ko: '문의',      en: 'Contact' },
];

/* ----------------------------------------------------------
   공정별 사용량 — 표는 이 데이터로부터 렌더링됩니다.
   ---------------------------------------------------------- */
export const processes = {
  injection: {
    slug: 'injection',
    ko: '사출',
    en: 'Injection',
    title: '사출 (Injection)',
    image: withBase('images/injection.svg'),
    imageAlt: '사출 공정 아이콘',
    summary: '원료 변경 / 색상 교체 / 흑점 관리',
    summaryKo: '원료변경 / 색상교체 / 흑점관리 (2%)',
    summaryEn: 'Material change / Color change / Black speck control (2%)',
    applications: [
      { ko: '원료 변경', en: 'Material change' },
      { ko: '색상 교체', en: 'Color change' },
      { ko: '흑점 관리', en: 'Black speck control' },
    ],
    subtitle:
      '원료 변경 (Material Change) / 색상 교체 (Color Change) / 흑점 관리 (Black Spot Management) — 실린더·스크류',
    subtitleKo: '원료 변경 / 색상 교체 / 흑점 관리 — 실린더·스크류',
    subtitleEn: 'Material change / Color change / Black spot management — cylinder & screw',
    types: '일반 사출 (General Injection) / 이중 사출 (Double Injection) / 다이렉트 사출 (Direct Injection)',
    typesKo: '일반 사출 / 이중 사출 / 다이렉트 사출',
    typesEn: 'General / Double / Direct injection',
    ratio: '2%',
    unit: 'Ton',
    unitEn: 'Tonnage',
    columns: [
      { ko: '150 톤 미만', en: 'Less than 150 tons' },
      { ko: '170 - 250톤', en: '170–250 tons' },
      { ko: '270 - 850톤', en: '270–850 tons' },
      { ko: '1000 - 1300톤', en: '1000–1300 tons' },
    ],
    rows: [
      {
        key: 'material',
        ko: '원료 양',
        en: 'Material amount',
        cells: ['원료 1kg', '원료 2kg', '원료 5kg', '원료 10kg'],
        cellsEn: ['Material 1 kg', 'Material 2 kg', 'Material 5 kg', 'Material 10 kg'],
      },
      {
        key: 'coratex',
        ko: '코라텍스 양',
        en: 'Coratex amount',
        emphasis: true,
        cells: [
          { strong: '15-20g', rest: ' / 1/2 뚜껑' },
          { strong: '30-40g', rest: ' / 1 뚜껑' },
          { strong: '80-100g', rest: ' / 2 뚜껑' },
          { strong: '150-200g', rest: ' / 5 뚜껑' },
        ],
        cellsEn: ['15–20 g / 1⁄2 cap', '30–40 g / 1 cap', '80–100 g / 2 caps', '150–200 g / 5 caps'],
      },
      {
        key: 'maxUsage',
        ko: '최대 사용 횟수',
        en: 'Maximum usage',
        cells: ['100 - 120 회', '30 - 50 회', '12 - 17 회', '6 - 12 회'],
        cellsEn: ['100–120 times', '30–50 times', '12–17 times', '6–12 times'],
      },
    ],
    input: [
      {
        ko: '건조한 신재·분쇄품과 혼합한 퍼징 원료를 투입합니다.',
        en: 'Feed the purging material mixed with dry raw material or granules.',
      },
    ],
    purge: [
      {
        ko: '★★ 코라텍스를 혼합한 퍼징 원료로 <b>2회 퍼징</b>한 후, 3회째에는 계량을 한 상태로 약 <b>5분</b> 체류합니다. ★★',
        en: 'After purging twice with mixed Coratex material, let it stand about 5 minutes with measured material on the third purge.',
      },
      {
        ko: '그리고 다시 1회 퍼징한 후, 계량한 상태로 <b>5분간</b> 더 체류합니다.',
        en: 'Then purge once more and let it stand another 5 minutes with measured material.',
      },
      {
        ko: '체류가 끝나면 건조한 신재로 <b>3~5회</b> 퍼징한 뒤, 온도를 원료 작업 온도로 내리고 생산 작업을 시작합니다.',
        en: 'Once dwelling is complete, purge 3 to 5 times with dry raw material, lower the temperature, and start production.',
      },
    ],
    effects: [
      {
        ko: '6개월 후 핫러너 / 체크링 / 노즐 / 헤드가 달라집니다.',
        en: 'The hot runner, check ring, nozzle and head will be noticeably different after 6 months.',
      },
      {
        ko: '냉각 스케일도 코라텍스로 청소하기 좋습니다.',
        en: 'Coratex is also effective for cleaning cooling scale.',
      },
    ],
  },

  extrusion: {
    slug: 'extrusion',
    ko: '압출',
    en: 'Extrusion',
    title: '압출 (Extrusion)',
    image: withBase('images/extrusion.svg'),
    imageAlt: '압출 공정 아이콘',
    summary: 'T-DIES / 이형 압출 / 재생 압출',
    summaryKo: 'T-DIES / 이형 압출 / 재생 압출 (2%)',
    summaryEn: 'T-DIES / Profile extrusion / Recycled extrusion (2%)',
    applications: [
      { ko: 'T-DIES', en: 'T-DIES' },
      { ko: '이형 압출', en: 'Profile extrusion' },
      { ko: '재생 압출', en: 'Recycled extrusion' },
    ],
    subtitle:
      '원료 변경 (Material Change) / 색상 교체 (Color Change) / 흑점 관리 (Black Spot Management) — 실린더·스크류',
    subtitleKo: '원료 변경 / 색상 교체 / 흑점 관리 — 실린더·스크류',
    subtitleEn: 'Material change / Color change / Black spot management — cylinder & screw',
    types:
      'T-DIES / 브론 다이스 (Bron Dies) / 이형 압출 (Heterogeneous Extrusion) / 원료 및 재생 압출 (Raw Material and Recycled Extrusion)',
    typesKo: 'T-DIES / 브론 다이스 / 이형 압출 / 원료 및 재생 압출',
    typesEn: 'T-DIES / Bron dies / Profile extrusion / Raw & recycled extrusion',
    ratio: '2%',
    unit: '토출량 (Output) / HR',
    unitEn: 'Output / hr',
    columns: [
      { ko: '100 KG 미만', en: 'Less than 100 KG' },
      { ko: '300 KG 내외', en: 'Around 300 KG' },
      { ko: '500 KG 내외', en: 'Around 500 KG' },
      { ko: '1000 KG 내외', en: 'Around 1000 KG' },
    ],
    rows: [
      {
        key: 'material',
        ko: '세정 원료 양',
        en: 'Cleaning material amount',
        cells: ['원료 50 kg', '원료 150 kg', '원료 250 kg', '원료 500 kg'],
        cellsEn: ['Material 50 kg', 'Material 150 kg', 'Material 250 kg', 'Material 500 kg'],
      },
      {
        key: 'coratex',
        ko: '코라텍스 양',
        en: 'Coratex amount',
        emphasis: true,
        cells: [
          { strong: '1 통', rest: '' },
          { strong: '3 통', rest: '' },
          { strong: '5 통', rest: '' },
          { strong: '10 통', rest: '' },
        ],
        cellsEn: ['1 container', '3 containers', '5 containers', '10 containers'],
      },
    ],
    input: [
      {
        ko: '✳ 메시(망)를 꼭 제거하고 / 호퍼에 바로 투입하며 / 호퍼를 꼭 닦습니다. ✳',
        en: 'Remove the mesh screen, feed directly into the hopper, and clean the hopper thoroughly.',
      },
    ],
    purge: [
      {
        ko: '★★ 코라텍스를 혼합한 퍼징 원료로 <b>2회 저속 퍼징</b>한 후, 3회째에는 약 <b>15분</b> 체류합니다. ★★',
        en: 'After purging twice at low speed with mixed Coratex material, let it stand about 15 minutes on the third purge.',
      },
      {
        ko: '그리고 다시 1회 저속 퍼징한 후, <b>15분간</b> 더 체류합니다.',
        en: 'Then purge once more at low speed and let it stand another 15 minutes.',
      },
      {
        ko: '체류가 끝나면 건조한 신재로 <b>2~4회</b> 저속 퍼징한 뒤, 온도를 원료 작업 온도로 내리고 생산 작업을 시작합니다.',
        en: 'Once dwelling is complete, purge 2 to 4 times at low speed with dry raw material, lower the temperature, and start production.',
      },
    ],
    effects: [
      {
        ko: '6개월 후 다이스가 달라집니다. / 폴리싱롤 냉각 스케일도 제거됩니다.',
        en: 'Dies will be noticeably different after 6 months; polishing roll cooling scale is also removed.',
      },
    ],
  },

  blow_molding: {
    slug: 'blow_molding',
    ko: '블로우',
    en: 'Blow-Molding',
    title: '블로우 (Blow-Molding)',
    image: withBase('images/blow_molding.svg'),
    imageAlt: '블로우 성형 공정 아이콘',
    summary: '탄산칼슘 제거 / 색상 교체 / 흑점 관리',
    summaryKo: '탄산칼슘 제거 / 색상교체 / 흑점관리 (2%)',
    summaryEn: 'Calcium carbonate removal / Color change / Black speck control (2%)',
    applications: [
      { ko: '탄산칼슘 제거', en: 'Calcium carbonate removal' },
      { ko: '색상 교체', en: 'Color change' },
      { ko: '흑점 관리', en: 'Black speck control' },
    ],
    subtitle:
      '원료 변경 (Material Change) / 색상 교체 (Color Change) / 흑점 관리 (Black Spot Management) — 실린더·스크류',
    subtitleKo: '원료 변경 / 색상 교체 / 흑점 관리 — 실린더·스크류',
    subtitleEn: 'Material change / Color change / Black spot management — cylinder & screw',
    types: '탄산칼슘 제거 (Calcium Carbonate Removal)',
    typesKo: '탄산칼슘 제거',
    typesEn: 'Calcium carbonate removal',
    ratio: '2%',
    unit: '토출량 (Output) / HR',
    unitEn: 'Output / hr',
    columns: [
      { ko: '30 KG 미만', en: 'Less than 30 KG' },
      { ko: '50 KG 내외', en: 'Around 50 KG' },
      { ko: '100 KG 내외', en: 'Around 100 KG' },
      { ko: '200 KG 내외', en: 'Around 200 KG' },
    ],
    rows: [
      {
        key: 'material',
        ko: '세정 원료 양',
        en: 'Cleaning material amount',
        cells: ['원료 10 kg', '원료 25 kg', '원료 50 kg', '원료 100 kg'],
        cellsEn: ['Material 10 kg', 'Material 25 kg', 'Material 50 kg', 'Material 100 kg'],
      },
      {
        key: 'coratex',
        ko: '코라텍스 양',
        en: 'Coratex amount',
        emphasis: true,
        cells: [
          { strong: '200 g', rest: ' / 5 뚜껑' },
          { strong: '500 g', rest: ' / 10 뚜껑' },
          { strong: '1 통', rest: '' },
          { strong: '2 통', rest: '' },
        ],
        cellsEn: ['200 g / 5 caps', '500 g / 10 caps', '1 container', '2 containers'],
      },
    ],
    input: [
      {
        ko: '건조한 신재·분쇄품과 혼합한 퍼징 원료를 투입합니다.',
        en: 'Feed the purging material mixed with dry raw material or granules.',
      },
    ],
    purge: [
      {
        ko: '★★ 코라텍스를 혼합한 퍼징 원료로 <b>2회 퍼징</b>한 후, 3회째에는 약 <b>10분</b> 체류합니다. ★★',
        en: 'After purging twice with mixed Coratex material, let it stand about 10 minutes on the third purge.',
      },
      {
        ko: '그리고 다시 1회 퍼징한 후, <b>10분간</b> 더 체류합니다.',
        en: 'Then purge once more and let it stand another 10 minutes.',
      },
      {
        ko: '체류가 끝나면 건조한 신재로 <b>2~4회</b> 퍼징한 뒤, 온도를 원료 작업 온도로 내리고 생산 작업을 시작합니다.',
        en: 'Once dwelling is complete, purge 2 to 4 times with dry raw material, lower the temperature, and start production.',
      },
    ],
    effects: [
      {
        ko: '6개월 후 다이스가 달라집니다.',
        en: 'Dies will be noticeably different after 6 months.',
      },
    ],
  },
};

/* 모든 공정 공통 — 혼합·온도 단계 */
export const commonSteps = {
  mix: [
    {
      ko: '★ 건조한 신재 / 분쇄품에 코라텍스를 믹싱합니다. (안 뭉치게 골고루)',
      en: 'Mix Coratex with dry raw material / granules, evenly and without clumps.',
    },
  ],
  temp: [
    {
      ko: '작업 온도보다 <b>+30 ~ 50℃ 높게</b> 설정합니다.',
      en: 'Raise the temperature 30–50℃ above the operating temperature.',
    },
    {
      ko: '<b>★ 호퍼 Zone은 동일 온도 ★</b> 경화성 있는 PET·PBT 계열은 반드시 작업 온도와 동일하게 유지합니다. ⟹ <b>호퍼 꼭 닦기!</b>',
      en: '★ Hopper zone stays at the same temperature ★ For PET and PBT types, keep it identical to the operating temperature. ⟹ Be sure to clean the hopper!',
    },
  ],
};

export const blackSpotNote = {
  titleKo: '✳✳ 흑점 제거를 위해 처음 코라텍스를 사용하는 경우',
  titleEn: '✳✳ Using Coratex for the first time to remove black spots',
  bodyKo:
    '(실린더/스크류의 사용 연한) ÷ 2 = 최초 흑점 제거를 위한 사용 횟수<br>예) 기계가 10년 된 경우 = (10년 ÷ 2) = <b>5회 청소 권장</b>',
  bodyEn:
    '(Usage life of cylinder/screw) ÷ 2 = number of uses for initial black spot removal. e.g. for a 10-year-old machine = (10 ÷ 2) = 5 recommended cleanings.',
};

export const principle = [
  {
    ko: '색상 교체·원료 교체를 코라텍스로 하면, 실린더 스크류 내부의 탄화물이 없어지면서 코팅되어 빠르게 안정화됩니다. (6개월 후 체크링을 열어 보면 깨끗합니다.)',
    en: 'When changing colors or materials with Coratex, carbides inside the cylinder screw are removed and the surface is coated, stabilizing quickly. The check ring will be clean after 6 months.',
  },
  {
    ko: '코라텍스가 일정 시간 체류하면서 흑점과 탄화물이 연성화되어, 사용할수록 체류 시간과 교체 시간이 단축되고 원료·전기료가 절감됩니다.',
    en: 'As Coratex dwells, black spots and carbides soften. The more you use it, the shorter the dwell and changeover times, saving material and electricity costs.',
  },
];

/* ----------------------------------------------------------
   고객사
   ---------------------------------------------------------- */
export const companyLists = {
  injection: {
    slug: 'injection',
    ko: '사출 회사',
    en: 'Injection Companies',
    backTo: '/injection',
    backLabel: '사출',
    total: '2500+',
    plus: '외 2500개사',
    plusEn: 'Plus ~2,500 companies',
    maskNoteKo: '※ 일부 표기는 고객사 보호를 위해 일부 마스킹되어 있습니다.',
    maskNoteEn: '※ Some names are partially masked to protect customers.',
    names: [
      '한국단자✱업', '플✱텔', '네오✱라테크', '우남✱업', '동보✱업', '피터✱라스',
      '무등스✱린', '유림✱업', '창신✱밀', '금용✱크', '일영', '금능✱밀', '명일',
      'KPI', '화창✱업', '서원✱자', 'AMS', '대동인더✱트리', '혜성✱학', '명성✱학',
      '도림✱업', '우신✱스템', '부광✱밀', '한림✱크', '자강✱업',
    ],
  },
  extrusion: {
    slug: 'extrusion',
    ko: '압출 회사',
    en: 'Extrusion Companies',
    backTo: '/extrusion',
    backLabel: '압출',
    total: '1000+',
    plus: '외 1000개사',
    plusEn: 'Plus ~1,000 companies',
    maskNoteKo: '※ 일부 표기는 고객사 보호를 위해 일부 마스킹되어 있습니다.',
    maskNoteEn: '※ Some names are partially masked to protect customers.',
    names: [
      '불이✱성', '일신하이✱리', '유명✱학', 'KC', '보성포리✱크', '삼진P✱S', 'GDR',
      '진현✱학', '성심케✱탈', 'AL테크', '인포✱크', '동성✱학공업', '부국TN✱',
      '미성', '동원시✱템즈', '랩텍', '메디파마✱랜', '고리',
    ],
  },
  blow_molding: {
    slug: 'blow_molding',
    ko: '블로우 회사',
    en: 'Blow-molding Companies',
    backTo: '/blow_molding',
    backLabel: '블로우',
    total: '500+',
    plus: '외 500개사',
    plusEn: 'Plus ~500 companies',
    maskNoteKo: '※ 일부 표기는 고객사 보호를 위해 일부 마스킹되어 있습니다.',
    maskNoteEn: '※ Some names are partially masked to protect customers.',
    names: [
      '일양✱학', '동창프라✱틱', '경일✱학', '미림화✱', '대한✱성', 'TJ✱미칼', '강진✱라스틱',
    ],
  },
};

/* ----------------------------------------------------------
   소개 페이지
   ---------------------------------------------------------- */
export const aboutFeatures = [
  { ko: '자동 Maintenance 가능', en: 'Auto maintenance possible' },
  { ko: '분해 청소 대용 / 색상·흑점 제거 가능', en: 'Substitute for disassembly cleaning; removes color and black spots' },
  { ko: '사출·압출·블로우·티다이·핫러너 세정 가능', en: 'Suitable for injection, extrusion, blow, T-die and hot runner cleaning' },
  { ko: '모든 원재료 (열가소성 수지 400℃까지)', en: 'All raw materials, up to 400℃ heat-resistant resin' },
  { ko: '10분 내 원료 색상 변경 도전 가능', en: 'Color change possible within 10 minutes' },
];

export const aboutEconomy = [
  { ko: '2,500~3,500원/kg대 도전 가능', en: 'Achievable at KRW 2,500–3,500 per kg' },
  { ko: '30만원대 투자로 원료 600~1,000kg 절감 도전 가능', en: 'Save 600–1,000 kg of material with an investment of about KRW 300,000' },
  { ko: '전기세 40% 절감 도전 가능', en: 'Up to 40% electricity cost savings' },
  { ko: '재활용 도전 가능', en: 'Recycling achievable' },
];

/* ----------------------------------------------------------
   제품 효과
   ---------------------------------------------------------- */
export const effects = [
  { n: 1, ko: '제일 불량이 많은 흑점을 잡는 데 탁월합니다.', en: 'Excellent at eliminating black spots, the most common cause of defects.' },
  { n: 2, ko: '퍼징하고 청소하는 데 걸리는 시간이 단축됩니다.', en: 'Shortens the time needed for purging and cleaning.' },
  { n: 3, ko: '실린더 스크류 코팅막 보호로 스크류 수명이 늘어납니다.', en: 'Extends screw life by protecting the cylinder screw coating layer.' },
  { n: 4, ko: '코라텍스로 주기적으로 청소하고 관리하면 불량률이 줄어듭니다.', en: 'Reduces the defect rate when cleaning and maintenance are performed regularly.' },
];

/* ----------------------------------------------------------
   자매 제품
   ---------------------------------------------------------- */
export const sisterProducts = [
  {
    ko: '암바사-오토',
    en: 'Ambassador-Auto',
    image: withBase('images/ambassador-auto.jpg'),
    alt: '암바사-오토 (Ambassador-Auto) 세정 페이스트',
    useKo: 'T다이스, 스크류, 실린더 내벽 도금면 탄화물 제거, 스케일, 녹 제거',
    useEn: 'T-dies, screw, remove carbides from plated inner cylinder surface, scale & corrosion removal',
    fieldKo: '압출',
    fieldEn: 'Extrusion',
  },
  {
    ko: '슈미트 죨',
    en: 'Schmidt Zol',
    image: withBase('images/schmidt-zol.jpg'),
    alt: '슈미트 죨 (Schmidt Zol) 제품',
    useKo: '폴리싱롤, 광택 제습제',
    useEn: 'Polishing roll, gloss dehumidifier',
    fieldKo: '압출 폴리싱롤',
    fieldEn: 'Extrusion polishing roll',
  },
  {
    ko: '트리오 튜브',
    en: 'Trio Tube',
    image: withBase('images/trio-tube.jpg'),
    alt: '트리오 튜브 (Trio Tube) 금형광택제',
    useKo: '금형 광택제',
    useEn: 'Mold polisher',
    fieldKo: '사출, 금형',
    fieldEn: 'Injection, mold',
  },
];

export const stats = [
  { num: '4000+', ko: '국내 고객 사용 중', en: 'In use by domestic customers', to: null },
  { num: '2500+', ko: '2500+ 개사', en: '2500+ Companies',
    linkKo: '사출 회사 보기', linkEn: 'Injection Companies', to: '/injection_companies' },
  { num: '1000+', ko: '1000+ 개사', en: '1000+ Companies',
    linkKo: '압출 회사 보기', linkEn: 'Extrusion Companies', to: '/extrusion_companies' },
  { num: '500+',  ko: '500+ 개사', en: '500+ Companies',
    linkKo: '블로우 회사 보기', linkEn: 'Blow-Molding Companies', to: '/blow_molding_companies' },
];

/* ----------------------------------------------------------
   전역 공통 문구 — 원본(coratexkorea) 문구를 그대로 보존합니다.
   ⚠ 원문 그대로이므로 임의로 수정하지 마세요.
   ---------------------------------------------------------- */
export const globalCopy = {
  taglineKo: 'CORATEX KOREA | 지평상사(地平商社) ✮ 정직이 원칙입니다',
  taglineEn: 'CORATEX KOREA | JI PYEONG Corp ✮ Honest is our policy',
  /* 헤더에서 "✮ 정직이 원칙입니다" 부분만 강조색(흰색)으로 표시하기 위해 분리 */
  taglinePrefixKo: 'CORATEX KOREA | 지평상사(地平商社)',
  taglineEmphasisKo: '✮ 정직이 원칙입니다',
  taglinePrefixEn: 'CORATEX KOREA | JI PYEONG Corp',
  taglineEmphasisEn: '✮ Honest is our policy',
  /* 공정 상세 페이지(injection/extrusion/blow_molding)의 원본 표기 */
  companyLineLongKo: '지 평 상 사 | JI PYEONG Corp (독점권자)',
  companyLineLongEn: 'JI PYEONG Corp (Sole Distributor in Korea)',
  privacyKo: '개인정보처리방침',
  privacyEn: 'Privacy Policy',
  privacyLeadKo: '아래에서 개인정보처리방침을 확인하실 수 있습니다.',
  privacyLeadEn: 'You can read our Privacy Policy here.',
  trademarkKo: '※ Coratex HT® 및 productivity with marks purging®는 SAINT-GOBAIN Abrasives의 등록 상표입니다.',
  trademarkEn: '※ Coratex HT® and productivity with marks purging® are registered trade of SAINT-GOBAIN Abrasives.',
  copyright: '© 2026 All Rights Reserved By JI PYEONG Corp',
};

/* 개인정보처리방침 본문 — 원본 privacy-policy.html 그대로 */
export const privacyPolicy = {
  titleKo: '개인정보처리방침',
  titleEn: 'Privacy Policy',
  leadKo: '본 사이트는 회원가입/로그인 기능 없이 운영됩니다. 아래 내용은 문의 대응을 위해 필요한 범위에서 개인정보를 처리하는 방식에 대한 안내입니다.',
  leadEn: 'This website operates without membership/login. The following explains how we handle personal data only to the extent necessary for inquiries.',
  sections: [
    {
      ko: '1. 수집 항목',
      en: '1. Data We Collect',
      itemsKo: [
        '문의 시 제공되는 정보(회사명, 담당자명, 연락처, 이메일, 문의 내용 등)',
        '사이트 운영 과정에서 자동 생성될 수 있는 정보(접속 로그 등)',
      ],
      itemsEn: [
        'Information you provide when contacting us (company, name, phone, email, message, etc.)',
        'Information that may be automatically generated during operation (access logs, etc.)',
      ],
    },
    {
      ko: '2. 이용 목적',
      en: '2. Purpose of Use',
      itemsKo: ['문의 답변, 견적/샘플 상담, 주문/납품 관련 연락', '서비스 품질 및 운영 안정성 확인'],
      itemsEn: [
        'Responding to inquiries, quotations/samples, order & delivery communication',
        'Service quality and operational stability',
      ],
    },
    {
      ko: '3. 보관 및 파기',
      en: '3. Retention & Deletion',
      itemsKo: ['문의 처리 목적이 달성되면 관련 정보는 내부 기준에 따라 보관 후 파기할 수 있습니다. 삭제 요청이 있을 경우 아래 연락처로 문의해 주세요.'],
      itemsEn: ['After the inquiry purpose is fulfilled, information may be retained for a reasonable period and then deleted according to internal standards. You may request deletion via the contact below.'],
    },
    {
      ko: '4. 문의처',
      en: '4. Contact',
      itemsKo: ['이메일: 0822gblessy@naver.com / 전화: 010-8596-5562'],
      itemsEn: ['Email: 0822gblessy@naver.com / Phone: 010-8596-5562'],
    },
  ],
};

/* 인덱스 구매/문의 안내 — 원본 index.html 그대로 */
export const orderMethods = [
  {
    ko: '계좌 이체', en: 'Bank Transfer',
    bodyKo: company.bankKo, bodyEn: 'Shinhan Bank 110-013-196656 (JI Pyeong Corp., Cho Kyung Bae)',
  },
  {
    ko: '팩스 주문', en: 'Fax Order',
    bodyKo: `주문서 작성 후 사업자등록증 사본과 함께 팩스 또는 이메일로 보내주세요. FAX: ${company.fax} 이메일: ${company.email}`,
    bodyEn: `Fill out the order form and send it with your business registration certificate via fax or email. FAX: ${company.fax} Email: ${company.email}`,
  },
  {
    ko: '전화 / 이메일', en: 'Phone / Email',
    bodyKo: `전화 주문 (사업자등록증 사본 사진 전송) 전화번호: ${company.mobile} 이메일: ${company.email}`,
    bodyEn: `Order by phone (send a photo of your business registration certificate) Phone: ${company.mobile} Email: ${company.email}`,
  },
];

export const priceNoteKo = '※ 가격은 문의 요청 드립니다 ( 010-8596-5562 )';
export const priceNoteEn = '※ For pricing, please contact us ( 010-8596-5562 )';
export const statsTotalKo = '총 4000개사 내외';
export const statsTotalEn = 'Approx. 4,000 companies';
export const welcomeKo = '환영합니다';
export const sisterTitleKo = '자매 제품';
export const sisterTitleEn = 'Sister Products';

/* 소개 페이지 — 수치 산정 기준 (원본 about.html 그대로) */
export const aboutAssumptions = {
  titleKo: '수치 산정 기준(예시)',
  titleEn: 'Assumptions & measurement (example)',
  leadKo: '아래 수치는 라인 조건에 따라 달라질 수 있습니다. 상담 시 “조건(전제)–대표 케이스–측정 방식”으로 함께 확인하는 것을 권장합니다.',
  leadEn: 'Results can vary by line. For B2B clarity, we recommend confirming the assumptions, a representative case, and a simple measurement method together.',
  items: [
    {
      labelKo: '전제(예시):',
      labelEn: 'Assumptions (example):',
      ko: '주 2~4회 색상/원료 교체, 퍼징 농도 2%, 공정별 체류 5~15분',
      en: '2–4 color/material changeovers per week, 2% dosing, 5–15 min dwell (process-dependent)',
    },
    {
      labelKo: '대표 케이스(예시):',
      labelEn: 'Representative case (example):',
      ko: '기존 퍼징/분해 청소 대비, 교체 작업(퍼징·대기) 시간과 스크랩(재생 원료) 감소가 예측됩니다.',
      en: 'Compared to conventional purging/disassembly cleaning, changeover time and purge scrap decrease on the same line',
    },
    {
      labelKo: '측정 방식(간단):',
      labelEn: 'How we measure (simple):',
      ko: '4주 단위로 ‘교체 1회당 스크랩 중량(kg)’ 및 ‘교체 단계 kWh’를 전/후 비교',
      en: 'Over 4 weeks, compare “scrap weight per changeover (kg)” and “kWh during purge/idle” before vs. after',
    },
    {
      labelKo: '변수:',
      labelEn: 'Key variables:',
      ko: '수지 종류, 작업 온도, 스크류/실린더 상태, 오염 정도, 작업자 숙련도에 따라 결과 차이 발생',
      en: 'resin type, temperatures, screw/cylinder condition, contamination level, and operator practice',
    },
  ],
};
