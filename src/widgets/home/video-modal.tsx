"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";

interface VideoModalProps {
  title: string;
  videoSrc: string;
  onClose: () => void;
}

export function VideoModal({ title, videoSrc, onClose }: VideoModalProps) {
  const [hasEnded, setHasEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-card shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/70 text-primary-foreground transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Cerrar video"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-video w-full bg-foreground">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            onEnded={() => setHasEnded(true)}
            className="h-full w-full"
            aria-label={title}
          >
            <track kind="captions" />
          </video>
        </div>

        {hasEnded && (
          <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
            <p className="text-xl font-medium text-foreground">
              {"¿Querés probar en el chat?"}
            </p>
            <Link
              href="/chat"
              className="inline-flex h-13 items-center rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Ir al chat
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
