import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where } from "firebase/firestore";
import Priority from "./panels/priority";
import Qualifications from "./panels/Qualifications";
import Ai from "./panels/ai recommed priotity";
import Background from "./panels/background";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SAMPLE_PLANS = [
  { id: "s1", top: 0, left: 0, date: "January 8", month: "January", day: "8", title: "Fantasies for Knowledge", contents: "상상력과 지식의 관계에 대한 강연", category: "Lecture" },
  { id: "s2", top: 0, left: 0, date: "January 14", month: "January", day: "14", title: "[자격증] TOEIC", contents: "토익 정기시험 / 시험일정: 매월 / 준비기간: 2-3개월", category: "Other" },
  { id: "s3", top: 0, left: 0, date: "January 20", month: "January", day: "20", title: "[자격증] 컴퓨터활용능력 1급", contents: "상시시험 / 준비기간: 3-6개월", category: "Other" },
  { id: "s4", top: 0, left: 0, date: "February 6", month: "February", day: "6", title: "Tracing my Lover's Wrinkles", contents: "비선형적 방식으로 흔적 추적하기", category: "Lecture" },
  { id: "s5", top: 0, left: 0, date: "March 5", month: "March", day: "5", title: "Nuclear Afterlives", contents: "방사성 생태학에 대한 연구", category: "Lecture" },
];

function Modal({ onClose, children, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", width: wide ? "92vw" : "300px", maxHeight: "85vh", overflowY: "auto", padding: "24px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 10, right: 12, border: "none", background: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
        {children}
      </div>
    </div>
  );
}

function LoginModal({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h3 style={{ margin: "0 0 16px 0" }}>{isSignup ? "회원가입" : "로그인"}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "8px", border: "1px solid #000", fontSize: "14px" }} />
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px", border: "1px solid #000", fontSize: "14px" }} />
        {error && <p style={{ color: "red", fontSize: "11px", margin: 0 }}>{error}</p>}
        <button onClick={handleSubmit} style={{ background: "#000", color: "#fff", padding: "10px", border: "none", cursor: "pointer", fontSize: "14px" }}>
          {isSignup ? "가입하기" : "로그인"}
        </button>
        <button onClick={() => setIsSignup(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", textDecoration: "underline" }}>
          {isSignup ? "로그인하기" : "회원가입하기"}
        </button>
      </div>
    </Modal>
  );
}

function AddPlanModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ month: "January", day: "1", title: "", contents: "", category: "Lecture" });
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const categories = ["Lecture", "Workshop", "Performance", "Other"];
  const selectStyle = { padding: "8px", border: "1px solid #000", fontSize: "14px", width: "100%" };

  const handleSubmit = () => {
    if (!form.title) return;
    onAdd({ ...form, date: `${form.month} ${form.day}`, id: Date.now() });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h3 style={{ margin: "0 0 16px 0" }}>Add Plan</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <select style={{ ...selectStyle, flex: 2 }} value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}>
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select style={{ ...selectStyle, flex: 1 }} value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>
            {days.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ padding: "8px", border: "1px solid #000", fontSize: "14px" }} />
        <textarea placeholder="Contents" value={form.contents} onChange={(e) => setForm({ ...form, contents: e.target.value })}
          style={{ padding: "8px", border: "1px solid #000", fontSize: "14px", height: "60px", resize: "none" }} />
        <select style={selectStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button onClick={handleSubmit} style={{ background: "#000", color: "#fff", padding: "10px", border: "none", cursor: "pointer", fontSize: "14px" }}>
          추가
        </button>
      </div>
    </Modal>
  );
}

export default function DashboardMobile() {
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [samplePlans, setSamplePlans] = useState(SAMPLE_PLANS);
  const [bgImages, setBgImages] = useState([]);
  const [bgColor, setBgColor] = useState("#bee6ab");
  const [activeMonth, setActiveMonth] = useState("January");
  const [showMenu, setShowMenu] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const q = query(collection(db, "plans"), where("uid", "==", u.uid));
        const snapshot = await getDocs(q);
        const loaded = snapshot.docs.map((d) => ({ ...d.data(), firestoreId: d.id }));
        setPlans(loaded);
      } else {
        setPlans([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const addPlan = async (newPlan) => {
    const plan = { ...newPlan, top: 0, left: 0 };
    if (user) {
      const docRef = await addDoc(collection(db, "plans"), { ...plan, uid: user.uid });
      setPlans((prev) => [...prev, { ...plan, firestoreId: docRef.id }]);
    } else {
      setPlans((prev) => [...prev, { ...plan, id: Date.now() }]);
    }
  };

  const updatePlan = async (updatedPlan) => {
    if (!updatedPlan.firestoreId) {
      setPlans((prev) => prev.map((p) => p.id === updatedPlan.id ? updatedPlan : p));
      return;
    }
    const ref = doc(db, "plans", updatedPlan.firestoreId);
    await updateDoc(ref, updatedPlan);
    setPlans((prev) => prev.map((p) => p.firestoreId === updatedPlan.firestoreId ? updatedPlan : p));
  };

  const deletePlan = async (plan) => {
    if (plan.firestoreId) {
      await deleteDoc(doc(db, "plans", plan.firestoreId));
      setPlans((prev) => prev.filter((p) => p.firestoreId !== plan.firestoreId));
    } else if (String(plan.id).startsWith("s")) {
      setSamplePlans((prev) => prev.filter((p) => p.id !== plan.id));
    } else {
      setPlans((prev) => prev.filter((p) => p.id !== plan.id));
    }
  };

  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      const currentIdx = months.indexOf(activeMonth);
      if (dx < 0 && currentIdx < 11) setActiveMonth(months[currentIdx + 1]);
      if (dx > 0 && currentIdx > 0) setActiveMonth(months[currentIdx - 1]);
    }
    setTouchStartX(null);
  };

  const openModal = (key) => { setActiveModal(key); setShowMenu(false); };

  const allPlans = [...samplePlans, ...plans];
  const filtered = allPlans
    .filter((p) => p.month === activeMonth)
    .sort((a, b) => parseInt(a.day || 1) - parseInt(b.day || 1));

  const categoryColor = {
    "Lecture": "#000",
    "Workshop": "#4a4a8a",
    "Performance": "#8a4a6a",
    "Other": "#4a7a4a",
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: bgColor, minHeight: "100vh" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>

      {/* NAV */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px" }}>
        <span style={{ fontSize: "28px", color: "dimgray" }}>bemove</span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => openModal("addplan")}
            style={{ background: "#000", color: "#fff", border: "none", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>
            + add
          </button>
          <button onClick={() => setShowMenu((v) => !v)}
            style={{ background: "#fff", border: "1px solid #000", padding: "6px 10px", fontSize: "16px", cursor: "pointer" }}>
            ☰
          </button>
        </div>
      </div>

      {/* 로그인 안내 */}
      {!user && (
        <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.35)", textAlign: "right", margin: "0 16px 8px 0" }}>
          일정을 저장하려면 로그인하세요
        </p>
      )}

      {/* 월 선택 */}
      <div style={{ display: "flex", overflowX: "auto", gap: "6px", padding: "0 16px 12px", scrollbarWidth: "none" }}>
        {months.map((m) => (
          <button key={m} onClick={() => setActiveMonth(m)}
            style={{
              background: activeMonth === m ? "#000" : "#fff",
              color: activeMonth === m ? "#fff" : "#000",
              border: "1px solid #000",
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: "12px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}>
            {m.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* 월 표시 */}
      <div style={{ padding: "0 16px 8px" }}>
        <p style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>{activeMonth}</p>
        <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.3)", margin: "2px 0 0" }}>← 스와이프로 월을 이동할 수 있어요</p>
      </div>

      {/* 일정 목록 */}
      <div style={{ padding: "0 16px", paddingBottom: "80px" }}>
        {filtered.length === 0 && (
          <p style={{ fontSize: "13px", color: "#888", marginTop: "20px" }}>이번 달 일정이 없어요</p>
        )}
        {filtered.map((plan) => (
          <div key={plan.id} style={{
            background: "#fff",
            padding: "12px 14px",
            marginBottom: "10px",
            borderLeft: `3px solid ${categoryColor[plan.category] || "#000"}`,
          }}>
            <p style={{ margin: "0 0 2px 0", fontSize: "10px", color: "#888" }}>{plan.date}</p>
            <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "bold" }}>{plan.title}</p>
            {plan.contents && <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>{plan.contents}</p>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
              <span style={{ fontSize: "10px", color: categoryColor[plan.category] || "#000", border: `1px solid ${categoryColor[plan.category] || "#000"}`, padding: "1px 6px" }}>
                {plan.category}
              </span>
              <button onClick={() => deletePlan(plan)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#aaa" }}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 사이드 메뉴 */}
      {showMenu && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 200 }}
            onClick={() => setShowMenu(false)} />
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: "220px",
            background: "#fff", zIndex: 201, padding: "20px 16px",
            display: "flex", flexDirection: "column", gap: "10px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>menu</span>
              <button onClick={() => setShowMenu(false)} style={{ border: "none", background: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>
            {[
              { key: "priority", label: "priority" },
              { key: "timeline", label: "timeline" },
              { key: "qualifications", label: "qualifications" },
              { key: "background", label: "background" },
              { key: "ai", label: "ai recommend priority" },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => openModal(key)}
                style={{ background: "#fff", border: "1px solid #000", padding: "10px 12px", cursor: "pointer", fontSize: "13px", textAlign: "left" }}>
                {label}
              </button>
            ))}
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              <button onClick={() => { setSamplePlans([]); setShowMenu(false); }}
                style={{ background: "#fff", border: "1px solid #000", padding: "10px 12px", cursor: "pointer", fontSize: "13px", textAlign: "left" }}>
                예시 데이터 삭제
              </button>
              <button onClick={() => { user ? signOut(auth) : openModal("login"); }}
                style={{ background: "#000", color: "#fff", border: "none", padding: "10px 12px", cursor: "pointer", fontSize: "13px", textAlign: "left" }}>
                {user ? `logout (${user.email.split("@")[0]})` : "login"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 모달들 */}
      {activeModal === "addplan" && <AddPlanModal onClose={() => setActiveModal(null)} onAdd={addPlan} />}
      {activeModal === "login" && <LoginModal onClose={() => setActiveModal(null)} />}

      {activeModal === "priority" && (
        <Modal onClose={() => setActiveModal(null)} wide>
          <Priority plans={allPlans} />
        </Modal>
      )}
      {activeModal === "qualifications" && (
        <Modal onClose={() => setActiveModal(null)} wide>
          <Qualifications onAdd={(plan) => { addPlan(plan); setActiveModal(null); }} />
        </Modal>
      )}
      {activeModal === "ai" && (
        <Modal onClose={() => setActiveModal(null)} wide>
          <Ai plans={allPlans} />
        </Modal>
      )}
      {activeModal === "background" && (
        <Modal onClose={() => setActiveModal(null)} wide>
          <Background
            onAddImage={(img) => setBgImages((prev) => [...prev, img])}
            onColorChange={setBgColor}
            onUpdateImage={(img) => setBgImages((prev) => prev.map((i) => i.id === img.id ? img : i))}
            onDeleteImage={(id) => setBgImages((prev) => prev.filter((i) => i.id !== id))}
            images={bgImages}
          />
        </Modal>
      )}
      {activeModal === "timeline" && (
        <Modal onClose={() => setActiveModal(null)} wide>
          <div style={{ padding: "10px" }}>
            <h3 style={{ marginBottom: "12px" }}>Timeline</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {allPlans
                .sort((a, b) => months.indexOf(a.month) * 31 + parseInt(a.day || 1) - (months.indexOf(b.month) * 31 + parseInt(b.day || 1)))
                .map((plan) => (
                  <div key={plan.id} style={{ padding: "10px", border: "1px solid #000", display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#888", whiteSpace: "nowrap" }}>{plan.date}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold" }}>{plan.title}</p>
                      <p style={{ margin: 0, fontSize: "11px", color: "#666" }}>{plan.category}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}