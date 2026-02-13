"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/home/site-header"
import { SiteFooter } from "@/components/home/site-footer"
import { VideoCard } from "@/components/videos/video-card"
import { VideoModal } from "@/components/videos/video-modal"

const videos = [
  {
    id: "1",
    title: "Como hacer tu primera pregunta",
    description: "Mira como empezar sin miedo.",
    duration: "2 min",
    thumbnail: "/videos/thumb-1.jpg",
    src: "",
  },
  {
    id: "2",
    title: "Ejemplo de una conversacion real",
    description: "Paso a paso, como lo usaria alguien como vos.",
    duration: "3 min",
    thumbnail: "/videos/thumb-2.jpg",
    src: "",
  },
  {
    id: "3",
    title: "Errores comunes y como solucionarlos",
    description: "Que hacer si algo no sale como esperabas.",
    duration: "2 min",
    thumbnail: "/videos/thumb-3.jpg",
    src: "",
  },
  {
    id: "4",
    title: "Trucos simples para aprovechar mejor el chat",
    description: "Pequenos detalles que hacen la diferencia.",
    duration: "2 min",
    thumbnail: "/videos/thumb-4.jpg",
    src: "",
  },
]

export default function VideosPage() {
  const [activeVideo, setActiveVideo] = useState<(typeof videos)[0] | null>(null)

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm font-semibold tracking-widest uppercase text-muted-foreground">
            Videos
          </p>
          <h1 className="mt-4 text-center text-balance text-2xl font-medium leading-snug text-foreground md:text-4xl md:leading-tight">
            Explicaciones cortas y simples
          </h1>
          <p className="mt-5 text-center text-base leading-relaxed text-muted-foreground md:text-lg">
            Videos breves para acompanarte paso a paso.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                title={video.title}
                description={video.description}
                duration={video.duration}
                thumbnail={video.thumbnail}
                onClick={() => setActiveVideo(video)}
              />
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />

      {activeVideo && (
        <VideoModal
          title={activeVideo.title}
          videoSrc={activeVideo.src}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </div>
  )
}
