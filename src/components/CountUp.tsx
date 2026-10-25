"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

// Counts up the first number found in `value` (e.g. "120+" -> 0…120+) when scrolled into view.
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const m = value.match(/\d+(\.\d+)?/);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || !m) return;
    const c = animate(0, parseFloat(m[0]), { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(v) });
    return () => c.stop();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!m) return <span>{value}</span>;
  const dec = m[1] ? 1 : 0;
  return (
    <span ref={ref}>
      {value.slice(0, m.index)}
      {(inView ? n : 0).toFixed(dec)}
      {value.slice((m.index ?? 0) + m[0].length)}
    </span>
  );
}
