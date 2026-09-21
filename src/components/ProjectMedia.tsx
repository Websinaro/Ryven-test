import VideoPlayer from "./VideoPlayer";
import type { ResolvedMedia } from "@/data/portfolio";

export default function ProjectMedia({ resolved, alt }: { resolved: ResolvedMedia; alt: string }) {
  return (
    <VideoPlayer
      resolved={resolved}
      alt={alt}
      className="relative aspect-video w-full overflow-hidden rounded-xl bg-surface md:aspect-[16/8]"
    />
  );
}
