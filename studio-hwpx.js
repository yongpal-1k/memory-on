/* =========================================================================
   메모리온 (MemoryOn) — 손글씨→노트 변환 스튜디오 & HWPX 파서 모듈 (studio-hwpx.js)
   ========================================================================= */

let studioPhotos = [];
let activePhotoIndex = 0;
let studioCroppedFigures = {};
let studioFigureMeta = {};
let activeRecropFigNum = 1;
let isStudioDragging = false;
let cropStartX = 0;
let cropStartY = 0;
let scanThreshold = 192;

const AI_UNIVERSAL_BATCH_PROMPT = `첨부한 손글씨 서브노트 사진들을 읽고, 아래 규격의 '단 하나의 통합 코드블록'으로 정확히 변환해줘 (새 채팅창 일괄 자동크롭 고정 규격):

1. 첫 줄에는 우측 하단 등에 적힌 과목명을 '[과목: 소방전기]' 형태로 적을 것.
2. 여러 장의 사진이더라도 나누지 말고 하나의 코드블록 안에 '■ 단원명'으로 각 단원을 연달아 작성할 것. (앞뒤 페이지로 이어진 단원은 하나로 합칠 것)
3. 개념도·그래프·회로도가 들어갈 자리에는 몇 번 사진의 어느 위치에 그림이 있는지 좌측(L%), 상단(T%), 우측(R%), 하단(B%) 비율 좌표를 계산하여 '[그림1: 사진1, 10, 15, 88, 40]' 형태로 단독 줄 또는 표 칸 안에 정확히 표시할 것.
4. 손글씨에서 동그라미(O) 쳐진 글자나 핵심 암기 키워드는 '{{키워드}}' 형태로 감싸서 빨간색으로 지정할 것. (같은 단어라도 첫 등장 시에만 '{{}}'로 감쌀 것)
5. 좌우 비교표 형태가 나오면 '[비교표]' 라고 적은 뒤, 첫 줄에는 머리글(예: 구분 | PTC | NTC | CTR)을 적고 그 아래 행을 '|' 기호로 구분하며, 표가 끝나면 반드시 '[/비교표]' 로 닫을 것. (칸 안 줄바꿈은 '<br>' 사용)
6. 각 단원의 맨 아래에는 '[표]' 라고 적은 뒤, 그림 속 핵심어 + 본문의 '{{}}' 키워드 + 두문자 조합을 순서대로 '1 | 키워드' 형태로 나열할 것.`;

function copyAiPromptToClipboard() {
  navigator.clipboard.writeText(AI_UNIVERSAL_BATCH_PROMPT).then(() => {
    alert('✅ [새 채팅창용 일괄 AI 명령문]이 복사되었습니다!\n\n새 채팅창에 손글씨 사진 여러 장을 올리고 Ctrl+V로 붙여넣으시면 모든 단원과 그림 좌표가 한 번에 추출됩니다.');
  });
}

function loadBatch8PhotosSample() {
  const sampleBatch = `[과목: 소방전기]

■ 앙페르(암페어)의 오른나사 법칙 (Ampere's law)

1. 개념도
[그림1: 사진1, 8, 12, 88, 36]

2. 특성
(1) {{전}}류가 나사의 {{진행}} 방향 일때 {{자}}계는 나사의 {{회}}전 방향
(2) 전류가 나사의 회전 방향 일때 자계는 나사의 진행 방향

3. 적용
(1) {{모}}터
(2) {{변}}압기
(3) {{클}}램프 온 메터

[표]
1 | 전류
2 | 자계
3 | 나사
4 | 진행
5 | 회전
6 | 모변클

■ 렌츠의 법칙

1. {{개}}념 (자기장은 변화를 싫어함)
{{유}}도기전력과 유도{{전}}류는 {{자}}기장의 {{변}}화를 {{방}}해하려는 {{방}}향으로 {{발}}생

2. 개념도
[그림2: 사진7, 5, 10, 95, 88]

3. {{관}}계식
유도기전력  e = -N (dΦ / dt)

4. {{적}}용
(1) {{전}}기 {{제}}동장치
(2) {{금}}속 {{탐}}지기
(3) {{유}}{{도}}열

[표]
1 | 개개관적
2 | 유전자 변방방발
3 | 가까이 (척력 N-N) / 멀리 (인력 S-N)
4 | e = -N(dΦ/dt)
5 | 전제 / 금탐 / 유도열

■ 쿨롱의 법칙

1. 개념도
[그림3: 사진4, 6, 12, 92, 32]

2. 개념
(1) {{2}}개의 {{전}}하, {{자}}하 간에 {{생}}기는 {{힘}}은 전하, 자하 크기의 곱에 비례, 그 거리의 제곱에 반비례
(2) 힘의 {{방}}향
  1) {{이}}종의 전하, 자하 : 흡인력
  2) {{동}}종의 전하, 자하 : 반발력

3. 관계식
(1) 전하 : F = (1 / 4πε) · (Q_1·Q_2 / r^2) [N]
(2) 자하 : F = (1 / 4πμ) · (m_1·m_2 / r^2) [N]

4. 적용
(1) 정전기 방지장치
(2) 전자기파 차폐장치
(3) 고전압 장비의 성능 최적화

[표]
1 | 전하(Q_1, Q_2) / 자하(m_1, m_2)
2 | 2전자 생힘 (곱에 비례, 거리 제곱 반비례)
3 | 방이동 (이종: 흡인력, 동종: 반발력)
4 | F = (1/4πε)·(Q_1·Q_2/r^2)
5 | F = (1/4πμ)·(m_1·m_2/r^2)
6 | 정전기 방지 / 전자기파 차폐 / 고전압 장비

■ 광전효과 [96/10]

1. 개념
(1) {{금}}속표면이 {{문}}턱진동수보다 큰 진동수의 {{빛}}을 받으면 {{전}}자가 {{튀}}어 나오는 {{현}}상
(2) {{아}}인슈타인이 빛의 입자성을 가정함으로써 설명 (빛의 입자 → 광자)

2. 광전효과
[그림4: 사진5, 10, 26, 78, 52]

(1) {{광}}양자
  1) {{진}}동수 f인 {{광}}자 1개의 {{에}}너지 E는 {{다}}음과 {{같}}다.
  2) E = hf = h(c / λ)  (λ : 파장, h : 플랑크 상수 6.63×10^(-34) J·s, c : 진공에서 빛의 속도 3×10^8 m/s)

(2) {{일}}함수 (W)
[그림5: 사진5, 58, 70, 95, 92]
  1) 금속표면의 {{자}}유전자를 {{방}}출시키는데 {{필}}요한 {{최}}소 에너지
  2) 금속에 {{따}}라 일함수의 {{크}}기가 {{다}}름
  3) {{W}} = hf_0 (f_0 : 문턱진동수)

(3) {{최}}대 운동에너지 (E_k)
[그림6: 사진6, 10, 24, 72, 58]
  1) 광자가 자유전자를 방출시키는 데 일함수가 사용되고, {{남}}은 에너지는 E_k (광자 E_k, 최광일)
  2) 최대 운동에너지 : 광자 {{1}}개 에너지 {{hf}}에서 일함수 {{W}}를 {{뺀}} 값 (진동수가 f_0보다 작은 구간에서는 광전자가 방출되지 않음)
  3) {{E_k}} = (1/2)mv^2 = hf - W = hf - hf_0

3. 적용
(1) {{자}}외선을 이용한 불꽃감지기
(2) {{0.35}}㎛ 이하 파장 검출하는 UV tron

[표]
1 | 금빛전튀현 / 아인슈타인 (문턱진동수)
2 | 광일최 (광양자 / 일함수 / 최대운동에너지)
3 | 진광에다같 (E = hf = hc/λ)
4 | 금자방필최 / 금따일크다 (W = hf_0)
5 | 광자E_k / 최광일 (E_k = 1/2mv^2 = hf - W = hf - hf_0)
6 | 자외선 불꽃감지기 / 0.35㎛ 이하 UV tron

■ 측온저항체 종류, 특성, 휘스톤 브리지 회로 이용한 배선방법 [105/25]

1. 측온저항체 (서미스터) 종류
1) 종류
  ① PTC 서미스터
  ② NTC 서미스터
  ③ CTR 서미스터
2) 작동원리
  ① {{온}}도에 따라 {{저}}항이 {{증}}가 또는 {{감}}소 원리
  ② 관계식 : ΔR = KΔT
  ③ 저항 변화량 (ΔR)
    - {{계}}수 K와 {{온}}도차 ΔT의 {{곱}}에 {{비}}례
    - 온도차가 {{클}}수록 저항 {{변}}화량 커짐

2. 서미스터 특성
[비교표]
구분 | PTC | NTC | CTR
개념도 | [그림7: 사진8, 12, 53, 25, 67] | [그림8: 사진8, 25, 53, 37, 67] | [그림9: 사진8, 37, 53, 49, 67]
특성 | · K > 0 인 경우<br>· {{정}}특성 서미스터<br>· 온도증가시 저항증가 | · K < 0 인 경우<br>· {{부}}특성 서미스터<br>· 온도증가시 저항감소 | · {{임}}계온도 특성<br>· 일정온도에서 저항 급격히 감소
적용 | {{온}}도{{검}}출기능 | {{제}}어용 {{냉}}방기 | {{온}}도{{경}}보장치
[/비교표]

3. 휘스톤 브리지 배선 방법
1) 기본원리
[그림10: 사진8, 53, 12, 82, 33]
  ① 평형조건 : {{마}}주보는 {{대}}각선의 {{곱}}은 같다 (R_1·R_3 = R_2·R_4)
  ② 전위 : R지점의 전류가 0일때 a와 b 전위 같음
2) 배선방법
  ① 2선식
[그림11: 사진8, 53, 44, 83, 60]
  ② 3선식
[그림12: 사진8, 53, 61, 85, 79]

4. 휘스톤 브리지 적용
1) 차동식 스포트형의 {{반}}도체식 ({{공}}기팽창식, {{열}}기전력식, 반도체식 → 공열반)
2) 가스누설 경보기 : 접촉연소식, 기체열전도식
3) CO 검지기 : 접촉연소식

[표]
1 | 온저증감 (ΔR = KΔT)
2 | 계온곱비 / 온클저변
3 | 정부임 (PTC 정특성 / NTC 부특성 / CTR 임계온도)
4 | 온검 / 제냉 / 온경
5 | 마대곱 (R_1·R_3 = R_2·R_4)
6 | 2선식(L_1, L_2) / 3선식(L_1, L_2, L_3)
7 | 공열반 (차동식 스포트형 반도체식) / 가스누설·CO(접촉연소식)`;

  const rawEl = document.getElementById('studio-raw-text');
  if (rawEl) {
    rawEl.value = sampleBatch;
    onStudioTextEdited();
  }
}

function updateScanThreshold(val) {
  scanThreshold = parseInt(val, 10) || 192;
  const lbl = document.getElementById('scan-thresh-label');
  if (lbl) lbl.textContent = `${scanThreshold}`;
  reprocessAllAutoCrops();
}

function parseFigureMetaFromText() {
  const raw = document.getElementById('studio-raw-text')?.value || '';
  const subjMatch = raw.match(/\[과목\s*:\s*([^\]]+)\]/);
  if (subjMatch && subjMatch[1]) {
    const sIn = document.getElementById('studio-subject-input');
    if (sIn) sIn.value = sanitizeSubjectName(subjMatch[1].trim()) || '소방전기';
  }

  const regex = /\[그림(\d+)?\s*(?::\s*사진(\d+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+))?\]/g;
  let m;
  while ((m = regex.exec(raw)) !== null) {
    const figNum = parseInt(m[1] || '1', 10);
    if (m[2]) {
      studioFigureMeta[figNum] = {
        photoNum: parseInt(m[2], 10),
        l: parseFloat(m[3]),
        t: parseFloat(m[4]),
        r: parseFloat(m[5]),
        b: parseFloat(m[6])
      };
    } else if (!studioFigureMeta[figNum]) {
      studioFigureMeta[figNum] = { photoNum: 1, l: 10, t: 15, r: 85, b: 45 };
    }
  }
}

function onStudioTextEdited() {
  reprocessAllAutoCrops();
}

async function loadMultipleStudioPhotos(fileList) {
  if (!fileList || fileList.length === 0) return;
  const files = Array.from(fileList);
  const loaded = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const dataUrl = await new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (ev) => res(ev.target.result);
      reader.readAsDataURL(f);
    });
    const img = await new Promise((res) => {
      const im = new Image();
      im.onload = () => res(im);
      im.src = dataUrl;
    });
    loaded.push({ name: f.name, img, dataUrl });
  }
  studioPhotos = loaded;
  activePhotoIndex = 0;
  renderPhotoThumbStrip();
  displayActivePhotoOnCanvas();
  reprocessAllAutoCrops();
}

function renderPhotoThumbStrip() {
  const strip = document.getElementById('studio-photo-strip');
  if (!strip) return;
  if (studioPhotos.length === 0) { strip.innerHTML = ''; return; }
  strip.innerHTML = studioPhotos.map((p, idx) => `
    <div class="photo-thumb-item ${idx === activePhotoIndex ? 'active' : ''}" onclick="selectActivePhoto(${idx})">
      <div style="margin-bottom:2px;">사진 ${idx + 1}</div>
      <img src="${p.dataUrl}" alt="사진${idx + 1}">
      <div style="display:flex; justify-content:center; gap:3px; margin-top:2px;" onclick="event.stopPropagation();">
        <button type="button" style="font-size:0.68rem; padding:1px 5px; cursor:pointer;" onclick="movePhotoOrder(${idx}, -1)">◀</button>
        <button type="button" style="font-size:0.68rem; padding:1px 5px; cursor:pointer;" onclick="movePhotoOrder(${idx}, 1)">▶</button>
      </div>
    </div>
  `).join('');
}

function movePhotoOrder(idx, dir) {
  const target = idx + dir;
  if (target < 0 || target >= studioPhotos.length) return;
  const temp = studioPhotos[idx];
  studioPhotos[idx] = studioPhotos[target];
  studioPhotos[target] = temp;
  activePhotoIndex = target;
  renderPhotoThumbStrip();
  displayActivePhotoOnCanvas();
  reprocessAllAutoCrops();
}

function selectActivePhoto(idx) {
  if (idx < 0 || idx >= studioPhotos.length) return;
  activePhotoIndex = idx;
  renderPhotoThumbStrip();
  displayActivePhotoOnCanvas();
}

function displayActivePhotoOnCanvas() {
  if (studioPhotos.length === 0) return;
  const p = studioPhotos[activePhotoIndex];
  const canvas = document.getElementById('studio-crop-canvas');
  const placeholder = document.getElementById('crop-placeholder');
  placeholder.style.display = 'none';
  canvas.style.display = 'block';

  const maxW = 680;
  const scale = p.img.width > maxW ? maxW / p.img.width : 1;
  canvas.width = Math.round(p.img.width * scale);
  canvas.height = Math.round(p.img.height * scale);
  canvas.getContext('2d').drawImage(p.img, 0, 0, canvas.width, canvas.height);
}

function applyLinedPaperCleanFilter(ctx, width, height) {
  const mode = document.getElementById('scan-filter-mode')?.value || 'color_clean';
  if (mode === 'original') return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const thresh = mode === 'strong_line_remove' ? Math.min(235, scanThreshold + 16) : scanThreshold;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const maxC = Math.max(r, g, b), minC = Math.min(r, g, b);
    const chroma = maxC - minC;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    if (mode === 'bw_laser') {
      if (luma > thresh - 18) {
        data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
      } else {
        const dark = Math.max(0, Math.round((luma - 50) * 0.55));
        data[i] = dark; data[i + 1] = dark; data[i + 2] = dark;
      }
      continue;
    }

    if (chroma >= 34 && luma < 238) {
      data[i]     = Math.min(255, Math.max(0, Math.round((r - 128) * 1.18 + 128)));
      data[i + 1] = Math.min(255, Math.max(0, Math.round((g - 128) * 1.18 + 128)));
      data[i + 2] = Math.min(255, Math.max(0, Math.round((b - 128) * 1.18 + 128)));
      continue;
    }

    if (luma >= thresh - 25) {
      data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
    } else {
      const factor = luma < 115 ? 0.45 : 0.78;
      data[i] = Math.round(r * factor);
      data[i + 1] = Math.round(g * factor);
      data[i + 2] = Math.round(b * factor);
    }
  }

  if (mode === 'strong_line_remove' || mode === 'color_clean') {
    const copy = new Uint8ClampedArray(data);
    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        const idx = (y * width + x) * 4;
        if (copy[idx] === 255 && copy[idx + 1] === 255 && copy[idx + 2] === 255) continue;
        const cMax = Math.max(copy[idx], copy[idx + 1], copy[idx + 2]);
        const cMin = Math.min(copy[idx], copy[idx + 1], copy[idx + 2]);
        if (cMax - cMin >= 36) continue;

        const up1 = ((y - 1) * width + x) * 4, up2 = ((y - 2) * width + x) * 4;
        const dn1 = ((y + 1) * width + x) * 4, dn2 = ((y + 2) * width + x) * 4;
        const upWhite = (copy[up1] > 240 && copy[up2] > 240);
        const dnWhite = (copy[dn1] > 240 && copy[dn2] > 240);
        const curLuma = 0.299 * copy[idx] + 0.587 * copy[idx + 1] + 0.114 * copy[idx + 2];
        const lumaLimit = mode === 'strong_line_remove' ? 165 : 135;
        if (upWhite && dnWhite && curLuma > lumaLimit) {
          data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function cropFromPhotoByPercent(photoIdx, lPct, tPct, rPct, bPct) {
  if (photoIdx < 0 || photoIdx >= studioPhotos.length) return null;
  const srcImg = studioPhotos[photoIdx].img;
  const sx = Math.max(0, Math.round((lPct / 100) * srcImg.width));
  const sy = Math.max(0, Math.round((tPct / 100) * srcImg.height));
  const sw = Math.min(srcImg.width - sx, Math.round(((rPct - lPct) / 100) * srcImg.width));
  const sh = Math.min(srcImg.height - sy, Math.round(((bPct - tPct) / 100) * srcImg.height));
  if (sw < 10 || sh < 10) return null;

  const pad = 8;
  const outCanvas = document.createElement('canvas');
  outCanvas.width = sw + pad * 2;
  outCanvas.height = sh + pad * 2;
  const outCtx = outCanvas.getContext('2d');
  outCtx.fillStyle = '#ffffff';
  outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);

  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = sw;
  tmpCanvas.height = sh;
  const tmpCtx = tmpCanvas.getContext('2d');
  tmpCtx.drawImage(srcImg, sx, sy, sw, sh, 0, 0, sw, sh);
  applyLinedPaperCleanFilter(tmpCtx, sw, sh);

  outCtx.drawImage(tmpCanvas, pad, pad);
  return outCanvas.toDataURL('image/jpeg', 0.88);
}

function reprocessAllAutoCrops() {
  parseFigureMetaFromText();
  if (studioPhotos.length > 0) {
    Object.keys(studioFigureMeta).forEach(k => {
      const figNum = parseInt(k, 10);
      const meta = studioFigureMeta[figNum];
      const pIdx = Math.min(studioPhotos.length - 1, Math.max(0, (meta.photoNum || 1) - 1));
      const cropped = cropFromPhotoByPercent(pIdx, meta.l, meta.t, meta.r, meta.b);
      if (cropped) studioCroppedFigures[figNum] = cropped;
    });
  }
  renderStudioPreview();
}

function startManualRecropForFigure(figNum) {
  activeRecropFigNum = figNum;
  const meta = studioFigureMeta[figNum];
  if (meta && meta.photoNum && studioPhotos.length >= meta.photoNum) {
    selectActivePhoto(meta.photoNum - 1);
  }
  document.getElementById('recrop-status-text').innerHTML =
    `✂️ 현재 수동 드래그 대상: <strong style="color:#d32f2f;">[그림${figNum}]</strong> — 아래 사진 위에서 마우스로 영역을 드래그하면 즉시 교체됩니다!`;
  renderStudioPreview();
  document.getElementById('crop-workspace').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function changeFigurePhotoSource(figNum, newPhotoNum) {
  const pNum = parseInt(newPhotoNum, 10);
  if (!studioFigureMeta[figNum]) studioFigureMeta[figNum] = { photoNum: pNum, l: 10, t: 15, r: 85, b: 45 };
  else studioFigureMeta[figNum].photoNum = pNum;
  selectActivePhoto(pNum - 1);
  const meta = studioFigureMeta[figNum];
  const cropped = cropFromPhotoByPercent(pNum - 1, meta.l, meta.t, meta.r, meta.b);
  if (cropped) studioCroppedFigures[figNum] = cropped;
  renderStudioPreview();
}

function setupStudioCropCanvas() {
  const canvas = document.getElementById('studio-crop-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrag = (e) => {
    if (studioPhotos.length === 0) return;
    isStudioDragging = true;
    const pos = getPos(e);
    cropStartX = pos.x; cropStartY = pos.y;
  };

  const moveDrag = (e) => {
    if (!isStudioDragging || studioPhotos.length === 0) return;
    if (e.cancelable) e.preventDefault();
    const pos = getPos(e);
    const p = studioPhotos[activePhotoIndex];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(p.img, 0, 0, canvas.width, canvas.height);

    const x = Math.min(cropStartX, pos.x), y = Math.min(cropStartY, pos.y);
    const w = Math.abs(pos.x - cropStartX), h = Math.abs(pos.y - cropStartY);
    ctx.fillStyle = 'rgba(198, 40, 40, 0.18)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#c62828';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x, y, w, h);
  };

  const endDrag = (e) => {
    if (!isStudioDragging || studioPhotos.length === 0) return;
    isStudioDragging = false;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    const endX = (clientX - rect.left) * (canvas.width / rect.width);
    const endY = (clientY - rect.top) * (canvas.height / rect.height);

    const lPct = Math.max(0, (Math.min(cropStartX, endX) / canvas.width) * 100);
    const tPct = Math.max(0, (Math.min(cropStartY, endY) / canvas.height) * 100);
    const rPct = Math.min(100, (Math.max(cropStartX, endX) / canvas.width) * 100);
    const bPct = Math.min(100, (Math.max(cropStartY, endY) / canvas.height) * 100);
    if (rPct - lPct < 3 || bPct - tPct < 3) return;

    studioFigureMeta[activeRecropFigNum] = {
      photoNum: activePhotoIndex + 1,
      l: Math.round(lPct * 10) / 10,
      t: Math.round(tPct * 10) / 10,
      r: Math.round(rPct * 10) / 10,
      b: Math.round(bPct * 10) / 10
    };
    const cropped = cropFromPhotoByPercent(activePhotoIndex, lPct, tPct, rPct, bPct);
    if (cropped) {
      studioCroppedFigures[activeRecropFigNum] = cropped;
      renderStudioPreview();
    }
  };

  canvas.addEventListener('mousedown', startDrag);
  canvas.addEventListener('mousemove', moveDrag);
  window.addEventListener('mouseup', endDrag);
  canvas.addEventListener('touchstart', startDrag, { passive: false });
  canvas.addEventListener('touchmove', moveDrag, { passive: false });
  canvas.addEventListener('touchend', endDrag);
}

function formatMathAndKeywords(line, forAnki) {
  let safe = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;br&gt;/gi, '<br>');
  safe = safe.replace(/\^\(([^)]+)\)/g, '<sup>$1</sup>');
  safe = safe.replace(/\^([0-9+\-a-zA-Z]+)/g, '<sup>$1</sup>');
  safe = safe.replace(/_([0-9a-zA-Z]+)/g, '<sub>$1</sub>');

  if (forAnki) {
    return safe.replace(/\{\{([^}]+)\}\}/g, '<span class="red-hl">$1</span>');
  } else {
    return safe.replace(/\{\{([^}]+)\}\}/g, '<span style="color:#d50000; font-weight:bold;">$1</span>');
  }
}

function renderFigureHtml(tokenStr, forAnki, isInsideTable, includeControls) {
  const m = tokenStr.match(/\[그림(\d+)?/);
  const figNum = parseInt((m && m[1]) ? m[1] : '1', 10);
  const dataUrl = studioCroppedFigures[figNum];
  const meta = studioFigureMeta[figNum] || { photoNum: 1 };

  const sizeScale = parseFloat(document.getElementById('studio-img-size-scale')?.value || '1');
  const baseWidth = isInsideTable ? 155 : 300;
  const targetWidth = Math.round(baseWidth * sizeScale);

  let controlHtml = '';
  if (includeControls && !forAnki) {
    const photoOpts = Array.from({ length: Math.max(8, studioPhotos.length) }, (_, idx) => {
      const pNum = idx + 1;
      return `<option value="${pNum}" ${meta.photoNum === pNum ? 'selected' : ''}>사진${pNum}</option>`;
    }).join('');
    controlHtml = `
      <div class="fig-control-chip ${activeRecropFigNum === figNum ? 'active-recrop' : ''}">
        <strong>[그림${figNum}]</strong>
        <select onchange="changeFigurePhotoSource(${figNum}, this.value)" style="padding:1px 4px; font-size:0.72rem;">${photoOpts}</select>
        <button type="button" class="btn btn-outline" style="padding:1px 6px; font-size:0.7rem;" onclick="startManualRecropForFigure(${figNum})">✂️ 다시 드래그</button>
      </div><br>`;
  }

  if (dataUrl) {
    if (forAnki) {
      if (isInsideTable) {
        return `<img src="${dataUrl}" width="${targetWidth}" style="max-width:100%; width:${targetWidth}px; height:auto;">`;
      }
      return `<div class="img-block-wrapper"><div class="img-mask"><img src="${dataUrl}" width="${targetWidth}" style="max-width:100%; width:${targetWidth}px; height:auto;"></div></div>`;
    } else {
      return `${controlHtml}<img src="${dataUrl}" width="${targetWidth}" style="max-width:100%; width:${targetWidth}px; height:auto; border:1px solid #cbd5e1; margin:4px 0;">`;
    }
  } else {
    return `${controlHtml}<div style="display:inline-block; border:2px dashed #94a3b8; padding:8px 12px; color:#64748b; font-size:0.78rem; border-radius:6px; background:#f8fafc;">🖼️ [그림${figNum}: 사진${meta.photoNum || 1}] 사진을 열면 자동 삽입됩니다</div>`;
  }
}

function buildSingleUnitHtml(unitText, forAnki, includeControls) {
  const lines = unitText.split(/\r?\n/);
  let title = '■ 제목 없음';
  let bodyLines = [];
  let tableRows = [];
  let mode = 'body';
  let compRows = [];

  const flushCompTableToBody = () => {
    if (compRows.length === 0) return;
    bodyLines.push({ type: 'comp_table', rows: compRows.slice() });
    compRows = [];
  };

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line || /^\[과목\s*:/.test(line)) continue;
    if (line.startsWith('■')) { title = line; continue; }
    if (/^\[비교표\]$/i.test(line)) { mode = 'comp'; continue; }
    if (/^\[\/비교표\]$/i.test(line)) { flushCompTableToBody(); mode = 'body'; continue; }
    if (/^\[표\]$/i.test(line)) { if (mode === 'comp') flushCompTableToBody(); mode = 'summary'; continue; }

    if (mode === 'comp' && !line.includes('|') && /^\d+\.\s+/.test(line)) {
      flushCompTableToBody();
      mode = 'body';
    }

    if (mode === 'comp') {
      if (line.includes('|')) compRows.push(line.split('|').map(c => c.trim()));
    } else if (mode === 'summary') {
      const parts = line.split('|');
      if (parts.length >= 2) tableRows.push({ num: parts[0].trim(), val: parts.slice(1).join('|').trim() });
      else {
        const m = line.match(/^(\d+)\s+(.+)$/);
        if (m) tableRows.push({ num: m[1], val: m[2] });
      }
    } else {
      bodyLines.push({ type: 'text', text: line });
    }
  }
  if (compRows.length > 0) flushCompTableToBody();

  let html = '';
  if (!forAnki) {
    html += `<p style="font-size:13pt; font-weight:bold; margin:0 0 10px 0; color:#000;">${title}</p>`;
  }

  for (let item of bodyLines) {
    if (item.type === 'comp_table') {
      const cRows = item.rows;
      if (cRows.length > 0) {
        if (forAnki) {
          html += `<table class="hwp-table"><tbody>`;
          cRows.forEach((cols, rIdx) => {
            html += `<tr>`;
            cols.forEach((col, cIdx) => {
              const hasFig = /\[그림\d*[^\]]*\]/.test(col);
              const cellContent = hasFig
                ? col.replace(/\[그림\d*[^\]]*\]/g, (m) => renderFigureHtml(m, true, true, false))
                : formatMathAndKeywords(col, true);
              if (rIdx === 0) html += `<th>${cellContent}</th>`;
              else if (cIdx === 0) html += `<td style="font-weight:700;">${cellContent}</td>`;
              else html += `<td class="cell-mask">${cellContent}</td>`;
            });
            html += `</tr>`;
          });
          html += `</tbody></table>`;
        } else {
          html += `<table border="1" cellspacing="0" cellpadding="6" style="width:100%; border-collapse:collapse; border:1px solid #000000; margin:10px 0; font-size:10pt;"><tbody>`;
          cRows.forEach((cols, rIdx) => {
            html += `<tr>`;
            cols.forEach((col, cIdx) => {
              const hasFig = /\[그림\d*[^\]]*\]/.test(col);
              const cellHtml = hasFig
                ? col.replace(/\[그림\d*[^\]]*\]/g, (m) => renderFigureHtml(m, false, true, includeControls))
                : formatMathAndKeywords(col, false);
              if (rIdx === 0) html += `<th style="border:1px solid #000000; background-color:#e0ffff; font-weight:bold; text-align:center; padding:6px; color:#000;">${cellHtml}</th>`;
              else if (cIdx === 0) html += `<td style="border:1px solid #000000; font-weight:bold; text-align:center; padding:6px; width:85px; color:#000;">${cellHtml}</td>`;
              else html += `<td style="border:1px solid #000000; padding:6px; vertical-align:middle; color:#000;">${cellHtml}</td>`;
            });
            html += `</tr>`;
          });
          html += `</tbody></table>`;
        }
      }
      continue;
    }

    const line = item.text;
    if (/^\[그림\d*[^\]]*\]$/i.test(line)) {
      html += renderFigureHtml(line, forAnki, false, includeControls);
      continue;
    }

    const isMajorHeading = /^(\d+\.|[ⅠⅡⅢⅣⅤ]+\.|[가나다라마바사]\.)\s*/.test(line);
    if (forAnki) {
      if (isMajorHeading) html += `<div class="section-heading">${formatMathAndKeywords(line, true)}</div>`;
      else html += `<div class="para-mask">${formatMathAndKeywords(line, true)}</div>`;
    } else {
      const weight = isMajorHeading ? 'font-weight:bold; margin-top:8px;' : 'margin-left:10px;';
      html += `<p style="font-size:10.5pt; margin:4px 0; color:#000; ${weight}">${formatMathAndKeywords(line, false)}</p>`;
    }
  }

  if (tableRows.length > 0) {
    const pairs = [];
    for (let i = 0; i < tableRows.length; i += 2) {
      pairs.push([tableRows[i], tableRows[i + 1] || null]);
    }
    if (forAnki) {
      html += `<table class="hwp-table"><tbody>`;
      for (let pair of pairs) {
        html += `<tr>`;
        html += `<td style="width:12%; font-weight:700;">${pair[0].num}</td>`;
        html += `<td><span class="cloze-box">${formatMathAndKeywords(pair[0].val, false)}</span></td>`;
        if (pair[1]) {
          html += `<td style="width:12%; font-weight:700;">${pair[1].num}</td>`;
          html += `<td><span class="cloze-box">${formatMathAndKeywords(pair[1].val, false)}</span></td>`;
        } else {
          html += `<td style="width:12%;"></td><td></td>`;
        }
        html += `</tr>`;
      }
      html += `</tbody></table>`;
    } else {
      html += `<table border="1" cellspacing="0" cellpadding="5" style="width:100%; border-collapse:collapse; border:1px solid #000000; margin-top:12px; font-size:10pt;"><tbody>`;
      for (let pair of pairs) {
        html += `<tr>`;
        html += `<td style="border:1px solid #000000; width:36px; text-align:center; font-weight:bold; background:#f8fafc; color:#000;">${pair[0].num}</td>`;
        html += `<td style="border:1px solid #000000; color:#0055cc; font-style:italic; font-weight:bold; padding:5px 8px;">${formatMathAndKeywords(pair[0].val, false)}</td>`;
        if (pair[1]) {
          html += `<td style="border:1px solid #000000; width:36px; text-align:center; font-weight:bold; background:#f8fafc; color:#000;">${pair[1].num}</td>`;
          html += `<td style="border:1px solid #000000; color:#0055cc; font-style:italic; font-weight:bold; padding:5px 8px;">${formatMathAndKeywords(pair[1].val, false)}</td>`;
        } else {
          html += `<td style="border:1px solid #000000; width:36px;"></td><td style="border:1px solid #000000;"></td>`;
        }
        html += `</tr>`;
      }
      html += `</tbody></table>`;
    }
  }

  return { title, html };
}

function splitRawTextIntoUnits() {
  const raw = document.getElementById('studio-raw-text')?.value || '';
  const lines = raw.split(/\r?\n/);
  const units = [];
  let current = [];
  for (let line of lines) {
    if (line.trim().startsWith('■')) {
      if (current.length > 0 && current.some(l => l.trim().startsWith('■'))) {
        units.push(current.join('\n'));
        current = [];
      }
    }
    current.push(line);
  }
  if (current.length > 0 && current.some(l => l.trim().startsWith('■'))) {
    units.push(current.join('\n'));
  }
  return units;
}

function renderStudioPreview() {
  const units = splitRawTextIntoUnits();
  const countEl = document.getElementById('studio-unit-count');
  if (countEl) countEl.textContent = units.length;
  const previewContainer = document.getElementById('studio-hwp-preview');
  if (!previewContainer) return;

  if (units.length === 0) {
    previewContainer.innerHTML = `<div style="color:#64748b; text-align:center; padding:30px;">'■ 단원명'으로 시작하는 코드를 입력해 주세요.</div>`;
    return;
  }

  previewContainer.innerHTML = units.map((uText, idx) => {
    const built = buildSingleUnitHtml(uText, false, true);
    return `
      <div class="unit-preview-card">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #cbd5e1; padding-bottom:6px; margin-bottom:10px; font-size:0.78rem;">
          <strong>단원 ${idx + 1} / ${units.length}</strong>
          <div style="display:flex; gap:5px;">
            <button type="button" class="btn btn-step" style="padding:3px 8px; font-size:0.75rem;" onclick="copySingleUnitForHwp(${idx})">📋 이 단원만 한글 복사</button>
            <button type="button" class="btn btn-primary" style="padding:3px 8px; font-size:0.75rem;" onclick="saveSingleUnitToAnki(${idx})">⚡ 이 단원만 등록</button>
          </div>
        </div>
        <div>${built.html}</div>
      </div>
    `;
  }).join('');
}

async function copyHtmlToClipboardRich(htmlContent, successMsg) {
  const fullHtml = `<div style="font-family:'맑은 고딕','Malgun Gothic',sans-serif; color:#000;">${htmlContent}</div>`;
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const blobHtml = new Blob([fullHtml], { type: 'text/html' });
      const blobText = new Blob([fullHtml.replace(/<[^>]+>/g, '')], { type: 'text/plain' });
      await navigator.clipboard.write([new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })]);
      alert(successMsg);
      return;
    }
  } catch (_) {}

  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'fixed';
  tempDiv.style.left = '-9999px';
  tempDiv.innerHTML = fullHtml;
  document.body.appendChild(tempDiv);
  const range = document.createRange();
  range.selectNodeContents(tempDiv);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  document.execCommand('copy');
  sel.removeAllRanges();
  document.body.removeChild(tempDiv);
  alert(successMsg);
}

function copySingleUnitForHwp(unitIdx) {
  const units = splitRawTextIntoUnits();
  if (!units[unitIdx]) return;
  const built = buildSingleUnitHtml(units[unitIdx], false, false);
  copyHtmlToClipboardRich(built.html, `✅ [${built.title}] 단원이 한글(HWP) 서식으로 복사되었습니다!\n한글 문서에서 Ctrl+V를 누르세요.`);
}

function copyAllUnitsForHwp() {
  const units = splitRawTextIntoUnits();
  if (units.length === 0) return;
  const combinedHtml = units.map(u => buildSingleUnitHtml(u, false, false).html).join('<br><br>');
  copyHtmlToClipboardRich(combinedHtml, `✅ 총 ${units.length}개 단원 전체(본문 + 도면 + 비교표 + 파란 암기표)가 한꺼번에 복사되었습니다!\n\n한글(HWP) 문서에 Ctrl+V를 누르시면 ${units.length}개 단원이 한 번에 완성됩니다!`);
}

async function saveSingleUnitToAnki(unitIdx) {
  const units = splitRawTextIntoUnits();
  if (!units[unitIdx]) return;
  await registerUnitsArrayToAnki([units[unitIdx]]);
}

async function saveAllUnitsToAnki() {
  const units = splitRawTextIntoUnits();
  if (units.length === 0) return;
  await registerUnitsArrayToAnki(units);
}

async function registerUnitsArrayToAnki(unitTextArray) {
  const subject = sanitizeSubjectName(document.getElementById('studio-subject-input').value || '소방전기') || '소방전기';
  const existingMap = new Map();
  cards.forEach(c => existingMap.set(normalizeTitleKey(c.title), c));

  const toSave = [];
  let firstId = null;

  unitTextArray.forEach((uText, idx) => {
    const built = buildSingleUnitHtml(uText, true, false);
    const normKey = normalizeTitleKey(built.title);
    const prev = existingMap.get(normKey);
    const cardId = prev ? prev.id : (`unit-${normKey || Date.now()}-${cards.length + idx}`);
    if (!firstId) firstId = cardId;

    const cardObj = {
      id: cardId,
      order: prev ? prev.order : (cards.length + idx + 1),
      subject: subject,
      title: built.title,
      html: built.html,
      interval: prev ? (prev.interval || 0) : 0,
      repetitions: prev ? (prev.repetitions || 0) : 0,
      lapses: prev ? (prev.lapses || 0) : 0,
      flag: prev ? (prev.flag || 0) : 0,
      suspended: prev ? Boolean(prev.suspended) : false,
      buriedDate: prev ? (prev.buriedDate || '') : '',
      dueDate: prev ? (prev.dueDate || 0) : 0,
      starred: prev ? Boolean(prev.starred) : false,
      memo: prev ? (prev.memo || '') : ''
    };
    toSave.push(cardObj);
  });

  await dbSaveBatch(toSave);
  cards = await dbGetAll();
  cards.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  populateSubjectDropdown();
  applyFilter();

  alert(`🎉 [${subject}] 과목에 총 ${toSave.length}개 단원이 등록되었습니다!`);
  switchTab('study');
  if (firstId) renderSelectedCard(firstId);
}

/* =========================================================================
   📂 HWPX 파서 (우측하단 연두색 과목명 3중 추적 로직)
   ========================================================================= */
async function parseHwpxV45(event) {
  const file = event.target.files[0];
  if (!file) return;

  const logEl = document.getElementById('hwpx-log');
  logEl.style.display = 'block';
  logEl.innerText = `⏳ [${file.name}] 파일을 분석 중입니다 (우측 하단 연두색 과목명 3중 스캔)...\n`;

  try {
    const zip = await JSZip.loadAsync(file);

    const charColorMap = {};
    const headerFile = Object.keys(zip.files).find(p => p.toLowerCase().endsWith('header.xml'));
    if (headerFile) {
      const headerXml = await zip.files[headerFile].async('string');
      const headerDoc = new DOMParser().parseFromString(headerXml, 'text/xml');
      const charPrs = headerDoc.getElementsByTagNameNS('*', 'charPr');
      for (let i = 0; i < charPrs.length; i++) {
        const id = charPrs[i].getAttribute('id');
        let color = (charPrs[i].getAttribute('textColor') || '').toLowerCase();
        if (!color) {
          const tcNode = charPrs[i].getElementsByTagNameNS('*', 'textColor')[0];
          if (tcNode) color = (tcNode.getAttribute('value') || tcNode.textContent || '').toLowerCase();
        }
        if (color.startsWith('#') && color.length === 7) {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          if (r > 165 && g < 100 && b < 100) {
            charColorMap[id] = 'red';
          } else if (b > 150 && r < 100 && g < 140) {
            charColorMap[id] = 'blue';
          } else if (g >= 115 && g > r + 18 && g > b + 10) {
            charColorMap[id] = 'green_subject';
          }
        }
      }
    }

    const parseFooterOrGreenSubject = (rawStr, isFromGreenOrFooter) => {
      if (!rawStr) return null;
      const clean = rawStr.replace(/\s+/g, ' ').trim();
      if (!clean) return null;

      const m1 = clean.match(/^\d{1,4}\s+([가-힣A-Za-z0-9·()_-]{2,15})$/);
      if (m1 && /[가-힣]{2,}/.test(m1[1])) {
        return sanitizeSubjectName(m1[1]);
      }

      const m2 = clean.match(/^([가-힣A-Za-z0-9·()_-]{2,15})\s+\d{1,4}$/);
      if (m2 && /[가-힣]{2,}/.test(m2[1])) {
        return sanitizeSubjectName(m2[1]);
      }

      if (isFromGreenOrFooter) {
        const stripped = sanitizeSubjectName(clean);
        if (stripped.length >= 2 && stripped.length <= 15 && /^[가-힣A-Za-z0-9·()_\s-]+$/.test(stripped) && /[가-힣]{2,}/.test(stripped)) {
          if (!/^(개념도|특성|적용|관계식|구분|종류|원리|정의|특징|대책)$/.test(stripped)) {
            return stripped;
          }
        }
      }
      return null;
    };

    let masterPageSubject = null;
    const masterFiles = Object.keys(zip.files).filter(p => /masterpage\d*\.xml$/i.test(p)).sort();
    for (const mpPath of masterFiles) {
      const mpXml = await zip.files[mpPath].async('string');
      const mpDoc = new DOMParser().parseFromString(mpXml, 'text/xml');
      const mpRuns = Array.from(mpDoc.getElementsByTagNameNS('*', 'run'));
      for (const rNode of mpRuns) {
        const cid = rNode.getAttribute('charPrIDRef');
        const cType = charColorMap[cid];
        const txt = (rNode.textContent || '').trim();
        const cand = parseFooterOrGreenSubject(txt, true);
        if (cand) {
          masterPageSubject = cand;
          if (cType === 'green_subject') break;
        }
      }
      if (!masterPageSubject) {
        const fullMpTxt = (mpDoc.documentElement.textContent || '').replace(/\s+/g, ' ').trim();
        const cand2 = parseFooterOrGreenSubject(fullMpTxt, true);
        if (cand2) masterPageSubject = cand2;
      }
    }
    if (masterPageSubject) {
      logEl.innerText += `🎨 바탕쪽(masterPage) 우측하단 과목명 감지: [${masterPageSubject}]\n`;
    }

    const imageMap = {};
    const binPaths = Object.keys(zip.files).filter(p => p.toLowerCase().startsWith('bindata/') && !zip.files[p].dir);
    logEl.innerText += `📸 그림 및 수식 이미지 ${binPaths.length}개 최적화 중...\n`;

    for (const path of binPaths) {
      const base64 = await zip.files[path].async('base64');
      const ext = path.split('.').pop().toLowerCase();
      const mime = ext === 'png' ? 'image/png' : (ext === 'bmp' ? 'image/bmp' : 'image/jpeg');
      const fileNameNoExt = path.split('/').pop().replace(/\.[^/.]+$/, '');
      const compressed = await compressImageDataUrl(`data:${mime};base64}${base64}`.replace('base64}', 'base64,'), 680);
      imageMap[fileNameNoExt] = compressed;
      imageMap[path.split('/').pop()] = compressed;
    }

    const defaultInputSubj = sanitizeSubjectName(document.getElementById('default-subject-input')?.value || '');
    const fallbackFileSubj = sanitizeSubjectName(file.name) || '전공과목';
    let activeSubject = defaultInputSubj || masterPageSubject || null;

    const formatHwpEquation = (raw) => {
      return raw
        .replace(/\brm\b/g, '')
        .replace(/\b(it|bold)\b/g, '')
        .replace(/\{([^{}]+)\}\s*over\s*\{([^{}]+)\}/gi, '<span class="hwp-frac"><span class="hwp-frac-top">$1</span><span class="hwp-frac-btm">$2</span></span>')
        .replace(/sqrt\s*\{([^{}]+)\}/gi, '√($1)')
        .replace(/\bSUM\b/gi, '∑')
        .replace(/\bDELTA\b/g, 'Δ')
        .replace(/\bdelta\b/g, 'δ')
        .replace(/\balpha\b/gi, 'α')
        .replace(/\bbeta\b/gi, 'β')
        .replace(/\bgamma\b/gi, 'γ')
        .replace(/\brho\b/gi, 'ρ')
        .replace(/\bmu\b/gi, 'μ')
        .replace(/\bpi\b/gi, 'π')
        .replace(/\bOMEGA\b/g, 'Ω')
        .replace(/\bomega\b/g, 'ω')
        .replace(/\btheta\b/gi, 'θ')
        .replace(/\blambda\b/gi, 'λ')
        .replace(/->/g, '→')
        .replace(/<->/g, '↔')
        .replace(/\btimes\b/gi, '×')
        .replace(/\bcdot\b/gi, '·')
        .replace(/\bplusminus\b/gi, '±')
        .replace(/!=/g, '≠')
        .replace(/<=/g, '≤')
        .replace(/>=/g, '≥')
        .replace(/`_(\w+)/g, '<sub>$1</sub>')
        .replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>')
        .replace(/_(\w+)/g, '<sub>$1</sub>')
        .replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>')
        .replace(/\^(\w+)/g, '<sup>$1</sup>')
        .replace(/[~`{}]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const extractParagraphParts = (pNode, allowSubjectDetect = true) => {
      let plainText = '';
      let styledTextHtml = '';
      let standaloneImages = [];
      let detectedSubject = null;
      let greenTextsInPara = [];

      if (allowSubjectDetect) {
        const footers = [
          ...Array.from(pNode.getElementsByTagNameNS ? pNode.getElementsByTagNameNS('*', 'footer') : []),
          ...Array.from(pNode.getElementsByTagNameNS ? pNode.getElementsByTagNameNS('*', 'header') : [])
        ];
        for (const ft of footers) {
          const ftRuns = Array.from(ft.getElementsByTagNameNS('*', 'run'));
          let ftGreen = '';
          for (const fr of ftRuns) {
            if (charColorMap[fr.getAttribute('charPrIDRef')] === 'green_subject') {
              ftGreen += (fr.textContent || '');
            }
          }
          if (ftGreen.trim()) {
            const candG = parseFooterOrGreenSubject(ftGreen.trim(), true);
            if (candG) detectedSubject = candG;
          }
          if (!detectedSubject) {
            const ftTxt = (ft.textContent || '').replace(/\s+/g, ' ').trim();
            const parsedSubj = parseFooterOrGreenSubject(ftTxt, true);
            if (parsedSubj) detectedSubject = parsedSubj;
          }
        }
      }

      const runs = Array.from(pNode.childNodes).filter(n => n.localName === 'run');
      for (const run of runs) {
        const charPrId = run.getAttribute('charPrIDRef');
        const colorType = charColorMap[charPrId];

        for (const child of Array.from(run.childNodes)) {
          if (['tbl', 'footer', 'header'].includes(child.localName)) continue;

          if (child.localName === 't') {
            const txt = child.textContent;
            if (allowSubjectDetect && colorType === 'green_subject') {
              greenTextsInPara.push(txt);
              continue;
            }
            plainText += txt;
            if (colorType === 'red' && txt.trim()) {
              styledTextHtml += `<span class="red-hl">${txt}</span>`;
            } else if (colorType === 'blue' && txt.trim()) {
              styledTextHtml += `<span class="cloze-box">${txt}</span>`;
            } else {
              styledTextHtml += txt;
            }
          } else if (child.localName === 'equation') {
            const scriptNode = child.getElementsByTagNameNS('*', 'script')[0];
            if (scriptNode) {
              const eqStr = formatHwpEquation(scriptNode.textContent);
              plainText += ' ' + eqStr;
              styledTextHtml += ` <span class="red-hl">${eqStr}</span> `;
            }
          } else {
            if (allowSubjectDetect && child.getElementsByTagNameNS) {
              const subRuns = Array.from(child.getElementsByTagNameNS('*', 'run'));
              let boxGreen = '';
              for (const sr of subRuns) {
                if (charColorMap[sr.getAttribute('charPrIDRef')] === 'green_subject') {
                  boxGreen += (sr.textContent || '');
                }
              }
              if (boxGreen.trim()) {
                const candBox = parseFooterOrGreenSubject(boxGreen.trim(), true);
                if (candBox) detectedSubject = candBox;
              }
            }

            const imgs = child.localName === 'img' ? [child] : Array.from(child.getElementsByTagNameNS ? child.getElementsByTagNameNS('*', 'img') : []);
            for (const im of imgs) {
              const ref = im.getAttribute('binaryItemIDRef') || im.getAttribute('binItemIDRef');
              if (ref && imageMap[ref]) {
                standaloneImages.push(imageMap[ref]);
              }
            }
          }
        }
      }

      if (allowSubjectDetect && greenTextsInPara.length > 0) {
        const joinedGreen = greenTextsInPara.join('').trim();
        const candGreen = parseFooterOrGreenSubject(joinedGreen, true);
        if (candGreen) {
          detectedSubject = candGreen;
        }
      }

      if (allowSubjectDetect && standaloneImages.length === 0) {
        const footerPatternSubj = parseFooterOrGreenSubject(plainText, false);
        if (footerPatternSubj && plainText.trim().length <= 22) {
          detectedSubject = footerPatternSubj;
          plainText = '';
          styledTextHtml = '';
        }
        if (/^\d{1,4}$/.test(plainText.trim())) {
          plainText = '';
          styledTextHtml = '';
        }
      }

      return {
        plain: plainText.trim(),
        textHtml: styledTextHtml.trim(),
        images: standaloneImages,
        subject: detectedSubject
      };
    };

    const convertTableToHtml = (tblNode) => {
      const rows = Array.from(tblNode.childNodes).filter(n => n.localName === 'tr');

      if (rows.length === 1) {
        const tblRuns = Array.from(tblNode.getElementsByTagNameNS('*', 'run'));
        let tblGreen = '';
        for (const trun of tblRuns) {
          if (charColorMap[trun.getAttribute('charPrIDRef')] === 'green_subject') {
            tblGreen += (trun.textContent || '');
          }
        }
        const fullTblTxt = (tblNode.textContent || '').replace(/\s+/g, ' ').trim();
        const candFromTbl = parseFooterOrGreenSubject(tblGreen.trim(), true) || parseFooterOrGreenSubject(fullTblTxt, false);
        if (candFromTbl && fullTblTxt.length <= 25) {
          return { isFooterTable: true, detectedSubject: candFromTbl, html: '' };
        }
      }

      let tableHtml = '<table class="hwp-table">';
      let isBottomNumberTable = false;
      if (rows.length >= 2) {
        const firstRowCells = Array.from(rows[0].childNodes).filter(n => n.localName === 'tc');
        if (firstRowCells.length >= 2) {
          const firstCellTxt = firstRowCells[0].textContent.trim();
          if (/^[12]$/.test(firstCellTxt)) isBottomNumberTable = true;
        }
      }

      for (let r = 0; r < rows.length; r++) {
        tableHtml += '<tr>';
        const cells = Array.from(rows[r].childNodes).filter(n => n.localName === 'tc');
        const firstColTxt = cells[0] ? cells[0].textContent.trim() : '';
        const isNumberRow = /^\d+$/.test(firstColTxt);

        for (let c = 0; c < cells.length; c++) {
          const tc = cells[c];
          let colSpan = 1, rowSpan = 1;
          const cellSpanNode = Array.from(tc.childNodes).find(n => n.localName === 'cellSpan');
          if (cellSpanNode) {
            colSpan = parseInt(cellSpanNode.getAttribute('colSpan') || '1', 10);
            rowSpan = parseInt(cellSpanNode.getAttribute('rowSpan') || '1', 10);
          }
          const spanAttr = `${colSpan > 1 ? ` colspan="${colSpan}"` : ''}${rowSpan > 1 ? ` rowspan="${rowSpan}"` : ''}`;

          const subList = Array.from(tc.childNodes).find(n => n.localName === 'subList');
          const paras = subList ? Array.from(subList.childNodes).filter(n => n.localName === 'p') : [];

          let cellHtmlLines = [];
          let cellPlainLines = [];

          for (const p of paras) {
            const parts = extractParagraphParts(p, false);
            let lineHtml = parts.textHtml;
            for (const imgSrc of parts.images) {
              lineHtml += `<img src="${imgSrc}">`;
            }
            if (lineHtml) cellHtmlLines.push(lineHtml);
            if (parts.plain) cellPlainLines.push(parts.plain);
          }

          const joinedHtml = cellHtmlLines.join('<br>');
          const joinedPlain = cellPlainLines.join(' ').trim();

          if (c > 0 && (isBottomNumberTable || isNumberRow) && joinedPlain && joinedPlain !== '-') {
            if (joinedHtml.includes('class="cloze-box"')) {
              tableHtml += `<td${spanAttr}>${joinedHtml}</td>`;
            } else {
              tableHtml += `<td${spanAttr}><span class="cloze-box">${joinedHtml}</span></td>`;
            }
          } else if (!isBottomNumberTable && !isNumberRow && r === 0) {
            tableHtml += `<th${spanAttr}>${joinedHtml}</th>`;
          } else if (c > 0 && r > 0) {
            tableHtml += `<td class="cell-mask"${spanAttr}>${joinedHtml}</td>`;
          } else {
            tableHtml += `<td${spanAttr}>${joinedHtml}</td>`;
          }
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</table>';
      return { isFooterTable: false, detectedSubject: null, html: tableHtml };
    };

    const isMajorHeading = (plainStr) => {
      return /^(\d+\.|[ⅠⅡⅢⅣⅤ]+\.|[가나다라마바사]\.)\s*/.test(plainStr);
    };

    const sectionFiles = Object.keys(zip.files)
      .filter(p => /section\d+\.xml$/i.test(p))
      .sort();

    const existingMapByTitle = new Map();
    for (const c of cards) {
      existingMapByTitle.set(normalizeTitleKey(c.title), c);
    }

    const extractedCards = [];
    let currentTitle = null;
    let currentBodyHtml = '';
    let currentUnitSubject = activeSubject;

    const commitCurrentUnit = () => {
      if (!currentTitle && !currentBodyHtml.trim()) return;
      const finalTitle = currentTitle || `■ 단원 ${extractedCards.length + 1}`;
      const normKey = normalizeTitleKey(finalTitle);
      const prevCard = existingMapByTitle.get(normKey);

      const finalSubject = defaultInputSubj
        || currentUnitSubject
        || activeSubject
        || (prevCard && prevCard.subject !== '미분류' ? prevCard.subject : null);

      const idx = extractedCards.length;
      const cardObj = {
        id: prevCard ? prevCard.id : (`unit-${normKey || Date.now()}-${idx}`),
        order: prevCard ? prevCard.order : (cards.length + idx + 1),
        subject: finalSubject,
        title: finalTitle,
        html: currentBodyHtml,
        interval: prevCard ? (prevCard.interval || 0) : 0,
        repetitions: prevCard ? (prevCard.repetitions || 0) : 0,
        lapses: prevCard ? (prevCard.lapses || 0) : 0,
        flag: prevCard ? (prevCard.flag || 0) : 0,
        suspended: prevCard ? Boolean(prevCard.suspended) : false,
        buriedDate: prevCard ? (prevCard.buriedDate || '') : '',
        dueDate: prevCard ? (prevCard.dueDate || 0) : 0,
        starred: prevCard ? Boolean(prevCard.starred) : false,
        memo: prevCard ? (prevCard.memo || '') : ''
      };
      extractedCards.push(cardObj);
    };

    const applyDetectedSubject = (newSubj) => {
      if (!newSubj || defaultInputSubj) return;
      activeSubject = newSubj;
      currentUnitSubject = newSubj;
      for (const ec of extractedCards) {
        if (!ec.subject) ec.subject = newSubj;
      }
    };

    for (const secPath of sectionFiles) {
      const xmlText = await zip.files[secPath].async('string');
      const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');
      const rootParas = Array.from(xmlDoc.documentElement.childNodes).filter(n => n.localName === 'p');

      for (const pNode of rootParas) {
        const parts = extractParagraphParts(pNode, true);

        if (parts.subject) {
          applyDetectedSubject(parts.subject);
        }

        const plain = parts.plain;

        if (plain.includes('■')) {
          const htmlSegments = parts.textHtml.split(/(?=■)/).map(s => s.trim()).filter(Boolean);
          for (const segHtml of htmlSegments) {
            const segPlain = segHtml.replace(/<[^>]*>/g, '').trim();
            if (segPlain.startsWith('■')) {
              if (currentTitle || currentBodyHtml.trim()) {
                commitCurrentUnit();
              }
              currentTitle = segPlain;
              currentUnitSubject = activeSubject;
            } else {
              currentBodyHtml += `<div class="para-mask">${segHtml}</div>`;
            }
          }
        } else {
          if (parts.textHtml) {
            if (isMajorHeading(plain)) {
              currentBodyHtml += `<div class="section-heading">${parts.textHtml}</div>`;
            } else {
              currentBodyHtml += `<div class="para-mask">${parts.textHtml}</div>`;
            }
          }
        }

        for (const imgSrc of parts.images) {
          currentBodyHtml += `<div class="img-block-wrapper"><div class="img-mask"><img src="${imgSrc}"></div></div>`;
        }

        const allTablesInP = Array.from(pNode.getElementsByTagNameNS('*', 'tbl'));
        const topLevelTables = allTablesInP.filter(tbl => {
          let parent = tbl.parentNode;
          while (parent && parent !== pNode) {
            if (parent.localName === 'tbl') return false;
            parent = parent.parentNode;
          }
          return true;
        });

        for (const tbl of topLevelTables) {
          const firstCell = tbl.getElementsByTagNameNS('*', 'tc')[0];
          const firstCellTxt = firstCell ? firstCell.textContent.trim() : '';
          if (firstCellTxt.startsWith('■') && firstCellTxt.length < 80) {
            if (currentTitle || currentBodyHtml.trim()) {
              commitCurrentUnit();
            }
            currentTitle = firstCellTxt;
            currentUnitSubject = activeSubject;
          }
          const tblRes = convertTableToHtml(tbl);
          if (tblRes.isFooterTable && tblRes.detectedSubject) {
            applyDetectedSubject(tblRes.detectedSubject);
          } else {
            currentBodyHtml += tblRes.html;
          }
        }
      }
    }

    commitCurrentUnit();

    if (extractedCards.length === 0) {
      logEl.innerText += `\n⚠️ 단원을 찾지 못했습니다.`;
      return;
    }

    for (const c of extractedCards) {
      if (!c.subject) c.subject = activeSubject || fallbackFileSubj;
      logEl.innerText += `  ✔ [${c.subject}] ${c.title}\n`;
    }

    const checkedRadio = document.querySelector('input[name="upload-mode"]:checked');
    const uploadMode = checkedRadio ? checkedRadio.value : 'smart_merge';
    if (uploadMode === 'wipe_all') {
      await dbClearAll();
      for (let i = 0; i < extractedCards.length; i++) {
        extractedCards[i].order = i + 1;
        extractedCards[i].interval = 0;
        extractedCards[i].repetitions = 0;
        extractedCards[i].lapses = 0;
        extractedCards[i].flag = 0;
        extractedCards[i].suspended = false;
        extractedCards[i].buriedDate = '';
        extractedCards[i].dueDate = 0;
        extractedCards[i].starred = false;
        extractedCards[i].memo = '';
      }
    }

    await dbSaveBatch(extractedCards);
    cards = await dbGetAll();
    await migrateCardCompatibility();
    cards.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    populateSubjectDropdown();
    applyFilter();

    logEl.innerText += `\n🎉 총 ${extractedCards.length}개 단원 저장 완료! (전체 누적 카드: ${cards.length}개)\n잠시 후 학습 화면으로 이동합니다...`;
    setTimeout(() => {
      switchTab('study');
      renderSelectedCard(extractedCards[0].id);
    }, 1100);

  } catch (err) {
    logEl.innerText += `\n❌ 오류 발생: ${err.message}`;
    console.error(err);
  }
}
