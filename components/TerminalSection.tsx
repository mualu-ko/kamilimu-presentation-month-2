import React, { useState, useEffect, useRef } from "react";
import { typeText } from "../utils/typewriter";

const HATS = [
  {
    color: "#ff0055",
    label: "⬛ BLACK HAT",
    ascii: `
    ██████████████
  ██              ██
  ██   ◉      ◉   ██
  ██        ▽      ██
  ██   ════════    ██
  ██            ██
    ████████████
  ██████████████████
`,
    desc: "Exploits systems for personal gain. Uses the same tools — but crosses the line."
  },
  {
    color: "#aaaaaa",
    label: "🩶 GREY HAT",
    ascii: `
    ▒▒▒▒▒▒▒▒▒▒▒▒
  ▒▒              ▒▒
  ▒▒   ◉      ◉   ▒▒
  ▒▒        ▽      ▒▒
  ▒▒   ════════    ▒▒
  ▒▒            ▒▒
    ▒▒▒▒▒▒▒▒▒▒▒▒
  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
`,
    desc: "Finds vulnerabilities without permission — but reports them. Morally complicated."
  },
  {
    color: "#00ff88",
    label: "⬜ WHITE HAT",
    ascii: `
    ░░░░░░░░░░░░
  ░░              ░░
  ░░   ◉      ◉   ░░
  ░░        ▽      ░░
  ░░   ════════    ░░
  ░░            ░░
    ░░░░░░░░░░░░
  ░░░░░░░░░░░░░░░░
`,
    desc: "Ethical hacker. Same tools, same knowledge — different intent. This is you."
  }
];

interface TerminalSectionProps {
  isActive: boolean;
  setSpacebarCallback: (fn: () => void) => void;
  onComplete: () => void;
}

export default function TerminalSection({
  isActive,
  setSpacebarCallback,
  onComplete
}: TerminalSectionProps) {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showOSISection, setShowOSISection] = useState(false);
  const [osiLayersVisible, setOsiLayersVisible] = useState(0);
  const [tcpLayersVisible, setTcpLayersVisible] = useState(0);
  const [cybersecQuote, setCybersecQuote] = useState("");
  const [hatIndex, setHatIndex] = useState(-1);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLines]);

  // Terminal track scan sequence
  useEffect(() => {
    if (!isActive) return;

    const timeouts: NodeJS.Timeout[] = [];
    const lines = [
      [0,   '<span class="t-dim">$</span> <span class="text-[var(--green)]">run kamilimu_month_2.sh</span>'],
      [600, '<span class="t-dim">Initializing session...</span>'],
      [1200, '<span class="t-dim">Loading module registry...</span>'],
      [1800, '<span class="text-[var(--amber)]">SCANNING AVAILABLE TRACKS...</span>'],
      [2400, ''],
      [2700, '<span class="t-dim">[ ] DATA SCIENCE ............</span>'],
      [3200, '<span class="text-[var(--red)]">✗ FATAL ERROR — track not assigned</span>'],
      [3700, '<span class="t-dim">[ ] SOFTWARE ENGINEERING ......</span>'],
      [4200, '<span class="text-[var(--red)]">✗ FATAL ERROR — track not assigned</span>'],
      [4700, '<span class="t-dim">[ ] CLOUD COMPUTING ...........</span>'],
      [5200, '<span class="text-[var(--red)]">✗ FATAL ERROR — track not assigned</span>'],
      [5700, '<span class="t-dim">[ ] CYBERSECURITY ..............</span>'],
      [6400, '<span class="text-[var(--green)] font-bold">✓ SUCCESS — root@cybersec:~# ACCESS GRANTED</span>'],
      [7200, ''],
      [7500, '<span class="text-[var(--teal)]">Mounting cybersecurity environment...</span>'],
      [8000, '<span class="t-dim">Loading OSI model... TCP/IP stack... done.</span>'],
    ];

    setTerminalLines([]);
    setShowOSISection(false);
    setOsiLayersVisible(0);
    setTcpLayersVisible(0);
    setCybersecQuote("");
    setHatIndex(-1);

    lines.forEach(([delay, html]) => {
      const t = setTimeout(() => {
        setTerminalLines((prev) => [...prev, html as string]);
      }, delay as number);
      timeouts.push(t);
    });

    let typewriterObj: { cancel: () => void } | null = null;

    const tOsi = setTimeout(() => {
      setShowOSISection(true);

      for (let i = 0; i <= 7; i++) {
        const t = setTimeout(() => {
          setOsiLayersVisible(i);
        }, i * 150);
        timeouts.push(t);
      }

      for (let j = 0; j <= 4; j++) {
        const t = setTimeout(() => {
          setTcpLayersVisible(j);
        }, j * 200);
        timeouts.push(t);
      }

      const tQuote = setTimeout(() => {
        typewriterObj = typeText(
          `"You may have noticed you have the same skillset as a cybercriminal."`,
          35,
          setCybersecQuote,
          () => {
            setSpacebarCallback(() => {
              setHatIndex(0);
            });
          }
        );
      }, 2000);
      timeouts.push(tQuote);

    }, 8800);
    timeouts.push(tOsi);

    return () => {
      timeouts.forEach(clearTimeout);
      if (typewriterObj) typewriterObj.cancel();
    };
  }, [isActive, setSpacebarCallback]);

  // Stagger HATS transition
  useEffect(() => {
    if (hatIndex === -1) return;

    if (hatIndex < HATS.length) {
      setSpacebarCallback(() => {
        if (hatIndex < HATS.length - 1) {
          setHatIndex(hatIndex + 1);
        } else {
          onComplete();
        }
      });
    }
  }, [hatIndex, setSpacebarCallback, onComplete]);

  return (
    <div
      className={`section absolute inset-0 flex flex-col font-mono transition-opacity duration-600 ${
        isActive ? "active" : "hidden"
      }`}
      style={{ background: "var(--dark)" }}
    >
      <div className="bg-[#0a0a0a] px-5 py-[10px] flex items-center gap-[10px] border-b border-[#0a3d1f] flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div className="flex-1 text-center text-[11px] text-[#333] tracking-[2px]">
          mentee@kamilimu-c10 ~ run kamilimu_month_2.sh
        </div>
      </div>

      <div className="flex-1 p-[24px_28px] overflow-hidden relative">
        {!showOSISection && (
          <div className="text-[13px] leading-loose text-[var(--green)] flex flex-col h-full overflow-y-auto">
            {terminalLines.map((line, idx) => (
              <span
                key={idx}
                className="block opacity-0 animate-fadein"
                dangerouslySetInnerHTML={{ __html: line }}
              />
            ))}
            <div ref={terminalEndRef} />
          </div>
        )}

        {showOSISection && hatIndex === -1 && (
          <div className="absolute inset-0 bg-[var(--dark)] p-[30px] flex flex-col gap-4">
            <div className="text-[var(--amber)] text-[12px] tracking-[3px] mb-2 font-bold">
              OSI MODEL // TCP/IP STACK
            </div>
            <div className="grid grid-cols-2 gap-5 flex-1 overflow-hidden">
              <div className="flex flex-col gap-1">
                <div className="text-[11px] text-[var(--dim)] mb-[10px] tracking-[2px] uppercase">
                  OSI Layers
                </div>
                {[
                  { num: "7", name: "Application", proto: "HTTP/S · DNS · SMTP", color: "var(--green)" },
                  { num: "6", name: "Presentation", proto: "Encrypt · Compress", color: "#44cc88" },
                  { num: "5", name: "Session", proto: "Opens/closes sessions", color: "#33bb77" },
                  { num: "4", name: "Transport", proto: "TCP / UDP", color: "var(--amber)" },
                  { num: "3", name: "Network", proto: "IP · Routers", color: "var(--amber)" },
                  { num: "2", name: "Data Link", proto: "MAC · Switches", color: "#44aaff" },
                  { num: "1", name: "Physical", proto: "WiFi · Fibre · Cables", color: "#44aaff" }
                ].map((layer, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-[10px] p-[4px_8px] my-[2px] border-l-2 text-[11px] animate-fadein transition-opacity duration-300 ${
                      idx < osiLayersVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    style={{ borderLeftColor: layer.color }}
                  >
                    <span className="w-[14px]" style={{ color: layer.color }}>{layer.num}</span>
                    <span className="text-[var(--white)] flex-1">{layer.name}</span>
                    <span className="text-[var(--dim)] text-[10px]">{layer.proto}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-[11px] text-[var(--dim)] mb-[10px] tracking-[2px] uppercase">
                  TCP/IP Model
                </div>
                {[
                  { name: "Application", proto: "HTTP/S · DNS · SMTP", color: "var(--green)" },
                  { name: "Transport", proto: "TCP / UDP", color: "var(--amber)" },
                  { name: "Internet", proto: "IP · Routing", color: "#44aaff" },
                  { name: "Link", proto: "Ethernet · WiFi · 4G", color: "#44cc88" }
                ].map((layer, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-[10px] p-[4px_8px] my-[2px] border-l-2 text-[11px] animate-fadein transition-opacity duration-300 ${
                      idx < tcpLayersVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    style={{ borderLeftColor: layer.color }}
                  >
                    <span className="text-[var(--white)] flex-1">{layer.name}</span>
                    <span className="text-[var(--dim)] text-[10px]">{layer.proto}</span>
                  </div>
                ))}
                
                <div className="mt-4 text-[11px] text-[var(--dim)] tracking-[2px] uppercase">
                  TCP vs UDP
                </div>
                <div className="mt-2 text-[12px] leading-loose">
                  <span className="text-[var(--teal)] font-bold">TCP</span> <span className="t-dim">→</span> <span className="text-[var(--white)]">Banking, Netflix — reliable</span>
                  <br />
                  <span className="text-[var(--amber)] font-bold">UDP</span> <span className="t-dim">→</span> <span className="text-[var(--white)]">Gaming, Calls — fast</span>
                </div>
              </div>
            </div>

            {cybersecQuote && (
              <div
                id="cybersec-quote"
                className="mt-4 text-[13px] text-[var(--amber)] text-center p-3 border border-[#0a3d1f] tracking-[1px]"
              >
                {cybersecQuote}
              </div>
            )}
            {cybersecQuote.length >= 72 && (
              <div className="text-right text-[11px] text-[var(--dim)] mt-2">
                [ SPACEBAR ] to meet the hackers
              </div>
            )}
          </div>
        )}

        {hatIndex !== -1 && hatIndex < HATS.length && (
          <div className="absolute inset-0 bg-[var(--dark)] flex flex-col items-center justify-center p-[30px]">
            <div
              id="hat-ascii"
              className="font-mono text-[11px] leading-[1.3] text-center whitespace-pre animate-glitch-heavy"
              style={{ color: HATS[hatIndex].color }}
            >
              {HATS[hatIndex].ascii}
            </div>
            <div
              id="hat-label"
              className="mt-5 font-mono text-[16px] tracking-[4px] uppercase"
              style={{ color: HATS[hatIndex].color }}
            >
              {HATS[hatIndex].label}
            </div>
            <div
              id="hat-desc"
              className="mt-[10px] font-mono text-[12px] max-w-[500px] text-center leading-[1.8]"
              style={{ color: HATS[hatIndex].color === "#00ff88" ? "var(--green)" : "#888" }}
            >
              {HATS[hatIndex].desc}
            </div>
            <div id="hat-hint" className="absolute bottom-[30px] text-[11px] text-[var(--dim)] tracking-[2px] uppercase">
              {hatIndex < HATS.length - 1 ? "[ SPACEBAR ] next →" : "[ SPACEBAR ] to continue"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
