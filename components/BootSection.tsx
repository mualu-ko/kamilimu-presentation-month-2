import React, { useState, useEffect } from "react";
import MatrixRain from "./MatrixRain";

interface BootSectionProps {
  isActive: boolean;
  onStart: () => void;
}

export default function BootSection({ isActive, onStart }: BootSectionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={`section absolute inset-0 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-600 ${
        isActive ? "active" : "hidden"
      }`}
      style={{ background: "var(--dark)" }}
    >
      {/* Matrix columns rain background */}
      {isMounted && <MatrixRain />}

      <div className="absolute inset-0 flex items-center justify-center opacity-7 text-[clamp(180px,25vw,320px)] blur-[1px] select-none text-[var(--green)] font-mono leading-none z-0">
        💻
      </div>

      <div className="relative z-10 flex flex-col items-center gap-[30px]">
        <div className="font-mono text-[11px] text-[var(--dim)] tracking-[4px] text-center">
          KAMILIMU COHORT 10 // MONTH 2
        </div>
        <button
          id="execute-btn"
          onClick={onStart}
          className="relative z-20 px-[48px] py-[18px] bg-transparent border border-[var(--green)] text-[var(--green)] font-mono text-[18px] tracking-[4px] uppercase cursor-none transition-all duration-300 hover:bg-[rgba(0,255,136,0.05)] hover:tracking-[6px] animate-glitch-btn animate-glow-pulse"
        >
          [ EXECUTE ]
        </button>
        <div className="font-mono text-[10px] text-[#0a3d1f] tracking-[2px]">
          root@mentee:~$
        </div>
      </div>

      <div className="absolute bottom-[30px] font-mono text-[11px] text-[var(--dim)] tracking-[2px] opacity-60">
        CLICK TO INITIALIZE
      </div>
    </div>
  );
}
