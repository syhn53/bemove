import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Dashboard.css";

import PlanCards from "./panels/plancards";
import Priority from "./panels/priority";
import Timeline from "./panels/Timeline";
import AddPlan from "./panels/addPlan";
import Qualifications from "./panels/Qualifications";
import Background from "./panels/background";
import Ai from "./panels/ai recommed priotity";
import Login from "./panels/login";
import Report from "./panels/report";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

const getRandomPosition = (existingPlans) => {
  const cardW = 290;
  const cardH = 120;
  const maxAttempts = 50;
  for (let i = 0; i < maxAttempts; i++) {
    const top = Math.floor(Math.random() * 400) + 100;
    const left = Math.floor(Math.random() * 1800) + 50;
    const overlaps = existingPlans.some((p) => (
      Math.abs(p.left - left) < cardW && Math.abs(p.top - top) < cardH
    ));
    if (!overlaps) return { top, left };
  }
  return {
    top: Math.floor(Math.random() * 400) + 100,
    left: Math.floor(Math.random() * 1800) + 50,
  };
};

export default function Dashboard() {
  const [activePanel, setActivePanel] = useState(null);
  const [bgImages, setBgImages] = useState([]);
  const [bgColor, setBgColor] = useState("#bee6ab");
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [showHint, setShowHint] = useState(true);
  const [samplePlans, setSamplePlans] = useState([
    { id: "s1", top: 120, left: 80, date: "January 8", month: "January", day: "8", title: "Fantasies for Knowledge", contents: "상상력과 지식의 관계에 대한 강연", category: "Lecture" },
    { id: "s2", top: 280, left: 350, date: "January 10", month: "January", day: "10", title: "Militance Is an Alternative", contents: "대안적 실천에 대한 발표", category: "Performance" },
    { id: "s3", top: 100, left: 620, date: "January 14", month: "January", day: "14", title: "[자격증] TOEIC", contents: "토익 정기시험 / 시험일정: 매월 / 준비기간: 2-3개월", category: "Other" },
    { id: "s4", top: 300, left: 850, date: "January 16", month: "January", day: "16", title: "Tracing my Lover's Wrinkles", contents: "비선형적 방식으로 흔적 추적하기", category: "Lecture" },
    { id: "s5", top: 150, left: 1100, date: "January 20", month: "January", day: "20", title: "[자격증] 컴퓨터활용능력 1급", contents: "상시시험 / 시험일정: 매월 / 준비기간: 3-6개월", category: "Other" },
    { id: "s6", top: 320, left: 1350, date: "January 23", month: "January", day: "23", title: "Privatised Futures", contents: "미래의 사유화에 대한 고찰", category: "Workshop" },
    { id: "s7", top: 90, left: 1600, date: "January 25", month: "January", day: "25", title: "[자격증] HSK 5급", contents: "중국어 능력시험 / 시험일정: 1월, 3월, 5월, 7월, 9월, 11월 / 준비기간: 6개월", category: "Other" },
    { id: "s8", top: 260, left: 1850, date: "January 28", month: "January", day: "28", title: "Nuclear Afterlives", contents: "방사성 생태학에 대한 연구", category: "Lecture" },
    { id: "s9", top: 130, left: 2100, date: "January 30", month: "January", day: "30", title: "[자격증] 정보처리기사", contents: "IT 국가자격증 / 시험일정: 3월, 6월, 9월 / 준비기간: 3-6개월", category: "Other" },
    { id: "s10", top: 150, left: 200, date: "February 6", month: "February", day: "6", title: "Tracing my Lover's Wrinkles", contents: "비선형적 방식으로 흔적 추적하기", category: "Lecture" },
    { id: "s11", top: 300, left: 600, date: "February 13", month: "February", day: "13", title: "[자격증] IELTS", contents: "영어 능력시험 / 시험일정: 매월 / 준비기간: 3-6개월", category: "Other" },
    { id: "s12", top: 120, left: 1000, date: "February 20", month: "February", day: "20", title: "Privatised Futures", contents: "미래의 사유화에 대한 고찰", category: "Workshop" },
    { id: "s13", top: 180, left: 300, date: "March 5", month: "March", day: "5", title: "Nuclear Afterlives", contents: "방사성 생태학에 대한 연구", category: "Lecture" },
    { id: "s14", top: 280, left: 700, date: "March 15", month: "March", day: "15", title: "[자격증] 정보처리기사 필기", contents: "IT 국가자격증 필기시험 / 준비기간: 3개월", category: "Other" },
  ]);

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
    const allPlans = [...samplePlans, ...plans];
    const { top, left } = getRandomPosition(allPlans);
    const plan = { ...newPlan, id: Date.now(), top, left };
    if (user) {
      const docRef = await addDoc(collection(db, "plans"), { ...plan, uid: user.uid });
      setPlans((prev) => [...prev, { ...plan, firestoreId: docRef.id }]);
    } else {
      setPlans((prev) => [...prev, plan]);
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

  const deletePlan = async (id, firestoreId) => {
    if (firestoreId) {
      await deleteDoc(doc(db, "plans", firestoreId));
      setPlans((prev) => prev.filter((p) => p.firestoreId !== firestoreId));
    } else {
      setSamplePlans((prev) => prev.filter((p) => p.id !== id));
      setPlans((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const togglePanel = (name) => {
    if (name === "login" && user) {
      signOut(auth);
      return;
    }
    setActivePanel((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const boxes = document.querySelectorAll(".float-box, .yellow-bar");
    const bg = document.getElementById("bg");
    let mx = 0;
    let cx = 0;

    const mouseMove = (e) => {
      if (e.clientX >= 0 && e.clientX <= window.innerWidth &&
          e.clientY >= 0 && e.clientY <= window.innerHeight) {
        mx = e.clientX / window.innerWidth - 0.5;
      } else {
        mx = 0;
      }
    };

    const mouseLeave = () => { mx = 0; };
    const visibilityChange = () => { if (document.hidden) mx = 0; };

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseleave", mouseLeave);
    document.addEventListener("visibilitychange", visibilityChange);

    const lerp = (a, b, t) => a + (b - a) * t;
    let frame;

    const animate = () => {
      cx = lerp(cx, mx, 0.07);
      if (bg) bg.style.transform = `translateX(${cx * -28}px)`;
      boxes.forEach((box) => {
        const speed = parseFloat(box.dataset.speed || 0.05);
        box.style.transform = `translateX(${cx * speed * 600}px)`;
      });
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseleave", mouseLeave);
      document.removeEventListener("visibilitychange", visibilityChange);
      cancelAnimationFrame(frame);
    };
  }, []);

  const modalPanels = ["addplan", "login", "priority", "background", "qualifications", "settings", "report"];

  const modalContent = () => {
    if (activePanel === "addplan") return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActivePanel(null)}>
        <div className="modal-box">
          <button className="modal-close" onClick={() => setActivePanel(null)}>✕</button>
          <AddPlan onAdd={addPlan} />
        </div>
      </div>
    );
    if (activePanel === "priority") return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActivePanel(null)}>
        <div style={{ background: "#fff", width: "600px", maxHeight: "70vh", overflowY: "auto", padding: "24px", position: "relative" }}>
          <button className="modal-close" onClick={() => setActivePanel(null)}>✕</button>
          <Priority plans={[...samplePlans, ...plans]} />
        </div>
      </div>
    );
    if (activePanel === "background") return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActivePanel(null)}>
        <div className="modal-box">
          <button className="modal-close" onClick={() => setActivePanel(null)}>✕</button>
          <Background
            onAddImage={(img) => setBgImages((prev) => [...prev, img])}
            onColorChange={setBgColor}
            onUpdateImage={(img) => setBgImages((prev) => prev.map((i) => i.id === img.id ? img : i))}
            onDeleteImage={(id) => setBgImages((prev) => prev.filter((i) => i.id !== id))}
            images={bgImages}
          />
        </div>
      </div>
    );
    if (activePanel === "login") return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActivePanel(null)}>
        <div className="modal-box">
          <button className="modal-close" onClick={() => setActivePanel(null)}>✕</button>
          <Login onLogin={() => setActivePanel(null)} />
        </div>
      </div>
    );
    if (activePanel === "qualifications") return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActivePanel(null)}>
        <div style={{ background: "#fff", width: "680px", maxHeight: "75vh", overflowY: "auto", padding: "24px", position: "relative" }}>
          <button className="modal-close" onClick={() => setActivePanel(null)}>✕</button>
          <Qualifications onAdd={addPlan} />
        </div>
      </div>
    );
    if (activePanel === "settings") return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActivePanel(null)}>
        <div className="modal-box">
          <button className="modal-close" onClick={() => setActivePanel(null)}>✕</button>
          <div style={{ padding: "10px" }}>
            <h3 style={{ marginBottom: "16px" }}>Settings</h3>
            <button
              onClick={() => { setSamplePlans([]); setBgImages([]); setActivePanel(null); }}
              style={{ display: "block", width: "100%", background: "#000", color: "#fff", padding: "8px", border: "none", cursor: "pointer", marginBottom: "10px", textAlign: "left" }}
            >
              예시 데이터 삭제
            </button>
            <button
              onClick={() => { setActivePanel(null); setTimeout(() => setActivePanel("report"), 100); }}
              style={{ display: "block", width: "100%", background: "#000", color: "#fff", padding: "8px", border: "none", cursor: "pointer", marginBottom: "10px", textAlign: "left" }}
            >
              report
            </button>
            <p style={{ padding: "8px", border: "1px solid #000", margin: 0, fontSize: "13px" }}>
              문의사항: sohen0531@naver.com
            </p>
          </div>
        </div>
      </div>
    );
    if (activePanel === "report") return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setActivePanel(null)}>
        <div style={{ background: "#fff", width: "700px", maxHeight: "80vh", overflowY: "auto", padding: "32px", position: "relative" }}>
          <button className="modal-close" onClick={() => setActivePanel(null)}>✕</button>
          <Report />
        </div>
      </div>
    );
    return null;
  };

  return (
    <>
      <div className="scene">

        <div className="bg-layer" id="bg" style={{ background: bgColor }}>
          {bgImages.map((img) => (
            <div
              key={img.id}
              style={{
                position: "absolute",
                width: `${img.width}px`,
                height: `${img.height}px`,
                top: `${img.top}px`,
                left: `${img.left}px`,
                backgroundImage: `url(${img.url})`,
                backgroundSize: "cover",
                zIndex: 0,
              }}
            />
          ))}
        </div>

        <PlanCards
          plans={[...samplePlans, ...plans]}
          onUpdate={updatePlan}
          onDelete={deletePlan}
          animate={activePanel === "timeline"}
          onDragEnd={() => setShowHint(false)}
        />

        {/* 힌트 텍스트 */}
        {/* 힌트 텍스트 */}
{showHint && (
  <div style={{
    position: "fixed",
    top: "85px",  // 월 버튼(60px) 아래
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    zIndex: 50,
    pointerEvents: "none",
  }}>
    <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.3)", margin: 0 }}>
      플랜카드를 움직여보세요
    </p>
    {!user && (
      <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.25)", margin: 0 }}>
        일정을 저장하려면 로그인하세요
      </p>
    )}
  </div>
)}

        {/* NAV */}
        <nav className="nav-bar modern-nav" id="nav">
          <span className="nav-site">bemove</span>
          <div className="nav-links-row">
            {[
              { key: "priority", label: "priority" },
              { key: "timeline", label: "timeline" },
              { key: "addplan", label: "add plan" },
              { key: "qualifications", label: "qualifications" },
              { key: "background", label: "background" },
              { key: "ai", label: "ai recommend priority" },
              { key: "login", label: user ? user.email : "login" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`nav-box ${activePanel === key ? "active" : ""}`}
                onClick={() => { togglePanel(key); }}
              >
                {label}
              </button>
            ))}
            <button
              className={`nav-box settings ${activePanel === "settings" ? "active" : ""}`}
              onClick={() => togglePanel("settings")}
            >
              settings
            </button>
          </div>
        </nav>

        {/* 일반 sub-panel (ai만) */}
        {activePanel && !modalPanels.includes(activePanel) && activePanel !== "timeline" && (
          <div className="sub-panel">
            <button className="sub-panel-close" onClick={() => setActivePanel(null)}>✕</button>
            {activePanel === "ai" && <Ai plans={[...samplePlans, ...plans]} />}
          </div>
        )}

        <div className="yellow-bar ybar1" data-speed="0.055" />
        <div className="yellow-bar ybar2" data-speed="0.065" />
      </div>

      {createPortal(modalContent(), document.body)}
    </>
  );
}