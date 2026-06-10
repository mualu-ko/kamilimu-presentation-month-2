"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import BootSection from "../components/BootSection";
import TerminalSection from "../components/TerminalSection";
import GitSection from "../components/GitSection";
import MozillaSection from "../components/MozillaSection";
import InnovationSection from "../components/InnovationSection";
import StorytellingSection from "../components/StorytellingSection";
import OutroSection from "../components/OutroSection";

export default function Home() {
  const [currentSection, setCurrentSection] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(420); // 7 minutes
  const [timerActive, setTimerActive] = useState(false);

  // Custom Cursor Refs
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);

  // Spacebar Navigation callbacks
  const advanceRef = useRef<(() => void) | null>(null);
  const spacebarEnabledRef = useRef(false);
  const spacebarTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setSpacebarCallback = useCallback((fn: () => void) => {
    advanceRef.current = fn;
    if (spacebarTimeoutRef.current) {
      clearTimeout(spacebarTimeoutRef.current);
    }
    spacebarTimeoutRef.current = setTimeout(() => {
      spacebarEnabledRef.current = true;
    }, 100);
  }, []);

  const fireAdvance = useCallback(() => {
    if (!spacebarEnabledRef.current || !advanceRef.current) return;
    spacebarEnabledRef.current = false;
    if (spacebarTimeoutRef.current) {
      clearTimeout(spacebarTimeoutRef.current);
      spacebarTimeoutRef.current = null;
    }
    const fn = advanceRef.current;
    advanceRef.current = null;
    fn();
  }, []);

  // Stable section handlers
  const startPresentation = useCallback(() => {
    setTimerActive(true);
    setCurrentSection(2);
  }, []);

  const handleTerminalComplete = useCallback(() => setCurrentSection(3), []);
  const handleGitComplete = useCallback(() => setCurrentSection(4), []);
  const handleMozillaComplete = useCallback(() => setCurrentSection(5), []);
  const handleInnovationComplete = useCallback(() => setCurrentSection(6), []);
  const handleStorytellingComplete = useCallback(() => setCurrentSection(7), []);

  // Custom Cursor positioning
  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      
      const timer = setTimeout(() => {
        if (cursorTrailRef.current) {
          cursorTrailRef.current.style.left = `${e.clientX}px`;
          cursorTrailRef.current.style.top = `${e.clientY}px`;
        }
      }, 80);
      return () => clearTimeout(timer);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Global Spacebar + Click Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        fireAdvance();
      }
    };

    const handleMouseClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.id === "execute-btn") return;
      fireAdvance();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleMouseClick);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleMouseClick);
    };
  }, [fireAdvance]);

  // Global Countdown Timer
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="relative w-full h-full text-white font-sans overflow-hidden">
      {/* Dynamic scanlines custom styles */}
      <div className="pointer-events-none fixed inset-0 z-[9990] animate-scanmove bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,136,0.015)_2px,rgba(0,255,136,0.015)_4px)]" />

      {/* Custom Cursor */}
      {isMounted && (
        <>
          <div id="cursor" ref={cursorRef} style={{ left: "-100px", top: "-100px" }} />
          <div id="cursor-trail" ref={cursorTrailRef} style={{ left: "-100px", top: "-100px" }} />
        </>
      )}

      {/* Timer Display */}
      {timerActive && (
        <div
          id="timer-display"
          className={`fixed top-3 right-5 font-mono text-[13px] tracking-[3px] z-[9000] opacity-70 ${
            timerSeconds <= 60 ? "text-[var(--red)] animate-blink" : "text-[var(--amber)]"
          }`}
        >
          {formatTimer(timerSeconds)}
        </div>
      )}

      <BootSection
        isActive={currentSection === 1}
        onStart={startPresentation}
      />

      <TerminalSection
        isActive={currentSection === 2}
        setSpacebarCallback={setSpacebarCallback}
        onComplete={handleTerminalComplete}
      />

      <GitSection
        isActive={currentSection === 3}
        setSpacebarCallback={setSpacebarCallback}
        onComplete={handleGitComplete}
      />

      <MozillaSection
        isActive={currentSection === 4}
        setSpacebarCallback={setSpacebarCallback}
        onComplete={handleMozillaComplete}
      />

      <InnovationSection
        isActive={currentSection === 5}
        setSpacebarCallback={setSpacebarCallback}
        onComplete={handleInnovationComplete}
      />

      <StorytellingSection
        isActive={currentSection === 6}
        setSpacebarCallback={setSpacebarCallback}
        onComplete={handleStorytellingComplete}
      />

      <OutroSection
        isActive={currentSection === 7}
      />
    </div>
  );
}
