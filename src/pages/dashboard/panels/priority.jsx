import { useState } from "react";

const months = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const days = Array.from({ length: 31 }, (_, i) => String(i + 1));

export default function Priority({ plans = [] }) {
  const [mode, setMode] = useState("date");
  const [count, setCount] = useState(5);
  const [checked, setChecked] = useState({});
  const [manualPlans, setManualPlans] = useState([]);
  const [dragIdx, setDragIdx] = useState(null);

  // 기간 선택
  const [rangeMode, setRangeMode] = useState("today"); // "today" | "range"
  const [startMonth, setStartMonth] = useState("January");
  const [startDay, setStartDay] = useState("1");
  const [endMonth, setEndMonth] = useState("December");
  const [endDay, setEndDay] = useState("31");

  const today = new Date();
  const todayMonth = months[today.getMonth()];
  const todayDay = String(today.getDate());

  const filterPlans = (list) => {
    if (rangeMode === "today") {
      return list.filter((p) => p.month === todayMonth && p.day === todayDay);
    } else {
      const startIdx = months.indexOf(startMonth) * 31 + parseInt(startDay);
      const endIdx = months.indexOf(endMonth) * 31 + parseInt(endDay);
      return list.filter((p) => {
        const idx = months.indexOf(p.month) * 31 + parseInt(p.day || 1);
        return idx >= startIdx && idx <= endIdx;
      });
    }
  };

  const sorted = filterPlans([...plans]).sort((a, b) => {
    return (months.indexOf(a.month) * 31 + parseInt(a.day || 1)) -
           (months.indexOf(b.month) * 31 + parseInt(b.day || 1));
  }).slice(0, count);

  const displayed = mode === "date" ? sorted : manualPlans;

  const handleMode = (m) => {
    setMode(m);
    if (m === "manual" && manualPlans.length === 0) {
      setManualPlans(sorted);
    }
  };

  const handleRangeMode = (m) => {
    setRangeMode(m);
    setManualPlans([]);
  };

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...manualPlans];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    setManualPlans(next);
    setDragIdx(idx);
  };

  const toggleCheck = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectStyle = { padding: "3px 6px", border: "1px solid #000", background: "#fff", fontSize: "12px" };
  const btnStyle = (active) => ({
    background: active ? "#000" : "#fff",
    color: active ? "#fff" : "#000",
    border: "1px solid #000",
    padding: "2px 10px",
    cursor: "pointer",
    fontSize: "12px",
  });

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "14px" }}>Priority</h3>

      {/* 날짜 기준 선택 */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "center" }}>
        <button onClick={() => handleRangeMode("today")} style={btnStyle(rangeMode === "today")}>오늘 기준</button>
        <button onClick={() => handleRangeMode("range")} style={btnStyle(rangeMode === "range")}>기간 선택</button>
      </div>

      {/* 기간 선택 */}
      {rangeMode === "range" && (
        <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "10px", flexWrap: "wrap" }}>
          <select style={selectStyle} value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select style={selectStyle} value={startDay} onChange={(e) => setStartDay(e.target.value)}>
            {days.map((d) => <option key={d}>{d}</option>)}
          </select>
          <span style={{ fontSize: "12px" }}>~</span>
          <select style={selectStyle} value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select style={selectStyle} value={endDay} onChange={(e) => setEndDay(e.target.value)}>
            {days.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      )}

      {/* 정렬 + 개수 */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => handleMode("date")} style={btnStyle(mode === "date")}>날짜순</button>
        <button onClick={() => handleMode("manual")} style={btnStyle(mode === "manual")}>직접 설정</button>
        <span style={{ fontSize: "12px", marginLeft: "8px" }}>개수:</span>
        {[5, 10, 15].map((n) => (
          <button key={n} onClick={() => setCount(n)} style={btnStyle(count === n)}>{n}</button>
        ))}
      </div>

      {/* 체크리스트 */}
      {displayed.length === 0 && (
        <p style={{ fontSize: "12px", color: "#666" }}>해당 기간에 플랜이 없어요!</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {displayed.map((plan, idx) => (
          <div
            key={plan.id}
            draggable={mode === "manual"}
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 10px",
              border: "1px solid #000",
              background: checked[plan.id] ? "#f0f0f0" : "#fff",
              cursor: mode === "manual" ? "grab" : "default",
              opacity: checked[plan.id] ? 0.5 : 1,
            }}
          >
            <input
              type="checkbox"
              checked={!!checked[plan.id]}
              onChange={() => toggleCheck(plan.id)}
              style={{ cursor: "pointer", width: "14px", height: "14px" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "13px", textDecoration: checked[plan.id] ? "line-through" : "none" }}>
                {idx + 1}. {plan.title}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#666" }}>{plan.date} · {plan.category}</p>
            </div>
            {mode === "manual" && (
              <span style={{ color: "#aaa", fontSize: "16px" }}>☰</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}