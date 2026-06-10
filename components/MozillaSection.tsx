import React, { useState, useEffect, useRef } from "react";

interface MozillaSectionProps {
  isActive: boolean;
  setSpacebarCallback: (fn: () => void) => void;
  onComplete: () => void;
}

export default function MozillaSection({
  isActive,
  setSpacebarCallback,
  onComplete
}: MozillaSectionProps) {
  const [deepfakeStep, setDeepfakeStep] = useState<"face" | "warning" | "transcript" | "map">("face");
  const [asciiFace, setAsciiFace] = useState("");
  const [showAudioHint, setShowAudioHint] = useState(false);
  const [mapZoomStep, setMapZoomStep] = useState(0);
  const [mapLabel, setMapLabel] = useState("INITIALIZING LOCATION TRACE...");

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Reset states & cancel speech synthesis on unmount / inactive
  useEffect(() => {
    if (!isActive) return;

    setDeepfakeStep("face");
    setMapZoomStep(0);
    setMapLabel("INITIALIZING LOCATION TRACE...");
    setShowAudioHint(false);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isActive]);

  // ASCII face loop animation
  useEffect(() => {
    if (!isActive || deepfakeStep !== "face") return;

    const generateFace = () => {
      const lines = [];
      for (let i = 0; i < 18; i++) {
        let line = "";
        for (let j = 0; j < 28; j++) {
          const r = Math.random();
          if (r < 0.08) line += "█";
          else if (r < 0.18) line += "▓";
          else if (r < 0.28) line += "▒";
          else if (r < 0.38) line += "░";
          else line += " ";
        }
        lines.push(line);
      }
      lines[4] = "     ◉ ◉ ◉          ◉ ◉ ◉     ";
      lines[8] = "          ▼▼▼▼▼▼         ";
      lines[12] = "     ████████████████     ";
      setAsciiFace(lines.join("\n"));
    };

    generateFace();
    const faceInterval = setInterval(generateFace, 150);

    const timer = setTimeout(() => {
      setDeepfakeStep("warning");
      setSpacebarCallback(playDeepfakeAudio);
    }, 2000);
    timeoutsRef.current.push(timer);

    return () => {
      clearInterval(faceInterval);
    };
  }, [isActive, deepfakeStep, setSpacebarCallback]);

  const playDeepfakeAudio = () => {
    let spoken = false;

    const triggerFallback = () => {
      if (spoken) return;
      spoken = true;
      setDeepfakeStep("transcript");
      setSpacebarCallback(showMap);
    };

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          "Warning. This voice is not real. I am a synthetic intelligence. I can sound like anyone. I can say anything. The line between real and fabricated no longer exists. Question everything you hear."
        );
        utterance.rate = 0.85;
        utterance.pitch = 0.7;
        utterance.volume = 1;

        const voices = window.speechSynthesis.getVoices();
        const deepVoice = voices.find(
          (v) => v.name.includes("Google") || v.name.includes("UK") || v.lang === "en-GB"
        );
        if (deepVoice) utterance.voice = deepVoice;

        utterance.onstart = () => {
          spoken = true;
        };
        utterance.onend = () => {
          setShowAudioHint(true);
          setSpacebarCallback(showMap);
        };
        utterance.onerror = triggerFallback;

        window.speechSynthesis.speak(utterance);
        
        const t = setTimeout(() => {
          if (!spoken) triggerFallback();
        }, 2500);
        timeoutsRef.current.push(t);
      } catch (e) {
        triggerFallback();
      }
    } else {
      triggerFallback();
    }
  };

  const showMap = () => {
    setDeepfakeStep("map");
    runMapZoom();
  };

  const runMapZoom = () => {
    const steps = [
      { delay: 0, label: "SCANNING GLOBE...", action: () => setMapZoomStep(0) },
      {
        delay: 1000,
        label: "CONTINENT IDENTIFIED: AFRICA",
        action: () => setMapZoomStep(1)
      },
      {
        delay: 2500,
        label: "COUNTRY: KENYA",
        action: () => setMapZoomStep(2)
      },
      {
        delay: 4000,
        label: "CITY: NAIROBI",
        action: () => setMapZoomStep(3)
      },
      {
        delay: 5500,
        label: "TARGET USER: RIGHT HERE",
        action: () => setMapZoomStep(4)
      },
      {
        delay: 7000,
        label: "THIS is who we build for. Not everyone. This person.",
        action: () => {
          setMapZoomStep(5);
          setSpacebarCallback(onComplete);
        }
      }
    ];

    steps.forEach((s) => {
      const t = setTimeout(() => {
        setMapLabel(s.label);
        s.action();
      }, s.delay);
      timeoutsRef.current.push(t);
    });
  };

  return (
    <div
      className={`section absolute inset-0 flex-col items-center justify-center overflow-hidden transition-opacity duration-600 ${
        isActive ? "active" : "hidden"
      }`}
      style={{ background: "#000" }}
    >
      {deepfakeStep !== "map" && (
        <div id="deepfake-scene" className="flex flex-col items-center justify-center w-full h-full">
          <div className="text-[#ff003388] text-[11px] tracking-[4px] mb-[30px] font-mono">
            // MOZILLA ASSEMBLY — DEMOCRACY × AI
          </div>
          
          <div id="deepfake-container" className="relative w-[340px] h-[380px] flex items-center justify-center">
            <div id="deepfake-face" className="w-[260px] h-[300px] rounded-lg relative overflow-hidden border border-[#ff003344] bg-[#080808]">
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080808] animate-face-flicker">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute w-full h-[2px] bg-[rgba(255,0,80,0.4)] animate-scan-face" />
                </div>
                <div className="font-mono text-[8px] leading-[1.1] text-[#ff0055] opacity-60 text-center p-2.5 whitespace-pre">
                  {asciiFace}
                </div>
                <div className="absolute top-2.5 right-2.5 font-mono text-[9px] text-[#ff0055] animate-blink">
                  ⬤ REC
                </div>
                <div className="absolute bottom-2.5 left-2.5 font-mono text-[9px] text-[#ff555588]">
                  SYNTHETIC_FACE_v2.1
                </div>
              </div>
            </div>
            <div className="absolute bottom-[-30px] font-mono text-[11px] text-[#ff003388] tracking-[3px] animate-blink-slow">
              [ DEEPFAKE DETECTED ]
            </div>
          </div>

          {(deepfakeStep === "warning" || deepfakeStep === "transcript") && (
            <div id="deepfake-warning" className="mt-[60px] font-mono text-[13px] text-[#ff0055] text-center max-w-[500px] leading-[1.8] opacity-100 transition-opacity duration-1000">
              {deepfakeStep === "warning" && (
                <>
                  <div className="text-[11px] text-[#ff0055] tracking-[3px] mb-4">
                    AI VOICE — WARNING
                  </div>
                  <div className="text-[#ff555599] text-[12px] leading-loose">
                    AI voice synthesis has become
                    <br />
                    indistinguishable from reality.
                    <br />
                    <span className="text-[#ff005577]">You cannot trust what you hear.</span>
                  </div>
                  <div className="mt-5 text-[11px] text-[#ff003344]">
                    [ SPACEBAR ] to play audio warning
                  </div>
                </>
              )}

              {deepfakeStep === "transcript" && (
                <>
                  <div className="text-[11px] text-[#ff0055] tracking-[3px] mb-4">
                    AI VOICE — TRANSCRIPT
                  </div>
                  <div className="text-[#ff555599] text-[12px] leading-loose">
                    &quot;Warning. This voice is not real.
                    <br />
                    I am a synthetic intelligence.
                    <br />
                    I can sound like anyone. I can say anything.
                    <br />
                    <span className="text-[#ff005577]">The line between real and fabricated no longer exists.</span>
                    <br />
                    Question everything you hear.&quot;
                  </div>
                  <div className="mt-4 text-[11px] text-[#ff003344]">
                    [ SPACEBAR ] for map
                  </div>
                </>
              )}
            </div>
          )}

          {showAudioHint && (
            <div id="audio-btn-hint" className="font-mono text-[11px] text-[#ff003366] mt-4 tracking-[2px]">
              [ SPACEBAR ] for map
            </div>
          )}
        </div>
      )}

      {deepfakeStep === "map" && (
        <div id="map-container" className="absolute inset-0 flex flex-col items-center justify-center bg-[#000]">
          <div className="font-mono text-[11px] text-[var(--green)] tracking-[4px] mb-5">
            // ZOOM IN — WHO ARE WE BUILDING FOR?
          </div>
          
          <svg id="map-svg" viewBox="0 0 600 400" className="w-full max-w-[600px] h-[350px]">
            <g
              id="africa-group"
              transform="translate(130, 110)"
              className="transition-all duration-1000"
              style={{
                opacity: mapZoomStep >= 1 ? 1 : 0.35
              }}
            >
              <path
                d="M 0 0 L 38 -18 L 86 -10 L 128 12 L 160 36 L 176 72 L 152 116 L 116 146 L 68 162 L 18 154 L -14 120 L -28 74 L -12 32 Z"
                fill="rgba(26,184,184,0.12)"
                stroke={mapZoomStep >= 1 ? "var(--green)" : "rgba(26,184,184,0.65)"}
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <text x="78" y="-12" textAnchor="middle" className="font-mono text-[11px] fill-[#00994d] opacity-75">
                AFRICA
              </text>
            </g>

            <g
              id="kenya-group"
              transform="translate(340, 210)"
              className="transition-opacity duration-1000"
              style={{
                opacity: mapZoomStep >= 2 ? 1 : 0
              }}
            >
              <path
                d="M -18 -12 L 14 -24 L 42 -8 L 44 18 L 18 36 L -12 28 L -30 8 Z"
                fill="rgba(0,255,136,0.18)"
                stroke="var(--green)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <text x="8" y="48" textAnchor="middle" className="font-mono text-[10px] fill-[var(--green)]">
                KENYA
              </text>
            </g>

            <g
              id="nairobi-group"
              transform="translate(335, 220)"
              className="transition-opacity duration-1000"
              style={{
                opacity: mapZoomStep >= 3 ? 1 : 0
              }}
            >
              <circle cx="0" cy="0" r="5" fill="var(--amber)" stroke="var(--amber)" strokeWidth="1">
                <animate attributeName="r" values="5;10;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text x="12" y="4" className="font-mono text-[10px] fill-[var(--amber)]">
                NAIROBI
              </text>
            </g>

            <g
              id="uon-group"
              transform="translate(335, 220)"
              className="transition-opacity duration-1000"
              style={{
                opacity: mapZoomStep >= 4 ? 1 : 0
              }}
            >
              <circle cx="0" cy="0" r="15" fill="none" stroke="var(--red)" strokeWidth="1" strokeDasharray="4,2" />
              <circle cx="0" cy="0" r="25" fill="none" stroke="var(--red)" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.5" />
              <text x="0" y="40" textAnchor="middle" className="font-mono text-[9px] fill-[var(--red)]">
                YOUR USER IS HERE
              </text>
            </g>
          </svg>
          
          <div className="font-mono text-[13px] text-[var(--green)] tracking-[3px] mt-5 text-center">
            {mapLabel}
          </div>
          
          <div className="font-mono text-[11px] text-[var(--dim)] mt-3">
            [ SPACEBAR ] to continue
          </div>
        </div>
      )}
    </div>
  );
}
