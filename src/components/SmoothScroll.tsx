"use client";

import { useEffect } from "react";

// Dependency-free inertia scrolling (same feel as Lenis).
//  • Mouse wheel / trackpad: the target position is eased with a frame-rate
//    independent lerp, so every notch glides instead of jumping.
//  • Touch devices keep native scrolling (already smooth, and hijacking it
//    breaks pull-to-refresh / address-bar behaviour).
//  • Keyboard, scrollbar drag, and nested scrollable areas are left native.
//  • "#anchor" links glide to their section.
//  • Disabled for users who prefer reduced motion.
const SMOOTHNESS = 9; // higher = snappier, lower = floatier (≈ 0.9s settle)
const WHEEL_MULTIPLIER = 1;

function maxScroll() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function insideScrollable(el: EventTarget | null, deltaY: number) {
  let node = el as HTMLElement | null;
  while (node && node !== document.body && node !== document.documentElement) {
    const style = getComputedStyle(node);
    const scrollableY = /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight;
    if (scrollableY) {
      const atTop = node.scrollTop <= 0 && deltaY < 0;
      const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1 && deltaY > 0;
      if (!atTop && !atBottom) return true;
    }
    node = node.parentElement;
  }
  return false;
}

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    root.classList.add("smooth-scroll");

    let current = window.scrollY;
    let target = window.scrollY;
    let raf = 0;
    let last = 0;
    let driving = false; // true while WE are moving the page

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const diff = target - current;
      if (Math.abs(diff) < 0.15) {
        current = target;
        driving = true;
        window.scrollTo({ top: current, behavior: "instant" as ScrollBehavior });
        driving = false;
        raf = 0;
        return;
      }
      current += diff * (1 - Math.exp(-SMOOTHNESS * dt));
      driving = true;
      window.scrollTo({ top: current, behavior: "instant" as ScrollBehavior });
      driving = false;
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey) return; // pinch-zoom etc.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // horizontal gesture
      if (document.fullscreenElement) return;
      if (root.classList.contains("intro-lock")) {
        e.preventDefault(); // page is frozen while the intro plays
        return;
      }
      if (insideScrollable(e.target, e.deltaY)) return;
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 40; // lines -> px
      else if (e.deltaMode === 2) delta *= window.innerHeight; // pages -> px
      target = Math.min(maxScroll(), Math.max(0, target + delta * WHEEL_MULTIPLIER));
      start();
    };

    // Something else moved the page (keyboard, scrollbar drag, find-in-page):
    // adopt that position so we never fight it.
    const onScroll = () => {
      if (driving) return;
      if (!raf) {
        current = target = window.scrollY;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      // let native keys scroll, then onScroll re-syncs; cancel any glide first
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key)) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        current = target = window.scrollY;
      }
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href") || "";
      const el = hash === "#" || hash === "#top" ? document.body : document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      const top = hash === "#" || hash === "#top" ? 0 : el.getBoundingClientRect().top + window.scrollY;
      target = Math.min(maxScroll(), Math.max(0, top));
      current = window.scrollY;
      history.replaceState(null, "", hash);
      start();
    };

    const onResize = () => {
      target = Math.min(target, maxScroll());
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.addEventListener("click", onClick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove("smooth-scroll");
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
