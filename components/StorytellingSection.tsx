import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface StorytellingSectionProps {
  isActive: boolean;
  setSpacebarCallback: (fn: () => void) => void;
  onComplete: () => void;
}

export default function StorytellingSection({
  isActive,
  setSpacebarCallback,
  onComplete
}: StorytellingSectionProps) {
  const [storyStep, setStoryStep] = useState(0);
  const [mehrabianHeights, setMehrabianHeights] = useState([0, 0, 0]);
  const [speechQuoteText, setSpeechQuoteText] = useState("");
  const [showWhyStoriesPhoto, setShowWhyStoriesPhoto] = useState(false);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const advanceStory = () => {
    setStoryStep((prev) => prev + 1);
  };

  // Reset state on entry
  useEffect(() => {
    if (!isActive) return;

    setStoryStep(0);
    setMehrabianHeights([0, 0, 0]);
    setSpeechQuoteText("");
    setShowWhyStoriesPhoto(false);
    setSpacebarCallback(advanceStory);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [isActive]);

  // Handle sequential storytelling steps
  useEffect(() => {
    if (!isActive) return;

    if (storyStep === 0) {
      setSpacebarCallback(advanceStory);
    } else if (storyStep === 1) {
      let t2: NodeJS.Timeout;
      let t3: NodeJS.Timeout;
      const t1 = setTimeout(() => {
        setMehrabianHeights([40, 0, 0]);
        t2 = setTimeout(() => {
          setMehrabianHeights([40, 120, 0]);
          t3 = setTimeout(() => {
            setMehrabianHeights([40, 120, 200]);
            setSpacebarCallback(advanceStory);
          }, 600);
        }, 600);
      }, 100);
      timeoutsRef.current.push(t1);

      return () => {
        clearTimeout(t1);
        if (t2) clearTimeout(t2);
        if (t3) clearTimeout(t3);
      };
    } else if (storyStep === 2) {
      setSpacebarCallback(advanceStory);
    } else if (storyStep === 3) {
      const fullQuote =
        "They say love is patient, but anyone who has spent a perfectly good day off fighting a circuit that defies the laws of physics knows that love is actually just stubbornness";
      const words = fullQuote.split(" ");
      let wi = 0;
      let currentQuote = "“";
      setSpeechQuoteText(currentQuote);

      let timeoutId: NodeJS.Timeout;
      const addWord = () => {
        const suffix = wi < words.length - 1 ? " " : "”";
        currentQuote += words[wi] + suffix;
        setSpeechQuoteText(currentQuote);
        wi++;
        if (wi < words.length) {
          timeoutId = setTimeout(addWord, 180 + Math.random() * 80);
        } else {
          setSpacebarCallback(advanceStory);
        }
      };
      timeoutId = setTimeout(addWord, 200);
      timeoutsRef.current.push(timeoutId);

      return () => {
        clearTimeout(timeoutId);
      };
    } else if (storyStep === 4) {
      const t = setTimeout(() => {
        setShowWhyStoriesPhoto(true);
        setSpacebarCallback(advanceStory);
      }, 1000);
      timeoutsRef.current.push(t);
      return () => clearTimeout(t);
    } else if (storyStep === 5) {
      setSpacebarCallback(advanceStory);
    } else if (storyStep === 6) {
      onComplete();
    }
  }, [storyStep, isActive, setSpacebarCallback, onComplete]);

  return (
    <div
      className={`section absolute inset-0 flex flex-row overflow-hidden transition-all duration-1000 ease-in-out ${
        isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{ background: "linear-gradient(135deg, #f5e6c8 0%, #efe3ca 45%, #e7d8b8 100%)", color: "#3b2d18" }}
    >
      {/* Left Photo Strip */}
      <div id="photo-strip" className="w-[220px] flex-shrink-0 overflow-hidden relative bg-[linear-gradient(180deg,#eadcc2_0%,#e1d2aa_100%)] border-r border-[rgba(26,184,184,0.25)]">
        <div id="photo-strip-inner" className="flex flex-col gap-2 p-2 animate-scroll-up">
          {[
            { src: "/DSC_7367.JPG", label: "KAMILIMU SESSION" },
            { src: "/DSC_7373.JPG", label: "COHORT 10" },
            { src: "/DSC_7377.JPG", label: "LEARNING" },
            { src: "/DSC_7527.JPG", label: "BUILDING" },
            { src: "/DSC_7367.JPG", label: "TOGETHER" },
            // Repeated for loop
            { src: "/DSC_7367.JPG", label: "KAMILIMU SESSION" },
            { src: "/DSC_7373.JPG", label: "COHORT 10" },
            { src: "/DSC_7377.JPG", label: "LEARNING" },
            { src: "/DSC_7527.JPG", label: "BUILDING" },
            { src: "/DSC_7367.JPG", label: "TOGETHER" }
          ].map((slot, idx) => (
            <div key={idx} className="w-[204px] h-[160px] bg-[#e8d9ba] rounded overflow-hidden flex-shrink-0 relative border-[3px] border-[rgba(26,184,184,0.35)] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <Image
                src={slot.src}
                alt={slot.label}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.4)] text-white text-[9px] p-[3px_6px] font-mono tracking-[1px]">
                {slot.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Storytelling interactive content */}
      <div id="story-content" className="flex-1 relative overflow-hidden block min-w-0 min-h-0">

        {/* STEP 0: Intro */}
        {storyStep === 0 && (
          <div id="story-intro" className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[520px] px-10 text-left transition-opacity duration-500">
            <h2 className="font-serif text-[42px] text-[#1a1a2e] mb-3 leading-tight">
              The Art of
              <br />
              Storytelling
            </h2>
            <p className="font-sans text-[16px] text-[#5a4a32] leading-[1.8]">
              How we communicate shapes how we&apos;re understood.
              <br />
              Let&apos;s explore what makes a message land.
            </p>
            <div className="font-sans text-[12px] text-[#1ab8b8] tracking-[2px] uppercase mt-6">
              ↓ press spacebar to begin
            </div>
          </div>
        )}

        {/* STEP 1: Mehrabian Formula */}
        {storyStep === 1 && (
          <div id="mehrabian" className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[520px] px-10 flex flex-col gap-[30px] items-center justify-center transition-opacity duration-600">
            <div className="font-sans text-[11px] text-[#888] tracking-[2px] uppercase self-start">
              The Mehrabian Formula
            </div>
            <div className="flex gap-[30px] items-end justify-center">
              <div className="meh-bar flex flex-col items-center gap-2.5">
                <div
                  className="meh-fill w-[60px] bg-[linear-gradient(to_top,#1ab8b8_0%,#44d0d2_100%)] rounded-t transition-[height] duration-[1500ms] ease-out"
                  style={{ height: `${mehrabianHeights[0]}px` }}
                />
                <div className="meh-num font-serif text-[28px] text-[#1a1a2e]">7%</div>
                <div className="meh-label font-sans text-[12px] text-[#666] tracking-[1px] text-center">Words</div>
              </div>

              <div className="meh-bar flex flex-col items-center gap-2.5">
                <div
                  className="meh-fill w-[60px] bg-[linear-gradient(to_top,#1ab8b8_0%,#44d0d2_100%)] rounded-t transition-[height] duration-[1500ms] ease-out"
                  style={{ height: `${mehrabianHeights[1]}px` }}
                />
                <div className="meh-num font-serif text-[28px] text-[#1a1a2e]">38%</div>
                <div className="meh-label font-sans text-[12px] text-[#666] tracking-[1px] text-center">Voice</div>
              </div>

              <div className="meh-bar flex flex-col items-center gap-2.5">
                <div
                  className="meh-fill w-[60px] bg-[linear-gradient(to_top,#1ab8b8_0%,#44d0d2_100%)] rounded-t transition-[height] duration-[1500ms] ease-out"
                  style={{ height: `${mehrabianHeights[2]}px` }}
                />
                <div className="meh-num font-serif text-[42px] text-[var(--teal)] font-bold">55%</div>
                <div className="meh-label font-sans text-[12px] text-[#666] tracking-[1px] text-center">Body Language</div>
              </div>
            </div>
            <div className="ml-auto font-serif italic text-[14px] text-[#888] max-w-[220px] leading-[1.6]">
              &quot;By the time I opened my mouth, I had already said everything.&quot;
            </div>
          </div>
        )}

        {/* STEP 2: Stage Presence */}
        {storyStep === 2 && (
          <div id="stage-diagram" className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[520px] px-10 text-center transition-opacity duration-600">
            <div className="font-sans text-[11px] text-[#888] tracking-[2px] uppercase mb-3">
              Stage Presence
            </div>
            <svg id="stage-svg" viewBox="0 0 480 160" className="w-full max-w-[480px] mx-auto">
              <rect x="10" y="10" width="460" height="140" rx="8" fill="#fff" stroke="#e0d0b0" strokeWidth="2" />

              {/* Power Zone */}
              <rect x="30" y="25" width="140" height="110" rx="6" fill="#fff5e0" stroke="#f0c060" strokeWidth="1.5" />
              <text x="100" y="72" textAnchor="middle" className="font-serif text-[13px] fill-[#8a6000]">Power Zone</text>
              <text x="100" y="90" textAnchor="middle" className="font-sans text-[10px] fill-[#aaa]">Center Stage</text>
              <text x="100" y="108" textAnchor="middle" className="font-sans text-[9px] fill-[#bbb]">Key messages</text>

              {/* Connection Zone */}
              <rect x="180" y="25" width="120" height="110" rx="6" fill="#e8f8f0" stroke="var(--teal)" strokeWidth="1.5" />
              <text x="240" y="72" textAnchor="middle" className="font-serif text-[13px] fill-[#1a7a60]">Connection</text>
              <text x="240" y="90" textAnchor="middle" className="font-sans text-[10px] fill-[#aaa]">Near Audience</text>
              <text x="240" y="108" textAnchor="middle" className="font-sans text-[9px] fill-[#bbb]">Q&A / eye contact</text>

              {/* Transition Zone */}
              <rect x="310" y="25" width="140" height="110" rx="6" fill="#f0f0ff" stroke="#aaaaee" strokeWidth="1.5" />
              <text x="380" y="72" textAnchor="middle" className="font-serif text-[13px] fill-[#4444aa]">Transition</text>
              <text x="380" y="90" textAnchor="middle" className="font-sans text-[10px] fill-[#aaa]">Side Areas</text>
              <text x="380" y="108" textAnchor="middle" className="font-sans text-[9px] fill-[#bbb]">Move between ideas</text>
            </svg>
          </div>
        )}

        {/* STEP 3: Speech Quote */}
        {storyStep === 3 && (
          <div id="quote-display" className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[520px] px-10 flex flex-col gap-3 text-center transition-opacity duration-600">
            <div className="font-sans text-[10px] text-[#aaa] tracking-[2px] uppercase mb-3">
              From my speech on love —
            </div>
            <div id="quote-text" className="font-serif text-[22px] text-[#1a1a2e] leading-[1.6] italic">
              {speechQuoteText}
            </div>
          </div>
        )}

        {/* STEP 4: Why Stories */}
        {storyStep === 4 && (
          <div id="why-stories" className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[520px] px-10 flex flex-col items-center gap-3.5 text-center transition-opacity duration-800">
            <h2 className="font-serif text-[36px] text-[#1ab8b8] mb-4">
              Why do stories matter?
            </h2>
            <div
              id="group-photo-slot"
              className={`w-full max-w-[400px] h-[220px] bg-[#d4c090] rounded-lg overflow-hidden border-4 border-white shadow-[0_8px_32px_rgba(0,0,0,0.15)] mx-auto transition-opacity duration-1000 ${showWhyStoriesPhoto ? "opacity-100" : "opacity-0"
                }`}
            >
              <Image
                src="/Story.JPG"
                alt="Candid cohort photo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* STEP 5: PREP Framework overlay */}
        {storyStep === 5 && (
          <div id="prep-overlay" className="absolute inset-0 bg-[rgba(245,230,200,0.95)] flex flex-col items-center justify-center gap-5 p-10 z-[100] transition-opacity duration-600">
            <div className="font-serif text-[24px] text-[#1a1a2e] mb-4">
              P.R.E.P. Framework
            </div>
            <div className="prep-grid grid grid-cols-2 gap-4 max-w-[700px] w-full">
              <div className="prep-card bg-[rgba(255,255,255,0.88)] border border-[rgba(26,184,184,0.24)] rounded-lg p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                <div className="prep-letter font-serif text-[48px] text-[#1ab8b8] leading-none">P</div>
                <div className="prep-word font-sans text-[13px] text-[#999] tracking-[2px] uppercase mb-2">Point</div>
                <div className="prep-desc font-sans text-[13px] text-[#444] leading-[1.6]">State your position clearly. Lead with your conclusion.</div>
              </div>

              <div className="prep-card bg-[rgba(255,255,255,0.88)] border border-[rgba(26,184,184,0.24)] rounded-lg p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                <div className="prep-letter font-serif text-[48px] text-[#1ab8b8] leading-none">R</div>
                <div className="prep-word font-sans text-[13px] text-[#999] tracking-[2px] uppercase mb-2">Reason</div>
                <div className="prep-desc font-sans text-[13px] text-[#444] leading-[1.6]">Explain why. Give the logic behind your thinking.</div>
              </div>

              <div className="prep-card bg-[rgba(255,255,255,0.88)] border border-[rgba(26,184,184,0.24)] rounded-lg p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                <div className="prep-letter font-serif text-[48px] text-[#1ab8b8] leading-none">E</div>
                <div className="prep-word font-sans text-[13px] text-[#999] tracking-[2px] uppercase mb-2">Example</div>
                <div className="prep-desc font-sans text-[13px] text-[#444] leading-[1.6]">Back it with a concrete story or evidence.</div>
              </div>

              <div className="prep-card bg-[rgba(255,255,255,0.88)] border-l-[3px] border-l-[var(--teal)] border border-[rgba(26,184,184,0.24)] rounded-lg p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                <div className="prep-letter font-serif text-[48px] text-[var(--teal)] leading-none">P</div>
                <div className="prep-word font-sans text-[13px] text-[#999] tracking-[2px] uppercase mb-2">Point (Restate)</div>
                <div className="prep-desc font-sans text-[13px] text-[#444] leading-[1.6]">Circle back with conviction. Clean, memorable close.</div>
              </div>
            </div>

            <div className="font-sans text-[11px] text-[#aaa] mt-3">
              [ SPACEBAR ] to continue
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
