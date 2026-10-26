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
      className={`relative w-full overflow-hidden border border-line bg-background transition-colors duration-500 group-hover:border-accent/50 ${aspect}`}
    />
  );
}
