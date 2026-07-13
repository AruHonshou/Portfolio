"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FLUID_CONFIG, getFluidQuality } from "./fluidConfig";
import { FluidSimulation } from "./FluidSimulation";

interface PointerState { x: number; y: number; lastX: number; lastY: number; moved: boolean }

const SECTION_PROTECTION: Record<string, number> = {
  hero: 0.22,
  about: 0.62,
  skills: 0.86,
  projects: 0,
  experience: 0.72,
  education: 0.8,
  certifications: 0.82,
  contact: 0,
};

export default function FluidBackground({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    let simulation: FluidSimulation;
    try {
      simulation = new FluidSimulation(canvas, getFluidQuality(window.innerWidth, window.devicePixelRatio));
    } catch {
      canvas.dataset.failed = "true";
      return;
    }

    const pointer: PointerState = { x: 0.72, y: 0.64, lastX: 0.72, lastY: 0.64, moved: false };
    let frame = 0;
    let visible = !document.hidden;
    let lastTime = performance.now();
    let lastScroll = window.scrollY;
    let lastIdleSplat = 0;
    let activeSection = "hero";

    const applyVisualContext = () => {
      const width = Math.max(window.innerWidth, 1);
      const pageMargin = Math.max(width < 900 ? 16 : 20, (width - 1500) / 2);
      const safeInset = Math.min(Math.max(pageMargin / width, 0.035), 0.2);
      simulation.setVisualContext({
        protection: SECTION_PROTECTION[activeSection] ?? 0.68,
        safeMin: new THREE.Vector2(safeInset, 0.035),
        safeMax: new THREE.Vector2(1 - safeInset, 0.965),
        feather: new THREE.Vector2(Math.min(0.1, safeInset + 0.035), 0.1),
      });
      canvas.dataset.fluidContext = activeSection;
    };

    const resize = () => {
      simulation.resize(window.innerWidth, window.innerHeight, getFluidQuality(window.innerWidth, window.devicePixelRatio));
      applyVisualContext();
    };
    const move = (event: PointerEvent) => {
      pointer.lastX = pointer.x; pointer.lastY = pointer.y;
      pointer.x = event.clientX / window.innerWidth; pointer.y = 1 - event.clientY / window.innerHeight;
      pointer.moved = true;
    };
    const scroll = () => {
      const delta = window.scrollY - lastScroll; lastScroll = window.scrollY;
      if (Math.abs(delta) > 1) simulation.splat(0.14 + Math.random() * 0.72, 0.18 + Math.random() * 0.64, delta * 0.025, -delta * 0.018, 0.08);
    };
    const sectionImpulse = (event: Event) => {
      const detail = (event as CustomEvent<{ sectionId?: string; index?: number }>).detail;
      activeSection = detail?.sectionId || activeSection;
      applyVisualContext();
      const seed = detail?.index ?? 1;
      simulation.splat(0.16 + ((seed * 0.19) % 0.68), 0.28 + ((seed * 0.13) % 0.44), (seed % 2 ? 180 : -180), 110, 0.24);
    };
    const visibility = () => { visible = !document.hidden; if (visible && !frame) { lastTime = performance.now(); frame = requestAnimationFrame(render); } };
    const contextLost = (event: Event) => { event.preventDefault(); canvas.dataset.failed = "true"; cancelAnimationFrame(frame); frame = 0; };
    const contextRestored = () => { canvas.dataset.failed = "true"; };

    function render(now: number) {
      if (!visible) { frame = 0; return; }
      const dt = Math.min((now - lastTime) / 1000, 0.033); lastTime = now;
      if (pointer.moved) {
        const dx = (pointer.x - pointer.lastX) * FLUID_CONFIG.pointerForce;
        const dy = (pointer.y - pointer.lastY) * FLUID_CONFIG.pointerForce;
        if (Math.abs(dx) + Math.abs(dy) > 0.2) simulation.splat(pointer.x, pointer.y, dx, dy, Math.min(0.58, 0.16 + Math.hypot(dx, dy) / 2400));
        pointer.moved = false;
      }
      if (now - lastIdleSplat > 1800) {
        const t = now * 0.00017;
        simulation.splat(0.5 + Math.sin(t * 1.7) * 0.34, 0.52 + Math.cos(t) * 0.26, Math.cos(t * 1.3) * 65, Math.sin(t * 1.9) * 55, 0.12);
        lastIdleSplat = now;
      }
      simulation.step(dt); simulation.display();
      frame = requestAnimationFrame(render);
    }

    resize();
    simulation.splat(0.72, 0.72, -120, 75, 0.54);
    simulation.splat(0.34, 0.38, 95, -65, 0.46);
    simulation.splat(0.84, 0.28, -75, -45, 0.32);
    simulation.splat(0.18, 0.72, 80, 35, 0.28);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("portfolio-fluid-impulse", sectionImpulse);
    document.addEventListener("visibilitychange", visibility);
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("portfolio-fluid-impulse", sectionImpulse);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      simulation.dispose();
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="fluid-canvas" aria-hidden="true" data-testid="fluid-canvas" />;
}
