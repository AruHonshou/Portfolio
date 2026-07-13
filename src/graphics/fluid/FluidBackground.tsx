"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform vec2 uResolution;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1.)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float value = 0.; float amp = .5;
    for (int i = 0; i < 5; i++) { value += amp * noise(p); p = p * 2.03 + 17.13; amp *= .5; }
    return value;
  }
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.), 1.);
    vec2 p = (uv - .5) * aspect;
    float t = uTime * .075;
    vec2 flow = vec2(fbm(p * 2.1 + t), fbm(p * 2.35 - t + 3.4));
    float field = fbm(p * 2.8 + flow * 2.2 + vec2(t, -t * .7 + uScroll * .18));
    float plume = smoothstep(.52, .72, field);
    float pointer = exp(-8. * length(p - (uPointer - .5) * aspect));
    float edge = smoothstep(1.05, .15, length(p));
    float ink = clamp(plume * .72 + pointer * .2, 0., 1.) * edge;
    vec3 color = vec3(ink * .8);
    gl_FragColor = vec4(color, ink * .82);
  }
`;

export default function FluidBackground({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    } catch {
      canvas.dataset.failed = "true";
      return;
    }
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      uTime: { value: 0 }, uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(.72, .35) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    };
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthWrite: false });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    let frame = 0;
    let visible = !document.hidden;
    const resize = () => {
      const width = window.innerWidth; const height = window.innerHeight;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };
    const pointer = (event: PointerEvent) => uniforms.uPointer.value.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    const scroll = () => { uniforms.uScroll.value = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1); };
    const visibility = () => { visible = !document.hidden; if (visible && !frame) frame = requestAnimationFrame(render); };
    const contextLost = (event: Event) => { event.preventDefault(); canvas.dataset.failed = "true"; };
    let lastTime = performance.now();
    function render(now = performance.now()) {
      if (!visible) { frame = 0; return; }
      uniforms.uTime.value += Math.min((now - lastTime) / 1000, .05);
      lastTime = now;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    }
    resize(); scroll();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    canvas.addEventListener("webglcontextlost", contextLost);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", contextLost);
      geometry.dispose(); material.dispose(); renderer.dispose();
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="fluid-canvas" aria-hidden="true" data-testid="fluid-canvas" />;
}
