export default function Report() {
  return (
    <div>
      <h2 style={{ marginBottom: "8px", fontSize: "20px" }}>BEMOVE 프로젝트 개발 보고서</h2>
      <p style={{ fontSize: "12px", color: "#999", marginBottom: "28px" }}>박소현</p>

      {/* 1. 프로젝트 개요 */}
      <h3 style={{ marginBottom: "8px", fontSize: "15px", borderBottom: "1px solid #000", paddingBottom: "4px" }}>1. 프로젝트 개요 및 기획 목적</h3>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "12px", color: "#333" }}>
        기존 플래너 서비스들은 월별로 고정된 형태가 많아 이어지는 일정 흐름이나 공부 계획을 한눈에 관리하기 어렵다고 느꼈다. 특히 대학생의 경우 과제, 시험, 공인자격증 준비 등 여러 일정이 동시에 겹치는 경우가 많아 우선순위를 정하고 공부 계획을 세우는 과정에서 불편함이 있다고 생각하였다.
      </p>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "20px", color: "#333" }}>
        이에 사용자의 학습 상태와 일정 기한을 기반으로 우선순위와 예상 소요 시간을 추천하고, 플로우 형태의 인터랙티브 UI를 통해 일정을 자연스럽게 탐색할 수 있는 AI 기반 플래너 서비스 bemove를 기획하게 되었다.
      </p>

      {/* 기존 플래너 vs BEMOVE */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px", fontSize: "12px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>기존 플래너</th>
            <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "center" }}>BEMOVE</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["월별 고정형 구조", "흐름 기반 인터랙티브 구조"],
            ["단순 일정 기록 중심", "AI 기반 우선순위 추천"],
            ["일정만 확인 가능", "예상 소요 시간 및 공부 계획 추천"],
            ["정적인 UI 형태", "마우스 이동 기반 탐색 UI"],
            ["사용자 직접 일정 판단 필요", "학습 상태 기반 일정 분석 지원"],
            ["개인 일정 위주", "공인시험 및 자격증 일정 연동"],
            ["단순 리스트 출력", "플래너 형태의 흐름형 탐색 구조"],
          ].map(([left, right], i) => (
            <tr key={i}>
              <td style={{ padding: "7px", border: "1px solid #ddd", textAlign: "center", color: "#666" }}>{left}</td>
              <td style={{ padding: "7px", border: "1px solid #ddd", textAlign: "center" }}>{right}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 2. 기술 스택 */}
      <h3 style={{ marginBottom: "8px", fontSize: "15px", borderBottom: "1px solid #000", paddingBottom: "4px" }}>2. 기술 스택 및 구현 방법</h3>

      <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px", marginTop: "12px" }}>2.1 Frontend — React + Vite</p>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "12px", color: "#333" }}>
        UI 전체는 React로 구성하였으며, Vite를 번들러로 사용하였다. 초기 기획에서는 HTML5/CSS3/JavaScript(ES6+) 기반의 React.js와 Context API를 통한 전역 상태 관리를 계획하였으나, 실제 구현에서는 useState와 useEffect, createPortal 등 React Hooks를 중심으로 컴포넌트 단위 상태 관리를 채택하였다. 컴포넌트 구조는 Dashboard.jsx를 메인으로 하여 각 패널(priority, addPlan, qualifications, background, login, report 등)을 별도 컴포넌트로 분리하였다. 모달은 React의 createPortal을 활용하여 scene div 외부 body에 렌더링함으로써 z-index 충돌 문제를 해결하였다.
      </p>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "12px", color: "#333" }}>
        마우스 패럴랙스 효과는 requestAnimationFrame과 lerp(선형보간) 함수를 조합하여 부드러운 이동을 구현하였으며, 플랜 카드는 mousedown/mousemove/mouseup 이벤트를 활용한 드래그 기능을 직접 구현하였다. 드래그와 클릭을 구분하기 위해 이동 거리 3px 이상일 때만 드래그로 판별하도록 처리하였다.
      </p>

      <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>2.2 Database — Firebase Firestore</p>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "12px", color: "#333" }}>
        초기 기획에서는 MySQL 또는 Firebase 중 선택 가능한 구조로 설계하였으며, CUSTOMERS / SCHEDULE / TIMETABLE / CERTIFICATION / USER_SETTING 총 5개의 테이블 구조를 계획하였다. 실제 구현에서는 Firebase Firestore를 선택하였고, 초기에는 localStorage로 데이터를 저장하였으나 기기 간 동기화 및 계정별 데이터 분리가 필요하여 Firestore로 마이그레이션하였다. 플랜 데이터는 사용자 UID를 기준으로 쿼리하여 본인 데이터만 불러오도록 구현하였으며, 카드 드래그 후 위치 변경 시에도 Firestore에 top/left 값이 저장되어 새로고침 후에도 위치가 유지된다.
      </p>

      <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>2.3 인증 — Firebase Authentication</p>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "12px", color: "#333" }}>
        로그인 및 회원가입은 Firebase Authentication의 이메일/비밀번호 방식을 사용하였다. 초기 기획에서 계획한 Find ID/PW 기능은 미구현 상태이다. onAuthStateChanged로 로그인 상태를 실시간으로 감지하며, 로그인 시 해당 유저의 플랜 데이터를 자동으로 불러오고 로그아웃 시 데이터를 초기화한다. nav 바에서 로그인 상태일 때는 이메일이 표시되며 클릭 시 로그아웃된다.
      </p>

      <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>2.4 AI — Groq API (llama-3.1-8b-instant)</p>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "20px", color: "#333" }}>
        초기 기획에서는 JavaScript 기반 알고리즘으로 D-day와 작업량 기반 우선순위 계산을 구현할 계획이었으나, 실제 구현에서는 외부 AI API를 활용하는 방식으로 변경하였다. Anthropic Claude는 CORS 문제, Google Gemini는 한국에서 키 발급 불가로 인해 최종적으로 Groq의 llama-3.1-8b-instant 모델을 선택하였다. 로컬 환경에서는 Vite proxy 설정, 배포 환경에서는 Vercel Serverless Function(/api/groq.js)을 통해 CORS 문제를 해결하였다.
      </p>

      {/* 3. 페이지 구성 */}
      <h3 style={{ marginBottom: "8px", fontSize: "15px", borderBottom: "1px solid #000", paddingBottom: "4px" }}>3. 페이지 구성 및 주요 기능</h3>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "8px", color: "#333" }}>
        메인 화면은 상단 nav 메뉴, 배경 영역, 플랜 카드 영역으로 구성되며, 마우스 이동 기반 인터랙션을 통해 인터랙티브 아카이브 형태의 사용자 경험을 제공한다.
      </p>

      {[
        ["일정 입력 기능 (add plan)", "사용자가 일정의 제목, 기한 날짜, 세부 내용, 카테고리 등을 입력할 수 있도록 설계하였다. 월/일 선택과 시간 입력(선택사항)이 가능하며, 추가된 플랜은 배경 화면 위 카드 형태로 표시된다."],
        ["AI 우선순위 분석 기능 (ai recommend priority)", "등록된 플랜 데이터를 기반으로 AI가 우선순위를 분석한다. 분석 기간을 월 단위로 선택할 수 있으며, 해당 기간의 플랜 제목/날짜/내용/카테고리를 AI에게 전달하여 순위, 이유, 예상 소요 시간을 반환받아 화면에 표시한다. 초기 기획의 D-day 기반 알고리즘 방식에서 AI 기반 분석 방식으로 변경되었다."],
        ["자격증 추천 기능 (qualifications)", "IT/개발, 어학, 금융/회계 등 10개 분야 중 관심 분야를 체크박스로 선택하면 AI가 대학생에게 적합한 공인 자격증과 시험 일정, 난이도, 준비 기간을 추천한다. 마음에 드는 자격증은 바로 플랜 카드에 추가할 수 있다."],
        ["Priority 체크리스트 기능", "오늘 기준 또는 기간 선택으로 플랜을 필터링하여 체크리스트 형태로 표시한다. 날짜순 정렬과 직접 드래그로 순서를 변경할 수 있으며, 5/10/15개 단위로 표시 개수를 설정할 수 있다."],
        ["배경 커스터마이징 (background)", "배경색은 사전 정의된 색상 팔레트 또는 직접 색상 피커로 변경할 수 있다. 이미지 업로드 시 배경에 랜덤 위치로 배치되며, 마우스 패럴랙스 효과가 동일하게 적용된다. 초기 기획의 폰트 변경 기능은 미구현 상태이다."],
        ["Timeline 애니메이션", "Timeline 메뉴 클릭 시 플랜 카드들이 위에서 아래로 순차적으로 떨어지는 드롭 애니메이션 효과가 적용된다."],
        ["플랜 카드 드래그", "플랜 카드를 마우스로 드래그하여 원하는 위치로 이동할 수 있으며, 변경된 위치는 Firestore에 저장되어 새로고침 후에도 유지된다."],
      ].map(([title, desc], i) => (
        <div key={i} style={{ marginBottom: "12px" }}>
          <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "3px" }}>{i + 1}. {title}</p>
          <p style={{ fontSize: "13px", lineHeight: "1.9", color: "#333", marginLeft: "12px" }}>{desc}</p>
        </div>
      ))}

      {/* 4. 기획 vs 실제 비교 */}
      <h3 style={{ marginBottom: "8px", fontSize: "15px", borderBottom: "1px solid #000", paddingBottom: "4px", marginTop: "20px" }}>4. 기획 대비 변경 사항</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px", fontSize: "12px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>기획</th>
            <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>실제 구현</th>
            <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>변경 이유</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Left Sidebar (우선순위/추천)", "상단 nav 버튼 방식", "UI 간소화 및 공간 효율"],
            ["D-day 기반 알고리즘 우선순위", "AI API 기반 분석", "더 유연한 분석 가능"],
            ["MySQL 또는 Firebase 선택", "Firebase Firestore", "빠른 구현 및 실시간 동기화"],
            ["localStorage 데이터 저장", "Firebase Firestore", "계정별 데이터 관리 필요"],
            ["Context API 전역 상태 관리", "컴포넌트 단위 useState", "구조 단순화"],
            ["배경/폰트 사용자 설정", "배경만 구현 (폰트 미구현)", "시간 부족"],
            ["Find ID/PW 기능", "미구현", "시간 부족"],
            ["시간표 입력/공부시간 추천", "미구현", "시간 부족, 추후 구현 예정"],
            ["Anthropic Claude API", "Groq llama-3.1-8b-instant", "CORS 및 키 발급 문제"],
            ["플랜카드 고정 랜덤 배치", "드래그로 직접 이동", "사용자 편의성 향상"],
          ].map(([a, b, c], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ padding: "7px", border: "1px solid #ddd", color: "#666" }}>{a}</td>
              <td style={{ padding: "7px", border: "1px solid #ddd" }}>{b}</td>
              <td style={{ padding: "7px", border: "1px solid #ddd", color: "#888" }}>{c}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 5. 트러블슈팅 */}
      <h3 style={{ marginBottom: "8px", fontSize: "15px", borderBottom: "1px solid #000", paddingBottom: "4px" }}>5. 주요 트러블슈팅</h3>
      <p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "20px", color: "#333" }}>
        개발 과정에서 GitHub Push Protection으로 인한 API 키 노출 문제, 브라우저 CORS 정책으로 인한 AI API 호출 불가 문제, Firebase .env 파일 위치 오류 및 중복 초기화 문제, Vercel 환경변수 설정 오류, 마우스 이벤트가 브라우저 창 밖에서도 동작하는 문제 등을 해결하였다. 각 문제는 commit 기록 초기화, Vercel Serverless Function 도입, getApps() 조건 추가, document 이벤트 리스너 변경 및 visibilitychange 이벤트 추가 등으로 해결하였다.
      </p>

<h3 style={{ marginBottom: "8px", fontSize: "15px", borderBottom: "1px solid #000", paddingBottom: "4px", marginTop: "20px" }}>7. 모바일 페이지 구현</h3>
<p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "12px", color: "#333" }}>
  데스크탑 전용으로 개발된 bemove를 모바일 환경에서도 사용할 수 있도록 별도 모바일 페이지(DashboardMobile.jsx)를 구현하였다. App.jsx에서 window.innerWidth 768px 미만일 경우 자동으로 모바일 페이지로 분기되며, resize 이벤트를 감지하여 화면 크기 변경 시에도 자동으로 전환된다.
</p>

<p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>7.1 데스크탑과의 주요 차이점</p>
<table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "16px", fontSize: "12px" }}>
  <thead>
    <tr style={{ background: "#f0f0f0" }}>
      <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>데스크탑</th>
      <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>모바일</th>
    </tr>
  </thead>
  <tbody>
    {[
      ["마우스 패럴랙스 배경 이동", "제거 (터치 환경 불필요)"],
      ["플랜카드 자유 배치/드래그", "날짜순 리스트 형태로 표시"],
      ["상단 nav 버튼 가로 나열", "햄버거 메뉴(☰) → 오른쪽 사이드 패널"],
      ["마우스로 가로 스크롤", "스와이프로 월 이동"],
      ["모달 고정 크기", "92vw 반응형 모달"],
    ].map(([a, b], i) => (
      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
        <td style={{ padding: "7px", border: "1px solid #ddd", color: "#666" }}>{a}</td>
        <td style={{ padding: "7px", border: "1px solid #ddd" }}>{b}</td>
      </tr>
    ))}
  </tbody>
</table>

<p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>7.2 구현 기능</p>
<p style={{ fontSize: "13px", lineHeight: "1.9", marginBottom: "16px", color: "#333" }}>
  스와이프로 월 이동(touchstart/touchend, dx 50px 이상), 햄버거 메뉴에서 priority/timeline/qualifications/background/ai recommend priority/로그인/예시 데이터 삭제 기능을 제공한다. 비로그인 상태에서도 플랜 추가가 가능하며 로그인 후 Firestore에 자동 동기화된다. 카테고리별 색상으로 플랜을 구분하여 가독성을 높였다.
</p>

<p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>7.3 향후 개선 사항</p>
<p style={{ fontSize: "13px", lineHeight: "1.9", color: "#333" }}>
  모바일 페이지는 기본 기능을 구현하였으나 데스크탑과의 UI 일관성 개선 및 터치 인터랙션 고도화가 필요하다. 플랜 카드 수정 기능, 푸시 알림, PWA 지원 등을 추가하여 네이티브 앱에 가까운 경험을 제공할 계획이다.
</p>
      {/* 6. 향후 개선 */}
      <h3 style={{ marginBottom: "8px", fontSize: "15px", borderBottom: "1px solid #000", paddingBottom: "4px" }}>6. 향후 개선 사항</h3>
<p style={{ fontSize: "13px", lineHeight: "1.9", color: "#333", marginBottom: "16px" }}>
  현재 기본 구조만 구현된 모바일 전용 페이지를 완성하고, 기획 단계에서 포함되었던 폰트 커스터마이징, 시간표 입력 및 공부 시간 추천 기능을 추가할 예정이다. 또한 Find ID/PW 기능, 구글 소셜 로그인 추가, 플랜카드 날짜순 정렬 고도화, 다국어 지원 등을 통해 더 많은 사용자가 편리하게 사용할 수 있도록 개선할 계획이다.
</p>

    </div>
  );
}