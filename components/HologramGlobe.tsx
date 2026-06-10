import React, { useRef, useState, useEffect } from "react";
import { WORLD_LAND_POLYGONS } from "./worldData";

interface HologramGlobeProps {
  zoomStep: number;
}

export default function HologramGlobe({ zoomStep }: HologramGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Camera state refs for smooth lerping inside animation loop
  const yawRef = useRef(-4.5); // Start on the opposite side of the world for dramatic rotation
  const pitchRef = useRef(0.45); // Slight tilt to start
  const radiusRef = useRef(110);

  const targetYawRef = useRef(-4.5);
  const targetPitchRef = useRef(0.45);
  const targetRadiusRef = useRef(110);

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastActiveTimeRef = useRef(Date.now());

  // Coordinates constants (in radians)
  const NAIROBI_LON = (36.82 * Math.PI) / 180;
  const NAIROBI_LAT = (-1.29 * Math.PI) / 180;

  const KENYA_LON = (37.9 * Math.PI) / 180;
  const KENYA_LAT = (-0.02 * Math.PI) / 180;

  const AFRICA_LON = (20.0 * Math.PI) / 180;
  const AFRICA_LAT = (0.0 * Math.PI) / 180;

  // Handle zoomStep changes
  useEffect(() => {
    // If user is not dragging, update target camera values based on current step
    if (isDraggingRef.current) return;

    if (zoomStep === 0) {
      targetPitchRef.current = 0.35; // 20 degrees
      targetRadiusRef.current = 110;
    } else if (zoomStep === 1) {
      // Africa
      targetYawRef.current = -AFRICA_LON;
      targetPitchRef.current = AFRICA_LAT;
      targetRadiusRef.current = 180;
    } else if (zoomStep === 2) {
      // Kenya
      targetYawRef.current = -KENYA_LON;
      targetPitchRef.current = KENYA_LAT;
      targetRadiusRef.current = 450;
    } else if (zoomStep >= 3) {
      // Nairobi
      targetYawRef.current = -NAIROBI_LON;
      targetPitchRef.current = NAIROBI_LAT;
      targetRadiusRef.current = zoomStep === 3 ? 1800 : 3200;
    }
    
    lastActiveTimeRef.current = Date.now();
  }, [zoomStep]);

  // Mouse drag event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastActiveTimeRef.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    // Update target angles directly by dragging (sensitivity factor 0.005)
    targetYawRef.current += dx * 0.005;
    targetPitchRef.current = Math.max(
      -Math.PI / 2 + 0.1,
      Math.min(Math.PI / 2 - 0.1, targetPitchRef.current - dy * 0.005)
    );

    lastActiveTimeRef.current = Date.now();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    lastActiveTimeRef.current = Date.now();
  };

  // Main rendering and animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle canvas resizing
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;
    let targetPulseRadius = 0;

    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Slow Auto-rotation if zoomStep is 0 and user is inactive
      if (zoomStep === 0 && !isDraggingRef.current) {
        const timeSinceActive = Date.now() - lastActiveTimeRef.current;
        if (timeSinceActive > 1500) {
          targetYawRef.current += 0.003; // spin globe slowly
        }
      }

      // 2. Camera value interpolation (lerping)
      const easing = 0.06;
      yawRef.current += (targetYawRef.current - yawRef.current) * easing;
      pitchRef.current += (targetPitchRef.current - pitchRef.current) * easing;
      radiusRef.current += (targetRadiusRef.current - radiusRef.current) * easing;

      const yaw = yawRef.current;
      const pitch = pitchRef.current;
      const R = radiusRef.current;

      // projection function: projects spherical coordinates to 2D
      const project = (lonRad: number, latRad: number) => {
        // Spherical to 3D Cartesian coordinates
        const x = Math.cos(latRad) * Math.cos(lonRad);
        const y = Math.cos(latRad) * Math.sin(lonRad);
        const z = Math.sin(latRad);

        // Z-axis rotation (yaw)
        const x1 = x * Math.cos(yaw) - y * Math.sin(yaw);
        const y1 = x * Math.sin(yaw) + y * Math.cos(yaw);
        const z1 = z;

        // Y-axis rotation (pitch)
        const x2 = x1 * Math.cos(pitch) + z1 * Math.sin(pitch);
        const y2 = y1;
        const z2 = -x1 * Math.sin(pitch) + z1 * Math.cos(pitch);

        // x2 represents depth (positive is facing camera, negative is behind)
        return {
          x: centerX + y2 * R,
          y: centerY - z2 * R,
          depth: x2
        };
      };

      // 3. Draw Holographic Graticule grid (longitude/latitude lines)
      ctx.lineWidth = 0.5;
      
      // Draw Latitude circles
      const latIntervals = [-60, -30, 0, 30, 60];
      latIntervals.forEach((latDeg) => {
        const latRad = (latDeg * Math.PI) / 180;
        
        // Front and Back separate paths
        ctx.beginPath();
        for (let lonDeg = -180; lonDeg <= 180; lonDeg += 5) {
          const pt = project((lonDeg * Math.PI) / 180, latRad);
          if (pt.depth > 0) {
            if (lonDeg === -180) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.strokeStyle = "rgba(0, 255, 136, 0.12)";
        ctx.stroke();

        ctx.beginPath();
        for (let lonDeg = -180; lonDeg <= 180; lonDeg += 5) {
          const pt = project((lonDeg * Math.PI) / 180, latRad);
          if (pt.depth <= 0) {
            if (lonDeg === -180) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.strokeStyle = "rgba(0, 255, 136, 0.03)";
        ctx.stroke();
      });

      // Draw Longitude arcs
      const lonIntervals = [-135, -90, -45, 0, 45, 90, 135, 180];
      lonIntervals.forEach((lonDeg) => {
        const lonRad = (lonDeg * Math.PI) / 180;

        ctx.beginPath();
        for (let latDeg = -90; latDeg <= 90; latDeg += 5) {
          const pt = project(lonRad, (latDeg * Math.PI) / 180);
          if (pt.depth > 0) {
            if (latDeg === -90) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.strokeStyle = "rgba(0, 255, 136, 0.12)";
        ctx.stroke();

        ctx.beginPath();
        for (let latDeg = -90; latDeg <= 90; latDeg += 5) {
          const pt = project(lonRad, (latDeg * Math.PI) / 180);
          if (pt.depth <= 0) {
            if (latDeg === -90) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.strokeStyle = "rgba(0, 255, 136, 0.03)";
        ctx.stroke();
      });

      // 4. Draw World Continent Polygons
      WORLD_LAND_POLYGONS.forEach((poly) => {
        if (poly.length < 3) return;

        // Separate segments by depth testing
        ctx.beginPath();
        let drawingFront = false;
        
        // Draw Front Side Continent Outlines
        for (let i = 0; i < poly.length; i++) {
          const [lonDeg, latDeg] = poly[i];
          const pt = project((lonDeg * Math.PI) / 180, (latDeg * Math.PI) / 180);
          
          if (pt.depth > 0) {
            if (!drawingFront) {
              ctx.moveTo(pt.x, pt.y);
              drawingFront = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            drawingFront = false;
          }
        }
        ctx.strokeStyle = "rgba(0, 255, 136, 0.65)";
        ctx.lineWidth = zoomStep >= 3 ? 1.0 : 1.25;
        ctx.stroke();

        // Draw Back Side Continent Outlines
        ctx.beginPath();
        let drawingBack = false;
        for (let i = 0; i < poly.length; i++) {
          const [lonDeg, latDeg] = poly[i];
          const pt = project((lonDeg * Math.PI) / 180, (latDeg * Math.PI) / 180);
          
          if (pt.depth <= 0) {
            if (!drawingBack) {
              ctx.moveTo(pt.x, pt.y);
              drawingBack = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            drawingBack = false;
          }
        }
        ctx.strokeStyle = "rgba(0, 255, 136, 0.12)";
        ctx.lineWidth = 0.75;
        ctx.stroke();
      });

      // 5. Draw Globe Outer Atmosphere Glow Border (only visible at Step 0, 1, 2)
      if (zoomStep <= 2) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, R, 0, 2 * Math.PI);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(0, 255, 136, 0.35)";
        ctx.stroke();

        // Outer aura circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, R + 8, 0, 2 * Math.PI);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "rgba(0, 255, 136, 0.08)";
        ctx.stroke();
      }

      // 6. Draw Nairobi Sonar / Scanner Targeting Overlay
      if (zoomStep >= 3) {
        const nairobi2D = project(NAIROBI_LON, NAIROBI_LAT);
        
        // Only draw if target is in front hemisphere (facing viewer)
        if (nairobi2D.depth > 0) {
          const tx = nairobi2D.x;
          const ty = nairobi2D.y;

          // Crosshairs
          ctx.beginPath();
          ctx.moveTo(tx - 35, ty);
          ctx.lineTo(tx + 35, ty);
          ctx.moveTo(tx, ty - 35);
          ctx.lineTo(tx, ty + 35);
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = "rgba(255, 50, 50, 0.4)";
          ctx.stroke();

          // Static Target Ring
          ctx.beginPath();
          ctx.arc(tx, ty, 20, 0, 2 * Math.PI);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(255, 50, 50, 0.7)";
          ctx.stroke();

          // Blinking Sonar Radar Ring
          targetPulseRadius += 0.8;
          if (targetPulseRadius > 50) targetPulseRadius = 10;
          
          ctx.beginPath();
          ctx.arc(tx, ty, targetPulseRadius, 0, 2 * Math.PI);
          ctx.lineWidth = 0.75;
          const pulseOpacity = (50 - targetPulseRadius) / 40;
          ctx.strokeStyle = `rgba(255, 50, 50, ${pulseOpacity})`;
          ctx.stroke();

          // Target Dot
          ctx.beginPath();
          ctx.arc(tx, ty, 4, 0, 2 * Math.PI);
          ctx.fillStyle = "rgba(255, 50, 50, 0.9)";
          ctx.fill();

          // Diagnostic text label
          ctx.fillStyle = "rgba(255, 50, 50, 0.85)";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "left";
          ctx.fillText("TARGET IDENTIFIED // NAIROBI, KE", tx + 26, ty - 8);
          
          ctx.fillStyle = "rgba(255, 204, 0, 0.75)";
          ctx.font = "8px monospace";
          ctx.fillText("LOC: 1.2921° S, 36.8219° E", tx + 26, ty + 4);
          ctx.fillText(`RANGE: LERP_SCALE_${Math.round(R)}px`, tx + 26, ty + 15);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [zoomStep]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        cursor: isDraggingRef.current ? "grabbing" : "grab",
        backgroundColor: "transparent"
      }}
    />
  );
}
