import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { typeText } from "../utils/typewriter";

interface OutroSectionProps {
  isActive: boolean;
}

export default function OutroSection({ isActive }: OutroSectionProps) {
  const [outroStep, setOutroStep] = useState<"terminal" | "exit" | "logo">("terminal");
  const [outroTerminalText, setOutroTerminalText] = useState("");
  const [showLogoContainer, setShowLogoContainer] = useState(false);
  const [slideWordmark, setSlideWordmark] = useState(false);
  const [showCohortText, setShowCohortText] = useState(false);
  const [showOutroPhoto, setShowOutroPhoto] = useState(false);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!isActive) return;

    setOutroStep("terminal");
    setOutroTerminalText("");
    setShowLogoContainer(false);
    setSlideWordmark(false);
    setShowCohortText(false);
    setShowOutroPhoto(false);

    let typewriterObj: { cancel: () => void } | null = null;

    const t1 = setTimeout(() => {
      setOutroStep("exit");
      typewriterObj = typeText("$ exit", 120, setOutroTerminalText, () => {
        const t2 = setTimeout(() => {
          setOutroStep("logo");
          setShowLogoContainer(true);
          
          const t3 = setTimeout(() => {
            setSlideWordmark(true);
            const t4 = setTimeout(() => {
              setShowCohortText(true);
              const t5 = setTimeout(() => {
                setShowOutroPhoto(true);
              }, 1000);
              timeoutsRef.current.push(t5);
            }, 1000);
            timeoutsRef.current.push(t4);
          }, 600);
          timeoutsRef.current.push(t3);
        }, 1200);
        timeoutsRef.current.push(t2);
      });
    }, 400);
    timeoutsRef.current.push(t1);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      if (typewriterObj) typewriterObj.cancel();
    };
  }, [isActive]);

  return (
    <div
      className={`section absolute inset-0 flex flex-col items-center justify-center gap-[30px] overflow-hidden transition-opacity duration-600 ${
        isActive ? "active" : "hidden"
      }`}
      style={{ background: "var(--dark)" }}
    >
      {outroStep === "exit" && (
        <div id="outro-terminal" className="font-mono text-[16px] text-[var(--green)] tracking-[3px]">
          {outroTerminalText}
        </div>
      )}

      {showLogoContainer && (
        <div id="logo-container" className="flex flex-col items-center gap-3 transition-opacity duration-1000">
          <div id="logo-row" className="flex items-center gap-5 overflow-hidden">
            <div className="relative w-[70px] h-[70px]">
              <Image
                id="outro-icon"
                src="/Logo1.png"
                alt="KamiLimu Logo"
                fill
                className="object-contain filter drop-shadow-[0_0_20px_rgba(26,184,184,0.5)]"
              />
            </div>
            <div
              className={`relative w-[200px] h-[50px] transition-all duration-1000 ease-out filter drop-shadow-[0_0_10px_rgba(26,184,184,0.3)] ${
                slideWordmark ? "translate-x-0 opacity-100" : "translate-x-[-200px] opacity-0"
              }`}
            >
              <Image
                id="outro-wordmark"
                src="/Name.png"
                alt="KamiLimu Name"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div
            id="cohort-text"
            className={`font-mono text-[16px] tracking-[8px] text-[var(--teal)] transition-opacity duration-1000 text-center ${
              showCohortText ? "opacity-100" : "opacity-0"
            }`}
          >
            COHORT 10
          </div>

          <div
            id="outro-photo"
            className={`relative w-[320px] h-[180px] bg-[#1a1a2a] rounded-[6px] overflow-hidden border-2 border-[#0a3d1f] mt-2.5 transition-opacity duration-[1500ms] ${
              showOutroPhoto ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src="/Candid.JPG"
              alt="Cohort Candid Photo"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
