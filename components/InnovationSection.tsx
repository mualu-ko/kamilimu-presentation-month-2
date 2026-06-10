import React, { useState, useEffect, useRef } from "react";
import { typeText } from "../utils/typewriter";

interface InnovationSectionProps {
  isActive: boolean;
  setSpacebarCallback: (fn: () => void) => void;
  onComplete: () => void;
}

export default function InnovationSection({
  isActive,
  setSpacebarCallback,
  onComplete
}: InnovationSectionProps) {
  const [innovationQuoteText, setInnovationQuoteText] = useState("");
  const [innovationDrawingComplete, setInnovationDrawingComplete] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const animationActiveRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      animationActiveRef.current = false;
      return;
    }

    setInnovationQuoteText("");
    setInnovationDrawingComplete(false);
    animationActiveRef.current = true;

    const t = setTimeout(startPencilAnimation, 500);
    timeoutsRef.current.push(t);

    return () => {
      animationActiveRef.current = false;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [isActive]);

  const startPencilAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 500, 300);
    ctx.strokeStyle = "#8a7a60";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const paths = [
      [{ x: 80, y: 150 }, { x: 360, y: 150 }], // body top
      [{ x: 360, y: 150 }, { x: 420, y: 165 }, { x: 360, y: 180 }], // tip
      [{ x: 360, y: 180 }, { x: 80, y: 180 }], // body bottom
      [{ x: 80, y: 180 }, { x: 80, y: 150 }], // body left close
      [{ x: 80, y: 148 }, { x: 50, y: 148 }, { x: 50, y: 182 }, { x: 80, y: 182 }], // eraser block
      [{ x: 80, y: 155 }, { x: 80, y: 175 }], // eraser band
      [{ x: 390, y: 152 }, { x: 415, y: 165 }, { x: 390, y: 178 }], // wood grain
      [{ x: 120, y: 152 }, { x: 120, y: 178 }], // stripe 1
      [{ x: 160, y: 152 }, { x: 160, y: 178 }], // stripe 2
      [{ x: 100, y: 220 }, { x: 400, y: 220 }], // writing line 1
      [{ x: 100, y: 238 }, { x: 355, y: 238 }], // writing line 2
      [{ x: 100, y: 256 }, { x: 382, y: 256 }] // writing line 3
    ];

    const expandPath = (pts: { x: number; y: number }[]) => {
      const result = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const ax = pts[i].x, ay = pts[i].y;
        const bx = pts[i + 1].x, by = pts[i + 1].y;
        const dist = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
        const steps = Math.max(3, Math.round(dist / 5));
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          result.push({ x: ax + (bx - ax) * t, y: ay + (by - ay) * t });
        }
      }
      return result;
    };

    const allSteps: { x: number; y: number; newPath: boolean }[] = [];
    paths.forEach((path) => {
      const expanded = expandPath(path);
      expanded.forEach((pt, si) => {
        allSteps.push({ x: pt.x, y: pt.y, newPath: si === 0 });
      });
    });

    const jitter = (v: number) => v + (Math.random() - 0.5) * 2;

    let stepIndex = 0;
    const stepDelay = 30000 / allSteps.length; // draw over 30s
    let prevX: number | null = null;
    let prevY: number | null = null;

    let typewriterObj: { cancel: () => void } | null = null;

    const drawStep = () => {
      if (!animationActiveRef.current) return;

      if (stepIndex >= allSteps.length) {
        setInnovationDrawingComplete(true);
        const t = setTimeout(() => {
          typewriterObj = typeText(
            "Innovation is not the next big thing. It is the pencil.",
            40,
            setInnovationQuoteText,
            () => {
              setSpacebarCallback(onComplete);
            }
          );
        }, 500);
        timeoutsRef.current.push(t);
        return;
      }

      const step = allSteps[stepIndex];
      const x = jitter(step.x);
      const y = jitter(step.y);

      if (step.newPath || prevX === null || prevY === null) {
        prevX = x;
        prevY = y;
      } else {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        prevX = x;
        prevY = y;
      }
      stepIndex++;
      const t = setTimeout(drawStep, stepDelay + (Math.random() * 8 - 4));
      timeoutsRef.current.push(t);
    };

    drawStep();
  };

  return (
    <div
      className={`section absolute inset-0 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-600 ${
        isActive ? "active" : "hidden"
      }`}
      style={{ background: "var(--warm1)" }}
    >
      <div id="pencil-stage" className="w-full max-w-[700px] h-[400px] flex flex-col items-center justify-center relative">
        <canvas
          ref={canvasRef}
          id="pencil-canvas"
          width="500"
          height="300"
          className="border-none bg-transparent"
        />
        <div id="innovation-text" className="absolute bottom-0 font-mono text-[13px] text-[#8a7a60] text-center leading-loose tracking-[1px]">
          <div className="font-mono text-[11px] text-[#8a7a60] tracking-[3px]">
            // PRINCIPLES OF INNOVATION
          </div>
          {innovationDrawingComplete && (
            <>
              <div className="font-serif text-[18px] text-[#c4a97a] mt-2.5 italic">
                {innovationQuoteText}
              </div>
              <div className="mt-4 font-mono text-[11px] text-[#6a5a40]">
                so what do we build?
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
