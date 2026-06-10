import React, { useState, useEffect } from "react";

const MatrixRain = React.memo(() => {
  const [columns, setColumns] = useState<{ left: string; animation: string; animationDelay: string; text: string }[]>([]);

  useEffect(() => {
    const chars = "01アイウエオカキクケコサシスセソタチツテト";
    const colsData = Array.from({ length: 40 }).map((_, idx) => {
      const delay = Math.random() * 5;
      const duration = Math.random() * 8 + 4;
      const leftOffset = idx * 2.5;
      const colChars = Array.from({ length: 25 })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("\n");
      return {
        left: `${leftOffset}%`,
        animation: `fall ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        text: colChars
      };
    });
    setColumns(colsData);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-15 flex justify-between px-2 pointer-events-none">
      {columns.map((col, idx) => (
        <div
          key={idx}
          className="absolute top-[-100%] font-mono text-[13px] text-[var(--green)] whitespace-pre leading-none"
          style={{
            left: col.left,
            animation: col.animation,
            animationDelay: col.animationDelay
          }}
        >
          {col.text}
        </div>
      ))}
    </div>
  );
});

MatrixRain.displayName = "MatrixRain";

export default MatrixRain;
