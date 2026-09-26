import { ArrowDownIcon } from "lucide-react"
import { contact } from "@/data/cv"
import { cn } from "@/lib/utils"

export function Hero({ fiesta }: { fiesta: boolean }) {
  return (
    <section className="relative py-18">
      <div aria-hidden className="hero-grid absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 opacity-45" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start lg:gap-12">
        <div>
          <p className="mb-5 flex items-center gap-2.5 font-mono text-[12.5px] tracking-[.08em] text-muted-foreground uppercase">
            <span
              aria-hidden
              className={cn(
                "relative size-2 flex-none rounded-full transition-colors",
                fiesta ? "bg-signal" : "bg-go",
                "after:absolute after:-inset-1 after:rounded-full after:border after:border-current after:opacity-50 after:animate-[ping-ring_2.2s_ease-out_infinite]",
                fiesta ? "text-signal" : "text-go"
              )}
            />
            Zürich, Switzerland · Agentic AI Engineer at Sunrise
          </p>

          <h1 className="font-heading font-wide text-[clamp(34px,10.5vw,92px)] leading-[.98] font-black tracking-[-.015em] uppercase">
            Making
            <br />
            <span className="relative inline-block text-signal after:absolute after:bottom-[.04em] after:left-0 after:h-[.08em] after:w-full after:origin-left after:scale-x-0 after:bg-signal after:animate-[draw_.7s_.6s_ease_forwards]">
              agentic AI
            </span>
            <br />
            reliable.
          </h1>

          <p className="mt-6 max-w-[620px] text-[clamp(16px,2vw,19px)] leading-relaxed">
            My career runs from soldering embedded systems in Málaga, through leading the team that kept a Swiss
            digital-health platform running for enterprise clients, to an ETH Zürich thesis on how engineers actually
            adopt AI. Now I build agentic AI at Sunrise. The thread through all of it: making technology dependable, and
            making teams better at building it.
          </p>

          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2.5 font-mono text-[13px] text-muted-foreground">
            <span>{contact.email}</span>
            {[contact.linkedin, contact.github].map((href) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener"
                className="border-b no-underline hover:border-foreground hover:text-foreground"
              >
                {href.replace("https://", "")}
              </a>
            ))}
            <span>EN · DE · ES · IT</span>
          </div>
        </div>

        <Portrait fiesta={fiesta} />
      </div>

      <a
        href="#route"
        className="group mt-13 inline-flex items-center gap-3 border border-foreground px-5 py-3.5 font-mono text-[13px] tracking-[.06em] uppercase no-underline transition hover:bg-foreground hover:text-background"
      >
        <span className="font-heading text-base font-extrabold tracking-normal">Málaga</span>
        <span className="h-px w-8 bg-signal transition-[width] group-hover:w-14" />
        <span className="font-heading text-base font-extrabold tracking-normal">Žilina</span>
        <span className="h-px w-8 bg-signal transition-[width] group-hover:w-14" />
        <span className="font-heading text-base font-extrabold tracking-normal">Zürich</span>
        <ArrowDownIcon aria-hidden className="size-4 text-signal transition-transform group-hover:translate-y-0.5" />
        <span className="sr-only">Follow the route</span>
      </a>
    </section>
  )
}

function Portrait({ fiesta }: { fiesta: boolean }) {
  return (
    <figure className="order-first w-28 sm:w-36 lg:order-none lg:mt-10 lg:w-full">
      <div
        className={cn(
          "relative transition-transform duration-500",
          "before:absolute before:inset-0 before:translate-x-2 before:translate-y-2 before:bg-foreground lg:before:translate-x-3 lg:before:translate-y-3",
          fiesta && "rotate-3"
        )}
      >
        <img
          src={`${import.meta.env.BASE_URL}miguel.webp`}
          alt="Miguel Luque smiling, in a Pikachu T-shirt, holding two cans"
          width={720}
          height={720}
          decoding="async"
          className="relative block aspect-square w-full border border-foreground bg-muted object-cover"
        />
        <span aria-hidden className="absolute -top-px -left-px size-6 border-t-4 border-l-4 border-signal lg:size-9" />
      </div>
    </figure>
  )
}
