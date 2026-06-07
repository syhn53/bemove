import { useState } from "react";

export default function AddPlan({ onAdd }) {
  const [form, setForm] = useState({
    month: "January",
    day: "1",
    startTime: "",
    endTime: "",
    title: "",
    contents: "",
    category: "Lecture",
  });

  const months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
  const categories = ["Lecture", "Workshop", "Performance", "Other"];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const times = [];
  for (let h = 8; h <= 21; h++) {
    times.push(`${String(h).padStart(2,"0")}:00`);
    times.push(`${String(h).padStart(2,"0")}:30`);
  }

  const handleSubmit = () => {
    if (!form.title) return;
    // ⭐ 시간 없으면 날짜만
    const date = form.startTime
      ? `${form.month} ${form.day}, ${form.startTime}${form.endTime ? `-${form.endTime}` : ""}`
      : `${form.month} ${form.day}`;
    onAdd({
      ...form,
      date,
      top: Math.floor(Math.random() * 300) + 80,
      left: Math.floor(Math.random() * 800) + 100,
    });
    setForm({ month: "January", day: "1", startTime: "", endTime: "", title: "", contents: "", category: "Lecture" });
  };

  const selectStyle = {
    padding: "4px 6px",
    border: "1px solid #000",
    background: "#fff",
    fontSize: "12px",
  };

  const inputStyle = {
    padding: "4px 6px",
    border: "1px solid #000",
    fontSize: "12px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px" }}>
      <h3 style={{ margin: "0 0 8px 0" }}>Add Plan</h3>

      {/* 월 + 일 */}
      <div style={{ display: "flex", gap: "6px" }}>
        <select style={selectStyle} value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}>
          {months.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select style={selectStyle} value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
          {days.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* 시간 (선택 아님) */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <select style={selectStyle} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}>
          <option value="">시간 미입력</option>  {/* ⭐ */}
          {times.map((t) => <option key={t}>{t}</option>)}
        </select>
        <span style={{ fontSize: "12px" }}>~</span>
        <select style={selectStyle} value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}>
          <option value="">미입력</option>  {/* ⭐ */}
          {times.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* 제목 */}
      <input
        style={inputStyle}
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* 내용 */}
      <textarea
        style={{ ...inputStyle, height: "60px", resize: "none" }}
        placeholder="Contents"
        value={form.contents}
        onChange={(e) => setForm({ ...form, contents: e.target.value })}
      />

      {/* 카테고리 */}
      <select style={selectStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {categories.map((c) => <option key={c}>{c}</option>)}
      </select>

      <button onClick={handleSubmit} style={{ background: "#000", color: "#fff", padding: "6px", cursor: "pointer", border: "none" }}>
        Add
      </button>
    </div>
  );
}