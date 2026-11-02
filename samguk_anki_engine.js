/**
 * ⚔️ 삼국지 × 소방기술사 정통 Anki & 기억의 궁전 코어 엔진 (samguk_anki_engine.js)
 * [100% 전체 함수 무손실 통합 완성본]
 */

window.STUDY_TOPICS = window.STUDY_TOPICS || [];
window.MEMORY_PALACES = window.MEMORY_PALACES || {};

const INITIAL_FILE_TOPIC_IDS = new Set((window.STUDY_TOPICS || []).map(t => t.id));
const BUILTIN_PALACE_SAFETY = {};

window.state = window.state || {
  topicIdx: Number(localStorage.getItem('samguk_last_topic_idx')) || 0,
  selectedVoiceURI: localStorage.getItem('maple_edge_voice_uri') || '',
  ttsRate: Number(localStorage.getItem('maple_edge_tts_rate') || localStorage.getItem('maple_tts_rate')) || 1.05,
  autoReadQ: false,
  radioMode: false,
  clozeStage: 0
};

const POPULAR_FONTS_30 = [
  { name: '1. 함초롬돋움 (기본 수험표준)', family: "'HCR Dotum', sans-serif" },
  { name: '2. 쿠키런체 (선명한 굵은 타이틀)', family: "'CookieRun-Regular', sans-serif" },
  { name: '3. 프리텐다드 (Pretendard)', family: "'Pretendard', sans-serif" },
  { name: '4. 리디바탕 (전자책 명조)', family: "'RIDIBatang', serif" },
  { name: '5. 고운돋움 (부드러운 돋움)', family: "'Gowun Dodum', sans-serif" },
  { name: '6. 고운바탕 (부드러운 바탕)', family: "'Gowun Batang', serif" },
  { name: '7. 마루부리 (깔끔한 정통명조)', family: "'MaruBuri', serif" },
  { name: '8. 나눔스퀘어네오', family: "'NanumSquareNeo', sans-serif" },
  { name: '9. 지마켓산스 (Gmarket Sans)', family: "'GmarketSansMedium', sans-serif" },
  { name: '10. 스위트 (SUITE 정돈된 고딕)', family: "'SUITE-Regular', sans-serif" },
  { name: '11. 본고딕 (Noto Sans KR)', family: "'Noto Sans KR', sans-serif" },
  { name: '12. 본명조 (Noto Serif KR)', family: "'Noto Serif KR', serif" },
  { name: '13. IBM Plex Sans KR', family: "'IBM Plex Sans KR', sans-serif" },
  { name: '14. 함렛 (Hahmlet 굵은 세리프)', family: "'Hahmlet', serif" },
  { name: '15. 나눔고딕 (Nanum Gothic)', family: "'Nanum Gothic', sans-serif" },
  { name: '16. 나눔명조 (Nanum Myeongjo)', family: "'Nanum Myeongjo', serif" },
  { name: '17. 송명 (Song Myung 고전명조)', family: "'Song Myung', serif" },
  { name: '18. 검은고딕 (Black Han Sans)', family: "'Black Han Sans', sans-serif" },
  { name: '19. 맑은 고딕 (Windows 기본)', family: "'Malgun Gothic', sans-serif" },
  { name: '20. 바른바탕', family: "'BareunBatang', 'Noto Serif KR', serif" },
  { name: '21. 나눔바른고딕', family: "'NanumBarunGothic', 'Nanum Gothic', sans-serif" },
  { name: '22. 나눔스퀘어라운드', family: "'NanumSquareRound', 'Pretendard', sans-serif" },
  { name: '23. 에스코어드림 (S-Core Dream)', family: "'S-Core Dream', 'Pretendard', sans-serif" },
  { name: '24. 스포카한산스네오', family: "'Spoqa Han Sans Neo', 'Pretendard', sans-serif" },
  { name: '25. 코펍바탕', family: "'KoPub Batang', 'Noto Serif KR', serif" },
  { name: '26. 코펍돋움', family: "'KoPub Dotum', 'Noto Sans KR', sans-serif" },
  { name: '27. 바탕체 (정통 수험서)', family: "Batang, 'Noto Serif KR', serif" },
  { name: '28. 돋움체 (클래식)', family: "Dotum, 'Noto Sans KR', sans-serif" },
  { name: '29. 굴림체', family: "Gulim, sans-serif" },
  { name: '30. 궁서체 (붓글씨)', family: "Gungsuh, serif" }
];

const ZOOM_STEPS = [1, 1.15, 1.3, 1.5, 1.75, 2];

const BATTLEFIELD_RIVALS = {
  redcliff: {
    bg: "samguk_library/bg_redcliff.png",
    text: "주유 vs 조조 (적벽대전)",
    boss: "적장 조조",
    allySheet: "samguk_library/heroes_2x4_01.png",
    allyPos: "100% 0%",
    enemySheet: "samguk_library/heroes_2x4_01.png",
    enemyPos: "33.33% 100%"
  },
  hulao: {
    bg: "samguk_library/bg_hulao.png",
    text: "관우 vs 여포 (호로관)",
    boss: "무신 여포",
    allySheet: "samguk_library/heroes_2x4_01.png",
    allyPos: "33.33% 0%",
    enemySheet: "samguk_library/heroes_2x4_01.png",
    enemyPos: "0% 100%"
  },
  paljindo: {
    bg: "samguk_library/bg_paljindo.png",
    text: "제갈량 vs 사마의 (오장원)",
    boss: "중달 사마의",
    allySheet: "samguk_library/heroes_2x4_01.png",
    allyPos: "0% 0%",
    enemySheet: "samguk_library/heroes_2x4_01.png",
    enemyPos: "66.66% 100%"
  },
  worldmap: {
    bg: "samguk_library/san3.png",
    text: "유비 vs 장료 (천하통일 13주)",
    boss: "명장 장료",
    allySheet: "samguk_library/heroes_2x4_02.png",
    allyPos: "0% 0%",
    enemySheet: "samguk_library/heroes_2x4_02.png",
    enemyPos: "0% 100%"
  }
};

function getFireSubjectIconClass(categoryStr) {
  const c = (categoryStr || '').trim();
  if (c.includes('경보') || c.includes('감지')) return 's-fire c-00';
  if (c.includes('수계') || c.includes('스프링')) return 's-fire c-01';
  if (c.includes('가스') || c.includes('이산화') || c.includes('할론')) return 's-fire c-02';
  if (c.includes('전기') || c.includes('회로')) return 's-fire c-10';
  if (c.includes('제연') || c.includes('방화')) return 's-fire c-11';
  if (c.includes('피난') || c.includes('구조')) return 's-fire c-12';
  if (c.includes('화재') || c.includes('연소') || c.includes('성상')) return 's-fire c-20';
  if (c.includes('법규') || c.includes('기준')) return 's-fire c-21';
  return 's-fire c-22';
}

let currentMainMode = 'samguk';
let ankiQueue = [];
let ankiCurrentIdx = 0;
let ankiIsFlipped = false;
let ankiStepClearedState = false;
let ankiOrderMode = 'seq';
let clozeHintChosung = false;
let masterMaskOn = true;
let stageBeforeUnmask = 2;

let cardTtsFullSentence = true;
let wrongTargetIds = new Set();
let undoStack = [];

let cardLapseCounts = {};
let graduatedCardMap = {};
let diagramCustomConfigMap = {};
let diagramEditModeOn = false;

let speedTimerEnabled = false;
let speedTimerInterval = null;
let speedTimerRemainMs = 6000;
const SPEED_LIMIT_MS = 6000;

let currentPalaceObj = null;
let currentTopicHasRealPalace = false;
let currentPinIdx = 0;
let currentPinRevealed = false;
let palaceClearedSet = new Set();
let palaceCameraZoomOn = false;
let palaceEditMode = false;
let draggingPinIdx = -1;
let dragMovedFlag = false;

let palaceUndoStack = [];
let palaceRedoStack = [];

let cachedPalacesFileHandle = null;
let cachedTopicsFileHandle = null;

let sgAreaSelectMode = false;
let sgSelectedElements = [];
let sgAreaLoopOn = false;
let sgAreaReadingFlag = false;
let activeRecallTtsMode = false;
let isBootRestoring = false;

window.addEventListener('DOMContentLoaded', () => {
  fixFaviconAndModalButtonsOnBoot();
  injectCustomStageStyles();
  injectPalaceUndoButtonsUI();
  loadLocalCachedData();
  initFontDropdownUI();
  initCategoryAndTopicSelectors();
  initStageResizeDrag();
  initSubnoteAreaSelectionEvents();
  initFloatingRemoteDrag();
  initDiagramManualClickEdit();
  initPalaceCanvasDoubleClickAdd();

  if (typeof window.initEdgeTtsVoices === 'function') {
    window.initEdgeTtsVoices();
  }

  const savedFont = localStorage.getItem('samguk_subnote_font');
  if (savedFont) applySubnoteFont(savedFont, localStorage.getItem('samguk_subnote_font_name') || '함초롬돋움');

  const savedSkin = localStorage.getItem('samguk_paper_skin') || 'skin-hanji';
  const skinSel = document.getElementById('paperSkinSelect');
  if (skinSel) skinSel.value = savedSkin;
  applyPaperSkin(savedSkin);

  const savedZoom = Number(localStorage.getItem('samguk_global_zoom')) || 1;
  applyGlobalZoom(savedZoom);

  const savedStageH = localStorage.getItem('samguk_stage_height');
  if (savedStageH) {
    document.documentElement.style.setProperty('--stage-height', savedStageH + 'px');
  }

  changeBattleTheme('redcliff');

  const restored = restoreLastStudySessionOnBoot();
  if (!restored) {
    const startIdx = Number(localStorage.getItem('samguk_last_topic_idx')) || 0;
    loadTopic(startIdx);
  }

  const btnZ = document.getElementById('btnPalaceZoomToggle');
  const txtZ = document.getElementById('palaceZoomBtnText');
  if (btnZ && txtZ) {
    btnZ.classList.toggle('teal-active', palaceCameraZoomOn);
    txtZ.textContent = palaceCameraZoomOn ? '현재 거점 클로즈업 ON' : '전체그림 고정 (한눈에 보기)';
  }

  syncMaskToggleButtonsUI();
});

window.addEventListener('beforeunload', () => {
  saveCurrentStudySession();
});

function fixFaviconAndModalButtonsOnBoot() {
  try {
    const fav = document.querySelector('link[rel="icon"]');
    if (fav && fav.getAttribute('href') === 'ui_study_icons_3x3_8.ico') {
      fav.setAttribute('href', 'samguk_library/ui_study_icons_3x3_8.ico');
    }

    const modalBody = document.querySelector('#topicManagerModal .modal-body');
    if (modalBody) {
      const btns = Array.from(modalBody.querySelectorAll('button'));
      btns.forEach(b => {
        const oc = b.getAttribute('onclick') || '';
        if (oc.includes('savePalacesDataJsFileDirectly') || oc.includes('saveTopicsDataJsFileDirectly')) {
          b.remove();
        } else if (oc.includes('injectTopicJsonNow')) {
          b.className = 'btn-gold teal-active';
          b.style.cssText = 'flex:1; justify-content:center; height:40px; font-size:14px;';
          b.innerHTML = '🚀 데이터 투입 및 자동 영구저장 (topics_data.js + palaces_data.js 동시 저장)';
        }
      });
    }
  } catch (e) {}
}

function injectCustomStageStyles() {
  const st = document.createElement('style');
  st.textContent = `
      .cloze-diagram-wrap {
      position: relative; display: block; width: 100%; margin: 8px 0;
      border-radius: 10px; overflow: visible;
    }
    .cloze-diagram-toolbar {
      display: flex; justify-content: flex-end; align-items: center;
      gap: 6px; margin-bottom: 5px; padding: 2px 4px;
      opacity: 0; pointer-events: none; transition: opacity 0.18s ease;
    }
    .cloze-diagram-wrap:hover .cloze-diagram-toolbar,
    body.diagram-edit-on .cloze-diagram-toolbar {
      opacity: 1; pointer-events: auto;
    }
    .diag-ctrl-btn {
      display: inline-flex; align-items: center; gap: 5px;
      background: linear-gradient(180deg, #ffffff 0%, #fef3c7 100%);
      color: #78350f; border: 1.5px solid #d97706;
      border-radius: 7px; padding: 4px 10px; height: 26px;
      font-size: 11.5px; font-weight: 800; line-height: 1;
      cursor: pointer; white-space: nowrap;
      box-shadow: 0 2px 5px rgba(217, 119, 6, 0.15);
    }
    .diag-ctrl-btn:hover {
      background: #fde68a; border-color: #b45309; transform: translateY(-1px);
    }
    .diag-ctrl-btn.off {
      background: #f1f5f9; color: #64748b; border-color: #cbd5e1; box-shadow: none;
    }
    .cloze-diagram-mask {
      position: absolute; inset: 26px 0 0 0; z-index: 25;
      background: linear-gradient(135deg, rgba(254, 243, 199, 0.98), rgba(253, 230, 138, 0.98)) !important;
      border: 2px dashed #d97706 !important; border-radius: 10px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: #78350f !important; font-weight: 900 !important; font-size: 14px !important;
      cursor: pointer; gap: 6px; padding: 12px; text-align: center;
      box-shadow: inset 0 0 20px rgba(217, 119, 6, 0.15);
    }
    .cloze-diagram-mask.current-anki-target {
      background: linear-gradient(135deg, #fef08a, #f59e0b) !important;
      border: 2.5px solid #92400e !important; color: #451a03 !important;
    }
    .cloze-diagram-wrap.revealed .cloze-diagram-mask,
    .peek-all-mode .cloze-diagram-mask { display: none !important; }

    .palace-pin-tag {
      position: absolute !important;
      top: 94% !important; left: 50% !important;
      transform: translateX(-50%) !important;
      background: rgba(15, 23, 42, 0.94) !important;
      color: #fde047 !important;
      border: 1.5px solid #f59e0b !important;
      border-radius: 6px !important;
      padding: var(--palace-tag-pad, 2px 8px) !important;
      font-size: var(--palace-tag-size, 11.5px) !important;
      font-weight: 900 !important;
      white-space: nowrap !important;
      pointer-events: none !important;
      box-shadow: 0 3px 10px rgba(0,0,0,0.75) !important;
      transition: font-size 0.12s ease, padding 0.12s ease !important;
    }
    .palace-pin-num {
      font-size: var(--palace-num-size, 13px) !important;
    }
    .palace-pin.state-cleared .palace-pin-tag {
      background: rgba(6, 78, 59, 0.95) !important;
      color: #a7f3d0 !important;
      border-color: #34d399 !important;
    }
    .palace-pin.sg-area-picked {
      outline: 4px solid #10b981 !important;
      border-radius: 999px !important;
      box-shadow: 0 0 22px rgba(16, 185, 129, 0.95) !important;
    }
    .palace-pin.sg-area-reading {
      outline: 4px solid #fde047 !important;
      box-shadow: 0 0 26px rgba(250, 204, 21, 1) !important;
    }
    .palace-empty-notice {
      position: absolute; inset: 0; z-index: 30;
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(4px);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: #f8fafc; text-align: center; padding: 24px; gap: 12px;
    }
    .palace-zone-guide-overlay {
      position: absolute; inset: 0; pointer-events: none; z-index: 6;
      display: none;
    }
    .palace-zone-guide-overlay.active {
      display: block;
    }
    .palace-zone-divider {
      position: absolute; top: 0; bottom: 0; width: 0;
      border-left: 2px dashed rgba(253, 224, 71, 0.78);
      box-shadow: 0 0 8px rgba(0,0,0,0.6);
    }
    .palace-zone-badge {
      position: absolute; top: 8px; transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.85); color: #fde047;
      border: 1px solid #f59e0b; border-radius: 99px;
      padding: 2px 10px; font-size: 11px; font-weight: 900;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(st);
}

function injectPalaceUndoButtonsUI() {
  const editBtn = document.getElementById('btnPalaceEditMode');
  if (!editBtn || document.getElementById('btnPalaceUndo')) return;

  const undoBtn = document.createElement('button');
  undoBtn.id = 'btnPalaceUndo';
  undoBtn.className = 'btn-gold';
  undoBtn.title = '기억의 궁전 직전 편집 되돌리기 (단축키 Ctrl+Z)';
  undoBtn.innerHTML = `↩️ 되돌리기(<b id="palaceUndoCount">0</b>)`;
  undoBtn.onclick = () => undoPalaceEdit();

  const redoBtn = document.createElement('button');
  redoBtn.id = 'btnPalaceRedo';
  redoBtn.className = 'btn-gold';
  redoBtn.title = '기억의 궁전 되돌린 편집 다시 실행 (단축키 Ctrl+Y)';
  redoBtn.innerHTML = `↪️ 다시실행(<b id="palaceRedoCount">0</b>)`;
  redoBtn.onclick = () => redoPalaceEdit();

  editBtn.parentNode.insertBefore(undoBtn, editBtn);
  editBtn.parentNode.insertBefore(redoBtn, editBtn);

  if (!document.getElementById('palaceFontSizeCtrlWrap')) {
    const fontWrap = document.createElement('span');
    fontWrap.id = 'palaceFontSizeCtrlWrap';
    fontWrap.style.cssText = 'display:inline-flex; align-items:center; gap:3px; background:#f0fdfa; border:1.5px solid #5eead4; border-radius:999px; padding:2px 6px; height:32px;';
    fontWrap.innerHTML = `
      <button type="button" class="btn-gold" style="height:24px; padding:0 8px; font-size:11.5px; border:none; box-shadow:none;" onclick="adjustPalacePinFontSize(-1)" title="거점 글씨 작게">🔤-</button>
      <span id="palacePinFontSizeBadge" onclick="resetPalacePinFontSize()" style="font-size:11.5px; font-weight:900; color:#0f766e; min-width:38px; text-align:center; cursor:pointer;" title="클릭하면 기본 크기(11.5px)로 초기화">11.5px</span>
      <button type="button" class="btn-gold" style="height:24px; padding:0 8px; font-size:11.5px; border:none; box-shadow:none;" onclick="adjustPalacePinFontSize(1)" title="거점 글씨 크게">🔤+</button>
    `;
    editBtn.parentNode.appendChild(fontWrap);
    applyPalacePinFontSize(parseFloat(localStorage.getItem('samguk_palace_pin_font_size')) || 11.5);
  }

  const mover = document.getElementById('palaceCanvasMover');
  if (mover && !document.getElementById('palaceZoneGuideOverlay')) {
    const guide = document.createElement('div');
    guide.id = 'palaceZoneGuideOverlay';
    guide.className = 'palace-zone-guide-overlay';
    guide.innerHTML = `
      <div class="palace-zone-divider" style="left:33.5%;"></div>
      <div class="palace-zone-divider" style="left:66.5%;"></div>
      <div class="palace-zone-badge" style="left:17%;">1구역(좌측): 위➔아래 번호</div>
      <div class="palace-zone-badge" style="left:50%;">2구역(중앙): 위➔아래 번호</div>
      <div class="palace-zone-badge" style="left:83%;">3구역(우측): 위➔아래 번호</div>
      <div style="position:absolute; bottom:8px; left:50%; transform:translateX(-50%); background:rgba(15,23,42,0.88); color:#a7f3d0; border:1px solid #10b981; border-radius:99px; padding:3px 12px; font-size:11.5px; font-weight:900; white-space:nowrap;">
        💡 빈 공간을 더블클릭하면 그 자리에 새 거점이 추가되고 뒷번호가 자동으로 +1씩 밀립니다! (드래그 시 자동 재정렬 / Ctrl+Z 되돌리기)
      </div>
    `;
    mover.appendChild(guide);
  }
}

function applyPalacePinFontSize(sizePx) {
  const clamped = Math.max(8, Math.min(26, Math.round(sizePx * 2) / 2));
  localStorage.setItem('samguk_palace_pin_font_size', String(clamped));
  document.documentElement.style.setProperty('--palace-tag-size', clamped + 'px');
  const padV = Math.max(2, Math.round(clamped * 0.22));
  const padH = Math.max(6, Math.round(clamped * 0.7));
  document.documentElement.style.setProperty('--palace-tag-pad', `${padV}px ${padH}px`);
  const numSize = Math.max(10, Math.min(20, Math.round(clamped + 1.5)));
  document.documentElement.style.setProperty('--palace-num-size', numSize + 'px');
  const badge = document.getElementById('palacePinFontSizeBadge');
  if (badge) badge.textContent = clamped + 'px';
}
window.applyPalacePinFontSize = applyPalacePinFontSize;

function adjustPalacePinFontSize(delta) {
  const cur = parseFloat(localStorage.getItem('samguk_palace_pin_font_size')) || 11.5;
  applyPalacePinFontSize(cur + delta * 1.5);
}
window.adjustPalacePinFontSize = adjustPalacePinFontSize;

function resetPalacePinFontSize() {
  applyPalacePinFontSize(11.5);
}
window.resetPalacePinFontSize = resetPalacePinFontSize;

const EXPLICIT_DELETED_TOPIC_IDS = new Set(JSON.parse(localStorage.getItem('samguk_deleted_topic_ids_v1') || '[]'));
let cachedProjectDirHandle = null;
let autoSavePalaceTimer = null;
let autoSaveTopicsTimer = null;

function openSamengAutoSaveIDB() {
  return new Promise((resolve) => {
    if (!('indexedDB' in window)) return resolve(null);
    const req = indexedDB.open('SamengAutoSaveDB_v1', 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('handles')) db.createObjectStore('handles');
      if (!db.objectStoreNames.contains('backups')) db.createObjectStore('backups');
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => resolve(null);
  });
}

async function idbSetItem(storeName, key, val) {
  const db = await openSamengAutoSaveIDB();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(val, key);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => resolve(false);
  });
}

async function idbGetItem(storeName, key) {
  const db = await openSamengAutoSaveIDB();
  if (!db) return null;
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

let isIdbRestoreCompleted = false;

function loadLocalCachedData() {
  try {
    // 구버전 원문을 되살리던 좀비 캐시(maple_custom_subnote_html_v1) 영구 제거
    localStorage.removeItem('maple_custom_subnote_html_v1');

    cardLapseCounts = JSON.parse(localStorage.getItem('samguk_anki_lapses_v1') || '{}');
    graduatedCardMap = JSON.parse(localStorage.getItem('samguk_anki_graduated_v1') || '{}');
    diagramCustomConfigMap = JSON.parse(localStorage.getItem('samguk_diagram_cfg_v1') || '{}');

    (window.STUDY_TOPICS || []).forEach(t => {
      if (t && t.id && t.memoryPalace && Array.isArray(t.memoryPalace.pins) && t.memoryPalace.pins.length > 0) {
        if (!window.MEMORY_PALACES[t.id]) {
          window.MEMORY_PALACES[t.id] = t.memoryPalace;
        }
        delete t.memoryPalace;
      }
    });

    const rawTopics = localStorage.getItem('samguk_injected_topics_v1');
    if (rawTopics) {
      const arr = JSON.parse(rawTopics);
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          if (!item || !item.id || EXPLICIT_DELETED_TOPIC_IDS.has(item.id)) return;
          if (item.memoryPalace && Array.isArray(item.memoryPalace.pins) && item.memoryPalace.pins.length > 0) {
            window.MEMORY_PALACES[item.id] = item.memoryPalace;
            delete item.memoryPalace;
          }
          const existIdx = window.STUDY_TOPICS.findIndex(t => t.id === item.id);
          if (existIdx >= 0) {
            window.STUDY_TOPICS[existIdx] = Object.assign({}, window.STUDY_TOPICS[existIdx], item);
          } else {
            window.STUDY_TOPICS.push(item);
          }
        });
      }
    }

    const rawPalacesDelta = localStorage.getItem('samguk_palaces_delta_v2');
    if (rawPalacesDelta) {
      const pMap = JSON.parse(rawPalacesDelta);
      Object.keys(pMap).forEach(k => {
        if (EXPLICIT_DELETED_TOPIC_IDS.has(k)) return;
        const cachedPalace = pMap[k];
        if (cachedPalace && Array.isArray(cachedPalace.pins) && cachedPalace.pins.length > 0) {
          window.MEMORY_PALACES[k] = cachedPalace;
        }
      });
    }

    restoreHandlesAndBackupsFromIDB();
  } catch (e) {}
}

async function restoreHandlesAndBackupsFromIDB() {
  try {
    const idbTopics = await idbGetItem('backups', 'all_topics_snapshot');
    const idbPalaces = await idbGetItem('backups', 'all_palaces_snapshot');

    if (idbPalaces && typeof idbPalaces === 'object') {
      Object.keys(idbPalaces).forEach(k => {
        if (EXPLICIT_DELETED_TOPIC_IDS.has(k)) return;
        if (idbPalaces[k] && Array.isArray(idbPalaces[k].pins) && idbPalaces[k].pins.length > 0) {
          window.MEMORY_PALACES[k] = idbPalaces[k];
        }
      });
    }

    if (Array.isArray(idbTopics) && idbTopics.length > 0) {
      idbTopics.forEach(item => {
        if (!item || !item.id || EXPLICIT_DELETED_TOPIC_IDS.has(item.id)) return;
        if (item.memoryPalace && Array.isArray(item.memoryPalace.pins) && item.memoryPalace.pins.length > 0) {
          window.MEMORY_PALACES[item.id] = item.memoryPalace;
          delete item.memoryPalace;
        }
        const existIdx = window.STUDY_TOPICS.findIndex(t => t.id === item.id);
        if (existIdx >= 0) {
          window.STUDY_TOPICS[existIdx] = Object.assign({}, window.STUDY_TOPICS[existIdx], item);
        } else {
          window.STUDY_TOPICS.push(item);
        }
        INITIAL_FILE_TOPIC_IDS.add(item.id);
      });
    }

    // IDB 복구가 끝난 뒤에야 비로소 IDB 저장 잠금을 해제! (부팅 직후 구버전 덮어쓰기 원천 차단)
    isIdbRestoreCompleted = true;

    if ((!Array.isArray(idbTopics) || idbTopics.length === 0) && window.STUDY_TOPICS.length > 0) {
      await idbSetItem('backups', 'all_topics_snapshot', window.STUDY_TOPICS);
    }
    if ((!idbPalaces || Object.keys(idbPalaces).length === 0) && Object.keys(window.MEMORY_PALACES).length > 0) {
      await idbSetItem('backups', 'all_palaces_snapshot', window.MEMORY_PALACES);
    }

    if (window.STUDY_TOPICS.length > 0) {
      initCategoryAndTopicSelectors();
      const safeIdx = Math.max(0, Math.min(window.STUDY_TOPICS.length - 1, window.state.topicIdx || 0));
      loadTopic(safeIdx);
    }
    updateAutoSaveStatusBadgeUI();
  } catch (e) {
    isIdbRestoreCompleted = true;
  }
}

function saveAnkiMetaState() {
  try {
    localStorage.setItem('samguk_anki_lapses_v1', JSON.stringify(cardLapseCounts));
    localStorage.setItem('samguk_anki_graduated_v1', JSON.stringify(graduatedCardMap));
  } catch (e) {}
}

function syncPalaceToMemoryAndCache(topicId, palaceObj, triggerAutoDiskSave = true) {
  if (!topicId || !palaceObj) return;
  window.MEMORY_PALACES[topicId] = JSON.parse(JSON.stringify(palaceObj));
  try {
    const pDelta = JSON.parse(localStorage.getItem('samguk_palaces_delta_v2') || '{}');
    pDelta[topicId] = window.MEMORY_PALACES[topicId];
    localStorage.setItem('samguk_palaces_delta_v2', JSON.stringify(pDelta));
  } catch (e) {}
  idbSetItem('backups', 'all_palaces_snapshot', window.MEMORY_PALACES);

  if (triggerAutoDiskSave) {
    if (autoSavePalaceTimer) clearTimeout(autoSavePalaceTimer);
    autoSavePalaceTimer = setTimeout(() => {
      autoSaveToConnectedFiles({ saveTopics: false, savePalaces: true, silent: true, allowPrompt: false });
    }, 400);
  }
}

function saveCurrentStudySession() {
  if (isBootRestoring) return;
  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (!t) return;

  const revealedIds = [];
  ankiQueue.forEach(q => {
    if (isAnkiItemRevealed(q)) revealedIds.push(q.id);
  });

  const battleSel = document.getElementById('battleThemeSelect');
  const sess = {
    topicId: t.id,
    topicIdx: window.state.topicIdx,
    mainMode: currentMainMode,
    clozeStage: window.state.clozeStage,
    ankiCurrentIdx: ankiCurrentIdx,
    revealedIds: revealedIds,
    currentPinIdx: currentPinIdx,
    currentPinRevealed: currentPinRevealed,
    palaceClearedArr: Array.from(palaceClearedSet),
    battleTheme: battleSel ? battleSel.value : 'redcliff',
    scrollY: window.scrollY || document.documentElement.scrollTop || 0
  };
  try {
    localStorage.setItem('samguk_last_session_v1', JSON.stringify(sess));
  } catch (e) {}
}

function restoreLastStudySessionOnBoot() {
  try {
    const raw = localStorage.getItem('samguk_last_session_v1');
    if (!raw) return false;
    const sess = JSON.parse(raw);
    if (!sess) return false;

    isBootRestoring = true;
    let idx = window.STUDY_TOPICS.findIndex(t => t && t.id === sess.topicId);
    if (idx < 0) idx = Number(sess.topicIdx) || 0;
    idx = Math.max(0, Math.min(window.STUDY_TOPICS.length - 1, idx));

    if (sess.battleTheme && BATTLEFIELD_RIVALS[sess.battleTheme]) {
      const bSel = document.getElementById('battleThemeSelect');
      if (bSel) bSel.value = sess.battleTheme;
      changeBattleTheme(sess.battleTheme);
    }

    if (typeof sess.clozeStage === 'number' && sess.clozeStage >= 0 && sess.clozeStage <= 4) {
      window.state.clozeStage = sess.clozeStage;
    }

    loadTopic(idx);
    setProgressiveStep(window.state.clozeStage);

    if (Array.isArray(sess.revealedIds) && sess.revealedIds.length > 0) {
      const revSet = new Set(sess.revealedIds);
      ankiQueue.forEach(q => {
        if (revSet.has(q.id)) {
          toggleClozeElementReveal(q.el, true);
        }
      });
    }

    if (typeof sess.ankiCurrentIdx === 'number' && sess.ankiCurrentIdx >= 0 && sess.ankiCurrentIdx < ankiQueue.length) {
      ankiCurrentIdx = sess.ankiCurrentIdx;
    }
    loadCurrentAnkiTargetToStage();

    if (Array.isArray(sess.palaceClearedArr)) {
      palaceClearedSet = new Set(sess.palaceClearedArr);
    }
    if (typeof sess.currentPinIdx === 'number') {
      currentPinIdx = sess.currentPinIdx;
    }
    currentPinRevealed = Boolean(sess.currentPinRevealed);
    renderPalacePinsAndRoute();
    updatePalaceSideConsole();

    if (sess.mainMode === 'palace' || sess.mainMode === 'samguk') {
      switchMainStageMode(sess.mainMode);
    }

    if (typeof sess.scrollY === 'number' && sess.scrollY > 40) {
      setTimeout(() => window.scrollTo({ top: sess.scrollY, behavior: 'instant' }), 100);
    }

    isBootRestoring = false;
    syncMaskToggleButtonsUI();
    updateFloatingRemoteUI();
    return true;
  } catch (e) {
    isBootRestoring = false;
    return false;
  }
}

function initCategoryAndTopicSelectors() {
  const topics = window.STUDY_TOPICS || [];
  const catSel = document.getElementById('categorySelect');
  if (!catSel) return;
  const cats = Array.from(new Set(topics.map(t => t.category || '기타')));
  catSel.innerHTML = '<option value="ALL">전체 과목 (' + topics.length + ')</option>';
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    catSel.appendChild(opt);
  });
  filterTopicsList();
}

function filterTopicsList() {
  const topics = window.STUDY_TOPICS || [];
  const cat = document.getElementById('categorySelect')?.value || 'ALL';
  const onlyPalace = document.getElementById('onlyPalaceFilter')?.checked || false;
  const q = (document.getElementById('topicSearchInput')?.value || '').trim().toLowerCase();
  const sel = document.getElementById('topicSelect');
  if (!sel) return;
  sel.innerHTML = '';

  topics.forEach((t, idx) => {
    if (cat !== 'ALL' && (t.category || '기타') !== cat) return;
    const hasPalace = Boolean(window.MEMORY_PALACES[t.id] || t.memoryPalace);
    if (onlyPalace && !hasPalace) return;

    if (q) {
      const hay = ((t.id || '') + ' ' + (t.title || '') + ' ' + (t.summaryHtml || '')).toLowerCase();
      if (!hay.includes(q)) return;
    }

    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${idx + 1}. ${hasPalace ? '🏛️ ' : ''}${t.title || '무제'}`;
    sel.appendChild(opt);
  });
  sel.value = String(window.state.topicIdx);
}

function moveTopic(delta) {
  const topics = window.STUDY_TOPICS || [];
  if (!topics.length) return;
  let next = (window.state.topicIdx + delta + topics.length) % topics.length;
  loadTopic(next);
}

function loadTopic(idx) {
  const topics = window.STUDY_TOPICS || [];
  if (!topics.length) return;
  idx = Math.max(0, Math.min(topics.length - 1, idx));
  window.state.topicIdx = idx;
  localStorage.setItem('samguk_last_topic_idx', String(idx));

  const sel = document.getElementById('topicSelect');
  if (sel) sel.value = String(idx);

  const t = topics[idx];
  document.getElementById('subnoteCategoryBadge').textContent = t.category || '소방기술사';
  document.getElementById('subnoteTitleHeading').textContent = t.title || '';

  const icoCls = getFireSubjectIconClass(t.category);
  document.getElementById('subjectEmblemIcon').className = 'sg-ico lg ' + icoCls;
  document.getElementById('subnoteHeaderIcon').className = 'sg-ico xl ' + icoCls;

  const postitMap = JSON.parse(localStorage.getItem('samguk_postit_notes_v1') || '{}');
  document.getElementById('postitTextarea').value = postitMap[t.id] || '';

  wrongTargetIds.clear();
  undoStack = [];
  palaceUndoStack = [];
  palaceRedoStack = [];
  updatePalaceUndoRedoButtons();
  clearSgSelectedAreas();
  if (typeof window.resetStepReaderCursor === 'function') window.resetStepReaderCursor();

  renderSubnoteAndBuildAnki(window.state.clozeStage);
  initPalaceForCurrentTopic(t);
  syncMaskToggleButtonsUI();
  saveCurrentStudySession();
  updateFloatingRemoteUI();
}

function resetCustomSubnoteHtmlForCurrentTopic() {
  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (!t) return;
  const customMap = JSON.parse(localStorage.getItem('maple_custom_subnote_html_v1') || '{}');
  if (customMap[t.id]) {
    delete customMap[t.id];
    localStorage.setItem('maple_custom_subnote_html_v1', JSON.stringify(customMap));
  }
  renderSubnoteAndBuildAnki(window.state.clozeStage);
  alert('🔄 현재 토픽의 원문이 초기 원본 상태로 복구되었습니다.');
}

function getPalacePinChosungLabel(str, pinNum) {
  return `🔒 [ #${pinNum || '?'} 가림막 ]`;
}

function getSmartHintString(str) {
  const CHO = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const clean = (str || '').trim();
  let hangulCount = 0;
  let out = "";

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    const code = ch.charCodeAt(0) - 44032;
    if (code >= 0 && code <= 11171) {
      hangulCount++;
      out += CHO[Math.floor(code / 588)];
    } else if (/[A-Za-z]/.test(ch)) {
      out += '?';
    } else if (/[0-9]/.test(ch)) {
      out += '#';
    } else {
      out += ch;
    }
  }

  if (hangulCount === 0) {
    if (clean.includes('=') || clean.includes('+') || clean.includes('∑') || clean.includes('Σ')) {
      return `[공식/수식]`;
    }
    return `[영문/숫자 ${clean.length}자]`;
  }
  return out.length > 26 ? out.slice(0, 26) + '...' : out;
}

function syncMaskToggleButtonsUI() {
  const pins = currentPalaceObj?.pins || [];
  let isCurrentlyMasked = masterMaskOn;

  if (currentMainMode === 'palace' && pins.length > 0) {
    const allPalaceOpen = palaceClearedSet.size >= pins.length;
    isCurrentlyMasked = !allPalaceOpen;
  } else {
    const box = document.getElementById('subnoteBox');
    const peekOn = box ? box.classList.contains('peek-all-mode') : false;
    isCurrentlyMasked = (window.state.clozeStage > 0) && !peekOn;
  }

  masterMaskOn = isCurrentlyMasked;

  const hintBtn = document.getElementById('btnHintMode');
  const hintTxt = document.getElementById('hintModeText');
  if (hintBtn && hintTxt) {
    hintBtn.classList.toggle('active', isCurrentlyMasked);
    hintTxt.textContent = isCurrentlyMasked ? '🔒 가림막 ON' : '🔓 가림막 OFF';
  }

  const remHintBtn = document.getElementById('remBtnHintToggle');
  const remHintTxt = document.getElementById('remHintBtnText');
  if (remHintBtn && remHintTxt) {
    remHintBtn.classList.toggle('active', isCurrentlyMasked);
    remHintTxt.textContent = isCurrentlyMasked ? '🔒 가림ON' : '🔓 가림OFF';
  }

  const peekBtn = document.getElementById('btnToolbarPeekAll');
  const remPeekBtn = document.getElementById('remBtnPeekAll');
  if (peekBtn) peekBtn.classList.toggle('active', !isCurrentlyMasked);
  if (remPeekBtn) remPeekBtn.classList.toggle('active', !isCurrentlyMasked);
}

function setProgressiveStep(step) {
  window.state.clozeStage = step;
  if (step > 0) stageBeforeUnmask = step;

  for (let i = 0; i <= 4; i++) {
    const btn = document.getElementById('stepTab' + i);
    if (btn) btn.classList.toggle('active', i === step);
    const remBtn = document.getElementById('remStep' + i);
    if (remBtn) remBtn.classList.toggle('active', i === step);
  }

  clozeHintChosung = false;

  const box = document.getElementById('subnoteBox');
  if (box) box.classList.remove('peek-all-mode');

  const pins = currentPalaceObj?.pins || [];
  if (step === 0) {
    pins.forEach((_, idx) => palaceClearedSet.add(idx));
    currentPinRevealed = true;
    masterMaskOn = false;
  } else {
    palaceClearedSet.clear();
    currentPinIdx = 0;
    currentPinRevealed = false;
    masterMaskOn = true;
  }

  undoStack = [];
  ankiStepClearedState = false;
  if (typeof window.resetStepReaderCursor === 'function') window.resetStepReaderCursor();
  renderSubnoteAndBuildAnki(step);
  renderPalacePinsAndRoute();
  updatePalaceSideConsole();
  syncMaskToggleButtonsUI();
  saveCurrentStudySession();
  updateFloatingRemoteUI();
}

function normalizeSingleCharColoredSpans(container) {
  const spans = Array.from(container.querySelectorAll('span[style*="color"]'));
  spans.forEach(sp => {
    const txt = (sp.textContent || '').trim();
    if (txt.length === 1 && sp.nextSibling && sp.nextSibling.nodeType === Node.TEXT_NODE) {
      const nextText = sp.nextSibling.nodeValue;
      const m = nextText.match(/^([가-힣A-Za-z0-9_]+)/);
      if (m) {
        sp.textContent = txt + m[1];
        sp.nextSibling.nodeValue = nextText.slice(m[1].length);
      }
    }
  });
}

function isTableStubHeaderCell(el) {
  const td = el.closest('td, th');
  if (!td) return false;
  if (td.tagName === 'TH') return true;
  const tr = td.parentElement;
  if (!tr || tr.tagName !== 'TR') return false;
  if (tr.children.length >= 2 && tr.children[0] === td) {
    const txt = (td.textContent || '').trim();
    if (txt.length <= 16) return true;
  }
  return false;
}

function getElementContextBreadcrumb(el, fallbackSec) {
  const td = el.closest('td');
  if (!td) return fallbackSec;
  const tr = td.parentElement;
  const table = td.closest('table');
  let rowTitle = '';
  let colTitle = '';

  if (tr && tr.children.length >= 2 && tr.children[0] !== td) {
    rowTitle = (tr.children[0].textContent || '').trim().replace(/\s+/g, ' ').slice(0, 15);
  }
  if (table && tr) {
    const colIdx = Array.from(tr.children).indexOf(td);
    const firstRow = table.querySelector('tr');
    if (firstRow && firstRow.children[colIdx]) {
      colTitle = (firstRow.children[colIdx].textContent || '').trim().replace(/\s+/g, ' ').slice(0, 18);
    }
  }
  const parts = [fallbackSec, colTitle, rowTitle].filter(Boolean);
  return parts.join(' ▸ ') || fallbackSec;
}

function sanitizePollutedSubnoteHtml(htmlStr) {
  if (!htmlStr) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = htmlStr;

  // 1) 실수로 저장된 가림막(cloze-mask)을 원래 정답으로 복원
  tmp.querySelectorAll('.cloze-mask').forEach(mask => {
    const orig = mask.getAttribute('data-orig-html') || mask.getAttribute('data-answer') || '';
    const span = document.createElement('span');
    span.innerHTML = orig;
    mask.replaceWith(...Array.from(span.childNodes));
  });

  // 2) 영역선택 인라인 배경색(#99f6e4 / rgb(153, 246, 228)) 및 백업 속성 완벽 제거
  tmp.querySelectorAll('*').forEach(el => {
    el.classList.remove('sg-area-picked', 'sg-area-reading', 'sg-area-hover', 'tts-reading-now');
    el.removeAttribute('data-sg-order');
    const st = (el.getAttribute('style') || '').toLowerCase();
    if (
      el.hasAttribute('data-orig-bg-backup') ||
      el.hasAttribute('data-orig-pos-backup') ||
      st.includes('99f6e4') ||
      st.includes('153, 246, 228') ||
      st.includes('fef08a') ||
      st.includes('254, 240, 138')
    ) {
      el.style.removeProperty('background-color');
      if (el.getAttribute('data-orig-pos-backup') === '') {
        el.style.removeProperty('position');
      }
      el.removeAttribute('data-orig-bg-backup');
      el.removeAttribute('data-orig-pos-backup');
    }
  });

  // 3) 영역선택 배지(.sg-area-order-badge) 제거
  tmp.querySelectorAll('.sg-area-order-badge, .sg-area-badge, [class*="area-badge"]').forEach(b => b.remove());
  tmp.querySelectorAll('span, div, b, small').forEach(el => {
    const txt = (el.textContent || '').trim();
    if (/^[✅✓✔]?\s*\d+번\s*선택$/.test(txt) && el.children.length === 0) {
      el.remove();
    }
  });

  // 4) 대제목 복원 과정에서 생긴 중복 번호("1. 1. ", "2. 2. ", "3. 3. ", "4. 4. ") 정리
  tmp.querySelectorAll('div, p, h3, h4').forEach(blk => {
    if (blk.children.length === 1 && blk.firstElementChild.tagName === 'SPAN') {
      const sp = blk.firstElementChild;
      const spTxt = (sp.textContent || '').trim();
      const nextNode = sp.nextSibling;
      if (/^([0-9]+\.|\([0-9]+\)|[0-9]+\))$/.test(spTxt) && nextNode && nextNode.nodeType === Node.TEXT_NODE) {
        const nextTxt = nextNode.nodeValue || '';
        if (nextTxt.trim().startsWith(spTxt)) {
          sp.remove();
        }
      }
    }
    const fullTxt = (blk.textContent || '').trim();
    if (/^([0-9]+)\.\s+\1\.\s+/.test(fullTxt) && !blk.querySelector('svg, table')) {
      blk.innerHTML = blk.innerHTML.replace(/^(\s*(?:<span[^>]*>\s*)?([0-9]+)\.\s*(?:<\/span>)?\s*)\2\.\s*/, '$1');
    }
  });

  // 5) 도면 래퍼/툴바 잔재 및 아래아한글(HWP) 클립보드 숨은 주석(hwpEditorBoardContent) 제거
  tmp.querySelectorAll('.cloze-diagram-toolbar, .cloze-diagram-mask, #hwpEditorBoardContent, .hwp_editor_board_content').forEach(x => x.remove());
  tmp.querySelectorAll('.cloze-diagram-wrap').forEach(w => {
    while (w.firstChild) w.parentNode.insertBefore(w.firstChild, w);
    w.remove();
  });

  return tmp.innerHTML.replace(/<!--\[data-hwpjson\][\s\S]*?-->/g, '');
}

function renderSubnoteAndBuildAnki(step) {
  const topics = window.STUDY_TOPICS || [];
  const t = topics[window.state.topicIdx];
  if (!t) return;

  let rawHtml = t.summaryHtml || '<p>원문 데이터가 없습니다.</p>';

  const cleanedHtml = sanitizePollutedSubnoteHtml(rawHtml);
  if (cleanedHtml !== rawHtml) {
    rawHtml = cleanedHtml;
    t.summaryHtml = cleanedHtml;
    if (isIdbRestoreCompleted) {
      idbSetItem('backups', 'all_topics_snapshot', window.STUDY_TOPICS);
    }
  }

  const box = document.getElementById('subnoteBox');
  box.innerHTML = rawHtml;

  normalizeSingleCharColoredSpans(box);
  buildOutlineSidebarTree(box);

  ankiQueue = [];
  ankiStepClearedState = false;
  if (step === 0) {
    attachDiagramToolbarsOnly(box, t.id);
    updateAnkiHudProgress();
    updateMetaBadges();
    loadCurrentAnkiTargetToStage();
    return;
  }

  let currentSecTitle = t.title ? t.title.replace(/^■\s*/, '').slice(0, 22) : '1. 개요';
  let maskSeq = 0;

  if (step === 1) {
    maskStep1MajorHeadings(box, t.id, currentSecTitle, () => ++maskSeq);
  } else if (step === 2) {
    maskStep1MajorHeadings(box, t.id, currentSecTitle, () => ++maskSeq);
    maskColoredElementsByStep(box, t.id, currentSecTitle, 2, () => ++maskSeq);
  } else if (step === 3) {
    maskDiagramsInSubnote(box, t.id, currentSecTitle, () => ++maskSeq);
    maskStep1MajorHeadings(box, t.id, currentSecTitle, () => ++maskSeq);
    maskColoredElementsByStep(box, t.id, currentSecTitle, 3, () => ++maskSeq);
  } else if (step === 4) {
    maskDiagramsInSubnote(box, t.id, currentSecTitle, () => ++maskSeq);
    maskAllSegmentsRecursivelyForStep4(box, t.id, currentSecTitle, () => ++maskSeq);
  }

  if (ankiQueue.length > 1) {
    ankiQueue.sort((a, b) => {
      if (!a.el || !b.el || a.el === b.el) return 0;
      const pos = a.el.compareDocumentPosition(b.el);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });
  }

  if (ankiOrderMode === 'rand') {
    ankiQueue.sort(() => Math.random() - 0.5);
  }

  ankiCurrentIdx = 0;
  updateMetaBadges();
  loadCurrentAnkiTargetToStage();
}

function maskStep1MajorHeadings(box, topicId, baseSec, nextSeqFn) {
  let currentSec = baseSec;
  const allBlocks = Array.from(box.querySelectorAll('div, p, h3, h4, td'));

  allBlocks.forEach(blk => {
    if (blk.closest('svg, .cloze-diagram-wrap, .cloze-mask, th')) return;

    if (blk.tagName === 'TD') {
      if (!isTableStubHeaderCell(blk)) return;
      const txt = (blk.textContent || '').replace(/\s+/g, ' ').trim();
      if (!txt || /^[0-9]+$/.test(txt) || txt.includes('m ') || txt.includes('미만') || txt === '내화' || txt === '기타') return;

      const dummy = document.createElement('span');
      dummy.innerHTML = blk.innerHTML;
      blk.innerHTML = '';
      blk.appendChild(dummy);
      createInlineClozeSpanAndReplace(dummy, txt, '표 구분 목차', topicId, nextSeqFn);
      return;
    }

    if (blk.querySelector('div, p, table, ul, ol, svg')) return;
    const rawTxt = (blk.textContent || '').replace(/\s+/g, ' ').trim();
    if (!rawTxt || /^■/.test(rawTxt)) return;

    const mMajor = rawTxt.match(/^([0-9]+\.\s*)(.+)$/);
    if (mMajor && rawTxt.length <= 28 && !rawTxt.includes(':') && !rawTxt.includes('=')) {
      currentSec = rawTxt;
      wrapHeadingPrefixAndMask(blk, mMajor[1], mMajor[2].trim(), '대목차 암기', topicId, nextSeqFn);
      return;
    }

    const mSub = rawTxt.match(/^(\([0-9]+\)\s*)([가-힣A-Za-z0-9\s\·\-]+)$/);
    if (mSub && rawTxt.length <= 22 && !rawTxt.includes(':') && !blk.querySelector('span[style*="color"]')) {
      wrapHeadingPrefixAndMask(blk, mSub[1], mSub[2].trim(), currentSec, topicId, nextSeqFn);
      return;
    }

    const mMinor = rawTxt.match(/^([0-9]+\)\s*)(개념도|구조|작동원리|원리|특징|종류|설치기준)$/);
    if (mMinor) {
      wrapHeadingPrefixAndMask(blk, mMinor[1], mMinor[2].trim(), currentSec, topicId, nextSeqFn);
    }
  });
}

function wrapHeadingPrefixAndMask(blk, prefixStr, titleAnswer, bread, topicId, nextSeqFn) {
  const origHtml = blk.innerHTML;
  blk.innerHTML = '';

  const preSpan = document.createElement('span');
  preSpan.style.fontWeight = '800';
  preSpan.textContent = prefixStr;
  blk.appendChild(preSpan);

  const targetSpan = document.createElement('span');
  targetSpan.innerHTML = origHtml.replace(/^\s*(?:[0-9]+\.|\([0-9]+\)|[0-9]+\))\s*/, '');
  blk.appendChild(targetSpan);

  createInlineClozeSpanAndReplace(targetSpan, titleAnswer, bread, topicId, nextSeqFn);
}

function maskColoredElementsByStep(box, topicId, baseSec, step, nextSeqFn) {
  let currentSec = baseSec;

  const coloredBlocks = Array.from(box.querySelectorAll('td[style*="color"], div[style*="color"]'));
  coloredBlocks.forEach(blk => {
    if (blk.closest('svg, .cloze-diagram-wrap')) return;
    if (blk.querySelector('table, svg, div, p, span[style*="color"]')) return;
    const st = (blk.getAttribute('style') || '').toLowerCase();
    const isBlue   = st.includes('#1d4ed8') || st.includes('29, 78, 216');
    const isOrange = st.includes('#ea580c') || st.includes('234, 88, 12');
    const isRed    = st.includes('#dc2626') || st.includes('220, 38, 38');
    if (!isBlue && !isOrange && !isRed) return;

    const txt = (blk.textContent || '').replace(/\s+/g, ' ').trim();
    if (!txt || txt === '-' || txt.length > 120) return;
    if (blk.tagName === 'TD' && isTableStubHeaderCell(blk)) return;

    const innerSpan = document.createElement('span');
    innerSpan.setAttribute('style', blk.getAttribute('style'));
    innerSpan.innerHTML = blk.innerHTML;
    blk.innerHTML = '';
    blk.appendChild(innerSpan);
  });

  const inlineCandidates = Array.from(box.querySelectorAll('span, b, strong'));
  inlineCandidates.forEach(el => {
    if (el.closest('svg, .cloze-diagram-wrap, .cloze-mask')) return;
    if (el.querySelector('svg, table, img, .cloze-mask')) return;

    const styleAttr = (el.getAttribute('style') || '').toLowerCase();
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text || text === '-' || text.length < 1 || text.length > 120) return;

    if (styleAttr.includes('#1e293b') || /^[0-9]+\.\s/.test(text)) {
      currentSec = text.slice(0, 26);
      return;
    }

    if (isTableStubHeaderCell(el)) return;

    const isBlue   = styleAttr.includes('#1d4ed8') || styleAttr.includes('29, 78, 216');
    const isOrange = styleAttr.includes('#ea580c') || styleAttr.includes('234, 88, 12');
    const isRed    = styleAttr.includes('#dc2626') || styleAttr.includes('220, 38, 38');

    let shouldMask = false;
    if (step === 2 && (isBlue || isOrange)) shouldMask = true;
    else if (step === 3 && (isRed || isBlue || isOrange)) shouldMask = true;

    if (!shouldMask) return;

    createInlineClozeSpanAndReplace(el, text, getElementContextBreadcrumb(el, currentSec), topicId, nextSeqFn);
  });
}

function attachDiagramToolbarsOnly(box, topicId) {
  const topicCfg = diagramCustomConfigMap[topicId] || { disabledKeys: {}, customLabels: {}, manualSelectors: [] };
  const diagrams = Array.from(box.querySelectorAll('svg, img'));
  diagrams.forEach((diag, dIdx) => {
    if (diag.closest('.cloze-diagram-wrap')) return;
    const diagKey = `diag_${dIdx}`;
    const isOff = Boolean(topicCfg.disabledKeys && topicCfg.disabledKeys[diagKey]);

    const wrap = document.createElement('div');
    wrap.className = 'cloze-diagram-wrap';
    wrap.dataset.diagKey = diagKey;
    diag.parentNode.insertBefore(wrap, diag);

    const labels = Array.from(diag.querySelectorAll('text'))
      .map(x => (x.textContent || '').trim())
      .filter(x => x.length >= 1 && !/^[0-9\.\-\+]+$/.test(x));
    const uniqueLabels = Array.from(new Set(labels)).slice(0, 8).join(', ');
    const defaultAns = uniqueLabels ? `개념도 (${uniqueLabels})` : `개념도/회로도 #${dIdx + 1}`;
    const answerStr = (topicCfg.customLabels && topicCfg.customLabels[diagKey]) || defaultAns;

    const tb = buildDiagramMiniToolbar(topicId, diagKey, isOff, answerStr);
    wrap.appendChild(tb);
    wrap.appendChild(diag);
  });
}

function buildDiagramMiniToolbar(topicId, diagKey, isOff, currentAnswer) {
  const tb = document.createElement('div');
  tb.className = 'cloze-diagram-toolbar';
  tb.innerHTML = `
    <button type="button" class="diag-ctrl-btn ${isOff ? 'off' : ''}">
      <span class="sg-ico sm s-pins ${isOff ? 'c-00' : 'c-02'}" style="width:14px;height:14px;"></span>
      <span>${isOff ? '도면가림 OFF' : '도면가림 ON'}</span>
    </button>
    <button type="button" class="diag-ctrl-btn">
      <span class="sg-ico sm s-pins c-22" style="width:14px;height:14px;"></span>
      <span>문구수정</span>
    </button>
  `;
  tb.children[0].onclick = (ev) => {
    ev.stopPropagation();
    toggleDiagramMaskKey(topicId, diagKey);
  };
  tb.children[1].onclick = (ev) => {
    ev.stopPropagation();
    promptDiagramCustomText(topicId, diagKey, currentAnswer);
  };
  return tb;
}

function toggleDiagramMaskKey(topicId, diagKey) {
  if (!diagramCustomConfigMap[topicId]) {
    diagramCustomConfigMap[topicId] = { disabledKeys: {}, customLabels: {}, manualSelectors: [] };
  }
  if (!diagramCustomConfigMap[topicId].disabledKeys) diagramCustomConfigMap[topicId].disabledKeys = {};
  diagramCustomConfigMap[topicId].disabledKeys[diagKey] = !diagramCustomConfigMap[topicId].disabledKeys[diagKey];
  localStorage.setItem('samguk_diagram_cfg_v1', JSON.stringify(diagramCustomConfigMap));
  renderSubnoteAndBuildAnki(window.state.clozeStage);
}

function promptDiagramCustomText(topicId, diagKey, currentAnswer) {
  const next = prompt('📐 이 도면의 정답/TTS 낭독 문구를 수정하세요:', currentAnswer || '');
  if (next === null || !next.trim()) return;
  if (!diagramCustomConfigMap[topicId]) {
    diagramCustomConfigMap[topicId] = { disabledKeys: {}, customLabels: {}, manualSelectors: [] };
  }
  if (!diagramCustomConfigMap[topicId].customLabels) diagramCustomConfigMap[topicId].customLabels = {};
  diagramCustomConfigMap[topicId].customLabels[diagKey] = next.trim();
  localStorage.setItem('samguk_diagram_cfg_v1', JSON.stringify(diagramCustomConfigMap));
  renderSubnoteAndBuildAnki(window.state.clozeStage);
}

function toggleDiagramMaskEditMode() {
  const box = document.getElementById('subnoteBox');
  const isNoteEditing = box && box.isContentEditable;

  if (!isNoteEditing && !diagramEditModeOn) {
    alert('⚠️ [도면가림 편집] 기능을 사용하려면 먼저 하단 툴바 또는 리모컨의 [✏️ 노트수정] 버튼을 눌러 노트 수정 모드를 시작해 주세요!');
    return;
  }

  diagramEditModeOn = !diagramEditModeOn;
  document.body.classList.toggle('diagram-edit-on', diagramEditModeOn);
  const btn = document.getElementById('btnDiagramEditMode');
  const txt = document.getElementById('diagramEditModeText');
  const remBtn = document.getElementById('remBtnDiagEdit');
  const remTxt = document.getElementById('remDiagEditText');
  if (btn) btn.classList.toggle('active', diagramEditModeOn);
  if (txt) txt.textContent = diagramEditModeOn ? '📐 도면가림 편집 ON' : '📐 도면가림 편집 OFF';
  if (remBtn) remBtn.classList.toggle('active', diagramEditModeOn);
  if (remTxt) remTxt.textContent = diagramEditModeOn ? '📐 도면편집 ON' : '📐 도면편집';
}

function initDiagramManualClickEdit() {
  const box = document.getElementById('subnoteBox');
  if (!box) return;
  box.addEventListener('click', (e) => {
    if (!diagramEditModeOn) return;
    if (e.target.closest('.cloze-diagram-toolbar')) return;
    const wrap = e.target.closest('.cloze-diagram-wrap');
    if (wrap && wrap.dataset.diagKey) {
      e.preventDefault();
      e.stopPropagation();
      const t = window.STUDY_TOPICS[window.state.topicIdx];
      if (t) toggleDiagramMaskKey(t.id, wrap.dataset.diagKey);
    }
  }, true);
}

function maskDiagramsInSubnote(box, topicId, currentSecTitle, nextSeqFn) {
  const topicCfg = diagramCustomConfigMap[topicId] || { disabledKeys: {}, customLabels: {}, manualSelectors: [] };
  const diagrams = Array.from(box.querySelectorAll('svg, img'));
  diagrams.forEach((diag, dIdx) => {
    if (diag.closest('.cloze-diagram-wrap')) return;
    const diagKey = `diag_${dIdx}`;
    const isOff = Boolean(topicCfg.disabledKeys && topicCfg.disabledKeys[diagKey]);
    const bread = getElementContextBreadcrumb(diag, currentSecTitle);

    const wrap = document.createElement('div');
    wrap.className = 'cloze-diagram-wrap';
    wrap.dataset.diagKey = diagKey;
    diag.parentNode.insertBefore(wrap, diag);

    const labels = Array.from(diag.querySelectorAll('text'))
      .map(x => (x.textContent || '').trim())
      .filter(x => x.length >= 1 && !/^[0-9\.\-\+]+$/.test(x));
    const uniqueLabels = Array.from(new Set(labels)).slice(0, 8).join(', ');
    const defaultAns = uniqueLabels ? `개념도 (${uniqueLabels})` : `${bread} 개념도/회로도`;
    const answerStr = (topicCfg.customLabels && topicCfg.customLabels[diagKey]) || defaultAns;

    const tb = buildDiagramMiniToolbar(topicId, diagKey, isOff, answerStr);
    wrap.appendChild(tb);
    wrap.appendChild(diag);

    if (isOff) return;

    const maskId = 'cloze_diag_' + nextSeqFn();
    const cardKey = `${topicId}::diag_${dIdx}`;
    const isGrad = Boolean(graduatedCardMap[cardKey]);

    const mask = document.createElement('div');
    mask.className = 'cloze-diagram-mask';
    mask.dataset.maskId = maskId;
    mask.dataset.cardKey = cardKey;
    mask.dataset.sec = bread;
    mask.dataset.answer = answerStr;
    mask.dataset.chosung = '[개념도 / 회로도]';
    mask.innerHTML = `
      <span class="sg-ico lg s-fire c-10"></span>
      <span>📐 ${bread} — 도면 암기 빈칸</span>
      <small style="font-size:11.5px; color:#92400e; font-weight:700;">(클릭 또는 Space바를 누르면 도면이 공개됩니다)</small>
    `;

    if (isGrad) wrap.classList.add('revealed');

    mask.onclick = (e) => {
      if (sgAreaSelectMode) return;
      e.stopPropagation();
      const fIdx = ankiQueue.findIndex(q => q.id === maskId);
      if (fIdx >= 0) {
        ankiStepClearedState = false;
        ankiCurrentIdx = fIdx;
        loadCurrentAnkiTargetToStage();
        revealCurrentAnkiCard();
      } else {
        wrap.classList.toggle('revealed');
        speakAnkiCardInstant(answerStr);
      }
    };

    wrap.appendChild(mask);

    if (!isGrad) {
      ankiQueue.push({
        id: maskId, cardKey, el: mask, wrapEl: wrap,
        isDiagram: true, sec: bread, answer: answerStr, chosung: '[개념도/회로도]'
      });
    }
  });
}

function createInlineClozeSpanAndReplace(el, text, breadSec, topicId, nextSeqFn) {
  const cleanText = (text || '').replace(/\s+/g, ' ').trim();
  if (!cleanText) return;

  const maskId = 'cloze_item_' + nextSeqFn();
  const cardKey = `${topicId}::${cleanText}`;
  const isGrad = Boolean(graduatedCardMap[cardKey]);
  const lapseCnt = cardLapseCounts[cardKey] || 0;
  const isLeech = lapseCnt >= 3;
  const hintStr = getSmartHintString(cleanText);

  const span = document.createElement('span');
  span.className = 'cloze-mask' + (isLeech ? ' leech-card' : '') + (isGrad ? ' revealed graduated-card' : '');
  span.dataset.maskId = maskId;
  span.dataset.cardKey = cardKey;
  span.dataset.sec = breadSec;
  span.dataset.answer = cleanText;
  span.dataset.chosung = hintStr;
  span.dataset.origHtml = el.innerHTML || cleanText;

  if (isGrad) {
    span.innerHTML = span.dataset.origHtml;
    span.title = '🎓 영구 졸업된 빈칸';
  } else {
    const prefix = isLeech ? '🩸' : '🔒';
    span.textContent = `${prefix} [ 100% 백지 빈칸 ]`;
  }

  span.onclick = (e) => {
    if (sgAreaSelectMode) return;
    e.stopPropagation();
    const foundIdx = ankiQueue.findIndex(q => q.id === maskId);
    if (foundIdx >= 0) {
      ankiStepClearedState = false;
      ankiCurrentIdx = foundIdx;
      loadCurrentAnkiTargetToStage();
      revealCurrentAnkiCard();
    } else {
      toggleClozeElementReveal(span, !span.classList.contains('revealed'));
    }
  };

  el.replaceWith(span);
  if (!isGrad) {
    ankiQueue.push({
      id: maskId, cardKey, el: span, isDiagram: false,
      sec: breadSec, answer: cleanText, chosung: hintStr
    });
  }
}

const BLOCK_TAG_SET = new Set(['DIV', 'P', 'TABLE', 'TBODY', 'THEAD', 'TR', 'TD', 'TH', 'UL', 'OL', 'LI', 'SVG', 'HR', 'SECTION', 'ARTICLE']);

function maskAllSegmentsRecursivelyForStep4(rootBox, topicId, initialSec, nextSeqFn) {
  let currentSec = initialSec;

  function walkContainer(container) {
    if (!container || container.nodeType !== Node.ELEMENT_NODE) return;
    if (container.tagName === 'SVG' || container.tagName === 'TH') return;
    if (container.classList.contains('cloze-diagram-wrap') || container.classList.contains('cloze-mask') || container.classList.contains('cloze-diagram-toolbar')) return;

    if (container.tagName === 'TD') {
      const tdTxt = (container.textContent || '').replace(/\s+/g, ' ').trim();
      if (/^[0-9]+$/.test(tdTxt) && container.parentElement?.children[0] === container) {
        return;
      }
    }

    if (['TABLE', 'TBODY', 'THEAD', 'TR', 'UL', 'OL'].includes(container.tagName)) {
      Array.from(container.children).forEach(ch => walkContainer(ch));
      return;
    }

    const nodes = Array.from(container.childNodes);
    let inlineBuffer = [];

    const flushInlineBuffer = () => {
      if (!inlineBuffer.length) return;
      processInlineLineNodesForStep4(container, inlineBuffer, topicId, () => currentSec, (newSec) => { currentSec = newSec; }, nextSeqFn);
      inlineBuffer = [];
    };

    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'BR') {
          flushInlineBuffer();
          return;
        }
        if (BLOCK_TAG_SET.has(node.tagName) || node.classList.contains('cloze-diagram-wrap')) {
          flushInlineBuffer();
          walkContainer(node);
          return;
        }
      }
      inlineBuffer.push(node);
    });
    flushInlineBuffer();
  }

  walkContainer(rootBox);
}

function processInlineLineNodesForStep4(parentContainer, lineNodes, topicId, getSecFn, setSecFn, nextSeqFn) {
  const tempDiv = document.createElement('div');
  lineNodes.forEach(n => tempDiv.appendChild(n.cloneNode(true)));

  const lineText = (tempDiv.textContent || '').replace(/\s+/g, ' ').trim();
  if (!lineText || lineText === '-') return;

  if (/^■/.test(lineText)) {
    setSecFn(lineText.replace(/^■\s*/, '').slice(0, 26));
    return;
  }

  if (/^[0-9]+\.\s*[가-힣A-Za-z]/.test(lineText) && lineText.length <= 28) {
    setSecFn(lineText.slice(0, 26));
  }

  const bread = getElementContextBreadcrumb(parentContainer, getSecFn());
  const isInsideTableCell = (parentContainer.tagName === 'TD');

  const strictBulletRegex = /^((?:\([0-9]+\)|[0-9]+\.|[0-9]+\)|[①②③④⑤⑥⑦⑧⑨⑩㉮㉯㉰㉱㉲㉳㉴○•▶※])\s+)([\s\S]+)$/;
  const bulletMatch = !isInsideTableCell ? lineText.match(strictBulletRegex) : null;

  let prefixStr = '';
  let answerTxt = lineText;
  let innerHtmlForMask = tempDiv.innerHTML;

  if (bulletMatch && bulletMatch[2].trim().length >= 1) {
    prefixStr = bulletMatch[1];
    answerTxt = bulletMatch[2].trim();
    innerHtmlForMask = tempDiv.innerHTML.replace(/^\s*(?:\([0-9]+\)|[0-9]+\.|[0-9]+\)|[①②③④⑤⑥⑦⑧⑨⑩㉮㉯㉰㉱㉲㉳㉴○•▶※])(?:\s|&nbsp;)+/, '');
  }

  const firstNode = lineNodes[0];
  const frag = document.createDocumentFragment();

  if (prefixStr) {
    const preSpan = document.createElement('span');
    preSpan.style.fontWeight = '800';
    preSpan.textContent = prefixStr;
    frag.appendChild(preSpan);
  }

  const targetSpan = document.createElement('span');
  targetSpan.innerHTML = innerHtmlForMask;
  frag.appendChild(targetSpan);

  parentContainer.insertBefore(frag, firstNode);
  lineNodes.forEach(n => n.remove());

  createInlineClozeSpanAndReplace(targetSpan, answerTxt, bread, topicId, nextSeqFn);
}

function toggleClozeElementReveal(el, reveal) {
  if (!el) return;
  if (el.classList.contains('cloze-diagram-mask')) {
    el.closest('.cloze-diagram-wrap')?.classList.toggle('revealed', reveal);
    return;
  }
  const lapseCnt = cardLapseCounts[el.dataset.cardKey] || 0;
  const isLeech = lapseCnt >= 3;
  el.classList.toggle('leech-card', isLeech);

  if (reveal) {
    el.classList.add('revealed');
    el.innerHTML = el.dataset.origHtml || el.dataset.answer;
  } else {
    el.classList.remove('revealed');
    const prefix = isLeech ? '🩸' : '🔒';
    el.textContent = `${prefix} [ 100% 백지 빈칸 ]`;
  }
}

function isAnkiItemRevealed(q) {
  if (!q) return true;
  return q.isDiagram ? q.wrapEl.classList.contains('revealed') : q.el.classList.contains('revealed');
}

function renderStepClearCelebrationScreen() {
  stopSpeedFocusCountdown();
  ankiStepClearedState = true;
  ankiIsFlipped = false;
  document.getElementById('ankiCardInner').classList.remove('is-flipped');
  document.querySelectorAll('.current-anki-target').forEach(x => x.classList.remove('current-anki-target'));

  const curStep = window.state.clozeStage;
  const nextStep = curStep < 4 ? curStep + 1 : 4;
  document.getElementById('cardBackSecPill').textContent = `[Step ${curStep} 완벽 격파!]`;
  document.getElementById('cardBackHintPlate').textContent = curStep < 4 ? `Space ➔ Step ${nextStep} 진급` : `🎉 100% 백지인출 완성!`;
  document.getElementById('monitorBreadcrumb').innerHTML = `🏆 Step ${curStep} 전 구간 격파 완료! (${ankiQueue.length} / ${ankiQueue.length} 해금)`;

  document.getElementById('monitorContextBody').innerHTML = `
    <div style="padding:18px; text-align:center; background:linear-gradient(135deg,#ecfdf5,#d1fae5); border:2px solid #10b981; border-radius:12px;">
      <div style="font-size:17px; font-weight:900; color:#065f46; margin-bottom:6px;">
        🎉 축하합니다! 현재 Step ${curStep}의 모든 빈칸(${ankiQueue.length}개)을 100% 격파했습니다!
      </div>
      <div style="font-size:13.5px; color:#047857; margin-bottom:12px;">
        ${curStep < 4
          ? `<b>Space바</b>를 누르거나 아래 버튼을 클릭하면 다음 단계인 <b>[Step ${nextStep}]</b>로 즉시 진급합니다!`
          : `최고 난이도인 <b>Step 4 (100% 백지인출)</b>까지 모두 마스터하셨습니다!`}
      </div>
      <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
        ${curStep < 4
          ? `<button class="btn-gold teal-active" style="padding:8px 16px; font-size:13.5px;" onclick="setProgressiveStep(${nextStep})">🚀 Step ${nextStep} 단계로 즉시 진급 (Space) ▶</button>`
          : `<button class="btn-gold active" style="padding:8px 16px; font-size:13.5px;" onclick="markCurrentTopicCompleted()">🏅 1회독 완료 기록하기</button>`}
        <button class="btn-gold" style="padding:8px 14px; font-size:13px;" onclick="setProgressiveStep(${curStep})">🔄 현재 Step ${curStep} 다시 풀기</button>
      </div>
    </div>
  `;
  updateFloatingRemoteUI();
}

function loadCurrentAnkiTargetToStage() {
  updateAnkiHudProgress();
  const cardInner = document.getElementById('ankiCardInner');
  cardInner.classList.remove('is-flipped');
  ankiIsFlipped = false;

  document.querySelectorAll('.current-anki-target').forEach(x => x.classList.remove('current-anki-target'));

  if (window.state.clozeStage === 0 || !ankiQueue.length) {
    stopSpeedFocusCountdown();
    document.getElementById('cardBackSecPill').textContent = window.state.clozeStage === 0 ? '[Step 0. 원문통독]' : '[학습 완료]';
    document.getElementById('cardBackHintPlate').textContent = window.state.clozeStage === 0 ? 'Step 1~4 탭을 선택하세요' : '모든 빈칸 해금 완료!';
    document.getElementById('monitorBreadcrumb').textContent = window.state.clozeStage === 0 ? '[Step 0. 원문통독 모드]' : '[학습 완료]';
    document.getElementById('monitorContextBody').innerHTML = window.state.clozeStage === 0
      ? '📖 현재 <b>Step 0 (원문통독)</b> 모드입니다. 상단 <b>Step 1(대제목) ~ Step 4(100% 가리기)</b> 탭이나 <b>[🔒 가림막 ON]</b> 버튼을 눌러 암기 훈련을 시작해 보세요.'
      : '🎉 현재 Step의 모든 가림막을 격파했습니다! 상위 Step이나 기억의 궁전 모드로 도전해 보세요.';
    updateFloatingRemoteUI();
    return;
  }

  const unrevealedCount = ankiQueue.filter(q => !isAnkiItemRevealed(q)).length;
  if (unrevealedCount === 0) {
    renderStepClearCelebrationScreen();
    return;
  }

  ankiStepClearedState = false;
  ankiCurrentIdx = Math.max(0, Math.min(ankiQueue.length - 1, ankiCurrentIdx));

  if (isAnkiItemRevealed(ankiQueue[ankiCurrentIdx])) {
    for (let stepOffset = 1; stepOffset <= ankiQueue.length; stepOffset++) {
      const candIdx = (ankiCurrentIdx + stepOffset) % ankiQueue.length;
      if (!isAnkiItemRevealed(ankiQueue[candIdx])) {
        ankiCurrentIdx = candIdx;
        break;
      }
    }
  }

  const item = ankiQueue[ankiCurrentIdx];
  if (item.el) item.el.classList.add('current-anki-target');

  const lapseCnt = cardLapseCounts[item.cardKey] || 0;
  const leechTag = lapseCnt >= 3 ? ` 🩸거머리(${lapseCnt}회)` : '';

  document.getElementById('cardBackSecPill').textContent = `[${item.sec}]${leechTag}`;
  document.getElementById('cardBackHintPlate').textContent = '🔒 100% 백지 인출 (?)';
  document.getElementById('cardFrontAnswerPlate').textContent = item.answer;

  const heroIdx = ankiCurrentIdx % 16;
  const r = Math.floor(heroIdx / 4);
  const c = heroIdx % 4;
  document.getElementById('ankiCardFront').style.backgroundPosition = `${(c / 3) * 100}% ${(r / 3) * 100}%`;

  renderMonitorContextForTarget(item, false);
  startSpeedFocusCountdownForCurrentCard();
  saveCurrentStudySession();
  updateFloatingRemoteUI();
}

function renderMonitorContextForTarget(item, showAnswer) {
  const lapseCnt = cardLapseCounts[item.cardKey] || 0;
  const leechBadge = lapseCnt >= 3 ? ` <span style="background:#ffe4e6;color:#e11d48;padding:1px 7px;border-radius:6px;font-size:11.5px;">🩸거머리(${lapseCnt}회)</span>` : '';
  document.getElementById('monitorBreadcrumb').innerHTML = `${item.sec} — 빈칸 #${ankiCurrentIdx + 1} / ${ankiQueue.length}${leechBadge}`;

  const body = document.getElementById('monitorContextBody');

  if (item.isDiagram && item.wrapEl) {
    body.innerHTML = '';
    if (showAnswer) {
      const diagClone = item.wrapEl.querySelector('svg, img')?.cloneNode(true);
      if (diagClone) {
        diagClone.style.maxHeight = '185px';
        diagClone.style.width = 'auto';
        diagClone.style.display = 'block';
        diagClone.style.margin = '0 auto';
        body.appendChild(diagClone);
      }
      const cap = document.createElement('div');
      cap.style.cssText = 'text-align:center; font-weight:900; color:#047857; margin-top:6px; font-size:13.5px;';
      cap.textContent = `★ ${item.answer}`;
      body.appendChild(cap);
    } else {
      body.innerHTML = `
        <div style="padding:28px 16px; text-align:center; background:#fffbeb; border:2px dashed #d97706; border-radius:10px;">
          <div style="font-size:16px; font-weight:900; color:#92400e; margin-bottom:6px;">📐 [${item.sec}] 개념도 / 회로도 암기 차례입니다</div>
          <div style="font-size:13px; color:#78350f;">머릿속으로 회로도·구조도의 모양과 기호를 떠올린 뒤 <b>Space바</b>를 눌러 도면을 확인하세요!</div>
        </div>
      `;
    }
    return;
  }

  const block = item.el.closest('td, li, p, div') || item.el.parentElement;
  if (!block) {
    body.textContent = item.answer;
    return;
  }
  const clone = block.cloneNode(true);
  clone.querySelectorAll('.cloze-diagram-toolbar').forEach(tb => tb.remove());
  clone.querySelectorAll('.cloze-mask').forEach(m => {
    if (m.dataset.maskId === item.id) {
      const chip = document.createElement('span');
      chip.className = 'monitor-target-chip';
      chip.textContent = showAnswer ? `★ ${item.answer}` : '🎯 [ 현재 백지 타겟 ]';
      m.replaceWith(chip);
    } else if (!m.classList.contains('revealed')) {
      m.textContent = '[...]';
    }
  });
  body.innerHTML = `<div style="font-size:12px; color:#64748b; font-weight:700; margin-bottom:4px;">📍 소속 구간: ${item.sec}</div>` + clone.innerHTML;
}

function handleAnkiCardClick() {
  if (window.state.clozeStage === 0) {
    setProgressiveStep(2);
    return;
  }
  if (ankiStepClearedState) {
    if (window.state.clozeStage < 4) setProgressiveStep(window.state.clozeStage + 1);
    else setProgressiveStep(window.state.clozeStage);
    return;
  }
  if (!ankiQueue.length) return;
  if (!ankiIsFlipped) revealCurrentAnkiCard();
  else gradeAnkiTarget('good');
}

function revealCurrentAnkiCard() {
  if (!ankiQueue.length) return;
  stopSpeedFocusCountdown();
  const item = ankiQueue[ankiCurrentIdx];
  ankiIsFlipped = true;
  document.getElementById('ankiCardInner').classList.add('is-flipped');

  toggleClozeElementReveal(item.el, true);
  renderMonitorContextForTarget(item, true);

  const ally = document.getElementById('allyHeroStand');
  const enemy = document.getElementById('enemyHeroStand');
  ally.classList.add('ally-attack');
  enemy.classList.add('enemy-hit');
  setTimeout(() => {
    ally.classList.remove('ally-attack');
    enemy.classList.remove('enemy-hit');
  }, 420);

  const blockEl = item.el?.closest('td, li, p, div');
  const blockText = item.isDiagram
    ? item.answer
    : (typeof window.extractElementSpeechText === 'function' && blockEl
        ? window.extractElementSpeechText(blockEl)
        : item.answer);
  const ttsText = cardTtsFullSentence ? blockText : item.answer;
  speakAnkiCardInstant(ttsText);
  updateAnkiHudProgress();
  saveCurrentStudySession();
  updateFloatingRemoteUI();
}

function gradeAnkiTarget(grade) {
  if (ankiStepClearedState) {
    handleAnkiCardClick();
    return;
  }
  if (!ankiQueue.length) return;
  if (!ankiIsFlipped) {
    revealCurrentAnkiCard();
    return;
  }

  const item = ankiQueue[ankiCurrentIdx];

  undoStack.push({
    queueSnapshot: [...ankiQueue],
    idxSnapshot: ankiCurrentIdx,
    itemRef: item,
    prevLapse: cardLapseCounts[item.cardKey] || 0,
    wasGraduated: Boolean(graduatedCardMap[item.cardKey]),
    wasWrong: wrongTargetIds.has(item.id)
  });
  if (undoStack.length > 25) undoStack.shift();

  if (grade === 'again') {
    cardLapseCounts[item.cardKey] = (cardLapseCounts[item.cardKey] || 0) + 1;
    saveAnkiMetaState();
    toggleClozeElementReveal(item.el, false);
    wrongTargetIds.add(item.id);

    const removed = ankiQueue.splice(ankiCurrentIdx, 1)[0];
    const insertPos = Math.min(ankiQueue.length, ankiCurrentIdx + 3);
    ankiQueue.splice(insertPos, 0, removed);
  } else if (grade === 'hard') {
    toggleClozeElementReveal(item.el, false);
    wrongTargetIds.add(item.id);
    const removed = ankiQueue.splice(ankiCurrentIdx, 1)[0];
    ankiQueue.push(removed);
  } else if (grade === 'easy') {
    graduatedCardMap[item.cardKey] = true;
    saveAnkiMetaState();
    if (item.isDiagram && item.wrapEl) item.wrapEl.classList.add('revealed');
    else item.el.classList.add('graduated-card', 'revealed');

    ankiQueue.splice(ankiCurrentIdx, 1);
    if (ankiCurrentIdx >= ankiQueue.length) ankiCurrentIdx = 0;
  } else {
    ankiCurrentIdx++;
    if (ankiCurrentIdx >= ankiQueue.length) ankiCurrentIdx = 0;
  }

  updateMetaBadges();
  loadCurrentAnkiTargetToStage();
}

function undoLastAnkiAction() {
  if (currentMainMode === 'palace') {
    undoPalaceEdit();
    return;
  }
  if (!undoStack.length) return alert('되돌릴 직전 판정 기록이 없습니다.');
  const last = undoStack.pop();
  ankiQueue = last.queueSnapshot;
  ankiCurrentIdx = last.idxSnapshot;
  ankiStepClearedState = false;

  const item = last.itemRef;
  if (last.prevLapse === 0) delete cardLapseCounts[item.cardKey];
  else cardLapseCounts[item.cardKey] = last.prevLapse;

  if (!last.wasGraduated) {
    delete graduatedCardMap[item.cardKey];
    item.el.classList.remove('graduated-card');
  }
  if (!last.wasWrong) wrongTargetIds.delete(item.id);

  saveAnkiMetaState();
  toggleClozeElementReveal(item.el, false);
  updateMetaBadges();
  loadCurrentAnkiTargetToStage();
}

function updateMetaBadges() {
  document.getElementById('wrongCountBadge').textContent = wrongTargetIds.size;

  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (!t) return;
  const prefix = t.id + '::';
  const leechCnt = Object.keys(cardLapseCounts).filter(k => k.startsWith(prefix) && cardLapseCounts[k] >= 3).length;
  const gradCnt  = Object.keys(graduatedCardMap).filter(k => k.startsWith(prefix) && graduatedCardMap[k]).length;

  document.getElementById('leechCountBadge').textContent = leechCnt;
  document.getElementById('gradCountBadge').textContent = gradCnt;
}

function startWrongPoolReview() {
  if (!wrongTargetIds.size) return alert('현재 누적된 오답 빈칸이 없습니다.');
  ankiQueue = ankiQueue.filter(q => wrongTargetIds.has(q.id));
  ankiQueue.forEach(q => toggleClozeElementReveal(q.el, false));
  ankiCurrentIdx = 0;
  ankiStepClearedState = false;
  loadCurrentAnkiTargetToStage();
}

function startLeechPoolReview() {
  const leeches = ankiQueue.filter(q => (cardLapseCounts[q.cardKey] || 0) >= 3);
  if (!leeches.length) return alert('현재 토픽에 3회 이상 틀린 🩸거머리(상습 약점) 빈칸이 없습니다.');
  ankiQueue = leeches;
  ankiQueue.forEach(q => toggleClozeElementReveal(q.el, false));
  ankiCurrentIdx = 0;
  ankiStepClearedState = false;
  loadCurrentAnkiTargetToStage();
}

function resetGraduatedCardsForTopic() {
  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (!t) return;
  const prefix = t.id + '::';
  Object.keys(graduatedCardMap).forEach(k => {
    if (k.startsWith(prefix)) delete graduatedCardMap[k];
  });
  saveAnkiMetaState();
  renderSubnoteAndBuildAnki(window.state.clozeStage);
  alert('🎓 현재 토픽의 영구 졸업 빈칸들이 다시 학습 큐로 복구되었습니다.');
}

function toggleSpeedFocusTimer() {
  speedTimerEnabled = !speedTimerEnabled;
  const btn = document.getElementById('btnSpeedTimer');
  const wrap = document.getElementById('speedTimerWrap');
  btn.classList.toggle('crimson-active', speedTimerEnabled);
  document.getElementById('speedTimerBtnText').textContent = speedTimerEnabled ? '⏱️ 6초 순발력 ON' : '⏱️ 6초 순발력 OFF';
  wrap.classList.toggle('active', speedTimerEnabled);

  if (speedTimerEnabled) startSpeedFocusCountdownForCurrentCard();
  else stopSpeedFocusCountdown();
}

function startSpeedFocusCountdownForCurrentCard() {
  stopSpeedFocusCountdown();
  if (!speedTimerEnabled || !ankiQueue.length || ankiIsFlipped || ankiStepClearedState) return;
  speedTimerRemainMs = SPEED_LIMIT_MS;
  const fill = document.getElementById('speedTimerFill');
  fill.style.width = '100%';

  speedTimerInterval = setInterval(() => {
    speedTimerRemainMs -= 100;
    const pct = Math.max(0, (speedTimerRemainMs / SPEED_LIMIT_MS) * 100);
    fill.style.width = pct + '%';
    if (speedTimerRemainMs <= 0) {
      stopSpeedFocusCountdown();
      revealCurrentAnkiCard();
    }
  }, 100);
}

function stopSpeedFocusCountdown() {
  if (speedTimerInterval) {
    clearInterval(speedTimerInterval);
    speedTimerInterval = null;
  }
}

function updateAnkiHudProgress() {
  const total = ankiQueue.length;
  const remain = ankiQueue.filter(q => !isAnkiItemRevealed(q)).length;
  const pct = total ? Math.round((remain / total) * 100) : 0;
  document.getElementById('ankiProgressText').textContent = `남은 빈칸: ${remain} / ${total} (${pct}%)`;
  document.getElementById('bossHpFill').style.width = pct + '%';
}

function getBestEdgeKoreanVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = (typeof availableVoices !== 'undefined' && availableVoices.length > 0)
    ? availableVoices
    : (window.speechSynthesis.getVoices() || []);
  if (!voices.length) return null;

  if (typeof window.findMatchingSavedVoice === 'function') {
    const saved = window.findMatchingSavedVoice(voices);
    if (saved) return saved;
  }

  const sel = document.getElementById('ttsVoiceSelect');
  const uri = (sel && sel.value) || (window.state && window.state.selectedVoiceURI) || localStorage.getItem('maple_edge_voice_uri') || '';
  if (uri) {
    const byUri = voices.find(v => v.voiceURI === uri);
    if (byUri) return byUri;
  }

  return voices.find(v => v.name.includes('SunHi') && v.name.includes('Natural'))
      || voices.find(v => v.name.includes('InJoon') && v.name.includes('Natural'))
      || voices.find(v => (v.lang || '').toLowerCase().includes('ko') && v.name.includes('Natural'))
      || voices.find(v => (v.lang || '').toLowerCase().includes('ko') && v.name.includes('Online'))
      || voices.find(v => (v.lang || '').toLowerCase().includes('ko'))
      || voices[0];
}

function speakAnkiCardInstant(rawText) {
  if (!rawText || !('speechSynthesis' in window)) return;

  if (typeof window.speakSentenceQueue === 'function') {
    const baseP = (typeof window.getTtsEngineConfig === 'function')
      ? window.getTtsEngineConfig().basePauseMs
      : 220;
    window.speakSentenceQueue([{ text: String(rawText), el: null, pauseAfter: baseP }]);
    return;
  }

  let clean = String(rawText).trim();
  if (typeof window.refineForEdgeNaturalSpeech === 'function') {
    clean = window.refineForEdgeNaturalSpeech(clean);
  }
  if (!clean) return;

  window.speechSynthesis.cancel();
  setTimeout(() => {
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'ko-KR';
    u.rate = parseFloat(localStorage.getItem('maple_edge_tts_rate')) || Number(window.state.ttsRate) || 1.05;
    const picked = getBestEdgeKoreanVoice();
    if (picked) u.voice = picked;
    window.speechSynthesis.speak(u);
  }, 50);
}

function replayCurrentAnkiTts() {
  if (!ankiQueue.length) return;
  const item = ankiQueue[ankiCurrentIdx];
  speakAnkiCardInstant(item.answer);
}

function stopAllTtsSpeech() {
  sgAreaReadingFlag = false;
  activeRecallTtsMode = false;
  document.getElementById('btnActiveRecallTts')?.classList.remove('active');
  document.querySelectorAll('.sg-area-reading').forEach(el => {
    el.classList.remove('sg-area-reading');
    if (el.classList.contains('sg-area-picked') && !el.classList.contains('palace-pin')) {
      el.style.setProperty('background-color', '#99f6e4', 'important');
    }
  });
  if (typeof window.stopAllSpeech === 'function') window.stopAllSpeech();
  else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function getPalaceZoneIndex(xPct) {
  if (xPct < 33.5) return 0;
  if (xPct < 66.5) return 1;
  return 2;
}

function sortPalacePinsByZoneAndY(focusPinRef) {
  if (!currentPalaceObj || !Array.isArray(currentPalaceObj.pins) || !currentPalaceObj.pins.length) return;

  currentPalaceObj.pins.sort((a, b) => {
    const zA = getPalaceZoneIndex(Number(a.x) || 0);
    const zB = getPalaceZoneIndex(Number(b.x) || 0);
    if (zA !== zB) return zA - zB;
    const yDiff = (Number(a.y) || 0) - (Number(b.y) || 0);
    if (Math.abs(yDiff) > 1) return yDiff;
    return (Number(a.x) || 0) - (Number(b.x) || 0);
  });

  currentPalaceObj.pins.forEach((p, idx) => {
    p.num = idx + 1;
  });

  if (focusPinRef) {
    const newIdx = currentPalaceObj.pins.indexOf(focusPinRef);
    if (newIdx >= 0) currentPinIdx = newIdx;
  }
}

function pushPalaceUndoSnapshot() {
  if (!currentPalaceObj) return;
  palaceUndoStack.push({
    palaceJson: JSON.stringify(currentPalaceObj),
    pinIdx: currentPinIdx,
    clearedArr: Array.from(palaceClearedSet)
  });
  if (palaceUndoStack.length > 30) palaceUndoStack.shift();
  palaceRedoStack = [];
  updatePalaceUndoRedoButtons();
}

function updatePalaceUndoRedoButtons() {
  const uCnt = document.getElementById('palaceUndoCount');
  const rCnt = document.getElementById('palaceRedoCount');
  if (uCnt) uCnt.textContent = String(palaceUndoStack.length);
  if (rCnt) rCnt.textContent = String(palaceRedoStack.length);
}

function undoPalaceEdit() {
  if (!palaceUndoStack.length) {
    return alert('되돌릴 기억의 궁전 편집 기록이 없습니다.');
  }
  if (currentPalaceObj) {
    palaceRedoStack.push({
      palaceJson: JSON.stringify(currentPalaceObj),
      pinIdx: currentPinIdx,
      clearedArr: Array.from(palaceClearedSet)
    });
  }
  const snap = palaceUndoStack.pop();
  currentPalaceObj = JSON.parse(snap.palaceJson);
  currentPinIdx = Math.max(0, Math.min((currentPalaceObj.pins.length || 1) - 1, snap.pinIdx || 0));
  palaceClearedSet = new Set(snap.clearedArr || []);

  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (t) syncPalaceToMemoryAndCache(t.id, currentPalaceObj);

  updatePalaceUndoRedoButtons();
  applyPalaceImageSource();
  renderPalacePinsAndRoute();
  updatePalaceSideConsole();
}

function redoPalaceEdit() {
  if (!palaceRedoStack.length) {
    return alert('다시 실행할 편집 기록이 없습니다.');
  }
  if (currentPalaceObj) {
    palaceUndoStack.push({
      palaceJson: JSON.stringify(currentPalaceObj),
      pinIdx: currentPinIdx,
      clearedArr: Array.from(palaceClearedSet)
    });
  }
  const snap = palaceRedoStack.pop();
  currentPalaceObj = JSON.parse(snap.palaceJson);
  currentPinIdx = Math.max(0, Math.min((currentPalaceObj.pins.length || 1) - 1, snap.pinIdx || 0));
  palaceClearedSet = new Set(snap.clearedArr || []);

  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (t) syncPalaceToMemoryAndCache(t.id, currentPalaceObj);

  updatePalaceUndoRedoButtons();
  applyPalaceImageSource();
  renderPalacePinsAndRoute();
  updatePalaceSideConsole();
}

function initPalaceCanvasDoubleClickAdd() {
  const mover = document.getElementById('palaceCanvasMover');
  if (!mover) return;

  mover.addEventListener('dblclick', (e) => {
    if (!palaceEditMode || !currentPalaceObj) return;
    if (e.target.closest('.palace-pin')) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = mover.getBoundingClientRect();
    let x = Math.max(4, Math.min(96, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    let y = Math.max(6, Math.min(93, Math.round(((e.clientY - rect.top) / rect.height) * 100)));

    const z = getPalaceZoneIndex(x);
    const sameZonePin = (currentPalaceObj.pins || []).find(p => getPalaceZoneIndex(p.x) === z && Math.abs(p.x - x) <= 3);
    if (sameZonePin) x = sameZonePin.x;

    createPalacePinAtCoordinates(x, y);
  });
}

function createPalacePinAtCoordinates(x, y) {
  if (!currentPalaceObj) return;
  const zoneIdx = getPalaceZoneIndex(x);
  const zoneNames = ['좌측 구역', '중앙 구역', '우측 구역'];

  const ans = prompt(`[${zoneNames[zoneIdx]} (x:${x}%, y:${y}%)]에 추가할 거점의 암기 키워드(정답)를 입력하세요:\n※ 추가 즉시 위➔아래, 좌➔우 순서에 맞춰 뒷번호들이 자동으로 +1씩 밀립니다!`, '새 핵심단어 입력');
  if (!ans || !ans.trim()) return;
  const story = prompt('이 거점의 공간 연상 스토리 힌트를 입력하세요 (생략 가능):', '') || '';

  pushPalaceUndoSnapshot();

  currentTopicHasRealPalace = true;
  document.getElementById('palaceViewport')?.querySelector('.palace-empty-notice')?.remove();

  const newPin = {
    num: 1,
    x: x,
    y: y,
    room: `${zoneNames[zoneIdx]} 거점`,
    storyHint: story.trim(),
    answer: ans.trim(),
    matchKeywords: [ans.trim()]
  };

  currentPalaceObj.pins.push(newPin);
  sortPalacePinsByZoneAndY(newPin);

  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (t) syncPalaceToMemoryAndCache(t.id, currentPalaceObj);

  filterTopicsList();
  renderPalacePinsAndRoute();
  updatePalaceSideConsole();
}

function initPalaceForCurrentTopic(topic) {
  document.getElementById('palaceTopicIdLabel').textContent = topic.id || '';
  const externalPalace = window.MEMORY_PALACES[topic.id] || topic.memoryPalace;

  const viewport = document.getElementById('palaceViewport');
  viewport.querySelector('.palace-empty-notice')?.remove();

  if (externalPalace && Array.isArray(externalPalace.pins) && externalPalace.pins.length > 0) {
    currentTopicHasRealPalace = true;
    currentPalaceObj = JSON.parse(JSON.stringify(externalPalace));
  } else {
    currentTopicHasRealPalace = false;
    currentPalaceObj = {
      imageFile: `${topic.id}.jpg`,
      fallbackUrl: "",
      title: topic.title + " — 기억의 궁전 미등록",
      pins: []
    };

    const notice = document.createElement('div');
    notice.className = 'palace-empty-notice';
    notice.innerHTML = `
      <span class="sg-ico xl s-study c-01"></span>
      <div style="font-size:18px; font-weight:900; color:#fde047;">🏛️ 현재 토픽(${topic.title})은 아직 기억의 궁전이 등록되지 않았습니다.</div>
      <div style="font-size:13.5px; color:#cbd5e1; max-width:580px; line-height:1.6;">
        기억의 궁전이 완성된 토픽으로 이동하시거나,<br>
        상단 <b>[데이터투입·저장]</b> 또는 <b>[거점 추가]</b>로 이 토픽의 새 궁전을 만들어 보세요!
      </div>
      <div style="display:flex; gap:10px; margin-top:6px; flex-wrap:wrap; justify-content:center;">
        <button class="btn-gold teal-active" style="padding:9px 18px; font-size:14px;" onclick="jumpToFirstPalaceTopic()">
          🏛️ 등록된 기억의 궁전 바로 열기 ▶
        </button>
        <button class="btn-gold" style="padding:9px 16px; font-size:13.5px;" onclick="createBlankPalaceForCurrentTopic()">
          ➕ 현재 토픽에 새 궁전 만들기
        </button>
      </div>
    `;
    viewport.appendChild(notice);
  }

  currentPinIdx = 0;
  currentPinRevealed = false;
  palaceClearedSet.clear();
  if (currentTopicHasRealPalace) {
    applyPalaceImageSource();
  } else {
    document.getElementById('palaceFileNameLabel').textContent = '미등록 (궁전 없음)';
    const bgImg = document.getElementById('palaceBgImg');
    if (bgImg) bgImg.removeAttribute('src');
  }
  renderPalacePinsAndRoute();
  updatePalaceSideConsole();
}

function jumpToFirstPalaceTopic() {
  const topics = window.STUDY_TOPICS || [];
  const targetIdx = topics.findIndex(t => window.MEMORY_PALACES[t.id] || t.memoryPalace);
  if (targetIdx >= 0) {
    loadTopic(targetIdx);
    switchMainStageMode('palace');
  }
}

function createBlankPalaceForCurrentTopic() {
  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (!t) return;
  const imgName = prompt('사용할 궁전 이미지 파일명을 입력하세요 (예: alarm_41.jpg):', `${t.id}.jpg`);
  if (!imgName) return;

  const newPalace = {
    imageFile: imgName.trim(),
    fallbackUrl: "",
    title: t.title + " — 기억의 궁전",
    pins: [
      { num: 1, x: 18, y: 20, room: "좌측 구역", storyHint: "첫 번째 연상 스토리를 입력하세요.", answer: "1. 개요", matchKeywords: [] }
    ]
  };
  syncPalaceToMemoryAndCache(t.id, newPalace);
  filterTopicsList();
  initPalaceForCurrentTopic(t);
}

function applyPalaceImageSource() {
  if (!currentPalaceObj) return;
  const rawFile = (currentPalaceObj.imageFile || 'pl1.jpg').trim();
  document.getElementById('palaceFileNameLabel').textContent = rawFile;

  const img = document.getElementById('palaceBgImg');
  const baseName = rawFile.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  const extVariants = [
    `${baseName}.jpg`,
    rawFile,
    `${baseName}.png`,
    `${baseName}.jpeg`,
    `${baseName}.webp`
  ];
  const uniqueFiles = Array.from(new Set(extVariants));

  const candidates = [];
  uniqueFiles.forEach(fn => {
    candidates.push(`samguk_library/${fn}`);
    candidates.push(`samguk_library/palaces/${fn}`);
    candidates.push(`./${fn}`);
  });

  if (currentPalaceObj.fallbackUrl && !currentPalaceObj.fallbackUrl.includes('vrfrR8l0')) {
    candidates.push(currentPalaceObj.fallbackUrl);
  }
  candidates.push('https://www.genspark.ai/api/files/s/p4hWNEi9');

  let tryIdx = 0;
  img.onload = () => {
    const loadedSrc = candidates[tryIdx] || '';
    const matchedName = loadedSrc.split('/').pop();
    if (matchedName && /\.(png|jpg|jpeg|webp)$/i.test(matchedName)) {
      document.getElementById('palaceFileNameLabel').textContent = matchedName;
    }
  };
  img.onerror = () => {
    tryIdx++;
    if (tryIdx < candidates.length) img.src = candidates[tryIdx];
  };
  img.src = candidates[0];
}

function renderPalacePinsAndRoute() {
  const pinsLayer = document.getElementById('palacePinsLayer');
  const svg = document.getElementById('palaceRouteSvg');
  if (!pinsLayer || !svg) return;
  pinsLayer.innerHTML = '';
  svg.innerHTML = '';

  const pins = currentPalaceObj?.pins || [];
  if (!pins.length) return;

  if (pins.length > 1) {
    const pts = pins.map(p => `${p.x},${p.y}`).join(' ');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    poly.setAttribute('points', pts);
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', 'rgba(253, 224, 71, 0.72)');
    poly.setAttribute('stroke-width', '0.6');
    poly.setAttribute('stroke-dasharray', '1.4 1.0');
    svg.appendChild(poly);
  }

  pins.forEach((p, idx) => {
    const pinEl = document.createElement('div');
    let stateCls = 'state-locked';
    if (idx === currentPinIdx) stateCls = 'state-current';
    else if (palaceClearedSet.has(idx)) stateCls = 'state-cleared';

    pinEl.className = `palace-pin ${stateCls}`;
    pinEl.dataset.pinIdx = String(idx);
    pinEl.style.left = p.x + '%';
    pinEl.style.top = p.y + '%';

    const numBadge = document.createElement('div');
    numBadge.className = 'palace-pin-num';
    const pNum = p.num || (idx + 1);
    numBadge.textContent = pNum;
    pinEl.appendChild(numBadge);

    const tag = document.createElement('div');
    tag.className = 'palace-pin-tag';
    const isCleared = palaceClearedSet.has(idx) || (idx === currentPinIdx && currentPinRevealed);
    tag.textContent = isCleared ? p.answer : getPalacePinChosungLabel(p.answer, pNum);
    pinEl.appendChild(tag);

    pinEl.onmousedown = (e) => {
      if (palaceEditMode) {
        e.stopPropagation();
        pushPalaceUndoSnapshot();
        draggingPinIdx = idx;
        dragMovedFlag = false;
      }
    };

    pinEl.onclick = (e) => {
      e.stopPropagation();
      if (palaceEditMode) {
        currentPinIdx = idx;
        updatePalaceSideConsole();
        return;
      }
      if (sgAreaSelectMode) {
        togglePickPalacePinForAreaSpeech(pinEl);
        return;
      }
      if (currentPinIdx === idx && !palaceClearedSet.has(idx)) {
        revealOrNextPalacePin();
      } else {
        currentPinIdx = idx;
        currentPinRevealed = true;
        palaceClearedSet.add(idx);
        renderPalacePinsAndRoute();
        updatePalaceSideConsole();
        syncMaskToggleButtonsUI();
        speakAnkiCardInstant(`${p.answer}. ${p.storyHint || ''}`);
        saveCurrentStudySession();
        updateFloatingRemoteUI();
      }
    };

    pinsLayer.appendChild(pinEl);
  });

  updatePalaceCameraTransform();
}

function togglePickPalacePinForAreaSpeech(pinEl) {
  const existIdx = sgSelectedElements.indexOf(pinEl);
  if (existIdx >= 0) {
    pinEl.classList.remove('sg-area-picked', 'sg-area-reading');
    pinEl.querySelector('.sg-area-order-badge')?.remove();
    sgSelectedElements.splice(existIdx, 1);
  } else {
    pinEl.classList.add('sg-area-picked');
    sgSelectedElements.push(pinEl);
  }
  refreshSgAreaBadges();
}

function updatePalaceCameraTransform() {
  const mover = document.getElementById('palaceCanvasMover');
  if (!mover) return;
  const pins = currentPalaceObj?.pins || [];
  if (!palaceCameraZoomOn || palaceEditMode || !pins.length) {
    mover.style.transform = 'translate(0%, 0%) scale(1)';
    return;
  }
  const p = pins[currentPinIdx] || pins[0];
  const scale = 1.78;
  const tx = Math.max(-36, Math.min(36, (50 - p.x) * 0.72));
  const ty = Math.max(-36, Math.min(36, (50 - p.y) * 0.72));
  mover.style.transform = `scale(${scale}) translate(${tx}%, ${ty}%)`;
}

function updatePalaceSideConsole() {
  const pins = currentPalaceObj?.pins || [];
  const roomEl = document.getElementById('palaceRoomLabel');
  const storyEl = document.getElementById('palaceStoryText');
  const ansBox = document.getElementById('palaceAnswerText');
  const btnTxt = document.getElementById('palaceActionBtnText');
  if (!roomEl || !storyEl || !ansBox || !btnTxt) return;

  if (!pins.length) {
    roomEl.textContent = '기억의 궁전 미등록 토픽';
    storyEl.textContent = '좌측 화면의 [기억의 궁전 바로 열기] 또는 [데이터투입·저장] 버튼을 눌러보세요!';
    ansBox.textContent = '-';
    return;
  }
  currentPinIdx = Math.max(0, Math.min(pins.length - 1, currentPinIdx));
  const p = pins[currentPinIdx];
  const isCleared = currentPinRevealed || palaceClearedSet.has(currentPinIdx);

  roomEl.textContent = `${p.room || '기억의 방'} — 거점 #${currentPinIdx + 1} / ${pins.length}`;

  if (isCleared) {
    storyEl.textContent = p.storyHint || '';
    ansBox.textContent = `★ ${p.answer}`;
    ansBox.style.color = '#047857';
    btnTxt.textContent = palaceClearedSet.size >= pins.length
      ? `Space — 다음 거점 순환 낭독 (#${((currentPinIdx + 1) % pins.length) + 1}번으로) ▶`
      : 'Space — 다음 거점 해금 & 낭독 ▶';
  } else {
    storyEl.textContent = p.storyHint || '';
    ansBox.textContent = `🔒 [ #${currentPinIdx + 1} 가림막 — 클릭 또는 Space로 확인 ]`;
    ansBox.style.color = '#b45309';
    btnTxt.textContent = 'Space — 정답 해금 & Edge TTS 낭독';
  }
  updateFloatingRemoteUI();
}

function revealOrNextPalacePin() {
  const pins = currentPalaceObj?.pins || [];
  if (!pins.length) return;
  const p = pins[currentPinIdx];

  if (!currentPinRevealed && !palaceClearedSet.has(currentPinIdx)) {
    currentPinRevealed = true;
    palaceClearedSet.add(currentPinIdx);

    const kwList = p.matchKeywords || [p.answer];
    ankiQueue.forEach(q => {
      if (kwList.some(k => k && q.answer.includes(k))) {
        toggleClozeElementReveal(q.el, true);
      }
    });
    updateAnkiHudProgress();

    renderPalacePinsAndRoute();
    updatePalaceSideConsole();
    syncMaskToggleButtonsUI();
    if (typeof window.speakPalacePinWithStory === 'function') {
      window.speakPalacePinWithStory(p.answer, p.storyHint || '');
    } else {
      speakAnkiCardInstant(`${p.answer} | ${p.storyHint || ''}`);
    }
    saveCurrentStudySession();
  } else {
    currentPinIdx = (currentPinIdx + 1) % pins.length;
    const nextPin = pins[currentPinIdx];
    currentPinRevealed = true;
    palaceClearedSet.add(currentPinIdx);

    const kwList = nextPin.matchKeywords || [nextPin.answer];
    ankiQueue.forEach(q => {
      if (kwList.some(k => k && q.answer.includes(k))) {
        toggleClozeElementReveal(q.el, true);
      }
    });
    updateAnkiHudProgress();

    renderPalacePinsAndRoute();
    updatePalaceSideConsole();
    syncMaskToggleButtonsUI();
    if (typeof window.speakPalacePinWithStory === 'function') {
      window.speakPalacePinWithStory(nextPin.answer, nextPin.storyHint || '');
    } else {
      speakAnkiCardInstant(`${nextPin.answer} | ${nextPin.storyHint || ''}`);
    }
    saveCurrentStudySession();
  }
}

function movePalacePinStep(delta) {
  const pins = currentPalaceObj?.pins || [];
  if (!pins.length) return;
  currentPinIdx = (currentPinIdx + delta + pins.length) % pins.length;
  currentPinRevealed = palaceClearedSet.has(currentPinIdx);
  renderPalacePinsAndRoute();
  updatePalaceSideConsole();
  if (currentPinRevealed) {
    const p = pins[currentPinIdx];
    speakAnkiCardInstant(`${p.answer}. ${p.storyHint || ''}`);
  }
  saveCurrentStudySession();
}

function togglePalaceCameraZoom() {
  palaceCameraZoomOn = !palaceCameraZoomOn;
  const btn = document.getElementById('btnPalaceZoomToggle');
  const txt = document.getElementById('palaceZoomBtnText');
  const ico = document.getElementById('palaceZoomIcon');
  btn.classList.toggle('teal-active', palaceCameraZoomOn);
  txt.textContent = palaceCameraZoomOn ? '현재 거점 클로즈업 ON' : '전체그림 고정 (한눈에 보기)';
  ico.className = palaceCameraZoomOn ? 'sg-ico sm s-pins c-20' : 'sg-ico sm s-pins c-21';
  updatePalaceCameraTransform();
}

function resetPalaceAllPins() {
  palaceClearedSet.clear();
  currentPinIdx = 0;
  currentPinRevealed = false;
  masterMaskOn = true;

  const box = document.getElementById('subnoteBox');
  if (box) box.classList.remove('peek-all-mode');
  if (window.state.clozeStage === 0) {
    window.state.clozeStage = stageBeforeUnmask || 2;
    for (let i = 0; i <= 4; i++) {
      document.getElementById('stepTab' + i)?.classList.toggle('active', i === window.state.clozeStage);
      document.getElementById('remStep' + i)?.classList.toggle('active', i === window.state.clozeStage);
    }
  }
  renderSubnoteAndBuildAnki(window.state.clozeStage);
  renderPalacePinsAndRoute();
  updatePalaceSideConsole();
  syncMaskToggleButtonsUI();
  saveCurrentStudySession();
}

function promptChangePalaceImageFile() {
  if (!currentPalaceObj) return;
  const next = prompt('samguk_library/ 폴더에 넣은 궁전 이미지 파일명을 입력하세요 (확장자 .png / .jpg 자동 인식):', currentPalaceObj.imageFile || 'pl1.jpg');
  if (next && next.trim()) {
    pushPalaceUndoSnapshot();
    currentPalaceObj.imageFile = next.trim();
    const t = window.STUDY_TOPICS[window.state.topicIdx];
    if (t) syncPalaceToMemoryAndCache(t.id, currentPalaceObj);
    applyPalaceImageSource();
  }
}

function togglePalaceEditMode() {
  palaceEditMode = !palaceEditMode;
  const btn = document.getElementById('btnPalaceEditMode');
  btn.classList.toggle('active', palaceEditMode);
  document.getElementById('palaceEditModeText').textContent = palaceEditMode ? '거점편집 ON(드래그·더블클릭추가)' : '거점편집 OFF';
  const guide = document.getElementById('palaceZoneGuideOverlay');
  if (guide) guide.classList.toggle('active', palaceEditMode);
  updatePalaceCameraTransform();
}

window.addEventListener('mousemove', (e) => {
  if (!palaceEditMode || draggingPinIdx < 0 || !currentPalaceObj) return;
  dragMovedFlag = true;
  const mover = document.getElementById('palaceCanvasMover');
  const rect = mover.getBoundingClientRect();
  let x = Math.max(3, Math.min(97, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
  let y = Math.max(5, Math.min(93, Math.round(((e.clientY - rect.top) / rect.height) * 100)));

  const z = getPalaceZoneIndex(x);
  const movedPin = currentPalaceObj.pins[draggingPinIdx];
  const snapCandidate = currentPalaceObj.pins.find((p, i) => i !== draggingPinIdx && getPalaceZoneIndex(p.x) === z && Math.abs(p.x - x) <= 2);
  if (snapCandidate) x = snapCandidate.x;

  movedPin.x = x;
  movedPin.y = y;
  renderPalacePinsAndRoute();
});

window.addEventListener('mouseup', () => {
  if (draggingPinIdx >= 0) {
    const movedPin = currentPalaceObj?.pins?.[draggingPinIdx];
    draggingPinIdx = -1;
    if (!dragMovedFlag) {
      palaceUndoStack.pop();
      updatePalaceUndoRedoButtons();
      return;
    }
    sortPalacePinsByZoneAndY(movedPin);
    const t = window.STUDY_TOPICS[window.state.topicIdx];
    if (t) syncPalaceToMemoryAndCache(t.id, currentPalaceObj);
    renderPalacePinsAndRoute();
    updatePalaceSideConsole();
  }
});

function editCurrentPalacePinDialog() {
  const pins = currentPalaceObj?.pins || [];
  if (!pins.length) return;
  const p = pins[currentPinIdx];
  const newRoom = prompt('1. 소속 구역(방) 이름:', p.room || '');
  if (newRoom === null) return;
  const newStory = prompt('2. 공간 연상 스토리 힌트:', p.storyHint || '');
  if (newStory === null) return;
  const newAns = prompt('3. 정답 키워드/두문자:', p.answer || '');
  if (newAns === null) return;

  pushPalaceUndoSnapshot();

  p.room = newRoom.trim();
  p.storyHint = newStory.trim();
  p.answer = newAns.trim();

  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (t) syncPalaceToMemoryAndCache(t.id, currentPalaceObj);
  renderPalacePinsAndRoute();
  updatePalaceSideConsole();
}

function addNewPalacePin() {
  if (!currentPalaceObj) return;

  const zoneChoice = prompt(
    '새 거점을 어느 구역에 추가할까요? (번호 입력)\n' +
    '1 = 좌측 구역 맨 아래 (추가 시 중앙·우측 번호가 +1씩 증가)\n' +
    '2 = 중앙 구역 위쪽 (추가 시 중앙 아래·우측 번호가 +1씩 증가)\n' +
    '3 = 중앙 구역 아래쪽 (추가 시 우측 번호가 +1씩 증가)\n' +
    '4 = 우측 구역 위쪽 (추가 시 우측 아래 번호가 +1씩 증가)\n' +
    '5 = 우측 구역 맨 아래 (기존 번호 변화 없음)\n' +
    '※ 팁: [거점편집 ON] 상태에서 원하는 위치를 마우스로 더블클릭해도 바로 추가됩니다!',
    '1'
  );
  if (!zoneChoice) return;

  const pins = currentPalaceObj.pins || [];
  let targetX = 18;
  let targetY = 82;

  const leftPins = pins.filter(p => getPalaceZoneIndex(p.x) === 0);
  const midPins  = pins.filter(p => getPalaceZoneIndex(p.x) === 1);
  const rightPins = pins.filter(p => getPalaceZoneIndex(p.x) === 2);

  const c = zoneChoice.trim();
  if (c === '1') {
    targetX = leftPins.length ? leftPins[0].x : 18;
    const maxY = leftPins.length ? Math.max(...leftPins.map(p => p.y)) : 50;
    targetY = Math.min(92, maxY + 14);
  } else if (c === '2') {
    targetX = midPins.length ? midPins[0].x : 50;
    const minY = midPins.length ? Math.min(...midPins.map(p => p.y)) : 50;
    targetY = Math.max(12, minY - 22);
  } else if (c === '3') {
    targetX = midPins.length ? midPins[0].x : 50;
    const maxY = midPins.length ? Math.max(...midPins.map(p => p.y)) : 50;
    targetY = Math.min(92, maxY + 16);
  } else if (c === '4') {
    targetX = rightPins.length ? rightPins[0].x : 82;
    const minY = rightPins.length ? Math.min(...rightPins.map(p => p.y)) : 50;
    targetY = Math.max(12, minY - 22);
  } else {
    targetX = rightPins.length ? rightPins[0].x : 82;
    const maxY = rightPins.length ? Math.max(...rightPins.map(p => p.y)) : 50;
    targetY = Math.min(92, maxY + 16);
  }

  createPalacePinAtCoordinates(targetX, targetY);
}

function deleteCurrentPalacePin() {
  const pins = currentPalaceObj?.pins || [];
  if (pins.length <= 1) return alert('최소 1개의 거점은 유지해야 합니다.');
  if (!confirm(`현재 거점 #${currentPinIdx + 1} (${pins[currentPinIdx].answer})을 삭제할까요?\n(삭제 후 뒷번호들이 자동으로 당겨집니다. 실수 시 Ctrl+Z로 복구 가능)`)) return;

  pushPalaceUndoSnapshot();

  pins.splice(currentPinIdx, 1);
  sortPalacePinsByZoneAndY();
  currentPinIdx = Math.max(0, Math.min(pins.length - 1, currentPinIdx));

  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (t) syncPalaceToMemoryAndCache(t.id, currentPalaceObj);
  renderPalacePinsAndRoute();
  updatePalaceSideConsole();
}

/**
 * ============================================================================
 * ★ [1회 지정 영구 자동저장 시스템 — showSaveFilePicker + IndexedDB] ★
 * ============================================================================
 */
async function readExistingJsDataFromHandle() {
  return null;
}

async function verifyReadWritePermission() {
  return true;
}

function showAutoSaveToast(msg) {
  let toast = document.getElementById('samengAutoSaveToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'samengAutoSaveToast';
    toast.style.cssText = 'position:fixed; top:14px; right:20px; z-index:9999; background:linear-gradient(135deg,#0f766e,#14b8a6); color:#fff; border:2px solid #99f6e4; border-radius:99px; padding:7px 16px; font-size:12.5px; font-weight:900; box-shadow:0 8px 20px rgba(15,23,42,0.28); transition:opacity 0.25s ease; pointer-events:none; opacity:0;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._hideTid);
  toast._hideTid = setTimeout(() => { toast.style.opacity = '0'; }, 2400);
}

function downloadBothJsFilesFallback() {
  const cleanTopics = (window.STUDY_TOPICS || []).map(t => {
    const copy = Object.assign({}, t);
    delete copy.memoryPalace;
    return copy;
  });
  const tContent = "// 📘 삼국지 × 소방기술사 [topics_data.js]\nwindow.STUDY_TOPICS = " + JSON.stringify(cleanTopics, null, 2) + ";\n";
  const tBlob = new Blob(['\uFEFF' + tContent], { type: 'text/javascript;charset=utf-8' });
  const a1 = document.createElement('a');
  a1.href = URL.createObjectURL(tBlob);
  a1.download = 'topics_data.js';
  document.body.appendChild(a1);
  a1.click();
  a1.remove();

  setTimeout(() => {
    const pContent = "// 🏛️ 삼국지 × 소방기술사 [palaces_data.js]\nwindow.MEMORY_PALACES = " + JSON.stringify(window.MEMORY_PALACES || {}, null, 2) + ";\n";
    const pBlob = new Blob(['\uFEFF' + pContent], { type: 'text/javascript;charset=utf-8' });
    const a2 = document.createElement('a');
    a2.href = URL.createObjectURL(pBlob);
    a2.download = 'palaces_data.js';
    document.body.appendChild(a2);
    a2.click();
    a2.remove();
  }, 450);
}
window.downloadBothJsFilesFallback = downloadBothJsFilesFallback;

async function connectSamengProjectDirectory() {
  downloadBothJsFilesFallback();
  return true;
}

async function autoSaveToConnectedFiles({ saveTopics = true, savePalaces = true, silent = true } = {}) {
  try {
    if (saveTopics) await saveTopicsDataJsFileDirectly(false, true);
    if (savePalaces) await savePalacesDataJsFileDirectly(false, true);

    const tCount = (window.STUDY_TOPICS || []).length;
    const pCount = Object.keys(window.MEMORY_PALACES || {}).length;

    if (silent) {
      showAutoSaveToast(`💾 IndexedDB 자동저장 완료 (토픽 ${tCount}개 · 궁전 ${pCount}개)`);
    } else {
      showAutoSaveToast(`✅ 영구 자동저장 완료! (토픽 ${tCount}개 · 궁전 ${pCount}개)`);
      alert(`✅ [대용량 IndexedDB 영구 자동저장 완료!]\n• 저장된 총 토픽 수 : ${tCount}개\n• 저장된 기억의 궁전 : ${pCount}개\n\n파일이나 폴더를 지정할 필요 없이 브라우저 대용량 DB에 안전하게 영구 저장되었습니다!\n(F5 새로고침이나 컴퓨터 재부팅 후에도 100% 그대로 유지됩니다.)`);
    }
    updateAutoSaveStatusBadgeUI();
    return true;
  } catch (e) {
    if (!silent) alert('자동저장 오류: ' + e.message);
    return false;
  }
}

async function savePalacesDataJsFileDirectly() {
  try {
    const cleanPalaces = {};
    Object.keys(window.MEMORY_PALACES || {}).forEach(k => {
      if (!EXPLICIT_DELETED_TOPIC_IDS.has(k) && window.MEMORY_PALACES[k]) {
        cleanPalaces[k] = window.MEMORY_PALACES[k];
      }
    });
    window.MEMORY_PALACES = cleanPalaces;
    await idbSetItem('backups', 'all_palaces_snapshot', window.MEMORY_PALACES);
    try {
      localStorage.setItem('samguk_palaces_delta_v2', JSON.stringify(window.MEMORY_PALACES));
    } catch (e) {}
    return true;
  } catch (err) {
    return false;
  }
}
window.savePalacesDataJsFileDirectly = savePalacesDataJsFileDirectly;

async function saveTopicsDataJsFileDirectly() {
  try {
    const cleanTopics = [];
    (window.STUDY_TOPICS || []).forEach(t => {
      if (!t || !t.id || EXPLICIT_DELETED_TOPIC_IDS.has(t.id)) return;
      const copy = Object.assign({}, t);
      if (copy.memoryPalace && Array.isArray(copy.memoryPalace.pins)) {
        window.MEMORY_PALACES[copy.id] = copy.memoryPalace;
      }
      delete copy.memoryPalace;
      cleanTopics.push(copy);
      INITIAL_FILE_TOPIC_IDS.add(copy.id);
    });
    window.STUDY_TOPICS = cleanTopics;
    await idbSetItem('backups', 'all_topics_snapshot', window.STUDY_TOPICS);
    await idbSetItem('backups', 'all_palaces_snapshot', window.MEMORY_PALACES);
    localStorage.removeItem('samguk_injected_topics_v1');
    initCategoryAndTopicSelectors();
    return true;
  } catch (err) {
    return false;
  }
}
window.saveTopicsDataJsFileDirectly = saveTopicsDataJsFileDirectly;

function switchMainStageMode(mode) {
  currentMainMode = mode;
  const samgukEl = document.getElementById('samgukBattleStage');
  const palaceEl = document.getElementById('memoryPalaceStage');
  const btnS = document.getElementById('btnModeSamguk');
  const btnP = document.getElementById('btnModePalace');

  if (mode === 'palace') {
    samgukEl.style.display = 'none';
    palaceEl.classList.add('active');
    btnS.classList.remove('active-samguk');
    btnP.classList.add('active-palace');
    stopSpeedFocusCountdown();
    updatePalaceCameraTransform();
  } else {
    samgukEl.style.display = 'flex';
    palaceEl.classList.remove('active');
    btnS.classList.add('active-samguk');
    btnP.classList.remove('active-palace');
  }
  syncMaskToggleButtonsUI();
  saveCurrentStudySession();
  updateFloatingRemoteUI();
}

function changeBattleTheme(themeKey) {
  const cfg = BATTLEFIELD_RIVALS[themeKey] || BATTLEFIELD_RIVALS.redcliff;
  const stage = document.getElementById('samgukBattleStage');
  stage.style.backgroundImage = `url('${cfg.bg}')`;
  document.getElementById('rivalMatchText').textContent = cfg.text;
  document.getElementById('bossTitleText').textContent = `${cfg.boss} — 서브노트 방어선`;

  const allyEl = document.getElementById('allyHeroStand');
  const enemyEl = document.getElementById('enemyHeroStand');
  allyEl.style.backgroundImage = `url('${cfg.allySheet}')`;
  allyEl.style.backgroundPosition = cfg.allyPos;
  enemyEl.style.backgroundImage = `url('${cfg.enemySheet}')`;
  enemyEl.style.backgroundPosition = cfg.enemyPos;
  saveCurrentStudySession();
}

function setStageHeightPreset(val) {
  const h = Number(val);
  const samgukEl = document.getElementById('samgukBattleStage');
  const palaceEl = document.getElementById('memoryPalaceStage');
  if (h === 0) {
    samgukEl.style.display = 'none';
    palaceEl.classList.remove('active');
    return;
  }
  document.documentElement.style.setProperty('--stage-height', h + 'px');
  localStorage.setItem('samguk_stage_height', String(h));
  switchMainStageMode(currentMainMode);
}

function initStageResizeDrag() {
  const bar = document.getElementById('stageResizeBar');
  let dragging = false;
  bar.addEventListener('mousedown', () => { dragging = true; });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const newH = Math.max(220, Math.min(840, e.clientY - 95));
    document.documentElement.style.setProperty('--stage-height', newH + 'px');
    localStorage.setItem('samguk_stage_height', String(newH));
  });
  window.addEventListener('mouseup', () => { dragging = false; });
}

function initFloatingRemoteDrag() {
  const remote = document.getElementById('sgFloatingRemote');
  const header = document.getElementById('remoteDragHeader');
  const orb = document.getElementById('remoteMiniOrb');
  if (!remote || !header) return;

  try {
    const saved = JSON.parse(localStorage.getItem('samguk_floating_remote_v1') || '{}');
    if (typeof saved.left === 'number' && typeof saved.top === 'number') {
      remote.style.left = Math.max(8, Math.min(window.innerWidth - 100, saved.left)) + 'px';
      remote.style.top = Math.max(8, Math.min(window.innerHeight - 60, saved.top)) + 'px';
      remote.style.right = 'auto';
      remote.style.bottom = 'auto';
    }
    const opBtn = document.getElementById('remBtnOpacity');
    if (saved.opacityLevel === 1) {
      remote.classList.add('trans-mid');
      if (opBtn) opBtn.textContent = '투명: 50%';
    } else if (saved.opacityLevel === 2) {
      remote.classList.add('trans-high');
      if (opBtn) opBtn.textContent = '투명: 20%';
    }
    if (saved.minimized) {
      remote.classList.add('minimized');
    }
  } catch (e) {}

  let dragging = false;
  let offX = 0;
  let offY = 0;

  header.addEventListener('mousedown', (e) => {
    if (e.target.closest('button')) return;
    dragging = true;
    const r = remote.getBoundingClientRect();
    offX = e.clientX - r.left;
    offY = e.clientY - r.top;
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const w = remote.getBoundingClientRect().width;
    remote.style.left = Math.max(6, Math.min(window.innerWidth - w - 6, e.clientX - offX)) + 'px';
    remote.style.top = Math.max(6, Math.min(window.innerHeight - 48, e.clientY - offY)) + 'px';
    remote.style.right = 'auto';
    remote.style.bottom = 'auto';
  });

  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    document.body.style.userSelect = '';
    saveFloatingRemotePos();
  });

  if (orb) {
    let orbDrag = false;
    let orbMoved = false;
    let ox = 0;
    let oy = 0;
    orb.addEventListener('mousedown', (e) => {
      orbDrag = true;
      orbMoved = false;
      const r = remote.getBoundingClientRect();
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      document.body.style.userSelect = 'none';
    });
    window.addEventListener('mousemove', (e) => {
      if (!orbDrag) return;
      orbMoved = true;
      remote.style.left = Math.max(6, Math.min(window.innerWidth - 72, e.clientX - ox)) + 'px';
      remote.style.top = Math.max(6, Math.min(window.innerHeight - 72, e.clientY - oy)) + 'px';
      remote.style.right = 'auto';
      remote.style.bottom = 'auto';
    });
    window.addEventListener('mouseup', () => {
      if (!orbDrag) return;
      orbDrag = false;
      document.body.style.userSelect = '';
      if (!orbMoved) remote.classList.remove('minimized');
      saveFloatingRemotePos();
    });
  }
}

function saveFloatingRemotePos() {
  const remote = document.getElementById('sgFloatingRemote');
  if (!remote) return;
  const r = remote.getBoundingClientRect();
  let op = 0;
  if (remote.classList.contains('trans-mid')) op = 1;
  else if (remote.classList.contains('trans-high')) op = 2;
  try {
    localStorage.setItem('samguk_floating_remote_v1', JSON.stringify({
      left: Math.round(r.left),
      top: Math.round(r.top),
      opacityLevel: op,
      minimized: remote.classList.contains('minimized')
    }));
  } catch (e) {}
}

function cycleFloatingRemoteOpacity() {
  const remote = document.getElementById('sgFloatingRemote');
  const opBtn = document.getElementById('remBtnOpacity');
  if (!remote) return;
  if (!remote.classList.contains('trans-mid') && !remote.classList.contains('trans-high')) {
    remote.classList.add('trans-mid');
    if (opBtn) opBtn.textContent = '투명: 50%';
  } else if (remote.classList.contains('trans-mid')) {
    remote.classList.remove('trans-mid');
    remote.classList.add('trans-high');
    if (opBtn) opBtn.textContent = '투명: 20%';
  } else {
    remote.classList.remove('trans-high');
    if (opBtn) opBtn.textContent = '투명: 100%';
  }
  saveFloatingRemotePos();
}

function resetFloatingRemotePosition() {
  const remote = document.getElementById('sgFloatingRemote');
  if (!remote) return;
  remote.classList.remove('minimized');
  remote.style.left = 'auto';
  remote.style.top = 'auto';
  remote.style.right = '24px';
  remote.style.bottom = '24px';
  saveFloatingRemotePos();
}

function toggleFloatingRemoteMinimize() {
  const remote = document.getElementById('sgFloatingRemote');
  if (!remote) return;
  remote.classList.toggle('minimized');
  saveFloatingRemotePos();
}

function remoteTriggerMainSpaceAction() {
  if (currentMainMode === 'palace') revealOrNextPalacePin();
  else handleAnkiCardClick();
}

function remoteMovePrevTarget() {
  if (currentMainMode === 'palace') movePalacePinStep(-1);
  else if (ankiQueue.length) {
    ankiCurrentIdx = (ankiCurrentIdx - 1 + ankiQueue.length) % ankiQueue.length;
    loadCurrentAnkiTargetToStage();
  }
}

function remoteMoveNextTarget() {
  if (currentMainMode === 'palace') movePalacePinStep(1);
  else if (ankiQueue.length) {
    ankiCurrentIdx = (ankiCurrentIdx + 1) % ankiQueue.length;
    loadCurrentAnkiTargetToStage();
  }
}

function updateFloatingRemoteUI() {
  const btnS = document.getElementById('remBtnModeSamguk');
  const btnP = document.getElementById('remBtnModePalace');
  if (btnS) btnS.classList.toggle('active', currentMainMode === 'samguk');
  if (btnP) btnP.classList.toggle('active', currentMainMode === 'palace');

  const gradeRow = document.getElementById('remSamgukGradeRow');
  if (gradeRow) gradeRow.style.display = currentMainMode === 'samguk' ? 'grid' : 'none';

  const progEl = document.getElementById('remProgressLabel');
  const secEl = document.getElementById('remSecLabel');
  const targetEl = document.getElementById('remTargetText');
  const spaceTxt = document.getElementById('remSpaceBtnText');

  if (currentMainMode === 'palace') {
    const pins = currentPalaceObj?.pins || [];
    if (pins.length) {
      const p = pins[currentPinIdx] || pins[0];
      const isCleared = currentPinRevealed || palaceClearedSet.has(currentPinIdx);
      if (progEl) progEl.textContent = `🏛️ 거점 #${currentPinIdx + 1} / ${pins.length}`;
      if (secEl) secEl.textContent = p.room || '';
      if (targetEl) targetEl.textContent = isCleared ? `★ ${p.answer}` : `🔒 [ #${currentPinIdx + 1} 가림막 ]`;
      if (spaceTxt) spaceTxt.textContent = isCleared ? 'Space — 다음 거점 순환 낭독' : 'Space — 정답 해금 & 낭독';
    }
  } else {
    if (!ankiQueue.length || window.state.clozeStage === 0) {
      if (progEl) progEl.textContent = `📖 Step ${window.state.clozeStage}`;
      if (secEl) secEl.textContent = '[원문통독]';
      if (targetEl) targetEl.textContent = 'Step 1~4 버튼 또는 Space로 시작';
    } else {
      const item = ankiQueue[ankiCurrentIdx] || ankiQueue[0];
      if (progEl) progEl.textContent = `⚔️ 빈칸 #${ankiCurrentIdx + 1} / ${ankiQueue.length}`;
      if (secEl) secEl.textContent = item.sec || '';
      if (targetEl) targetEl.textContent = ankiIsFlipped ? `★ ${item.answer}` : '🔒 [ 100% 백지 빈칸 ]';
      if (spaceTxt) spaceTxt.textContent = ankiIsFlipped ? 'Space — 3.알맞음 판정' : 'Space — 정답 확인 / 해금';
    }
  }
}

function findSelectableSubnoteUnit(target) {
  const box = document.getElementById('subnoteBox');
  if (!target || !box || !box.contains(target)) return null;

  const diagWrap = target.closest('.cloze-diagram-wrap, svg, img');
  if (diagWrap && box.contains(diagWrap)) {
    return diagWrap.tagName === 'SVG' ? (diagWrap.parentElement || diagWrap) : diagWrap;
  }

  const cell = target.closest('td, th');
  if (cell && box.contains(cell)) return cell;

  let cur = target;
  while (cur && cur !== box) {
    if (['DIV', 'P', 'LI', 'TR', 'H3', 'H4'].includes(cur.tagName)) {
      const hasBlockChild = cur.querySelector('div:not(.cloze-diagram-mask):not(.cloze-diagram-toolbar), p, table, ul, ol');
      if (!hasBlockChild) return cur;
    }
    cur = cur.parentElement;
  }
  return target.closest('td, th, li, p, div') || null;
}

function applyPickedAreaInlineVisual(el, isPicked) {
  if (!el || !el.style) return;
  if (el.classList.contains('palace-pin')) {
    el.classList.toggle('sg-area-picked', isPicked);
    if (!isPicked) el.querySelector('.sg-area-order-badge')?.remove();
    return;
  }
  if (isPicked) {
    if (el.dataset.origBgBackup === undefined) {
      el.dataset.origBgBackup = el.style.backgroundColor || '';
      el.dataset.origPosBackup = el.style.position || '';
    }
    el.classList.add('sg-area-picked');
    el.style.setProperty('background-color', '#99f6e4', 'important');
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }
  } else {
    el.classList.remove('sg-area-picked', 'sg-area-reading', 'sg-area-hover');
    el.querySelector('.sg-area-order-badge')?.remove();
    if (el.dataset.origBgBackup !== undefined) {
      if (el.dataset.origBgBackup) el.style.backgroundColor = el.dataset.origBgBackup;
      else el.style.removeProperty('background-color');
      if (el.dataset.origPosBackup) el.style.position = el.dataset.origPosBackup;
      else el.style.removeProperty('position');
      delete el.dataset.origBgBackup;
      delete el.dataset.origPosBackup;
    } else {
      el.style.removeProperty('background-color');
    }
  }
}

function initSubnoteAreaSelectionEvents() {
  const box = document.getElementById('subnoteBox');

  box.addEventListener('mouseover', (e) => {
    if (!sgAreaSelectMode) return;
    const unit = findSelectableSubnoteUnit(e.target);
    box.querySelectorAll('.sg-area-hover').forEach(x => {
      if (x !== unit) x.classList.remove('sg-area-hover');
    });
    if (unit && unit !== box) unit.classList.add('sg-area-hover');
  });

  box.addEventListener('mouseout', (e) => {
    if (!sgAreaSelectMode) return;
    const unit = findSelectableSubnoteUnit(e.target);
    if (unit) unit.classList.remove('sg-area-hover');
  });

  box.addEventListener('click', (e) => {
    if (!sgAreaSelectMode) return;
    const unit = findSelectableSubnoteUnit(e.target);
    if (!unit || unit === box) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const existIdx = sgSelectedElements.indexOf(unit);
    if (existIdx >= 0) {
      applyPickedAreaInlineVisual(unit, false);
      sgSelectedElements.splice(existIdx, 1);
    } else {
      for (let i = sgSelectedElements.length - 1; i >= 0; i--) {
        const prev = sgSelectedElements[i];
        if (prev.contains(unit) || unit.contains(prev)) {
          applyPickedAreaInlineVisual(prev, false);
          sgSelectedElements.splice(i, 1);
        }
      }
      applyPickedAreaInlineVisual(unit, true);
      sgSelectedElements.push(unit);
    }
    refreshSgAreaBadges();
  }, true);
}

function refreshSgAreaBadges() {
  sgSelectedElements.forEach((el, i) => {
    let badge = el.querySelector('.sg-area-order-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'sg-area-order-badge';
      el.appendChild(badge);
    }
    badge.textContent = `✅ ${i + 1}번 선택`;
  });
  document.getElementById('sgAreaCount').textContent = sgSelectedElements.length;
  const remCnt = document.getElementById('remAreaCount');
  if (remCnt) remCnt.textContent = sgSelectedElements.length;
}

function toggleSgAreaSelectMode() {
  sgAreaSelectMode = !sgAreaSelectMode;
  window.sgAreaSelectMode = sgAreaSelectMode;
  document.body.classList.toggle('sg-area-select-active', sgAreaSelectMode);
  const btn = document.getElementById('btnSelectAreaMode');
  btn.classList.toggle('teal-active', sgAreaSelectMode);
  const remBtn = document.getElementById('remBtnAreaMode');
  if (remBtn) remBtn.classList.toggle('teal-on', sgAreaSelectMode);

  const statusEl = document.getElementById('ttsStatusText');
  if (statusEl) {
    statusEl.textContent = sgAreaSelectMode
      ? '🎯 읽을 줄·표 칸·궁전 거점을 마우스로 클릭하세요! (색상 반전)'
      : '🔊 Edge 자연음성 준비';
  }
  if (!sgAreaSelectMode) {
    document.querySelectorAll('.sg-area-hover').forEach(x => x.classList.remove('sg-area-hover'));
    clearSgSelectedAreas();
    stopAllTtsSpeech();
  }
}

async function speakSgSelectedAreas() {
  if (!sgSelectedElements.length) {
    return alert('먼저 [영역선택] 버튼을 켜고 읽을 서브노트 구간이나 기억의 궁전 거점을 마우스로 클릭해 주세요!');
  }
  sgAreaReadingFlag = true;
  do {
    for (let i = 0; i < sgSelectedElements.length; i++) {
      if (!sgAreaReadingFlag) break;
      const el = sgSelectedElements[i];
      el.classList.add('sg-area-reading');

      if (el.classList.contains('palace-pin')) {
        const pIdx = Number(el.dataset.pinIdx) || 0;
        const pins = currentPalaceObj?.pins || [];
        if (pins[pIdx]) {
          currentPinIdx = pIdx;
          currentPinRevealed = true;
          palaceClearedSet.add(pIdx);
          updatePalaceSideConsole();
          updatePalaceCameraTransform();
          await speakSingleSegmentWithEdgeVoice(`${pins[pIdx].answer}. ${pins[pIdx].storyHint || ''}`, null);
        }
        el.classList.remove('sg-area-reading');
        continue;
      }

      el.style.setProperty('background-color', '#fde047', 'important');

      let rawSpeech = '';
      if (typeof window.extractElementSpeechText === 'function') {
        rawSpeech = window.extractElementSpeechText(el);
      } else {
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.sg-area-order-badge, .cloze-diagram-mask, .cloze-diagram-toolbar').forEach(b => b.remove());
        clone.querySelectorAll('.cloze-mask').forEach(m => {
          m.innerHTML = m.dataset.origHtml || m.dataset.answer || '';
        });
        rawSpeech = clone.innerText;
      }

      await speakSingleSegmentWithEdgeVoice(rawSpeech, el);

      el.classList.remove('sg-area-reading');
      if (el.classList.contains('sg-area-picked')) {
        el.style.setProperty('background-color', '#99f6e4', 'important');
      }
    }
  } while (sgAreaLoopOn && sgAreaReadingFlag);
}

function speakSingleSegmentWithEdgeVoice(text, highlightEl) {
  return new Promise((resolve) => {
    if (!text || !('speechSynthesis' in window)) return resolve();

    if (typeof window.speakSentenceQueue === 'function') {
      const baseP = (typeof window.getTtsEngineConfig === 'function')
        ? window.getTtsEngineConfig().basePauseMs
        : 220;
      window.speakSentenceQueue([{ text: String(text), el: highlightEl || null, pauseAfter: baseP }], () => resolve());
      return;
    }

    let clean = String(text).trim();
    if (typeof window.refineForEdgeNaturalSpeech === 'function') {
      clean = window.refineForEdgeNaturalSpeech(clean);
    }
    if (!clean) return resolve();

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = 'ko-KR';
    u.rate = parseFloat(localStorage.getItem('maple_edge_tts_rate')) || Number(window.state.ttsRate) || 1.05;
    const picked = getBestEdgeKoreanVoice();
    if (picked) u.voice = picked;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

function toggleSgAreaLoop() {
  sgAreaLoopOn = !sgAreaLoopOn;
  document.getElementById('btnLoopSelected').classList.toggle('active', sgAreaLoopOn);
  const remLoop = document.getElementById('remBtnAreaLoop');
  if (remLoop) remLoop.classList.toggle('active', sgAreaLoopOn);
}

function clearSgSelectedAreas() {
  sgAreaReadingFlag = false;
  sgSelectedElements.forEach(el => {
    applyPickedAreaInlineVisual(el, false);
  });
  sgSelectedElements = [];
  document.getElementById('sgAreaCount').textContent = '0';
  const remCnt = document.getElementById('remAreaCount');
  if (remCnt) remCnt.textContent = '0';
}

function initFontDropdownUI() {
  const dd = document.getElementById('fontPickerDropdown');
  if (!dd) return;
  dd.innerHTML = '';
  POPULAR_FONTS_30.forEach(f => {
    const item = document.createElement('div');
    item.className = 'font-option-item';
    item.style.fontFamily = f.family;
    item.innerHTML = `<span>${f.name}</span><span style="font-size:12px; color:#b45309;">소방기술사 ABC 123</span>`;
    item.onclick = () => {
      applySubnoteFont(f.family, f.name.replace(/^\d+\.\s*/, '').split('(')[0].trim());
      dd.classList.remove('open');
    };
    dd.appendChild(item);
  });
}

function toggleFontDropdown(e) {
  e.stopPropagation();
  document.getElementById('fontPickerDropdown').classList.toggle('open');
}
window.addEventListener('click', () => document.getElementById('fontPickerDropdown')?.classList.remove('open'));

function applySubnoteFont(family, shortLabel) {
  document.documentElement.style.setProperty('--subnote-font', family);
  document.getElementById('currentFontLabel').textContent = shortLabel;
  localStorage.setItem('samguk_subnote_font', family);
  localStorage.setItem('samguk_subnote_font_name', shortLabel);
}

function applyGlobalZoom(val) {
  document.documentElement.style.setProperty('--global-zoom', val);
  document.getElementById('globalZoomSelect').value = String(val);
  localStorage.setItem('samguk_global_zoom', val);
}

function stepGlobalZoom(dir) {
  const cur = Number(document.getElementById('globalZoomSelect').value) || 1;
  let idx = ZOOM_STEPS.indexOf(cur);
  if (idx < 0) idx = 0;
  idx = Math.max(0, Math.min(ZOOM_STEPS.length - 1, idx + dir));
  applyGlobalZoom(ZOOM_STEPS[idx]);
}

function applyPaperSkin(skinCls) {
  const paper = document.getElementById('subnotePaperContainer');
  paper.classList.remove('skin-hanji', 'skin-white', 'skin-green', 'skin-dark');
  paper.classList.add(skinCls);
  localStorage.setItem('samguk_paper_skin', skinCls);
}

function toggleExamLines() {
  const paper = document.getElementById('subnotePaperContainer');
  const on = paper.classList.toggle('lined-exam-paper');
  document.getElementById('btnExamLines').classList.toggle('active', on);
}

function toggleClozeHintMode() {
  clozeHintChosung = false;
  const box = document.getElementById('subnoteBox');
  const pins = currentPalaceObj?.pins || [];

  if (currentMainMode === 'palace') {
    const anyRevealed = (palaceClearedSet.size > 0) || currentPinRevealed || (window.state.clozeStage === 0) || (box && box.classList.contains('peek-all-mode'));
    if (anyRevealed) {
      palaceClearedSet.clear();
      currentPinIdx = 0;
      currentPinRevealed = false;
      if (box) box.classList.remove('peek-all-mode');
      if (window.state.clozeStage === 0) {
        window.state.clozeStage = stageBeforeUnmask || 2;
        for (let i = 0; i <= 4; i++) {
          document.getElementById('stepTab' + i)?.classList.toggle('active', i === window.state.clozeStage);
          document.getElementById('remStep' + i)?.classList.toggle('active', i === window.state.clozeStage);
        }
      }
      renderSubnoteAndBuildAnki(window.state.clozeStage);
    } else {
      pins.forEach((_, idx) => palaceClearedSet.add(idx));
      currentPinRevealed = true;
      if (box) box.classList.add('peek-all-mode');
    }
    renderPalacePinsAndRoute();
    updatePalaceSideConsole();
    syncMaskToggleButtonsUI();
    saveCurrentStudySession();
    return;
  }

  const peekOn = box ? box.classList.contains('peek-all-mode') : false;
  const anyAnkiRevealed = ankiQueue.some(q => isAnkiItemRevealed(q));

  if (window.state.clozeStage === 0 || peekOn || anyAnkiRevealed) {
    if (box) box.classList.remove('peek-all-mode');
    const targetStep = window.state.clozeStage === 0 ? (stageBeforeUnmask || 2) : window.state.clozeStage;
    setProgressiveStep(targetStep);
  } else {
    if (box) box.classList.add('peek-all-mode');
    syncMaskToggleButtonsUI();
  }
}

function togglePeekAllCloze() {
  toggleClozeHintMode();
}

function setAnkiOrderMode(mode) {
  ankiOrderMode = mode;
  document.getElementById('btnOrderSeq').classList.toggle('active', mode === 'seq');
  document.getElementById('btnOrderRand').classList.toggle('active', mode === 'rand');
  renderSubnoteAndBuildAnki(window.state.clozeStage);
}

function toggleCardTtsScope() {
  cardTtsFullSentence = !cardTtsFullSentence;
  document.getElementById('cardTtsScopeText').textContent = cardTtsFullSentence ? '문장전체' : '단어만';
}

function changeTtsRate(val) {
  const rate = Number(val) || 1.05;
  window.state.ttsRate = rate;
  localStorage.setItem('maple_edge_tts_rate', String(rate));
  localStorage.setItem('maple_tts_rate', String(rate));
  if (typeof window.getTtsEngineConfig === 'function') {
    const cfg = window.getTtsEngineConfig();
    cfg.rate = rate;
    localStorage.setItem('maple_tts_master_cfg_v1', JSON.stringify(cfg));
  }
  if (typeof window.onTtsVoiceChange === 'function') window.onTtsVoiceChange();
}

function scrollToCurrentClozeInSubnote() {
  if (!ankiQueue.length) return;
  const item = ankiQueue[ankiCurrentIdx];
  item.el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function buildOutlineSidebarTree(box) {
  const list = document.getElementById('outlineTreeList');
  if (!list) return;
  list.innerHTML = '';
  const heads = Array.from(box.querySelectorAll('div, p, h3, h4')).filter(el => {
    const txt = (el.textContent || '').trim();
    return /^[0-9]+\.\s/.test(txt) && txt.length < 40;
  });
  heads.forEach(h => {
    const btn = document.createElement('button');
    btn.className = 'btn-gold';
    btn.style.justifyContent = 'flex-start';
    btn.textContent = (h.textContent || '').trim();
    btn.onclick = () => h.scrollIntoView({ behavior: 'smooth', block: 'center' });
    list.appendChild(btn);
  });
}

function toggleOutlineSidebar() {
  document.getElementById('outlineSidebar').classList.toggle('open');
}

function togglePostitBox() {
  const box = document.getElementById('postitContainer');
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function saveCurrentPostit() {
  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (!t) return;
  const map = JSON.parse(localStorage.getItem('samguk_postit_notes_v1') || '{}');
  map[t.id] = document.getElementById('postitTextarea').value;
  localStorage.setItem('samguk_postit_notes_v1', JSON.stringify(map));
}

function toggleWhiteboardPanel() {
  const p = document.getElementById('whiteboardPanel');
  p.style.display = p.style.display === 'none' ? 'block' : 'none';
}

function gradeWhiteboardTyping() {
  const userTxt = (document.getElementById('wbUserTextarea').value || '').trim();
  if (!userTxt) return alert('먼저 기억나는 내용을 타이핑해 주세요!');
  const targets = ankiQueue.map(q => q.answer);
  let hit = 0;
  const missed = [];
  targets.forEach(ans => {
    const key = ans.replace(/\s+/g, '');
    if (userTxt.replace(/\s+/g, '').includes(key.slice(0, Math.min(3, key.length)))) hit++;
    else missed.push(ans);
  });
  const score = targets.length ? Math.round((hit / targets.length) * 100) : 100;
  document.getElementById('wbGradeResultBox').innerHTML = `
    <div style="padding:10px; background:#ecfdf5; border:1.5px solid #10b981; border-radius:8px; color:#065f46; font-weight:800;">
      🎯 백지 인출 적중률: <b>${score}점</b> (${hit} / ${targets.length}개 핵심 키워드 포함)
      ${missed.length ? `<div style="margin-top:6px; color:#b91c1c; font-size:12.5px;">❗ 누락 키워드: ${missed.slice(0, 12).join(', ')}</div>` : ''}
    </div>
  `;
}

function syncSubnoteEditModeUI(isEditing) {
  const btn = document.getElementById('btnInlineSubnoteEdit');
  const txt = document.getElementById('inlineSubnoteEditText');
  const remBtn = document.getElementById('remBtnSubnoteEdit');
  const remTxt = document.getElementById('remSubnoteEditText');

  if (btn) {
    btn.classList.toggle('crimson-active', isEditing);
    btn.style.background = isEditing ? 'linear-gradient(135deg, #ea580c, #dc2626)' : '';
    btn.style.color = isEditing ? '#ffffff' : '';
    btn.style.borderColor = isEditing ? '#fde047' : '';
  }
  if (txt) txt.textContent = isEditing ? '💾 노트수정 ON (클릭시 저장)' : '✏️ 노트수정 OFF';

  if (remBtn) {
    remBtn.classList.toggle('active', isEditing);
    remBtn.style.background = isEditing ? 'linear-gradient(135deg, #ea580c, #dc2626)' : '';
    remBtn.style.color = isEditing ? '#ffffff' : '';
  }
  if (remTxt) remTxt.textContent = isEditing ? '💾 수정저장 ON' : '✏️ 노트수정';

  const box = document.getElementById('subnoteBox');
  let banner = document.getElementById('subnoteEditActiveBanner');
  if (isEditing && box && box.parentNode) {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'subnoteEditActiveBanner';
      banner.style.cssText = 'margin-bottom:10px; padding:10px 14px; background:linear-gradient(90deg, #fff7ed, #ffedd5); border:2px solid #ea580c; border-radius:10px; color:#9a3412; font-size:13px; font-weight:900; display:flex; align-items:center; justify-content:space-between; gap:10px; box-shadow:0 3px 10px rgba(234,88,12,0.18);';
      box.parentNode.insertBefore(banner, box);
    }
    banner.style.display = 'flex';
    banner.innerHTML = `
      <span>✏️ <b>[노트 직접 수정 모드 ON]</b> 현재 원문 수정 및 <b>[📐 도면가림 편집]</b>이 활성화되었습니다. 편집 후 우측 버튼 또는 <b>[💾 노트수정 ON]</b>을 누르면 자동 저장됩니다.</span>
      <button type="button" class="btn-gold teal-active" style="flex-shrink:0;" onclick="toggleInlineSubnoteEdit()">💾 수정 완료 및 저장</button>
    `;
  } else if (banner) {
    banner.style.display = 'none';
  }
}

function toggleInlineSubnoteEdit() {
  const box = document.getElementById('subnoteBox');
  if (!box) return;
  const editing = box.isContentEditable;
  if (!editing) {
    setProgressiveStep(0);
    box.contentEditable = 'true';
    box.style.outline = '3px dashed #ea580c';
    box.style.backgroundColor = '#fffaf5';
    syncSubnoteEditModeUI(true);
    if (typeof showAutoSaveToast === 'function') {
      showAutoSaveToast('✏️ 노트 수정 모드가 켜졌습니다! (이제 [📐 도면가림 편집]도 사용 가능합니다)');
    }
  } else {
    box.contentEditable = 'false';
    box.style.outline = 'none';
    box.style.backgroundColor = '';
    syncSubnoteEditModeUI(false);

    if (diagramEditModeOn) {
      diagramEditModeOn = false;
      document.body.classList.remove('diagram-edit-on');
      const dBtn = document.getElementById('btnDiagramEditMode');
      const dTxt = document.getElementById('diagramEditModeText');
      const rBtn = document.getElementById('remBtnDiagEdit');
      const rTxt = document.getElementById('remDiagEditText');
      if (dBtn) dBtn.classList.remove('active');
      if (dTxt) dTxt.textContent = '📐 도면가림 편집 OFF';
      if (rBtn) rBtn.classList.remove('active');
      if (rTxt) rTxt.textContent = '📐 도면편집';
    }

    const t = window.STUDY_TOPICS[window.state.topicIdx];
    if (t) {
      if (typeof clearSgSelectedAreas === 'function') clearSgSelectedAreas();
      const pureHtml = sanitizePollutedSubnoteHtml(box.innerHTML);
      box.innerHTML = pureHtml;
      attachDiagramToolbarsOnly(box, t.id);

      t.summaryHtml = pureHtml;
      const customMap = JSON.parse(localStorage.getItem('maple_custom_subnote_html_v1') || '{}');
      customMap[t.id] = pureHtml;
      try { localStorage.setItem('maple_custom_subnote_html_v1', JSON.stringify(customMap)); } catch (e) {}
      idbSetItem('backups', 'all_topics_snapshot', window.STUDY_TOPICS);
      autoSaveToConnectedFiles({ saveTopics: true, savePalaces: false, silent: true, allowPrompt: false });
      if (typeof showAutoSaveToast === 'function') {
        showAutoSaveToast('💾 수정된 서브노트 원문이 반영 및 자동 저장되었습니다!');
      } else {
        alert('💾 수정된 서브노트 원문이 반영 및 자동 저장되었습니다!');
      }
    }
  }
}

async function toggleActiveRecallTtsMode() {
  if (activeRecallTtsMode) {
    activeRecallTtsMode = false;
    if (typeof window.stopAllSpeech === 'function') window.stopAllSpeech();
    document.getElementById('btnActiveRecallTts').classList.remove('active');
    return;
  }
  if (!ankiQueue.length) {
    setProgressiveStep(2);
  }
  activeRecallTtsMode = true;
  document.getElementById('btnActiveRecallTts').classList.add('active');

  while (activeRecallTtsMode && ankiQueue.length > 0) {
    const item = ankiQueue[ankiCurrentIdx];
    await speakSingleSegmentWithEdgeVoice(`${item.sec}. 빈칸 무엇일까요?`);
    if (!activeRecallTtsMode) break;
    await new Promise(r => setTimeout(r, 3200));
    if (!activeRecallTtsMode) break;
    revealCurrentAnkiCard();
    await new Promise(r => setTimeout(r, 2600));
    if (!activeRecallTtsMode) break;
    gradeAnkiTarget('good');
  }
}

function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function updateAutoSaveStatusBadgeUI() {
  const modalBody = document.querySelector('#topicManagerModal .modal-body');
  if (!modalBody) return;

  let bar = document.getElementById('samengAutoSaveConnBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'samengAutoSaveConnBar';
    bar.style.cssText = 'display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; background:linear-gradient(135deg,#ecfdf5,#d1fae5); border:1.5px solid #10b981; border-radius:12px; padding:8px 12px; margin-bottom:10px; font-size:12.5px; font-weight:800; color:#065f46;';
    modalBody.insertBefore(bar, modalBody.firstChild);
  }

  const tCount = (window.STUDY_TOPICS || []).length;
  const pCount = Object.keys(window.MEMORY_PALACES || {}).length;

  bar.innerHTML = `
    <div>
      🟢 <b>[대용량 IndexedDB 무클릭 자동저장 가동 중]</b> — 현재 토픽 <b>${tCount}개</b> · 기억의 궁전 <b>${pCount}개</b> 영구 보관됨 (파일 지정 불필요 · 1,000개+ 토픽 지원)
    </div>
    <div style="display:flex; gap:6px;">
      <button type="button" class="btn-gold" style="height:28px; font-size:11.5px;" onclick="downloadBothJsFilesFallback()" title="외장하드나 다른 PC로 옮길 때만 백업용으로 다운로드하세요">
        📦 백업용 .js 파일 다운로드
      </button>
    </div>
  `;
}

function updateTopicManagerModalHeaderInfo() {
  fixFaviconAndModalButtonsOnBoot();
  updateAutoSaveStatusBadgeUI();
  const lbl = document.getElementById('lblCurrentManageTopic');
  const t = (window.STUDY_TOPICS || [])[window.state?.topicIdx || 0];
  if (lbl) {
    if (t) {
      const isTemp = !INITIAL_FILE_TOPIC_IDS.has(t.id);
      lbl.innerHTML = `[${t.id}] ${t.title} ${isTemp ? '<span style="background:#fef08a; color:#854d0e; padding:2px 8px; border-radius:99px; font-size:11px; margin-left:4px;">임시투입(미저장)</span>' : '<span style="background:#ccfbf1; color:#0f766e; padding:2px 8px; border-radius:99px; font-size:11px; margin-left:4px;">파일저장됨</span>'}`;
    } else {
      lbl.textContent = '선택된 토픽 없음';
    }
  }
}

function openTopicManagerModal() {
  updateTopicManagerModalHeaderInfo();
  document.getElementById('topicManagerModal').classList.add('open');
}
window.openTopicManagerModal = openTopicManagerModal;

function loadCurrentTopicJsonIntoEditor() {
  const t = (window.STUDY_TOPICS || [])[window.state?.topicIdx || 0];
  if (!t) return alert('불러올 토픽이 없습니다.');
  const exportObj = Object.assign({}, t);
  if (window.MEMORY_PALACES && window.MEMORY_PALACES[t.id]) {
    exportObj.memoryPalace = window.MEMORY_PALACES[t.id];
  }
  const ta = document.getElementById('injectJsonTextarea');
  if (ta) {
    ta.value = JSON.stringify(exportObj, null, 2);
    ta.focus();
  }
}
window.loadCurrentTopicJsonIntoEditor = loadCurrentTopicJsonIntoEditor;

async function injectTopicJsonNow(silentParseOnly = false) {
  const ta = document.getElementById('injectJsonTextarea');
  let raw = (ta?.value || '').trim();

  if (raw) {
    try {
      raw = raw.replace(/^```(?:json|javascript|js)?/i, '').replace(/```$/i, '').trim();
      raw = raw.replace(/^(?:\/\/[^\n]*\n\s*)*window\.(?:MEMORY_PALACES|STUDY_TOPICS)\s*=\s*/i, '').replace(/;\s*$/, '').trim();

      const parsed = JSON.parse(raw);
      const keys = Object.keys(parsed);

      if (!Array.isArray(parsed) && keys.length > 0 && parsed[keys[0]] && Array.isArray(parsed[keys[0]].pins)) {
        keys.forEach(k => {
          EXPLICIT_DELETED_TOPIC_IDS.delete(k);
          syncPalaceToMemoryAndCache(k, parsed[k], false);
        });
        localStorage.setItem('samguk_deleted_topic_ids_v1', JSON.stringify(Array.from(EXPLICIT_DELETED_TOPIC_IDS)));
        if (ta) ta.value = '';
        const targetIdx = window.STUDY_TOPICS.findIndex(t => t.id === keys[0]);
        if (targetIdx >= 0) loadTopic(targetIdx);
        switchMainStageMode('palace');
      } else {
        const items = Array.isArray(parsed) ? parsed : [parsed];
        items.forEach(item => {
          if (!item || typeof item !== 'object') return;
          if (!item.id) item.id = 'topic_' + Date.now();
          EXPLICIT_DELETED_TOPIC_IDS.delete(item.id);

          try {
            const customMap = JSON.parse(localStorage.getItem('maple_custom_subnote_html_v1') || '{}');
            if (customMap[item.id]) {
              delete customMap[item.id];
              localStorage.setItem('maple_custom_subnote_html_v1', JSON.stringify(customMap));
            }
          } catch (e) {}

          if (item.memoryPalace && Array.isArray(item.memoryPalace.pins)) {
            syncPalaceToMemoryAndCache(item.id, item.memoryPalace, false);
            delete item.memoryPalace;
          } else if (item.palace && Array.isArray(item.palace.pins)) {
            syncPalaceToMemoryAndCache(item.id, item.palace, false);
            delete item.palace;
          }

          const existingIdx = window.STUDY_TOPICS.findIndex(t => t.id === item.id);
          if (existingIdx >= 0) {
            window.STUDY_TOPICS[existingIdx] = Object.assign({}, window.STUDY_TOPICS[existingIdx], item);
          } else {
            window.STUDY_TOPICS.push(item);
          }
          INITIAL_FILE_TOPIC_IDS.add(item.id);
        });

        localStorage.setItem('samguk_deleted_topic_ids_v1', JSON.stringify(Array.from(EXPLICIT_DELETED_TOPIC_IDS)));
        try {
          localStorage.setItem('samguk_injected_topics_v1', JSON.stringify(window.STUDY_TOPICS));
        } catch (quotaErr) {}

        if (ta) ta.value = '';
        initCategoryAndTopicSelectors();
        const lastId = items[items.length - 1].id;
        const newIdx = window.STUDY_TOPICS.findIndex(t => t.id === lastId);
        if (newIdx >= 0) loadTopic(newIdx);
        if (window.MEMORY_PALACES[lastId]) switchMainStageMode('palace');
      }
    } catch (err) {
      if (!silentParseOnly) alert('❌ JSON 형식이 올바르지 않습니다:\n' + err.message);
      return false;
    }
  }

  let savedOk = false;
  if (!silentParseOnly) {
    savedOk = await autoSaveToConnectedFiles({
      saveTopics: true,
      savePalaces: true,
      silent: false,
      allowPrompt: true
    });
  }

  await idbSetItem('backups', 'all_topics_snapshot', window.STUDY_TOPICS);
  await idbSetItem('backups', 'all_palaces_snapshot', window.MEMORY_PALACES);

  if (!silentParseOnly) {
    updateTopicManagerModalHeaderInfo();
    if (savedOk) closeModal('topicManagerModal');
    return savedOk;
  }
  return true;
}
window.injectTopicJsonNow = injectTopicJsonNow;

function revertUnsavedInjectedTopics() {
  const rawTopics = localStorage.getItem('samguk_injected_topics_v1');
  const rawPalaces = localStorage.getItem('samguk_palaces_delta_v2');
  if (!rawTopics && !rawPalaces) {
    return alert('현재 파일 저장 전에 임시로 투입된 내역이 없습니다.');
  }
  if (!confirm('파일(topics_data.js / palaces_data.js)로 저장하기 전에 임시로 투입·수정했던 내역을 모두 취소하고 원본 파일 상태로 되돌리시겠습니까?')) {
    return;
  }
  localStorage.removeItem('samguk_injected_topics_v1');
  localStorage.removeItem('samguk_palaces_delta_v2');
  idbSetItem('backups', 'all_topics_snapshot', null);
  idbSetItem('backups', 'all_palaces_snapshot', null);
  location.reload();
}
window.revertUnsavedInjectedTopics = revertUnsavedInjectedTopics;

async function deleteCurrentSelectedTopic() {
  const topics = window.STUDY_TOPICS || [];
  if (!topics.length) return alert('삭제할 토픽이 없습니다.');
  if (topics.length <= 1) return alert('최소 1개의 토픽은 남아 있어야 합니다.');

  const idx = window.state?.topicIdx || 0;
  const t = topics[idx];
  if (!t) return;

  if (!confirm(`🗑️ [${t.id}] "${t.title}" 토픽을 삭제하시겠습니까?`)) return;

  const delId = t.id;
  EXPLICIT_DELETED_TOPIC_IDS.add(delId);
  localStorage.setItem('samguk_deleted_topic_ids_v1', JSON.stringify(Array.from(EXPLICIT_DELETED_TOPIC_IDS)));

  topics.splice(idx, 1);
  INITIAL_FILE_TOPIC_IDS.delete(delId);
  delete window.MEMORY_PALACES[delId];

  try {
    const raw = localStorage.getItem('samguk_injected_topics_v1');
    if (raw) {
      const arr = JSON.parse(raw).filter(item => item.id !== delId);
      if (arr.length > 0) localStorage.setItem('samguk_injected_topics_v1', JSON.stringify(arr));
      else localStorage.removeItem('samguk_injected_topics_v1');
    }
  } catch (e) {}

  try {
    const pRaw = localStorage.getItem('samguk_palaces_delta_v2');
    if (pRaw) {
      const pMap = JSON.parse(pRaw);
      if (pMap[delId]) {
        delete pMap[delId];
        localStorage.setItem('samguk_palaces_delta_v2', JSON.stringify(pMap));
      }
    }
  } catch (e) {}

  await idbSetItem('backups', 'all_topics_snapshot', window.STUDY_TOPICS);
  await idbSetItem('backups', 'all_palaces_snapshot', window.MEMORY_PALACES);

  const nextIdx = Math.max(0, Math.min(idx, topics.length - 1));
  initCategoryAndTopicSelectors();
  loadTopic(nextIdx);
  updateTopicManagerModalHeaderInfo();

  await autoSaveToConnectedFiles({ saveTopics: true, savePalaces: true, silent: true, allowPrompt: false });
  alert(`✅ [${t.title}] 토픽이 삭제 및 자동 반영되었습니다.`);
}
window.deleteCurrentSelectedTopic = deleteCurrentSelectedTopic;

/* ============================================================================
   ★ 아래아한글(HWP) 100% 호환 문서 생성기 ★
   ============================================================================ */
async function convertSvgElementToHighResPngDataUrl(svgEl) {
  return new Promise((resolve) => {
    try {
      const cloneSvg = svgEl.cloneNode(true);
      cloneSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      let vbX = 0;
      let vbY = 0;
      let vbWidth = 580;
      let vbHeight = 200;
      const vbAttr = cloneSvg.getAttribute('viewBox');
      if (vbAttr) {
        const parts = vbAttr.trim().split(/[\s,]+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          vbX = parts[0];
          vbY = parts[1];
          vbWidth = parts[2];
          vbHeight = parts[3];
        }
      } else {
        vbWidth = parseInt(cloneSvg.getAttribute('width'), 10) || 580;
        vbHeight = parseInt(cloneSvg.getAttribute('height'), 10) || 200;
      }

      const safePad = 10;
      const paddedW = vbWidth + safePad * 2;
      const paddedH = vbHeight + safePad * 2;
      cloneSvg.setAttribute('viewBox', `${vbX - safePad} ${vbY - safePad} ${paddedW} ${paddedH}`);
      cloneSvg.setAttribute('width', String(paddedW));
      cloneSvg.setAttribute('height', String(paddedH));
      cloneSvg.removeAttribute('style');
      cloneSvg.style.cssText = 'background:#ffffff; border:none; padding:0; margin:0;';

      cloneSvg.querySelectorAll('text').forEach(tNode => {
        tNode.setAttribute('font-family', "함초롬돋움, 'HCR Dotum', 'Malgun Gothic', Dotum, sans-serif");
        tNode.style.fontFamily = "함초롬돋움, 'HCR Dotum', 'Malgun Gothic', Dotum, sans-serif";
        const txtContent = (tNode.textContent || '').trim();
        if (txtContent.includes('콘스탄탄')) {
          tNode.setAttribute('text-anchor', 'start');
          tNode.setAttribute('x', '245');
        }
      });

      const xmlStr = new XMLSerializer().serializeToString(cloneSvg);
      const svgBase64 = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xmlStr);

      const img = new Image();
      img.onload = () => {
        const scale = 2.5;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(paddedW * scale);
        canvas.height = Math.round(paddedH * scale);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const targetDispW = Math.min(430, paddedW);
        const targetDispH = Math.round(targetDispW * (paddedH / paddedW));

        resolve({
          dataUrl: canvas.toDataURL('image/png'),
          displayWidth: targetDispW,
          displayHeight: targetDispH
        });
      };
      img.onerror = () => resolve(null);
      img.src = svgBase64;
    } catch (e) {
      resolve(null);
    }
  });
}

function rgbOrHexToUpperHex(colorStr) {
  if (!colorStr) return '';
  const s = colorStr.trim().toLowerCase();
  if (s.startsWith('#')) {
    if (s.length === 4) {
      return ('#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]).toUpperCase();
    }
    return s.toUpperCase();
  }
  const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) {
    const toHex = (n) => Number(n).toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`;
  }
  return '';
}

function wrapEveryTextNodeForHwp12pt(rootContainer) {
  const walker = document.createTreeWalker(rootContainer, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let current;
  while ((current = walker.nextNode())) {
    if (current.nodeValue && current.nodeValue.trim().length > 0) {
      textNodes.push(current);
    }
  }

  textNodes.forEach(tNode => {
    const parent = tNode.parentElement;
    if (!parent) return;

    let inheritedColor = '';
    let inheritedBold = false;
    let cur = parent;
    while (cur && cur !== rootContainer) {
      if (!inheritedColor) {
        const c = rgbOrHexToUpperHex(cur.style?.color || cur.getAttribute?.('color') || '');
        if (c) inheritedColor = c;
      }
      const fw = cur.style?.fontWeight || '';
      if (cur.tagName === 'B' || cur.tagName === 'STRONG' || cur.tagName === 'TH' || fw === 'bold' || Number(fw) >= 700) {
        inheritedBold = true;
      }
      cur = cur.parentElement;
    }

    const finalColor = inheritedColor || '#000000';

    const fontEl = document.createElement('font');
    fontEl.setAttribute('face', '함초롬돋움');
    fontEl.setAttribute('size', '3');
    fontEl.setAttribute('color', finalColor);
    fontEl.style.cssText = `font-family:함초롬돋움, "함초롬 돋움", "HCR Dotum", sans-serif; font-size:12.0pt; mso-bidi-font-size:12.0pt; color:${finalColor};` + (inheritedBold ? ' font-weight:bold;' : '');

    const spanEl = document.createElement('span');
    spanEl.style.cssText = `font-family:함초롬돋움, "함초롬 돋움", "HCR Dotum", sans-serif; font-size:12.0pt; mso-bidi-font-size:12.0pt; line-height:165%; color:${finalColor};` + (inheritedBold ? ' font-weight:bold;' : '');
    spanEl.textContent = tNode.nodeValue;

    if (inheritedBold) {
      const bEl = document.createElement('b');
      bEl.style.cssText = `font-family:함초롬돋움, "함초롬 돋움", "HCR Dotum", sans-serif; font-size:12.0pt;`;
      bEl.appendChild(spanEl);
      fontEl.appendChild(bEl);
    } else {
      fontEl.appendChild(spanEl);
    }

    tNode.replaceWith(fontEl);
  });
}

async function buildHwpCompatibleHtmlDocument() {
  const topics = window.STUDY_TOPICS || [];
  const t = topics[window.state?.topicIdx || 0];
  if (!t) return null;

  const customMap = JSON.parse(localStorage.getItem('maple_custom_subnote_html_v1') || '{}');
  let rawHtml = customMap[t.id] || t.summaryHtml || '';
  if (rawHtml.includes('cloze-mask') && t.summaryHtml) {
    rawHtml = t.summaryHtml;
  }

  const workDiv = document.createElement('div');
  workDiv.innerHTML = rawHtml;

  workDiv.querySelectorAll('.cloze-diagram-mask, .cloze-diagram-toolbar, .sg-area-order-badge').forEach(el => el.remove());
  workDiv.querySelectorAll('.cloze-mask').forEach(m => {
    const span = document.createElement('span');
    span.innerHTML = m.dataset.origHtml || m.dataset.answer || '';
    m.replaceWith(span);
  });

  const svgs = Array.from(workDiv.querySelectorAll('svg'));
  for (const svgEl of svgs) {
    const pngInfo = await convertSvgElementToHighResPngDataUrl(svgEl);
    if (pngInfo && pngInfo.dataUrl) {
      const pWrap = document.createElement('p');
      pWrap.style.cssText = 'margin: 6pt 0 8pt 0; text-align: left;';
      const imgEl = document.createElement('img');
      imgEl.src = pngInfo.dataUrl;
      imgEl.width = pngInfo.displayWidth;
      imgEl.height = pngInfo.displayHeight;
      imgEl.setAttribute('border', '0');
      imgEl.style.cssText = `width:${pngInfo.displayWidth}px; height:${pngInfo.displayHeight}px; border:none; outline:none; display:block;`;
      pWrap.appendChild(imgEl);
      svgEl.replaceWith(pWrap);
    } else {
      svgEl.remove();
    }
  }

  Array.from(workDiv.querySelectorAll('div, p')).forEach(div => {
    const padMatch = (div.getAttribute('style') || '').match(/padding-left\s*:\s*(\d+)px/i);
    if (padMatch) {
      const px = parseInt(padMatch[1], 10) || 0;
      const nbspCount = Math.min(10, Math.round(px / 7));
      if (nbspCount > 0) {
        div.insertAdjacentHTML('afterbegin', '&nbsp;'.repeat(nbspCount));
      }
    }
    const isBold = (div.style.fontWeight && (div.style.fontWeight === 'bold' || Number(div.style.fontWeight) >= 700));
    div.setAttribute('align', 'left');
    div.style.cssText = 'text-align:left; word-break:break-all; font-family:함초롬돋움, "함초롬 돋움", "HCR Dotum", sans-serif; font-size:12.0pt; line-height:165%; margin:2pt 0 3pt 0;' + (isBold ? ' font-weight:bold;' : '');
  });

  workDiv.querySelectorAll('table').forEach(tbl => {
    tbl.setAttribute('border', '1');
    tbl.setAttribute('cellspacing', '0');
    tbl.setAttribute('cellpadding', '6');
    tbl.setAttribute('width', '100%');
    tbl.setAttribute('align', 'left');
    tbl.style.cssText = 'width:100%; border-collapse:collapse; border:1.5pt solid #334155; text-align:left; font-family:함초롬돋움, "함초롬 돋움", "HCR Dotum", sans-serif; font-size:12.0pt; line-height:165%; margin-bottom:10pt;';
  });

  workDiv.querySelectorAll('th').forEach((th, idx) => {
    th.setAttribute('bgcolor', '#EEF4F3');
    th.setAttribute('align', 'left');
    const thColor = idx === 1 ? '#1D4ED8' : '#0F172A';
    th.style.cssText = `background-color:#EEF4F3; border:1pt solid #475569; padding:6pt 8pt; font-family:함초롬돋움, "함초롬 돋움", sans-serif; font-weight:bold; text-align:left; font-size:12.0pt; color:${thColor};`;
    if (idx === 0) th.setAttribute('width', '74%');
    if (idx === 1) th.setAttribute('width', '26%');
  });

  workDiv.querySelectorAll('td').forEach(td => {
    const existingColor = rgbOrHexToUpperHex(td.style.color);
    const tdColor = existingColor || '#000000';
    td.setAttribute('align', 'left');
    td.setAttribute('valign', 'top');
    td.style.cssText = `border:1pt solid #64748B; padding:8pt 10pt; vertical-align:top; text-align:left; word-break:break-all; font-family:함초롬돋움, "함초롬 돋움", sans-serif; font-size:12.0pt; line-height:165%; color:${tdColor};` + (existingColor ? ' font-weight:bold;' : '');
  });

  wrapEveryTextNodeForHwp12pt(workDiv);

  const fullDocHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>${t.title}</title>
<style>
  @page { size: A4 portrait; margin: 15mm; }
  body, table, th, td, p, div, span, font, b, strong {
    font-family: 함초롬돋움, '함초롬 돋움', 'HCR Dotum', sans-serif !important;
    font-size: 12.0pt !important;
    mso-bidi-font-size: 12.0pt !important;
    line-height: 165%;
    text-align: left !important;
  }
  body { margin: 15mm; color: #000000; text-align: left; }
  table { width: 100%; border-collapse: collapse; border: 1.5pt solid #334155; }
  th { background-color: #EEF4F3; border: 1pt solid #475569; padding: 6pt 8pt; font-weight: bold; text-align: left; }
  td { border: 1pt solid #64748B; padding: 8pt 10pt; vertical-align: top; text-align: left; word-break: break-all; }
  p, div { margin: 2pt 0; text-align: left; }
  img { border: none !important; outline: none !important; }
</style>
</head>
<body align="left" style="font-family:함초롬돋움, '함초롬 돋움', sans-serif; font-size:12.0pt; text-align:left;">
<!--StartFragment-->
${workDiv.innerHTML}
<!--EndFragment-->
</body>
</html>`;

  return {
    topic: t,
    bodyFragment: workDiv.innerHTML,
    fullDocHtml
  };
}

async function exportCurrentSubnoteToHwpFile() {
  const res = await buildHwpCompatibleHtmlDocument();
  if (!res) return alert('내보낼 토픽이 없습니다.');

  const safeTitle = (res.topic.title || res.topic.id || '서브노트')
    .replace(/^■\s*/, '')
    .replace(/[\\/:*?"<>|]/g, '_')
    .trim();

  const defaultFileName = `${safeTitle}_서브노트.hwp`;
  const bomContent = '\uFEFF' + res.fullDocHtml;

  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        startIn: 'desktop',
        suggestedName: defaultFileName,
        types: [
          { description: '아래아한글 문서 (*.hwp)', accept: { 'application/x-hwp': ['.hwp'] } },
          { description: '한글 호환 웹문서 (*.html)', accept: { 'text/html': ['.html'] } }
        ]
      });
      const writable = await handle.createWritable();
      await writable.write(bomContent);
      await writable.close();
      alert(`✅ [${defaultFileName}] 파일이 저장되었습니다!\n아래아한글(HWP)에서 파일을 열면 함초롬돋움 12pt, 표, 도면, 글자 색상이 그대로 나타납니다.`);
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }

  const blob = new Blob([bomContent], { type: 'application/x-hwp;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = defaultFileName;
  a.click();
}
window.exportCurrentSubnoteToHwpFile = exportCurrentSubnoteToHwpFile;

async function copyCurrentSubnoteForHwp() {
  const res = await buildHwpCompatibleHtmlDocument();
  if (!res) return alert('복사할 토픽이 없습니다.');

  const plainText = document.getElementById('subnoteBox')?.innerText || '';
  let copiedOk = false;

  const copyInterceptor = (e) => {
    try {
      e.clipboardData.setData('text/html', res.fullDocHtml);
      e.clipboardData.setData('text/plain', plainText);
      e.preventDefault();
      copiedOk = true;
    } catch (err) {}
  };

  document.addEventListener('copy', copyInterceptor, true);
  try {
    const dummy = document.createElement('textarea');
    dummy.value = 'hwp_copy';
    dummy.style.cssText = 'position:fixed; left:-9999px; top:0; opacity:0;';
    document.body.appendChild(dummy);
    dummy.select();
    document.execCommand('copy');
    dummy.remove();
  } catch (e) {}
  document.removeEventListener('copy', copyInterceptor, true);

  if (!copiedOk && navigator.clipboard && window.ClipboardItem) {
    try {
      const htmlBlob = new Blob([res.fullDocHtml], { type: 'text/html' });
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      await navigator.clipboard.write([new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob })]);
      copiedOk = true;
    } catch (e) {}
  }

  if (!copiedOk) {
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = "position:fixed; left:-9999px; top:0; width:720px; background:#ffffff; color:#000000; font-family:함초롬돋움, '함초롬 돋움', 'HCR Dotum', sans-serif; font-size:12.0pt; line-height:165%;";
    tempDiv.innerHTML = res.bodyFragment;
    document.body.appendChild(tempDiv);

    try {
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copiedOk = document.execCommand('copy');
      sel.removeAllRanges();
    } catch (e) {}

    tempDiv.remove();
  }

  alert('✅ 한글(HWP) 전용 서식(함초롬돋움 12pt + 왼쪽 정렬 + 깔끔한 도면)이 복사되었습니다!\n\n이제 아래아한글(HWP) 창에서 [Ctrl + V]를 눌러 붙여넣으세요!');
}
window.copyCurrentSubnoteForHwp = copyCurrentSubnoteForHwp;

function markCurrentTopicCompleted() {
  const t = window.STUDY_TOPICS[window.state.topicIdx];
  if (!t) return;
  const eb = JSON.parse(localStorage.getItem('samguk_ebbinghaus_v1') || '{}');
  const prev = eb[t.id] || { count: 0 };
  const nextCount = prev.count + 1;
  const intervals = [1, 3, 7, 14, 30];
  const addDays = intervals[Math.min(intervals.length - 1, nextCount - 1)];
  const nextDate = new Date(Date.now() + addDays * 86400000).toISOString().slice(0, 10);

  eb[t.id] = { title: t.title, count: nextCount, lastDate: new Date().toISOString().slice(0, 10), nextDate };
  localStorage.setItem('samguk_ebbinghaus_v1', JSON.stringify(eb));
  alert(`🎉 [${t.title}] ${nextCount}회독 완료! 다음 에빙하우스 복습 예정일: ${nextDate} (+${addDays}일 뒤)`);
}

function openHistoryModal() {
  const eb = JSON.parse(localStorage.getItem('samguk_ebbinghaus_v1') || '{}');
  const keys = Object.keys(eb);
  const body = document.getElementById('historyModalBody');
  if (!keys.length) {
    body.innerHTML = '<p>아직 [1회독 완료] 기록이 없습니다. 학습 후 상단 [1회독 완료] 버튼을 눌러주세요.</p>';
  } else {
    const today = new Date().toISOString().slice(0, 10);
    body.innerHTML = '<table style="width:100%; border-collapse:collapse; font-size:13.5px;"><tr style="background:#fef3c7;"><th style="padding:8px; border:1px solid #cbd5e1;">토픽명</th><th style="padding:8px; border:1px solid #cbd5e1;">회독수</th><th style="padding:8px; border:1px solid #cbd5e1;">다음 복습일</th></tr>' +
      keys.map(k => {
        const r = eb[k];
        const due = r.nextDate <= today;
        return `<tr><td style="padding:8px; border:1px solid #cbd5e1; font-weight:800;">${r.title}</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:center;">${r.count}회독</td><td style="padding:8px; border:1px solid #cbd5e1; text-align:center; color:${due ? '#dc2626' : '#0f766e'}; font-weight:900;">${due ? '🚨 복습요망 ' : ''}${r.nextDate}</td></tr>`;
      }).join('') + '</table>';
  }
  document.getElementById('historyModal').classList.add('open');
}

function exportUserStudyProgressJson() {
  const backupObj = {
    version: 'samguk_study_backup_v1',
    exportedAt: new Date().toISOString(),
    lapses: cardLapseCounts,
    graduated: graduatedCardMap,
    diagramCfg: diagramCustomConfigMap,
    postits: JSON.parse(localStorage.getItem('samguk_postit_notes_v1') || '{}'),
    ebbinghaus: JSON.parse(localStorage.getItem('samguk_ebbinghaus_v1') || '{}'),
    pronunDict: localStorage.getItem('maple_pronun_dict_v2') || '',
    customSubnotes: JSON.parse(localStorage.getItem('maple_custom_subnote_html_v1') || '{}')
  };
  const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `소방기술사_학습기록백업_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
}

function importUserStudyProgressJson(ev) {
  const file = ev.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.lapses) {
        cardLapseCounts = data.lapses;
        localStorage.setItem('samguk_anki_lapses_v1', JSON.stringify(cardLapseCounts));
      }
      if (data.graduated) {
        graduatedCardMap = data.graduated;
        localStorage.setItem('samguk_anki_graduated_v1', JSON.stringify(graduatedCardMap));
      }
      if (data.diagramCfg) {
        diagramCustomConfigMap = data.diagramCfg;
        localStorage.setItem('samguk_diagram_cfg_v1', JSON.stringify(diagramCustomConfigMap));
      }
      if (data.postits) localStorage.setItem('samguk_postit_notes_v1', JSON.stringify(data.postits));
      if (data.ebbinghaus) localStorage.setItem('samguk_ebbinghaus_v1', JSON.stringify(data.ebbinghaus));
      if (data.pronunDict) {
        localStorage.setItem('maple_pronun_dict_v2', data.pronunDict);
        if (typeof window.parsePronunciationText === 'function') window.parsePronunciationText(data.pronunDict);
      }
      if (data.customSubnotes) localStorage.setItem('maple_custom_subnote_html_v1', JSON.stringify(data.customSubnotes));

      loadTopic(window.state.topicIdx);
      openHistoryModal();
      alert('✅ 학습 기록(거머리·졸업·포스트잇·회독·발음사전) 복원이 완료되었습니다!');
    } catch (e) {
      alert('❌ 백업 파일 형식이 올바르지 않습니다.');
    }
  };
  reader.readAsText(file);
}

function openMnemonicBookModal() {
  const topics = window.STUDY_TOPICS || [];
  const rows = [];
  const temp = document.createElement('div');
  topics.forEach((t, idx) => {
    temp.innerHTML = t.summaryHtml || '';
    const items = Array.from(temp.querySelectorAll('span[style*="#ea580c"], div[style*="#ea580c"], td[style*="#1d4ed8"]'))
      .map(s => s.textContent.trim())
      .filter(x => x && x !== '-');
    if (items.length) {
      rows.push(`<div style="padding:10px; border-bottom:1px solid #e2e8f0; cursor:pointer;" onclick="loadTopic(${idx});closeModal('mnemonicModal');"><div style="font-weight:900; color:#1e293b;">${idx + 1}. ${t.title}</div><div style="color:#1d4ed8; font-weight:800; margin-top:4px;">🧠 ${items.join('  |  ')}</div></div>`);
    }
  });
  document.getElementById('mnemonicModalBody').innerHTML = rows.join('') || '<p>추출된 두문자가 없습니다.</p>';
  document.getElementById('mnemonicModal').classList.add('open');
}

function openPronunModal() {
  if (typeof window.openPronunDictModal === 'function') {
    window.openPronunDictModal();
  } else {
    const m = document.getElementById('pronunModal');
    if (m) m.classList.add('open');
  }
}

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    injectTopicJsonNow();
    return;
  }

  const tag = (e.target.tagName || '').toUpperCase();
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    if (e.shiftKey) {
      if (currentMainMode === 'palace') redoPalaceEdit();
    } else {
      if (currentMainMode === 'palace') undoPalaceEdit();
      else undoLastAnkiAction();
    }
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
    e.preventDefault();
    if (currentMainMode === 'palace') redoPalaceEdit();
    return;
  }

  if (e.key === 'F7') {
    e.preventDefault();
    if (typeof window.speakPrevStepLine === 'function') window.speakPrevStepLine();
    return;
  }
  if (e.key === 'F8') {
    e.preventDefault();
    if (typeof window.speakNextStepLine === 'function') window.speakNextStepLine();
    return;
  }
  if (e.key === 'F9') {
    e.preventDefault();
    speakSgSelectedAreas();
    return;
  }
  if (e.key === 'Escape') {
    stopAllTtsSpeech();
    return;
  }

  if (e.code === 'Space') {
    e.preventDefault();
    if (currentMainMode === 'palace') revealOrNextPalacePin();
    else handleAnkiCardClick();
  } else if (e.key === '1') {
    if (currentMainMode === 'samguk') gradeAnkiTarget('again');
  } else if (e.key === '2') {
    if (currentMainMode === 'samguk') gradeAnkiTarget('hard');
  } else if (e.key === '3') {
    if (currentMainMode === 'samguk') gradeAnkiTarget('good');
  } else if (e.key === '4' || e.key === '@') {
    if (currentMainMode === 'samguk') gradeAnkiTarget('easy');
  } else if (e.key === 'ArrowRight') {
    if (currentMainMode === 'palace') movePalacePinStep(1);
    else { ankiCurrentIdx = (ankiCurrentIdx + 1) % Math.max(1, ankiQueue.length); loadCurrentAnkiTargetToStage(); }
  } else if (e.key === 'ArrowLeft') {
    if (currentMainMode === 'palace') movePalacePinStep(-1);
    else { ankiCurrentIdx = (ankiCurrentIdx - 1 + Math.max(1, ankiQueue.length)) % Math.max(1, ankiQueue.length); loadCurrentAnkiTargetToStage(); }
  } else if (e.key.toLowerCase() === 'h') {
    toggleClozeHintMode();
  } else if (e.key.toLowerCase() === 'r') {
    replayCurrentAnkiTts();
  }
});

// ==================== [기억의 궁전 단독 에디션 & 10단계 별점(★1~★10) 통합 모듈] ====================

const TOPIC_STAR_META_10 = {
  10: { label: '👑 ★10 절대S급', bg: '#b71c1c', border: '#ffd700', text: '#fff59d' },
  9:  { label: '🔥 ★9 초빈출',   bg: '#c62828', border: '#ff8a80', text: '#ffffff' },
  8:  { label: '🚨 ★8 특A급',    bg: '#d84315', border: '#ffab91', text: '#ffffff' },
  7:  { label: '⭐ ★7 A급',      bg: '#e65100', border: '#ffcc80', text: '#ffffff' },
  6:  { label: '📌 ★6 핵심',     bg: '#f57c00', border: '#ffe082', text: '#ffffff' },
  5:  { label: '✅ ★5 중요',     bg: '#2e7d32', border: '#a5d6a7', text: '#ffffff' },
  4:  { label: '📘 ★4 기본',     bg: '#1565c0', border: '#90caf9', text: '#ffffff' },
  3:  { label: '📗 ★3 보통',     bg: '#0277bd', border: '#81d4fa', text: '#ffffff' },
  2:  { label: '📙 ★2 참고',     bg: '#455a64', border: '#b0bec5', text: '#ffffff' },
  1:  { label: '📓 ★1 지엽',     bg: '#616161', border: '#cfd8dc', text: '#e0e0e0' }
};

function getTopicStarNumber(topic) {
  if (!topic) return 5;
  const n = parseInt(topic.stars, 10);
  if (isNaN(n) || n < 1) return 1;
  if (n > 10) return 10;
  return n;
}

function getTopicStarMeta(stars) {
  const s = Math.max(1, Math.min(10, parseInt(stars, 10) || 5));
  return TOPIC_STAR_META_10[s] || TOPIC_STAR_META_10[5];
}

// 1. 궁전 와이드 뷰 토글 (우측 콘솔 접기/펴기)
let isPalaceWideViewMode = false;
function togglePalaceWideViewMode() {
  isPalaceWideViewMode = !isPalaceWideViewMode;
  const palaceEl = document.getElementById('memoryPalaceStage');
  if (!palaceEl) return;

  const consoleBox = palaceEl.querySelector('.palace-side-console') ||
                     palaceEl.querySelector('.palace-console') ||
                     document.getElementById('palaceSideConsole');
  const mainBody = consoleBox ? consoleBox.parentElement : null;
  const btn = document.getElementById('palaceWideToggleBtn');

  if (consoleBox) {
    consoleBox.style.display = isPalaceWideViewMode ? 'none' : '';
  }
  if (mainBody) {
    mainBody.style.gridTemplateColumns = isPalaceWideViewMode ? '1fr' : '';
  }
  if (btn) {
    btn.innerHTML = isPalaceWideViewMode ? '📐 우측 콘솔 펼치기' : '↔️ 궁전 와이드 확대';
    btn.style.background = isPalaceWideViewMode ? '#047857' : '#1e293b';
  }
}
window.togglePalaceWideViewMode = togglePalaceWideViewMode;

// 2. 현재 토픽의 별점(★1~★10) 즉시 변경 & IndexedDB 자동 영구저장
async function setCurrentTopicStarRating(newStars) {
  const idx = window.state ? window.state.topicIdx : 0;
  if (!window.STUDY_TOPICS || !window.STUDY_TOPICS[idx]) return;
  const topic = window.STUDY_TOPICS[idx];
  const s = Math.max(1, Math.min(10, parseInt(newStars, 10) || 5));
  topic.stars = s;

  renderCurrentTopicStarWidgets();
  if (typeof window.filterTopicsList === 'function') {
    window.filterTopicsList();
  }

  if (typeof saveTopicsDataJsFileDirectly === 'function') {
    await saveTopicsDataJsFileDirectly(true);
  }
  if (typeof showAutoSaveToast === 'function') {
    const meta = getTopicStarMeta(s);
    showAutoSaveToast(`⭐ [${topic.title}] 중요도가 [${meta.label}]로 저장되었습니다!`);
  }
}
window.setCurrentTopicStarRating = setCurrentTopicStarRating;

// 3. ★1~★10 클릭형 인터랙티브 별점 바 HTML 생성
function buildInteractiveStarBarHtml(stars) {
  const s = Math.max(1, Math.min(10, parseInt(stars, 10) || 5));
  const meta = getTopicStarMeta(s);

  let starsHtml = '';
  for (let i = 1; i <= 10; i++) {
    const isFilled = i <= s;
    const color = isFilled ? '#fbbf24' : '#475569';
    const glow = (isFilled && s >= 8) ? 'text-shadow:0 0 6px rgba(251,191,36,0.75);' : '';
    starsHtml += `<span onclick="setCurrentTopicStarRating(${i})" title="클릭하여 ★${i}점으로 변경" style="cursor:pointer; font-size:15px; color:${color}; ${glow} padding:0 1px; user-select:none; display:inline-block; transition:transform 0.12s;" onmouseover="this.style.transform='scale(1.25)'" onmouseout="this.style.transform='scale(1)'">★</span>`;
  }

  return `
    <span class="topic-star-widget-box" style="display:inline-flex; align-items:center; gap:6px; background:rgba(15,23,42,0.92); border:1.5px solid ${meta.border}; padding:2px 10px; border-radius:999px; vertical-align:middle; box-shadow:0 2px 6px rgba(0,0,0,0.35);">
      <span style="background:${meta.bg}; color:${meta.text}; font-weight:900; font-size:11.5px; padding:1px 8px; border-radius:999px; border:1px solid ${meta.border}; white-space:nowrap;">${meta.label}</span>
      <span style="display:inline-flex; align-items:center; line-height:1;">${starsHtml}</span>
    </span>
  `;
}

// 4. 서브노트 제목 옆 & 기억의 궁전 상단 바에 ★1~★10 위젯 렌더링
function renderCurrentTopicStarWidgets() {
  const idx = window.state ? window.state.topicIdx : 0;
  if (!window.STUDY_TOPICS || !window.STUDY_TOPICS[idx]) return;
  const topic = window.STUDY_TOPICS[idx];
  const s = getTopicStarNumber(topic);
  const widgetHtml = buildInteractiveStarBarHtml(s);

  // (A) 서브노트 상단 제목(subnoteTitleHeading) 옆에 별점 위젯 부착
  const titleHeading = document.getElementById('subnoteTitleHeading');
  if (titleHeading && titleHeading.parentNode) {
    let holder = document.getElementById('subnoteStarRatingHolder');
    if (!holder) {
      holder = document.createElement('span');
      holder.id = 'subnoteStarRatingHolder';
      holder.style.cssText = 'display:inline-flex; align-items:center; margin-left:10px; vertical-align:middle;';
      titleHeading.parentNode.insertBefore(holder, titleHeading.nextSibling);
    }
    holder.innerHTML = widgetHtml;
  }

  // (B) 기억의 궁전 상단 바(palaceTopicIdLabel 있는 헤더)에 별점 위젯 + 와이드 버튼 부착
  const palaceIdLabel = document.getElementById('palaceTopicIdLabel');
  const palaceHeader = palaceIdLabel ? palaceIdLabel.closest('div') : document.querySelector('#memoryPalaceStage > div:first-child');
  if (palaceHeader) {
    let palaceBar = document.getElementById('palaceTopStarAndWideBar');
    if (!palaceBar) {
      palaceBar = document.createElement('span');
      palaceBar.id = 'palaceTopStarAndWideBar';
      palaceBar.style.cssText = 'display:inline-flex; align-items:center; gap:8px; margin-left:8px; flex-wrap:wrap;';
      palaceHeader.appendChild(palaceBar);
    }
    const wideBtnLabel = isPalaceWideViewMode ? '📐 우측 콘솔 펼치기' : '↔️ 궁전 와이드 확대';
    const wideBtnBg = isPalaceWideViewMode ? '#047857' : '#1e293b';
    palaceBar.innerHTML = `
      ${widgetHtml}
      <button type="button" id="palaceWideToggleBtn" onclick="togglePalaceWideViewMode()" style="background:${wideBtnBg}; color:#fde047; border:1.5px solid #f59e0b; border-radius:7px; padding:3px 10px; font-size:12px; font-weight:800; cursor:pointer; height:28px;">${wideBtnLabel}</button>
    `;
  }
}

// 5. 삼국지 카드결투 UI 완전 숨김 & 기억의 궁전 단독 활성화
function enforcePalaceOnlyModeUI() {
  currentMainMode = 'palace';

  const samgukEl = document.getElementById('samgukBattleStage');
  const palaceEl = document.getElementById('memoryPalaceStage');
  if (samgukEl) samgukEl.style.display = 'none';
  if (palaceEl) {
    palaceEl.style.display = '';
    palaceEl.classList.add('active');
  }

  // 상단/리모컨 모드 스위치, 삼국지 전용 버튼, 구버전 저장 버튼 완전 숨김
  [
    'btnModeSamguk', 'btnModePalace', 'remBtnModeSamguk', 'remBtnModePalace',
    'remSamgukGradeRow', 'btnSpeedTimer', 'btnWrongPool', 'btnLeechPool'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const modePill = document.querySelector('.mode-switch-pill');
  if (modePill) modePill.style.display = 'none';
  const remModeRow = document.querySelector('.remote-mode-row');
  if (remModeRow) remModeRow.style.display = 'none';
  const onlyPalaceLabel = document.getElementById('onlyPalaceFilter')?.closest('label');
  if (onlyPalaceLabel) onlyPalaceLabel.style.display = 'none';

  document.querySelectorAll('button').forEach(b => {
    const oc = b.getAttribute('onclick') || '';
    if (oc.includes('savePalacesDataJsFileDirectly') || oc.includes('resetGraduatedCardsForTopic')) {
      b.style.display = 'none';
    }
  });

  // 상단 검색창 옆에 [★ 중요도 필터/정렬] 드롭다운 장착
  const searchInput = document.getElementById('topicSearchInput');
  if (searchInput && searchInput.parentNode && !document.getElementById('starFilterSelect')) {
    const starSel = document.createElement('select');
    starSel.id = 'starFilterSelect';
    starSel.style.cssText = 'background:#0f172a; color:#fde047; border:1.5px solid #d97706; border-radius:7px; padding:4px 8px; font-size:12px; font-weight:800; cursor:pointer; margin-right:6px; height:30px;';
    starSel.innerHTML = `
      <option value="ALL">⭐ 전체 별점</option>
      <option value="SORT_DESC">👑 중요도(★) 높은순</option>
      <option value="9_10">🔥 S급 (★9~★10)</option>
      <option value="8_10">🚨 특A급+ (★8~★10)</option>
      <option value="6_10">📌 핵심+ (★6~★10)</option>
      <option value="10">👑 ★10 (절대S급)</option>
      <option value="9">🔥 ★9 (초빈출)</option>
      <option value="8">🚨 ★8 (특A급)</option>
      <option value="7">⭐ ★7 (A급)</option>
      <option value="6">📌 ★6 (핵심)</option>
      <option value="5">✅ ★5 (중요)</option>
    `;
    starSel.onchange = () => {
      if (typeof window.filterTopicsList === 'function') window.filterTopicsList();
    };
    searchInput.parentNode.insertBefore(starSel, searchInput);
  }
}

// 6. switchMainStageMode 오버라이드: 언제나 'palace'로 고정
const _origSwitchMainStageMode = switchMainStageMode;
switchMainStageMode = function() {
  _origSwitchMainStageMode('palace');
  enforcePalaceOnlyModeUI();
  renderCurrentTopicStarWidgets();
};
window.switchMainStageMode = switchMainStageMode;

// 7. filterTopicsList 오버라이드: 토픽 목록에 [★10] 표시 및 별점 필터링/정렬
filterTopicsList = function() {
  const topics = window.STUDY_TOPICS || [];
  const cat = document.getElementById('categorySelect')?.value || 'ALL';
  const onlyPalace = document.getElementById('onlyPalaceFilter')?.checked || false;
  const q = (document.getElementById('topicSearchInput')?.value || '').trim().toLowerCase();
  const starMode = document.getElementById('starFilterSelect')?.value || 'ALL';
  const sel = document.getElementById('topicSelect');
  if (!sel) return;

  let indices = [];
  topics.forEach((t, idx) => {
    if (cat !== 'ALL' && (t.category || '기타') !== cat) return;
    const hasPalace = Boolean(window.MEMORY_PALACES[t.id] || t.memoryPalace);
    if (onlyPalace && !hasPalace) return;

    if (q) {
      const hay = ((t.id || '') + ' ' + (t.title || '') + ' ' + (t.summaryHtml || '')).toLowerCase();
      if (!hay.includes(q)) return;
    }

    const s = getTopicStarNumber(t);
    if (starMode === '9_10' && s < 9) return;
    if (starMode === '8_10' && s < 8) return;
    if (starMode === '6_10' && s < 6) return;
    if (/^\d+$/.test(starMode) && s !== parseInt(starMode, 10)) return;

    indices.push(idx);
  });

  if (starMode === 'SORT_DESC') {
    indices.sort((a, b) => getTopicStarNumber(topics[b]) - getTopicStarNumber(topics[a]));
  }

  sel.innerHTML = '';
  indices.forEach(idx => {
    const t = topics[idx];
    const s = getTopicStarNumber(t);
    const hasPalace = Boolean(window.MEMORY_PALACES[t.id] || t.memoryPalace);
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `[★${s}] ${idx + 1}. ${hasPalace ? '🏛️ ' : ''}${t.title || '무제'}`;
    sel.appendChild(opt);
  });

  if (indices.includes(window.state.topicIdx)) {
    sel.value = String(window.state.topicIdx);
  } else if (indices.length > 0) {
    sel.value = String(indices[0]);
    loadTopic(indices[0]);
  }
};
window.filterTopicsList = filterTopicsList;

// 8. loadTopic 오버라이드: 토픽 로드 시 Step 0이면 궁전 핀도 전체 공개 & 노트수정 초기화
const _origLoadTopic = loadTopic;
loadTopic = function(idx) {
  const box = document.getElementById('subnoteBox');
  if (box && box.isContentEditable) {
    box.contentEditable = 'false';
    box.style.outline = 'none';
    box.style.backgroundColor = '';
    if (typeof syncSubnoteEditModeUI === 'function') syncSubnoteEditModeUI(false);
  }
  _origLoadTopic(idx);
  enforcePalaceOnlyModeUI();

  if (window.state && window.state.clozeStage === 0) {
    const pins = currentPalaceObj?.pins || [];
    pins.forEach((_, pIdx) => palaceClearedSet.add(pIdx));
    currentPinRevealed = true;
    masterMaskOn = false;
    renderPalacePinsAndRoute();
    updatePalaceSideConsole();
    syncMaskToggleButtonsUI();
  }

  renderCurrentTopicStarWidgets();
  if (typeof updateFloatingRemoteUI === 'function') updateFloatingRemoteUI();
};
window.loadTopic = loadTopic;

// 9. 부팅 시 & IndexedDB 비동기 복구 완료 직후 항상 [Step 0. 원문통독 + 궁전 전체 공개]로 시작
let hasAppliedInitialStep0Boot = false;
function initPalaceOnlyEditionBoot() {
  if (Array.isArray(window.STUDY_TOPICS) && window.STUDY_TOPICS.length > 0) {
    window.STUDY_TOPICS.forEach(t => {
      if (t && t.id === 'alarm_44' && (!t.stars || t.stars === 5)) {
        t.stars = 10;
      }
    });
  }
  enforcePalaceOnlyModeUI();
  if (!hasAppliedInitialStep0Boot && Array.isArray(window.STUDY_TOPICS) && window.STUDY_TOPICS.length > 0) {
    hasAppliedInitialStep0Boot = true;
    setProgressiveStep(0);
  } else if (window.state && window.state.clozeStage === 0) {
    const pins = currentPalaceObj?.pins || [];
    pins.forEach((_, pIdx) => palaceClearedSet.add(pIdx));
    currentPinRevealed = true;
    masterMaskOn = false;
    renderPalacePinsAndRoute();
    updatePalaceSideConsole();
    syncMaskToggleButtonsUI();
  }
  if (typeof window.filterTopicsList === 'function') window.filterTopicsList();
  renderCurrentTopicStarWidgets();
  if (typeof updatePalaceCameraTransform === 'function') updatePalaceCameraTransform();
  if (typeof updateFloatingRemoteUI === 'function') updateFloatingRemoteUI();
}

window.addEventListener('DOMContentLoaded', () => {
  initPalaceOnlyEditionBoot();
  setTimeout(initPalaceOnlyEditionBoot, 150);
  setTimeout(initPalaceOnlyEditionBoot, 500);
});
initPalaceOnlyEditionBoot();

