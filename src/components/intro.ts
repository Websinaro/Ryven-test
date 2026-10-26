"use client";

import { useSyncExternalStore } from "react";

// Tiny shared flag: "the intro has cleared far enough that the page may animate in".
// Hero / Navbar / chat button wait for it so their entrance plays AFTER the loader,
// not hidden underneath it.
let done = false;
const listeners = new Set<() => void>();

export function setIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

export function useIntroDone() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => done,
    () => false
  );
}
