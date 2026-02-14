import { Hero, Paths, Trust } from "@/widgets/home";
import { SiteHeader, SiteFooter } from "@/widgets/layout";

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
  );
}
