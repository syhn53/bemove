import { useEffect, useRef, useState, useMemo } from "react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function EditModal({ plan, onUpdate, onDelete, onClose }) {
  const [form, setForm] = useState({ ...plan });

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const times = [];
  for (let h = 8; h <= 21; h++) {
    times.push(`${String(h).padStart(2,"0")}:00`);
    times.push(`${String(h).padStart(2,"0")}:30`);
  }
  const categories = ["Lecture", "Workshop", "Performance", "Other"];

  const selectStyle = { padding: "4px 6px", border: "1px solid #000", background: "#fff", fontSize: "12px" };
  const inputStyle = { padding: "4px 6px", border: "1px solid #000", fontSize: "12px", width: "100%" };

  const handleSave = () => {
    const date = form.startTime
      ? `${form.month} ${form.day}, ${form.startTime}${form.endTime ? `-${form.endTime}` : ""}`
      : `${form.month} ${form.day}`;
    onUpdate({ ...form, date });
  };

  return (
    <div style={{ background: "#fff", width: "400px", padding: "28px 24px", position: "relative" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 12, right: 14, border: "none", background: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
      <h3 style={{ margin: "0 0 12px 0" }}>Edit Plan</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <select style={selectStyle} value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}>
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select style={selectStyle} value={form.day || "1"} onChange={(e) => setForm({ ...form, day: e.target.value })}>
            {days.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <select style={selectStyle} value={form.startTime || ""} onChange={(e) => setForm({ ...form, startTime: e.target.value })}>
            <option value="">미입력</option>
            {times.map((t) => <option key={t}>{t}</option>)}
          </select>
          <span style={{ fontSize: "12px" }}>~</span>
          <select style={selectStyle} value={form.endTime || ""} onChange={(e) => setForm({ ...form, endTime: e.target.value })}>
            <option value="">미입력</option>
            {times.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
        <textarea style={{ ...inputStyle, height: "60px", resize: "none" }} value={form.contents || ""} onChange={(e) => setForm({ ...form, contents: e.target.value })} placeholder="Contents" />
        <select style={selectStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleSave} style={{ flex: 1, background: "#000", color: "#fff", padding: "6px", border: "none", cursor: "pointer" }}>저장</button>
          <button onClick={() => onDelete(plan.id, plan.firestoreId)} style={{ flex: 1, background: "#ff3333", color: "#fff", padding: "6px", border: "none", cursor: "pointer" }}>삭제</button>
        </div>
      </div>
    </div>
  );
}

export default function PlanCards({ plans = [], onUpdate, onDelete }) {
  const [activeMonth, setActiveMonth] = useState("January");
  const [editingPlan, setEditingPlan] = useState(null);
  const containerRef = useRef(null);
  const scrollRef = useRef(0);
  const targetRef = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    scrollRef.current = 0;
  }, [activeMonth]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientX < 0 || e.clientX > window.innerWidth) {
        targetRef.current = 0;
        return;
      }
      const x = e.clientX / window.innerWidth;
      if (x > 0.7) {
        targetRef.current = ((x - 0.7) / 0.3) * 8;
      } else if (x < 0.3) {
        targetRef.current = -(((0.3 - x) / 0.3) * 8);
      } else {
        targetRef.current = 0;
      }
    };

    const handleMouseLeave = () => {
      targetRef.current = 0;
    };

    const animate = () => {
      scrollRef.current += targetRef.current;
      scrollRef.current = Math.max(0, scrollRef.current);
      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${-scrollRef.current}px)`;
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const filtered = plans
    .filter((p) => p.month === activeMonth)
    .sort((a, b) => parseInt(a.day || 1) - parseInt(b.day || 1));

  // 날짜별 그룹핑 — useMemo로 고정
const { dayGroups, uniqueDays, dayPositions } = useMemo(() => {
  const groups = {};
  filtered.forEach((plan) => {
    const day = plan.day || "1";
    if (!groups[day]) groups[day] = [];
    groups[day].push(plan);
  });

  const days = Object.keys(groups).sort((a, b) => parseInt(a) - parseInt(b));

  // ⭐ 랜덤이지만 겹치지 않게
  const positions = {};
  days.forEach((day) => {
    const usedX = Object.values(positions);
    let x;
    let attempts = 0;
    do {
      x = Math.floor(Math.random() * 2400) + 50;
      attempts++;
    } while (usedX.some(ux => Math.abs(ux - x) < 320) && attempts < 50);
    positions[day] = x;
  });

  return { dayGroups: groups, uniqueDays: days, dayPositions: positions };
}, [activeMonth, plans.length]);

  return (
    <>
      {/* 월 버튼 */}
      <div style={{
        position: "fixed",
        top: "60px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "6px",
        zIndex: 50,
        whiteSpace: "nowrap",
      }}>
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setActiveMonth(m)}
            style={{
              background: activeMonth === m ? "#000" : "#fff",
              color: activeMonth === m ? "#fff" : "#000",
              border: "1px solid #000",
              padding: "2px 8px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* 카드 */}
      <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0, width: "3000px" }}>

        {/* 세로 구분선 */}
        {uniqueDays.map((day) => (
          <div
            key={day}
            style={{
              position: "absolute",
              left: `${dayPositions[day] + 300}px`,
              top: 0,
              width: "1px",
              height: "100vh",
              background: "rgba(0,0,0,0.15)",
            }}
          />
        ))}

        {/* 카드 */}
        {uniqueDays.map((day) =>
          dayGroups[day].map((plan, cardIdx) => (
            <div
              key={plan.id}
              className="plan-card"
              style={{
                position: "absolute",
                top: `${150 + cardIdx * 140}px`,
                left: `${dayPositions[day]}px`,
                cursor: "pointer",
                pointerEvents: "auto",
              }}
              onClick={() => setEditingPlan(plan)}
            >
              <p className="plan-date">*****{plan.date}</p>
              <p className="plan-title">{plan.title}</p>
              <p className="plan-person">{plan.contents}</p>
              <p className="plan-category">((((( {plan.category} )))))</p>
            </div>
          ))
        )}
      </div>

      {/* 수정 모달 */}
      {editingPlan && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center"
        }} onClick={(e) => e.target === e.currentTarget && setEditingPlan(null)}>
          <EditModal
            plan={editingPlan}
            onUpdate={(p) => { onUpdate(p); setEditingPlan(null); }}
            onDelete={(id, firestoreId) => { onDelete(id, firestoreId); setEditingPlan(null); }}
            onClose={() => setEditingPlan(null)}
          />
        </div>
      )}
    </>
  );
}