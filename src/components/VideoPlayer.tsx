"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import type { ResolvedMedia } from "@/data/portfolio";

type Props = {
  resolved: ResolvedMedia;
  alt: string;
  className?: string;
};

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
  const isInView = useInView(containerRef, { margin: "200px 0px", once: false });

  const [shouldLoadSource, setShouldLoadSource] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0); // 0–100
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);

  useEffect(() => {
    if (isInView && resolved.playable) setShouldLoadSource(true);
  }, [isInView, resolved.playable]);

  // Pause automatically once it scrolls out of view.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadSource) return;
    if (!isInView && isPlaying) video.pause();
  }, [isInView, shouldLoadSource, isPlaying]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
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
        muted={isMuted}
        loop
        playsInline
        preload="none"
        poster={resolved.poster}
        aria-label={alt}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
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
