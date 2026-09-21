"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  // True when the video is NOT playing even though we tried (autoplay blocked by
  // the browser / Brave / Opera / an ad-blocker, or the file failed to load).
  // While true, a play button is shown on top of the video.
  const [needsPlay, setNeedsPlay] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.paused) return;
    video.muted = true; // muted playback is the only kind browsers allow without a click
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => setNeedsPlay(true));
  }, []);

  // Tapping the fallback button is a real user gesture, so play() is allowed.
  const handlePlayClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.error) video.load(); // retry the download if it failed earlier
    tryPlay();
  };

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

    // Show the video as soon as the first frame exists (not only on "canplay",
    // which may never fire on browsers that hold back buffering), so a
    // blocked autoplay still shows the footage frame instead of a stuck poster.
    const handleFrame = () => {
      handleMetadata();
      setIsReady(true);
      tryPlay();
    };

    const handlePlaying = () => {
      handleMetadata();
      setIsReady(true);
      setNeedsPlay(false);
    };

    // Something stopped the video (blocker, battery saver, ...). Ignore pauses
    // that happen because the tab is hidden - the browser resumes those itself.
    const handlePause = () => {
      if (document.visibilityState === "visible") setNeedsPlay(true);
    };

    const handleError = () => setNeedsPlay(true);

    // The video may already be loaded (cache) before hydration attaches listeners.
    if (video.readyState >= 1) handleMetadata();
    if (video.readyState >= 2) setIsReady(true);

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("loadeddata", handleFrame);
    video.addEventListener("canplay", handleFrame);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("error", handleError);

    tryPlay();

    // Some blockers pause the video right after it starts, without any error.
    // So double-check shortly after: still not playing -> show the button.
    const checkTimer = window.setTimeout(() => {
      if (video.paused) setNeedsPlay(true);
    }, 1500);

    // Retry when the tab becomes visible again and on the first real user
    // gesture (this is what unlocks autoplay in Opera / Brave "block autoplay").
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    const interactionEvents = ["pointerup", "touchend", "click", "keydown"] as const;
    const cleanupInteraction = () =>
      interactionEvents.forEach((e) => window.removeEventListener(e, onInteract));
    const onInteract = () => {
      tryPlay();
      if (!video.paused) cleanupInteraction();
    };

    document.addEventListener("visibilitychange", onVisible);
    interactionEvents.forEach((e) =>
      window.addEventListener(e, onInteract, { passive: true })
    );

    return () => {
      window.clearTimeout(checkTimer);
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("loadeddata", handleFrame);
      video.removeEventListener("canplay", handleFrame);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("error", handleError);
      document.removeEventListener("visibilitychange", onVisible);
      cleanupInteraction();
    };
  }, [tryPlay]);

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
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: isReady ? 1 : 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </div>

      {/* Extra guaranteed blend into the page background at the very bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/60 to-transparent" />

      {/* Fallback play button: only when the video is not playing. z-20 keeps it
          above the hero text layer so it is always clickable. */}
      {needsPlay && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <motion.button
            type="button"
            onClick={handlePlayClick}
            aria-label="Play background video"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.button>
        </div>
      )}
    </div>
  );
}
