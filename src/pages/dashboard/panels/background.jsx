import { useState } from "react";

const COLORS = [
  "#c1e4af", "#ffcff786", "#ffffff", "#faf2abff", "#2c3e50",
  
];

export default function Background({ onAddImage, onColorChange, onUpdateImage, onDeleteImage, images = [] }) {
  const [selectedColor, setSelectedColor] = useState("#ebebebff");

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      onAddImage({
        id: Date.now() + Math.random(),
        url,
        width: Math.floor(Math.random() * 200) + 150,
        height: Math.floor(Math.random() * 200) + 150,
        top: Math.floor(Math.random() * 400) + 80,
        left: Math.floor(Math.random() * 900) + 50,
      });
    });
  };

  const handleColor = (color) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const handleRandomMove = (img) => {
    onUpdateImage({
      ...img,
      top: Math.floor(Math.random() * 400) + 80,
      left: Math.floor(Math.random() * 900) + 50,
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ marginBottom: "14px" }}>배경 설정</h3>

      {/* 배경색 */}
      <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>배경색:</p>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
        {COLORS.map((c) => (
          <div
            key={c}
            onClick={() => handleColor(c)}
            style={{
              width: "28px",
              height: "28px",
              background: c,
              border: selectedColor === c ? "3px solid #000" : "1px solid #ccc",
              cursor: "pointer",
            }}
          />
        ))}
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => handleColor(e.target.value)}
          style={{ width: "28px", height: "28px", padding: 0, border: "1px solid #ccc", cursor: "pointer" }}
        />
      </div>

      {/* 이미지 업로드 */}
      <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>이미지 추가:</p>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        style={{ display: "block", marginBottom: "16px" }}
      />

      {/* 이미지 목록 */}
      {images.length > 0 && (
        <>
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>추가된 이미지:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {images.map((img, idx) => (
              <div key={img.id} style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #ddd", padding: "6px" }}>
                <img src={img.url} style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                <span style={{ fontSize: "12px", flex: 1 }}>이미지 {idx + 1}</span>
                <button
                  onClick={() => handleRandomMove(img)}
                  style={{ background: "#000", color: "#fff", border: "none", padding: "3px 8px", cursor: "pointer", fontSize: "11px" }}
                >
                  랜덤 이동
                </button>
                <button
                  onClick={() => onDeleteImage(img.id)}
                  style={{ background: "#ff3333", color: "#fff", border: "none", padding: "3px 8px", cursor: "pointer", fontSize: "11px" }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}