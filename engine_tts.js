/**
 * 🔊 삼국지 × 소방기술사 하이엔드 신경망 TTS 코어 엔진 (engine_tts.js)
 * - [스마트폰 완벽 호환 패치 통합본]
 *   1) 모바일 브라우저(iOS/Android) TTS 자동재생 차단(setTimeout) 즉시 해제 및 한국어 음성 완벽 매칭
 *   2) 스마트폰에서 기억의 궁전 그림이 0px로 찌그러져 안 보이던 레이아웃 버그 완벽 해결 (상하 배치 전환)
 *   3) 모바일 화면에서 거대 리모컨 자동 축소 및 손가락 터치 드래그 완벽 지원
 */

let availableVoices = [];
let currentStepReadIndex = -1;
let stepReadableUnits = [];
let isContinuousReading = false;
let activeChunkTimers = [];
let pronunFilterMode = 'all';
let pickStartLineOnceMode = false;
let mobileAudioUnlocked = false;

window._activeSpeechUtterances = [];

const TTS_CONFIG_STORAGE_KEY = 'maple_tts_master_cfg_v1';

const DEFAULT_TTS_CONFIG = {
  rate: 1.05,
  pitch: 1.00,
  basePauseMs: 120
};

let ttsEngineConfig = Object.assign({}, DEFAULT_TTS_CONFIG);

const DEFAULT_PRONUN_DICT = {
  "KCL": "케이씨엘",
  "KVL": "케이브이엘",
  "NTC": "엔티씨",
  "PTC": "피티씨",
  "CTR": "씨티알",
  "SCR": "에스씨알",
  "LED": "엘이디",
  "NFPC": "엔에프피씨",
  "NFTC": "엔에프티씨",
  "NFPA": "엔에프피에이",
  "ASET": "에이셋",
  "RSET": "알셋",
  "FEC": "에프이씨",
  "CO₂": "씨오투",
  "CO2": "씨오투",
  "CO": "씨오",
  "O₂": "오투",
  "O2": "오투",
  "N₂": "엔투",
  "N2": "엔투",
  "H₂O": "에이치투오",
  "H2O": "에이치투오",
  "H₂": "에이치투",
  "H2": "에이치투",
  "SO₂": "에스오투",
  "SO2": "에스오투",
  "NO₂": "엔오투",
  "NO2": "엔오투",
  "HCl": "에이치씨엘",
  "HCN": "에이치씨엔",
  "NH₃": "엔에이치쓰리",
  "NH3": "엔에이치쓰리",
  "CF₃Br": "씨에프쓰리비알",
  "CF3Br": "씨에프쓰리비알",
  "Td": "티디",
  "Ta": "티에이",
  "To": "티오",
  "Ti": "티아이",
  "Te": "티이",
  "P형": "피형",
  "R형": "알형",
  "Al판": "알루미늄판",
  "Al": "알루미늄",
  "Leak홀": "리크홀",
  "Leak": "리크",
  "dT/dt": "디티 오버 디티",
  "10℃/min": "10도 퍼 민",
  "15℃/min": "15도 퍼 민",
  "20℃/min": "20도 퍼 민",
  "℃/min": "섭씨 도 퍼 민",
  "kW/m²": "킬로와트 퍼 제곱미터",
  "kW/m2": "킬로와트 퍼 제곱미터",
  "Wb/m²": "웨버 퍼 제곱미터",
  "Wb/m2": "웨버 퍼 제곱미터",
  "kg/cm²": "킬로그램 퍼 제곱센티미터",
  "kg/cm2": "킬로그램 퍼 제곱센티미터",
  "N/m²": "뉴턴 퍼 제곱미터",
  "N/m2": "뉴턴 퍼 제곱미터",
  "m³/min": "세제곱미터 퍼 민",
  "m3/min": "세제곱미터 퍼 민",
  "ft³/min": "세제곱피트 퍼 민",
  "ft3/min": "세제곱피트 퍼 민",
  "L/min": "리터 퍼 민",
  "%/m": "퍼센트 퍼 미터",
  "m/s": "미터 퍼 세크",
  "m²": "제곱미터",
  "m³": "세제곱미터",
  "cm²": "제곱센티미터",
  "sinθ": "사인 세타",
  "cosθ": "코사인 세타",
  "tanθ": "탄젠트 세타",
  "R_TH1": "알 티에이치 원",
  "R_TH2": "알 티에이치 투",
  "R_Th1": "알 티에이치 원",
  "R_Th2": "알 티에이치 투",
  "RTh1": "알 티에이치 원",
  "RTh2": "알 티에이치 투",
  "R1": "알 원",
  "R2": "알 투",
  "R3": "알 쓰리",
  "R4": "알 포",
  "I1": "아이 원",
  "I2": "아이 투",
  "I3": "아이 쓰리",
  "I4": "아이 포",
  "V_T": "브이 티",
  "VT": "브이 티",
  "V1": "브이 원",
  "V2": "브이 투",
  "V3": "브이 쓰리",
  "MPa": "메가파스칼",
  "kPa": "킬로파스칼",
  "kW": "킬로와트",
  "kVA": "킬로볼트암페어",
  "mA": "밀리암페어",
  "ppm": "피피엠",
  "㏀": "킬로옴",
  "Ω": "옴",
  "㎡": "제곱미터",
  "㎥": "세제곱미터",
  "㎠": "제곱센티미터",
  "℃": "도",
  "≠": " 같지 않다, ",
  "≈": " 거의 같다, ",
  "≒": " 거의 같다, ",
  "≤": " 이하, ",
  "≥": " 이상, ",
  "∑": "시그마 ",
  "Σ": "시그마 "
};

let userPronunDict = {};
let customModifiedKeys = new Set();

function loadTtsEngineConfig() {
  ttsEngineConfig = Object.assign({}, DEFAULT_TTS_CONFIG);
  try {
    const legacyRate = parseFloat(localStorage.getItem('maple_edge_tts_rate'));
    if (!isNaN(legacyRate) && legacyRate >= 0.5 && legacyRate <= 2.0) {
      ttsEngineConfig.rate = legacyRate;
    }
    const raw = localStorage.getItem(TTS_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      ttsEngineConfig = Object.assign({}, DEFAULT_TTS_CONFIG, parsed);
    }
  } catch (e) {}

  if (window.state) {
    window.state.ttsRate = ttsEngineConfig.rate;
  }
  syncToolbarRateSelectUI();
  return ttsEngineConfig;
}

function saveTtsEngineConfig() {
  try {
    localStorage.setItem(TTS_CONFIG_STORAGE_KEY, JSON.stringify(ttsEngineConfig));
    localStorage.setItem('maple_edge_tts_rate', String(ttsEngineConfig.rate));
    localStorage.setItem('maple_tts_rate', String(ttsEngineConfig.rate));
    if (window.state) window.state.ttsRate = ttsEngineConfig.rate;
    syncToolbarRateSelectUI();
  } catch (e) {}
}

function getTtsEngineConfig() {
  return ttsEngineConfig;
}
window.getTtsEngineConfig = getTtsEngineConfig;

function syncToolbarRateSelectUI() {
  const sel = document.getElementById('ttsRateSelect');
  if (!sel) return;
  const rStr = String(ttsEngineConfig.rate);
  let exists = Array.from(sel.options).some(opt => parseFloat(opt.value) === ttsEngineConfig.rate);
  if (!exists) {
    const customOpt = document.createElement('option');
    customOpt.value = rStr;
    customOpt.textContent = `${ttsEngineConfig.rate.toFixed(2).replace(/\.00$/, '.0')}x`;
    sel.appendChild(customOpt);
  }
  sel.value = rStr;
}

function clearAllChunkTimers() {
  while (activeChunkTimers.length > 0) {
    clearTimeout(activeChunkTimers.pop());
  }
}

function loadPronunciationDictionary() {
  loadTtsEngineConfig();
  userPronunDict = Object.assign({}, DEFAULT_PRONUN_DICT);
  customModifiedKeys.clear();
  try {
    const saved = localStorage.getItem('maple_pronun_dict_v2');
    if (saved) {
      parsePronunciationText(saved);
    }
  } catch (e) {}
}

function parsePronunciationText(rawText) {
  userPronunDict = Object.assign({}, DEFAULT_PRONUN_DICT);
  customModifiedKeys.clear();

  const lines = (rawText || '').split(/\r?\n/);
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) return;

    let k = '';
    let v = '';

    if (trimmed.includes('➔')) {
      const arrowIdx = trimmed.indexOf('➔');
      k = trimmed.slice(0, arrowIdx).trim();
      v = trimmed.slice(arrowIdx + 1).trim();
    } else if (trimmed.includes('=>')) {
      const arrowIdx = trimmed.indexOf('=>');
      k = trimmed.slice(0, arrowIdx).trim();
      v = trimmed.slice(arrowIdx + 2).trim();
    } else {
      const lastEqIdx = trimmed.lastIndexOf('=');
      if (lastEqIdx > 0) {
        k = trimmed.slice(0, lastEqIdx).trim();
        v = trimmed.slice(lastEqIdx + 1).trim();
      }
    }

    if (/^[1-5]\.$/.test(k) && /\[\s*0\.[35]초\s*\]/.test(v)) {
      v = v.replace(/\[\s*0\.[35]초\s*\]/g, '[0.1초]');
    }
    if ((k === '유입전류' && v === '유입. 전류') || (k === '유출전류' && v === '유출. 전류') || (k === '전압강하' && v === '전압. 강하')) {
      return;
    }
    if (k.includes('/') && (v.includes('당 ') || v.startsWith('분당 '))) {
      return;
    }

    if (k && v) {
      userPronunDict[k] = v;
      if (DEFAULT_PRONUN_DICT[k] !== v) {
        customModifiedKeys.add(k);
      }
    }
  });
}
window.parsePronunciationText = parsePronunciationText;

function serializePronunciationDict() {
  const entries = Object.entries(userPronunDict);
  entries.sort(([kA], [kB]) => {
    const cA = customModifiedKeys.has(kA) ? 0 : 1;
    const cB = customModifiedKeys.has(kB) ? 0 : 1;
    if (cA !== cB) return cA - cB;
    return 0;
  });
  return entries.map(([k, v]) => `${k} = ${v}`).join('\n');
}

function savePronunDictToStorage() {
  const serialized = serializePronunciationDict();
  localStorage.setItem('maple_pronun_dict_v2', serialized);
  const ta = document.getElementById('pronunDictTextarea');
  if (ta) ta.value = serialized;
}

function extractElementSpeechText(el) {
  if (!el) return '';
  if (el.tagName === 'SVG' || el.classList?.contains('cloze-diagram-wrap')) {
    const svgEl = el.tagName === 'SVG' ? el : el.querySelector('svg');
    if (svgEl && svgEl.dataset.tts) return svgEl.dataset.tts;
    const labels = svgEl
      ? Array.from(svgEl.querySelectorAll('text')).map(t => (t.textContent || '').trim()).filter(Boolean)
      : [];
    return labels.length ? `개념도 주요 구성. ${labels.join(', ')}` : '';
  }

  const clone = el.cloneNode(true);
  clone.querySelectorAll('.sg-area-order-badge, .cloze-diagram-mask, .cloze-diagram-toolbar').forEach(b => b.remove());

  clone.querySelectorAll('svg').forEach(svg => {
    if (svg.dataset && svg.dataset.tts) {
      const tNode = document.createTextNode(' @@LINE_BREAK@@ ' + svg.dataset.tts + ' @@LINE_BREAK@@ ');
      svg.replaceWith(tNode);
    } else {
      svg.remove();
    }
  });

  clone.querySelectorAll('.cloze-mask').forEach(m => {
    const origHtml = m.dataset.origHtml || m.dataset.answer || '';
    const tempSpan = document.createElement('span');
    tempSpan.innerHTML = origHtml;
    m.replaceWith(tempSpan);
  });

  clone.querySelectorAll('br').forEach(br => {
    br.replaceWith(document.createTextNode(' @@LINE_BREAK@@ '));
  });
  clone.querySelectorAll('div, p, li, tr').forEach(blk => {
    blk.appendChild(document.createTextNode(' @@LINE_BREAK@@ '));
  });
  clone.querySelectorAll('td, th').forEach(cell => {
    cell.appendChild(document.createTextNode(' @@LINE_BREAK@@ '));
  });

  return (clone.innerText || clone.textContent || '')
    .replace(/\s+/g, ' ')
    .replace(/(@@LINE_BREAK@@\s*){2,}/g, ' @@LINE_BREAK@@ ')
    .trim();
}
window.extractElementSpeechText = extractElementSpeechText;

function convertPauseTagToNaturalPunctuation(valStr) {
  if (!valStr) return '';
  let s = String(valStr).trim();

  s = s.replace(/[\[\(]\s*(\d+(?:\.\d+)?)\s*(초|s|ms)\s*[\]\)]/gi, (_, numStr, unit) => {
    const n = parseFloat(numStr);
    const sec = unit.toLowerCase() === 'ms' ? (n / 1000) : n;
    if (sec <= 0.2) return ', ';
    return '. ';
  });

  return s;
}

function getKoreanTopicParticleForEquals(precedingStr) {
  const clean = (precedingStr || '').replace(/[\s,\.\)\]\}_]+$/g, '');
  if (!clean) return '은';
  const lastChar = clean[clean.length - 1];
  const code = lastChar.charCodeAt(0);

  if (code >= 0xAC00 && code <= 0xD7A3) {
    return ((code - 0xAC00) % 28 !== 0) ? '은' : '는';
  }
  if (/[013678]$/.test(lastChar)) return '은';
  if (/[2459]$/.test(lastChar)) return '는';
  if (/[LMNRlmnr]$/.test(lastChar)) return '은';
  return '는';
}

function normalizeSubSupDigits(str) {
  const map = {
    '₀':'0', '₁':'1', '₂':'2', '₃':'3', '₄':'4', '₅':'5', '₆':'6', '₇':'7', '₈':'8', '₉':'9',
    '⁰':'0', '¹':'1', '²':'2', '³':'3', '⁴':'4', '⁵':'5', '⁶':'6', '⁷':'7', '⁸':'8', '⁹':'9',
    'ₜ':'T', 'ₕ':'h'
  };
  return String(str || '').replace(/[₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹ₜₕ]/g, ch => map[ch] || ch);
}

function refineForEdgeNaturalSpeech(rawText) {
  if (!rawText) return '';
  let text = String(rawText);

  text = text
    .replace(/✅\s*\d+번\s*선택/g, ' ')
    .replace(/🔒\s*\[\s*100%\s*백지\s*빈칸\s*\]/g, ' ')
    .replace(/🔒\s*\[\s*#[0-9\?]+\s*가림막[^\]]*\]/g, ' ')
    .replace(/🔒\s*\[\s*#[0-9\?]+\s*백지\s*\]/g, ' ')
    .replace(/🎯\s*\[\s*현재\s*백지\s*타겟\s*\]/g, ' ')
    .replace(/\[\s*공식\/수식\s*\]/g, ' ')
    .replace(/\[\s*영문\/숫자\s*\d+자\s*\]/g, ' ')
    .replace(/\[\s*개념도\s*\/?\s*회로도\s*\]/g, ' ')
    .replace(/🔒|🩸|🎯|★|📐/g, ' ');

  text = text.replace(/[「」『』《》〈〉]/g, ' ');

  text = text
    .replace(/\(\s*(\d+)\s*\)/g, ' $1, ')
    .replace(/(^|[\s\|\/—–,\.])(\d+)\)\s*/g, '$1 $2, ');

  text = text.replace(/([^\s])\s+(?=[2-9]\.\s*[가-힣A-Za-z∑ΣIVR])/g, '$1 @@LINE_BREAK@@ ');

  const effectiveDict = Object.assign({}, userPronunDict);
  Object.keys(userPronunDict).forEach(origKey => {
    const normKey = normalizeSubSupDigits(origKey);
    if (normKey !== origKey && !effectiveDict[normKey]) {
      effectiveDict[normKey] = userPronunDict[origKey];
    }
  });

  const applyDictPass = (targetStr) => {
    let out = targetStr;
    const sortedKeys = Object.keys(effectiveDict).sort((a, b) => b.length - a.length);
    sortedKeys.forEach(k => {
      const rawVal = effectiveDict[k];
      const repVal = convertPauseTagToNaturalPunctuation(rawVal);
      const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      if (/^\d+\.$/.test(k)) {
        const cleanRep = repVal.replace(/[,\.\s]+$/, '');
        const hasPunct = /[,\.]$/.test(repVal.trim());
        const finalRep = hasPunct ? repVal : (cleanRep + ', ');
        const reg = new RegExp(`(^|[\\s\\|\\/—–\\(\\[,\\.]|@@LINE_BREAK@@)${escaped}(?!\\d)\\s*`, 'g');
        out = out.replace(reg, `$1 ${finalRep}`);
      } else if (/^\d+$/.test(k)) {
        const cleanRep = repVal.replace(/[,\.\s]+$/, '');
        const finalRep = /[,\.]$/.test(repVal.trim()) ? repVal : (cleanRep + ', ');
        const reg = new RegExp(`(^|[\\s\\|\\/—–,\\.]|@@LINE_BREAK@@)${escaped}(?=\\s|$)(?!\\s*(?:도|℃|분|초|종|m|cm|mm|kg|개|회|%))`, 'g');
        out = out.replace(reg, `$1 ${finalRep}`);
      } else if (/[=∑Σ\+\-]/.test(k) || k.includes(' ')) {
        const flexPattern = k
          .trim()
          .split(/\s*/)
          .map(ch => {
            if (ch === '∑' || ch === 'Σ') return '[∑Σ]';
            return ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          })
          .join('\\s*');
        out = out.replace(new RegExp(flexPattern, 'g'), repVal);
      } else if (/^[A-Za-z0-9_₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹]+$/.test(k)) {
        const reg = new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z0-9₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹])`, 'g');
        out = out.replace(reg, repVal);
      } else {
        out = out.replace(new RegExp(escaped, 'g'), repVal);
      }
    });
    return out;
  };

  text = applyDictPass(text);
  text = normalizeSubSupDigits(text);
  text = applyDictPass(text);

  text = convertPauseTagToNaturalPunctuation(text);

  text = text.replace(/(^|[\s\|\/—–,\.]|@@LINE_BREAK@@)(\d+)\.\s+(?=[가-힣A-Za-z∑Σ])/g, '$1 $2, ');

  text = text
    .replace(/\s*\+\s*/g, ' 플러스 ')
    .replace(/([가-힣A-Za-z0-9\)\]])\s*[-−–]\s*(?=[가-힣A-Za-z0-9\(\[∑Σ])/g, '$1 마이너스 ')
    .replace(/([가-힣A-Za-z0-9])\s*[·•]\s*(?=[알아이브이RIV])/g, '$1 곱하기 ')
    .replace(/\s*×\s*/g, ' 곱하기 ');

  text = text.replace(/([가-힣A-Za-z0-9\)\]]+)\s*=\s*/g, (match, leftWord) => {
    const josa = getKoreanTopicParticleForEquals(leftWord);
    return `${leftWord}${josa}, `;
  });
  text = text.replace(/\s*=\s*/g, ' 는, ');

  text = text
    .replace(/①/g, ' 1, ')
    .replace(/②/g, ' 2, ')
    .replace(/③/g, ' 3, ')
    .replace(/④/g, ' 4, ')
    .replace(/⑤/g, ' 5, ')
    .replace(/⑥/g, ' 6, ')
    .replace(/⑦/g, ' 7, ')
    .replace(/⑧/g, ' 8, ')
    .replace(/⑨/g, ' 9, ')
    .replace(/⑩/g, ' 10, ')
    .replace(/㉮/g, ' 가, ')
    .replace(/㉯/g, ' 나, ')
    .replace(/㉰/g, ' 다, ')
    .replace(/㉱/g, ' 라, ');

  text = text
    .replace(/■|※|○|●|◎|◇|◆|□|★|☆/g, ' ')
    .replace(/\s*(?:→|➔|▶|▸|⇒|⟶|↔|⇔)\s*/g, ', ')
    .replace(/\s*[:;\/—–\|~]\s*/g, ', ')
    .replace(/(^|\s)-\s*/g, '$1 ')
    .replace(/·|•/g, ', ');

  text = text.replace(/([가-힣]{2,})\s+시\s+(?=[가-힣]{2,})/g, '$1 시, ');

  text = text
    .replace(/(@@LINE_BREAK@@\s*){2,}/g, ' @@LINE_BREAK@@ ')
    .replace(/,\s*,+/g, ', ')
    .replace(/\.\s*,/g, '. ')
    .replace(/,\s*\./g, '. ')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}
window.refineForEdgeNaturalSpeech = refineForEdgeNaturalSpeech;

function initEdgeTtsVoices() {
  loadPronunciationDictionary();
  if (!('speechSynthesis' in window)) return;

  const populate = () => {
    const all = window.speechSynthesis.getVoices() || [];
    if (!all.length) return;

    const koVoices = all.filter(v => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      return lang.includes('ko') || name.includes('korean') || name.includes('한국어');
    });

    koVoices.sort((a, b) => {
      const aNat = (a.name.includes('Natural') || a.name.includes('Online')) ? 0 : 1;
      const bNat = (b.name.includes('Natural') || b.name.includes('Online')) ? 0 : 1;
      if (aNat !== bNat) return aNat - bNat;
      const rank = (name) => {
        if (name.includes('SunHi')) return 0;
        if (name.includes('Hyunsu')) return 1;
        if (name.includes('InJoon')) return 2;
        return 3;
      };
      return rank(a.name) - rank(b.name);
    });

    availableVoices = koVoices.length ? koVoices : all;
    const sel = document.getElementById('ttsVoiceSelect');
    if (!sel) return;
    sel.innerHTML = '';

    availableVoices.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.voiceURI;
      const isEdgeNat = v.name.includes('Natural') || v.name.includes('Online');
      opt.textContent = `${isEdgeNat ? '🌟 [Edge 자연음성] ' : ''}${v.name}`;
      sel.appendChild(opt);
    });

    const savedUri = localStorage.getItem('maple_edge_voice_uri');
    const best = availableVoices.find(v => v.voiceURI === savedUri)
              || availableVoices.find(v => v.name.includes('SunHi') && v.name.includes('Natural'))
              || availableVoices.find(v => v.name.includes('Hyunsu') && v.name.includes('Natural'))
              || availableVoices.find(v => v.name.includes('InJoon') && v.name.includes('Natural'))
              || availableVoices.find(v => v.name.includes('Natural'))
              || availableVoices[0];

    if (best) {
      sel.value = best.voiceURI;
      if (window.state) window.state.selectedVoiceURI = best.voiceURI;
      localStorage.setItem('maple_edge_voice_uri', best.voiceURI);
      const badge = document.getElementById('ttsVoiceNameBadge');
      if (badge) {
        badge.textContent = best.name.includes('SunHi')
          ? '선히(Natural)'
          : (best.name.includes('Hyunsu') ? '현수(Natural)' : (best.name.includes('InJoon') ? '인준(Natural)' : best.name.slice(0, 12)));
      }
    }
    syncToolbarRateSelectUI();
  };

  populate();
  window.speechSynthesis.onvoiceschanged = populate;
}
window.initEdgeTtsVoices = initEdgeTtsVoices;

function findMatchingSavedVoice(voicesList) {
  const list = voicesList || availableVoices || window.speechSynthesis.getVoices() || [];
  if (!list.length) return null;

  const koOnly = list.filter(v => {
    const lang = (v.lang || '').toLowerCase();
    const name = (v.name || '').toLowerCase();
    return lang.includes('ko') || name.includes('korean') || name.includes('한국어') || name.includes('유나') || name.includes('yuna');
  });

  const sel = document.getElementById('ttsVoiceSelect');
  const targetUri = (sel && sel.value) || (window.state && window.state.selectedVoiceURI) || localStorage.getItem('maple_edge_voice_uri');
  if (targetUri) {
    const matched = koOnly.find(v => v.voiceURI === targetUri);
    if (matched) return matched;
  }

  return koOnly.find(v => v.name.includes('SunHi') && v.name.includes('Natural'))
      || koOnly.find(v => v.name.includes('Hyunsu') && v.name.includes('Natural'))
      || koOnly.find(v => v.name.includes('InJoon') && v.name.includes('Natural'))
      || koOnly.find(v => v.name.includes('Natural'))
      || koOnly[0]
      || null; // 한국어 보이스가 없으면 억지로 영어 보이스를 넣지 않고 null 반환(브라우저 기본 ko-KR 엔진 작동)
}
window.findMatchingSavedVoice = findMatchingSavedVoice;

function onTtsVoiceChange() {
  const sel = document.getElementById('ttsVoiceSelect');
  if (!sel) return;
  const uri = sel.value;
  if (window.state) window.state.selectedVoiceURI = uri;
  localStorage.setItem('maple_edge_voice_uri', uri);
  const v = findMatchingSavedVoice();
  const badge = document.getElementById('ttsVoiceNameBadge');
  if (badge && v) {
    badge.textContent = v.name.includes('SunHi')
      ? '선히(Natural)'
      : (v.name.includes('Hyunsu') ? '현수(Natural)' : (v.name.includes('InJoon') ? '인준(Natural)' : v.name.slice(0, 12)));
  }
}
window.onTtsVoiceChange = onTtsVoiceChange;

// ★ 스마트폰 TTS 차단 해결 핵심: 첫 번째 문장은 setTimeout 없이 사용자 터치 즉시 동기 발화!
function speakSentenceQueue(queueItems, onComplete) {
  if (!('speechSynthesis' in window) || !queueItems || !queueItems.length) {
    if (onComplete) onComplete();
    return;
  }
  clearAllChunkTimers();
  window._activeSpeechUtterances = [];
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
  } catch (e) {}
  isContinuousReading = true;

  const defaultPause = Number(ttsEngineConfig.basePauseMs ?? 120);

  const expandedQueue = [];
  queueItems.forEach(item => {
    const refined = refineForEdgeNaturalSpeech(item.text);
    if (!refined) return;

    if (item.singleUtterance) {
      const cleanOne = refined
        .replace(/\s*@@LINE_BREAK@@\s*/g, '. ')
        .replace(/,\s*\./g, '. ')
        .replace(/\.\s*,/g, '. ')
        .replace(/\.\s*\./g, '. ')
        .trim();
      if (cleanOne) {
        expandedQueue.push({
          text: /[\.!\?]$/.test(cleanOne) ? cleanOne : (cleanOne + '.'),
          el: item.el || null,
          isFirstLine: true,
          pauseAfter: (typeof item.pauseAfter === 'number') ? item.pauseAfter : defaultPause
        });
      }
      return;
    }

    const lines = refined
      .split(/\s*@@LINE_BREAK@@\s*/)
      .map(s => s.replace(/^[,\.\s]+|[,\s]+$/g, '').trim())
      .filter(Boolean);

    lines.forEach((lineTxt, lIdx) => {
      expandedQueue.push({
        text: /[\.!\?]$/.test(lineTxt) ? lineTxt : (lineTxt + '.'),
        el: item.el || null,
        isFirstLine: lIdx === 0,
        pauseAfter: (typeof item.pauseAfter === 'number') ? Math.max(item.pauseAfter, 220) : Math.max(defaultPause, 220)
      });
    });
  });

  if (!expandedQueue.length) {
    if (onComplete) onComplete();
    return;
  }

  let idx = 0;

  const speakNext = () => {
    if (!isContinuousReading || idx >= expandedQueue.length) {
      window._activeSpeechUtterances = [];
      document.querySelectorAll('.tts-reading-row').forEach(x => x.classList.remove('tts-reading-row'));
      if (onComplete) onComplete();
      return;
    }

    const item = expandedQueue[idx++];
    if (item.isFirstLine) {
      document.querySelectorAll('.tts-reading-row').forEach(x => x.classList.remove('tts-reading-row'));
      if (item.el) {
        item.el.classList.add('tts-reading-row');
        item.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    const u = new SpeechSynthesisUtterance(item.text);
    window._activeSpeechUtterances.push(u);

    u.lang = 'ko-KR';
    u.rate = Number(ttsEngineConfig.rate) || (window.state && Number(window.state.ttsRate)) || 1.05;
    u.pitch = Number(ttsEngineConfig.pitch) || 1.0;

    const voice = findMatchingSavedVoice();
    if (voice) u.voice = voice;

    u.onend = () => {
      if (!isContinuousReading) return;
      const tid = setTimeout(speakNext, Math.max(40, item.pauseAfter));
      activeChunkTimers.push(tid);
    };
    u.onerror = () => {
      if (!isContinuousReading) return;
      const tid = setTimeout(speakNext, 80);
      activeChunkTimers.push(tid);
    };

    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(u);
    } catch (err) {}
  };

  // 모바일 오디오 차단을 피하기 위해 첫 문장은 setTimeout 없이 즉시 실행!
  speakNext();
}
window.speakSentenceQueue = speakSentenceQueue;

function speakPalacePinWithStory(answerStr, storyStr, onComplete) {
  const parts = [];
  if (answerStr && String(answerStr).trim()) parts.push(String(answerStr).trim());
  if (storyStr && String(storyStr).trim()) parts.push(String(storyStr).trim());
  if (!parts.length) {
    if (onComplete) onComplete();
    return;
  }
  const combined = parts.join('. ');
  speakSentenceQueue([{
    text: combined,
    el: null,
    singleUtterance: true,
    pauseAfter: Number(ttsEngineConfig.basePauseMs ?? 120)
  }], onComplete);
}
window.speakPalacePinWithStory = speakPalacePinWithStory;

function collectStepReadableUnits() {
  const box = document.getElementById('subnoteBox');
  if (!box) return [];
  const rawNodes = Array.from(box.querySelectorAll('div, p, li, tr, svg'));
  const units = [];
  const basePause = Number(ttsEngineConfig.basePauseMs ?? 120);

  rawNodes.forEach(el => {
    if (el.closest('.cloze-diagram-mask, .cloze-diagram-toolbar')) return;
    if (el.tagName !== 'TR' && el.closest('tr')) return;
    if (el.tagName === 'DIV' && el.querySelector('div:not(.cloze-diagram-mask):not(.cloze-diagram-toolbar), table, p, ul, ol')) return;

    const txt = extractElementSpeechText(el);
    if (txt && txt.length >= 2) {
      units.push({ el, text: txt, pauseAfter: basePause });
    }
  });
  return units;
}

function resetStepReaderCursor() {
  currentStepReadIndex = -1;
  stepReadableUnits = [];
  document.querySelectorAll('.tts-reading-row').forEach(x => x.classList.remove('tts-reading-row'));
}
window.resetStepReaderCursor = resetStepReaderCursor;

function speakFullSubnote() {
  stepReadableUnits = collectStepReadableUnits();
  if (!stepReadableUnits.length) return;
  speakSentenceQueue(stepReadableUnits);
}
window.speakFullSubnote = speakFullSubnote;

function speakNextStepLine() {
  if (!stepReadableUnits.length) stepReadableUnits = collectStepReadableUnits();
  if (!stepReadableUnits.length) return;
  currentStepReadIndex = (currentStepReadIndex + 1) % stepReadableUnits.length;
  const target = stepReadableUnits[currentStepReadIndex];
  speakSentenceQueue([target]);
}
window.speakNextStepLine = speakNextStepLine;

function speakPrevStepLine() {
  if (!stepReadableUnits.length) stepReadableUnits = collectStepReadableUnits();
  if (!stepReadableUnits.length) return;
  currentStepReadIndex = (currentStepReadIndex - 1 + stepReadableUnits.length) % stepReadableUnits.length;
  const target = stepReadableUnits[currentStepReadIndex];
  speakSentenceQueue([target]);
}
window.speakPrevStepLine = speakPrevStepLine;

function stopAllSpeech() {
  isContinuousReading = false;
  clearAllChunkTimers();
  window._activeSpeechUtterances = [];
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  document.querySelectorAll('.tts-reading-row').forEach(x => x.classList.remove('tts-reading-row'));
}
window.stopAllSpeech = stopAllSpeech;

/* ============================================================================
   ★ 발음 사전 검색·재수정 매니저 UI ★
   ============================================================================ */
function ensurePronunManagerUI() {
  const modal = document.getElementById('pronunModal');
  const ta = document.getElementById('pronunDictTextarea');
  if (!modal || !ta || document.getElementById('pronunInteractivePanel')) return;

  const panel = document.createElement('div');
  panel.id = 'pronunInteractivePanel';
  panel.style.cssText = 'display:flex; flex-direction:column; gap:10px; margin-bottom:12px;';

  panel.innerHTML = `
    <div style="background:linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%); border:2px solid #0d9488; border-radius:12px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
      <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:200px;">
        <span style="font-size:12.5px; font-weight:900; color:#0f766e;">🏃 읽는 속도: <b id="lblTtsCfgRate" style="color:#0d9488;">1.05x</b></span>
        <input id="rngTtsCfgRate" type="range" min="0.75" max="1.60" step="0.05" value="1.05" style="flex:1;" oninput="onTtsMasterConfigInput()">
      </div>
      <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:200px;">
        <span style="font-size:12.5px; font-weight:900; color:#0f766e;">⏸️ 줄 간 딜레이: <b id="lblTtsCfgBasePause" style="color:#0d9488;">120ms</b></span>
        <input id="rngTtsCfgBasePause" type="range" min="0" max="500" step="20" value="120" style="flex:1;" oninput="onTtsMasterConfigInput()">
      </div>
      <button type="button" class="btn-gold" style="height:26px; padding:2px 8px; font-size:11px;" onclick="resetTtsEngineConfigToDefault()">기본값 복원</button>
    </div>

    <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:10px 12px; display:flex; flex-direction:column; gap:8px;">
      <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
        <input id="pronunEditKeyInput" type="text" placeholder="원래 단어/기호 (예: 1. 또는 KCL)" class="ctrl-input" style="width:175px; font-weight:800;">
        <span style="font-weight:900; color:#d97706;">➔</span>
        <input id="pronunEditValInput" type="text" placeholder="읽을 발음 (예: 일번)" class="ctrl-input" style="flex:1; min-width:190px; font-weight:800; color:#0f766e;">
        <button type="button" class="btn-gold teal-active" onclick="upsertSinglePronunEntry()">➕ 등록 / 재수정</button>
        <button type="button" class="btn-gold" onclick="testSpeakSinglePronunEntry()">🔊 테스트 듣기</button>
      </div>

      <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap; font-size:12px;">
        <span style="font-weight:800; color:#475569;">⏱️ 뒤에 쉬기 추가:</span>
        <button type="button" class="btn-gold" style="height:26px; padding:2px 8px; font-size:11.5px;" onclick="appendPauseTagToPronunInput('[0.1초]')">+0.1초 쉬기</button>
        <button type="button" class="btn-gold" style="height:26px; padding:2px 8px; font-size:11.5px;" onclick="appendPauseTagToPronunInput('[0.2초]')">+0.2초 쉬기</button>
        <button type="button" class="btn-gold" style="height:26px; padding:2px 8px; font-size:11.5px;" onclick="appendPauseTagToPronunInput('[0.3초]')">+0.3초 쉬기</button>
        <button type="button" class="btn-gold" style="height:26px; padding:2px 8px; font-size:11.5px;" onclick="appendPauseTagToPronunInput('[0.4초]')">+0.4초 쉬기</button>
        <button type="button" class="btn-gold" style="height:26px; padding:2px 8px; font-size:11.5px;" onclick="appendPauseTagToPronunInput('[0.5초]')">+0.5초 쉬기</button>
        <input id="pronunPreviewSampleInput" type="text" value="(1) 공기팽창식 1) 개념도 : 화재 → 온도상승 → 감열실 공기팽창" class="ctrl-input" style="margin-left:auto; width:260px; height:26px; font-size:11.5px;" title="테스트 듣기용 샘플 문장">
      </div>
    </div>

    <div style="display:flex; gap:6px; align-items:center; justify-content:space-between; flex-wrap:wrap;">
      <div style="display:flex; gap:6px; align-items:center; flex:1;">
        <input id="pronunSearchInput" type="text" placeholder="🔍 등록된 발음 검색 (예: 1. , 일번, R1, ℃ ...)" class="ctrl-input" style="flex:1; min-width:180px;" oninput="renderPronunInteractiveList()">
        <button type="button" id="btnPronunFilterAll" class="btn-gold active" onclick="setPronunFilterMode('all')">전체 보기</button>
        <button type="button" id="btnPronunFilterCustom" class="btn-gold" onclick="setPronunFilterMode('custom')">⭐ 내가 수정한 항목만</button>
      </div>
      <button type="button" class="btn-gold" onclick="toggleRawPronunTextarea()" style="font-size:11.5px;">📝 전체 텍스트 직접편집 펼치기/접기</button>
    </div>

    <div id="pronunInteractiveList" style="max-height:220px; overflow-y:auto; border:1.5px solid #cbd5e1; border-radius:10px; background:#ffffff; padding:6px; display:flex; flex-direction:column; gap:4px;"></div>
  `;

  ta.parentNode.insertBefore(panel, ta);
  ta.style.display = 'none';
  ta.rows = 7;
}

function syncTtsMasterConfigUI() {
  const rRate = document.getElementById('rngTtsCfgRate');
  const lRate = document.getElementById('lblTtsCfgRate');
  const rBase = document.getElementById('rngTtsCfgBasePause');
  const lBase = document.getElementById('lblTtsCfgBasePause');

  if (rRate) rRate.value = ttsEngineConfig.rate;
  if (lRate) lRate.textContent = `${Number(ttsEngineConfig.rate).toFixed(2)}x`;
  if (rBase) rBase.value = ttsEngineConfig.basePauseMs;
  if (lBase) lBase.textContent = `${ttsEngineConfig.basePauseMs}ms`;
}

function onTtsMasterConfigInput() {
  const rRate = document.getElementById('rngTtsCfgRate');
  const rBase = document.getElementById('rngTtsCfgBasePause');

  if (rRate) ttsEngineConfig.rate = parseFloat(rRate.value) || 1.05;
  if (rBase) ttsEngineConfig.basePauseMs = parseInt(rBase.value, 10) || 0;

  saveTtsEngineConfig();
  syncTtsMasterConfigUI();
}
window.onTtsMasterConfigInput = onTtsMasterConfigInput;

function resetTtsEngineConfigToDefault() {
  ttsEngineConfig = Object.assign({}, DEFAULT_TTS_CONFIG);
  saveTtsEngineConfig();
  syncTtsMasterConfigUI();
}
window.resetTtsEngineConfigToDefault = resetTtsEngineConfigToDefault;

function toggleRawPronunTextarea() {
  const ta = document.getElementById('pronunDictTextarea');
  if (!ta) return;
  const isHidden = ta.style.display === 'none';
  ta.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    ta.value = serializePronunciationDict();
  }
}
window.toggleRawPronunTextarea = toggleRawPronunTextarea;

function setPronunFilterMode(mode) {
  pronunFilterMode = mode;
  document.getElementById('btnPronunFilterAll')?.classList.toggle('active', mode === 'all');
  document.getElementById('btnPronunFilterCustom')?.classList.toggle('active', mode === 'custom');
  renderPronunInteractiveList();
}
window.setPronunFilterMode = setPronunFilterMode;

function appendPauseTagToPronunInput(tagStr) {
  const valIn = document.getElementById('pronunEditValInput');
  if (!valIn) return;
  let cur = valIn.value.replace(/[\[\(]\s*\d+(?:\.\d+)?\s*(?:초|s|ms)\s*[\]\)]/gi, '').trim();
  valIn.value = (cur ? cur + ' ' : '') + tagStr;
  valIn.focus();
}
window.appendPauseTagToPronunInput = appendPauseTagToPronunInput;

function selectPronunItemForEdit(key) {
  const kIn = document.getElementById('pronunEditKeyInput');
  const vIn = document.getElementById('pronunEditValInput');
  const sampleIn = document.getElementById('pronunPreviewSampleInput');
  if (!kIn || !vIn) return;
  kIn.value = key;
  vIn.value = userPronunDict[key] || '';
  if (sampleIn) {
    sampleIn.value = key;
  }
  vIn.focus();
  vIn.select();
}
window.selectPronunItemForEdit = selectPronunItemForEdit;

function upsertSinglePronunEntry() {
  const kIn = document.getElementById('pronunEditKeyInput');
  const vIn = document.getElementById('pronunEditValInput');
  const sampleIn = document.getElementById('pronunPreviewSampleInput');
  if (!kIn || !vIn) return;
  const k = kIn.value.trim();
  const v = vIn.value.trim();
  if (!k || !v) {
    alert('원래 단어와 읽을 발음을 모두 입력해 주세요.');
    return;
  }
  userPronunDict[k] = v;
  if (DEFAULT_PRONUN_DICT[k] !== v) {
    customModifiedKeys.add(k);
  }
  if (sampleIn) {
    sampleIn.value = k;
  }
  savePronunDictToStorage();
  renderPronunInteractiveList();

  speakSentenceQueue([{ text: k, singleUtterance: true, pauseAfter: ttsEngineConfig.basePauseMs }]);
}
window.upsertSinglePronunEntry = upsertSinglePronunEntry;

function deleteSinglePronunEntry(key) {
  if (DEFAULT_PRONUN_DICT[key]) {
    userPronunDict[key] = DEFAULT_PRONUN_DICT[key];
    customModifiedKeys.delete(key);
  } else {
    delete userPronunDict[key];
    customModifiedKeys.delete(key);
  }
  savePronunDictToStorage();
  renderPronunInteractiveList();
}
window.deleteSinglePronunEntry = deleteSinglePronunEntry;

function testSpeakSinglePronunEntry() {
  const kIn = document.getElementById('pronunEditKeyInput');
  const vIn = document.getElementById('pronunEditValInput');
  const sampleIn = document.getElementById('pronunPreviewSampleInput');

  const k = (kIn?.value || '').trim();
  const v = (vIn?.value || '').trim();
  if (k && v) {
    userPronunDict[k] = v;
    if (DEFAULT_PRONUN_DICT[k] !== v) customModifiedKeys.add(k);
    savePronunDictToStorage();
    renderPronunInteractiveList();
  }

  const testPhrase = k || (sampleIn?.value || '').trim() || '(1) 공기팽창식 1) 개념도 : 화재 → 온도상승 → 감열실 공기팽창';
  if (sampleIn && k) sampleIn.value = k;
  speakSentenceQueue([{ text: testPhrase, singleUtterance: true, pauseAfter: ttsEngineConfig.basePauseMs }]);
}
window.testSpeakSinglePronunEntry = testSpeakSinglePronunEntry;

function renderPronunInteractiveList() {
  const listEl = document.getElementById('pronunInteractiveList');
  if (!listEl) return;
  const q = (document.getElementById('pronunSearchInput')?.value || '').trim().toLowerCase();

  const entries = Object.entries(userPronunDict);
  entries.sort(([kA], [kB]) => {
    const cA = customModifiedKeys.has(kA) ? 0 : 1;
    const cB = customModifiedKeys.has(kB) ? 0 : 1;
    if (cA !== cB) return cA - cB;
    return 0;
  });

  const filtered = entries.filter(([k, v]) => {
    if (pronunFilterMode === 'custom' && !customModifiedKeys.has(k)) return false;
    if (!q) return true;
    return k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q);
  });

  if (!filtered.length) {
    listEl.innerHTML = `<div style="padding:18px; text-align:center; color:#64748b; font-size:13px; font-weight:700;">검색 조건에 맞는 발음 항목이 없습니다. 상단 입력창에서 새로 추가해 보세요!</div>`;
    return;
  }

  listEl.innerHTML = '';
  filtered.forEach(([k, v]) => {
    const isCustom = customModifiedKeys.has(k);
    const row = document.createElement('div');
    row.style.cssText = `
      display:flex; align-items:center; justify-content:space-between; gap:8px;
      padding:6px 10px; border-radius:8px; cursor:pointer;
      background:${isCustom ? '#fef3c7' : '#f8fafc'};
      border:1px solid ${isCustom ? '#f59e0b' : '#e2e8f0'};
      font-size:13px;
    `;
    row.onclick = () => selectPronunItemForEdit(k);

    const left = document.createElement('div');
    left.style.cssText = 'display:flex; align-items:center; gap:8px; flex:1; min-width:0;';
    left.innerHTML = `
      ${isCustom ? '<span style="background:#d97706; color:#fff; font-size:10.5px; font-weight:900; padding:1px 6px; border-radius:99px;">내 수정</span>' : '<span style="background:#e2e8f0; color:#475569; font-size:10.5px; font-weight:800; padding:1px 6px; border-radius:99px;">기본</span>'}
      <b style="color:#0f172a; min-width:70px;">${k}</b>
      <span style="color:#94a3b8;">➔</span>
      <span style="color:#0f766e; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${v}</span>
    `;

    const right = document.createElement('div');
    right.style.cssText = 'display:flex; gap:4px; flex-shrink:0;';

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'btn-gold';
    playBtn.style.cssText = 'height:24px; padding:2px 7px; font-size:11px;';
    playBtn.textContent = '🔊 듣기';
    playBtn.onclick = (e) => {
      e.stopPropagation();
      speakSentenceQueue([{ text: k, singleUtterance: true, pauseAfter: ttsEngineConfig.basePauseMs }]);
    };

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn-gold';
    editBtn.style.cssText = 'height:24px; padding:2px 7px; font-size:11px;';
    editBtn.textContent = '✏️ 재수정';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      selectPronunItemForEdit(k);
    };

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn-gold';
    delBtn.style.cssText = 'height:24px; padding:2px 7px; font-size:11px;';
    delBtn.textContent = DEFAULT_PRONUN_DICT[k] ? '↩️ 기본값' : '🗑️ 삭제';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteSinglePronunEntry(k);
    };

    right.appendChild(playBtn);
    right.appendChild(editBtn);
    right.appendChild(delBtn);

    row.appendChild(left);
    row.appendChild(right);
    listEl.appendChild(row);
  });
}

function openPronunDictModal() {
  loadPronunciationDictionary();
  ensurePronunManagerUI();
  syncTtsMasterConfigUI();
  const ta = document.getElementById('pronunDictTextarea');
  if (ta) ta.value = serializePronunciationDict();
  renderPronunInteractiveList();
  document.getElementById('pronunModal')?.classList.add('open');
}
window.openPronunDictModal = openPronunDictModal;

function savePronunDictFromModal() {
  saveTtsEngineConfig();

  const kIn = document.getElementById('pronunEditKeyInput');
  const vIn = document.getElementById('pronunEditValInput');
  const pendingK = (kIn?.value || '').trim();
  const pendingV = (vIn?.value || '').trim();
  if (pendingK && pendingV) {
    userPronunDict[pendingK] = pendingV;
    if (DEFAULT_PRONUN_DICT[pendingK] !== pendingV) {
      customModifiedKeys.add(pendingK);
    }
    kIn.value = '';
    vIn.value = '';
  }

  const ta = document.getElementById('pronunDictTextarea');
  if (ta && ta.style.display !== 'none') {
    localStorage.setItem('maple_pronun_dict_v2', ta.value);
    parsePronunciationText(ta.value);
  } else {
    savePronunDictToStorage();
  }
  renderPronunInteractiveList();
  document.getElementById('pronunModal')?.classList.remove('open');
  alert('✅ 발음사전 및 속도 설정이 저장되었습니다!');
}
window.savePronunDictFromModal = savePronunDictFromModal;

/* ============================================================================
   ★ [⏬ 여기부터 끝까지 읽기] & 5번 크리스탈 아크릴 리모컨 + 모바일 반응형 완벽 패치 ★
   ============================================================================ */
function injectPremiumRemoteStyleAndSyncMenus() {
  const oldSt = document.getElementById('sgPremiumRemoteStyle');
  if (oldSt) oldSt.remove();

  const st = document.createElement('style');
  st.id = 'sgPremiumRemoteStyle';
  st.textContent = `
    .sg-floating-remote {
      width: 438px !important;
      background: linear-gradient(155deg,
        rgba(255, 255, 255, 0.62) 0%,
        rgba(240, 253, 250, 0.46) 48%,
        rgba(254, 249, 195, 0.38) 100%) !important;
      backdrop-filter: blur(16px) saturate(145%) !important;
      -webkit-backdrop-filter: blur(16px) saturate(145%) !important;
      border: 2.5px solid rgba(255, 251, 235, 0.95) !important;
      border-radius: 30px !important;
      padding: 10px 10px 12px 10px !important;
      box-shadow:
        0 0 0 2px rgba(251, 191, 36, 0.55),
        0 0 22px rgba(253, 224, 71, 0.42),
        0 20px 45px rgba(15, 23, 42, 0.22),
        inset 0 2px 6px rgba(255, 255, 255, 0.95),
        inset 0 -2px 10px rgba(45, 212, 191, 0.22) !important;
      color: #0f172a !important;
    }

    /* 📱 스마트폰(모바일) 화면 최적화 및 궁전 그림 0px 실종 버그 완벽 해결 */
    @media (max-width: 820px) {
      .top-master-header {
        position: relative !important;
        padding: 8px 10px !important;
      }
      .header-row-1, .header-row-2 {
        flex-wrap: wrap !important;
        gap: 6px !important;
      }
      .topic-nav-group {
        max-width: 100% !important;
        width: 100% !important;
        overflow-x: auto !important;
      }
      .stage-ctrl-group {
        border-left: none !important;
        padding-left: 0 !important;
        width: 100% !important;
        overflow-x: auto !important;
        padding-bottom: 2px !important;
      }
      .step-tabs {
        width: 100% !important;
        overflow-x: auto !important;
        flex-wrap: nowrap !important;
        padding-bottom: 4px !important;
      }
      .master-study-toolbar {
        position: relative !important;
        top: 0 !important;
        width: calc(100% - 16px) !important;
        padding: 8px 10px !important;
      }
      /* 기억의 궁전: 좌우 분할을 상하 분할로 바꾸어 그림이 100% 선명하게 나오도록 보장 */
      .memory-palace-stage, .anki-battle-stage {
        width: calc(100% - 16px) !important;
        height: auto !important;
        max-height: none !important;
        min-height: 540px !important;
      }
      .palace-body-split {
        flex-direction: column !important;
        padding: 8px !important;
        gap: 10px !important;
      }
      .palace-viewport {
        width: 100% !important;
        min-height: 230px !important;
        aspect-ratio: 16 / 9 !important;
        flex: none !important;
      }
      .palace-canvas-mover {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
      }
      .palace-side-console {
        width: 100% !important;
        max-height: none !important;
      }
      .stage-arena-center {
        flex-direction: column !important;
        padding: 8px !important;
      }
      .hero-stand-wrap {
        display: none !important;
      }
      .anki-center-console {
        flex-direction: column !important;
        width: 100% !important;
      }
      .subnote-workspace {
        flex-direction: column !important;
        padding: 0 8px !important;
        margin-bottom: 90px !important;
      }
      .outline-sidebar {
        width: 100% !important;
        position: relative !important;
        top: 0 !important;
      }
      .subnote-paper-container {
        width: 100% !important;
        padding: 14px 12px !important;
        overflow-x: auto !important;
      }
      .sg-floating-remote:not(.minimized) {
        width: calc(100vw - 16px) !important;
        max-width: 420px !important;
        right: 8px !important;
        left: 8px !important;
        bottom: 8px !important;
        margin: 0 auto !important;
        border-radius: 22px !important;
        padding: 8px !important;
      }
    }
  `;
  document.head.appendChild(st);

  // 모바일 화면으로 처음 접속했을 때는 화면을 가리지 않게 리모컨을 기본 최소화(구슬) 상태로 시작
  if (window.innerWidth <= 820) {
    const rem = document.getElementById('sgFloatingRemote');
    if (rem && !rem.dataset.mobileAutoMinDone) {
      rem.dataset.mobileAutoMinDone = '1';
      rem.classList.add('minimized');
    }
  }

  const btnSpeakSel = document.getElementById('btnSpeakSelected');
  if (btnSpeakSel && !document.getElementById('btnSpeakFromHere')) {
    const btn = document.createElement('button');
    btn.id = 'btnSpeakFromHere';
    btn.className = 'btn-gold';
    btn.title = '선택한 영역(또는 클릭한 위치)부터 서브노트 맨 끝까지 연속 낭독합니다 (단축키 F10)';
    btn.innerHTML = `⏬ 여기부터 끝까지`;
    btn.onclick = () => speakFromSelectedOrPickedToEnd();
    btnSpeakSel.parentNode.insertBefore(btn, btnSpeakSel.nextSibling);
  }

  const remHintBtn = document.getElementById('remBtnHintToggle');
  if (remHintBtn) {
    const rowGrid = remHintBtn.parentElement;
    if (rowGrid) {
      rowGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
      if (!document.getElementById('remBtnPronunOpen')) {
        const pBtn = document.createElement('button');
        pBtn.id = 'remBtnPronunOpen';
        pBtn.className = 'remote-btn';
        pBtn.title = 'Edge TTS 발음사전 및 속도/딜레이 설정 열기';
        pBtn.innerHTML = `🗣️ 발음사전`;
        pBtn.onclick = () => openPronunDictModal();
        rowGrid.appendChild(pBtn);
      }
    }
  }

  const remTtsGrids = document.querySelectorAll('#sgFloatingRemote .remote-tts-grid');
  if (remTtsGrids.length >= 2 && !document.getElementById('remBtnSpeakFromHere')) {
    const ttsRow = remTtsGrids[0];
    const areaRow = remTtsGrids[1];

    ttsRow.style.gridTemplateColumns = 'repeat(5, 1fr)';
    if (ttsRow.children[0]) ttsRow.children[0].innerHTML = '🔊 전체';

    const rFromBtn = document.createElement('button');
    rFromBtn.id = 'remBtnSpeakFromHere';
    rFromBtn.className = 'remote-btn';
    rFromBtn.title = '지정한 위치(또는 클릭한 줄)부터 끝까지 읽기 (단축키 F10)';
    rFromBtn.innerHTML = `⏬ 여기부터`;
    rFromBtn.onclick = () => speakFromSelectedOrPickedToEnd();
    ttsRow.insertBefore(rFromBtn, ttsRow.children[1] || null);

    if (areaRow.children[1]) {
      areaRow.children[1].id = 'remBtnAreaSpeak';
      areaRow.children[1].innerHTML = `▶️ 선택읽기(<b id="remAreaCount">${(typeof sgSelectedElements !== 'undefined' ? sgSelectedElements.length : 0)}</b>)`;
    }
    if (areaRow.children[3]) {
      areaRow.children[3].innerHTML = `✖ 해제`;
    }
  }

  const box = document.getElementById('subnoteBox');
  if (box && !box.dataset.fromHereBound) {
    box.dataset.fromHereBound = '1';
    box.addEventListener('click', (e) => {
      if (!pickStartLineOnceMode) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      pickStartLineOnceMode = false;
      document.getElementById('btnSpeakFromHere')?.classList.remove('teal-active');
      document.getElementById('remBtnSpeakFromHere')?.classList.remove('teal-on');

      startReadingSubnoteFromElement(e.target);
    }, true);
  }

  if (!window._f10SpeakFromHereBound) {
    window._f10SpeakFromHereBound = true;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F10') {
        e.preventDefault();
        speakFromSelectedOrPickedToEnd();
      }
    });
  }

  enableMobileTouchAndAudioBridge();
}

function enableMobileTouchAndAudioBridge() {
  if (window._mobileBridgeBound) return;
  window._mobileBridgeBound = true;

  // 1) 스마트폰 첫 터치 시 모바일 브라우저의 TTS 잠금(Autoplay Lock) 해제
  const unlockAudio = () => {
    if (mobileAudioUnlocked || !('speechSynthesis' in window)) return;
    mobileAudioUnlocked = true;
    try {
      window.speechSynthesis.getVoices();
      const silent = new SpeechSynthesisUtterance('');
      silent.volume = 0;
      silent.lang = 'ko-KR';
      window.speechSynthesis.speak(silent);
    } catch (e) {}
  };
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
  window.addEventListener('click', unlockAudio, { once: true, passive: true });

  // 2) 스마트폰 손가락 터치 드래그를 마우스 드래그(리모컨 이동, 궁전 핀 이동)로 자동 변환
  const mapTouchToMouse = (touchType, mouseType) => {
    window.addEventListener(touchType, (e) => {
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      const target = e.target;
      if (!target || !target.closest) return;
      if (target.closest('button, select, input, textarea, a')) return;

      const isDraggable = target.closest('#remoteDragHeader') || target.closest('#remoteMiniOrb') || target.closest('.palace-pin');
      if (!isDraggable) return;

      const simulated = new MouseEvent(mouseType, {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: t.clientX,
        clientY: t.clientY
      });
      target.dispatchEvent(simulated);
    }, { passive: true });
  };

  mapTouchToMouse('touchstart', 'mousedown');
  mapTouchToMouse('touchmove', 'mousemove');
  mapTouchToMouse('touchend', 'mouseup');
}

function injectSpeakFromHereButtonUI() {
  injectPremiumRemoteStyleAndSyncMenus();
}

function findUnitIndexContainingElement(units, targetEl) {
  if (!targetEl || !units.length) return -1;
  for (let i = 0; i < units.length; i++) {
    const uEl = units[i].el;
    if (uEl === targetEl || uEl.contains(targetEl) || targetEl.contains(uEl)) {
      return i;
    }
  }
  const tr = targetEl.closest ? targetEl.closest('tr') : null;
  if (tr) {
    for (let i = 0; i < units.length; i++) {
      if (units[i].el === tr || tr.contains(units[i].el)) return i;
    }
  }
  for (let i = 0; i < units.length; i++) {
    if (targetEl.compareDocumentPosition && (targetEl.compareDocumentPosition(units[i].el) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      return i;
    }
  }
  return 0;
}

function startReadingSubnoteFromElement(startEl) {
  stepReadableUnits = collectStepReadableUnits();
  if (!stepReadableUnits.length) return;

  const startIdx = findUnitIndexContainingElement(stepReadableUnits, startEl);
  const validIdx = Math.max(0, startIdx);
  currentStepReadIndex = validIdx;

  const slicedQueue = stepReadableUnits.slice(validIdx);
  if (!slicedQueue.length) return;

  const runRead = () => {
    speakSentenceQueue(slicedQueue, () => {
      if (typeof sgAreaLoopOn !== 'undefined' && sgAreaLoopOn && isContinuousReading) {
        runRead();
      }
    });
  };
  runRead();
}

function speakFromSelectedOrPickedToEnd() {
  if (typeof sgSelectedElements !== 'undefined' && sgSelectedElements.length > 0) {
    const firstPicked = sgSelectedElements[0];

    if (firstPicked.classList && firstPicked.classList.contains('palace-pin') && typeof currentPalaceObj !== 'undefined' && currentPalaceObj?.pins) {
      const startPinIdx = Number(firstPicked.dataset.pinIdx) || 0;
      const pins = currentPalaceObj.pins;
      const pQueue = [];
      for (let i = startPinIdx; i < pins.length; i++) {
        const p = pins[i];
        const pinEl = document.querySelector(`.palace-pin[data-pin-idx="${i}"]`);
        const combined = [p.answer, p.storyHint].filter(Boolean).join('. ');
        pQueue.push({ text: combined, el: pinEl, singleUtterance: true, pauseAfter: Number(ttsEngineConfig.basePauseMs ?? 120) });
      }
      speakSentenceQueue(pQueue);
      return;
    }

    startReadingSubnoteFromElement(firstPicked);
    return;
  }

  if (currentStepReadIndex >= 0 && stepReadableUnits.length > 0 && stepReadableUnits[currentStepReadIndex]) {
    startReadingSubnoteFromElement(stepReadableUnits[currentStepReadIndex].el);
    return;
  }

  pickStartLineOnceMode = !pickStartLineOnceMode;
  document.getElementById('btnSpeakFromHere')?.classList.toggle('teal-active', pickStartLineOnceMode);
  document.getElementById('remBtnSpeakFromHere')?.classList.toggle('teal-on', pickStartLineOnceMode);

  if (pickStartLineOnceMode) {
    const statusEl = document.getElementById('ttsStatusText');
    if (statusEl) {
      statusEl.textContent = '⏬ [여기부터 끝까지] 읽기 시작할 서브노트 줄이나 표 칸을 마우스로 클릭하세요!';
    } else {
      alert('⏬ 읽기를 시작할 서브노트 문단이나 표 칸을 터치하시면, 그 위치부터 맨 끝까지 읽어 내려갑니다!');
    }
  }
}
window.speakFromSelectedOrPickedToEnd = speakFromSelectedOrPickedToEnd;

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', injectSpeakFromHereButtonUI);
} else {
  injectSpeakFromHereButtonUI();
}
