export default function Report() {
  return (
    <div>
      <h2 style={{ marginBottom: "24px", fontSize: "20px" }}>BEMOVE 프로젝트 개발 보고서</h2>

      <h3 style={{ marginBottom: "8px", fontSize: "15px" }}>1. 프로젝트 개요</h3>
      <p style={{ fontSize: "13px", lineHeight: "1.8", marginBottom: "20px", color: "#333" }}>
        본 프로젝트 bemove는 대학생을 위한 일정 관리 및 AI 기반 우선순위 분석 웹 애플리케이션이다. 기존의 단순한 캘린더 형태에서 벗어나, 플랜 카드를 배경 화면 위에 자유롭게 배치하고 마우스 패럴랙스 효과를 통해 시각적으로 풍부한 경험을 제공하는 것을 목표로 하였다. 또한 AI를 활용하여 등록된 일정의 우선순위를 자동으로 분석하고, 대학생에게 적합한 자격증을 추천하는 기능을 포함한다.
      </p>

      <h3 style={{ marginBottom: "8px", fontSize: "15px" }}>2. 기술 스택 및 구현 방법</h3>

      <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>2.1 Frontend — React + Vite</p>
      <p style={{ fontSize: "13px", lineHeight: "1.8", marginBottom: "14px", color: "#333" }}>
        UI 전체는 React로 구성하였으며, Vite를 번들러로 사용하였다. 컴포넌트 구조는 Dashboard.jsx를 메인으로 하여 각 패널을 별도 컴포넌트로 분리하였다. 모달은 React의 createPortal을 활용하여 z-index 충돌 문제를 해결하였다. 마우스 패럴랙스 효과는 requestAnimationFrame과 lerp 함수를 조합하여 구현하였으며, 플랜 카드 드래그는 이동 거리 3px 이상일 때만 드래그로 판별하도록 처리하였다.
      </p>

      <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>2.2 Database — Firebase Firestore</p>
      <p style={{ fontSize: "13px", lineHeight: "1.8", marginBottom: "14px", color: "#333" }}>
        초기에는 localStorage로 데이터를 저장하였으나, 기기 간 동기화 및 계정별 데이터 분리가 필요하여 Firestore로 마이그레이션하였다. 플랜 데이터는 사용자 UID를 기준으로 쿼리하여 본인 데이터만 불러오도록 구현하였으며, 카드 드래그 후 위치 변경 시에도 Firestore에 top/left 값이 저장되어 새로고침 후에도 위치가 유지된다.
      </p>

      <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>2.3 인증 — Firebase Authentication</p>
      <p style={{ fontSize: "13px", lineHeight: "1.8", marginBottom: "14px", color: "#333" }}>
        로그인 및 회원가입은 Firebase Authentication의 이메일/비밀번호 방식을 사용하였다. onAuthStateChanged로 로그인 상태를 실시간으로 감지하며, 로그인 시 해당 유저의 플랜 데이터를 자동으로 불러오고 로그아웃 시 데이터를 초기화한다.
      </p>

      <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>2.4 AI — Groq API (llama-3.1-8b-instant)</p>
      <p style={{ fontSize: "13px", lineHeight: "1.8", marginBottom: "20px", color: "#333" }}>
        AI 기능은 Groq의 llama-3.1-8b-instant 모델을 사용하였다. Anthropic Claude는 CORS 문제, Google Gemini는 한국에서 키 발급 불가로 인해 최종적으로 Groq를 선택하였다. 로컬 환경에서는 Vite proxy, 배포 환경에서는 Vercel Serverless Function으로 CORS 문제를 해결하였다.
      </p>

      <h3 style={{ marginBottom: "8px", fontSize: "15px" }}>3. 주요 기능</h3>
      <p style={{ fontSize: "13px", lineHeight: "1.8", marginBottom: "20px", color: "#333" }}>
        플랜 카드 추가/수정/삭제/드래그 이동, 월별 일정 관리, AI 우선순위 분석(기간 선택), AI 자격증 추천(분야별 선택 후 플랜 추가 가능), 배경 커스터마이징(색상/이미지 업로드), 로그인 후 Firestore 데이터 동기화, Timeline 클릭 시 카드 드롭 애니메이션, Settings에서 예시 데이터 일괄 삭제 기능을 구현하였다.
      </p>

      <h3 style={{ marginBottom: "8px", fontSize: "15px" }}>4. 주요 트러블슈팅</h3>
      <p style={{ fontSize: "13px", lineHeight: "1.8", marginBottom: "20px", color: "#333" }}>
        개발 과정에서 GitHub Push Protection으로 인한 API 키 노출 문제, 브라우저 CORS 정책으로 인한 AI API 호출 불가 문제, Firebase .env 파일 위치 오류 및 중복 초기화 문제, Vercel 환경변수 설정 오류, 마우스 이벤트가 브라우저 창 밖에서도 동작하는 문제 등을 해결하였다. 각 문제는 commit 기록 초기화, Serverless Function 도입, getApps() 조건 추가, document 이벤트 리스너 변경 등으로 해결하였다.
      </p>

      <h3 style={{ marginBottom: "8px", fontSize: "15px" }}>5. 향후 개선 사항</h3>
      <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#333" }}>
        현재 기본 구조만 구현된 모바일 전용 페이지를 완성하고, 폰트 커스터마이징 기능을 추가할 예정이다. 또한 플랜카드 날짜순 정렬 고도화, 구글 소셜 로그인 추가, 다국어 지원 등을 통해 더 많은 사용자가 편리하게 사용할 수 있도록 개선할 계획이다.
      </p>
    </div>
  );
}