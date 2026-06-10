import React, { useState, useEffect, useRef } from "react";

interface GitSectionProps {
  isActive: boolean;
  setSpacebarCallback: (fn: () => void) => void;
  onComplete: () => void;
}

export default function GitSection({
  isActive,
  setSpacebarCallback,
  onComplete
}: GitSectionProps) {
  const [gitLines, setGitLines] = useState<string[]>([]);
  const [showPrStatus, setShowPrStatus] = useState(false);

  const gitEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll Git log
  useEffect(() => {
    gitEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [gitLines]);

  // Git workflow animations
  useEffect(() => {
    if (!isActive) return;

    const timeouts: NodeJS.Timeout[] = [];
    const steps = [
      { delay: 0, html: '<span class="text-[var(--teal)]">$ git fork</span> kamilimu/gclass-2026' },
      { delay: 800, html: '  ↳ <span class="t-dim">forked to</span> <span class="text-white">you/gclass-2026</span> ✓' },
      { delay: 1800, html: '' },
      { delay: 2000, html: '<span class="text-[var(--amber)]">$ git log --oneline</span>' },
      { delay: 2600, html: '  <span class="text-[var(--red)]">a1b2c3</span> fix bug (messy)' },
      { delay: 2900, html: '  <span class="text-[var(--red)]">d4e5f6</span> wip (untidy)' },
      { delay: 3200, html: '  <span class="text-[var(--red)]">789abc</span> temp fix (scattered)' },
      { delay: 4000, html: '' },
      { delay: 4200, html: '<span class="text-[var(--green)]">$ git rebase -i origin/main</span>' },
      { delay: 5000, html: '  <span class="t-dim">✦ rewriting history...</span>' },
      { delay: 5800, html: '  <span class="text-[var(--green)]">✓ a1b2c3</span> feat: add contribution' },
      { delay: 6200, html: '  <span class="text-[var(--green)]">✓ d4e5f6</span> feat: clean implementation' },
      { delay: 6600, html: '' },
      { delay: 7000, html: '<span class="text-[var(--teal)]">$ git push origin main</span>' },
      { delay: 7600, html: '<span class="text-[var(--teal)]">$ gh pr create --title "feat: cohort10"</span>' },
    ];

    setGitLines([]);
    setShowPrStatus(false);

    const skipGit = () => {
      timeouts.forEach(clearTimeout);
      setGitLines(steps.map((s) => s.html));
      setShowPrStatus(true);
      setSpacebarCallback(onComplete);
    };

    setSpacebarCallback(skipGit);

    steps.forEach((step) => {
      const t = setTimeout(() => {
        setGitLines((prev) => [...prev, step.html]);
      }, step.delay);
      timeouts.push(t);
    });

    const tPr = setTimeout(() => {
      setShowPrStatus(true);
      setSpacebarCallback(onComplete);
    }, 8400);
    timeouts.push(tPr);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isActive, setSpacebarCallback, onComplete]);

  return (
    <div
      className={`section absolute inset-0 flex flex-col font-mono transition-all duration-1000 ease-in-out ${
        isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{ background: "var(--dark)" }}
    >
      <div className="bg-[#0a0a0a] px-5 py-[10px] flex items-center gap-[10px] border-b border-[#0a3d1f] flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <div className="flex-1 text-center text-[11px] text-[#333] tracking-[2px]">
          mentee@kamilimu-c10 ~ git --workflow open-source
        </div>
      </div>

      <div id="git-content" className="flex-1 flex flex-col p-[30px] gap-5 items-center justify-center">
        <div className="text-[var(--amber)] text-[12px] tracking-[3px] mb-2.5 self-start">
          // GIT & OPEN SOURCE
        </div>
        <div className="grid grid-cols-2 gap-5 w-full max-w-[900px]">
          <div className="bg-[#010f07] border border-[#0a3d1f] rounded p-5 min-h-[260px] relative">
            <h3 className="text-[var(--amber)] text-[12px] tracking-[2px] mb-4 border-b border-[#0a3d1f] pb-2 font-bold">
              // REPOSITORY WORKFLOW
            </h3>
            <div id="git-visual" className="text-[12px] leading-[2.2] text-[var(--green)] flex flex-col overflow-y-auto max-h-[170px]">
              {gitLines.map((line, idx) => (
                <div key={idx} dangerouslySetInnerHTML={{ __html: line }} />
              ))}
              <div ref={gitEndRef} />
            </div>
          </div>

          <div className="bg-[#010f07] border border-[#0a3d1f] rounded p-5 min-h-[260px] relative">
            <h3 className="text-[var(--amber)] text-[12px] tracking-[2px] mb-4 border-b border-[#0a3d1f] pb-2 font-bold">
              // OPEN SOURCE PATHWAYS
            </h3>
            <div className="text-white text-[12px] leading-[2] flex flex-col">
              <div><span className="text-[var(--teal)] font-bold">Outreachy</span> <span className="t-dim">→</span> $7,000 / 3 months</div>
              <div><span className="text-[var(--teal)] font-bold">Google SoC</span> <span className="t-dim">→</span> ~$3,000 in Kenya</div>
              <div><span className="text-[var(--amber)] font-bold">OSS needs</span> <span className="t-dim">→</span> maintainers, security audits</div>
              <div><span className="text-[var(--green)] font-bold">Your goal</span> <span className="t-dim">→</span> 1 contribution by Nov</div>
              <br />
              <div
                id="pr-status"
                className={`transition-opacity duration-500 ${showPrStatus ? "opacity-100" : "opacity-0"}`}
              >
                <div className="inline-block px-5 py-2 bg-[rgba(26,184,184,0.1)] border border-[var(--teal)] text-[var(--teal)] rounded-[3px] text-[13px] tracking-[2px] animate-pr-glow">
                  ✓ PULL REQUEST MERGED
                </div>
                <div className="mt-3 text-[var(--dim)] text-[11px] font-mono">
                  # your code now lives in production
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-[var(--dim)] text-[11px] self-end mt-2">
          [ SPACEBAR ] to continue
        </div>
      </div>
    </div>
  );
}
