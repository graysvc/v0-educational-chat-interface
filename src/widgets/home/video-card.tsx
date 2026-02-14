"use client";

import Image from "next/image";
import { Play } from "lucide-react";

interface VideoCardProps {
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  onClick: () => void;
}

export function VideoCard({
  title,
  description,
  duration,
  thumbnail,
  onClick,
}: VideoCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-sm transition-transform group-hover:scale-110">
            <Play className="ml-1 h-6 w-6" aria-hidden="true" />
          </div>
        </div>
        <span className="absolute bottom-3 right-3 rounded-md bg-foreground/70 px-2 py-0.5 text-xs font-medium text-primary-foreground">
          {duration}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </button>
  );
}
