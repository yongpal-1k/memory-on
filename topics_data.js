// 📘 삼국지 × 소방기술사 [topics_data.js]
window.STUDY_TOPICS = [
  {
    "id": "alarm_44",
    "category": "경보설비",
    "page": "경보설비 p.44",
    "title": "■ 성능위주 피난설계",
    "stars": 5,
    "imageFile": "alarm_44.png",
    "fallbackUrl": "https://www.genspark.ai/api/files/s/39VMEEJc",
    "summaryHtml": "<div style=\"font-family:'함초롬돋움','Malgun Gothic',sans-serif; font-size:15px; line-height:1.65; color:#000000; background:#ffffff; padding:8px 12px;\"><div style=\"font-weight:900; font-size:17px; margin-bottom:14px;\">■ 성능위주 피난설계</div><div style=\"font-weight:900; margin-top:10px;\">1. 개요</div><div style=\"padding-left:14px;\">(1) 건축물의 <span style=\"color:#dc2626;\">고유특성</span>을 고려하여 <span style=\"color:#dc2626;\">피난안전성 확보</span>를 위해 피난시설을 계획하는 것</div><div style=\"padding-left:14px;\">(2) <span style=\"color:#dc2626;\">ASET</span>(Available Safe Egress Time), <span style=\"color:#dc2626;\">RSET</span>(Required Safe Egress Time) 개념 도입</div><div style=\"padding-left:28px; margin:8px 0 14px 0;\"><svg viewBox=\"0 0 540 105\" style=\"width:100%; max-width:460px; height:auto; background:#ffffff;\" data-tts=\"화재발생으로부터 RSET과 Safety Margin을 합한 시간이 ASET이며, ASET 초과 시 거주 불가능\"><defs><marker id=\"arrBk\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\"><path d=\"M 0 1 L 10 5 L 0 9 z\" fill=\"#000000\"/></marker><marker id=\"arrBkR\" viewBox=\"0 0 10 10\" refX=\"2\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\"><path d=\"M 10 1 L 0 5 L 10 9 z\" fill=\"#000000\"/></marker></defs><line x1=\"30\" y1=\"34\" x2=\"510\" y2=\"34\" stroke=\"#000000\" stroke-width=\"1.6\" marker-end=\"url(#arrBk)\"/><line x1=\"45\" y1=\"20\" x2=\"45\" y2=\"86\" stroke=\"#000000\" stroke-width=\"1.4\"/><line x1=\"275\" y1=\"20\" x2=\"275\" y2=\"62\" stroke=\"#000000\" stroke-width=\"1.2\" stroke-dasharray=\"4,3\"/><line x1=\"390\" y1=\"20\" x2=\"390\" y2=\"86\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"45\" y=\"15\" font-size=\"11.5\" fill=\"#000000\" text-anchor=\"middle\">화재발생</text><line x1=\"49\" y1=\"52\" x2=\"271\" y2=\"52\" stroke=\"#000000\" stroke-width=\"1.3\" marker-start=\"url(#arrBkR)\" marker-end=\"url(#arrBk)\"/><text x=\"160\" y=\"47\" font-size=\"11.5\" fill=\"#000000\" text-anchor=\"middle\">RSET</text><line x1=\"279\" y1=\"52\" x2=\"386\" y2=\"52\" stroke=\"#000000\" stroke-width=\"1.3\" marker-start=\"url(#arrBkR)\" marker-end=\"url(#arrBk)\"/><text x=\"332\" y=\"47\" font-size=\"11\" fill=\"#000000\" text-anchor=\"middle\">Safety Margin</text><line x1=\"49\" y1=\"76\" x2=\"386\" y2=\"76\" stroke=\"#000000\" stroke-width=\"1.4\" marker-start=\"url(#arrBkR)\" marker-end=\"url(#arrBk)\"/><text x=\"218\" y=\"94\" font-size=\"12\" fill=\"#dc2626\" text-anchor=\"middle\">ASET = RSET + Safety Margin</text><text x=\"455\" y=\"55\" font-size=\"11.5\" fill=\"#dc2626\" text-anchor=\"middle\">거주 불가능</text><text x=\"455\" y=\"70\" font-size=\"10.5\" fill=\"#000000\" text-anchor=\"middle\">(ASET 초과)</text></svg></div><div style=\"font-weight:900; margin-top:14px;\">2. ASET (피난허용시간) 성능기준</div><div style=\"padding-left:14px;\">(1) <span style=\"color:#dc2626;\">열</span>적 영향</div><div style=\"padding-left:28px;\">1) 복사열 : 상부 연기층 복사열 기준 <span style=\"color:#dc2626;\">2.5 kW/m²</span> 이하 (4 kW/m²·445℃ : 단시간 화상, 2 kW/m²·160℃ : 5~10분 화상)</div><div style=\"padding-left:28px;\">2) 대류열 : 바닥으로부터 <span style=\"color:#dc2626;\">1.8m (호흡선)</span> 높이 온도 <span style=\"color:#dc2626;\">60℃</span> 이하</div><div style=\"padding-left:14px;\">(2) <span style=\"color:#dc2626;\">독</span>성가스</div><div style=\"padding-left:28px;\">1) 마취성 가스 : <span style=\"color:#dc2626;\">CO 1,400ppm</span> 이하, <span style=\"color:#dc2626;\">CO₂ 5%</span> 이하, <span style=\"color:#dc2626;\">O₂ 15%</span> 이상</div><div style=\"padding-left:28px;\">2) 자극성 가스 : 감각기관 자극은 농도(C) 의존, <span style=\"color:#dc2626;\">폐부종</span>·염증은 흡입량(C×t) 의존</div><div style=\"padding-left:14px;\">(3) <span style=\"color:#dc2626;\">가</span>시거리 : 판매·집회시설 <span style=\"color:#dc2626;\">10m</span> (<span style=\"color:#dc2626;\">고휘도 바닥 유도등, 축광식 유도표지</span> 설치 시 <span style=\"color:#dc2626;\">7m</span>), 기타시설 <span style=\"color:#dc2626;\">5m</span></div><div style=\"font-weight:900; margin-top:14px;\">3. RSET (피난요구시간) 산출</div><div style=\"padding-left:14px;\">(1) 산출식 : <span style=\"color:#dc2626;\">RSET = Td + (Ta + To + Ti) + Te</span></div><div style=\"padding-left:14px;\">(2) <span style=\"color:#dc2626;\">Td</span> : 감지시간 (화재발생 ~ 감지기·거주자 인지 시간)</div><div style=\"padding-left:14px;\">(3) <span style=\"color:#dc2626;\">지연시간</span> (간략 → 표 적용) : 통보시간(<span style=\"color:#dc2626;\">Ta</span>) + 반응시간(<span style=\"color:#dc2626;\">To</span>) + 피난전 행동시간(<span style=\"color:#dc2626;\">Ti</span>)</div><div style=\"padding-left:14px;\">(4) <span style=\"color:#dc2626;\">Te</span> : 피난행동시간 (화재실 → 비화재실 → 옥외 / <span style=\"color:#dc2626;\">수계산, 시뮬레이션</span>)</div><div style=\"font-weight:900; margin-top:14px;\">4. 성능위주 피난설계 절차 및 개선대책</div><div style=\"padding-left:14px;\">(1) 설계 절차</div><div style=\"padding-left:28px; margin:8px 0 12px 0;\"><svg viewBox=\"0 0 580 500\" style=\"width:100%; max-width:500px; height:auto; background:#ffffff;\" data-tts=\"성능위주 피난설계 수직 순서도. 위에서 아래로 화재 시나리오, 성능기준 결정, 피난설계안 결정, 화재 모델링, ASET 산출, 피난 모델링, RSET 산출, 평가 순으로 진행되며, YES이면 보고서 작성, NO이면 좌측 개선을 거쳐 피난설계안 결정으로 회귀함\"><defs><marker id=\"arrV\" viewBox=\"0 0 10 10\" refX=\"8\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\"><path d=\"M 0 1 L 10 5 L 0 9 z\" fill=\"#000000\"/></marker></defs><rect x=\"205\" y=\"14\" width=\"150\" height=\"32\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"280\" y=\"35\" font-size=\"12.5\" fill=\"#000000\" text-anchor=\"middle\">화재 시나리오</text><line x1=\"280\" y1=\"46\" x2=\"280\" y2=\"68\" stroke=\"#000000\" stroke-width=\"1.4\" marker-end=\"url(#arrV)\"/><rect x=\"205\" y=\"70\" width=\"150\" height=\"32\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"280\" y=\"91\" font-size=\"12.5\" fill=\"#000000\" text-anchor=\"middle\">성능기준 결정</text><line x1=\"395\" y1=\"86\" x2=\"360\" y2=\"86\" stroke=\"#000000\" stroke-width=\"1.3\" marker-end=\"url(#arrV)\"/><path d=\"M 405 54 Q 396 86 405 118\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.2\"/><text x=\"414\" y=\"70\" font-size=\"11.5\" fill=\"#000000\">호흡선 : <tspan fill=\"#dc2626\">60℃ 이하</tspan></text><text x=\"414\" y=\"90\" font-size=\"11.5\" fill=\"#000000\">CO₂, CO, O₂ 농도</text><text x=\"414\" y=\"110\" font-size=\"11.5\" fill=\"#000000\">가시거리</text><line x1=\"280\" y1=\"102\" x2=\"280\" y2=\"124\" stroke=\"#000000\" stroke-width=\"1.4\" marker-end=\"url(#arrV)\"/><rect x=\"205\" y=\"126\" width=\"150\" height=\"32\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"280\" y=\"147\" font-size=\"12.5\" fill=\"#000000\" text-anchor=\"middle\">피난설계안 결정</text><line x1=\"280\" y1=\"158\" x2=\"280\" y2=\"180\" stroke=\"#000000\" stroke-width=\"1.4\" marker-end=\"url(#arrV)\"/><rect x=\"205\" y=\"182\" width=\"150\" height=\"32\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"280\" y=\"203\" font-size=\"12.5\" fill=\"#000000\" text-anchor=\"middle\">화재 모델링</text><line x1=\"280\" y1=\"214\" x2=\"280\" y2=\"236\" stroke=\"#000000\" stroke-width=\"1.4\" marker-end=\"url(#arrV)\"/><rect x=\"205\" y=\"238\" width=\"150\" height=\"32\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"280\" y=\"259\" font-size=\"12.5\" fill=\"#000000\" text-anchor=\"middle\">ASET 산출</text><line x1=\"280\" y1=\"270\" x2=\"280\" y2=\"292\" stroke=\"#000000\" stroke-width=\"1.4\" marker-end=\"url(#arrV)\"/><rect x=\"205\" y=\"294\" width=\"150\" height=\"32\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"280\" y=\"315\" font-size=\"12.5\" fill=\"#000000\" text-anchor=\"middle\">피난 모델링</text><line x1=\"395\" y1=\"198\" x2=\"360\" y2=\"198\" stroke=\"#000000\" stroke-width=\"1.3\" marker-end=\"url(#arrV)\"/><line x1=\"395\" y1=\"310\" x2=\"360\" y2=\"310\" stroke=\"#000000\" stroke-width=\"1.3\" marker-end=\"url(#arrV)\"/><ellipse cx=\"475\" cy=\"254\" rx=\"82\" ry=\"35\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.3\"/><text x=\"475\" y=\"250\" font-size=\"11.5\" fill=\"#dc2626\" text-anchor=\"middle\">입력조건</text><text x=\"475\" y=\"268\" font-size=\"11.5\" fill=\"#dc2626\" text-anchor=\"middle\">적정성 확인</text><line x1=\"280\" y1=\"326\" x2=\"280\" y2=\"348\" stroke=\"#000000\" stroke-width=\"1.4\" marker-end=\"url(#arrV)\"/><rect x=\"205\" y=\"350\" width=\"150\" height=\"32\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"280\" y=\"371\" font-size=\"12.5\" fill=\"#000000\" text-anchor=\"middle\">RSET 산출</text><line x1=\"280\" y1=\"382\" x2=\"280\" y2=\"404\" stroke=\"#000000\" stroke-width=\"1.4\" marker-end=\"url(#arrV)\"/><polygon points=\"280,406 342,438 280,470 218,438\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"280\" y=\"443\" font-size=\"12.5\" fill=\"#000000\" text-anchor=\"middle\">평가?</text><line x1=\"342\" y1=\"438\" x2=\"410\" y2=\"438\" stroke=\"#000000\" stroke-width=\"1.4\" marker-end=\"url(#arrV)\"/><text x=\"374\" y=\"430\" font-size=\"11\" fill=\"#000000\" text-anchor=\"middle\">YES</text><rect x=\"414\" y=\"418\" width=\"92\" height=\"40\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"460\" y=\"443\" font-size=\"12.5\" fill=\"#000000\" text-anchor=\"middle\">보고서 작성</text><path d=\"M 218 438 L 145 438 L 145 272\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"182\" y=\"430\" font-size=\"11\" fill=\"#dc2626\" text-anchor=\"middle\">NO</text><rect x=\"112\" y=\"238\" width=\"66\" height=\"34\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.4\"/><text x=\"145\" y=\"260\" font-size=\"12.5\" fill=\"#dc2626\" text-anchor=\"middle\">개선</text><path d=\"M 145 238 L 145 142 L 201 142\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.4\" marker-end=\"url(#arrV)\"/><text x=\"18\" y=\"228\" font-size=\"12\" fill=\"#000000\">ASET</text><text x=\"18\" y=\"246\" font-size=\"12\" fill=\"#dc2626\">: 제가지구</text><text x=\"18\" y=\"280\" font-size=\"12\" fill=\"#000000\">RSET</text><text x=\"18\" y=\"298\" font-size=\"12\" fill=\"#dc2626\">: 밀수폭거</text><text x=\"28\" y=\"315\" font-size=\"12\" fill=\"#dc2626\">시방</text></svg></div><div style=\"padding-left:14px;\">(2) 불만족(NO) 시 개선대책</div><div style=\"padding-left:28px;\">1) ASET 증대 : <span style=\"color:#dc2626;\">제가지구</span> (제연설비, 가연물제한, 지하층 피난안전구역, 구획)</div><div style=\"padding-left:28px; margin-bottom:16px;\">2) RSET 단축 : <span style=\"color:#dc2626;\">밀수폭거시방</span> (밀도, 수용인원, 폭, 거리, 시나리오, 방송설비)</div><table style=\"width:340px; margin-left:auto; margin-right:10px; border-collapse:collapse; border:1px solid #000000; font-size:13px; text-align:center;\"><colgroup><col style=\"width:20%;\"><col style=\"width:80%;\"></colgroup><tbody><tr><td style=\"border:1px solid #000000; padding:2px 6px; color:#000000;\">1</td><td style=\"border:1px solid #000000; padding:2px 6px; color:#1d4ed8; font-style:italic;\">고유특성, 피난안전성 확보</td></tr><tr><td style=\"border:1px solid #000000; padding:2px 6px; color:#000000;\">2</td><td style=\"border:1px solid #000000; padding:2px 6px; color:#1d4ed8; font-style:italic;\">열독가 (2.5kW/m², 60℃)</td></tr><tr><td style=\"border:1px solid #000000; padding:2px 6px; color:#000000;\">3</td><td style=\"border:1px solid #000000; padding:2px 6px; color:#1d4ed8; font-style:italic;\">Td + (Ta + To + Ti) + Te</td></tr><tr><td style=\"border:1px solid #000000; padding:2px 6px; color:#000000;\">4</td><td style=\"border:1px solid #000000; padding:2px 6px; color:#1d4ed8; font-style:italic;\">입력조건 적정성 확인</td></tr><tr><td style=\"border:1px solid #000000; padding:2px 6px; color:#000000;\">5</td><td style=\"border:1px solid #000000; padding:2px 6px; color:#1d4ed8; font-style:italic;\">제가지구</td></tr><tr><td style=\"border:1px solid #000000; padding:2px 6px; color:#000000;\">6</td><td style=\"border:1px solid #000000; padding:2px 6px; color:#1d4ed8; font-style:italic;\">밀수폭거시방</td></tr></tbody></table></div>",
    "phase5_whiteboard": {
      "prompt": "성능위주 피난설계에서 1. 개요(ASET·RSET 관계), 2. ASET 성능기준(열적영향·독성가스·가시거리), 3. RSET 산출식, 4. 설계절차 수직 순서도 및 개선대책(제가지구/밀수폭거시방)을 서술하시오.",
      "mustKeywords": [
        "고유특성",
        "피난안전성 확보",
        "ASET = RSET + Safety Margin",
        "2.5 kW/m²",
        "1.8m (호흡선)",
        "60℃",
        "CO 1,400ppm",
        "고휘도 바닥 유도등, 축광식 유도표지",
        "RSET = Td + (Ta + To + Ti) + Te",
        "입력조건 적정성 확인",
        "제가지구",
        "밀수폭거시방"
      ]
    }
  },
  {
    "id": "elec_01",
    "page": "소방전기 p.1",
    "subject": "소방전기",
    "category": "소방전기",
    "title": "■ 키르히호프의 제1법칙, 제2법칙",
    "stars": 5,
    "bossKey": "boss01_slime",
    "summaryHtml": "\n      <div style=\"background:#ffffff; padding:16px 18px; border:1px solid #cbd5e1; border-radius:6px; color:#000000;\">\n        <div style=\"font-size:1.15em; font-weight:900; margin-bottom:10px; color:#000000;\">■ 키르히호프의 제1법칙, 제2법칙</div>\n\n        <!-- 상단 본문 표 -->\n        <table style=\"width:100%; border-collapse:collapse; border:1.5px solid #000000; background:#ffffff; color:#000000; font-size:0.96em;\">\n          <thead>\n            <tr style=\"background:#d9f7fa;\">\n              <th style=\"width:14%; border:1px solid #000000; padding:8px; text-align:center; font-weight:800; color:#000000;\">구분</th>\n              <th style=\"width:43%; border:1px solid #000000; padding:8px; text-align:center; font-weight:800; color:#000000;\">키르히호프 제1법칙</th>\n              <th style=\"width:43%; border:1px solid #000000; padding:8px; text-align:center; font-weight:800; color:#000000;\">키르히호프 제2법칙</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:8px; text-align:center; font-weight:800;\">\n                <span style=\"color:#dc2626;\">개</span>념도\n              </td>\n              <td style=\"border:1px solid #000000; padding:12px; text-align:center; background:#ffffff;\">\n                <svg viewBox=\"0 0 280 155\" style=\"width:100%; max-width:250px; height:auto;\" data-tts=\"키르히호프 제1법칙 개념도입니다. 교차로 접속점으로 유입전류 아이 원과 아이 투가 들어오고, 유출전류 아이 쓰리와 아이 포가 나갑니다.\">\n                  <line x1=\"35\" y1=\"30\" x2=\"245\" y2=\"125\" stroke=\"#000\" stroke-width=\"1.8\"/>\n                  <line x1=\"35\" y1=\"125\" x2=\"245\" y2=\"30\" stroke=\"#000\" stroke-width=\"1.8\"/>\n                  <circle cx=\"140\" cy=\"77.5\" r=\"3.5\" fill=\"#000\"/>\n                  <polyline points=\"82,46 92,56 80,58\" fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\"/>\n                  <polyline points=\"80,97 92,99 82,109\" fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\"/>\n                  <polyline points=\"185,51 197,52 189,62\" fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\"/>\n                  <polyline points=\"189,93 197,103 185,104\" fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\"/>\n                  <text x=\"96\" y=\"46\" font-size=\"13\" font-weight=\"700\" fill=\"#000\">I<tspan font-size=\"9\" dy=\"3\">1</tspan></text>\n                  <text x=\"96\" y=\"122\" font-size=\"13\" font-weight=\"700\" fill=\"#000\">I<tspan font-size=\"9\" dy=\"3\">2</tspan></text>\n                  <text x=\"180\" y=\"42\" font-size=\"13\" font-weight=\"700\" fill=\"#000\">I<tspan font-size=\"9\" dy=\"3\">3</tspan></text>\n                  <text x=\"198\" y=\"96\" font-size=\"13\" font-weight=\"700\" fill=\"#000\">I<tspan font-size=\"9\" dy=\"3\">4</tspan></text>\n                </svg>\n              </td>\n              <td style=\"border:1px solid #000000; padding:12px; text-align:center; background:#ffffff;\">\n                <svg viewBox=\"0 0 300 165\" style=\"width:100%; max-width:270px; height:auto;\" data-tts=\"키르히호프 제2법칙 개념도입니다. 전체 기전력 브이 티가 걸린 폐회로에서 저항 알 원, 알 투, 알 쓰리에 각각 전압강하 브이 원, 브이 투, 브이 쓰리가 발생합니다.\">\n                  <polyline points=\"55,66 55,28 118,28 123,19 131,37 139,19 147,37 155,19 163,37 168,28 240,28\" fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\"/>\n                  <polyline points=\"240,28 240,56 249,61 231,69 249,77 231,85 249,93 231,101 240,106 240,132\" fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\"/>\n                  <polyline points=\"240,132 168,132 163,141 155,123 147,141 139,123 131,141 123,123 118,132 55,132 55,94\" fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\"/>\n                  <line x1=\"38\" y1=\"66\" x2=\"72\" y2=\"66\" stroke=\"#000\" stroke-width=\"2.2\"/>\n                  <line x1=\"46\" y1=\"74\" x2=\"64\" y2=\"74\" stroke=\"#000\" stroke-width=\"2.2\"/>\n                  <line x1=\"38\" y1=\"84\" x2=\"72\" y2=\"84\" stroke=\"#000\" stroke-width=\"2.2\"/>\n                  <line x1=\"46\" y1=\"92\" x2=\"64\" y2=\"92\" stroke=\"#000\" stroke-width=\"2.2\"/>\n                  <text x=\"12\" y=\"84\" font-size=\"14\" font-weight=\"800\" fill=\"#000\">V<tspan font-size=\"10\" dy=\"3\">T</tspan></text>\n                  <text x=\"135\" y=\"14\" font-size=\"13\" font-weight=\"800\" fill=\"#000\">R<tspan font-size=\"9\" dy=\"3\">1</tspan></text>\n                  <text x=\"135\" y=\"54\" font-size=\"12.5\" font-weight=\"800\" fill=\"#2563eb\">V<tspan font-size=\"9\" dy=\"3\">1</tspan></text>\n                  <text x=\"256\" y=\"86\" font-size=\"13\" font-weight=\"800\" fill=\"#000\">R<tspan font-size=\"9\" dy=\"3\">2</tspan></text>\n                  <text x=\"206\" y=\"86\" font-size=\"12.5\" font-weight=\"800\" fill=\"#2563eb\">V<tspan font-size=\"9\" dy=\"3\">2</tspan></text>\n                  <text x=\"135\" y=\"117\" font-size=\"13\" font-weight=\"800\" fill=\"#000\">R<tspan font-size=\"9\" dy=\"3\">3</tspan></text>\n                  <text x=\"135\" y=\"158\" font-size=\"12.5\" font-weight=\"800\" fill=\"#2563eb\">V<tspan font-size=\"9\" dy=\"3\">3</tspan></text>\n                </svg>\n              </td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:8px; text-align:center; font-weight:800;\">\n                <span style=\"color:#dc2626;\">개</span>념\n              </td>\n              <td style=\"border:1px solid #000000; padding:8px; text-align:center; font-weight:700;\">전류법칙</td>\n              <td style=\"border:1px solid #000000; padding:8px; text-align:center; font-weight:700;\">전압법칙</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:8px; text-align:center; font-weight:800;\">\n                <span style=\"color:#dc2626;\">관</span>련식\n              </td>\n              <td style=\"border:1px solid #000000; padding:10px 18px; text-align:left; font-weight:700; line-height:1.7;\">\n                1. &nbsp; <i>I</i><sub>1</sub> + <i>I</i><sub>2</sub> = <i>I</i><sub>3</sub> + <i>I</i><sub>4</sub><br>\n                2. &nbsp; <i>&Sigma;</i>유입전류 = <i>&Sigma;</i>유출전류\n              </td>\n              <td style=\"border:1px solid #000000; padding:10px 18px; text-align:left; font-weight:700; line-height:1.7;\">\n                1. &nbsp; <i>V<sub>T</sub> = V</i><sub>1</sub> + <i>V</i><sub>2</sub> + <i>V</i><sub>3</sub><br>\n                2. &nbsp; <i>&Sigma;</i>기전력 = <i>&Sigma;</i>전압강하\n              </td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:8px; text-align:center; font-weight:800;\">\n                <span style=\"color:#dc2626;\">특</span>성\n              </td>\n              <td style=\"border:1px solid #000000; padding:10px 14px; text-align:left; font-weight:700; line-height:1.65;\">\n                1. <span style=\"color:#dc2626; font-weight:800;\">유입</span>전류의 <span style=\"color:#dc2626; font-weight:800;\">합</span>과 <span style=\"color:#dc2626; font-weight:800;\">유출</span>전류의 <span style=\"color:#dc2626; font-weight:800;\">합</span>은 같다.<br>\n                2. 유입전류는 반드시 유출\n              </td>\n              <td style=\"border:1px solid #000000; padding:10px 14px; text-align:center; font-weight:700;\">\n                기전력의 합은 전압강하의 합과 같다.\n              </td>\n            </tr>\n          </tbody>\n        </table>\n\n        <!-- 하단 1~7번 세로형 파란색 이탤릭 요약표 -->\n        <table style=\"width:100%; border-collapse:collapse; border:1.5px solid #000000; margin-top:14px; background:#ffffff; font-size:0.94em;\">\n          <tbody style=\"font-style:italic; font-weight:800;\">\n            <tr>\n              <td style=\"width:14%; border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">1</td>\n              <td style=\"width:43%; border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">KCL</td>\n              <td style=\"width:43%; border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">KVL</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">2</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">교차로</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">한 바퀴</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">3</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">전류법칙</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">전압법칙</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">4</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">유입합</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">기전력합</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">5</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">유출합</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">전압강하합</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">6</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">같다</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">같다</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">7</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">반드시 유출</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">-</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    ",
    "phase1_ox": [
      {
        "q": "키르히호프 제1법칙(KCL)은 전류법칙으로, 유입전류의 합과 유출전류의 합은 같으며 유입전류는 반드시 유출된다.",
        "a": "O"
      },
      {
        "q": "키르히호프 제2법칙(KVL)은 전압법칙으로, 기전력의 합은 전압강하의 합과 같다 (V_T = V₁ + V₂ + V₃).",
        "a": "O"
      },
      {
        "q": "키르히호프 제1법칙의 관련식은 ∑기전력 = ∑전압강하이다.",
        "a": "X"
      }
    ],
    "phase2_slots": [
      "KCL",
      "교차로",
      "전류법칙",
      "유입합",
      "유출합",
      "같다",
      "반드시 유출",
      "KVL",
      "한 바퀴",
      "전압법칙",
      "기전력합",
      "전압강하합",
      "같다"
    ],
    "phase3_match": [
      {
        "q": "키르히호프 제1법칙(KCL)의 개념과 관련식 조합으로 옳은 것은?",
        "opts": [
          "전류법칙 / I₁ + I₂ = I₃ + I₄ (∑유입전류 = ∑유출전류)",
          "전압법칙 / V_T = V₁ + V₂ + V₃ (∑기전력 = ∑전압강하)",
          "전류법칙 / ∑기전력 = ∑전압강하",
          "전압법칙 / I₁ + I₂ = I₃ + I₄"
        ],
        "ans": "전류법칙 / I₁ + I₂ = I₃ + I₄ (∑유입전류 = ∑유출전류)"
      },
      {
        "q": "키르히호프 제2법칙(KVL)의 하단 요약 키워드 순서(1~6번)로 옳은 것은?",
        "opts": [
          "KVL → 한 바퀴 → 전압법칙 → 기전력합 → 전압강하합 → 같다",
          "KCL → 교차로 → 전류법칙 → 유입합 → 유출합 → 같다",
          "KVL → 교차로 → 전압법칙 → 유입합 → 유출합 → 같다",
          "KCL → 한 바퀴 → 전류법칙 → 기전력합 → 전압강하합 → 같다"
        ],
        "ans": "KVL → 한 바퀴 → 전압법칙 → 기전력합 → 전압강하합 → 같다"
      }
    ],
    "phase4_typing": [
      {
        "q": "좌측 목차 두문자 4가지: 개념도, 개념, 관련식, 특성 (ㄱ·ㄱ·ㄱ·ㅌ)",
        "ans": [
          "개개관특",
          "개념도 개념 관련식 특성"
        ]
      },
      {
        "q": "KCL 특성 1번 붉은색 강조어: (ㅇㅇ)전류의 (ㅎ)과 (ㅇㅊ)전류의 (ㅎ)은 같다.",
        "ans": [
          "유입 합 유출 합",
          "유입합유출합"
        ]
      },
      {
        "q": "KCL 하단 요약 2번 키워드는 (ㄱㅊㄹ), KVL 하단 요약 2번 키워드는 (ㅎ ㅂㅋ)이다.",
        "ans": [
          "교차로 한 바퀴",
          "교차로한바퀴"
        ]
      }
    ],
    "phase5_whiteboard": {
      "prompt": "■ 키르히호프의 제1법칙, 제2법칙의 [개념도 / 개념 / 관련식 / 특성 / 하단 1~7번 요약표]를 서브노트 원문 그대로 서술하시오.",
      "keywords": [
        "KCL",
        "교차로",
        "전류법칙",
        "유입전류",
        "유출전류",
        "반드시 유출",
        "KVL",
        "한 바퀴",
        "전압법칙",
        "기전력",
        "전압강하",
        "같다"
      ]
    }
  },
  {
    "id": "elec_02",
    "page": "소방전기 p.2",
    "subject": "소방전기",
    "category": "소방전기",
    "title": "■ 플레밍의 왼손 법칙, 오른손 법칙",
    "stars": 5,
    "bossKey": "boss02_HornyMushroom",
    "summaryHtml": "\n      <div style=\"background:#ffffff; padding:16px 18px; border:1px solid #cbd5e1; border-radius:6px; color:#000000;\">\n        <div style=\"font-size:1.15em; font-weight:900; margin-bottom:10px; color:#000000;\">■ 플레밍의 왼손 법칙, 오른손 법칙</div>\n\n        <table style=\"width:100%; border-collapse:collapse; border:1.5px solid #000000; background:#ffffff; color:#000000; font-size:0.96em;\">\n          <thead>\n            <tr style=\"background:#d9f7fa;\">\n              <th style=\"width:14%; border:1px solid #000000; padding:8px; text-align:center; font-weight:800; color:#000000;\">구분</th>\n              <th style=\"width:43%; border:1px solid #000000; padding:8px; text-align:center; font-weight:800; color:#000000;\">왼손 법칙</th>\n              <th style=\"width:43%; border:1px solid #000000; padding:8px; text-align:center; font-weight:800; color:#000000;\">오른손 법칙</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:8px; text-align:center; font-weight:800;\">\n                <span style=\"color:#dc2626;\">개</span>념도\n              </td>\n              <td style=\"border:1px solid #000000; padding:10px; text-align:center; background:#ffffff;\">\n                <svg viewBox=\"0 0 310 190\" style=\"width:100%; max-width:280px; height:auto;\" data-tts=\"플레밍의 왼손 법칙 개념도입니다. 자속 비와 전류 아이가 원인이 되어 도체에 힘 에프가 발생합니다.\">\n                  <ellipse cx=\"198\" cy=\"128\" rx=\"82\" ry=\"44\" transform=\"rotate(-25 198 128)\" fill=\"rgba(37,99,235,0.04)\" stroke=\"#2563eb\" stroke-width=\"1.8\" stroke-dasharray=\"5,4\"/>\n                  <line x1=\"30\" y1=\"88\" x2=\"55\" y2=\"88\" stroke=\"#000\" stroke-width=\"2\"/>\n                  <line x1=\"30\" y1=\"95\" x2=\"55\" y2=\"95\" stroke=\"#000\" stroke-width=\"2\"/>\n                  <line x1=\"30\" y1=\"102\" x2=\"55\" y2=\"102\" stroke=\"#000\" stroke-width=\"2\"/>\n                  <path d=\"M 55 86 L 78 86 L 78 40 C 78 33, 92 33, 92 40 L 92 86 L 175 86 C 184 86, 184 100, 175 100 L 106 100 L 122 142 C 125 150, 111 154, 108 146 L 88 100 L 55 100\" fill=\"#ffffff\" stroke=\"#000\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/>\n                  <text x=\"63\" y=\"25\" font-size=\"13\" font-weight=\"900\" fill=\"#dc2626\">F (힘)</text>\n                  <text x=\"195\" y=\"102\" font-size=\"12.5\" font-weight=\"900\" fill=\"#000\">B (자속)</text>\n                  <text x=\"142\" y=\"152\" font-size=\"12.5\" font-weight=\"900\" fill=\"#000\">I (전류)</text>\n                  <text x=\"145\" y=\"182\" font-size=\"11.5\" font-weight=\"800\" fill=\"#2563eb\">▲ 원인 (자속 B + 전류 I)</text>\n                </svg>\n              </td>\n              <td style=\"border:1px solid #000000; padding:10px; text-align:center; background:#ffffff;\">\n                <svg viewBox=\"0 0 310 190\" style=\"width:100%; max-width:280px; height:auto;\" data-tts=\"플레밍의 오른손 법칙 개념도입니다. 도체운동속도 브이와 자속 비가 원인이 되어 기전력 이가 발생합니다.\">\n                  <ellipse cx=\"152\" cy=\"74\" rx=\"102\" ry=\"44\" transform=\"rotate(-20 152 74)\" fill=\"rgba(37,99,235,0.04)\" stroke=\"#2563eb\" stroke-width=\"1.8\" stroke-dasharray=\"5,4\"/>\n                  <line x1=\"255\" y1=\"88\" x2=\"280\" y2=\"88\" stroke=\"#000\" stroke-width=\"2\"/>\n                  <line x1=\"255\" y1=\"95\" x2=\"280\" y2=\"95\" stroke=\"#000\" stroke-width=\"2\"/>\n                  <line x1=\"255\" y1=\"102\" x2=\"280\" y2=\"102\" stroke=\"#000\" stroke-width=\"2\"/>\n                  <path d=\"M 255 86 L 232 86 L 232 40 C 232 33, 218 33, 218 40 L 218 86 L 135 86 C 126 86, 126 100, 135 100 L 204 100 L 188 142 C 185 150, 199 154, 202 146 L 222 100 L 255 100\" fill=\"#ffffff\" stroke=\"#000\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/>\n                  <text x=\"35\" y=\"24\" font-size=\"11.5\" font-weight=\"800\" fill=\"#2563eb\">▼ 원인 (운동 v + 자속 B)</text>\n                  <text x=\"148\" y=\"38\" font-size=\"12\" font-weight=\"900\" fill=\"#000\">v (도체운동속도)</text>\n                  <text x=\"72\" y=\"96\" font-size=\"12.5\" font-weight=\"900\" fill=\"#000\">B (자속)</text>\n                  <text x=\"155\" y=\"172\" font-size=\"13\" font-weight=\"900\" fill=\"#dc2626\">E (기전력)</text>\n                </svg>\n              </td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:8px; text-align:center; font-weight:800;\">\n                <span style=\"color:#dc2626;\">개</span>념\n              </td>\n              <td style=\"border:1px solid #000000; padding:10px 12px; text-align:left; font-weight:700; line-height:1.6;\">\n                전류가 흐르는 도체를 자기장 내에 놓으면 도체는 힘을 받아 <span style=\"color:#dc2626; font-weight:800;\">회전</span>\n              </td>\n              <td style=\"border:1px solid #000000; padding:10px 12px; text-align:left; font-weight:700; line-height:1.6;\">\n                회전자를 힘의 방향으로 돌리면 자속을 끊으면서 <span style=\"color:#dc2626; font-weight:800;\">기전력</span> 발생\n              </td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:8px; text-align:center; font-weight:800;\">\n                <span style=\"color:#dc2626;\">관</span>련식\n              </td>\n              <td style=\"border:1px solid #000000; padding:14px 18px; text-align:left; font-weight:700; line-height:1.8;\">\n                <div style=\"text-align:center; font-size:1.12em; font-style:italic; margin-bottom:10px;\">\n                  F(N) = B &middot; l &middot; I &middot; sin&theta;\n                </div>\n                <div>&#9675; <i>F</i> : 힘(<i>N</i>)</div>\n                <div>&#9675; <i>B</i> : 자속밀도(<i>Wb/m</i><sup>2</sup>)</div>\n                <div>&#9675; <i>l</i> : 도체 길이(<i>m</i>)</div>\n                <div>&#9675; <i>I</i> : 전류(<i>A</i>)</div>\n              </td>\n              <td style=\"border:1px solid #000000; padding:14px 18px; text-align:left; font-weight:700; line-height:1.8;\">\n                <div style=\"text-align:center; font-size:1.12em; font-style:italic; margin-bottom:10px;\">\n                  e(V) = B &middot; l &middot; v &middot; sin&theta;\n                </div>\n                <div>&#9675; <i>e</i> : 기전력(<i>V</i>)</div>\n                <div>&#9675; <i>B</i> : 자속밀도(<i>Wb/m</i><sup>2</sup>) (<i>T</i>)</div>\n                <div>&#9675; <i>v</i> : 도체운동속도(<i>m/s</i>)</div>\n                <div>&#9675; <i>l</i> : 도체길이(<i>m</i>)</div>\n              </td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:8px; text-align:center; font-weight:800;\">\n                <span style=\"color:#dc2626;\">적</span>용\n              </td>\n              <td style=\"border:1px solid #000000; padding:10px 14px; text-align:left; font-weight:700; line-height:1.6;\">\n                1. 전동기<br>\n                2. 솔레노이드 밸브\n              </td>\n              <td style=\"border:1px solid #000000; padding:10px 14px; text-align:center; font-weight:700;\">\n                발전기\n              </td>\n            </tr>\n          </tbody>\n        </table>\n\n        <table style=\"width:100%; border-collapse:collapse; border:1.5px solid #000000; margin-top:14px; background:#ffffff; font-size:0.94em;\">\n          <tbody style=\"font-style:italic; font-weight:800;\">\n            <tr>\n              <td style=\"width:14%; border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">1</td>\n              <td style=\"width:43%; border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">왼손</td>\n              <td style=\"width:43%; border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">오른손</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">2</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">힘자전</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">운자기</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">3</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">회전</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">기전력</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">4</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#1d4ed8;\">BIl sin&theta;</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#1d4ed8;\">Blv sin&theta;</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">5</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">전동기</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">발전기</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    ",
    "phase1_ox": [
      {
        "q": "플레밍의 왼손 법칙은 전류가 흐르는 도체를 자기장 내에 놓으면 도체는 힘을 받아 회전하는 원리로, 전동기 및 솔레노이드 밸브에 적용된다.",
        "a": "O"
      },
      {
        "q": "플레밍의 오른손 법칙은 회전자를 힘의 방향으로 돌리면 자속을 끊으면서 기전력이 발생하는 원리로, 관련식은 e(V) = B·l·v·sinθ 이다.",
        "a": "O"
      },
      {
        "q": "플레밍의 왼손 법칙에서 원인은 운동(v)과 자속(B)이고 결과는 기전력(E)이다.",
        "a": "X"
      }
    ],
    "phase2_slots": [
      "왼손",
      "힘자전",
      "회전",
      "BIl sinθ",
      "전동기",
      "오른손",
      "운자기",
      "기전력",
      "Blv sinθ",
      "발전기"
    ],
    "phase3_match": [
      {
        "q": "플레밍의 왼손 법칙의 하단 요약 키워드 1~5번 순서로 옳은 것은?",
        "opts": [
          "왼손 → 힘자전 → 회전 → BIl sinθ → 전동기",
          "오른손 → 운자기 → 기전력 → Blv sinθ → 발전기",
          "왼손 → 운자기 → 회전 → Blv sinθ → 발전기",
          "오른손 → 힘자전 → 기전력 → BIl sinθ → 전동기"
        ],
        "ans": "왼손 → 힘자전 → 회전 → BIl sinθ → 전동기"
      },
      {
        "q": "플레밍의 오른손 법칙의 원인과 결과 조합으로 옳은 것은?",
        "opts": [
          "원인: 운동(v) + 자속(B) / 결과: 기전력(E)",
          "원인: 자속(B) + 전류(I) / 결과: 힘(F)",
          "원인: 기전력(E) + 전류(I) / 결과: 자속(B)",
          "원인: 힘(F) + 전류(I) / 결과: 운동(v)"
        ],
        "ans": "원인: 운동(v) + 자속(B) / 결과: 기전력(E)"
      }
    ],
    "phase4_typing": [
      {
        "q": "좌측 목차 두문자 4가지: 개념도, 개념, 관련식, 적용 (ㄱ·ㄱ·ㄱ·ㅈ)",
        "ans": [
          "개개관적",
          "개념도 개념 관련식 적용"
        ]
      },
      {
        "q": "플레밍의 왼손 법칙 요약 2~3번: (ㅎㅈㅈ) → (ㅎㅈ)",
        "ans": [
          "힘자전 회전",
          "힘자전회전"
        ]
      },
      {
        "q": "플레밍의 오른손 법칙 요약 2~3번: (ㅇㅈㄱ) → (ㄱㅈㄹ)",
        "ans": [
          "운자기 기전력",
          "운자기기전력"
        ]
      }
    ],
    "phase5_whiteboard": {
      "prompt": "■ 플레밍의 왼손 법칙, 오른손 법칙의 [개념도 / 개념 / 관련식(기호 설명 포함) / 적용 / 하단 1~5번 요약표]를 서브노트 원문 그대로 서술하시오.",
      "keywords": [
        "왼손",
        "힘자전",
        "회전",
        "BIl sinθ",
        "전동기",
        "솔레노이드 밸브",
        "오른손",
        "운자기",
        "기전력",
        "Blv sinθ",
        "발전기",
        "자속밀도",
        "도체운동속도"
      ]
    }
  },
  {
    "id": "elec_03",
    "page": "소방전기 p.3",
    "subject": "소방전기",
    "category": "소방전기",
    "title": "■ 앙페르(암페어)의 오른나사 법칙",
    "stars": 5,
    "bossKey": "boss03_ZombieMushroom",
    "summaryHtml": "\n      <div style=\"background:#ffffff; padding:18px 22px; border:1px solid #cbd5e1; border-radius:6px; color:#000000; line-height:1.75;\">\n        <div style=\"font-size:1.15em; font-weight:900; margin-bottom:14px; color:#000000;\">■ 앙페르(암페어)의 오른나사 법칙</div>\n\n        <div style=\"font-weight:800; font-size:1em; margin-bottom:8px;\">1. 개념도</div>\n\n        <div style=\"text-align:center; margin:10px 0 18px 0;\">\n          <svg viewBox=\"0 0 380 210\" style=\"width:100%; max-width:340px; height:auto;\" data-tts=\"앙페르의 오른나사 법칙 개념도입니다. 수직 아래 방향으로 흐르는 전류 아이 주위로 동심원 회전 방향의 자계 에이치가 형성됩니다.\">\n            <defs>\n              <marker id=\"ampBlueArr\" markerWidth=\"8\" markerHeight=\"8\" refX=\"5\" refY=\"4\" orient=\"auto\">\n                <polygon points=\"0 1, 7 4, 0 7\" fill=\"#1d4ed8\"/>\n              </marker>\n            </defs>\n            <path d=\"M 122 105 A 45 28 0 1 1 185 128\" fill=\"none\" stroke=\"#1d4ed8\" stroke-width=\"2\" marker-end=\"url(#ampBlueArr)\"/>\n            <path d=\"M 102 108 A 68 42 0 1 1 200 144\" fill=\"none\" stroke=\"#1d4ed8\" stroke-width=\"2\" marker-end=\"url(#ampBlueArr)\"/>\n            <path d=\"M 82 112 A 92 56 0 1 1 215 160\" fill=\"none\" stroke=\"#1d4ed8\" stroke-width=\"2\" marker-end=\"url(#ampBlueArr)\"/>\n\n            <line x1=\"162\" y1=\"15\" x2=\"162\" y2=\"162\" stroke=\"#000000\" stroke-width=\"3\"/>\n            <polygon points=\"155,158 162,174 169,158\" fill=\"#000000\"/>\n\n            <text x=\"248\" y=\"96\" font-size=\"16\" font-weight=\"800\" fill=\"#1d4ed8\">자계 (H)</text>\n            <text x=\"132\" y=\"198\" font-size=\"16\" font-weight=\"900\" fill=\"#000000\">전류 (I)</text>\n          </svg>\n        </div>\n\n        <div style=\"font-weight:800; font-size:1em; margin-top:10px;\">2. 특성</div>\n        <div style=\"padding-left:14px; font-weight:700;\">\n          (1) 전류가 <span style=\"color:#dc2626; font-weight:800;\">나사</span>의 <span style=\"color:#dc2626; font-weight:800;\">진행</span> 방향 일때 자계는 나사의 회전 방향<br>\n          (2) 전류가 나사의 <span style=\"color:#dc2626; font-weight:800;\">회전</span> 방향 일때 자계는 나사의 진행 방향\n        </div>\n\n        <div style=\"font-weight:800; font-size:1em; margin-top:14px;\">3. 적용</div>\n        <div style=\"padding-left:14px; font-weight:700;\">\n          (1) <span style=\"color:#dc2626; font-weight:800;\">모</span>터<br>\n          (2) <span style=\"color:#dc2626; font-weight:800;\">변</span>압기<br>\n          (3) <span style=\"color:#dc2626; font-weight:800;\">클</span>램프 온 메터\n        </div>\n\n        <table style=\"width:75%; border-collapse:collapse; border:1.5px solid #000000; margin-top:18px; background:#ffffff; font-size:0.94em;\">\n          <tbody style=\"font-style:italic; font-weight:800;\">\n            <tr>\n              <td style=\"width:24%; border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">1</td>\n              <td style=\"width:76%; border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">전류</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">2</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">자계</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">3</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">나사</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">4</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">진행</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">5</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">회전</td>\n            </tr>\n            <tr>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; font-style:normal; color:#000000;\">6</td>\n              <td style=\"border:1px solid #000000; padding:4px; text-align:center; color:#1d4ed8;\">모변클</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    ",
    "phase1_ox": [
      {
        "q": "앙페르(암페어)의 오른나사 법칙에서 전류가 나사의 진행 방향일 때 자계는 나사의 회전 방향이다.",
        "a": "O"
      },
      {
        "q": "전류가 나사의 회전 방향일 때 자계는 나사의 진행 방향이다.",
        "a": "O"
      },
      {
        "q": "앙페르의 오른나사 법칙의 적용 기기(모변클)는 모터, 변압기, 클램프 온 메터이다.",
        "a": "O"
      }
    ],
    "phase2_slots": [
      "전류",
      "자계",
      "나사",
      "진행",
      "회전",
      "모변클"
    ],
    "phase3_match": [
      {
        "q": "앙페르(암페어)의 오른나사 법칙 하단 요약표 1~6번 순서로 옳은 것은?",
        "opts": [
          "1.전류 → 2.자계 → 3.나사 → 4.진행 → 5.회전 → 6.모변클",
          "1.왼손 → 2.힘자전 → 3.회전 → 4.BIl sinθ → 5.전동기",
          "1.KCL → 2.교차로 → 3.전류법칙 → 4.유입합 → 5.유출합",
          "1.오른손 → 2.운자기 → 3.기전력 → 4.Blv sinθ → 5.발전기"
        ],
        "ans": "1.전류 → 2.자계 → 3.나사 → 4.진행 → 5.회전 → 6.모변클"
      },
      {
        "q": "앙페르의 오른나사 법칙 적용 기기 두문자 '모변클'에 해당하는 것은?",
        "opts": [
          "(1) 모터, (2) 변압기, (3) 클램프 온 메터",
          "(1) 모터, (2) 발전기, (3) 클램프 미터",
          "(1) 전동기, (2) 솔레노이드 밸브",
          "(1) 정류기, (2) 변류기, (3) 콘덴서"
        ],
        "ans": "(1) 모터, (2) 변압기, (3) 클램프 온 메터"
      }
    ],
    "phase4_typing": [
      {
        "q": "특성 (1): 전류가 (ㄴㅅ)의 (ㅈㅎ) 방향 일때 자계는 나사의 회전 방향",
        "ans": [
          "나사 진행",
          "나사진행"
        ]
      },
      {
        "q": "특성 (2): 전류가 나사의 (ㅎㅈ) 방향 일때 자계는 나사의 진행 방향",
        "ans": [
          "회전"
        ]
      },
      {
        "q": "적용 (모변클): (1) 모터, (2) 변압기, (3) (ㅋㄹㅍ ㅇ ㅁㅌ)",
        "ans": [
          "클램프 온 메터",
          "클램프온메터"
        ]
      }
    ],
    "phase5_whiteboard": {
      "prompt": "■ 앙페르(암페어)의 오른나사 법칙의 [1. 개념도 / 2. 특성 (1),(2) / 3. 적용 (1)~(3) / 하단 1~6번 요약표]를 서브노트 원문 그대로 서술하시오.",
      "keywords": [
        "전류",
        "자계",
        "나사",
        "진행",
        "회전",
        "모터",
        "변압기",
        "클램프 온 메터",
        "모변클"
      ]
    }
  },
  {
    "id": "alarm_39",
    "page": "화재경보설비 p.39",
    "subject": "화재경보설비",
    "category": "화재경보설비",
    "title": "■ 차동식 스포트형 감지기",
    "stars": 5,
    "bossKey": "boss04_BlueMushmom",
    "summaryHtml": "\n      <div style=\"background:#ffffff; padding:18px 22px; border:1px solid #cbd5e1; border-radius:6px; color:#000000; line-height:1.78;\">\n        <div style=\"font-size:1.15em; font-weight:900; margin-bottom:12px; color:#000000;\">■ 차동식 스포트형 감지기</div>\n\n        <div style=\"font-weight:800; font-size:1em;\">1. 개요</div>\n        <div style=\"padding-left:14px; font-weight:700;\">\n          (1) <span style=\"color:#dc2626; font-weight:800;\">일정한 온도상승률</span> 이상시 작동<br>\n          <div style=\"padding-left:18px;\">\n            1) 실온에서부터 <span style=\"color:#dc2626; font-weight:800;\">직선적인 비율</span>로 상승하는 수평기류에 투입하는 경우<br>\n            &nbsp;&nbsp;&nbsp;&nbsp;4분 30초 이내 감지<br>\n            <div style=\"display:flex; align-items:center; gap:36px; flex-wrap:wrap; margin:6px 0;\">\n              <div>\n                2) 1종 :\n                <span style=\"display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle; line-height:1.15; font-style:italic; margin:0 4px;\">\n                  <span style=\"border-bottom:1.5px solid #000; padding:0 4px;\">dT</span>\n                  <span>dt</span>\n                </span>\n                =\n                <span style=\"display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle; line-height:1.15; margin:0 4px;\">\n                  <span style=\"border-bottom:1.5px solid #000; padding:0 4px;\">10&#8451;</span>\n                  <span>min</span>\n                </span>\n              </div>\n              <div>\n                2종 :\n                <span style=\"display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle; line-height:1.15; font-style:italic; margin:0 4px;\">\n                  <span style=\"border-bottom:1.5px solid #000; padding:0 4px;\">dT</span>\n                  <span>dt</span>\n                </span>\n                =\n                <span style=\"display:inline-flex; flex-direction:column; align-items:center; vertical-align:middle; line-height:1.15; margin:0 4px;\">\n                  <span style=\"border-bottom:1.5px solid #000; padding:0 4px;\">15&#8451;</span>\n                  <span>min</span>\n                </span>\n              </div>\n            </div>\n          </div>\n          (2) <span style=\"color:#dc2626; font-weight:800;\">공</span>기팽창식, <span style=\"color:#dc2626; font-weight:800;\">반</span>도체식, <span style=\"color:#dc2626; font-weight:800;\">열</span>기전력식\n        </div>\n\n        <div style=\"font-weight:800; font-size:1em; margin-top:12px;\">2. 종류</div>\n        <div style=\"padding-left:14px; font-weight:700;\">\n          (1) 공기팽창식 : 다이어프램<br>\n          (2) 반도체식 : 감지기 내&middot;외부 서미스터<br>\n          (3) 열기전력식 : 반도체 열전대\n        </div>\n\n        <div style=\"display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-top:12px;\">\n          <div>\n            <div style=\"font-weight:800; font-size:1em;\">3. 정온식과 비교</div>\n            <div style=\"padding-left:14px; font-weight:700;\">\n              (1) <span style=\"color:#dc2626; font-weight:800;\">감</span>도우수<br>\n              (2) <span style=\"color:#dc2626; font-weight:800;\">일</span>시적 온도상승 시 오보우려 높음<br>\n              (3) <span style=\"color:#dc2626; font-weight:800;\">훈</span>소화재 감지 부적합\n            </div>\n          </div>\n\n          <!-- 우측 1~7번 세로형 파란색 이탤릭 요약표 -->\n          <table style=\"width:270px; border-collapse:collapse; border:1.5px solid #000000; background:#ffffff; font-size:0.92em;\">\n            <tbody style=\"font-style:italic; font-weight:800;\">\n              <tr><td style=\"width:22%; border:1px solid #000000; padding:3px; text-align:center; font-style:normal; color:#000000;\">1</td><td style=\"width:78%; border:1px solid #000000; padding:3px; text-align:center; color:#1d4ed8;\">일정한 온도상승률</td></tr>\n              <tr><td style=\"border:1px solid #000000; padding:3px; text-align:center; font-style:normal; color:#000000;\">2</td><td style=\"border:1px solid #000000; padding:3px; text-align:center; color:#1d4ed8;\">직선적인 비율</td></tr>\n              <tr><td style=\"border:1px solid #000000; padding:3px; text-align:center; font-style:normal; color:#000000;\">3</td><td style=\"border:1px solid #000000; padding:3px; text-align:center; color:#1d4ed8;\">공반열</td></tr>\n              <tr><td style=\"border:1px solid #000000; padding:3px; text-align:center; font-style:normal; color:#000000;\">4</td><td style=\"border:1px solid #000000; padding:3px; text-align:center; color:#1d4ed8;\">감일훈</td></tr>\n              <tr><td style=\"border:1px solid #000000; padding:3px; text-align:center; font-style:normal; color:#000000;\">5</td><td style=\"border:1px solid #000000; padding:3px; text-align:center; color:#1d4ed8;\">공기유입구</td></tr>\n              <tr><td style=\"border:1px solid #000000; padding:3px; text-align:center; font-style:normal; color:#000000;\">6</td><td style=\"border:1px solid #000000; padding:3px; text-align:center; color:#1d4ed8;\">면하는 부분</td></tr>\n              <tr><td style=\"border:1px solid #000000; padding:3px; text-align:center; font-style:normal; color:#000000;\">7</td><td style=\"border:1px solid #000000; padding:3px; text-align:center; color:#1d4ed8;\">45도</td></tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div style=\"font-weight:800; font-size:1em; margin-top:12px;\">4. 설치기준</div>\n        <div style=\"padding-left:14px; font-weight:700;\">\n          (1) <span style=\"color:#dc2626; font-weight:800;\">공기유입구</span> : 1.5m 이상 이격<br>\n          (2) 천장&middot;반자의 옥내에 <span style=\"color:#dc2626; font-weight:800;\">면하는 부분</span>에 설치<br>\n          (3) 다음 면적(&#13217;)마다 1개 이상\n\n          <table style=\"width:92%; max-width:520px; border-collapse:collapse; border:1.5px solid #000000; text-align:center; margin:8px 0 8px 14px; background:#ffffff; font-size:0.95em;\">\n            <thead>\n              <tr style=\"background:#d9f7fa;\">\n                <th colspan=\"2\" style=\"border:1px solid #000000; padding:6px; font-weight:800;\">구분</th>\n                <th colspan=\"2\" style=\"border:1px solid #000000; padding:6px; font-weight:800;\">차동식&middot;보상식</th>\n              </tr>\n              <tr style=\"background:#d9f7fa;\">\n                <th style=\"width:28%; border:1px solid #000000; padding:6px; font-weight:800;\">부착높이</th>\n                <th style=\"width:24%; border:1px solid #000000; padding:6px; font-weight:800;\">구조</th>\n                <th style=\"width:24%; border:1px solid #000000; padding:6px; font-weight:800;\">1종</th>\n                <th style=\"width:24%; border:1px solid #000000; padding:6px; font-weight:800;\">2종</th>\n              </tr>\n            </thead>\n            <tbody style=\"font-weight:700;\">\n              <tr>\n                <td rowspan=\"2\" style=\"border:1px solid #000000; padding:6px;\">4m 미만</td>\n                <td style=\"border:1px solid #000000; padding:6px;\">내화</td>\n                <td style=\"border:1px solid #000000; padding:6px;\">90</td>\n                <td style=\"border:1px solid #000000; padding:6px;\">70</td>\n              </tr>\n              <tr>\n                <td style=\"border:1px solid #000000; padding:6px;\">기타</td>\n                <td style=\"border:1px solid #000000; padding:6px;\">50</td>\n                <td style=\"border:1px solid #000000; padding:6px;\">40</td>\n              </tr>\n              <tr>\n                <td rowspan=\"2\" style=\"border:1px solid #000000; padding:6px;\">4m ~ 8m<br>미만</td>\n                <td style=\"border:1px solid #000000; padding:6px;\">내화</td>\n                <td style=\"border:1px solid #000000; padding:6px;\">45</td>\n                <td style=\"border:1px solid #000000; padding:6px;\">35</td>\n              </tr>\n              <tr>\n                <td style=\"border:1px solid #000000; padding:6px;\">기타</td>\n                <td style=\"border:1px solid #000000; padding:6px;\">30 <span style=\"color:#dc2626; font-weight:800;\">대추</span></td>\n                <td style=\"border:1px solid #000000; padding:6px;\">25 <span style=\"color:#dc2626; font-weight:800;\">눈물</span></td>\n              </tr>\n            </tbody>\n          </table>\n\n          (4) <span style=\"color:#dc2626; font-weight:800;\">45도</span> 이상 경사되지 않도록 부착\n        </div>\n      </div>\n    ",
    "phase1_ox": [
      {
        "q": "차동식 스포트형 감지기는 실온에서부터 직선적인 비율로 상승하는 수평기류(1종 10℃/min, 2종 15℃/min)에 투입하는 경우 4분 30초 이내에 감지한다.",
        "a": "O",
        "exp": "원문 1-(1) 그대로 정확합니다. 1종은 dT/dt = 10℃/min, 2종은 dT/dt = 15℃/min입니다."
      },
      {
        "q": "차동식 스포트형 감지기는 정온식에 비해 감도가 우수하여 완만하게 온도가 상승하는 훈소화재 감지에 가장 적합하다.",
        "a": "X",
        "exp": "차동식은 일정한 온도상승률 이상 시 작동하므로 완만한 온도상승이 일어나는 '훈소화재 감지에는 부적합'합니다(감일훈)."
      },
      {
        "q": "차동식 스포트형 감지기는 공기유입구로부터 1.5m 이상 이격하여 설치하고, 45도 이상 경사되지 않도록 부착해야 한다.",
        "a": "O",
        "exp": "공기유입구 1.5m 이상 이격, 천장·반자의 옥내에 면하는 부분 설치, 45도 이상 경사 제한이 핵심 설치기준입니다."
      }
    ],
    "phase2_slots": [
      "일정한 온도상승률",
      "직선적인 비율",
      "공반열",
      "감일훈",
      "공기유입구",
      "면하는 부분",
      "45도"
    ],
    "phase3_match": [
      {
        "q": "차동식 스포트형 감지기 직선상승 수평기류 투입 시 종별 온도상승률(dT/dt) 기준은?",
        "options": [
          "1종 : 10℃/min, 2종 : 15℃/min (4분 30초 이내)",
          "1종 : 15℃/min, 2종 : 10℃/min (4분 30초 이내)",
          "1종 : 5℃/min, 2종 : 10℃/min (1분 이내)"
        ],
        "ans": 0
      },
      {
        "q": "부착높이 4m 미만(내화 / 기타)에서 차동식·보상식 1종과 2종의 설치면적(㎡) 기준 짝으로 옳은 것은?",
        "options": [
          "내화(1종 90 / 2종 70), 기타(1종 50 / 2종 40)",
          "내화(1종 70 / 2종 60), 기타(1종 40 / 2종 30)",
          "내화(1종 45 / 2종 35), 기타(1종 30 / 2종 25)"
        ],
        "ans": 0
      },
      {
        "q": "부착높이 4m ~ 8m 미만 '기타 구조'에서 차동식 1종과 2종의 설치면적(㎡) 및 암기 키워드(대추/눈물)는?",
        "options": [
          "1종 : 30㎡(대추), 2종 : 25㎡(눈물)",
          "1종 : 45㎡(대추), 2종 : 35㎡(눈물)",
          "1종 : 25㎡(눈물), 2종 : 15㎡(그만)"
        ],
        "ans": 0
      }
    ],
    "phase4_typing": [
      {
        "q": "차동식 스포트형 감지기의 3가지 종류 두문자(공기팽창식, 반도체식, 열기전력식) 3글자를 입력하세요.",
        "ans": "공반열"
      },
      {
        "q": "정온식과 비교한 차동식의 특징 3가지 두문자(감도우수, 일시적 온도상승 시 오보우려 높음, 훈소화재 감지 부적합) 3글자를 입력하세요.",
        "ans": "감일훈"
      },
      {
        "q": "차동식 스포트형 감지기는 공기유입구로부터 몇 m 이상 이격하여 설치해야 하는지 숫자만 입력하세요.",
        "ans": "1.5"
      },
      {
        "q": "차동식 스포트형 감지기는 몇 도 이상 경사되지 않도록 부착해야 하는지 숫자만 입력하세요.",
        "ans": "45"
      }
    ],
    "phase5_whiteboard": {
      "prompt": "[백지 인출] '■ 차동식 스포트형 감지기'의 1.개요(작동조건·1종/2종 수식), 2.종류(공반열), 3.정온식과 비교(감일훈), 4.설치기준(이격거리·설치면적표·경사각도)을 서브노트 원문 그대로 서술하시오.",
      "mustKeywords": [
        "일정한 온도상승률",
        "직선적인 비율",
        "수평기류",
        "4분 30초",
        "10",
        "15",
        "공기팽창식",
        "반도체식",
        "열기전력식",
        "감도우수",
        "훈소",
        "공기유입구",
        "1.5",
        "90",
        "70",
        "45도"
      ],
      "modelAnswer": "1. 개요: (1) 일정한 온도상승률 이상시 작동 (실온에서부터 직선적인 비율로 상승하는 수평기류에 투입하는 경우 4분 30초 이내 감지, 1종 dT/dt=10℃/min, 2종 dT/dt=15℃/min) (2) 공기팽창식, 반도체식, 열기전력식\n2. 종류(공반열): (1) 공기팽창식 : 다이어프램 (2) 반도체식 : 감지기 내·외부 서미스터 (3) 열기전력식 : 반도체 열전대\n3. 정온식과 비교(감일훈): (1) 감도우수 (2) 일시적 온도상승 시 오보우려 높음 (3) 훈소화재 감지 부적합\n4. 설치기준: (1) 공기유입구 : 1.5m 이상 이격 (2) 천장·반자의 옥내에 면하는 부분에 설치 (3) 설치면적: 4m미만 내화(90/70)·기타(50/40), 4m~8m미만 내화(45/35)·기타(30 대추 / 25 눈물) (4) 45도 이상 경사되지 않도록 부착"
    }
  },
  {
    "id": "alarm_40",
    "page": "화재경보설비 p.40~42",
    "subject": "화재경보설비",
    "category": "화재경보설비",
    "title": "■ 차동식 스포트형 감지기 감지원리",
    "stars": 5,
    "bossKey": "boss05_KingSlime",
    "summaryHtml": "\n      <div style=\"background:#ffffff; padding:20px 26px; border:1px solid #cbd5e1; border-radius:6px; color:#000000; line-height:1.85; font-size:0.98em;\">\n\n        <!-- ==================== [1번 이미지 원본 100% 복각 : p.40 공기팽창식] ==================== -->\n        <div style=\"font-size:1.15em; font-weight:900; margin-bottom:14px; color:#000000;\">■ 차동식 스포트형 감지기 감지원리</div>\n\n        <div style=\"font-weight:800;\">1. 개요</div>\n        <div style=\"padding-left:14px; font-weight:700; margin-bottom:14px;\">\n          (1) <span style=\"color:#dc2626; font-weight:800;\">일정한 온도상승률</span> 이상시 작동<br>\n          (2) <span style=\"color:#dc2626; font-weight:800;\">공</span>기팽창식, <span style=\"color:#dc2626; font-weight:800;\">반</span>도체식, <span style=\"color:#dc2626; font-weight:800;\">열</span>기전력식\n        </div>\n\n        <div style=\"font-weight:800;\">2. 종류별 작동원리</div>\n        <div style=\"padding-left:14px; font-weight:700;\">\n          <div style=\"font-weight:800; margin-top:4px;\">(1) 공기팽창식</div>\n          <div style=\"padding-left:18px;\">\n            <div>1) <span style=\"color:#dc2626; font-weight:800;\">개</span>념도</div>\n\n            <!-- 원본 1번 이미지와 100% 동일한 공기팽창식 개념도 (다이어프램실 + 빗금 접점 + 우측 Leak홀 + 지시선) -->\n            <div style=\"text-align:center; margin:12px 0 18px 0;\">\n              <svg viewBox=\"0 0 420 220\" style=\"width:100%; max-width:390px; height:auto;\" data-tts=\"공기팽창식 개념도입니다. 하단 반구형 감열실과 상단 다이어프램실 사이에 신축성 금속판인 다이어프램이 설치되어 있고, 우측에는 압력을 조절하는 리크홀이 있으며, 중앙 상하부에는 빗금 표시된 접점이 마주보고 있습니다.\">\n                <defs>\n                  <pattern id=\"hatchDiag\" width=\"5\" height=\"5\" patternTransform=\"rotate(45 0 0)\" patternUnits=\"userSpaceOnUse\">\n                    <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"5\" stroke=\"#000000\" stroke-width=\"1.2\" />\n                  </pattern>\n                  <marker id=\"blkArr\" markerWidth=\"7\" markerHeight=\"7\" refX=\"6\" refY=\"3.5\" orient=\"auto\">\n                    <polygon points=\"0 0.5, 6.5 3.5, 0 6.5\" fill=\"#000000\"/>\n                  </marker>\n                </defs>\n\n                <!-- 상단 수평선 및 좌우 수직 벽면 -->\n                <line x1=\"115\" y1=\"45\" x2=\"275\" y2=\"45\" stroke=\"#000000\" stroke-width=\"1.8\"/>\n                <line x1=\"115\" y1=\"45\" x2=\"115\" y2=\"112\" stroke=\"#000000\" stroke-width=\"1.8\"/>\n                <line x1=\"275\" y1=\"45\" x2=\"275\" y2=\"112\" stroke=\"#000000\" stroke-width=\"1.8\"/>\n\n                <!-- 하단 반구형 감열실 바닥 곡선 -->\n                <path d=\"M 115 112 C 115 202, 275 202, 275 112\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.8\"/>\n\n                <!-- 상단 고정접점 (오각형 빗금) -->\n                <polygon points=\"188,45 202,45 202,66 195,74 188,66\" fill=\"url(#hatchDiag)\" stroke=\"#000000\" stroke-width=\"1.5\"/>\n\n                <!-- 하단 가동접점 (사각형 빗금, 다이어프램 중앙 위) -->\n                <rect x=\"188\" y=\"90\" width=\"14\" height=\"20\" fill=\"url(#hatchDiag)\" stroke=\"#000000\" stroke-width=\"1.5\"/>\n\n                <!-- 물결형 다이어프램 (우측 Leak홀 자리 분리) -->\n                <path d=\"M 115 112 Q 126 105, 137 112 T 159 112 T 181 112 L 209 112 Q 220 105, 231 112 T 246 112\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.6\"/>\n                <path d=\"M 256 112 Q 265 106, 275 112\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.6\"/>\n\n                <!-- 우측 Leak홀 (수직 평행 관통 구멍) -->\n                <line x1=\"246\" y1=\"94\" x2=\"246\" y2=\"128\" stroke=\"#000000\" stroke-width=\"1.6\"/>\n                <line x1=\"256\" y1=\"94\" x2=\"256\" y2=\"128\" stroke=\"#000000\" stroke-width=\"1.6\"/>\n\n                <!-- 내부 텍스트 -->\n                <text x=\"145\" y=\"75\" text-anchor=\"middle\" font-size=\"12.5\" font-weight=\"800\" fill=\"#000000\">다이어</text>\n                <text x=\"145\" y=\"92\" text-anchor=\"middle\" font-size=\"12.5\" font-weight=\"800\" fill=\"#000000\">프램실</text>\n                <text x=\"195\" y=\"156\" text-anchor=\"middle\" font-size=\"13.5\" font-weight=\"800\" fill=\"#000000\">감열실</text>\n\n                <!-- 외부 라벨 및 화살표 지시선 -->\n                <text x=\"232\" y=\"24\" font-size=\"13\" font-weight=\"800\" fill=\"#000000\">접점</text>\n                <line x1=\"226\" y1=\"22\" x2=\"200\" y2=\"41\" stroke=\"#000000\" stroke-width=\"1.3\" marker-end=\"url(#blkArr)\"/>\n\n                <text x=\"315\" y=\"55\" font-size=\"13\" font-weight=\"800\" fill=\"#000000\">Leak홀</text>\n                <line x1=\"310\" y1=\"53\" x2=\"255\" y2=\"91\" stroke=\"#000000\" stroke-width=\"1.3\" marker-end=\"url(#blkArr)\"/>\n\n                <text x=\"102\" y=\"196\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"800\" fill=\"#000000\">다이어프램</text>\n                <line x1=\"115\" y1=\"180\" x2=\"146\" y2=\"117\" stroke=\"#000000\" stroke-width=\"1.3\" marker-end=\"url(#blkArr)\"/>\n              </svg>\n            </div>\n\n            <div>2) <span style=\"color:#dc2626; font-weight:800;\">구</span>조</div>\n            <div style=\"padding-left:16px;\">\n              &#9312; <span style=\"color:#dc2626; font-weight:800;\">감</span>열실 : <span style=\"color:#dc2626; font-weight:800;\">유</span>효하게 <span style=\"color:#dc2626; font-weight:800;\">열</span>감지<br>\n              &#9313; <span style=\"color:#dc2626; font-weight:800;\">다</span>이어프램 : 신축성의 <span style=\"color:#dc2626; font-weight:800;\">금</span>속판<br>\n              &#9314; <span style=\"color:#dc2626; font-weight:800;\">리</span>크구멍 : 완만한 온도상승 시 압력 조절<br>\n              &#9315; <span style=\"color:#dc2626; font-weight:800;\">접</span>점, 배선\n            </div>\n\n            <div style=\"margin-top:10px;\">3) <span style=\"color:#dc2626; font-weight:800;\">작</span>동원리</div>\n            <div style=\"padding-left:16px;\">\n              <span style=\"color:#dc2626; font-weight:800;\">화</span>재 &rarr; <span style=\"color:#dc2626; font-weight:800;\">온</span>도상승 &rarr; <span style=\"color:#dc2626; font-weight:800;\">감</span>열실 공기팽창 &rarr;<br>\n              <span style=\"color:#dc2626; font-weight:800;\">다</span>이어프램 상승 &rarr; <span style=\"color:#dc2626; font-weight:800;\">접</span>점형성 &rarr; <span style=\"color:#dc2626; font-weight:800;\">화</span>재신호\n            </div>\n\n            <!-- 원본 1번 이미지 하단: 좌측 주황색 암기문구 + 우측 세로형 1~3번 파란색 요약표 -->\n            <div style=\"display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px; margin:18px 0 24px 0;\">\n              <div style=\"color:#ea580c; font-weight:700; line-height:1.65; padding-left:16px;\">\n                화가 온통 난 감독님<br>\n                다 접고 화해합시다.\n              </div>\n\n              <table style=\"width:340px; border-collapse:collapse; border:1.5px solid #000000; background:#ffffff; text-align:center; font-size:0.92em;\">\n                <tbody style=\"font-style:italic; font-weight:800;\">\n                  <tr>\n                    <td style=\"width:24%; border:1px solid #000000; padding:3px; font-style:normal; color:#000000;\">1</td>\n                    <td style=\"width:76%; border:1px solid #000000; padding:3px; color:#1d4ed8;\">개구작</td>\n                  </tr>\n                  <tr>\n                    <td style=\"border:1px solid #000000; padding:3px; font-style:normal; color:#000000;\">2</td>\n                    <td style=\"border:1px solid #000000; padding:3px; color:#1d4ed8;\">감다리접</td>\n                  </tr>\n                  <tr>\n                    <td style=\"border:1px solid #000000; padding:3px; font-style:normal; color:#000000;\">3</td>\n                    <td style=\"border:1px solid #000000; padding:3px; color:#1d4ed8;\">화온감 다접화</td>\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n\n          <hr style=\"border:none; border-top:1.5px dashed #cbd5e1; margin:20px 0;\">\n\n          <!-- ==================== [2번 이미지 원본 100% 복각 : p.41 반도체식] ==================== -->\n          <div style=\"font-weight:800; margin-top:8px;\">(2) 반도체식</div>\n          <div style=\"padding-left:18px;\">\n            <div>1) <span style=\"color:#dc2626; font-weight:800;\">개</span>념도</div>\n\n            <!-- 원본 2번 이미지와 100% 동일한 휘트스톤 브리지 회로도 (좌측 V 전원 + 지그재그 저항 4개 + 중앙 a, b 단자) -->\n            <div style=\"text-align:center; margin:10px 0 16px 0;\">\n              <svg viewBox=\"0 0 460 215\" style=\"width:100%; max-width:430px; height:auto;\" data-tts=\"반도체식 감지기 휘트스톤 브리지 개념도입니다. 좌측에 직류 전원 브이가 연결되어 있고, 좌측 변에 고정저항 알 원과 알 투, 우측 변에 알 티에이치 원 내부 서미스터와 알 티에이치 투 외부 서미스터가 연결되어 있으며 중앙에 에이 비 단자가 있습니다.\">\n                <!-- 좌측 직류 전원 루프 -->\n                <polyline points=\"210,40 210,18 95,18 95,94\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.7\"/>\n                <polyline points=\"95,114 95,192 210,192 210,170\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.7\"/>\n                <!-- 직류 전원 기호 (+ 긴선, - 짧은 굵은선) -->\n                <line x1=\"78\" y1=\"94\" x2=\"112\" y2=\"94\" stroke=\"#000000\" stroke-width=\"1.8\"/>\n                <line x1=\"86\" y1=\"104\" x2=\"104\" y2=\"104\" stroke=\"#000000\" stroke-width=\"3.2\"/>\n                <text x=\"60\" y=\"109\" font-size=\"16\" font-weight=\"900\" fill=\"#000000\">V</text>\n                <text x=\"105\" y=\"86\" font-size=\"13\" font-weight=\"800\" fill=\"#000000\">+</text>\n                <text x=\"105\" y=\"126\" font-size=\"15\" font-weight=\"800\" fill=\"#000000\">-</text>\n\n                <!-- 다이아몬드 브리지 4변 (지그재그 저항 포함) -->\n                <!-- 좌상단 변 (R1) -->\n                <polyline points=\"210,40 190,60 183,56 188,69 175,64 180,77 167,72 172,85 164,82 145,105\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.7\"/>\n                <!-- 좌하단 변 (R2) -->\n                <polyline points=\"145,105 164,128 172,125 167,138 180,133 175,146 188,141 183,154 190,150 210,170\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.7\"/>\n                <!-- 우상단 변 (R_TH1) -->\n                <polyline points=\"210,40 230,60 237,56 232,69 245,64 240,77 253,72 248,85 256,82 275,105\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.7\"/>\n                <!-- 우하단 변 (R_TH2) -->\n                <polyline points=\"275,105 256,128 248,125 253,138 240,133 245,146 232,141 237,154 230,150 210,170\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.7\"/>\n\n                <!-- 중앙 a, b 단자선 -->\n                <line x1=\"145\" y1=\"105\" x2=\"192\" y2=\"105\" stroke=\"#000000\" stroke-width=\"1.7\"/>\n                <circle cx=\"194\" cy=\"105\" r=\"2.8\" fill=\"#000000\"/>\n                <text x=\"190\" y=\"94\" font-size=\"13\" font-weight=\"800\" fill=\"#000000\">a</text>\n\n                <line x1=\"275\" y1=\"105\" x2=\"228\" y2=\"105\" stroke=\"#000000\" stroke-width=\"1.7\"/>\n                <circle cx=\"226\" cy=\"105\" r=\"2.8\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.6\"/>\n                <text x=\"222\" y=\"94\" font-size=\"13\" font-weight=\"800\" fill=\"#000000\">b</text>\n\n                <!-- 4변 라벨 -->\n                <text x=\"142\" y=\"58\" font-size=\"14\" font-weight=\"900\" fill=\"#000000\">R<tspan font-size=\"10\" dy=\"3\">1</tspan></text>\n                <text x=\"142\" y=\"168\" font-size=\"14\" font-weight=\"900\" fill=\"#000000\">R<tspan font-size=\"10\" dy=\"3\">2</tspan></text>\n                <text x=\"262\" y=\"56\" font-size=\"13.5\" font-weight=\"900\" fill=\"#000000\">R<tspan font-size=\"9.5\" dy=\"3\">TH1</tspan><tspan dy=\"-3\"> (내부 서미스터)</tspan></text>\n                <text x=\"262\" y=\"168\" font-size=\"13.5\" font-weight=\"900\" fill=\"#000000\">R<tspan font-size=\"9.5\" dy=\"3\">TH2</tspan><tspan dy=\"-3\"> (외부 서미스터)</tspan></text>\n              </svg>\n              <div style=\"font-weight:700; margin-top:4px;\">내부&middot;외부에 서미스터 각각 설치.</div>\n            </div>\n\n            <div style=\"margin-top:10px;\">2) <span style=\"color:#dc2626; font-weight:800;\">구</span>조</div>\n            <div style=\"padding-left:16px;\">\n              &#9312; <span style=\"color:#dc2626; font-weight:800;\">휘트스톤</span> 브리지 회로<br>\n              <div style=\"padding-left:16px;\">\n                &#12894; 평상시 : R1 &middot; RTh2 = R2 &middot; RTh1 (a, b간 전위차 없음)<br>\n                &#12895; 완만한 온도 상승시 : RTh1, RTh2 동시 저항감소<br>\n                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;R1 &middot; RTh2 &approx; R2 &middot; RTh1<br>\n                &#12896; 화재시 : RTh2 저항감소 &rarr; R1 &middot; RTh2 &ne; R2 &middot; RTh1<br>\n                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;전위차 발생 &rarr; 릴레이 작동\n              </div>\n              <div style=\"margin-top:8px;\">\n                &#9313; 부특성 서미스터 (<span style=\"color:#dc2626; font-weight:800;\">NTC</span>)<br>\n                &nbsp;&nbsp;&nbsp;&nbsp;온도상승 &rarr; 저항감소\n              </div>\n            </div>\n\n            <div style=\"margin-top:12px;\">3) <span style=\"color:#dc2626; font-weight:800;\">작</span>동원리</div>\n            <div style=\"padding-left:16px;\">\n              <span style=\"color:#dc2626; font-weight:800;\">화</span>재 &rarr; <span style=\"color:#dc2626; font-weight:800;\">온</span>도상승 &rarr; <span style=\"color:#dc2626; font-weight:800;\">서</span>미스터 저항감소 &rarr; <span style=\"color:#dc2626; font-weight:800;\">릴</span>레이 작동 &rarr; <span style=\"color:#dc2626; font-weight:800;\">화</span>재신호\n            </div>\n\n            <!-- 원본 2번 이미지 우측 하단 1~4번 세로형 파란색 요약표 -->\n            <div style=\"display:flex; justify-content:flex-end; margin:16px 0 24px 0;\">\n              <table style=\"width:340px; border-collapse:collapse; border:1.5px solid #000000; background:#ffffff; text-align:center; font-size:0.92em;\">\n                <tbody style=\"font-style:italic; font-weight:800;\">\n                  <tr>\n                    <td style=\"width:24%; border:1px solid #000000; padding:3px; font-style:normal; color:#000000;\">1</td>\n                    <td style=\"width:76%; border:1px solid #000000; padding:3px; color:#1d4ed8;\">개구작</td>\n                  </tr>\n                  <tr>\n                    <td style=\"border:1px solid #000000; padding:3px; font-style:normal; color:#000000;\">2</td>\n                    <td style=\"border:1px solid #000000; padding:3px; color:#1d4ed8;\">휘트스톤</td>\n                  </tr>\n                  <tr>\n                    <td style=\"border:1px solid #000000; padding:3px; font-style:normal; color:#000000;\">3</td>\n                    <td style=\"border:1px solid #000000; padding:3px; color:#1d4ed8;\">NTC</td>\n                  </tr>\n                  <tr>\n                    <td style=\"border:1px solid #000000; padding:3px; font-style:normal; color:#000000;\">4</td>\n                    <td style=\"border:1px solid #000000; padding:3px; color:#1d4ed8;\">화온 서릴화</td>\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n\n          <hr style=\"border:none; border-top:1.5px dashed #cbd5e1; margin:20px 0;\">\n\n          <!-- ==================== [3번 이미지 원본 100% 복각 : p.42 열기전력식] ==================== -->\n          <div style=\"font-weight:800; margin-top:8px;\">(3) 열기전력식</div>\n          <div style=\"padding-left:18px;\">\n            <div>1) <span style=\"color:#dc2626; font-weight:800;\">개</span>념도</div>\n\n            <!-- 원본 3번 이미지와 100% 동일한 열기전력식 개념도 (사다리꼴 감열실 + 고감도릴레이 + 빗금 열전대 + 냉접점/온접점) -->\n            <div style=\"text-align:center; margin:12px 0 18px 0;\">\n              <svg viewBox=\"0 0 430 220\" style=\"width:100%; max-width:400px; height:auto;\" data-tts=\"열기전력식 감지기 개념도입니다. 사다리꼴 모양의 감열실 상단에 고감도릴레이가 있고, 아래쪽 빗금 쳐진 열전대의 윗면은 냉접점, 바닥면은 온접점으로 구성되어 있습니다.\">\n                <defs>\n                  <pattern id=\"hatchThermo\" width=\"6\" height=\"6\" patternTransform=\"rotate(45 0 0)\" patternUnits=\"userSpaceOnUse\">\n                    <line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"6\" stroke=\"#000000\" stroke-width=\"1.2\" />\n                  </pattern>\n                  <marker id=\"blkArr2\" markerWidth=\"7\" markerHeight=\"7\" refX=\"6\" refY=\"3.5\" orient=\"auto\">\n                    <polygon points=\"0 0.5, 6.5 3.5, 0 6.5\" fill=\"#000000\"/>\n                  </marker>\n                </defs>\n\n                <!-- 최상단 천장 수평선 -->\n                <line x1=\"95\" y1=\"22\" x2=\"325\" y2=\"22\" stroke=\"#000000\" stroke-width=\"1.8\"/>\n\n                <!-- 사다리꼴 감열실 외함 -->\n                <polyline points=\"120,22 120,62 182,145 238,145 300,62 300,22\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.8\"/>\n\n                <!-- 상단 고감도릴레이 박스 -->\n                <rect x=\"162\" y=\"22\" width=\"96\" height=\"36\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.7\"/>\n                <text x=\"210\" y=\"45\" text-anchor=\"middle\" font-size=\"13.5\" font-weight=\"800\" fill=\"#000000\">고감도릴레이</text>\n\n                <!-- 릴레이 하단 단자 원 2개 및 연결 도선 -->\n                <circle cx=\"196\" cy=\"58\" r=\"2.8\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.5\"/>\n                <circle cx=\"224\" cy=\"58\" r=\"2.8\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.5\"/>\n                <path d=\"M 196 61 Q 198 85, 196 108\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.5\"/>\n                <path d=\"M 224 61 Q 220 85, 218 108\" fill=\"none\" stroke=\"#000000\" stroke-width=\"1.5\"/>\n\n                <!-- 하단 열전대 블록 (상단 흰색 냉접점 층 + 하단 빗금 열전대 층) -->\n                <rect x=\"182\" y=\"108\" width=\"56\" height=\"10\" fill=\"#ffffff\" stroke=\"#000000\" stroke-width=\"1.5\"/>\n                <rect x=\"182\" y=\"118\" width=\"56\" height=\"27\" fill=\"url(#hatchThermo)\" stroke=\"#000000\" stroke-width=\"1.6\"/>\n\n                <!-- 지시선 및 라벨 4개 (감열실 / 냉접점 / 열전대 / 온접점) -->\n                <text x=\"78\" y=\"135\" font-size=\"13.5\" font-weight=\"800\" fill=\"#000000\">감열실</text>\n                <line x1=\"112\" y1=\"118\" x2=\"148\" y2=\"56\" stroke=\"#000000\" stroke-width=\"1.3\" marker-end=\"url(#blkArr2)\"/>\n\n                <text x=\"266\" y=\"82\" font-size=\"13\" font-weight=\"800\" fill=\"#000000\">냉접점</text>\n                <line x1=\"262\" y1=\"82\" x2=\"228\" y2=\"106\" stroke=\"#000000\" stroke-width=\"1.3\" marker-end=\"url(#blkArr2)\"/>\n\n                <text x=\"308\" y=\"128\" font-size=\"13.5\" font-weight=\"800\" fill=\"#000000\">열전대</text>\n                <line x1=\"302\" y1=\"124\" x2=\"241\" y2=\"132\" stroke=\"#000000\" stroke-width=\"1.3\" marker-end=\"url(#blkArr2)\"/>\n\n                <text x=\"210\" y=\"196\" text-anchor=\"middle\" font-size=\"13.5\" font-weight=\"800\" fill=\"#000000\">온접점</text>\n                <line x1=\"210\" y1=\"176\" x2=\"210\" y2=\"150\" stroke=\"#000000\" stroke-width=\"1.4\" marker-end=\"url(#blkArr2)\"/>\n              </svg>\n            </div>\n\n            <div>2) <span style=\"color:#dc2626; font-weight:800;\">구</span>조</div>\n            <div style=\"padding-left:16px;\">\n              &#9312; <span style=\"color:#dc2626; font-weight:800;\">감</span>열실<br>\n              &nbsp;&nbsp;&nbsp;&nbsp;<span style=\"color:#dc2626; font-weight:800;\">유</span>효하게 <span style=\"color:#dc2626; font-weight:800;\">열</span>감지, Al판<br>\n              &#9313; <span style=\"color:#dc2626; font-weight:800;\">반</span>도체 열전대<br>\n              &nbsp;&nbsp;&nbsp;&nbsp;서로 다른 두 종류의 금속의 접합부 온도차에 의한 제벡효과 이용<br>\n              &#9314; <span style=\"color:#dc2626; font-weight:800;\">고</span>감도 릴레이 : 접점형성<br>\n              &#9315; <span style=\"color:#dc2626; font-weight:800;\">완</span>만한 온도상승 시<br>\n              &nbsp;&nbsp;&nbsp;&nbsp;온접점의 기전력과 냉접점의 역기전력이 상쇄\n            </div>\n\n            <div style=\"margin-top:10px;\">3) <span style=\"color:#dc2626; font-weight:800;\">작</span>동원리</div>\n            <div style=\"padding-left:16px;\">\n              <span style=\"color:#dc2626; font-weight:800;\">화</span>재 &rarr; <span style=\"color:#dc2626; font-weight:800;\">온</span>도상승 &rarr; <span style=\"color:#dc2626; font-weight:800;\">온</span>접점 열기전력 발생 &rarr; <span style=\"color:#dc2626; font-weight:800;\">릴</span>레이 작동 &rarr; <span style=\"color:#dc2626; font-weight:800;\">화</span>재신호\n            </div>\n\n            <!-- 원본 3번 이미지 우측 하단 1~3번 세로형 파란색 요약표 -->\n            <div style=\"display:flex; justify-content:flex-end; margin-top:16px;\">\n              <table style=\"width:340px; border-collapse:collapse; border:1.5px solid #000000; background:#ffffff; text-align:center; font-size:0.92em;\">\n                <tbody style=\"font-style:italic; font-weight:800;\">\n                  <tr>\n                    <td style=\"width:24%; border:1px solid #000000; padding:3px; font-style:normal; color:#000000;\">1</td>\n                    <td style=\"width:76%; border:1px solid #000000; padding:3px; color:#1d4ed8;\">개구작</td>\n                  </tr>\n                  <tr>\n                    <td style=\"border:1px solid #000000; padding:3px; font-style:normal; color:#000000;\">2</td>\n                    <td style=\"border:1px solid #000000; padding:3px; color:#1d4ed8;\">감반고완</td>\n                  </tr>\n                  <tr>\n                    <td style=\"border:1px solid #000000; padding:3px; font-style:normal; color:#000000;\">3</td>\n                    <td style=\"border:1px solid #000000; padding:3px; color:#1d4ed8;\">화온 온릴화</td>\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n          </div>\n        </div>\n      </div>\n    ",
    "phase1_ox": [
      {
        "q": "공기팽창식 차동식 감지기의 리크구멍(Leak홀)은 완만한 온도상승 시 감열실의 압력을 조절하여 비화재보를 방지한다.",
        "a": "O",
        "exp": "완만한 온도상승 시 팽창된 공기가 리크구멍으로 빠져나가 다이어프램이 오작동하지 않게 압력을 조절합니다."
      },
      {
        "q": "반도체식 차동식 감지기는 온도가 상승하면 저항이 증가하는 정특성 서미스터(PTC)를 휘트스톤 브리지 회로에 적용한다.",
        "a": "X",
        "exp": "반도체식 차동식 감지기는 온도상승 시 저항이 감소하는 부특성 서미스터(NTC)를 내·외부에 각각 설치합니다."
      },
      {
        "q": "열기전력식 감지기에서 완만한 온도상승 시에는 온접점의 기전력과 냉접점의 역기전력이 상쇄되어 작동하지 않는다.",
        "a": "O",
        "exp": "서로 다른 두 종류의 금속 접합부 온도차에 의한 제벡효과를 이용하며, 완만한 온도상승 시 온접점 기전력과 냉접점 역기전력이 상쇄됩니다."
      }
    ],
    "phase2_slots": [
      "개구작",
      "감다리접",
      "화온감 다접화",
      "휘트스톤",
      "NTC",
      "화온 서릴화",
      "감반고완",
      "화온 온릴화"
    ],
    "phase3_match": [
      {
        "q": "반도체식 차동식 감지기의 휘트스톤 브리지 회로에서 '평상시'와 '화재시'의 저항 평형 관계식으로 옳은 것은?",
        "options": [
          "평상시 : R1·RTh2 = R2·RTh1 (전위차 없음) / 화재시 : R1·RTh2 ≠ R2·RTh1 (전위차 발생)",
          "평상시 : R1·RTh1 = R2·RTh2 (전위차 발생) / 화재시 : R1·RTh1 = R2·RTh2 (전위차 없음)",
          "평상시 : R1 + RTh2 = R2 + RTh1 / 화재시 : R1 - RTh2 = R2 - RTh1"
        ],
        "ans": 0
      },
      {
        "q": "차동식 스포트형 감지기 3종류의 작동원리 두문자 짝으로 옳은 것은?",
        "options": [
          "공기팽창식(화온감 다접화) - 반도체식(화온 서릴화) - 열기전력식(화온 온릴화)",
          "공기팽창식(화온 서릴화) - 반도체식(화온 온릴화) - 열기전력식(화온감 다접화)",
          "공기팽창식(감다리접) - 반도체식(감반고완) - 열기전력식(휘트스톤)"
        ],
        "ans": 0
      }
    ],
    "phase4_typing": [
      {
        "q": "공기팽창식 감지기의 구조 4가지 두문자(감열실, 다이어프램, 리크구멍, 접점·배선) 4글자를 입력하세요.",
        "ans": "감다리접"
      },
      {
        "q": "공기팽창식 감지기의 작동원리 두문자(화재→온도상승→감열실 공기팽창→다이어프램 상승→접점형성→화재신호) 6글자를 입력하세요.",
        "ans": [
          "화온감 다접화",
          "화온감다접화"
        ]
      },
      {
        "q": "반도체식 감지기에 사용되는 '부특성 서미스터'의 영문 약어 3글자를 입력하세요.",
        "ans": "NTC"
      },
      {
        "q": "열기전력식 감지기의 구조 4가지 두문자(감열실, 반도체 열전대, 고감도 릴레이, 완만한 온도상승 시 상쇄) 4글자를 입력하세요.",
        "ans": "감반고완"
      }
    ],
    "phase5_whiteboard": {
      "prompt": "[백지 인출] '■ 차동식 스포트형 감지기 감지원리' 3가지(공기팽창식, 반도체식, 열기전력식)의 구조와 작동원리(브리지 평형식 포함)를 서브노트 원문 그대로 서술하시오.",
      "mustKeywords": [
        "감열실",
        "다이어프램",
        "리크구멍",
        "접점",
        "휘트스톤",
        "전위차",
        "NTC",
        "저항감소",
        "릴레이",
        "열전대",
        "제벡효과",
        "온접점",
        "냉접점",
        "역기전력"
      ],
      "modelAnswer": "(1) 공기팽창식 - 구조(감다리접): ①감열실(유효하게 열감지) ②다이어프램(신축성의 금속판) ③리크구멍(완만한 온도상승 시 압력 조절) ④접점, 배선 / 작동원리(화온감 다접화): 화재→온도상승→감열실 공기팽창→다이어프램 상승→접점형성→화재신호\n(2) 반도체식 - 구조: ①휘트스톤 브리지 회로(평상시 R1·RTh2 = R2·RTh1 전위차 없음, 완만한 온도 상승시 R1·RTh2 ≈ R2·RTh1, 화재시 RTh2 저항감소로 R1·RTh2 ≠ R2·RTh1 전위차 발생→릴레이 작동) ②부특성 서미스터(NTC, 온도상승→저항감소) / 작동원리(화온 서릴화): 화재→온도상승→서미스터 저항감소→릴레이 작동→화재신호\n(3) 열기전력식 - 구조(감반고완): ①감열실(유효하게 열감지, Al판) ②반도체 열전대(서로 다른 두 종류의 금속의 접합부 온도차에 의한 제벡효과 이용) ③고감도 릴레이(접점형성) ④완만한 온도상승 시 온접점의 기전력과 냉접점의 역기전력이 상쇄 / 작동원리(화온 온릴화): 화재→온도상승→온접점 열기전력 발생→릴레이 작동→화재신호"
    }
  }
];
