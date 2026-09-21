"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import type { ResolvedMedia } from "@/data/portfolio";

type Props = {
  resolved: ResolvedMedia;
  alt: string;
  className?: string;
};

type ActivationNavigator = Navigator & {
  userActivation?: { isActive: boolean; hasBeenActive: boolean };
};

// Only one sample video plays at a time.
let activeVideo: HTMLVideoElement | null = null;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Custom-controlled Cloudinary player. Every project video on the site
// renders through this component — play/pause, scrub, volume and
// fullscreen are all handled here rather than the native browser UI,
// so playback looks the same across every browser/device.
export default function VideoPlayer({ resolved, alt, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Loads the file a bit before it appears on screen...
  const isInView = useInView(containerRef, { margin: "200px 0px", once: false });
  // ...but plays only while at least half of the card is visible.
  const isActive = useInView(containerRef, { amount: 0.5, once: false });

  const isActiveRef = useRef(false);
  isActiveRef.current = isActive;
  const userPausedRef = useRef(false); // user pressed pause -> stay paused while in view
  const userMutedRef = useRef(false); // user chose mute -> never auto-unmute
  const autoMutedRef = useRef(false); // browser forced us to start muted
  const [needsSoundTap, setNeedsSoundTap] = useState(false);

  const [shouldLoadSource, setShouldLoadSource] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0–100
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);

  useEffect(() => {
    if (isInView && resolved.playable) setShouldLoadSource(true);
  }, [isInView, resolved.playable]);

  // Try to play WITH sound. Browsers only allow that after the visitor has
  // interacted with the page (click / tap / key). If it is refused we fall back
  // to muted playback and show a "Tap for sound" button instead of failing.
  const playAuto = useCallback(async (video: HTMLVideoElement) => {
    if (!userMutedRef.current) {
      video.muted = false;
      try {
        await video.play();
        autoMutedRef.current = false;
        setNeedsSoundTap(false);
        return;
      } catch {
        /* blocked -> fall through to muted */
      }
    }
    video.muted = true;
    autoMutedRef.current = !userMutedRef.current;
    setNeedsSoundTap(!userMutedRef.current);
    try {
      await video.play();
    } catch {
      /* still blocked (e.g. data saver) - the play button remains */
    }
  }, []);

  // Play when the card is mostly on screen, stop as soon as it scrolls away.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolved.playable) return;
    if (isActive) {
      if (shouldLoadSource && video.paused && !userPausedRef.current) {
        playAuto(video).then(() => {
          // scrolled away while the play request was pending
          if (!isActiveRef.current) video.pause();
        });
      }
    } else {
      userPausedRef.current = false;
      if (!video.paused) video.pause();
    }
  }, [isActive, shouldLoadSource, resolved.playable, playAuto]);

  // First real click / tap / key press anywhere: turn the sound on for a video
  // that had to start muted.
  useEffect(() => {
    const unlock = (e: Event) => {
      const video = videoRef.current;
      if (!video || !autoMutedRef.current || userMutedRef.current || video.paused) return;
      const nav = navigator as ActivationNavigator;
      const allowed = nav.userActivation
        ? nav.userActivation.isActive
        : e.type === "click" || e.type === "keydown";
      if (!allowed) return;
      video.muted = false;
      autoMutedRef.current = false;
      setNeedsSoundTap(false);
      if (video.paused) video.play().catch(() => {});
    };
    const events = ["click", "touchend", "keydown"] as const;
    events.forEach((ev) => window.addEventListener(ev, unlock, { passive: true }));
    return () => events.forEach((ev) => window.removeEventListener(ev, unlock));
  }, []);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      playAuto(video);
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    userMutedRef.current = video.muted;
    autoMutedRef.current = false;
    setNeedsSoundTap(false);
    setIsMuted(video.muted);
  }

  function toggleFullscreen() {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      container.requestFullscreen?.().catch(() => {});
    }
  }

  function handleScrub(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current;
    if (!video || !duration) return;
    const pct = Number(e.target.value);
    setProgress(pct);
    video.currentTime = (pct / 100) * duration;
  }

  if (!resolved.playable) {
    return (
      <div ref={containerRef} className={className}>
        <PendingPlaceholder label="Video not yet configured" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`group/player relative bg-background ${className || ""}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isScrubbing && setShowControls(false)}
    >
      {/* Ambient blurred backdrop so the frame fills the card with no dead
          black bars, while the real video (below) always shows in full */}
      {resolved.poster && (
        <img
          src={resolved.poster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-3xl saturate-[0.85] brightness-[0.5]"
        />
      )}

      <video
        ref={videoRef}
        className="relative h-full w-full cursor-pointer object-contain"
        loop
        playsInline
        preload="none"
        poster={resolved.poster}
        aria-label={alt}
        onClick={togglePlay}
        onPlay={(e) => {
          const v = e.currentTarget;
          if (activeVideo && activeVideo !== v) activeVideo.pause();
          activeVideo = v;
          setIsPlaying(true);
        }}
        onVolumeChange={(e) => setIsMuted(e.currentTarget.muted)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          if (isScrubbing) return;
          const t = e.currentTarget.currentTime;
          const d = e.currentTarget.duration || 0;
          setCurrent(t);
          if (d) setProgress((t / d) * 100);
        }}
      >
        {shouldLoadSource && <source src={resolved.url} type="video/mp4" />}
      </video>

      {/* Shown only when the browser made us start muted */}
      {needsSoundTap && isPlaying && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-background/60 px-3 py-1.5 text-xs tracking-wide text-primary backdrop-blur-md transition-colors hover:border-accent-bright/60"
        >
          <MutedIcon /> Tap for sound
        </button>
      )}

      {/* Center play button — visible when paused or on hover */}
      {(!isPlaying || showControls) && (
        <button
          type="button"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center transition-opacity"
        >
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-background/60 backdrop-blur-md transition-transform duration-300 hover:scale-105 hover:border-accent-bright/60 ${
              isPlaying ? "opacity-0 group-hover/player:opacity-100" : "opacity-100"
            }`}
          >
            {isPlaying ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
          </span>
        </button>
      )}

      {/* Bottom control bar */}
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-background/90 via-background/50 to-transparent px-4 pb-3 pt-8 transition-opacity duration-300 ${
          showControls || isScrubbing ? "opacity-100" : "opacity-0 group-hover/player:opacity-100"
        }`}
      >
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={handleScrub}
          onMouseDown={() => setIsScrubbing(true)}
          onMouseUp={() => setIsScrubbing(false)}
          onTouchStart={() => setIsScrubbing(true)}
          onTouchEnd={() => setIsScrubbing(false)}
          aria-label="Seek"
          className="video-scrubber"
          style={{ ["--progress" as string]: `${progress}%` }}
        />

        <div className="flex items-center justify-between text-primary">
          <div className="flex items-center gap-3">
            <button type="button" aria-label={isPlaying ? "Pause" : "Play"} onClick={togglePlay} className="transition-colors hover:text-accent-bright">
              {isPlaying ? <PauseIcon small /> : <PlayIcon small />}
            </button>
            <button type="button" aria-label={isMuted ? "Unmute" : "Mute"} onClick={toggleMute} className="transition-colors hover:text-accent-bright">
              {isMuted ? <MutedIcon /> : <VolumeIcon />}
            </button>
            <span className="text-xs tabular-nums tracking-wide text-muted">
              {formatTime(current)} / {formatTime(duration)}
            </span>
          </div>

          <button type="button" aria-label="Fullscreen" onClick={toggleFullscreen} className="transition-colors hover:text-accent-bright">
            <FullscreenIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function PendingPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface px-4 text-center text-xs text-muted">
      {label}
    </div>
  );
}

function PlayIcon({ small }: { small?: boolean }) {
  const size = small ? 16 : 22;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="translate-x-[1px] text-primary">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ small }: { small?: boolean }) {
  const size = small ? 16 : 22;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-primary">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 9v6h4l5 5V4L8 9H4zM16.5 12c0-1.77-.77-3.29-2-4.14v8.27c1.23-.85 2-2.36 2-4.13z" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 9v6h4l5 5V4L8 9H4zM19.5 12l2.5-2.5-1.5-1.5L18 10.5 15.5 8 14 9.5l2.5 2.5L14 14.5 15.5 16l2.5-2.5 2.5 2.5 1.5-1.5z" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 9V4h5v2H6v3H4zm10-5h5v5h-2V6h-3V4zM4 15h2v3h3v2H4v-5zm14 3v-3h2v5h-5v-2h3z" />
    </svg>
  );
}
