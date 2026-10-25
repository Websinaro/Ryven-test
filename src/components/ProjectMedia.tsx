import VideoPlayer from "./VideoPlayer";
import type { ResolvedMedia } from "@/data/portfolio";

export default function ProjectMedia({
  resolved,
  alt,
  aspect = "aspect-video",
}: {
  resolved: ResolvedMedia;
  alt: string;
  aspect?: string;
}) {
  return (
    <VideoPlayer
      resolved={resolved}
      alt={alt}
      className={`relative w-full overflow-hidden rounded-xl bg-surface ${aspect}`}
    />
  );
}
