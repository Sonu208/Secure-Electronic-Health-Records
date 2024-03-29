import React, { useState, useRef } from "react";

function PatientIcon() {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const faceRef = useRef(null);

  const handleMouseMove = (event) => {
    const face = faceRef.current;
    if (!face) return;

    const faceRect = face.getBoundingClientRect();
    const faceCenterX = faceRect.left + faceRect.width / 2;
    const faceCenterY = faceRect.top + faceRect.height / 2;

    const offsetX = (event.clientX - faceCenterX) * 0.05; // adjust these multipliers to control the movement range
    const offsetY = (event.clientY - faceCenterY) * 0.05;

    setEyeOffset({ x: offsetX, y: offsetY });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        backgroundColor: "white",
      }}
    >
      <div
        ref={faceRef}
        style={{
          fontSize: "5rem",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        😐
        <div
          style={{
            fontSize: "3rem",
            position: "absolute",
            top: "15%",
            left: "30%",
            transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
          }}
        >
          👀
        </div>
      </div>
    </div>
  );
}

export default PatientIcon;
