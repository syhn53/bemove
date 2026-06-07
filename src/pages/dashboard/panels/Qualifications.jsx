import { useState } from "react";

const fields = [
  "IT/개발", "어학", "금융/회계", "디자인", "마케팅", "경영", "의료/보건", "법률", "건축/토목", "데이터/AI"
];

export default function Qualifications({ onAdd }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleField = (f) => {
    setSelected((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const analyze = async () => {
    if (!selected.length) return alert("분야를 선택해주세요!");
    setLoading(true);
    setResult(null);

    try {
      const url = import.meta.env.DEV
  ? "/api/groq/openai/v1/chat/completions"
  : "/api/groq";

const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [{ role: "user", content: `대학생을 위한 ${selected.join(", ")} 분야 자격증을 추천해주세요. 공인자격증 위주로 추천하고 시험 일정도 포함해주세요. JSON 형식으로만 응답하고 다른 텍스트는 절대 포함하지 마세요. 형식: [{"name": "자격증명", "field": "분야", "description": "간단한 설명", "examDate": "시험 일정 (예: 매년 3월, 6월, 9월)", "difficulty": "난이도 (상/중/하)", "period": "준비 기간"}]` }],
          temperature: 0.7,
        })
      });

      const data = await response.json();
      const text = data.choices[0].message.content;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      alert("추천 중 오류가 발생했어요.");
    }

    setLoading(false);
  };

  const handleAddPlan = (cert) => {
    if (!onAdd) return alert("로그인이 필요해요!");
    onAdd({
      month: "January",
      day: "1",
      startTime: "",
      endTime: "",
      title: `[자격증] ${cert.name}`,
      contents: `${cert.description} / 시험일정: ${cert.examDate} / 준비기간: ${cert.period}`,
      category: "Other",
      top: Math.floor(Math.random() * 300) + 80,
      left: Math.floor(Math.random() * 800) + 100,
    });
    alert(`${cert.name} 플랜에 추가됐어요!`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "14px" }}>자격증 추천</h3>

      <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>관심 분야를 선택하세요:</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
        {fields.map((f) => (
          <label key={f} style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", fontSize: "13px" }}>
            <input
              type="checkbox"
              checked={selected.includes(f)}
              onChange={() => toggleField(f)}
            />
            {f}
          </label>
        ))}
      </div>

      <button
        onClick={analyze}
        disabled={loading}
        style={{ background: "#000", color: "#fff", padding: "6px 14px", border: "none", cursor: "pointer", marginBottom: "16px" }}
      >
        {loading ? "추천 중..." : "자격증 추천받기"}
      </button>

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {result.map((cert, idx) => (
            <div key={idx} style={{ border: "1px solid #000", padding: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: "0 0 4px 0", fontWeight: "bold", fontSize: "14px" }}>{cert.name}</p>
                  <p style={{ margin: "0 0 2px 0", fontSize: "11px", color: "#666" }}>분야: {cert.field} · 난이도: {cert.difficulty} · 준비기간: {cert.period}</p>
                  <p style={{ margin: "0 0 2px 0", fontSize: "12px" }}>{cert.description}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#444" }}>📅 시험일정: {cert.examDate}</p>
                </div>
                <button
                  onClick={() => handleAddPlan(cert)}
                  style={{ background: "#000", color: "#fff", border: "none", padding: "4px 8px", cursor: "pointer", fontSize: "11px", whiteSpace: "nowrap", marginLeft: "10px" }}
                >
                  + 플랜 추가
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!result && !loading && (
        <p style={{ fontSize: "12px", color: "#666" }}>분야를 선택하고 추천받기를 눌러주세요.</p>
      )}
    </div>
  );
}