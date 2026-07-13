"use client";

import { animate, splitText, stagger } from "animejs";
import { useEffect, useRef } from "react";

export type MotionPreset = "rise" | "fall" | "scale" | "blur" | "flip";
export type MotionIntensity = "hero" | "section" | "subtle";

interface MotionTitleProps {
  as: "h1" | "h2" | "h3" | "strong";
  text: string;
  preset: MotionPreset;
  intensity: MotionIntensity;
  reduced: boolean;
  id?: string;
  className?: string;
  lines?: string[];
  decorative?: boolean;
  trigger?: "load" | "view";
  syncRule?: boolean;
}

const TIMING: Record<MotionIntensity, { duration: number; stagger: number }> = {
  hero: { duration: 1100, stagger: 45 },
  section: { duration: 900, stagger: 42 },
  subtle: { duration: 620, stagger: 24 },
};

function prepareCharacters(characters: HTMLElement[], preset: MotionPreset, intensity: MotionIntensity) {
  const distance = intensity === "subtle" ? 55 : 110;
  const blur = intensity === "hero" ? 20 : intensity === "section" ? 14 : 8;

  characters.forEach((character) => {
    character.style.opacity = "0";
    character.style.willChange = "transform, opacity, filter";
    if (preset === "rise") character.style.transform = `translateY(${distance}%)`;
    if (preset === "fall") character.style.transform = `translateY(-${distance}%) rotateZ(-${intensity === "subtle" ? 12 : 22}deg)`;
    if (preset === "scale") character.style.transform = `scale(${intensity === "subtle" ? 0.55 : 0.2}) rotateZ(${intensity === "subtle" ? 16 : 30}deg)`;
    if (preset === "blur") {
      character.style.filter = `blur(${blur}px)`;
      character.style.letterSpacing = intensity === "subtle" ? ".12em" : ".28em";
    }
    if (preset === "flip") character.style.transform = `rotateX(-${intensity === "subtle" ? 72 : 105}deg)`;
  });
}

function playCharacters(characters: HTMLElement[], preset: MotionPreset, intensity: MotionIntensity) {
  const timing = TIMING[intensity];
  const shared = { opacity: 1, duration: timing.duration, ease: intensity === "hero" ? "out(3)" : "out(4)" };

  if (preset === "rise") return animate(characters, { ...shared, translateY: "0%", delay: stagger(timing.stagger) });
  if (preset === "fall") return animate(characters, { ...shared, translateY: "0%", rotateZ: 0, delay: stagger(timing.stagger, { from: "last" }) });
  if (preset === "scale") return animate(characters, { ...shared, scale: 1, rotateZ: 0, delay: stagger(timing.stagger, { from: "center" }) });
  if (preset === "blur") return animate(characters, { ...shared, filter: "blur(0px)", letterSpacing: "0em", delay: stagger(timing.stagger) });
  return animate(characters, { ...shared, rotateX: 0, delay: stagger(timing.stagger, { from: "center" }) });
}

export function MotionTitle({ as, text, preset, intensity, reduced, id, className, lines, decorative = false, trigger = "view", syncRule = false }: MotionTitleProps) {
  const titleRef = useRef<HTMLElement>(null);
  const Tag = as;

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const heading = syncRule ? title.closest<HTMLElement>(".section-heading") : null;

    if (reduced) {
      title.dataset.motionState = "static";
      if (heading) heading.dataset.motionState = "static";
      return;
    }

    title.dataset.motionState = "pending";
    if (heading) heading.dataset.motionState = "pending";
    const split = splitText(title, {
      words: { class: "motion-word" },
      chars: { class: "motion-char" },
      accessible: !decorative,
    });
    const characters = split.chars as HTMLElement[];
    prepareCharacters(characters, preset, intensity);

    let played = false;
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    let animation: ReturnType<typeof animate> | undefined;
    const play = () => {
      if (played) return;
      played = true;
      observer?.disconnect();
      title.dataset.motionState = "playing";
      animation = playCharacters(characters, preset, intensity);
      animation.then(() => {
        if (!title.isConnected) return;
        title.dataset.motionState = "complete";
        if (heading) heading.dataset.motionState = "complete";
        characters.forEach((character) => { character.style.willChange = "auto"; });
      });
    };

    if (trigger === "load") frame = requestAnimationFrame(play);
    else {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.2)) play();
      }, { threshold: [0.2, 0.35], rootMargin: "0px 0px -10% 0px" });
      observer.observe(title);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      animation?.cancel();
      split.revert();
    };
  }, [decorative, intensity, preset, reduced, syncRule, text, trigger]);

  const children = lines
    ? lines.map((line) => <span className="hero-line" key={line}>{line}</span>)
    : text;

  return <Tag
    ref={(element) => { titleRef.current = element; }}
    id={id}
    className={["motion-title", className].filter(Boolean).join(" ")}
    aria-label={decorative ? undefined : text}
    aria-hidden={decorative || undefined}
    data-motion-preset={preset}
    data-motion-intensity={intensity}
    data-motion-state={reduced ? "static" : "pending"}
  >{children}</Tag>;
}
