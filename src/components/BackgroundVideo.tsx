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

    const handleMetadata = () => {
      if (video.videoWidth && video.videoHeight) {
        setRatio(video.videoWidth / video.videoHeight);
      }
    };
    const handleCanPlay = () => setIsReady(true);

    // The video may already be loaded (cache) before hydration attaches listeners.
    if (video.readyState >= 1) handleMetadata();
    if (video.readyState >= 3) handleCanPlay();

    video.addEventListener("loadedmetadata", handleMetadata);
    video.addEventListener("canplay", handleCanPlay);
    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("canplay", handleCanPlay);
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
            preload="metadata"
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
