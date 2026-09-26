import { AskMyCv } from "@/components/site/ask"
import { Contact } from "@/components/site/contact"
import { Education } from "@/components/site/education"
import { Header } from "@/components/site/header"
import { Hero } from "@/components/site/hero"
import { Route } from "@/components/site/route"
import { Research } from "@/components/site/research"
import { Skills } from "@/components/site/skills"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useFiesta } from "@/hooks/use-fiesta"

export default function App() {
  const fiesta = useFiesta()

  return (
    <TooltipProvider>
      <Header />
      <main id="top" className="mx-auto max-w-[1120px] px-4 sm:px-7">
        <Hero fiesta={fiesta} />
        <Route />
        <Research />
        <Skills />
        <Education />
        <Contact />
        <footer className="flex flex-wrap justify-between gap-2 border-t pt-5.5 pb-10 font-mono text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Miguel Luque</span>
          {/* Konami code hint: only where there's a keyboard to type it */}
          <span
            title="Try it on this page"
            className="hidden tracking-[.3em] opacity-40 transition-opacity hover:opacity-100 [@media(pointer:fine)]:inline"
          >
            ↑↑↓↓←→←→BA
          </span>
          <span>ZRH · 47.3769° N, 8.5417° E</span>
        </footer>
      </main>

      <AskMyCv />

      {fiesta && (
        <div
          role="status"
          className="fixed bottom-4.5 left-1/2 z-[99] -translate-x-1/2 border border-signal bg-ink px-4.5 py-2.5 font-mono text-xs tracking-[.06em] text-paper"
        >
          ♪ 8-BIT FIESTA · Esc to stop
        </div>
      )}
    </TooltipProvider>
  )
}
