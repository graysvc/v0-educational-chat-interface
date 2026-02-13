import { SiteHeader } from "@/components/home/site-header"
import { Hero } from "@/components/home/hero"
import { Paths } from "@/components/home/paths"
import { Trust } from "@/components/home/trust"
import { SiteFooter } from "@/components/home/site-footer"

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Paths />
        <Trust />
      </main>
      <SiteFooter />
    </div>
  )
}
