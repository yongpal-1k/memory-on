/* =========================================================================
   메모리온 (MemoryOn) — 핵심 암기 엔진 & MS Natural 아나운서 TTS & 직접추가 에디터 (app-core.js)
   ========================================================================= */

const DB_NAME = 'FirePE_Anki_LargeDB_v4_2';
const STORE_NAME = 'subnotes';
let db = null;
let cards = [];
let filteredCards = [];
let currentCardId = null;
let currentMaskMode = 'red_and_cloze';
let isMaskEditMode = false;
let isDirectContentEditMode = false;
let savedSelectionRange = null;
let memoTimeout = null;
let currentFontScale = 1.0;

// ★ 6색 컬러 플래그 기본 정의 (사용자 커스텀 라벨 지원) ★
const DEFAULT_FLAG_META = {
  1: { color: '#ef4444', icon: '🔴', name: '빨강 (시험직전 최우선)' },
  2: { color: '#f97316', icon: '🟠', name: '주황 (자주 틀리는 함정)' },
  3: { color: '#eab308', icon: '🟡', name: '노랑 (수식·계산·그래프)' },
  4: { color: '#10b981', icon: '🟢', name: '초록 (두문자 집중암기)' },
  5: { color: '#3b82f6', icon: '🔵', name: '파랑 (기출 빈출 핵심)' },
  6: { color: '#8b5cf6', icon: '🟣', name: '보라 (보충·개정 확인)' }
};
let flagLabels = {};

// 플래그/카드 관리 브라우저 창 상태
let browserCategoryFilter = 'ALL';
let browserSelectedIds = new Set();

// 커스텀 집중 학습(Filtered Deck) 세션 상태
let customSessionIds = null;
let customSessionTitle = '';

// 직전 난이도 평가 취소(Undo)용 스냅샷
let lastGradeBackup = null;
let undoToastTimer = null;

// 타이머
let timerSeconds = 600;
let timerInitialSeconds = 600;
let timerInterval = null;

// 스마트 TTS 상태 변수
let isTtsPlaying = false;
let isTtsPaused = false;
let ttsPlayMode = 'single'; // 'single' | 'repeat_one' | 'continuous' | 'loop_all'
let ttsQueue = [];
let ttsCurrentIdx = 0;
let ttsTransitionTimer = null;
let ttsWatchdogTimer = null;
let wakeLockSentinel = null;

// 직접 추가 에디터 상태 변수
let directAddMode = 'basic';
let directPreviewMaskMode = 'red_and_cloze';
let lastFocusedEditorTextarea = null;
let directAttachedImages = {};
let directEditingCardId = null;

const DEFAULT_AMPERE_HTML = `
  <div class="section-heading">1. 개념도</div>
  <div class="img-block-wrapper">
    <div class="img-mask">
      <svg viewBox="0 0 280 150" width="250" height="135" style="background:#f9f6f0; border-radius:6px;">
        <line x1="110" y1="15" x2="110" y2="115" stroke="#222" stroke-width="2.5"/>
        <polyline points="103,102 110,117 117,102" fill="none" stroke="#222" stroke-width="2.5"/>
        <path d="M 80 75 C 55 55, 75 25, 115 25 C 155 25, 175 60, 145 85" fill="none" stroke="#222" stroke-width="2"/>
        <polyline points="155,83 143,87 147,74" fill="none" stroke="#222" stroke-width="2"/>
        <text x="90" y="138" font-size="16" font-weight="bold" fill="#111">전류</text>
        <text x="175" y="60" font-size="16" font-weight="bold" fill="#111">자계</text>
      </svg>
    </div>
  </div>
  <div class="section-heading">2. 특성</div>
  <div class="para-mask">(1) 전류가 <span class="red-hl">나사</span>의 <span class="red-hl">진행</span> 방향 일때 자계는 나사의 회전 방향</div>
  <div class="para-mask">(2) 전류가 나사의 <span class="red-hl">회전</span> 방향 일때 자계는 나사의 진행 방향</div>
  <div class="section-heading">3. 적용</div>
  <div class="para-mask">(1) <span class="red-hl">모</span>터</div>
  <div class="para-mask">(2) <span class="red-hl">변</span>압기</div>
  <div class="para-mask">(3) <span class="red-hl">클</span>램프 온 메터</div>
  <table class="hwp-table">
    <tbody>
      <tr><td style="width:18%;">1</td><td><span class="cloze-box">전류</span></td></tr>
      <tr><td>2</td><td><span class="cloze-box">자계</span></td></tr>
      <tr><td>3</td><td><span class="cloze-box">나사</span></td></tr>
      <tr><td>4</td><td><span class="cloze-box">진행</span></td></tr>
      <tr><td>5</td><td><span class="cloze-box">회전</span></td></tr>
      <tr><td>6</td><td><span class="cloze-box">모변클</span></td></tr>
    </tbody>
  </table>
`;

function loadCustomBrandAndFlagLabels() {
  const savedMain = localStorage.getItem('memoryon_brand_main');
  const savedSub = localStorage.getItem('memoryon_brand_sub');
  if (savedMain) document.getElementById('app-main-title').innerText = savedMain;
  if (savedSub) document.getElementById('app-sub-title').innerText = savedSub;

  try {
    const raw = localStorage.getItem('memoryon_flag_labels');
    const parsed = raw ? JSON.parse(raw) : {};
    for (let k = 1; k <= 6; k++) {
      flagLabels[k] = parsed[k] || DEFAULT_FLAG_META[k].name;
    }
  } catch (_) {
    for (let k = 1; k <= 6; k++) flagLabels[k] = DEFAULT_FLAG_META[k].name;
  }
  refreshFlagFilterDropdownLabels();
}

function customizeAppBrandTitle() {
  const curMain = document.getElementById('app-main-title').innerText;
  const curSub = document.getElementById('app-sub-title').innerText;
  const nextMain = prompt('앱 메인 이름을 입력하세요 (기본: 메모리온):', curMain);
  if (nextMain === null) return;
  const nextSub = prompt('서브 타이틀(또는 나만의 합격 다짐)을 입력하세요:', curSub);
  if (nextSub === null) return;

  const finalMain = nextMain.trim() || '메모리온';
  const finalSub = nextSub.trim() || '스마트 암기 스튜디오';
  document.getElementById('app-main-title').innerText = finalMain;
  document.getElementById('app-sub-title').innerText = finalSub;
  localStorage.setItem('memoryon_brand_main', finalMain);
  localStorage.setItem('memoryon_brand_sub', finalSub);
}

function refreshFlagFilterDropdownLabels() {
  const sel = document.getElementById('flag-filter');
  if (!sel) return;
  const curVal = sel.value || 'ALL';
  sel.innerHTML = `
    <option value="ALL">🚩 전체 플래그</option>
    <option value="ANY_FLAG">🚩 플래그 있음 (전체)</option>
    <option value="1">${DEFAULT_FLAG_META[1].icon} ${flagLabels[1]}</option>
    <option value="2">${DEFAULT_FLAG_META[2].icon} ${flagLabels[2]}</option>
    <option value="3">${DEFAULT_FLAG_META[3].icon} ${flagLabels[3]}</option>
    <option value="4">${DEFAULT_FLAG_META[4].icon} ${flagLabels[4]}</option>
    <option value="5">${DEFAULT_FLAG_META[5].icon} ${flagLabels[5]}</option>
    <option value="6">${DEFAULT_FLAG_META[6].icon} ${flagLabels[6]}</option>
    <option value="LEECH">🩸 취약(Leech) 문제만</option>
  `;
  sel.value = curVal;
}

function editFlagCustomLabel(flagNum, event) {
  if (event) event.stopPropagation();
  const cur = flagLabels[flagNum] || DEFAULT_FLAG_META[flagNum].name;
  const next = prompt(`${DEFAULT_FLAG_META[flagNum].icon} ${flagNum}번 플래그의 이름을 무엇으로 지정하시겠습니까?`, cur);
  if (!next || !next.trim()) return;
  flagLabels[flagNum] = next.trim();
  localStorage.setItem('memoryon_flag_labels', JSON.stringify(flagLabels));
  refreshFlagFilterDropdownLabels();
  renderFlagBrowserView();
  if (currentCardId) renderSelectedCard(currentCardId, { preserveTtsState: true });
}

function normalizeTitleKey(title) {
  return (title || '').replace(/\s+/g, '').replace(/[^가-힣a-zA-Z0-9]/g, '').toLowerCase();
}

function sanitizeSubjectName(rawName) {
  if (!rawName) return '';
  let s = String(rawName)
    .replace(/\.hwpx$/i, '')
    .replace(/^[■□◆◇●○▶▷★☆\s_-]+/, '')
    .replace(/^\d{1,4}[\s._-]+/, '')
    .replace(/[\s._-]+\d{1,4}$/, '')
    .trim();
  if (/^써(?=[가-힣]{2,})/.test(s)) {
    s = s.replace(/^써\s*/, '');
  }
  return s.trim();
}

function isCardBuryActiveToday(card) {
  return card.buriedDate === getTodayDateString();
}

function isCardLeech(card) {
  return (card.lapses || 0) >= 4;
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };
    req.onerror = (e) => reject(e.target.error);
  });
}

function dbGetAll() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

function dbSaveBatch(cardList) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const item of cardList) store.put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function dbDeleteOne(cardId) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(cardId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function dbClearAll() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function migrateCardCompatibility() {
  let modified = [];
  for (const c of cards) {
    let changed = false;
    if (!c.html && c.bodyHtml) {
      c.html = c.bodyHtml;
      changed = true;
    }
    if (typeof c.flag !== 'number') { c.flag = 0; changed = true; }
    if (typeof c.lapses !== 'number') { c.lapses = 0; changed = true; }
    if (typeof c.suspended !== 'boolean') { c.suspended = false; changed = true; }
    const orig = c.subject || '미분류';
    const cleaned = sanitizeSubjectName(orig);
    if (cleaned && cleaned !== orig && cleaned.length >= 2) {
      c.subject = cleaned;
      changed = true;
    }
    if (changed) modified.push(c);
  }
  if (modified.length > 0) {
    await dbSaveBatch(modified);
  }
}

function applyThemeSkin(skinName) {
  document.body.classList.remove('theme-modern', 'theme-academic', 'theme-hanji', 'theme-dark', 'dark-mode', 'bluelight-mode');
  if (skinName === 'academic') {
    document.body.classList.add('theme-academic');
  } else if (skinName === 'hanji') {
    document.body.classList.add('theme-hanji', 'bluelight-mode');
  } else if (skinName === 'dark') {
    document.body.classList.add('theme-dark', 'dark-mode');
  } else {
    document.body.classList.add('theme-modern');
  }
  localStorage.setItem('firepe_theme_skin', skinName);
  const sel = document.getElementById('theme-skin-select');
  if (sel && sel.value !== skinName) sel.value = skinName;
}

window.onload = async () => {
  loadCustomBrandAndFlagLabels();

  const savedSkin = localStorage.getItem('firepe_theme_skin')
    || (localStorage.getItem('firepe_dark_mode') === '1' ? 'dark' : (localStorage.getItem('firepe_bluelight_paper') === '1' ? 'hanji' : 'modern'));
  applyThemeSkin(savedSkin);

  const savedBlLevel = localStorage.getItem('firepe_bluelight_level') || '0';
  setBluelightLevel(savedBlLevel);
  const sl = document.getElementById('bluelight-slider');
  if (sl) sl.value = savedBlLevel;

  localStorage.removeItem('firepe_tts_voice');
  initGoogleAnnouncerSystem();
  if (typeof setupStudioCropCanvas === 'function') setupStudioCropCanvas();
  if (typeof loadBatch8PhotosSample === 'function') loadBatch8PhotosSample();

  await openDatabase();
  cards = await dbGetAll();

  if (cards.length === 0) {
    const sample = {
      id: '0000-sample',
      order: 1,
      subject: '소방전기',
      title: '■ 앙페르(암페어)의 오른나사 법칙 (개조식 가림막 샘플)',
      html: DEFAULT_AMPERE_HTML,
      interval: 0,
      repetitions: 0,
      lapses: 0,
      flag: 1,
      suspended: false,
      buriedDate: '',
      dueDate: 0,
      starred: false,
      memo: ''
    };
    await dbSaveBatch([sample]);
    cards = [sample];
  } else {
    await migrateCardCompatibility();
  }

  cards.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  populateSubjectDropdown();
  applyFilter();
  setupSelectionAndContextMenu();
  injectDirectUpgradeButtons();
};

/* =========================================================================
   ★ MS Edge Natural 신경망 아나운서(선희·인준) & 구글 고품질 TTS 통합 엔진 ★
   ========================================================================= */
const GOOGLE_ANNOUNCER_PRESETS = {
  google_std:    { pitch: 1.00, baseRate: 1.03, role: 'female_std', label: '아나운서 A (MS 선희 Natural / 표준 뉴스 브리핑)' },
  google_calm:   { pitch: 0.96, baseRate: 1.00, role: 'male_calm',  label: '아나운서 B (MS 인준 Natural / 차분한 남성 강사)' },
  google_bright: { pitch: 1.06, baseRate: 1.06, role: 'bright',     label: '아나운서 C (선희·현수 Natural / 또렷한 딕션)' },
  google_fast:   { pitch: 1.00, baseRate: 1.24, role: 'fast',       label: '아나운서 D (시험 직전 속독 브리핑)' }
};

// ★ 기본 내장 발음 교정 사전 (초기값) ★
const DEFAULT_PRONUNCIATION_RULES = [
  { from: 'CO2', to: '이산화탄소' },
  { from: 'CO', to: '일산화탄소' },
  { from: 'H2O', to: '물' },
  { from: 'N2', to: '질소' },
  { from: 'IG-100', to: '아이지 백' },
  { from: 'IG-541', to: '아이지 오사일' },
  { from: 'HCFC', to: '에이치씨에프씨' },
  { from: 'HFC', to: '에이치에프씨' },
  { from: 'NFPC', to: '엔에프피씨' },
  { from: 'NFTC', to: '엔에프티씨' },
  { from: 'PTC', to: '피티씨' },
  { from: 'NTC', to: '엔티씨' },
  { from: 'CTR', to: '씨티알' }
];

// ★ 번호(1, 2, 3...)를 '한 번/두 번'이 아닌 '일번/이번/삼번' 한자어 발음으로 변환 ★
function numberToSinoKoreanOrdinal(numInput) {
  const n = parseInt(numInput, 10);
  if (isNaN(n) || n <= 0 || n >= 100) return `${numInput}번`;
  const digits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  let sino = '';
  if (tens === 1) sino += '십';
  else if (tens > 1) sino += digits[tens] + '십';
  sino += digits[ones];
  return `${sino}번`;
}

// 원문자(①~⑮) 한자어 번호 매핑 테이블
const CIRCLED_NUM_TO_SINO = {
  '①': '일번, ', '②': '이번, ', '③': '삼번, ', '④': '사번, ', '⑤': '오번, ',
  '⑥': '육번, ', '⑦': '칠번, ', '⑧': '팔번, ', '⑨': '구번, ', '⑩': '십번, ',
  '⑪': '십일번, ', '⑫': '십이번, ', '⑬': '십삼번, ', '⑭': '십사번, ', '⑮': '십오번, '
};

function getCustomPronunciationRules() {
  try {
    const saved = localStorage.getItem('memoryon_tts_pron_rules');
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return DEFAULT_PRONUNCIATION_RULES.slice();
}

function saveCustomPronunciationRules(rules) {
  localStorage.setItem('memoryon_tts_pron_rules', JSON.stringify(rules));
}

function getTtsSkipParenthesesOption() {
  return localStorage.getItem('memoryon_tts_skip_paren') === '1';
}

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
    } catch (_) {}
  }
}

function releaseWakeLock() {
  if (wakeLockSentinel) {
    try { wakeLockSentinel.release(); } catch (_) {}
    wakeLockSentinel = null;
  }
}

function populateDirectVoiceDropdown() {
  if (!('speechSynthesis' in window)) return;
  const directSel = document.getElementById('tts-direct-voice-select');
  if (!directSel) return;

  const voices = window.speechSynthesis.getVoices() || [];
  const koVoices = voices.filter(v =>
    (v.lang && /ko|kor/i.test(v.lang)) || /korean|한국어|선희|인준|sunhi|injoon/i.test(v.name)
  );

  koVoices.sort((a, b) => {
    const aNat = /natural|online/i.test(a.name) ? 1 : 0;
    const bNat = /natural|online/i.test(b.name) ? 1 : 0;
    return bNat - aNat;
  });

  const savedDirect = localStorage.getItem('memoryon_direct_voice_name') || 'AUTO';

  let html = `
    <option value="AUTO">✨ 톤(A~D)에 맞춰 자동 변경</option>
    <option value="SYSTEM_DEFAULT">📱 기기 기본 성우 고정</option>
  `;

  koVoices.forEach((v, idx) => {
    const isSunHi = /sunhi/i.test(v.name);
    const isInJoon = /injoon/i.test(v.name);
    let shortLabel = `🔊 한국어 성우 ${idx + 1}`;
    if (isSunHi) shortLabel = '👩‍💼 선희 (MS 여성)';
    else if (isInJoon) shortLabel = '👨‍💼 인준 (MS 남성)';
    else if (/kob|kod/i.test(v.name)) shortLabel = `👨‍🏫 모바일/구글 성우 ${idx + 1} (타입B)`;
    else if (/ism|koc/i.test(v.name)) shortLabel = `👩‍🏫 모바일/구글 성우 ${idx + 1} (타입A)`;
    else shortLabel = `🔊 성우 ${idx + 1} (${v.name.slice(0, 14)})`;

    html += `<option value="${v.name}">${shortLabel}</option>`;
  });

  directSel.innerHTML = html;
  if (savedDirect === 'SYSTEM_DEFAULT' || savedDirect === 'AUTO' || koVoices.some(v => v.name === savedDirect)) {
    directSel.value = savedDirect;
  } else {
    directSel.value = 'AUTO';
  }
}

function initGoogleAnnouncerSystem() {
  if (!('speechSynthesis' in window)) return;

  const savedAnnouncer = localStorage.getItem('firepe_announcer_preset') || 'google_std';
  const savedRate = localStorage.getItem('firepe_tts_rate_mult') || '1.0';
  const savedPlayMode = localStorage.getItem('firepe_tts_play_mode') || 'single';
  const savedAutoReveal = localStorage.getItem('firepe_tts_auto_reveal');

  const annSel = document.getElementById('tts-announcer-select');
  const rateSel = document.getElementById('tts-rate-select');
  const modeSel = document.getElementById('tts-play-mode');
  const revChk = document.getElementById('tts-auto-reveal-chk');

  if (annSel && GOOGLE_ANNOUNCER_PRESETS[savedAnnouncer]) annSel.value = savedAnnouncer;
  if (rateSel) rateSel.value = savedRate;
  if (modeSel) {
    modeSel.value = savedPlayMode;
    ttsPlayMode = savedPlayMode;
    updateDockTtsModeButtonLabel();
  }
  if (revChk && savedAutoReveal !== null) {
    revChk.checked = savedAutoReveal === '1';
  }

  populateDirectVoiceDropdown();
  setTimeout(populateDirectVoiceDropdown, 300);
  setTimeout(populateDirectVoiceDropdown, 1000);
  window.speechSynthesis.onvoiceschanged = () => {
    populateDirectVoiceDropdown();
  };
}

function saveTtsPreferences() {
  const annSel = document.getElementById('tts-announcer-select');
  const directSel = document.getElementById('tts-direct-voice-select');
  const rateSel = document.getElementById('tts-rate-select');
  const revChk = document.getElementById('tts-auto-reveal-chk');
  if (annSel) localStorage.setItem('firepe_announcer_preset', annSel.value);
  if (directSel) localStorage.setItem('memoryon_direct_voice_name', directSel.value);
  if (rateSel) localStorage.setItem('firepe_tts_rate_mult', rateSel.value);
  if (revChk) localStorage.setItem('firepe_tts_auto_reveal', revChk.checked ? '1' : '0');
}

function onTtsModeChange(newMode) {
  ttsPlayMode = newMode || 'single';
  localStorage.setItem('firepe_tts_play_mode', ttsPlayMode);
  const modeSel = document.getElementById('tts-play-mode');
  if (modeSel && modeSel.value !== ttsPlayMode) modeSel.value = ttsPlayMode;
  updateDockTtsModeButtonLabel();
  updateTtsUiControls();
}

function cycleTtsPlayMode() {
  const order = ['single', 'repeat_one', 'continuous', 'loop_all'];
  const nextIdx = (order.indexOf(ttsPlayMode) + 1) % order.length;
  onTtsModeChange(order[nextIdx]);
}

function cycleTtsModeQuick() {
  cycleTtsPlayMode();
}

function updateDockTtsModeButtonLabel() {
  const dockModeBtn = document.getElementById('dock-tts-mode-btn');
  if (!dockModeBtn) return;
  const map = {
    single: '🔊 1회',
    repeat_one: '🔂 1문제반복',
    continuous: '▶️ 연속듣기',
    loop_all: '🔁 전구간순환'
  };
  dockModeBtn.innerText = map[ttsPlayMode] || '🔊 1회';
}

function pickBestGoogleKoreanVoice(presetVal) {
  const allVoices = window.speechSynthesis.getVoices() || [];
  const koVoices = allVoices.filter(v =>
    (v.lang && /ko|kor/i.test(v.lang)) || /korean|한국어|선희|인준|sunhi|injoon/i.test(v.name)
  );

  const directSel = document.getElementById('tts-direct-voice-select');
  const directName = directSel ? directSel.value : (localStorage.getItem('memoryon_direct_voice_name') || 'AUTO');

  if (directName === 'SYSTEM_DEFAULT') {
    return null;
  }

  if (directName && directName !== 'AUTO') {
    const exactVoice = koVoices.find(v => v.name === directName);
    if (exactVoice) return exactVoice;
  }

  if (koVoices.length === 0) return null;

  const sunHiVoice = koVoices.find(v => /sunhi/i.test(v.name) && /natural|online/i.test(v.name))
    || koVoices.find(v => /sunhi/i.test(v.name));
  const inJoonVoice = koVoices.find(v => /injoon/i.test(v.name) && /natural|online/i.test(v.name))
    || koVoices.find(v => /injoon/i.test(v.name));
  const hyunsuVoice = koVoices.find(v => /hyunsu/i.test(v.name));

  if (sunHiVoice || inJoonVoice) {
    if (presetVal === 'google_calm' && inJoonVoice) return inJoonVoice;
    if (presetVal === 'google_bright' && (hyunsuVoice || sunHiVoice)) return hyunsuVoice || sunHiVoice;
    return sunHiVoice || inJoonVoice;
  }

  if (koVoices.length > 1) {
    if (presetVal === 'google_calm') return koVoices[1 % koVoices.length];
    if (presetVal === 'google_bright') return koVoices[2 % koVoices.length];
    if (presetVal === 'google_fast') return koVoices[3 % koVoices.length];
  }

  return koVoices[0] || null;
}

function refineTextForKoreanSpeech(raw) {
  if (!raw) return '';
  let text = String(raw);

  // 0. [96/10] 같은 기출 회차/배점 표기 제거
  text = text.replace(/\[\s*\d+\s*\/\s*\d+\s*\]/g, ' ');

  // 1. 괄호 안 부연설명 건너뛰기 옵션이 켜져 있으면 (1), (2), (가) 등 번호를 제외한 일반 괄호 내용 생략
  if (getTtsSkipParenthesesOption()) {
    text = text.replace(/\((?!\d+\)|[가-하]\))[^)]+\)/g, ' ');
  }

  // 2. ★ 핵심 해결: (1), 1), 1., ①, '1번' 등을 '한 번/두 번'이 아닌 '일번, 이번, 삼번...'으로 변환 ★
  text = text.replace(/(^|\s)\((\d{1,2})\)(?=\s|$|[가-힣A-Za-z])/g, (_, pre, d) => `${pre}${numberToSinoKoreanOrdinal(d)}, `);
  text = text.replace(/^(\d{1,2})\s*[).]\s*/g, (_, d) => `${numberToSinoKoreanOrdinal(d)}, `);
  text = text.replace(/\((\d{1,2})\)/g, (_, d) => `${numberToSinoKoreanOrdinal(d)}, `);
  text = text.replace(/\b(\d{1,2})\s*번/g, (_, d) => numberToSinoKoreanOrdinal(d));

  // 원문자 ① ~ ⑮ 변환
  text = text.replace(/[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮]/g, (m) => CIRCLED_NUM_TO_SINO[m] || m);

  // 3. 사용자 정의 발음 교정 사전 적용 (긴 단어부터 우선 매칭)
  const customRules = getCustomPronunciationRules()
    .filter(r => r && r.from && r.from.trim())
    .sort((a, b) => b.from.length - a.from.length);

  for (const rule of customRules) {
    const escaped = rule.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (/^[A-Za-z0-9_-]+$/.test(rule.from)) {
      const reg = new RegExp(`\\b${escaped}\\b`, 'gi');
      text = text.replace(reg, ` ${rule.to} `);
    } else {
      const reg = new RegExp(escaped, 'gi');
      text = text.replace(reg, rule.to);
    }
  }

  // 4. 특수기호 및 공학 수식 발음 자연스럽게 치환
  return text
    .replace(/[■□◆◇●○▶▷★☆·]/g, ' ')
    .replace(/10\^\(-(\d+)\)|10⁻³⁴/g, ' 10의 마이너스 $1승 ')
    .replace(/10\^(\d+)|10⁸/g, ' 10의 $1승 ')
    .replace(/dΦ\s*\/\s*dt/gi, ' 디 파이 오버 디 티 ')
    .replace(/ΔR\s*=\s*K\s*ΔT/gi, ' 델타 알은, 케이 델타 티 ')
    .replace(/R_?1\s*[·*]\s*R_?3\s*=\s*R_?2\s*[·*]\s*R_?4/gi, ' 알 원 곱하기 알 쓰리는, 알 투 곱하기 알 포 ')
    .replace(/Q_?1\s*[·*]\s*Q_?2/gi, ' 큐 원 큐 투 ')
    .replace(/m_?1\s*[·*]\s*m_?2/gi, ' 엠 원 엠 투 ')
    .replace(/r\^2|r²/g, ' 알 제곱 ')
    .replace(/mv\^2|mv²/g, ' 엠 브이 제곱 ')
    .replace(/hf_?0|hf₀/g, ' 에이치 에프 제로 ')
    .replace(/f_?0|f₀/g, ' 에프 제로 ')
    .replace(/E_?k/g, ' 이 케이 ')
    .replace(/4πε/g, ' 사 파이 입실론 ')
    .replace(/4πμ/g, ' 사 파이 뮤 ')
    .replace(/㎛|μm/g, ' 마이크로미터 ')
    .replace(/->|→/g, '에서 ')
    .replace(/<->|↔/g, ' 및 ')
    .replace(/×/g, ' 곱하기 ')
    .replace(/±/g, ' 플러스마이너스 ')
    .replace(/Δ/g, ' 델타 ')
    .replace(/Φ/g, ' 파이 ')
    .replace(/λ/g, ' 람다 ')
    .replace(/Ω/g, ' 옴 ')
    .replace(/\s+/g, ' ')
    .trim();
}

function clearTtsHighlight() {
  document.querySelectorAll('.tts-reading-now').forEach(el => el.classList.remove('tts-reading-now'));
}

function updateTtsUiControls() {
  const btn = document.getElementById('tts-btn');
  const stopBtn = document.getElementById('tts-stop-btn');
  const statusEl = document.getElementById('tts-status-indicator');
  const dockBtn = document.getElementById('dock-tts-btn');

  const list = filteredCards.length > 0 ? filteredCards : cards;
  const curIdx = list.findIndex(c => c.id === currentCardId);
  const posTxt = curIdx >= 0 ? `(${curIdx + 1}/${list.length})` : '';

  if (!isTtsPlaying) {
    if (btn) btn.innerText = '▶ 듣기 시작';
    if (stopBtn) stopBtn.style.display = 'none';
    if (statusEl) {
      statusEl.className = 'tts-status-pill';
      statusEl.innerText = '대기 중';
    }
    if (dockBtn) {
      dockBtn.innerText = '🎧 듣기';
      dockBtn.classList.remove('dock-tts-active');
    }
  } else if (isTtsPaused) {
    if (btn) btn.innerText = '▶ 이어듣기';
    if (stopBtn) stopBtn.style.display = 'inline-flex';
    if (statusEl) {
      statusEl.className = 'tts-status-pill';
      statusEl.innerText = `⏸ 일시정지됨 ${posTxt}`;
    }
    if (dockBtn) {
      dockBtn.innerText = '▶ 재개';
      dockBtn.classList.remove('dock-tts-active');
    }
  } else {
    if (btn) btn.innerText = '⏸ 일시정지';
    if (stopBtn) stopBtn.style.display = 'inline-flex';
    const modeLabels = {
      single: '🔊 1회 낭독 중',
      repeat_one: '🔂 1문제 무한반복 중',
      continuous: '▶️ 연속 낭독 중',
      loop_all: '🔁 전구간 순환 중'
    };
    if (statusEl) {
      statusEl.className = 'tts-status-pill playing';
      statusEl.innerText = `${modeLabels[ttsPlayMode] || '낭독 중'} ${posTxt}`;
    }
    if (dockBtn) {
      dockBtn.innerText = '⏸ 일시정지';
      dockBtn.classList.add('dock-tts-active');
    }
  }
}

function stopTtsPlayback() {
  isTtsPlaying = false;
  isTtsPaused = false;
  ttsQueue = [];
  ttsCurrentIdx = 0;
  if (ttsTransitionTimer) { clearTimeout(ttsTransitionTimer); ttsTransitionTimer = null; }
  if (ttsWatchdogTimer) { clearTimeout(ttsWatchdogTimer); ttsWatchdogTimer = null; }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  releaseWakeLock();
  clearTtsHighlight();
  updateTtsUiControls();
}

// 본문 DOM에서 기본 낭독 큐(자동 추출본)를 생성하는 헬퍼 함수
function buildDefaultTtsQueueFromDom(card) {
  const queue = [];
  const titleEl = document.getElementById('study-title');
  const bodyEl = document.getElementById('study-body');
  if (!bodyEl || !card) return queue;

  const qBox = bodyEl.querySelector('.anki-question-box');
  const rawTitleClean = (card.title || '').replace(/^■\s*/, '').trim();

  if (qBox) {
    const qBoxClone = qBox.cloneNode(true);
    qBoxClone.querySelectorAll('.anki-question-badge, .tts-ignore').forEach(n => n.remove());
    const qPlain = (qBoxClone.innerText || '').trim();
    const firstLineOfQ = (qPlain.split('\n')[0] || '').trim();

    if (rawTitleClean && firstLineOfQ && !firstLineOfQ.startsWith(rawTitleClean) && !rawTitleClean.startsWith(firstLineOfQ)) {
      const cleanTitle = refineTextForKoreanSpeech(rawTitleClean);
      if (cleanTitle) queue.push({ text: `${cleanTitle}.`, origText: rawTitleClean, el: titleEl });
    }

    const qLines = Array.from(qBox.querySelectorAll('.question-line'));
    if (qLines.length > 0) {
      qLines.forEach((lineEl, idx) => {
        const rawLine = (lineEl.innerText || '').trim();
        const txt = refineTextForKoreanSpeech(rawLine);
        if (txt) {
          const prefix = idx === 0 ? '문제. ' : '';
          queue.push({ text: `${prefix}${txt}.`, origText: rawLine, el: lineEl });
        }
      });
    } else if (qPlain) {
      const refinedQ = refineTextForKoreanSpeech(qPlain);
      if (refinedQ) queue.push({ text: `문제. ${refinedQ}.`, origText: qPlain, el: qBox });
    }
  } else {
    const cleanTitle = refineTextForKoreanSpeech(rawTitleClean);
    if (cleanTitle) {
      queue.push({ text: `${cleanTitle}.`, origText: rawTitleClean, el: titleEl });
    }
  }

  let answerAnnounced = false;

  const processNode = (node) => {
    if (!node || node.nodeType !== 1) return;

    if (
      node.classList.contains('img-tools-bar') ||
      node.classList.contains('sketch-pad-wrap') ||
      node.classList.contains('img-block-wrapper') ||
      node.classList.contains('anki-question-box') ||
      node.classList.contains('anki-question-badge') ||
      node.classList.contains('anki-answer-divider') ||
      node.classList.contains('tts-ignore')
    ) {
      return;
    }

    if (node.tagName === 'TABLE') {
      const rows = Array.from(node.querySelectorAll('tr'));
      for (const tr of rows) {
        const cells = Array.from(tr.querySelectorAll('th, td'));
        if (cells.length === 0) continue;

        // ★ 하단 암기표의 번호(1, 2, 3...)도 '1번(한번)'이 아닌 '일번, 이번, 삼번'으로 낭독 ★
        if (cells.length === 2 && /^\d+$/.test(cells[0].innerText.trim())) {
          const numSino = numberToSinoKoreanOrdinal(cells[0].innerText.trim());
          const rawVal = cells[1].innerText.trim();
          const val = refineTextForKoreanSpeech(rawVal);
          if (val) queue.push({ text: `${numSino}, ${val}.`, origText: `${cells[0].innerText.trim()} | ${rawVal}`, el: cells[1] });
        } else if (cells.length === 4 && /^\d+$/.test(cells[0].innerText.trim())) {
          const n1Sino = numberToSinoKoreanOrdinal(cells[0].innerText.trim());
          const rawV1 = cells[1].innerText.trim();
          const v1 = refineTextForKoreanSpeech(rawV1);
          if (v1) queue.push({ text: `${n1Sino}, ${v1}.`, origText: `${cells[0].innerText.trim()} | ${rawV1}`, el: cells[1] });

          const rawN2 = cells[2].innerText.trim();
          const rawV2 = cells[3].innerText.trim();
          const v2 = refineTextForKoreanSpeech(rawV2);
          if (rawN2 && v2) {
            const n2Sino = /^\d+$/.test(rawN2) ? numberToSinoKoreanOrdinal(rawN2) : rawN2;
            queue.push({ text: `${n2Sino}, ${v2}.`, origText: `${rawN2} | ${rawV2}`, el: cells[3] });
          }
        } else {
          const rawRow = cells.map(c => c.innerText.trim()).filter(Boolean).join(', ');
          const rowTxt = refineTextForKoreanSpeech(rawRow);
          if (rowTxt) queue.push({ text: rowTxt + '.', origText: rawRow, el: tr });
        }
      }
      return;
    }

    if (node.classList.contains('section-heading') || node.classList.contains('para-mask') || ['P', 'LI', 'H3', 'H4'].includes(node.tagName)) {
      const rawTxt = (node.innerText || '').trim();
      if (!rawTxt || /^\d+\.\s*개념도$/.test(rawTxt)) return;
      const refined = refineTextForKoreanSpeech(rawTxt);
      if (refined) {
        if (qBox && !answerAnnounced) {
          answerAnnounced = true;
          queue.push({ text: `정답. ${refined}.`, origText: rawTxt, el: node });
        } else {
          queue.push({ text: `${refined}.`, origText: rawTxt, el: node });
        }
      }
      return;
    }

    const elementChildren = Array.from(node.children);
    if (elementChildren.length > 0) {
      elementChildren.forEach(processNode);
    } else {
      const rawTxt = (node.innerText || '').trim();
      if (rawTxt && !/^\d+\.\s*개념도$/.test(rawTxt)) {
        const refined = refineTextForKoreanSpeech(rawTxt);
        if (refined) {
          if (qBox && !answerAnnounced) {
            answerAnnounced = true;
            queue.push({ text: `정답. ${refined}.`, origText: rawTxt, el: node });
          } else {
            queue.push({ text: `${refined}.`, origText: rawTxt, el: node });
          }
        }
      }
    }
  };

  Array.from(bodyEl.children).forEach(processNode);
  return queue;
}

// 실제 TTS 재생 시 호출되는 큐 생성 함수 (카드별 커스텀 편집 대본이 있으면 우선 적용!)
function buildTtsQueueFromCurrentCard(card) {
  const defaultQueue = buildDefaultTtsQueueFromDom(card);
  if (!card || !Array.isArray(card.customTtsScript) || card.customTtsScript.length === 0) {
    return defaultQueue;
  }

  const finalQueue = [];
  card.customTtsScript.forEach((item, idx) => {
    if (!item || item.enabled === false) return;
    const spoken = refineTextForKoreanSpeech(item.text || '');
    if (!spoken) return;
    const matchedEl = defaultQueue[idx] ? defaultQueue[idx].el : null;
    finalQueue.push({
      text: spoken.endsWith('.') ? spoken : `${spoken}.`,
      el: matchedEl
    });
  });
  return finalQueue;
}

function autoRevealElementForTts(el) {
  if (!el) return;
  const autoRevChk = document.getElementById('tts-auto-reveal-chk');
  if (!autoRevChk || !autoRevChk.checked) return;

  if (el.classList.contains('masked')) {
    el.classList.remove('masked');
  }
  el.querySelectorAll('.masked').forEach(m => m.classList.remove('masked'));
  const parentMasked = el.closest('.masked');
  if (parentMasked) parentMasked.classList.remove('masked');
}

function handleCardTtsCompleted() {
  clearTtsHighlight();
  if (!isTtsPlaying) return;

  if (ttsPlayMode === 'single') {
    stopTtsPlayback();
    return;
  }

  if (ttsPlayMode === 'repeat_one') {
    ttsTransitionTimer = setTimeout(() => {
      if (!isTtsPlaying) return;
      const autoRevChk = document.getElementById('tts-auto-reveal-chk');
      if (autoRevChk && autoRevChk.checked && !isMaskEditMode) {
        setMaskMode(currentMaskMode);
      }
      ttsCurrentIdx = 0;
      playNextTtsChunk();
    }, 1250);
    return;
  }

  const list = filteredCards.length > 0 ? filteredCards : cards;
  if (list.length === 0) {
    stopTtsPlayback();
    return;
  }
  const curIdx = list.findIndex(c => c.id === currentCardId);
  const isLastCard = curIdx >= list.length - 1;

  if (isLastCard && ttsPlayMode === 'continuous') {
    const doneUtter = new SpeechSynthesisUtterance('마지막 문제까지 연속 낭독이 완료되었습니다.');
    doneUtter.lang = 'ko-KR';
    const voice = pickBestGoogleKoreanVoice(document.getElementById('tts-announcer-select')?.value);
    if (voice) doneUtter.voice = voice;
    doneUtter.onend = () => stopTtsPlayback();
    doneUtter.onerror = () => stopTtsPlayback();
    window.speechSynthesis.speak(doneUtter);
    return;
  }

  const nextIdx = isLastCard ? 0 : (curIdx + 1);
  const nextCardObj = list[nextIdx];

  ttsTransitionTimer = setTimeout(() => {
    if (!isTtsPlaying) return;
    renderSelectedCard(nextCardObj.id, { preserveTtsState: true });
    ttsQueue = buildTtsQueueFromCurrentCard(nextCardObj);
    ttsCurrentIdx = 0;
    updateTtsUiControls();
    if (ttsQueue.length === 0) {
      handleCardTtsCompleted();
    } else {
      playNextTtsChunk();
    }
  }, 1300);
}

function playNextTtsChunk() {
  if (!isTtsPlaying || isTtsPaused) return;
  if (ttsCurrentIdx >= ttsQueue.length) {
    handleCardTtsCompleted();
    return;
  }

  const item = ttsQueue[ttsCurrentIdx];
  clearTtsHighlight();
  if (item.el) {
    autoRevealElementForTts(item.el);
    item.el.classList.add('tts-reading-now');
    item.el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  const annSel = document.getElementById('tts-announcer-select');
  const rateSel = document.getElementById('tts-rate-select');
  const presetKey = annSel ? annSel.value : 'google_std';
  const userRateMult = parseFloat(rateSel ? rateSel.value : '1.0') || 1.0;

  const preset = GOOGLE_ANNOUNCER_PRESETS[presetKey] || GOOGLE_ANNOUNCER_PRESETS.google_std;

  const utter = new SpeechSynthesisUtterance(item.text);
  utter.lang = 'ko-KR';

  const selectedVoice = pickBestGoogleKoreanVoice(presetKey);
  if (selectedVoice) {
    utter.voice = selectedVoice;
  }

  const isNaturalVoice = selectedVoice && /natural|online/i.test(selectedVoice.name);
  utter.pitch = isNaturalVoice ? (presetKey === 'google_bright' ? 1.03 : 1.0) : preset.pitch;
  utter.rate = Math.min(2.0, Math.max(0.7, +(preset.baseRate * userRateMult).toFixed(2)));

  let chunkFinished = false;
  const advanceNext = () => {
    if (chunkFinished) return;
    chunkFinished = true;
    if (ttsWatchdogTimer) { clearTimeout(ttsWatchdogTimer); ttsWatchdogTimer = null; }
    if (!isTtsPlaying || isTtsPaused) return;
    ttsCurrentIdx++;
    ttsTransitionTimer = setTimeout(() => {
      if (isTtsPlaying && !isTtsPaused) playNextTtsChunk();
    }, 120);
  };

  utter.onend = advanceNext;
  utter.onerror = advanceNext;

  const estimatedMs = Math.max(4000, item.text.length * 260);
  if (ttsWatchdogTimer) clearTimeout(ttsWatchdogTimer);
  ttsWatchdogTimer = setTimeout(() => {
    if (isTtsPlaying && !isTtsPaused && !window.speechSynthesis.speaking) {
      advanceNext();
    }
  }, estimatedMs);

  window.speechSynthesis.speak(utter);
}

function speakCurrentCard() {
  if (!('speechSynthesis' in window)) {
    alert('이 브라우저는 음성 읽어주기(TTS)를 지원하지 않습니다.');
    return;
  }

  if (isTtsPlaying) {
    if (isTtsPaused) {
      isTtsPaused = false;
      updateTtsUiControls();
      playNextTtsChunk();
    } else {
      isTtsPaused = true;
      if (ttsTransitionTimer) { clearTimeout(ttsTransitionTimer); ttsTransitionTimer = null; }
      if (ttsWatchdogTimer) { clearTimeout(ttsWatchdogTimer); ttsWatchdogTimer = null; }
      window.speechSynthesis.cancel();
      updateTtsUiControls();
    }
    return;
  }

  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;

  ttsQueue = buildTtsQueueFromCurrentCard(card);
  if (ttsQueue.length === 0) return;

  isTtsPlaying = true;
  isTtsPaused = false;
  ttsCurrentIdx = 0;
  requestWakeLock();
  updateTtsUiControls();
  window.speechSynthesis.cancel();
  playNextTtsChunk();
}

function startContinuousFromFirstCard() {
  const list = filteredCards.length > 0 ? filteredCards : cards;
  if (list.length === 0) return;

  stopTtsPlayback();
  if (ttsPlayMode === 'single' || ttsPlayMode === 'repeat_one') {
    onTtsModeChange('continuous');
  }
  renderSelectedCard(list[0].id, { preserveTtsState: true });
  speakCurrentCard();
}

function testTtsAnnouncer() {
  if (!('speechSynthesis' in window)) return;
  stopTtsPlayback();

  const annSel = document.getElementById('tts-announcer-select');
  const rateSel = document.getElementById('tts-rate-select');
  const presetKey = annSel ? annSel.value : 'google_std';
  const userRateMult = parseFloat(rateSel ? rateSel.value : '1.0') || 1.0;
  const preset = GOOGLE_ANNOUNCER_PRESETS[presetKey] || GOOGLE_ANNOUNCER_PRESETS.google_std;

  const selectedVoice = pickBestGoogleKoreanVoice(presetKey);
  const voiceLabel = selectedVoice ? selectedVoice.name : '기본 한국어 음성';
  const sampleMsg = `안녕하십니까. 메모리온 스마트 암기 스튜디오 음성 테스트입니다. 현재 연결된 성우는 ${voiceLabel.includes('SunHi') ? '마이크로소프트 선희 아나운서' : (voiceLabel.includes('InJoon') ? '마이크로소프트 인준 아나운서' : '한국어 아나운서')}입니다. 일번, 이번, 삼번 발음이 정확하게 교정되었습니다.`;

  const utter = new SpeechSynthesisUtterance(sampleMsg);
  utter.lang = 'ko-KR';
  if (selectedVoice) utter.voice = selectedVoice;

  const isNaturalVoice = selectedVoice && /natural|online/i.test(selectedVoice.name);
  utter.pitch = isNaturalVoice ? (presetKey === 'google_bright' ? 1.03 : 1.0) : preset.pitch;
  utter.rate = Math.min(2.0, Math.max(0.7, +(preset.baseRate * userRateMult).toFixed(2)));
  window.speechSynthesis.speak(utter);
}

/* =========================================================================
   ★ 6색 컬러 플래그 & 정통 Anki 카드 관리 브라우저 ★
   ========================================================================= */
async function setCardFlag(flagNum) {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;
  card.flag = (card.flag === flagNum) ? 0 : flagNum;
  await dbSaveBatch([card]);
  updateStatsBar();
  renderSelectedCard(card.id, { preserveTtsState: true });
}

async function buryCurrentCardToday() {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;
  card.buriedDate = getTodayDateString();
  await dbSaveBatch([card]);
  applyFilter();
}

async function toggleSuspendCurrentCard() {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;
  card.suspended = !card.suspended;
  await dbSaveBatch([card]);
  if (card.suspended) {
    alert(`⏸ [${card.title}] 카드가 복습 큐에서 보류(제외)되었습니다.\n상단 [🚩 플래그/카드 관리] 창에서 언제든 다시 복구할 수 있습니다.`);
  }
  applyFilter();
}

function quickFilterByStatus(type) {
  const dueEl = document.getElementById('filter-due');
  const starEl = document.getElementById('filter-star');
  if (type === 'due') {
    dueEl.checked = !dueEl.checked;
  } else if (type === 'star') {
    starEl.checked = !starEl.checked;
  } else if (type === 'new') {
    openFlagsTabWithFilter('NEW');
    return;
  }
  applyFilter();
}

function openFlagsTabWithFilter(cat) {
  browserCategoryFilter = cat;
  switchTab('flags');
}

function getCardsMatchingBrowserFilter() {
  const now = Date.now();
  const q = (document.getElementById('browser-search-input')?.value || '').trim().toLowerCase();
  const sortMode = document.getElementById('browser-sort-select')?.value || 'order';

  let list = cards.filter(c => {
    if (browserCategoryFilter === 'ANY_FLAG') {
      if (!c.flag || c.flag === 0) return false;
    } else if (browserCategoryFilter.startsWith('FLAG_')) {
      const fNum = parseInt(browserCategoryFilter.replace('FLAG_', ''), 10);
      if ((c.flag || 0) !== fNum) return false;
    } else if (browserCategoryFilter === 'STARRED') {
      if (!c.starred) return false;
    } else if (browserCategoryFilter === 'LEECH') {
      if (!isCardLeech(c)) return false;
    } else if (browserCategoryFilter === 'DUE') {
      const isDue = !c.suspended && ((c.repetitions > 0 && (!c.dueDate || c.dueDate <= now)));
      if (!isDue) return false;
    } else if (browserCategoryFilter === 'NEW') {
      if (c.suspended || (c.repetitions && c.repetitions > 0)) return false;
    } else if (browserCategoryFilter === 'SUSPENDED') {
      if (!c.suspended && !isCardBuryActiveToday(c)) return false;
    }

    if (q) {
      const plain = (c.html || '').replace(/<[^>]*>/g, ' ').toLowerCase();
      const title = (c.title || '').toLowerCase();
      const subj = (c.subject || '').toLowerCase();
      const memo = (c.memo || '').toLowerCase();
      if (!title.includes(q) && !plain.includes(q) && !subj.includes(q) && !memo.includes(q)) return false;
    }
    return true;
  });

  list.sort((a, b) => {
    if (sortMode === 'flag') return (b.flag || 0) - (a.flag || 0);
    if (sortMode === 'lapses') return (b.lapses || 0) - (a.lapses || 0);
    if (sortMode === 'interval_asc') return (a.interval || 0) - (b.interval || 0);
    if (sortMode === 'interval_desc') return (b.interval || 0) - (a.interval || 0);
    return (a.order ?? 0) - (b.order ?? 0);
  });

  return list;
}

function renderFlagBrowserView() {
  const now = Date.now();
  const total = cards.length || 1;
  let cntNew = 0, cntLearn = 0, cntYoung = 0, cntMature = 0, cntSusp = 0;

  const flagCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  let anyFlagCount = 0, starCount = 0, leechCount = 0, dueCount = 0;

  for (const c of cards) {
    if (c.flag && flagCounts[c.flag] !== undefined) {
      flagCounts[c.flag]++;
      anyFlagCount++;
    }
    if (c.starred) starCount++;
    if (isCardLeech(c)) leechCount++;
    if (!c.suspended && c.repetitions > 0 && (!c.dueDate || c.dueDate <= now)) dueCount++;

    if (c.suspended || isCardBuryActiveToday(c)) {
      cntSusp++;
    } else if (!c.repetitions || c.repetitions === 0) {
      cntNew++;
    } else if ((c.interval || 0) < 7) {
      cntLearn++;
    } else if ((c.interval || 0) < 21) {
      cntYoung++;
    } else {
      cntMature++;
    }
  }

  document.getElementById('mat-total-cnt').innerText = cards.length;
  document.getElementById('mat-mastery-pct').innerText = `장기기억 달성률: ${Math.round((cntMature / total) * 100)}%`;
  document.getElementById('mat-bar-new').style.width = `${(cntNew / total) * 100}%`;
  document.getElementById('mat-bar-learn').style.width = `${(cntLearn / total) * 100}%`;
  document.getElementById('mat-bar-young').style.width = `${(cntYoung / total) * 100}%`;
  document.getElementById('mat-bar-mature').style.width = `${(cntMature / total) * 100}%`;
  document.getElementById('mat-bar-suspended').style.width = `${(cntSusp / total) * 100}%`;

  document.getElementById('mat-leg-new').innerText = cntNew;
  document.getElementById('mat-leg-learn').innerText = cntLearn;
  document.getElementById('mat-leg-young').innerText = cntYoung;
  document.getElementById('mat-leg-mature').innerText = cntMature;
  document.getElementById('mat-leg-susp').innerText = cntSusp;

  const sb = document.getElementById('browser-sidebar');
  const itemHtml = (key, label, count, extraBtn = '') => `
    <div class="sidebar-nav-item ${browserCategoryFilter === key ? 'active' : ''}" onclick="selectBrowserCategory('${key}')">
      <span style="display:flex; align-items:center; gap:5px;">${label}</span>
      <span style="display:flex; align-items:center; gap:4px;">
        ${extraBtn}
        <span class="sidebar-count-pill">${count}</span>
      </span>
    </div>
  `;

  let sbContent = `<div class="sidebar-group-title">📂 전체 및 상태별</div>`;
  sbContent += itemHtml('ALL', '📚 전체 카드', cards.length);
  sbContent += itemHtml('ANY_FLAG', '🚩 모든 플래그 카드', anyFlagCount);
  sbContent += itemHtml('STARRED', '⭐ 별표 표시됨', starCount);
  sbContent += itemHtml('LEECH', '🩸 취약(Leech) 문제', leechCount);
  sbContent += itemHtml('DUE', '⏰ 오늘 복습 대상', dueCount);
  sbContent += itemHtml('NEW', '🆕 신규 미학습', cntNew);
  sbContent += itemHtml('SUSPENDED', '⏸ 보류 / 오늘숨김', cntSusp);

  sbContent += `<div class="sidebar-group-title" style="margin-top:14px;">🎨 6색 컬러 플래그 (이름변경 ✏️)</div>`;
  for (let f = 1; f <= 6; f++) {
    const editBtn = `<button type="button" class="btn btn-outline" style="padding:1px 5px; font-size:0.68rem;" onclick="editFlagCustomLabel(${f}, event)" title="플래그 이름 변경">✏️</button>`;
    sbContent += itemHtml(`FLAG_${f}`, `${DEFAULT_FLAG_META[f].icon} ${flagLabels[f]}`, flagCounts[f], editBtn);
  }
  sb.innerHTML = sbContent;

  injectDirectUpgradeButtons();

  const matched = getCardsMatchingBrowserFilter();
  const tbody = document.getElementById('browser-table-body');
  if (matched.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:32px; color:var(--sub-text);">해당 조건에 맞는 카드가 없습니다.</td></tr>`;
    return;
  }

  tbody.innerHTML = matched.map(c => {
    const checked = browserSelectedIds.has(c.id) ? 'checked' : '';
    const isSusp = c.suspended || isCardBuryActiveToday(c);
    const statusTxt = c.suspended
      ? '⏸ 보류됨'
      : (isCardBuryActiveToday(c) ? '🌙 오늘숨김' : (!c.repetitions ? '🆕 신규' : `${c.interval}일 (${c.repetitions}회)`));

    const leechTag = isCardLeech(c)
      ? `<span class="leech-badge">🩸 ${c.lapses}회</span>`
      : `<span style="color:var(--sub-text);">${c.lapses || 0}회</span>`;

    const flagSelectHtml = `
      <select onchange="changeSingleCardFlagFromBrowser('${c.id}', this.value)" style="padding:4px 6px; border-radius:6px; border:1px solid var(--card-border); background:var(--surface-bg); color:var(--text); font-weight:700; font-size:0.78rem; width:100%;">
        <option value="0" ${!c.flag ? 'selected' : ''}>🏳️ 없음</option>
        <option value="1" ${c.flag === 1 ? 'selected' : ''}>🔴 빨강</option>
        <option value="2" ${c.flag === 2 ? 'selected' : ''}>🟠 주황</option>
        <option value="3" ${c.flag === 3 ? 'selected' : ''}>🟡 노랑</option>
        <option value="4" ${c.flag === 4 ? 'selected' : ''}>🟢 초록</option>
        <option value="5" ${c.flag === 5 ? 'selected' : ''}>🔵 파랑</option>
        <option value="6" ${c.flag === 6 ? 'selected' : ''}>🟣 보라</option>
      </select>
    `;

    return `
      <tr class="${isSusp ? 'row-suspended' : ''}">
        <td style="text-align:center;">
          <input type="checkbox" ${checked} onchange="toggleBrowserRowCheck('${c.id}', this.checked)">
        </td>
        <td>${flagSelectHtml}</td>
        <td><span class="subject-badge" style="font-size:0.73rem; padding:2px 7px;">${c.subject || '미분류'}</span></td>
        <td>
          <div style="font-weight:800; cursor:pointer; color:var(--text);" onclick="jumpToStudyCardFromBrowser('${c.id}')">
            ${c.starred ? '⭐ ' : ''}${c.title}
          </div>
          ${c.memo ? `<div style="font-size:0.74rem; color:var(--sub-text); margin-top:2px;">📝 ${c.memo.slice(0, 55)}</div>` : ''}
        </td>
        <td style="text-align:center; font-weight:700; font-size:0.78rem;">${statusTxt}</td>
        <td style="text-align:center;">${leechTag}</td>
        <td style="text-align:center; white-space:nowrap;">
          <button class="btn btn-outline" style="padding:3px 7px; font-size:0.74rem;" onclick="jumpToStudyCardFromBrowser('${c.id}')" title="학습 화면에서 열기">📖</button>
          <button class="btn btn-outline row-edit-btn" style="padding:3px 7px; font-size:0.74rem; margin-left:3px;" onclick="event.stopPropagation(); editCardInDirectEditor('${c.id}')" title="에디터로 이 문제/정답 수정하기">✏️</button>
          <button class="btn btn-outline row-del-btn" style="padding:3px 7px; font-size:0.74rem; margin-left:3px; color:#e11d48;" onclick="event.stopPropagation(); deleteCardDirectlyFromBrowser('${c.id}')" title="이 카드 즉시 삭제">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

function selectBrowserCategory(cat) {
  browserCategoryFilter = cat;
  browserSelectedIds.clear();
  const chkAll = document.getElementById('browser-check-all');
  if (chkAll) chkAll.checked = false;
  renderFlagBrowserView();
}

function toggleBrowserRowCheck(cardId, checked) {
  if (checked) browserSelectedIds.add(cardId);
  else browserSelectedIds.delete(cardId);
}

function toggleBrowserSelectAll(checked) {
  const matched = getCardsMatchingBrowserFilter();
  if (checked) matched.forEach(c => browserSelectedIds.add(c.id));
  else browserSelectedIds.clear();
  renderFlagBrowserView();
}

async function changeSingleCardFlagFromBrowser(cardId, val) {
  const card = cards.find(c => c.id === cardId);
  if (!card) return;
  card.flag = parseInt(val, 10) || 0;
  await dbSaveBatch([card]);
  updateStatsBar();
  renderFlagBrowserView();
}

function getTargetCardsForBrowserBatch() {
  if (browserSelectedIds.size > 0) {
    return cards.filter(c => browserSelectedIds.has(c.id));
  }
  return getCardsMatchingBrowserFilter();
}

async function batchSetFlagFromBrowser(val) {
  if (val === '') return;
  const targets = getTargetCardsForBrowserBatch();
  if (targets.length === 0) return;
  const fNum = parseInt(val, 10) || 0;
  targets.forEach(c => { c.flag = fNum; });
  await dbSaveBatch(targets);
  updateStatsBar();
  renderFlagBrowserView();
}

async function batchToggleSuspendFromBrowser() {
  const targets = getTargetCardsForBrowserBatch();
  if (targets.length === 0) return;
  const shouldSuspend = targets.some(c => !c.suspended);
  targets.forEach(c => {
    c.suspended = shouldSuspend;
    c.buriedDate = '';
  });
  await dbSaveBatch(targets);
  applyFilter();
  renderFlagBrowserView();
}

async function batchResetProgressFromBrowser() {
  const targets = getTargetCardsForBrowserBatch();
  if (targets.length === 0) return;
  if (!confirm(`선택된 ${targets.length}개 단원의 복습 간격과 취약(오답) 횟수를 신규 상태로 초기화하시겠습니까?`)) return;
  targets.forEach(c => {
    c.interval = 0;
    c.repetitions = 0;
    c.lapses = 0;
    c.dueDate = 0;
    c.suspended = false;
    c.buriedDate = '';
  });
  await dbSaveBatch(targets);
  applyFilter();
  renderFlagBrowserView();
}

function jumpToStudyCardFromBrowser(cardId) {
  const card = cards.find(c => c.id === cardId);
  if (!card) return;
  if (card.suspended) card.suspended = false;
  card.buriedDate = '';
  customSessionIds = null;
  document.getElementById('custom-session-banner')?.classList.remove('active');
  document.getElementById('subject-filter').value = 'ALL';
  document.getElementById('flag-filter').value = 'ALL';
  switchTab('study');
  applyFilter();
  renderSelectedCard(cardId);
}

function startCustomStudyFromBrowser(autoStartContinuousTts) {
  const targets = getTargetCardsForBrowserBatch();
  if (targets.length === 0) {
    alert('집중 학습할 카드가 없습니다.');
    return;
  }
  customSessionIds = new Set(targets.map(c => c.id));
  customSessionTitle = `🎯 집중 벼락치기 세션 진행 중 (선택된 ${targets.length}개 문제)`;
  document.getElementById('custom-session-title').innerText = customSessionTitle;
  document.getElementById('custom-session-banner').classList.add('active');

  switchTab('study');
  applyFilter();
  if (filteredCards.length > 0) {
    renderSelectedCard(filteredCards[0].id);
    if (autoStartContinuousTts) {
      onTtsModeChange('continuous');
      speakCurrentCard();
    }
  }
}

function exitCustomStudySession() {
  customSessionIds = null;
  document.getElementById('custom-session-banner').classList.remove('active');
  applyFilter();
}

/* =========================================================================
   블루라이트 / 과목관리 / 학습 / 가림막 제어 로직
   ========================================================================= */
function toggleEyeCareBar() {
  document.getElementById('eyecare-bar').classList.toggle('show');
}

function toggleBluelightPaper(checked) {
  if (checked) {
    applyThemeSkin('hanji');
    localStorage.setItem('firepe_bluelight_paper', '1');
  } else {
    applyThemeSkin('modern');
    localStorage.setItem('firepe_bluelight_paper', '0');
  }
}

function setBluelightLevel(val) {
  const num = parseInt(val, 10) || 0;
  const opacity = (num / 100).toFixed(2);
  document.documentElement.style.setProperty('--bluelight-opacity', opacity);
  const lbl = document.getElementById('bluelight-val-label');
  if (lbl) lbl.innerText = `${num}%`;
  localStorage.setItem('firepe_bluelight_level', String(num));
}

function changeFontScale(delta) {
  if (delta === 0) currentFontScale = 1.0;
  else currentFontScale = Math.min(1.45, Math.max(0.8, +(currentFontScale + delta).toFixed(2)));
  document.documentElement.style.setProperty('--content-scale', currentFontScale);
  document.getElementById('scale-label').innerText = `${Math.round(currentFontScale * 100)}%`;
}

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function getTodayStudyCount() {
  const savedDate = localStorage.getItem('firepe_study_date');
  const today = getTodayDateString();
  if (savedDate !== today) {
    localStorage.setItem('firepe_study_date', today);
    localStorage.setItem('firepe_study_count', '0');
    return 0;
  }
  return parseInt(localStorage.getItem('firepe_study_count') || '0', 10);
}

function incrementTodayStudyCount(delta = 1) {
  const next = Math.max(0, getTodayStudyCount() + delta);
  localStorage.setItem('firepe_study_date', getTodayDateString());
  localStorage.setItem('firepe_study_count', String(next));
  updateStatsBar();
}

function populateSubjectDropdown() {
  const sel = document.getElementById('subject-filter');
  if (!sel) return;
  const prevVal = sel.value || 'ALL';
  const subjectCounts = {};
  for (const c of cards) {
    const subj = (c.subject || '미분류').trim();
    subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;
  }
  const subjects = Object.keys(subjectCounts).sort();
  let html = `<option value="ALL">📂 전체 과목 (${cards.length})</option>`;
  for (const s of subjects) {
    html += `<option value="${s}">📗 ${s} (${subjectCounts[s]})</option>`;
  }
  sel.innerHTML = html;
  if (subjects.includes(prevVal)) sel.value = prevVal;
  else sel.value = 'ALL';
}

async function renameOrMergeSubjectFolder() {
  const sel = document.getElementById('subject-filter');
  let targetOldSubj = sel ? sel.value : 'ALL';

  if (targetOldSubj === 'ALL') {
    const curCard = cards.find(c => c.id === currentCardId);
    targetOldSubj = curCard ? (curCard.subject || '미분류') : '미분류';
  }

  const nextSubj = prompt(
    `현재 [${targetOldSubj}] 과목 폴더에 속한 모든 단원의 과목명을 무엇으로 변경(또는 병합)하시겠습니까?\n(기존 과목명과 똑같이 입력하면 두 폴더가 하나로 합쳐집니다!)`,
    sanitizeSubjectName(targetOldSubj) || '소방전기'
  );

  if (!nextSubj || !nextSubj.trim()) return;
  const cleanNext = nextSubj.trim();

  const updated = [];
  for (const c of cards) {
    if ((c.subject || '미분류') === targetOldSubj) {
      c.subject = cleanNext;
      updated.push(c);
    }
  }

  if (updated.length > 0) {
    await dbSaveBatch(updated);
    populateSubjectDropdown();
    document.getElementById('subject-filter').value = cleanNext;
    applyFilter();
    alert(`✔ [${targetOldSubj}] 폴더의 ${updated.length}개 단원이 [${cleanNext}] 과목으로 깔끔하게 통합되었습니다!`);
  }
}

async function editCurrentCardSubject() {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;
  const nextSubj = prompt('이 단원의 과목명을 입력하세요:', card.subject || '소방전기');
  if (nextSubj === null) return;
  card.subject = nextSubj.trim() || '미분류';
  await dbSaveBatch([card]);
  populateSubjectDropdown();
  applyFilter();
}

async function toggleDirectContentEdit() {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;

  const titleEl = document.getElementById('study-title');
  const bodyEl = document.getElementById('study-body');
  const btn = document.getElementById('content-edit-toggle-btn');

  if (!isDirectContentEditMode) {
    if (isMaskEditMode) toggleMaskEditMode();
    stopTtsPlayback();
    isDirectContentEditMode = true;
    setMaskMode('none');
    titleEl.contentEditable = 'true';
    bodyEl.contentEditable = 'true';
    titleEl.classList.add('editable-active');
    bodyEl.classList.add('editable-active');
    btn.innerText = '💾 수정 저장';
    btn.style.background = '#2563eb';
    btn.style.color = '#fff';
    bodyEl.focus();
  } else {
    isDirectContentEditMode = false;
    titleEl.contentEditable = 'false';
    bodyEl.contentEditable = 'false';
    titleEl.classList.remove('editable-active');
    bodyEl.classList.remove('editable-active');
    btn.innerText = '✏️ 내용수정';
    btn.style.background = '';
    btn.style.color = '';

    const newTitle = titleEl.innerText.trim();
    if (newTitle) card.title = newTitle.startsWith('■') ? newTitle : `■ ${newTitle}`;
    await persistCurrentCardBodyHtml();
    applyFilter();
  }
}

async function deleteCurrentCard() {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;
  if (!confirm(`정말로 [${card.title}] 카드를 삭제하시겠습니까?`)) return;

  stopTtsPlayback();
  await dbDeleteOne(card.id);
  cards = cards.filter(c => c.id !== card.id);
  populateSubjectDropdown();
  applyFilter();
}

function updateStatsBar() {
  const now = Date.now();
  const activeCards = cards.filter(c => !c.suspended && !isCardBuryActiveToday(c));
  const total = activeCards.length;
  const dueCount = activeCards.filter(c => c.repetitions > 0 && (!c.dueDate || c.dueDate <= now)).length;
  const newCount = activeCards.filter(c => !c.repetitions || c.repetitions === 0).length;
  const starCount = cards.filter(c => c.starred).length;
  const flaggedCount = cards.filter(c => c.flag && c.flag > 0).length;
  const leechCount = cards.filter(c => isCardLeech(c)).length;
  const todayDone = getTodayStudyCount();

  document.getElementById('stat-total').innerText = total;
  document.getElementById('stat-due').innerText = dueCount;
  document.getElementById('stat-new').innerText = newCount;
  document.getElementById('stat-star').innerText = starCount;
  document.getElementById('stat-flagged').innerText = flaggedCount;
  document.getElementById('stat-leech').innerText = leechCount;
  document.getElementById('card-count').innerText = total;
  document.getElementById('stat-today').innerText = todayDone;
  const pct = Math.min(100, Math.round((todayDone / 30) * 100));
  document.getElementById('goal-bar-fill').style.width = `${pct}%`;
}

function applyFilter() {
  updateStatsBar();
  const subjEl = document.getElementById('subject-filter');
  const flagEl = document.getElementById('flag-filter');
  const searchEl = document.getElementById('search-input');
  const dueEl = document.getElementById('filter-due');
  const starEl = document.getElementById('filter-star');

  const selectedSubj = subjEl ? subjEl.value : 'ALL';
  const selectedFlag = flagEl ? flagEl.value : 'ALL';
  const query = (searchEl ? searchEl.value : '').trim().toLowerCase();
  const dueOnly = dueEl ? dueEl.checked : false;
  const starOnly = starEl ? starEl.checked : false;
  const now = Date.now();

  filteredCards = cards.filter(c => {
    if (customSessionIds) {
      if (!customSessionIds.has(c.id)) return false;
    } else {
      if (c.suspended || isCardBuryActiveToday(c)) return false;
    }

    const cardSubj = (c.subject || '미분류').trim();
    if (selectedSubj !== 'ALL' && cardSubj !== selectedSubj) return false;

    if (selectedFlag === 'ANY_FLAG') {
      if (!c.flag || c.flag === 0) return false;
    } else if (selectedFlag === 'LEECH') {
      if (!isCardLeech(c)) return false;
    } else if (['1', '2', '3', '4', '5', '6'].includes(selectedFlag)) {
      if ((c.flag || 0) !== parseInt(selectedFlag, 10)) return false;
    }

    if (starOnly && !c.starred) return false;
    if (dueOnly) {
      const isDue = (!c.repetitions || c.repetitions === 0) || (!c.dueDate || c.dueDate <= now);
      if (!isDue) return false;
    }
    if (query) {
      const rawHtml = c.html || c.bodyHtml || '';
      const plainBody = rawHtml.replace(/<[^>]*>/g, ' ').toLowerCase();
      const memoTxt = (c.memo || '').toLowerCase();
      const titleTxt = (c.title || '').toLowerCase();
      const subjTxt = cardSubj.toLowerCase();
      if (!titleTxt.includes(query) && !plainBody.includes(query) && !memoTxt.includes(query) && !subjTxt.includes(query)) {
        return false;
      }
    }
    return true;
  });

  const sel = document.getElementById('card-selector');
  if (filteredCards.length === 0) {
    sel.innerHTML = `<option value="">조건에 맞는 카드가 없습니다 (0개)</option>`;
    document.getElementById('study-title').innerText = '🔍 조건에 맞는 노트가 없습니다.';
    document.getElementById('study-body').innerHTML = '<div style="padding:24px; color:var(--sub-text);">과목 선택, 플래그 필터, 검색어, 또는 보류 상태를 확인해 보세요.</div>';
    return;
  }

  sel.innerHTML = filteredCards.map((c, idx) => {
    const starMark = c.starred ? '⭐' : '';
    const flagMark = (c.flag && DEFAULT_FLAG_META[c.flag]) ? DEFAULT_FLAG_META[c.flag].icon : '';
    const subjMark = c.subject ? `[${c.subject}] ` : '';
    return `<option value="${c.id}">[${idx + 1}/${filteredCards.length}] ${flagMark}${starMark}${subjMark}${c.title}</option>`;
  }).join('');

  const targetId = filteredCards.some(c => c.id === currentCardId) ? currentCardId : filteredCards[0].id;
  renderSelectedCard(targetId);
}

function shuffleFilteredCards() {
  if (filteredCards.length <= 1) return;
  for (let i = filteredCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filteredCards[i], filteredCards[j]] = [filteredCards[j], filteredCards[i]];
  }
  const sel = document.getElementById('card-selector');
  sel.innerHTML = filteredCards.map((c, idx) => {
    const starMark = c.starred ? '⭐' : '';
    const flagMark = (c.flag && DEFAULT_FLAG_META[c.flag]) ? DEFAULT_FLAG_META[c.flag].icon : '';
    const subjMark = c.subject ? `[${c.subject}] ` : '';
    return `<option value="${c.id}">[${idx + 1}/${filteredCards.length}] ${flagMark}${starMark}${subjMark}${c.title}</option>`;
  }).join('');
  renderSelectedCard(filteredCards[0].id);
}

function getNextIntervals(prevInterval) {
  const p = prevInterval || 0;
  return {
    again: 0,
    hard: p === 0 ? 1 : Math.max(1, Math.round(p * 1.2)),
    good: p === 0 ? 3 : Math.max(2, Math.round(p * 2.0)),
    easy: p === 0 ? 7 : Math.max(4, Math.round(p * 2.8))
  };
}

function renderSelectedCard(id, options = {}) {
  if (!options.preserveTtsState) {
    stopTtsPlayback();
  }
  hideSelectionMenu();
  const list = filteredCards.length > 0 ? filteredCards : cards;
  const card = list.find(c => c.id === id) || list[0];
  if (!card) return;

  currentCardId = card.id;
  const curIndex = list.findIndex(c => c.id === card.id);
  const progressPct = list.length > 0 ? Math.round(((curIndex + 1) / list.length) * 100) : 0;
  const progBar = document.getElementById('card-progress-bar');
  if (progBar) progBar.style.width = `${progressPct}%`;

  document.getElementById('card-selector').value = card.id;
  document.getElementById('study-title').innerText = card.title;
  document.getElementById('study-subject-badge').innerText = `📗 ${card.subject || '미분류'}`;

  for (let f = 0; f <= 6; f++) {
    const dot = document.getElementById(`flag-dot-${f}`);
    if (dot) dot.classList.toggle('active', (card.flag || 0) === f);
  }
  const flagBadgeEl = document.getElementById('study-flag-badge');
  const mainCardEl = document.getElementById('main-subnote-card');
  if (card.flag && DEFAULT_FLAG_META[card.flag]) {
    const meta = DEFAULT_FLAG_META[card.flag];
    flagBadgeEl.style.display = 'inline-flex';
    flagBadgeEl.className = 'flag-badge-pill';
    flagBadgeEl.style.background = meta.color;
    flagBadgeEl.innerText = `🚩 ${flagLabels[card.flag] || meta.name}`;
    mainCardEl.style.borderTop = `4px solid ${meta.color}`;
  } else {
    flagBadgeEl.style.display = 'none';
    mainCardEl.style.borderTop = '';
  }

  const leechEl = document.getElementById('study-leech-badge');
  if (leechEl) {
    if (isCardLeech(card)) {
      leechEl.style.display = 'inline-flex';
      leechEl.innerText = `🩸 취약(${card.lapses}회 오답)`;
    } else {
      leechEl.style.display = 'none';
    }
  }

  const starBtn = document.getElementById('star-btn');
  if (card.starred) {
    starBtn.innerText = '★';
    starBtn.classList.add('starred');
  } else {
    starBtn.innerText = '☆';
    starBtn.classList.remove('starred');
  }

  const nextIv = getNextIntervals(card.interval);
  document.getElementById('rate-label-0').innerText = '즉시 재복습';
  document.getElementById('rate-label-1').innerText = `${nextIv.hard}일 뒤 복습`;
  document.getElementById('rate-label-2').innerText = `${nextIv.good}일 뒤 복습`;
  document.getElementById('rate-label-3').innerText = `${nextIv.easy}일 뒤 복습`;

  if (card.repetitions) {
    const dueStr = card.dueDate ? new Date(card.dueDate).toLocaleDateString('ko-KR') : '-';
    document.getElementById('study-meta').innerText = `누적 ${card.repetitions}회 (간격: ${card.interval}일 / 예정: ${dueStr})`;
  } else {
    document.getElementById('study-meta').innerText = '🆕 신규 학습 카드';
  }

  document.getElementById('card-memo').value = card.memo || '';
  document.getElementById('memo-save-status').innerText = '';

  const body = document.getElementById('study-body');
  body.innerHTML = card.html || card.bodyHtml || '<div class="para-mask">(내용 없음)</div>';

  bindBodyInteractions();
  if (!isMaskEditMode && !isDirectContentEditMode) {
    setMaskMode(currentMaskMode);
  }
  updateTtsUiControls();
  updateTtsScriptButtonBadge(card);
}

function openImageZoomFromBtn(btnEl) {
  const wrapper = btnEl.closest('.img-block-wrapper');
  if (!wrapper) return;
  const img = wrapper.querySelector('.img-mask img');
  if (img && img.src) {
    document.getElementById('img-zoom-target').src = img.src;
    document.getElementById('img-zoom-modal').classList.add('open');
  } else {
    alert('확대할 비트맵 도면 이미지가 없습니다.');
  }
}

function closeImageZoom() {
  document.getElementById('img-zoom-modal').classList.remove('open');
}

function toggleSketchPad(btnEl) {
  const wrapper = btnEl.closest('.img-block-wrapper');
  if (!wrapper) return;
  const pad = wrapper.querySelector('.sketch-pad-wrap');
  if (pad) pad.classList.toggle('open');
}

function clearSketchCanvas(btnEl) {
  const pad = btnEl.closest('.sketch-pad-wrap');
  if (!pad) return;
  const canvas = pad.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initSketchCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let drawing = false;
  ctx.strokeStyle = '#c62828';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const start = (e) => {
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };
  const move = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };
  const end = () => { drawing = false; };

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
  canvas.addEventListener('touchstart', start, { passive: true });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end, { passive: true });
}

function enhanceImageBlocks() {
  const body = document.getElementById('study-body');
  body.querySelectorAll('.img-mask').forEach((im) => {
    if (im.parentElement.querySelector('.img-tools-bar')) return;

    const tools = document.createElement('div');
    tools.className = 'img-tools-bar';
    tools.innerHTML = `
      <button type="button" class="img-tool-btn" onclick="openImageZoomFromBtn(this)">🔍 도면 크게 보기</button>
      <button type="button" class="img-tool-btn" onclick="toggleSketchPad(this)">✏️ 도면 그려보기 연습장</button>
    `;

    const sketchWrap = document.createElement('div');
    sketchWrap.className = 'sketch-pad-wrap';
    sketchWrap.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size:0.78rem; font-weight:700;">
        <span>✏️ 손가락이나 마우스로 개념도를 직접 그려보세요</span>
        <button type="button" class="img-tool-btn" onclick="clearSketchCanvas(this)">지우기</button>
      </div>
      <canvas class="sketch-canvas" width="460" height="180"></canvas>
    `;

    im.parentElement.insertBefore(tools, im);
    im.parentElement.appendChild(sketchWrap);
    initSketchCanvas(sketchWrap.querySelector('canvas'));
  });
}

function setupSelectionAndContextMenu() {
  const bodyEl = document.getElementById('study-body');
  const menuEl = document.getElementById('selection-floating-menu');

  const checkAndShowMenu = (clientX, clientY) => {
    if (isDirectContentEditMode) return false;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return false;
    const txt = sel.toString().trim();
    if (!txt) return false;

    const range = sel.getRangeAt(0);
    if (!bodyEl.contains(range.commonAncestorContainer)) return false;

    savedSelectionRange = range.cloneRange();

    const rect = range.getBoundingClientRect();
    const x = Math.min(window.innerWidth - 280, Math.max(10, clientX || rect.left));
    const y = Math.max(10, (clientY ? clientY - 50 : rect.top - 48));

    menuEl.style.left = `${x}px`;
    menuEl.style.top = `${y}px`;
    menuEl.style.display = 'flex';
    return true;
  };

  bodyEl.addEventListener('mouseup', (e) => {
    if (!isMaskEditMode) return;
    setTimeout(() => checkAndShowMenu(e.clientX, e.clientY), 20);
  });

  bodyEl.addEventListener('touchend', () => {
    if (!isMaskEditMode) return;
    setTimeout(() => checkAndShowMenu(null, null), 120);
  });

  bodyEl.addEventListener('contextmenu', (e) => {
    if (isDirectContentEditMode) return;
    const sel = window.getSelection();
    const hasSelection = sel && !sel.isCollapsed && sel.toString().trim().length > 0;
    if (isMaskEditMode || hasSelection) {
      e.preventDefault();
      if (!isMaskEditMode) toggleMaskEditMode();
      checkAndShowMenu(e.clientX, e.clientY);
    }
  });

  document.addEventListener('mousedown', (e) => {
    if (!menuEl.contains(e.target)) {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) hideSelectionMenu();
    }
  });
}

function hideSelectionMenu() {
  const menuEl = document.getElementById('selection-floating-menu');
  if (menuEl) menuEl.style.display = 'none';
}

function toggleMaskEditMode() {
  if (isDirectContentEditMode) toggleDirectContentEdit();
  isMaskEditMode = !isMaskEditMode;
  const toolbar = document.getElementById('mask-editor-toolbar');
  const btn = document.getElementById('mask-edit-toggle-btn');

  if (isMaskEditMode) {
    document.body.classList.add('mask-edit-active');
    toolbar.classList.add('active');
    btn.innerText = '✔ 편집 종료';
    btn.style.background = '#059669';
    setMaskMode('none');
  } else {
    document.body.classList.remove('mask-edit-active');
    toolbar.classList.remove('active');
    btn.innerText = '✂️ 가림막 편집';
    btn.style.background = '#f59e0b';
    hideSelectionMenu();
    setMaskMode(currentMaskMode);
  }
}

async function persistCurrentCardBodyHtml() {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;
  const clone = document.getElementById('study-body').cloneNode(true);
  clone.querySelectorAll('.img-tools-bar, .sketch-pad-wrap').forEach(el => el.remove());
  clone.querySelectorAll('.masked, .just-revealed, .tts-reading-now').forEach(el => {
    el.classList.remove('masked', 'just-revealed', 'tts-reading-now');
  });
  card.html = clone.innerHTML;
  await dbSaveBatch([card]);
}

async function wrapSelectionWithMask(className) {
  let range = null;
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
    range = sel.getRangeAt(0);
  } else if (savedSelectionRange) {
    range = savedSelectionRange;
  }

  if (!range || range.collapsed) {
    alert('먼저 본문에서 가림막으로 만들고 싶은 글자를 마우스로 드래그해 주세요!');
    return;
  }

  const bodyEl = document.getElementById('study-body');
  if (!bodyEl.contains(range.commonAncestorContainer)) {
    alert('서브노트 본문 안의 글자만 선택해 주세요.');
    return;
  }

  const span = document.createElement('span');
  span.className = className;
  try {
    range.surroundContents(span);
  } catch (e) {
    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);
  }

  if (sel) sel.removeAllRanges();
  savedSelectionRange = null;
  hideSelectionMenu();

  await persistCurrentCardBodyHtml();
  bindBodyInteractions();
}

function bindBodyInteractions() {
  const body = document.getElementById('study-body');

  const isDraggingText = () => {
    const sel = window.getSelection();
    return sel && !sel.isCollapsed && sel.toString().trim().length > 0;
  };

  body.querySelectorAll('td').forEach(td => {
    td.onclick = async (e) => {
      if (isDirectContentEditMode || isDraggingText()) return;
      if (e.target.closest('.cloze-box, .red-hl')) return;
      if (isMaskEditMode) {
        td.classList.toggle('cell-mask');
        await persistCurrentCardBodyHtml();
        return;
      }
      if (td.classList.contains('cell-mask')) {
        td.classList.toggle('masked');
      }
    };
  });

  body.querySelectorAll('.para-mask, .section-heading').forEach(p => {
    p.onclick = async (e) => {
      if (isDirectContentEditMode || isDraggingText()) return;
      if (e.target.closest('.cloze-box, .red-hl')) return;
      if (isMaskEditMode) {
        if (p.classList.contains('para-mask')) {
          p.classList.remove('para-mask', 'masked');
          p.classList.add('section-heading');
        } else {
          p.classList.remove('section-heading');
          p.classList.add('para-mask');
        }
        await persistCurrentCardBodyHtml();
        return;
      }
      if (p.classList.contains('para-mask')) {
        p.classList.toggle('masked');
      }
    };
  });

  body.querySelectorAll('.img-mask').forEach(im => {
    im.onclick = (e) => {
      if (isDirectContentEditMode || isDraggingText()) return;
      e.stopPropagation();
      im.classList.toggle('masked');
    };
  });

  body.querySelectorAll('.cloze-box, .red-hl').forEach(box => {
    box.onclick = async (e) => {
      if (isDirectContentEditMode || isDraggingText()) return;
      e.stopPropagation();
      if (isMaskEditMode) {
        const textNode = document.createTextNode(box.textContent);
        box.replaceWith(textNode);
        await persistCurrentCardBodyHtml();
        return;
      }
      box.classList.toggle('masked');
    };
  });

  enhanceImageBlocks();
}

function setMaskMode(mode) {
  if (mode !== 'none') currentMaskMode = mode;

  document.querySelectorAll('.mask-segment-group .btn-seg').forEach(b => b.classList.remove('active-mode'));
  if (mode === 'all') document.getElementById('mode-btn-all')?.classList.add('active-mode');
  else if (mode === 'red_and_cloze') document.getElementById('mode-btn-red')?.classList.add('active-mode');
  else if (mode === 'keywords') document.getElementById('mode-btn-keywords')?.classList.add('active-mode');
  else if (mode === 'none') document.getElementById('mode-btn-none')?.classList.add('active-mode');

  const body = document.getElementById('study-body');
  if (!body) return;
  const cells = body.querySelectorAll('.cell-mask');
  const paras = body.querySelectorAll('.para-mask');
  const imgs = body.querySelectorAll('.img-mask');
  const reds = body.querySelectorAll('.red-hl');
  const clozes = body.querySelectorAll('.cloze-box');

  if (mode === 'all') {
    cells.forEach(el => el.classList.add('masked'));
    paras.forEach(el => el.classList.add('masked'));
    imgs.forEach(el => el.classList.add('masked'));
    reds.forEach(el => el.classList.remove('masked'));
    clozes.forEach(el => el.classList.add('masked'));
  } else if (mode === 'red_and_cloze') {
    cells.forEach(el => el.classList.remove('masked'));
    paras.forEach(el => el.classList.remove('masked'));
    imgs.forEach(el => el.classList.add('masked'));
    reds.forEach(el => el.classList.add('masked'));
    clozes.forEach(el => el.classList.add('masked'));
  } else if (mode === 'keywords') {
    cells.forEach(el => el.classList.remove('masked'));
    paras.forEach(el => el.classList.remove('masked'));
    imgs.forEach(el => el.classList.remove('masked'));
    reds.forEach(el => el.classList.remove('masked'));
    clozes.forEach(el => el.classList.add('masked'));
  } else {
    cells.forEach(el => el.classList.remove('masked'));
    paras.forEach(el => el.classList.remove('masked'));
    imgs.forEach(el => el.classList.remove('masked'));
    reds.forEach(el => el.classList.remove('masked'));
    clozes.forEach(el => el.classList.remove('masked'));
  }

  if (mode === 'red_and_cloze' || mode === 'keywords') {
    const isBasicQaCard = Boolean(body.querySelector('.anki-question-box'));
    if (isBasicQaCard) {
      paras.forEach(el => {
        if (!el.closest('.anki-question-box')) {
          const hasInnerBlank = el.querySelector('.red-hl, .cloze-box');
          if (!hasInnerBlank) {
            el.classList.add('masked');
          }
        }
      });
    }
  }
}

function revealNextMask() {
  const body = document.getElementById('study-body');
  const maskedElements = Array.from(body.querySelectorAll('.masked'));
  if (maskedElements.length === 0) return;

  const nextEl = maskedElements[0];
  nextEl.classList.remove('masked');
  nextEl.classList.add('just-revealed');
  setTimeout(() => nextEl.classList.remove('just-revealed'), 800);

  nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function toggleAllMasksQuick() {
  const anyMasked = document.querySelector('#study-body .masked');
  setMaskMode(anyMasked ? 'none' : currentMaskMode);
}

async function toggleStarCurrentCard() {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;
  card.starred = !card.starred;
  await dbSaveBatch([card]);
  updateStatsBar();
  renderSelectedCard(card.id, { preserveTtsState: true });
}

function saveCurrentMemo() {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;
  card.memo = document.getElementById('card-memo').value;
  document.getElementById('memo-save-status').innerText = '저장 중...';
  if (memoTimeout) clearTimeout(memoTimeout);
  memoTimeout = setTimeout(async () => {
    await dbSaveBatch([card]);
    document.getElementById('memo-save-status').innerText = '✔ 자동 저장됨';
  }, 400);
}

function nextCard() {
  const list = filteredCards.length > 0 ? filteredCards : cards;
  if (list.length === 0) return;
  const idx = list.findIndex(c => c.id === currentCardId);
  const nextIdx = (idx + 1) % list.length;
  renderSelectedCard(list[nextIdx].id);
}

function prevCard() {
  const list = filteredCards.length > 0 ? filteredCards : cards;
  if (list.length === 0) return;
  const idx = list.findIndex(c => c.id === currentCardId);
  const prevIdx = (idx - 1 + list.length) % list.length;
  renderSelectedCard(list[prevIdx].id);
}

async function gradeCard(rating) {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;

  lastGradeBackup = {
    cardId: card.id,
    interval: card.interval || 0,
    repetitions: card.repetitions || 0,
    lapses: card.lapses || 0,
    flag: card.flag || 0,
    dueDate: card.dueDate || 0
  };

  const nextIv = getNextIntervals(card.interval);
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  if (rating === 0) {
    card.interval = nextIv.again;
    card.dueDate = now;
    card.lapses = (card.lapses || 0) + 1;
    if (card.lapses === 4 && !card.flag) {
      card.flag = 1;
    }
  } else if (rating === 1) {
    card.interval = nextIv.hard;
    card.dueDate = now + card.interval * ONE_DAY;
  } else if (rating === 2) {
    card.interval = nextIv.good;
    card.dueDate = now + card.interval * ONE_DAY;
  } else if (rating === 3) {
    card.interval = nextIv.easy;
    card.dueDate = now + card.interval * ONE_DAY;
  }

  card.repetitions = (card.repetitions || 0) + 1;
  await dbSaveBatch([card]);
  incrementTodayStudyCount(1);
  showUndoToast(card.title);
  nextCard();
}

function showUndoToast(cardTitle) {
  const toast = document.getElementById('undo-toast');
  const msg = document.getElementById('undo-toast-msg');
  if (!toast || !msg) return;
  const shortTitle = (cardTitle || '').replace(/^■\s*/, '').slice(0, 16);
  msg.innerText = `✔ [${shortTitle}] 평가 완료`;
  toast.classList.add('show');
  if (undoToastTimer) clearTimeout(undoToastTimer);
  undoToastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 5500);
}

async function undoLastGrade() {
  if (!lastGradeBackup) return;
  const card = cards.find(c => c.id === lastGradeBackup.cardId);
  if (!card) return;

  card.interval = lastGradeBackup.interval;
  card.repetitions = lastGradeBackup.repetitions;
  card.lapses = lastGradeBackup.lapses;
  card.flag = lastGradeBackup.flag;
  card.dueDate = lastGradeBackup.dueDate;
  lastGradeBackup = null;

  await dbSaveBatch([card]);
  incrementTodayStudyCount(-1);
  document.getElementById('undo-toast')?.classList.remove('show');
  renderSelectedCard(card.id);
}

// 실전 타이머
function updateTimerUI() {
  const m = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const s = String(timerSeconds % 60).padStart(2, '0');
  document.getElementById('timer-display').innerText = `${m}:${s}`;
}

function startTimer(minutes) {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  timerInitialSeconds = minutes * 60;
  timerSeconds = timerInitialSeconds;
  updateTimerUI();
  toggleTimer();
}

function toggleTimer() {
  const btn = document.getElementById('timer-toggle-btn');
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    btn.innerText = '▶';
  } else {
    btn.innerText = '⏸';
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerUI();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        btn.innerText = '▶';
        alert('⏰ 설정한 실전 답안 작성 시간이 종료되었습니다!');
      }
    }, 1000);
  }
}

// 백업 & 복원
function exportBackupJson() {
  const dataStr = JSON.stringify(cards, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `메모리온_암기장_백업_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
  document.getElementById('backup-status').innerText = `✔ 총 ${cards.length}개 카드 데이터가 JSON 파일로 다운로드되었습니다.`;
}

async function importBackupJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const rawParsed = JSON.parse(text);
    const imported = Array.isArray(rawParsed) ? rawParsed : (rawParsed.cards || []);
    if (!Array.isArray(imported)) throw new Error('올바른 백업 파일 형식이 아닙니다.');

    await dbClearAll();
    await dbSaveBatch(imported);
    cards = await dbGetAll();
    await migrateCardCompatibility();
    cards.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    populateSubjectDropdown();
    applyFilter();
    document.getElementById('backup-status').innerText = `🎉 복원 완료! 총 ${cards.length}개의 카드와 플래그/복습 이력을 성공적으로 불러왔습니다.`;
    setTimeout(() => switchTab('study'), 1000);
  } catch (err) {
    alert('백업 파일 복원 중 오류가 발생했습니다: ' + err.message);
  }
}

function compressImageDataUrl(dataUrl, maxWidth = 700) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.84));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/* =========================================================================
   ★ ➕ Anki 스타일 카드 직접 추가 & 편집/삭제 통합 엔진 ★
   ========================================================================= */
function switchTab(tabName) {
  stopTtsPlayback();
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  const targetSec = document.getElementById(`view-${tabName}`);
  if (targetSec) targetSec.classList.add('active');
  const tabBtn = document.getElementById(`tab-${tabName}`);
  if (tabBtn) tabBtn.classList.add('active');
  if (tabName === 'flags') {
    renderFlagBrowserView();
  }
  if (tabName === 'add') {
    initDirectAddTab();
  }
}

function openDirectAddTab() {
  switchTab('add');
}

function injectDirectUpgradeButtons() {
  const contentEditBtn = document.getElementById('content-edit-toggle-btn');
  if (contentEditBtn && !document.getElementById('jump-to-editor-btn')) {
    const edBtn = document.createElement('button');
    edBtn.id = 'jump-to-editor-btn';
    edBtn.className = 'btn btn-outline';
    edBtn.style.borderColor = '#10b981';
    edBtn.style.color = '#059669';
    edBtn.title = '현재 카드를 Anki 직접 입력 에디터로 불러와 문제/정답/빈칸/과목을 체계적으로 수정합니다';
    edBtn.innerHTML = '📝 에디터편집';
    edBtn.onclick = () => editCardInDirectEditor(currentCardId);
    contentEditBtn.parentNode.insertBefore(edBtn, contentEditBtn);
  }

  const batchFlagSel = document.getElementById('batch-flag-select');
  if (batchFlagSel && batchFlagSel.parentNode && !document.getElementById('batch-delete-btn')) {
    const wrap = batchFlagSel.parentNode;

    const subjBtn = document.createElement('button');
    subjBtn.id = 'batch-subj-btn';
    subjBtn.className = 'btn btn-outline';
    subjBtn.style.padding = '5px 9px';
    subjBtn.style.fontSize = '0.78rem';
    subjBtn.innerHTML = '📂 과목이동';
    subjBtn.onclick = () => batchChangeSubjectFromBrowser();
    wrap.appendChild(subjBtn);

    const delBtn = document.createElement('button');
    delBtn.id = 'batch-delete-btn';
    delBtn.className = 'btn btn-outline';
    delBtn.style.padding = '5px 9px';
    delBtn.style.fontSize = '0.78rem';
    delBtn.style.color = '#e11d48';
    delBtn.style.borderColor = '#fda4af';
    delBtn.innerHTML = '🗑️ 선택삭제';
    delBtn.onclick = () => batchDeleteCardsFromBrowser();
    wrap.appendChild(delBtn);
  }

  // ★ TTS 오디오 낭독 편집기 & 발음 교정 사전 버튼 주입 ★
  injectTtsScriptAndPronButtons();
}

function editCardInDirectEditor(cardId) {
  const targetId = cardId || currentCardId;
  const card = cards.find(c => c.id === targetId);
  if (!card) {
    alert('수정할 카드를 찾을 수 없습니다.');
    return;
  }
  switchTab('add');
  loadSpecificCardIntoEditor(card);
}

async function deleteCardDirectlyFromBrowser(cardId) {
  const card = cards.find(c => c.id === cardId);
  if (!card) return;
  if (!confirm(`정말로 [${card.title}] 카드를 삭제하시겠습니까?`)) return;

  await dbDeleteOne(card.id);
  cards = cards.filter(c => c.id !== card.id);
  browserSelectedIds.delete(card.id);
  populateSubjectDropdown();
  applyFilter();
  renderFlagBrowserView();
}

async function batchDeleteCardsFromBrowser() {
  const targets = getTargetCardsForBrowserBatch();
  if (!targets.length) {
    alert('삭제할 카드를 먼저 선택해 주세요.');
    return;
  }
  if (!confirm(`선택한 ${targets.length}개의 카드를 정말로 일괄 삭제하시겠습니까?\n(삭제 후 복구할 수 없습니다)`)) return;

  for (const c of targets) {
    await dbDeleteOne(c.id);
    browserSelectedIds.delete(c.id);
  }
  const delSet = new Set(targets.map(c => c.id));
  cards = cards.filter(c => !delSet.has(c.id));
  populateSubjectDropdown();
  applyFilter();
  renderFlagBrowserView();
  alert(`✔ 총 ${targets.length}개의 카드가 삭제되었습니다.`);
}

async function batchChangeSubjectFromBrowser() {
  const targets = getTargetCardsForBrowserBatch();
  if (!targets.length) {
    alert('과목을 변경할 카드를 먼저 선택해 주세요.');
    return;
  }
  const nextSubjRaw = prompt(`선택한 ${targets.length}개 카드를 이동시킬 과목명을 입력하세요:`, targets[0].subject || '미분류');
  if (nextSubjRaw === null) return;
  const cleanSubj = sanitizeSubjectName(nextSubjRaw) || '미분류';

  targets.forEach(c => { c.subject = cleanSubj; });
  await dbSaveBatch(targets);
  populateSubjectDropdown();
  applyFilter();
  renderFlagBrowserView();
  alert(`✔ ${targets.length}개 카드가 [${cleanSubj}] 과목으로 이동되었습니다.`);
}

function initDirectAddTab() {
  refreshDirectSubjectSelect();
  if (!lastFocusedEditorTextarea) {
    lastFocusedEditorTextarea = document.getElementById('direct-front-textarea');
  }
  updateDirectPreview();
}

function refreshDirectSubjectSelect(preferredSubject) {
  const sel = document.getElementById('direct-subject-select');
  if (!sel) return;
  const customInp = document.getElementById('direct-subject-custom');

  const subjSet = new Set(['미분류']);
  if (Array.isArray(cards)) {
    cards.forEach(c => {
      const s = (c.subject || '미분류').trim();
      if (s) subjSet.add(s);
    });
  }
  const studySubjFilter = document.getElementById('subject-filter');
  const currentStudySubj = (studySubjFilter && studySubjFilter.value !== 'ALL') ? studySubjFilter.value : null;
  const targetSubj = preferredSubject || (sel.value !== '__NEW__' ? sel.value : null) || currentStudySubj || '미분류';

  if (targetSubj && targetSubj !== '__NEW__') subjSet.add(targetSubj);

  const sorted = Array.from(subjSet).sort();
  let html = '';
  sorted.forEach(s => {
    html += `<option value="${s}">📗 ${s}</option>`;
  });
  html += `<option value="__NEW__">➕ 새 과목 직접 입력...</option>`;
  sel.innerHTML = html;

  if (sorted.includes(targetSubj)) {
    sel.value = targetSubj;
    if (customInp) customInp.style.display = 'none';
  } else {
    sel.value = '미분류';
  }
}

function onDirectSubjectSelectChange(val) {
  const customInp = document.getElementById('direct-subject-custom');
  if (!customInp) return;
  if (val === '__NEW__') {
    customInp.style.display = 'block';
    customInp.focus();
  } else {
    customInp.style.display = 'none';
  }
  updateDirectPreview();
}

function getSelectedDirectSubject() {
  const sel = document.getElementById('direct-subject-select');
  const customInp = document.getElementById('direct-subject-custom');
  if (!sel) return '미분류';
  if (sel.value === '__NEW__') {
    const raw = customInp ? customInp.value.trim() : '';
    return sanitizeSubjectName(raw) || '미분류';
  }
  return sel.value || '미분류';
}

function setDirectAddMode(mode) {
  directAddMode = mode;
  ['basic', 'cloze', 'batch'].forEach(m => {
    const btn = document.getElementById(`add-mode-${m}`);
    if (btn) btn.classList.toggle('active', m === mode);
  });

  const singleWs = document.getElementById('direct-single-workspace');
  const batchWs = document.getElementById('direct-batch-workspace');
  const frontGroup = document.getElementById('direct-front-group');
  const backLabel = document.getElementById('direct-back-label');

  if (mode === 'batch') {
    if (singleWs) singleWs.style.display = 'none';
    if (batchWs) batchWs.style.display = 'block';
  } else {
    if (singleWs) singleWs.style.display = 'grid';
    if (batchWs) batchWs.style.display = 'none';
    if (mode === 'basic') {
      if (frontGroup) frontGroup.style.display = 'block';
      if (backLabel) backLabel.innerText = '💡 뒷면 (Answer / 해답 및 해설) — 가림막으로 숨겨지는 정답 영역';
    } else {
      if (frontGroup) frontGroup.style.display = 'none';
      if (backLabel) backLabel.innerText = '📝 서브노트 본문 (줄 단위 가림막 + {{빨간빈칸}} + [[파란빈칸]] + [표])';
    }
    updateDirectPreview();
  }
}

function formatDirectInlineHtml(line) {
  let safe = (line || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;br&gt;/gi, '<br>');

  safe = safe.replace(/\[\[분수:([^/\]|]+)\/([^\]]+)\]\]/g,
    '<span class="hwp-frac"><span class="hwp-frac-top">$1</span><span class="hwp-frac-btm">$2</span></span>');

  safe = safe.replace(/\^\(([^)]+)\)/g, '<sup>$1</sup>');
  safe = safe.replace(/\^([0-9+\-a-zA-Z]+)/g, '<sup>$1</sup>');
  safe = safe.replace(/_([0-9a-zA-Z]+)/g, '<sub>$1</sub>');

  safe = safe.replace(/\[\[([^\]]+)\]\]/g, '<span class="cloze-box">$1</span>');
  safe = safe.replace(/\{\{([^}]+)\}\}/g, '<span class="red-hl">$1</span>');

  return safe;
}

function convertDirectTextToMemoryOnHtml(rawText, isQuestionFront) {
  const lines = (rawText || '').replace(/\r/g, '').split('\n');
  let html = '';
  let inSummaryTable = false;
  let summaryRows = [];
  let inCompTable = false;
  let compRows = [];

  const flushSummaryTable = () => {
    if (!summaryRows.length) return;
    html += `<table class="hwp-table"><tbody>`;
    for (let i = 0; i < summaryRows.length; i += 2) {
      const left = summaryRows[i];
      const right = summaryRows[i + 1];
      html += `<tr>`;
      html += `<th style="width:18%;">${formatDirectInlineHtml(left.key)}</th>`;
      html += `<td style="width:32%;"><span class="cloze-box">${formatDirectInlineHtml(left.val)}</span></td>`;
      if (right) {
        html += `<th style="width:18%;">${formatDirectInlineHtml(right.key)}</th>`;
        html += `<td style="width:32%;"><span class="cloze-box">${formatDirectInlineHtml(right.val)}</span></td>`;
      } else {
        html += `<th style="width:18%;"></th><td style="width:32%;"></td>`;
      }
      html += `</tr>`;
    }
    html += `</tbody></table>`;
    summaryRows = [];
  };

  const flushCompTable = () => {
    if (!compRows.length) return;
    html += `<table class="hwp-table"><tbody>`;
    compRows.forEach((cols, rIdx) => {
      html += `<tr>`;
      cols.forEach((colText, cIdx) => {
        if (rIdx === 0) {
          html += `<th>${formatDirectInlineHtml(colText)}</th>`;
        } else if (cIdx === 0) {
          html += `<th style="background:var(--surface-bg);">${formatDirectInlineHtml(colText)}</th>`;
        } else {
          html += `<td class="cell-mask">${formatDirectInlineHtml(colText)}</td>`;
        }
      });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    compRows = [];
  };

  for (let raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    if (/^\[표\]$/i.test(trimmed)) { inSummaryTable = true; continue; }
    if (/^\[\/표\]$/i.test(trimmed)) { inSummaryTable = false; flushSummaryTable(); continue; }
    if (/^\[비교표\]$/i.test(trimmed)) { inCompTable = true; continue; }
    if (/^\[\/비교표\]$/i.test(trimmed)) { inCompTable = false; flushCompTable(); continue; }

    if (inSummaryTable) {
      const parts = trimmed.split('|').map(s => s.trim());
      if (parts.length >= 2) {
        summaryRows.push({ key: parts[0], val: parts.slice(1).join(' | ') });
      }
      continue;
    }

    if (inCompTable) {
      const cols = trimmed.split('|').map(s => s.trim());
      if (cols.length >= 2) compRows.push(cols);
      continue;
    }

    const figMatch = trimmed.match(/^\[그림(\d+)\]$/);
    if (figMatch) {
      const figNum = figMatch[1];
      const dataUrl = directAttachedImages[figNum];
      if (dataUrl) {
        html += `
          <div class="img-block-wrapper">
            <div class="img-mask">
              <img src="${dataUrl}" alt="첨부 그림 ${figNum}">
            </div>
          </div>`;
      }
      continue;
    }

    const isHeading = /^(?:[0-9]{1,2}\.|[가-하]\.|[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ]+\.|🎯|💡)\s+/.test(trimmed);

    if (isQuestionFront) {
      html += `<div class="question-line" style="margin:4px 0;">${formatDirectInlineHtml(trimmed)}</div>`;
    } else {
      if (isHeading) {
        html += `<div class="section-heading">${formatDirectInlineHtml(trimmed)}</div>`;
      } else {
        html += `<div class="para-mask">${formatDirectInlineHtml(trimmed)}</div>`;
      }
    }
  }

  if (summaryRows.length) flushSummaryTable();
  if (compRows.length) flushCompTable();
  return html;
}

function buildDirectCardPayload() {
  const titleInput = (document.getElementById('direct-title-input')?.value || '').trim();
  const frontText = (document.getElementById('direct-front-textarea')?.value || '').trim();
  const backText = (document.getElementById('direct-back-textarea')?.value || '').trim();

  let finalTitle = titleInput;
  if (!finalTitle) {
    const sourceText = (directAddMode === 'basic' && frontText) ? frontText : backText;
    const firstLine = (sourceText.split('\n').map(l => l.trim()).find(Boolean) || '새 암기 카드')
      .replace(/\{\{([^}]+)\}\}/g, '$1')
      .replace(/\[\[([^\]]+)\]\]/g, '$1')
      .slice(0, 55);
    finalTitle = firstLine;
  }
  if (!finalTitle.startsWith('■')) {
    finalTitle = '■ ' + finalTitle;
  }

  let combinedHtml = '';
  if (directAddMode === 'basic') {
    if (frontText) {
      combinedHtml += `
        <div class="anki-question-box">
          <span class="anki-question-badge tts-ignore">❓ 문제 (Question)</span>
          ${convertDirectTextToMemoryOnHtml(frontText, true)}
        </div>`;
    }
    if (backText) {
      combinedHtml += `
        <div class="anki-answer-divider tts-ignore">💡 정답 및 해설 (클릭 또는 Enter로 확인)</div>
        ${convertDirectTextToMemoryOnHtml(backText, false)}`;
    }
  } else {
    combinedHtml = convertDirectTextToMemoryOnHtml(backText, false);
  }

  return {
    title: finalTitle,
    html: combinedHtml
  };
}

function setDirectPreviewMask(mode) {
  directPreviewMaskMode = mode;
  applyDirectPreviewMaskMode(mode);
}

function updateDirectPreview() {
  const prevBody = document.getElementById('direct-prev-body');
  const prevTitle = document.getElementById('direct-prev-title');
  const prevSubj = document.getElementById('direct-prev-subj');
  const prevStar = document.getElementById('direct-prev-star');
  const prevFlag = document.getElementById('direct-prev-flag');
  if (!prevBody || !prevTitle) return;

  const built = buildDirectCardPayload();
  const subj = getSelectedDirectSubject();
  const starred = Boolean(document.getElementById('direct-star-chk')?.checked);
  const flagVal = parseInt(document.getElementById('direct-flag-select')?.value || '0', 10);

  prevTitle.innerText = built.title;
  if (prevSubj) prevSubj.innerText = `📗 ${subj}`;
  if (prevStar) prevStar.style.display = starred ? 'inline' : 'none';

  if (prevFlag) {
    if (flagVal > 0 && DEFAULT_FLAG_META[flagVal]) {
      const meta = DEFAULT_FLAG_META[flagVal];
      prevFlag.style.display = 'inline-flex';
      prevFlag.className = 'flag-badge-pill';
      prevFlag.style.background = meta.color;
      prevFlag.innerText = `${meta.icon} ${flagLabels[flagVal] || meta.name}`;
    } else {
      prevFlag.style.display = 'none';
    }
  }

  prevBody.innerHTML = built.html || `<div style="color:var(--sub-text); padding:20px 0; text-align:center;">좌측 입력창에 문제와 정답을 입력하면 실시간으로 미리보기가 표시됩니다.</div>`;

  prevBody.querySelectorAll('.para-mask, .cell-mask, .img-mask, .red-hl, .cloze-box').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      el.classList.toggle('masked');
    };
  });

  applyDirectPreviewMaskMode(directPreviewMaskMode);
}

function applyDirectPreviewMaskMode(mode) {
  const container = document.getElementById('direct-prev-body');
  if (!container) return;
  const cells = container.querySelectorAll('.cell-mask');
  const paras = container.querySelectorAll('.para-mask');
  const imgs = container.querySelectorAll('.img-mask');
  const reds = container.querySelectorAll('.red-hl');
  const clozes = container.querySelectorAll('.cloze-box');

  if (mode === 'all') {
    cells.forEach(el => el.classList.add('masked'));
    paras.forEach(el => el.classList.add('masked'));
    imgs.forEach(el => el.classList.add('masked'));
    reds.forEach(el => el.classList.remove('masked'));
    clozes.forEach(el => el.classList.add('masked'));
  } else if (mode === 'red_and_cloze') {
    cells.forEach(el => el.classList.remove('masked'));
    paras.forEach(el => {
      const hasInnerBlank = el.querySelector('.red-hl, .cloze-box');
      if (directAddMode === 'basic' && !hasInnerBlank) {
        el.classList.add('masked');
      } else {
        el.classList.remove('masked');
      }
    });
    imgs.forEach(el => el.classList.add('masked'));
    reds.forEach(el => el.classList.add('masked'));
    clozes.forEach(el => el.classList.add('masked'));
  } else {
    cells.forEach(el => el.classList.remove('masked'));
    paras.forEach(el => el.classList.remove('masked'));
    imgs.forEach(el => el.classList.remove('masked'));
    reds.forEach(el => el.classList.remove('masked'));
    clozes.forEach(el => el.classList.remove('masked'));
  }
}

function insertEditorSyntax(type) {
  const ta = lastFocusedEditorTextarea || document.getElementById('direct-back-textarea');
  if (!ta) return;
  ta.focus();
  const start = ta.selectionStart ?? ta.value.length;
  const end = ta.selectionEnd ?? ta.value.length;
  const selected = ta.value.substring(start, end);

  let replacement = '';
  let cursorOffset = 0;

  if (type === 'red') {
    replacement = `{{${selected || '핵심키워드'}}}`;
    cursorOffset = selected ? replacement.length : 2;
  } else if (type === 'blue') {
    replacement = `[[${selected || '암기할 정답 내용'}]]`;
    cursorOffset = selected ? replacement.length : 2;
  } else if (type === 'heading') {
    replacement = `\n1. ${selected || '소제목을 입력하세요'}\n`;
    cursorOffset = replacement.length;
  } else if (type === 'summary_table') {
    replacement = `\n[표]\n항목 1 | 핵심 암기 내용 1\n항목 2 | 핵심 암기 내용 2\n[/표]\n`;
    cursorOffset = replacement.length;
  } else if (type === 'comp_table') {
    replacement = `\n[비교표]\n구분 | 비교 대상 A | 비교 대상 B\n특징 1 | A의 특징 | B의 특징\n특징 2 | A의 수치 | B의 수치\n[/비교표]\n`;
    cursorOffset = replacement.length;
  } else if (type === 'frac') {
    replacement = `[[분수:${selected || '분자'}/분모]]`;
    cursorOffset = replacement.length;
  } else if (type === 'choices') {
    replacement = `\n① 선지 1번\n② 선지 2번\n③ 선지 3번\n④ 선지 4번\n`;
    cursorOffset = replacement.length;
  }

  ta.value = ta.value.substring(0, start) + replacement + ta.value.substring(end);
  ta.selectionStart = ta.selectionEnd = start + cursorOffset;
  updateDirectPreview();
}

function handleDirectEditorPaste(event) {
  const items = event.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type && item.type.startsWith('image/')) {
      event.preventDefault();
      const file = item.getAsFile();
      if (file) insertImageFileIntoDirectEditor(file);
      return;
    }
  }
}

function insertImageFileIntoDirectEditor(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const nextIdx = Object.keys(directAttachedImages).length + 1;
    directAttachedImages[nextIdx] = e.target.result;
    const ta = lastFocusedEditorTextarea || document.getElementById('direct-back-textarea');
    if (ta) {
      const pos = ta.selectionStart ?? ta.value.length;
      const tag = `\n[그림${nextIdx}]\n`;
      ta.value = ta.value.slice(0, pos) + tag + ta.value.slice(pos);
    }
    renderDirectAttachedImagesBar();
    updateDirectPreview();
  };
  reader.readAsDataURL(file);
}

function renderDirectAttachedImagesBar() {
  const bar = document.getElementById('direct-attached-images-bar');
  if (!bar) return;
  const keys = Object.keys(directAttachedImages);
  if (!keys.length) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return;
  }
  bar.style.display = 'flex';
  bar.innerHTML = keys.map(k => `
    <span class="fig-control-chip">
      🖼️ [그림${k}] 첨부됨
      <button type="button" class="btn btn-outline" style="padding:1px 6px; font-size:0.7rem;" onclick="removeDirectAttachedImage('${k}')">✕</button>
    </span>
  `).join('');
}

function removeDirectAttachedImage(k) {
  delete directAttachedImages[k];
  renderDirectAttachedImagesBar();
  updateDirectPreview();
}

async function saveDirectCard(keepAdding) {
  const frontText = (document.getElementById('direct-front-textarea')?.value || '').trim();
  const backText = (document.getElementById('direct-back-textarea')?.value || '').trim();

  if (directAddMode === 'basic' && !frontText && !backText) {
    alert('앞면(문제) 또는 뒷면(정답·해설)을 입력해 주세요.');
    return;
  }
  if (directAddMode === 'cloze' && !backText) {
    alert('서브노트 본문 내용을 입력해 주세요.');
    return;
  }

  const subject = getSelectedDirectSubject();
  const built = buildDirectCardPayload();
  const memo = (document.getElementById('direct-memo-textarea')?.value || '').trim();
  const starred = Boolean(document.getElementById('direct-star-chk')?.checked);
  const flagVal = parseInt(document.getElementById('direct-flag-select')?.value || '0', 10);
  const dupPolicy = document.getElementById('direct-dup-policy')?.value || 'ask';

  const normKey = normalizeTitleKey(built.title);

  let targetExisting = null;
  if (directEditingCardId) {
    targetExisting = cards.find(c => c.id === directEditingCardId) || null;
  } else {
    const sameTitleCard = cards.find(c =>
      normalizeTitleKey(c.title) === normKey &&
      (c.subject || '미분류') === subject
    );
    if (sameTitleCard) {
      if (dupPolicy === 'overwrite') {
        targetExisting = sameTitleCard;
      } else if (dupPolicy === 'ask') {
        const ok = confirm(`이미 [${subject}] 과목에 동일한 제목(${built.title})의 카드가 있습니다.\n\n[확인] = 기존 복습 이력을 유지하고 내용을 덮어쓰기\n[취소] = 별도의 새 카드로 추가하기`);
        if (ok) targetExisting = sameTitleCard;
      }
    }
  }

  const cardId = targetExisting
    ? targetExisting.id
    : (`direct-${normKey || Date.now()}-${Date.now().toString().slice(-5)}`);

  const cardObj = {
    id: cardId,
    order: targetExisting ? targetExisting.order : (cards.length + 1),
    subject: subject,
    title: built.title,
    html: built.html,
    rawFront: directAddMode === 'basic' ? frontText : '',
    rawBack: backText,
    cardMode: directAddMode,
    interval: targetExisting ? (targetExisting.interval || 0) : 0,
    repetitions: targetExisting ? (targetExisting.repetitions || 0) : 0,
    lapses: targetExisting ? (targetExisting.lapses || 0) : 0,
    flag: flagVal,
    suspended: targetExisting ? Boolean(targetExisting.suspended) : false,
    buriedDate: targetExisting ? (targetExisting.buriedDate || '') : '',
    dueDate: targetExisting ? (targetExisting.dueDate || 0) : 0,
    starred: starred,
    memo: memo
  };

  await dbSaveBatch([cardObj]);
  cards = await dbGetAll();
  cards.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  populateSubjectDropdown();
  refreshDirectSubjectSelect(subject);
  applyFilter();

  if (keepAdding) {
    resetDirectEditorForm(false);
    const toast = document.getElementById('direct-save-toast');
    if (toast) {
      toast.innerText = `✔ [${subject}] "${built.title}" 저장 완료! 다음 문제를 입력하세요.`;
      setTimeout(() => { if (toast) toast.innerText = ''; }, 3200);
    }
    const firstFocus = directAddMode === 'basic'
      ? document.getElementById('direct-front-textarea')
      : document.getElementById('direct-back-textarea');
    if (firstFocus) firstFocus.focus();
  } else {
    resetDirectEditorForm(false);
    switchTab('study');
    renderSelectedCard(cardId);
  }
}

function resetDirectEditorForm(resetMeta) {
  directEditingCardId = null;
  const banner = document.getElementById('direct-editing-banner');
  if (banner) banner.style.display = 'none';

  ['direct-title-input', 'direct-front-textarea', 'direct-back-textarea', 'direct-memo-textarea'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  directAttachedImages = {};
  renderDirectAttachedImagesBar();

  if (resetMeta) {
    const starChk = document.getElementById('direct-star-chk');
    const flagSel = document.getElementById('direct-flag-select');
    if (starChk) starChk.checked = false;
    if (flagSel) flagSel.value = '0';
  }
  updateDirectPreview();
}

function cancelDirectEditExistingCard() {
  directEditingCardId = null;
  const banner = document.getElementById('direct-editing-banner');
  if (banner) banner.style.display = 'none';
}

function loadSpecificCardIntoEditor(card) {
  if (!card) return;
  directEditingCardId = card.id;
  refreshDirectSubjectSelect(card.subject || '미분류');

  const banner = document.getElementById('direct-editing-banner');
  const bannerTxt = document.getElementById('direct-editing-banner-text');
  if (banner && bannerTxt) {
    banner.style.display = 'flex';
    bannerTxt.innerText = `✏️ 기존 카드 수정 모드: ${card.title}`;
  }

  document.getElementById('direct-title-input').value = card.title || '';
  document.getElementById('direct-memo-textarea').value = card.memo || '';
  document.getElementById('direct-star-chk').checked = Boolean(card.starred);
  document.getElementById('direct-flag-select').value = String(card.flag || 0);

  if (card.rawBack !== undefined || card.rawFront !== undefined) {
    setDirectAddMode(card.cardMode || (card.rawFront ? 'basic' : 'cloze'));
    document.getElementById('direct-front-textarea').value = card.rawFront || '';
    document.getElementById('direct-back-textarea').value = card.rawBack || '';
  } else {
    const temp = document.createElement('div');
    temp.innerHTML = card.html || '';
    temp.querySelectorAll('.red-hl').forEach(el => { el.outerHTML = `{{${el.innerText}}}`; });
    temp.querySelectorAll('.cloze-box').forEach(el => { el.outerHTML = `[[${el.innerText}]]`; });

    const qBox = temp.querySelector('.anki-question-box');
    if (qBox) {
      setDirectAddMode('basic');
      qBox.querySelectorAll('.anki-question-badge').forEach(b => b.remove());
      document.getElementById('direct-front-textarea').value = (qBox.innerText || '').trim();
      qBox.remove();
      temp.querySelectorAll('.anki-answer-divider').forEach(d => d.remove());
    } else {
      setDirectAddMode('cloze');
      document.getElementById('direct-front-textarea').value = '';
    }

    const lines = [];
    temp.querySelectorAll('.section-heading, .para-mask, tr').forEach(node => {
      if (node.tagName === 'TR') {
        const cells = Array.from(node.querySelectorAll('th, td')).map(c => c.innerText.trim());
        if (cells.length) lines.push(cells.join(' | '));
      } else {
        lines.push(node.innerText.trim());
      }
    });
    document.getElementById('direct-back-textarea').value = lines.filter(Boolean).join('\n') || temp.innerText.trim();
  }
  updateDirectPreview();
}

function loadCurrentStudyCardIntoEditor() {
  const sel = document.getElementById('card-selector');
  const currentId = sel?.value || currentCardId;
  const card = cards.find(c => c.id === currentId) || filteredCards?.[0];
  if (!card) {
    alert('불러올 카드가 없습니다.');
    return;
  }
  loadSpecificCardIntoEditor(card);
}

async function registerDirectBatchCards() {
  const raw = (document.getElementById('direct-batch-textarea')?.value || '').trim();
  if (!raw) {
    alert('일괄 등록할 내용을 입력해 주세요.');
    return;
  }

  const subject = getSelectedDirectSubject();
  const flagVal = parseInt(document.getElementById('direct-flag-select')?.value || '0', 10);
  const starred = Boolean(document.getElementById('direct-star-chk')?.checked);
  const toSave = [];
  const now = Date.now();

  if (/^■/m.test(raw)) {
    const blocks = raw.split(/(?=^■)/m).map(b => b.trim()).filter(Boolean);
    blocks.forEach((blk, idx) => {
      const lines = blk.split('\n');
      const titleLine = lines.shift().trim();
      const bodyStr = lines.join('\n').trim();
      let frontPart = '';
      let backPart = bodyStr;
      if (bodyStr.includes('\n---\n')) {
        const splitParts = bodyStr.split('\n---\n');
        frontPart = splitParts[0].trim();
        backPart = splitParts.slice(1).join('\n---\n').trim();
      }
      let html = '';
      if (frontPart) {
        html += `<div class="anki-question-box"><span class="anki-question-badge tts-ignore">❓ 문제 (Question)</span>${convertDirectTextToMemoryOnHtml(frontPart, true)}</div>`;
        html += `<div class="anki-answer-divider tts-ignore">💡 정답 및 해설 (클릭 또는 Enter로 확인)</div>`;
      }
      html += convertDirectTextToMemoryOnHtml(backPart, false);

      toSave.push({
        id: `batch-${now}-${idx}`,
        order: cards.length + toSave.length + 1,
        subject: subject,
        title: titleLine.startsWith('■') ? titleLine : `■ ${titleLine}`,
        html: html,
        rawFront: frontPart,
        rawBack: backPart,
        cardMode: frontPart ? 'basic' : 'cloze',
        interval: 0,
        repetitions: 0,
        lapses: 0,
        flag: flagVal,
        suspended: false,
        buriedDate: '',
        dueDate: 0,
        starred: starred,
        memo: ''
      });
    });
  } else {
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    lines.forEach((line, idx) => {
      let mainPart = line;
      let memoPart = '';
      if (line.includes('||')) {
        const mSplit = line.split('||');
        mainPart = mSplit[0].trim();
        memoPart = mSplit.slice(1).join('||').trim();
      }

      let qText = '';
      let aText = '';
      if (mainPart.includes('::')) {
        const qa = mainPart.split('::');
        qText = qa[0].trim();
        aText = qa.slice(1).join('::').trim();
      } else if (mainPart.includes('\t')) {
        const qa = mainPart.split('\t');
        qText = qa[0].trim();
        aText = qa.slice(1).join(' ').trim();
      } else {
        qText = `문제 ${idx + 1}`;
        aText = mainPart;
      }

      const shortTitle = '■ ' + qText.replace(/\{\{([^}]+)\}\}/g, '$1').replace(/\[\[([^\]]+)\]\]/g, '$1').slice(0, 50);
      const html = `
        <div class="anki-question-box">
          <span class="anki-question-badge tts-ignore">❓ 문제 (Question)</span>
          ${convertDirectTextToMemoryOnHtml(qText, true)}
        </div>
        <div class="anki-answer-divider tts-ignore">💡 정답 및 해설 (클릭 또는 Enter로 확인)</div>
        ${convertDirectTextToMemoryOnHtml(aText, false)}
      `;

      toSave.push({
        id: `batch-${now}-${idx}`,
        order: cards.length + toSave.length + 1,
        subject: subject,
        title: shortTitle,
        html: html,
        rawFront: qText,
        rawBack: aText,
        cardMode: 'basic',
        interval: 0,
        repetitions: 0,
        lapses: 0,
        flag: flagVal,
        suspended: false,
        buriedDate: '',
        dueDate: 0,
        starred: starred,
        memo: memoPart
      });
    });
  }

  if (!toSave.length) {
    alert('생성할 수 있는 카드가 없습니다.');
    return;
  }

  await dbSaveBatch(toSave);
  cards = await dbGetAll();
  cards.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  populateSubjectDropdown();
  applyFilter();

  document.getElementById('direct-batch-textarea').value = '';
  alert(`🎉 [${subject}] 과목에 총 ${toSave.length}개의 암기 카드가 일괄 등록되었습니다!`);
  switchTab('study');
  renderSelectedCard(toSave[0].id);
}

/* =========================================================================
   ★ 🎙️ 카드별 오디오 낭독 대본 편집기 & 🗣️ 발음 교정 사전 모달 ★
   ========================================================================= */

function injectTtsScriptAndPronButtons() {
  const ttsBar = document.querySelector('.tts-player-bar > div:first-child');
  if (ttsBar && !document.getElementById('tts-script-edit-btn')) {
    const scriptBtn = document.createElement('button');
    scriptBtn.id = 'tts-script-edit-btn';
    scriptBtn.type = 'button';
    scriptBtn.className = 'btn btn-outline';
    scriptBtn.style.borderColor = '#8b5cf6';
    scriptBtn.style.color = '#6d28d9';
    scriptBtn.title = '현재 카드의 TTS 낭독 대본을 줄 단위로 직접 수정하거나 특정 줄을 건너뛰게 설정합니다';
    scriptBtn.innerHTML = '🎙️ 낭독편집';
    scriptBtn.onclick = () => openTtsScriptEditorModal();
    ttsBar.appendChild(scriptBtn);

    const pronBtn = document.createElement('button');
    pronBtn.id = 'tts-pron-dict-btn';
    pronBtn.type = 'button';
    pronBtn.className = 'btn btn-outline';
    pronBtn.style.borderColor = '#0d9488';
    pronBtn.style.color = '#0f766e';
    pronBtn.title = '자주 어색하게 읽히는 약어·한자어·수식의 발음을 원하는 한글 발음으로 등록합니다';
    pronBtn.innerHTML = '🗣️ 발음교정';
    pronBtn.onclick = () => openPronunciationDictModal();
    ttsBar.appendChild(pronBtn);
  }
  ensureTtsModalsCreated();
}

function updateTtsScriptButtonBadge(card) {
  const btn = document.getElementById('tts-script-edit-btn');
  if (!btn) return;
  if (card && Array.isArray(card.customTtsScript) && card.customTtsScript.length > 0) {
    btn.innerHTML = '🎙️ 낭독편집 (커스텀ON)';
    btn.style.background = '#f3e8ff';
  } else {
    btn.innerHTML = '🎙️ 낭독편집';
    btn.style.background = '';
  }
}

function ensureTtsModalsCreated() {
  if (document.getElementById('tts-script-modal')) return;

  const modalWrap = document.createElement('div');
  modalWrap.innerHTML = `
    <!-- 1. 카드별 오디오 낭독 대본 편집 모달 -->
    <div id="tts-script-modal" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.75); z-index:9600; align-items:center; justify-content:center; padding:16px;">
      <div style="background:var(--card-bg); color:var(--text); width:100%; max-width:780px; max-height:88vh; border-radius:16px; border:2px solid #8b5cf6; box-shadow:0 20px 50px rgba(0,0,0,0.4); display:flex; flex-direction:column; overflow:hidden;">
        <div style="padding:14px 18px; background:var(--surface-bg); border-bottom:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:800;">🎙️ 현재 카드 오디오 낭독 대본(Script) 편집기</h3>
            <p style="font-size:0.78rem; color:var(--sub-text);">아나운서가 읽을 멘트를 직접 수정하거나, 읽기 싫은 줄은 체크를 해제(🔇)하세요. (본문 화면은 바뀌지 않고 음성만 바뀝니다)</p>
          </div>
          <button type="button" class="btn btn-outline" onclick="closeTtsScriptEditorModal()">✖ 닫기</button>
        </div>

        <div id="tts-script-rows-container" style="padding:14px 18px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:8px;"></div>

        <div style="padding:12px 18px; background:var(--surface-bg); border-top:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="btn btn-outline" onclick="addTtsScriptCustomRow()">➕ 낭독 줄 추가</button>
            <button type="button" class="btn btn-outline" style="color:#e11d48;" onclick="resetCurrentCardTtsScript()">🔄 본문 자동추출로 초기화</button>
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="btn btn-step" onclick="saveCurrentCardTtsScript(true)">▶ 저장 후 바로 전체 들어보기</button>
            <button type="button" class="btn btn-primary" onclick="saveCurrentCardTtsScript(false)">💾 낭독 대본 저장</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 글로벌 발음 교정 사전 모달 -->
    <div id="tts-pron-modal" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.75); z-index:9600; align-items:center; justify-content:center; padding:16px;">
      <div style="background:var(--card-bg); color:var(--text); width:100%; max-width:680px; max-height:88vh; border-radius:16px; border:2px solid #0d9488; box-shadow:0 20px 50px rgba(0,0,0,0.4); display:flex; flex-direction:column; overflow:hidden;">
        <div style="padding:14px 18px; background:var(--surface-bg); border-bottom:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="font-size:1.05rem; font-weight:800;">🗣️ 나만의 TTS 발음 교정 사전 & 낭독 규칙</h3>
            <p style="font-size:0.78rem; color:var(--sub-text);">여기에 등록한 단어는 모든 카드에서 지정한 한글 발음으로 자동 변환되어 읽힙니다. ((1)→일번 교정은 기본 내장됨)</p>
          </div>
          <button type="button" class="btn btn-outline" onclick="closePronunciationDictModal()">✖ 닫기</button>
        </div>

        <div style="padding:14px 18px; overflow-y:auto; flex:1;">
          <div style="background:var(--surface-bg); padding:10px 12px; border-radius:10px; margin-bottom:12px; border:1px solid var(--card-border);">
            <label style="font-weight:800; font-size:0.85rem; cursor:pointer; display:flex; align-items:center; gap:6px;">
              <input type="checkbox" id="tts-skip-paren-chk">
              🔇 괄호 ( ) 안의 부연 설명은 읽지 않고 건너뛰기 (단, (1)·(2) 같은 번호는 정상 낭독)
            </label>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="font-size:0.85rem;">📋 표기 단어 → 실제 읽을 발음 목록</strong>
            <button type="button" class="btn btn-outline" style="padding:4px 10px; font-size:0.78rem;" onclick="addPronunciationRuleRow('', '')">➕ 새 단어 추가</button>
          </div>

          <div id="tts-pron-rows-container" style="display:flex; flex-direction:column; gap:6px;"></div>
        </div>

        <div style="padding:12px 18px; background:var(--surface-bg); border-top:1px solid var(--card-border); display:flex; justify-content:space-between; align-items:center;">
          <button type="button" class="btn btn-outline" style="font-size:0.78rem;" onclick="resetDefaultPronunciationRules()">기본 사전 복원</button>
          <button type="button" class="btn btn-primary" onclick="savePronunciationModalChanges()">💾 발음 사전 저장 및 적용</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalWrap);
}

// 단일 문장 즉시 미리듣기
function previewSingleTtsLine(rawText) {
  if (!('speechSynthesis' in window)) return;
  stopTtsPlayback();
  const spoken = refineTextForKoreanSpeech(rawText);
  if (!spoken) return;

  const annSel = document.getElementById('tts-announcer-select');
  const rateSel = document.getElementById('tts-rate-select');
  const presetKey = annSel ? annSel.value : 'google_std';
  const userRateMult = parseFloat(rateSel ? rateSel.value : '1.0') || 1.0;
  const preset = GOOGLE_ANNOUNCER_PRESETS[presetKey] || GOOGLE_ANNOUNCER_PRESETS.google_std;

  const utter = new SpeechSynthesisUtterance(spoken);
  utter.lang = 'ko-KR';
  const selectedVoice = pickBestGoogleKoreanVoice(presetKey);
  if (selectedVoice) utter.voice = selectedVoice;
  const isNaturalVoice = selectedVoice && /natural|online/i.test(selectedVoice.name);
  utter.pitch = isNaturalVoice ? (presetKey === 'google_bright' ? 1.03 : 1.0) : preset.pitch;
  utter.rate = Math.min(2.0, Math.max(0.7, +(preset.baseRate * userRateMult).toFixed(2)));
  window.speechSynthesis.speak(utter);
}

// 🎙️ 오디오 낭독 대본 편집 모달 열기
function openTtsScriptEditorModal() {
  ensureTtsModalsCreated();
  stopTtsPlayback();
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;

  const defaultQueue = buildDefaultTtsQueueFromDom(card);
  let scriptItems = [];

  if (Array.isArray(card.customTtsScript) && card.customTtsScript.length > 0) {
    scriptItems = card.customTtsScript.map(item => ({
      enabled: item.enabled !== false,
      text: item.text || ''
    }));
  } else {
    scriptItems = defaultQueue.map(q => ({
      enabled: true,
      text: q.text.replace(/\.$/, '')
    }));
  }

  const container = document.getElementById('tts-script-rows-container');
  container.innerHTML = '';
  scriptItems.forEach((item, idx) => {
    appendTtsScriptRowElement(container, idx + 1, item.enabled, item.text);
  });

  document.getElementById('tts-script-modal').style.display = 'flex';
}

function appendTtsScriptRowElement(container, num, enabled, textVal) {
  const row = document.createElement('div');
  row.className = 'tts-script-edit-row';
  row.style.cssText = 'display:flex; align-items:center; gap:6px; background:var(--surface-bg); padding:6px 8px; border-radius:8px; border:1px solid var(--card-border);';
  row.innerHTML = `
    <input type="checkbox" class="tts-row-chk" ${enabled ? 'checked' : ''} title="체크 해제 시 이 줄은 읽지 않고 건너뜁니다" style="width:17px; height:17px; cursor:pointer;">
    <span style="font-size:0.76rem; font-weight:800; color:var(--sub-text); min-width:26px;">#${num}</span>
    <input type="text" class="tts-row-input editor-input" style="flex:1; padding:6px 10px; font-size:0.85rem;" value="${(textVal || '').replace(/"/g, '&quot;')}">
    <button type="button" class="btn btn-outline" style="padding:5px 8px; font-size:0.75rem;" onclick="previewSingleTtsLine(this.previousElementSibling.value)" title="이 줄만 미리 들어보기">▶ 듣기</button>
    <button type="button" class="btn btn-outline" style="padding:5px 8px; font-size:0.75rem; color:#e11d48;" onclick="this.parentElement.remove()" title="이 줄 삭제">🗑️</button>
  `;
  container.appendChild(row);
}

function addTtsScriptCustomRow() {
  const container = document.getElementById('tts-script-rows-container');
  const nextNum = container.querySelectorAll('.tts-script-edit-row').length + 1;
  appendTtsScriptRowElement(container, nextNum, true, '');
}

async function resetCurrentCardTtsScript() {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;
  if (!confirm('직접 편집한 낭독 대본을 지우고 본문 자동 추출 상태로 되돌리시겠습니까?')) return;
  delete card.customTtsScript;
  await dbSaveBatch([card]);
  updateTtsScriptButtonBadge(card);
  openTtsScriptEditorModal();
}

async function saveCurrentCardTtsScript(playImmediately) {
  const card = cards.find(c => c.id === currentCardId);
  if (!card) return;
  const rows = Array.from(document.querySelectorAll('#tts-script-rows-container .tts-script-edit-row'));
  const savedList = rows.map(r => ({
    enabled: r.querySelector('.tts-row-chk').checked,
    text: r.querySelector('.tts-row-input').value.trim()
  })).filter(item => item.text.length > 0);

  card.customTtsScript = savedList;
  await dbSaveBatch([card]);
  updateTtsScriptButtonBadge(card);
  closeTtsScriptEditorModal();

  if (playImmediately) {
    speakCurrentCard();
  }
}

function closeTtsScriptEditorModal() {
  const m = document.getElementById('tts-script-modal');
  if (m) m.style.display = 'none';
}

// 🗣️ 글로벌 발음 교정 사전 모달 열기
function openPronunciationDictModal() {
  ensureTtsModalsCreated();
  stopTtsPlayback();

  const chk = document.getElementById('tts-skip-paren-chk');
  if (chk) chk.checked = getTtsSkipParenthesesOption();

  const container = document.getElementById('tts-pron-rows-container');
  container.innerHTML = '';
  const rules = getCustomPronunciationRules();
  rules.forEach(r => addPronunciationRuleRow(r.from, r.to));

  document.getElementById('tts-pron-modal').style.display = 'flex';
}

function addPronunciationRuleRow(fromVal = '', toVal = '') {
  const container = document.getElementById('tts-pron-rows-container');
  const row = document.createElement('div');
  row.className = 'tts-pron-rule-row';
  row.style.cssText = 'display:flex; align-items:center; gap:6px;';
  row.innerHTML = `
    <input type="text" class="pron-from editor-input" placeholder="원래 표기 (예: 옥내소화전, CO2)" style="flex:1; padding:6px 10px; font-size:0.84rem;" value="${(fromVal || '').replace(/"/g, '&quot;')}">
    <span style="font-weight:800; color:var(--sub-text);">→</span>
    <input type="text" class="pron-to editor-input" placeholder="읽을 발음 (예: 옹내소화전, 이산화탄소)" style="flex:1; padding:6px 10px; font-size:0.84rem;" value="${(toVal || '').replace(/"/g, '&quot;')}">
    <button type="button" class="btn btn-outline" style="padding:5px 8px; font-size:0.75rem;" onclick="previewSingleTtsLine(this.previousElementSibling.value)" title="발음 들어보기">🔊</button>
    <button type="button" class="btn btn-outline" style="padding:5px 8px; font-size:0.75rem; color:#e11d48;" onclick="this.parentElement.remove()">✖</button>
  `;
  container.appendChild(row);
}

function resetDefaultPronunciationRules() {
  saveCustomPronunciationRules(DEFAULT_PRONUNCIATION_RULES);
  openPronunciationDictModal();
}

function savePronunciationModalChanges() {
  const chk = document.getElementById('tts-skip-paren-chk');
  if (chk) {
    localStorage.setItem('memoryon_tts_skip_paren', chk.checked ? '1' : '0');
  }

  const rows = Array.from(document.querySelectorAll('#tts-pron-rows-container .tts-pron-rule-row'));
  const nextRules = rows.map(r => ({
    from: r.querySelector('.pron-from').value.trim(),
    to: r.querySelector('.pron-to').value.trim()
  })).filter(item => item.from.length > 0 && item.to.length > 0);

  saveCustomPronunciationRules(nextRules);
  closePronunciationDictModal();
  alert('✅ 발음 교정 사전 및 낭독 규칙이 저장되었습니다!');
}

function closePronunciationDictModal() {
  const m = document.getElementById('tts-pron-modal');
  if (m) m.style.display = 'none';
}

/* =========================================================================
   글로벌 키보드 단축키 (학습 뷰 & 직접추가 에디터 뷰)
   ========================================================================= */
document.addEventListener('keydown', (e) => {
  const activeTag = document.activeElement ? document.activeElement.tagName : '';
  const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag) || document.activeElement?.isContentEditable;

  const addSec = document.getElementById('view-add');
  if (addSec && addSec.classList.contains('active')) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (directAddMode === 'batch') registerDirectBatchCards();
      else saveDirectCard(true);
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.code === 'KeyC' || e.code === 'KeyB')) {
      e.preventDefault();
      insertEditorSyntax(e.code === 'KeyC' ? 'red' : 'blue');
      return;
    }
    return;
  }

  if (isTyping) return;
  const studySec = document.getElementById('view-study');
  if (!studySec || !studySec.classList.contains('active')) return;

  if (e.altKey && /^Digit[0-6]$/.test(e.code)) {
    e.preventDefault();
    const fNum = parseInt(e.code.replace('Digit', ''), 10);
    setCardFlag(fNum);
    return;
  }

  if (e.code === 'Space') {
    e.preventDefault();
    toggleAllMasksQuick();
  } else if (e.code === 'Enter' || e.code === 'KeyE') {
    e.preventDefault();
    revealNextMask();
  } else if (e.code === 'KeyT') {
    e.preventDefault();
    speakCurrentCard();
  } else if (e.code === 'KeyR') {
    e.preventDefault();
    cycleTtsPlayMode();
  } else if (e.code === 'KeyZ') {
    e.preventDefault();
    undoLastGrade();
  } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
    const rating = parseInt(e.code.replace('Digit', ''), 10) - 1;
    gradeCard(rating);
  } else if (e.code === 'KeyS') {
    e.preventDefault();
    toggleStarCurrentCard();
  } else if (e.key === 'ArrowRight') {
    nextCard();
  } else if (e.key === 'ArrowLeft') {
    prevCard();
  }
});
