import { useState } from "react";

const months = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

export default function Ai({ plans = [] }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startMonth, setStartMonth] = useState("January");
  const [endMonth, setEndMonth] = useState("December");

  const selectStyle = {
    padding: "4px 6px",
    border: "1px solid #000",
    background: "#fff",
    fontSize: "12px",
  };

  const analyze = async () => {
    const startIdx = months.indexOf(startMonth);
    const endIdx = months.indexOf(endMonth);
    const filtered = plans.filter((p) => {
      const idx = months.indexOf(p.month);
      return idx >= startIdx && idx <= endIdx;
    });

    if (!filtered.length) {
      alert("해당 기간에 일정이 없어요!");
      return;
    }

    setLoading(true);
    setResult(null);

    const planText = filtered.map((p, i) =>
      `${i + 1}. 제목: ${p.title}, 날짜: ${p.date}, 내용: ${p.contents || "없음"}, 카테고리: ${p.category}`
    ).join("\n");

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
      messages: [{ role: "user", content: `다음 일정 목록을 분석해서 우선순위를 매겨주세요. JSON 형식으로만 응답하고 다른 텍스트는 절대 포함하지 마세요. 형식: [{"rank": 1, "title": "제목", "reason": "이유", "estimatedTime": "예상 시간"}]\n\n${planText}` }],
      temperature: 0.7,
    })
  });
  const data = await response.json();
  const text = data.choices[0].message.content;
  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  setResult(parsed);
} catch (e) {
  alert("분석 중 오류가 발생했어요.");
}

setLoading(false);
  };

  return (
    <div style={{ padding: "16px" }}>
      <h3 style={{ marginBottom: "12px" }}>AI 우선순위 분석</h3>

      {/* 기간 선택 */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
        <select style={selectStyle} value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
          {months.map((m) => <option key={m}>{m}</option>)}
        </select>
        <span style={{ fontSize: "12px" }}>~</span>
        <select style={selectStyle} value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
          {months.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      <button
        onClick={analyze}
        disabled={loading}
        style={{ background: "#000", color: "#fff", padding: "6px 14px", border: "none", cursor: "pointer", marginBottom: "16px" }}
      >
        {loading ? "분석 중..." : "분석 시작"}
      </button>

      {!result && !loading && (
        <p style={{ fontSize: "12px", color: "#666" }}>기간을 선택하고 분석 시작을 눌러주세요.</p>
      )}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {result.map((item) => (
            <div key={item.rank} style={{ border: "1px solid #000", padding: "10px" }}>
              <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>#{item.rank} {item.title}</p>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px" }}>⏱ 예상 시간: {item.estimatedTime}</p>
              <p style={{ margin: 0, fontSize: "12px", color: "#444" }}>{item.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}