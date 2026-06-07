import { useState } from "react";
import { auth } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const inputStyle = {
    padding: "4px 6px",
    border: "1px solid #000",
    fontSize: "12px",
    width: "100%",
  };

  const handleSubmit = async () => {
    setError("");
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      if (onLogin) onLogin();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px", width: "260px" }}>
      <h3 style={{ margin: "0 0 8px 0" }}>{isSignup ? "회원가입" : "로그인"}</h3>

      <input
        style={inputStyle}
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={inputStyle}
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p style={{ color: "red", fontSize: "11px", margin: 0 }}>{error}</p>}

      <button
        onClick={handleSubmit}
        style={{ background: "#000", color: "#fff", padding: "6px", cursor: "pointer", border: "none" }}
      >
        {isSignup ? "가입하기" : "로그인"}
      </button>

      <button
        onClick={() => setIsSignup((v) => !v)}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px", textDecoration: "underline" }}
      >
        {isSignup ? "이미 계정이 있어요 → 로그인" : "계정이 없어요 → 회원가입"}
      </button>
    </div>
  );
}