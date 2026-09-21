"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

// The video is shown at its real aspect ratio, edge to edge: full width, and
// height follows the footage, so NOTHING is cropped off the sides (no
// object-cover zoom, no scale, no side vignette). The bottom fades out into the
// page background so it melts into the next section instead of cutting off.
const DEFAULT_RATIO = 16 / 9; // used until the real size is known (no layout jump for 16:9 footage)

const BOTTOM_FADE_MASK =
  "linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0.55) 80%, transparent 100%)";

export default function BackgroundVideo({ src, poster, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [ratio, setRatio] = useState(DEFAULT_RATIO);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React does not reliably put the `muted` ATTRIBUTE in the server HTML, and
    // Safari / iOS / Android WebViews only allow autoplay when the attribute is
    // really there. So force it on the element before we call play().
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const handleMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        setRatio(video.videoWidth / video.videoHeight);
      }
    };

    const tryPlay = () => {
      if (!video.paused) return;
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    // Show the video as soon as the first frame exists (not only on "canplay",
    // which may never fire on browsers that hold back buffering), so a
    // blocked autoplay still shows the footage frame instead of a stuck poster.
    const handleFrame = () => {
      handleMetadata();
      setIsReady(true);
      tryPlay();
    };

    // The video may already be loaded (cache) before hydration attaches listeners.
    if (video.readyState >= 1) handleMetadata();
    if (video.readyState >= 2) setIsReady(true);

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("loadeddata", handleFrame);
    video.addEventListener("canplay", handleFrame);
    video.addEventListener("playing", handleFrame);

    tryPlay();

    // Fallbacks for browsers that still block autoplay (iOS Low Power Mode,
    // battery / data saver, tab restored from background): retry when the tab
    // becomes visible again and on the first touch / click / scroll.
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    const interactionEvents = ["touchstart", "pointerdown", "click", "scroll", "keydown"] as const;
    const onInteract = () => {
      tryPlay();
      if (!video.paused) cleanupInteraction();
    };
    const cleanupInteraction = () =>
      interactionEvents.forEach((e) => window.removeEventListener(e, onInteract));

    document.addEventListener("visibilitychange", onVisible);
    interactionEvents.forEach((e) =>
      window.addEventListener(e, onInteract, { passive: true })
    );

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("loadeddata", handleFrame);
      video.removeEventListener("canplay", handleFrame);
      video.removeEventListener("playing", handleFrame);
      document.removeEventListener("visibilitychange", onVisible);
      cleanupInteraction();
    };
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden bg-background ${className || ""}`}
      style={{ aspectRatio: ratio }}
    >
      {/* Masked layer: poster + video fade out toward the bottom */}
      <div
        className="absolute inset-0"
        style={{ maskImage: BOTTOM_FADE_MASK, WebkitMaskImage: BOTTOM_FADE_MASK }}
      >
        {poster && (
          <img
            src={poster}
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-1000 ${
              isReady ? "opacity-0" : "opacity-100"
            }`}
          />
        )}

        {src && (
          <motion.video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: isReady ? 1 : 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <source src={src} type="video/mp4" />
          </motion.video>
        )}
      </div>

      {/* Extra guaranteed blend into the page background at the very bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </div>
  );
}
