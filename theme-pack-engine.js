/* =========================================================================
   메모리온 (MemoryOn) — 디자인 팩(스킨+에셋) & 오케스트라 사운드 & 20종 폰트 엔진
   (theme-pack-engine.js — 도면/그림 가림막 & 표 가림막 100% 통합 완성본)
   ========================================================================= */

// ★ 1. 수험생 & 다꾸 인기 한글 웹폰트 20종 정의 ★
const MEMORYON_FONTS_20 = [
  // [깔끔 고딕 5종]
  { id: 'pretendard', name: '1. 프리텐다드 (기본 깔끔고딕)', category: '✨ 깔끔 고딕', family: "'Pretendard Variable', 'Pretendard', sans-serif", cssUrl: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css' },
  { id: 'nanum_neo', name: '2. 네이버 나눔스퀘어 네오', category: '✨ 깔끔 고딕', family: "'NanumSquareNeo', sans-serif", cssUrl: 'https://hangeul.pstatic.net/hangeul_static/css/nanum-square-neo.css' },
  { id: 'gmarket', name: '3. 지마켓 산스 (모던 타이틀체)', category: '✨ 깔끔 고딕', family: "'GmarketSansMedium', sans-serif", faceRule: "@font-face { font-family: 'GmarketSansMedium'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff'); font-weight: normal; font-style: normal; }" },
  { id: 'spoqa', name: '4. 스포카 한 산스 네오 (가독성 최강)', category: '✨ 깔끔 고딕', family: "'Spoqa Han Sans Neo', sans-serif", cssUrl: 'https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css' },
  { id: 'ibm_plex', name: '5. IBM 플렉스 산스 (스마트 수험서)', category: '✨ 깔끔 고딕', family: "'IBM Plex Sans KR', sans-serif", cssUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;600;700&display=swap' },

  // [감성 다꾸·라운드 5종]
  { id: 'gowun_dodum', name: '6. 고운돋움 (단아한 다꾸 고딕)', category: '🍓 감성 다꾸·라운드', family: "'Gowun Dodum', sans-serif", cssUrl: 'https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap' },
  { id: 'cafe24_air', name: '7. 카페24 써라운드 에어 (동글동글)', category: '🍓 감성 다꾸·라운드', family: "'Cafe24SsurroundAir', sans-serif", faceRule: "@font-face { font-family: 'Cafe24SsurroundAir'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2105_2@1.0/Cafe24SsurroundAir.woff') format('woff'); font-weight: normal; font-style: normal; }" },
  { id: 'cafe24_night', name: '8. 카페24 고운밤 (감성 에세이)', category: '🍓 감성 다꾸·라운드', family: "'Cafe24Oneprettynight', sans-serif", faceRule: "@font-face { font-family: 'Cafe24Oneprettynight'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.1/Cafe24Oneprettynight.woff') format('woff'); font-weight: normal; font-style: normal; }" },
  { id: 'suite', name: '9. 스위트 (SUITE 라운드 고딕)', category: '🍓 감성 다꾸·라운드', family: "'SUITE-Regular', sans-serif", faceRule: "@font-face { font-family: 'SUITE-Regular'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/SUITE-Regular.woff2') format('woff2'); font-weight: 400; font-style: normal; }" },
  { id: 'omyu', name: '10. 오뮤 다예쁨체 (아기자기 다꾸)', category: '🍓 감성 다꾸·라운드', family: "'omyu_pretty', sans-serif", faceRule: "@font-face { font-family: 'omyu_pretty'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-01@1.0/omyu_pretty.woff2') format('woff2'); font-weight: normal; font-style: normal; }" },

  // [다이어리 손글씨 5종]
  { id: 'kyobo2020', name: '11. 교보 손글씨 2020 (정갈한 노트)', category: '✏️ 다이어리 손글씨', family: "'KyoboHandwriting2020A', cursive", faceRule: "@font-face { font-family: 'KyoboHandwriting2020A'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2112@1.0/KyoboHandwriting2020A.woff') format('woff'); font-weight: normal; font-style: normal; }" },
  { id: 'gaegu', name: '12. 개구쟁이체 (귀여운 서브노트)', category: '✏️ 다이어리 손글씨', family: "'Gaegu', cursive", cssUrl: 'https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&display=swap' },
  { id: 'hi_melody', name: '13. 하이멜로디 (소녀감성 다꾸)', category: '✏️ 다이어리 손글씨', family: "'Hi Melody', cursive", cssUrl: 'https://fonts.googleapis.com/css2?family=Hi+Melody&display=swap' },
  { id: 'gamja', name: '14. 감자꽃체 (포근한 둥근 손글씨)', category: '✏️ 다이어리 손글씨', family: "'Gamja Flower', cursive", cssUrl: 'https://fonts.googleapis.com/css2?family=Gamja+Flower&display=swap' },
  { id: 'nanum_pen', name: '15. 나눔손글씨 펜 (실제 볼펜 필기)', category: '✏️ 다이어리 손글씨', family: "'Nanum Pen Script', cursive", cssUrl: 'https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap' },

  // [클래식 명조·세리프 5종]
  { id: 'gowun_batang', name: '16. 고운바탕 (우아한 클래식 명조)', category: '🎻 클래식 명조·세리프', family: "'Gowun Batang', serif", cssUrl: 'https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap' },
  { id: 'maruburi', name: '17. 네이버 마루부리 (현대적 정통명조)', category: '🎻 클래식 명조·세리프', family: "'MaruBuri', serif", cssUrl: 'https://hangeul.pstatic.net/hangeul_static/css/maru-buri.css' },
  { id: 'ridi_batang', name: '18. 리디바탕 (이북 리더 전용 명조)', category: '🎻 클래식 명조·세리프', family: "'RIDIBatang', serif", faceRule: "@font-face { font-family: 'RIDIBatang'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/RIDIBatang.woff') format('woff'); font-weight: normal; font-style: normal; }" },
  { id: 'nanum_myeongjo', name: '19. 나눔명조 (품격 있는 수험서)', category: '🎻 클래식 명조·세리프', family: "'Nanum Myeongjo', serif", cssUrl: 'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap' },
  { id: 'chosun_ilbo', name: '20. 조선일보명조 (전통 고서적 감성)', category: '🎻 클래식 명조·세리프', family: "'Chosunilbo_myungjo', serif", faceRule: "@font-face { font-family: 'Chosunilbo_myungjo'; src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff') format('woff'); font-weight: normal; font-style: normal; }" }
];

// ★ 2. 디자인 팩 카탈로그 정의 ★
const MEMORYON_DESIGN_PACKS = {
  strawberry_milk: {
    id: 'strawberry_milk',
    name: '🍓 베리베리 딸기우유 다꾸 팩',
    folder: 'packs/strawberry_milk',
    defaultFont: 'omyu',
    soundTimbre: 'musicbox',
    basePitch: 523.25,
    imgMaskLabel: '🍓 도면 / 수식 그림 클릭하여 확인 🍓',
    colors: {
      primary: '#e14b6e',
      primaryDark: '#c43254',
      primarySoft: '#ffe5ec',
      accent: '#d946ef',
      accentSoft: '#fae8ff',
      tableHeader: '#ffeef3',
      bg: '#fdf6ec',
      cardBg: 'rgba(255, 252, 249, 0.93)',
      surfaceBg: '#fff0f5',
      text: '#4a2c35',
      subText: '#8c5e6b',
      border: '#f3bac8',
      cardBorder: '#f9d5de',
      redKey: '#e11d48',
      blueKey: '#c026d3',
      headingColor: '#be185d',
      headerBg: 'linear-gradient(135deg, #f48fb1 0%, #e14b6e 100%)',
      cardRadius: '22px',
      cardShadow: '0 14px 32px rgba(225, 75, 110, 0.14), inset 0 2px 0 #ffffff'
    }
  },
  pastel_macaron: {
    id: 'pastel_macaron',
    name: '🍬 파리 라뒤레 파스텔 마카롱 팩',
    folder: 'packs/pastel_macaron',
    defaultFont: 'cafe24_air',
    soundTimbre: 'harp',
    basePitch: 587.33,
    imgMaskLabel: '🍬 개념도 / 수식 그림 클릭하여 확인 🍬',
    colors: {
      primary: '#9b6b9e',
      primaryDark: '#7b4f7e',
      primarySoft: '#f3e8ff',
      accent: '#10b981',
      accentSoft: '#d1fae5',
      tableHeader: '#e8f5e9',
      bg: '#faf7fd',
      cardBg: 'rgba(255, 255, 255, 0.93)',
      surfaceBg: '#f3eef8',
      text: '#3b2f42',
      subText: '#7a6885',
      border: '#cbb8d9',
      cardBorder: '#e5d8f0',
      redKey: '#db2777',
      blueKey: '#7c3aed',
      headingColor: '#6d28d9',
      headerBg: 'linear-gradient(135deg, #88c9b3 0%, #a58cc4 100%)',
      cardRadius: '24px',
      cardShadow: '0 14px 30px rgba(155, 107, 158, 0.13), inset 0 2px 0 #ffffff'
    }
  },
  gummy_bear_jelly: {
    id: 'gummy_bear_jelly',
    name: '🧸 하리보 곰돌이 젤리 캔디팝 팩',
    folder: 'packs/gummy_bear_jelly',
    defaultFont: 'suite',
    soundTimbre: 'marimba',
    basePitch: 659.25,
    imgMaskLabel: '🧸 개념도 / 수식 그림 클릭하여 확인 🧸',
    colors: {
      primary: '#f43f5e',
      primaryDark: '#e11d48',
      primarySoft: '#ffe4e6',
      accent: '#0ea5e9',
      accentSoft: '#e0f2fe',
      tableHeader: '#fff1f2',
      bg: '#fff9f5',
      cardBg: 'rgba(255, 255, 255, 0.91)',
      surfaceBg: '#fff0eb',
      text: '#3f272d',
      subText: '#8c626c',
      border: '#fda4af',
      cardBorder: '#fecdd3',
      redKey: '#e11d48',
      blueKey: '#0284c7',
      headingColor: '#e11d48',
      headerBg: 'linear-gradient(135deg, #fb7185 0%, #f59e0b 100%)',
      cardRadius: '24px',
      cardShadow: '0 14px 34px rgba(244, 63, 94, 0.15), inset 0 3px 6px rgba(255,255,255,0.9)'
    }
  },
  choco_cookie_cafe: {
    id: 'choco_cookie_cafe',
    name: '🍪 초코쿠키 & 테디베어 카페 팩',
    folder: 'packs/choco_cookie_cafe',
    defaultFont: 'gowun_dodum',
    soundTimbre: 'rhodes',
    basePitch: 440.00,
    imgMaskLabel: '🍪 개념도 / 수식 그림 클릭하여 확인 🧸',
    colors: {
      primary: '#8b5a2b',
      primaryDark: '#6b4226',
      primarySoft: '#f5ebe0',
      accent: '#b45309',
      accentSoft: '#fef3c7',
      tableHeader: '#ede0d4',
      bg: '#f7f0e6',
      cardBg: 'rgba(255, 252, 247, 0.93)',
      surfaceBg: '#efe5d8',
      text: '#3d2817',
      subText: '#7f5f46',
      border: '#c2a385',
      cardBorder: '#decab6',
      redKey: '#b91c1c',
      blueKey: '#8b5a2b',
      headingColor: '#5c3a21',
      headerBg: 'linear-gradient(135deg, #6f4e37 0%, #4a3222 100%)',
      cardRadius: '20px',
      cardShadow: '0 12px 28px rgba(74, 50, 34, 0.14), inset 0 2px 0 #fffdf9'
    }
  },
  royal_orchestra: {
    id: 'royal_orchestra',
    name: '🎻 빈 필하모닉 마에스트로 팩',
    folder: 'packs/royal_orchestra',
    defaultFont: 'gowun_batang',
    soundTimbre: 'orchestra',
    basePitch: 392.00,
    imgMaskLabel: '🎻 개념도 / 수식 악보 클릭하여 확인 🎼',
    colors: {
      primary: '#801323',
      primaryDark: '#590915',
      primarySoft: '#f9ebed',
      accent: '#b8860b',
      accentSoft: '#fdf6e2',
      tableHeader: '#f2e8d5',
      bg: '#faf6ee',
      cardBg: 'rgba(255, 253, 248, 0.94)',
      surfaceBg: '#f3ece0',
      text: '#291c14',
      subText: '#6e5a49',
      border: '#c9b086',
      cardBorder: '#dfd1b8',
      redKey: '#8c1022',
      blueKey: '#85581A',
      headingColor: '#660f1c',
      headerBg: 'linear-gradient(135deg, #6e0f1d 0%, #38060d 100%)',
      cardRadius: '14px',
      cardShadow: '0 14px 32px rgba(56, 6, 13, 0.18), 0 0 0 1px #d4af37'
    }
  },
  modern: {
    id: 'modern',
    name: '✨ 기본 스튜디오 (모던 클린)',
    folder: null,
    defaultFont: 'pretendard',
    soundTimbre: 'soft_piano',
    basePitch: 523.25
  },
  academic: {
    id: 'academic',
    name: '📘 클래식 수험서 (아카데믹)',
    folder: null,
    defaultFont: 'ibm_plex',
    soundTimbre: 'soft_piano',
    basePitch: 493.88
  },
  hanji: {
    id: 'hanji',
    name: '📜 한지 이북 리더 (눈 보호)',
    folder: null,
    defaultFont: 'ridi_batang',
    soundTimbre: 'harp',
    basePitch: 440.00
  },
  dark: {
    id: 'dark',
    name: '🌙 딥 다크 스튜디오 (야간 모드)',
    folder: null,
    defaultFont: 'pretendard',
    soundTimbre: 'orchestra',
    basePitch: 392.00
  }
};

let currentPackId = 'strawberry_milk';
let currentFontId = 'AUTO';
let isSoundEnabled = true;
let soundVolume = 0.80;
let revealComboStep = 0;
let revealComboResetTimer = null;

let packAudioCtx = null;
let packConvolverNode = null;
let loadedFontLinks = new Set();

/* =========================================================================
   ★ 3. 로컬 file:/// 환경에서도 100% 작동하는 이미지 경로 탐색기 ★
   ========================================================================= */
function resolvePackImagePath(packFolder, fileName) {
  return new Promise((resolve) => {
    const candidates = [
      `${packFolder}/${fileName}`,
      `${packFolder}/assets/${fileName}`,
      `${packFolder}/${fileName}.png`
    ];
    let idx = 0;
    const tryNext = () => {
      if (idx >= candidates.length) {
        resolve(`${packFolder}/${fileName}`);
        return;
      }
      const url = candidates[idx++];
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => tryNext();
      img.src = url;
    };
    tryNext();
  });
}

/* =========================================================================
   ★ 4. 인기 글꼴 20종 동적 로더 및 적용기 ★
   ========================================================================= */
function applyMemoryOnFont(fontId) {
  currentFontId = fontId || 'AUTO';
  localStorage.setItem('memoryon_selected_font', currentFontId);

  let effectiveFontId = currentFontId;
  if (effectiveFontId === 'AUTO') {
    const pack = MEMORYON_DESIGN_PACKS[currentPackId] || MEMORYON_DESIGN_PACKS.strawberry_milk;
    effectiveFontId = pack.defaultFont || 'pretendard';
  }

  const fontMeta = MEMORYON_FONTS_20.find(f => f.id === effectiveFontId) || MEMORYON_FONTS_20[0];

  if (fontMeta.cssUrl && !loadedFontLinks.has(fontMeta.cssUrl)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontMeta.cssUrl;
    document.head.appendChild(link);
    loadedFontLinks.add(fontMeta.cssUrl);
  }
  if (fontMeta.faceRule && !loadedFontLinks.has(fontMeta.id)) {
    const style = document.createElement('style');
    style.innerHTML = fontMeta.faceRule;
    document.head.appendChild(style);
    loadedFontLinks.add(fontMeta.id);
  }

  let fontStyleEl = document.getElementById('memoryon-dynamic-font-style');
  if (!fontStyleEl) {
    fontStyleEl = document.createElement('style');
    fontStyleEl.id = 'memoryon-dynamic-font-style';
    document.head.appendChild(fontStyleEl);
  }

  fontStyleEl.innerHTML = `
    body, button, input, select, textarea,
    .subnote-card, .rendered-content, .hwp-table th, .hwp-table td,
    .para-mask, .section-heading, .subnote-title {
      font-family: ${fontMeta.family} !important;
    }
  `;

  const sel = document.getElementById('memoryon-font-selector');
  if (sel && sel.value !== currentFontId) sel.value = currentFontId;
}

/* =========================================================================
   ★ 5. 디자인 팩 스킨 & 모든 가림막(그림/빨간빈칸/파란빈칸/표/줄) 통합 적용기 ★
   ========================================================================= */
async function applyMemoryOnDesignPack(packId, playPreviewSound = false) {
  const pack = MEMORYON_DESIGN_PACKS[packId] || MEMORYON_DESIGN_PACKS.strawberry_milk;
  currentPackId = pack.id;
  localStorage.setItem('firepe_theme_skin', pack.id);
  localStorage.setItem('memoryon_active_pack', pack.id);

  const sel = document.getElementById('theme-skin-select');
  if (sel && sel.value !== pack.id) sel.value = pack.id;

  applyMemoryOnFont(currentFontId);

  let packStyleEl = document.getElementById('memoryon-pack-custom-style');
  if (!packStyleEl) {
    packStyleEl = document.createElement('style');
    packStyleEl.id = 'memoryon-pack-custom-style';
    document.head.appendChild(packStyleEl);
  }

  if (!pack.folder) {
    packStyleEl.innerHTML = '';
    document.body.classList.remove('theme-modern', 'theme-academic', 'theme-hanji', 'theme-dark', 'dark-mode', 'bluelight-mode');
    if (pack.id === 'academic') document.body.classList.add('theme-academic');
    else if (pack.id === 'hanji') document.body.classList.add('theme-hanji', 'bluelight-mode');
    else if (pack.id === 'dark') document.body.classList.add('theme-dark', 'dark-mode');
    else document.body.classList.add('theme-modern');
    updateHeaderBrandIcon(null);
    if (playPreviewSound) playPackSound('good');
    return;
  }

  document.body.classList.remove('theme-academic', 'theme-hanji', 'theme-dark', 'dark-mode', 'bluelight-mode');

  const [iconUrl, bgUrl, maskRedUrl, maskClozeUrl] = await Promise.all([
    resolvePackImagePath(pack.folder, 'icon.png'),
    resolvePackImagePath(pack.folder, 'bg_pattern.png'),
    resolvePackImagePath(pack.folder, 'mask_red.png'),
    resolvePackImagePath(pack.folder, 'mask_cloze.png')
  ]);

  updateHeaderBrandIcon(iconUrl);

  const c = pack.colors;
  const imgLabel = pack.imgMaskLabel || '🖼️ 개념도 / 수식 그림 클릭하여 확인';

  packStyleEl.innerHTML = `
    :root {
      --primary: ${c.primary};
      --primary-dark: ${c.primaryDark};
      --primary-soft: ${c.primarySoft};
      --accent: ${c.accent};
      --accent-soft: ${c.accentSoft};
      --table-header: ${c.tableHeader};
      --bg: ${c.bg};
      --card-bg: ${c.cardBg};
      --surface-bg: ${c.surfaceBg};
      --text: ${c.text};
      --sub-text: ${c.subText};
      --border: ${c.border};
      --card-border: ${c.cardBorder};
      --red-key: ${c.redKey};
      --blue-key: ${c.blueKey};
      --heading-color: ${c.headingColor};
      --card-radius: ${c.cardRadius};
      --card-shadow: ${c.cardShadow};
      --header-bg: ${c.headerBg};
    }

    /* ★ 1. 전체 배경지 (bg_pattern.png 타일 적용) ★ */
    html, body {
      background-color: ${c.bg} !important;
      background-image: url("${bgUrl}") !important;
      background-repeat: repeat !important;
      background-size: 280px auto !important;
      background-attachment: fixed !important;
      color: ${c.text} !important;
    }

    .subnote-card, .stats-bar, .control-bar {
      background: ${c.cardBg} !important;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 2px solid ${c.cardBorder} !important;
    }

    /* ★ 2. 도면 / 수식 그림 가림막 (.img-mask.masked) — 3D 아이콘 + 마스킹테이프 액자 카드 ★ */
    .img-mask.masked {
      background-color: ${c.surfaceBg} !important;
      background-image:
        url("${iconUrl}"),
        url("${maskClozeUrl}"),
        linear-gradient(180deg, rgba(255,255,255,0.78) 0%, ${c.primarySoft} 100%),
        url("${bgUrl}") !important;
      background-size:
        76px 76px,
        230px 36px,
        100% 100%,
        180px auto !important;
      background-position:
        center calc(50% - 18px),
        center calc(50% + 40px),
        center center,
        center center !important;
      background-repeat:
        no-repeat,
        no-repeat,
        no-repeat,
        repeat !important;
      border: 2.5px solid ${c.border} !important;
      border-radius: 18px !important;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08), inset 0 2px 0 #ffffff !important;
      min-width: 280px !important;
      min-height: 155px !important;
      transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease !important;
    }
    .img-mask.masked:hover {
      transform: translateY(-3px) scale(1.015);
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.13), inset 0 2px 0 #ffffff !important;
    }
    .img-mask.masked::after {
      content: "${imgLabel}" !important;
      color: ${c.text} !important;
      font-size: 0.84rem !important;
      font-weight: 800 !important;
      align-items: flex-end !important;
      padding-bottom: 18px !important;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.95);
    }

    /* ★ 3. 빨간 핵심어 빈칸 가림막 (mask_red.png 3D 배지 적용) ★ */
    .red-hl.masked {
      background-color: transparent !important;
      background-image: url("${maskRedUrl}") !important;
      background-size: 100% 100% !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      border: none !important;
      box-shadow: none !important;
      filter: drop-shadow(0 3px 5px rgba(0,0,0,0.14));
      min-width: 82px !important;
      min-height: 30px !important;
      padding: 4px 16px 4px 30px !important;
      margin: 0 2px !important;
      vertical-align: middle !important;
      transition: transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    }
    .red-hl.masked:hover {
      transform: scale(1.07) translateY(-1px);
    }
    .red-hl.masked::after {
      content: "" !important;
    }

    /* ★ 4. 파란 암기표 빈칸 가림막 (mask_cloze.png 마스킹테이프 적용) ★ */
    .cloze-box.masked {
      background-color: transparent !important;
      background-image: url("${maskClozeUrl}") !important;
      background-size: 100% 100% !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      border: none !important;
      box-shadow: none !important;
      filter: drop-shadow(0 3px 5px rgba(0,0,0,0.12));
      min-width: 145px !important;
      min-height: 34px !important;
      padding: 6px 32px 6px 16px !important;
      vertical-align: middle !important;
      transition: transform 0.16s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    }
    .cloze-box.masked:hover {
      transform: scale(1.04);
    }
    .cloze-box.masked::after {
      content: "클릭확인" !important;
      color: ${c.text} !important;
      opacity: 0.82;
      font-size: 0.75rem !important;
      text-shadow: 0 1px 2px rgba(255,255,255,0.85);
    }

    /* ★ 5. 백지복습 문장 가림막 (.para-mask.masked) & 비교표 칸 가림막 (.cell-mask.masked::after) ★ */
    .para-mask.masked {
      background-color: ${c.surfaceBg} !important;
      background-image: url("${maskClozeUrl}") !important;
      background-size: 260px 100% !important;
      background-repeat: no-repeat !important;
      background-position: left center !important;
      border: 1.5px solid ${c.cardBorder} !important;
      border-radius: 12px !important;
      box-shadow: 0 3px 8px rgba(0,0,0,0.05) !important;
    }
    .para-mask.masked::after {
      color: ${c.text} !important;
      font-weight: 800 !important;
      text-shadow: 0 1px 2px rgba(255,255,255,0.9);
    }
    .cell-mask.masked::after {
      background-color: ${c.surfaceBg} !important;
      background-image: url("${maskClozeUrl}") !important;
      background-size: 92% 36px !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      border: 1.5px solid ${c.border} !important;
      border-radius: 10px !important;
      color: ${c.text} !important;
      text-shadow: 0 1px 2px rgba(255,255,255,0.9);
    }
  `;

  if (playPreviewSound) {
    playPackSound('good');
  }
}

function updateHeaderBrandIcon(iconUrl) {
  const h1 = document.querySelector('.brand-title-wrap h1');
  if (!h1) return;

  let iconImg = document.getElementById('pack-brand-icon-img');
  if (iconUrl) {
    if (!iconImg) {
      Array.from(h1.childNodes).forEach(node => {
        if (node.nodeType === 3 && node.textContent.includes('🧠')) {
          node.textContent = '';
        }
      });
      iconImg = document.createElement('img');
      iconImg.id = 'pack-brand-icon-img';
      iconImg.style.cssText = 'width:42px; height:42px; object-fit:contain; border-radius:10px; background:#fff; padding:2px; box-shadow:0 3px 8px rgba(0,0,0,0.22); vertical-align:middle; margin-right:4px;';
      h1.insertBefore(iconImg, h1.firstChild);
    }
    iconImg.src = iconUrl;
    iconImg.style.display = 'inline-block';

    document.querySelectorAll("link[rel*='icon']").forEach(link => {
      link.href = iconUrl;
    });
  } else if (iconImg) {
    iconImg.style.display = 'none';
  }
}

/* =========================================================================
   ★ 6. 로컬 file:/// 완벽 호환 오디오 플레이어 & 콘서트홀 신디사이저 ★
   ========================================================================= */
function ensurePackAudioContext() {
  if (!packAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    packAudioCtx = new AudioContextClass();

    const sr = packAudioCtx.sampleRate;
    const length = Math.floor(sr * 1.65);
    const impulse = packAudioCtx.createBuffer(2, length, sr);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (sr * 0.42));
      left[i] = (Math.random() * 2 - 1) * decay * 0.35;
      right[i] = (Math.random() * 2 - 1) * decay * 0.35;
    }
    packConvolverNode = packAudioCtx.createConvolver();
    packConvolverNode.buffer = impulse;
    packConvolverNode.connect(packAudioCtx.destination);
  }
  if (packAudioCtx.state === 'suspended') {
    packAudioCtx.resume();
  }
  return packAudioCtx;
}

function tryPlayLocalAudioElement(packFolder, soundName, playbackRate = 1.0) {
  return new Promise((resolve) => {
    if (!packFolder) { resolve(false); return; }
    const audio = new Audio(`${packFolder}/sounds/${soundName}.wav`);
    audio.volume = soundVolume;
    audio.preservesPitch = false;
    audio.mozPreservesPitch = false;
    audio.webkitPreservesPitch = false;
    audio.playbackRate = playbackRate;

    audio.oncanplaythrough = () => {
      audio.play().then(() => resolve(true)).catch(() => resolve(false));
    };
    audio.onerror = () => resolve(false);
  });
}

function playSynthesizedOrchestraSound(type, pitchMultiplier = 1.0) {
  const ctx = ensurePackAudioContext();
  if (!ctx) return;

  const pack = MEMORYON_DESIGN_PACKS[currentPackId] || MEMORYON_DESIGN_PACKS.strawberry_milk;
  const base = (pack.basePitch || 523.25) * pitchMultiplier;
  const timbre = pack.soundTimbre || 'musicbox';

  let notes = [];
  let noteStepDelay = 0.045;
  let duration = 0.5;

  if (type === 'click') {
    notes = [base * 1.5];
    duration = 0.14;
  } else if (type === 'reveal') {
    notes = [base, base * 1.25, base * 1.5];
    duration = 0.52;
  } else if (type === 'flip') {
    notes = [base * 0.75, base, base * 1.25];
    noteStepDelay = 0.035;
    duration = 0.36;
  } else if (type === 'again') {
    notes = [base * 0.5, base * 0.5946];
    duration = 0.65;
  } else if (type === 'hard') {
    notes = [base * 0.75, base * 0.8909, base];
    duration = 0.55;
  } else if (type === 'good') {
    notes = [base, base * 1.25, base * 1.5, base * 1.875];
    duration = 0.85;
  } else if (type === 'easy') {
    notes = [base, base * 1.25, base * 1.5, base * 2.0, base * 2.5];
    noteStepDelay = 0.055;
    duration = 1.15;
  }

  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const startTime = now + idx * noteStepDelay;
    const masterGain = ctx.createGain();
    const peakGain = (soundVolume * 0.28) / Math.sqrt(notes.length);

    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.linearRampToValueAtTime(peakGain, startTime + (timbre === 'orchestra' ? 0.035 : 0.008));
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    masterGain.connect(ctx.destination);
    if (packConvolverNode) {
      const wetGain = ctx.createGain();
      wetGain.gain.value = timbre === 'orchestra' ? 0.55 : 0.35;
      masterGain.connect(wetGain);
      wetGain.connect(packConvolverNode);
    }

    const harmonics = timbre === 'musicbox'
      ? [{ ratio: 1, amp: 1.0, type: 'sine' }, { ratio: 2, amp: 0.45, type: 'sine' }, { ratio: 4, amp: 0.18, type: 'triangle' }]
      : (timbre === 'orchestra'
        ? [{ ratio: 1, amp: 1.0, type: 'triangle' }, { ratio: 1.003, amp: 0.6, type: 'sawtooth' }, { ratio: 2, amp: 0.35, type: 'sine' }]
        : [{ ratio: 1, amp: 1.0, type: 'sine' }, { ratio: 2, amp: 0.35, type: 'triangle' }, { ratio: 3, amp: 0.12, type: 'sine' }]);

    harmonics.forEach(h => {
      const osc = ctx.createOscillator();
      const hGain = ctx.createGain();
      osc.type = h.type;
      osc.frequency.setValueAtTime(freq * h.ratio, startTime);
      hGain.gain.value = h.amp * (h.type === 'sawtooth' ? 0.22 : 0.6);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 4.5, startTime);

      osc.connect(filter);
      filter.connect(hGain);
      hGain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  });
}

async function playPackSound(type) {
  if (!isSoundEnabled) return;
  const pack = MEMORYON_DESIGN_PACKS[currentPackId] || MEMORYON_DESIGN_PACKS.strawberry_milk;

  let rateMult = 1.0;
  if (type === 'reveal') {
    const scaleSteps = [1.0, 1.059, 1.122, 1.189, 1.260, 1.335, 1.414, 1.498, 1.587, 1.682, 1.782, 1.888, 2.0];
    rateMult = scaleSteps[Math.min(revealComboStep, scaleSteps.length - 1)];
    revealComboStep = (revealComboStep + 1) % scaleSteps.length;
    if (revealComboResetTimer) clearTimeout(revealComboResetTimer);
    revealComboResetTimer = setTimeout(() => { revealComboStep = 0; }, 3500);
  } else if (type === 'flip') {
    revealComboStep = 0;
  }

  if (pack.folder) {
    const ok = await tryPlayLocalAudioElement(pack.folder, type, rateMult);
    if (ok) return;
  }

  playSynthesizedOrchestraSound(type, rateMult);
}

/* =========================================================================
   ★ 7. 상단 헤더 UI 자동 업그레이드 및 기존 함수 무코드(Zero-Touch) 후킹 ★
   ========================================================================= */
function setupThemePackAndFontUI() {
  const themeSel = document.getElementById('theme-skin-select');
  if (themeSel) {
    themeSel.innerHTML = `
      <optgroup label="🎀 프리미엄 에셋 & 사운드 디자인 팩">
        <option value="strawberry_milk">🍓 딸기우유 다꾸 팩 (오르골)</option>
        <option value="pastel_macaron">🍬 파스텔 마카롱 팩 (콘서트하프)</option>
        <option value="gummy_bear_jelly">🧸 곰돌이 젤리 팩 (마림바팝)</option>
        <option value="choco_cookie_cafe">🍪 초코쿠키 카페 팩 (로즈피아노)</option>
        <option value="royal_orchestra">🎻 로열 오케스트라 팩 (빈필하모닉)</option>
      </optgroup>
      <optgroup label="💻 기본 스튜디오 테마">
        <option value="modern">✨ 모던 클린 (기본)</option>
        <option value="academic">📘 클래식 수험서</option>
        <option value="hanji">📜 한지 이북 리더</option>
        <option value="dark">🌙 딥 다크 스튜디오</option>
      </optgroup>
    `;
    themeSel.onchange = (e) => applyMemoryOnDesignPack(e.target.value, true);

    if (!document.getElementById('memoryon-font-selector')) {
      const fontSel = document.createElement('select');
      fontSel.id = 'memoryon-font-selector';
      fontSel.className = 'theme-selector-pill';
      fontSel.title = '수험생 & 다꾸 인기 한글 글꼴 20종을 실시간으로 변경합니다';

      const categories = {};
      MEMORYON_FONTS_20.forEach(f => {
        if (!categories[f.category]) categories[f.category] = [];
        categories[f.category].push(f);
      });

      let fontHtml = `<option value="AUTO">🔤 글꼴: 팩 추천 자동</option>`;
      Object.keys(categories).forEach(cat => {
        fontHtml += `<optgroup label="${cat}">`;
        categories[cat].forEach(f => {
          fontHtml += `<option value="${f.id}">${f.name}</option>`;
        });
        fontHtml += `</optgroup>`;
      });
      fontSel.innerHTML = fontHtml;
      fontSel.onchange = (e) => {
        applyMemoryOnFont(e.target.value);
        playPackSound('click');
      };
      themeSel.parentNode.insertBefore(fontSel, themeSel.nextSibling);

      const soundBtn = document.createElement('button');
      soundBtn.id = 'memoryon-sound-toggle-btn';
      soundBtn.type = 'button';
      soundBtn.title = '버튼 및 가림막 오케스트라/오르골 효과음 켜기/끄기';
      const updateSoundBtnText = () => {
        soundBtn.innerHTML = isSoundEnabled ? '🔔 효과음 ON' : '🔕 효과음 OFF';
        soundBtn.style.opacity = isSoundEnabled ? '1' : '0.65';
      };
      updateSoundBtnText();
      soundBtn.onclick = () => {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem('memoryon_sound_enabled', isSoundEnabled ? '1' : '0');
        updateSoundBtnText();
        if (isSoundEnabled) playPackSound('good');
      };
      themeSel.parentNode.insertBefore(soundBtn, fontSel.nextSibling);
    }
  }

  window.applyThemeSkin = (skinName) => {
    applyMemoryOnDesignPack(skinName, false);
  };

  const origReveal = window.revealNextMask;
  if (typeof origReveal === 'function') {
    window.revealNextMask = function (...args) {
      playPackSound('reveal');
      return origReveal.apply(this, args);
    };
  }

  const origNext = window.nextCard;
  if (typeof origNext === 'function') {
    window.nextCard = function (...args) {
      playPackSound('flip');
      return origNext.apply(this, args);
    };
  }

  const origPrev = window.prevCard;
  if (typeof origPrev === 'function') {
    window.prevCard = function (...args) {
      playPackSound('flip');
      return origPrev.apply(this, args);
    };
  }

  const origGrade = window.gradeCard;
  if (typeof origGrade === 'function') {
    window.gradeCard = async function (rating, ...args) {
      const soundMap = { 0: 'again', 1: 'hard', 2: 'good', 3: 'easy' };
      playPackSound(soundMap[rating] || 'good');
      return origGrade.apply(this, [rating, ...args]);
    };
  }

  document.addEventListener('click', (e) => {
    const maskedTarget = e.target.closest('.red-hl, .cloze-box, .para-mask, .cell-mask, .img-mask');
    if (maskedTarget) {
      playPackSound('reveal');
      return;
    }
    const btnTarget = e.target.closest('button, .btn-seg, .flag-dot-btn, .star-btn');
    if (btnTarget && !btnTarget.classList.contains('rate-btn')) {
      const oc = btnTarget.getAttribute('onclick') || '';
      if (!oc.includes('revealNextMask') && !oc.includes('nextCard') && !oc.includes('prevCard')) {
        playPackSound('click');
      }
    }
  }, true);
}

window.addEventListener('load', () => {
  setTimeout(() => {
    const savedSound = localStorage.getItem('memoryon_sound_enabled');
    if (savedSound !== null) isSoundEnabled = savedSound === '1';

    currentFontId = localStorage.getItem('memoryon_selected_font') || 'AUTO';
    const savedPack = localStorage.getItem('memoryon_active_pack')
      || localStorage.getItem('firepe_theme_skin')
      || 'strawberry_milk';

    setupThemePackAndFontUI();
    applyMemoryOnDesignPack(MEMORYON_DESIGN_PACKS[savedPack] ? savedPack : 'strawberry_milk', false);
  }, 60);
});
