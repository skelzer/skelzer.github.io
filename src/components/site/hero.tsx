import { ArrowRightIcon } from "lucide-react"
import { Fragment } from "react"
import { Reveal } from "@/components/site/reveal"
import { contact, route } from "@/data/cv"
import { cn } from "@/lib/utils"

export function Hero({ fiesta }: { fiesta: boolean }) {
  return (
    <section className="relative py-18">
      <div aria-hidden className="hero-grid absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 opacity-45" />

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
        Zürich, Switzerland · Open to engineering leadership roles
      </p>

      <h1 className="font-heading font-wide text-[clamp(34px,10.5vw,92px)] leading-[.98] font-black tracking-[-.015em] uppercase">
        Engineering
        <br />
        leader for
        <br />
        reliable,{" "}
        <span className="relative inline-block text-signal after:absolute after:bottom-[.04em] after:left-0 after:h-[.08em] after:w-full after:origin-left after:scale-x-0 after:bg-signal after:animate-[draw_.7s_.6s_ease_forwards]">
          AI-aug&shy;mented
        </span>{" "}
        teams
      </h1>

      <p className="mt-6 max-w-[620px] text-[clamp(16px,2vw,19px)] leading-relaxed">
        My career runs from soldering embedded systems in Málaga to leading the team that keeps a Swiss digital-health
        platform running for enterprise clients, and now to researching at ETH Zürich how engineering teams actually
        adopt AI. The thread through all of it: making technology dependable, and making teams better at building it.
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

      <Reveal
        aria-label="Career route"
        role="list"
        className="mt-13 flex flex-col border border-foreground bg-background sm:flex-row sm:items-stretch"
      >
        {route.map((stop, i) => (
          <Fragment key={stop.city}>
            {i > 0 && (
              <ArrowRightIcon
                aria-hidden
                className="ml-5 size-5 flex-none rotate-90 self-start text-signal sm:mx-1 sm:rotate-0 sm:self-center"
              />
            )}
            <div
              role="listitem"
              className={cn(
                "flex min-w-[150px] flex-1 flex-col gap-0.5 px-5 pt-5 pb-4",
                stop.current && "bg-foreground text-background"
              )}
            >
              <span className="font-heading text-[clamp(19px,2.6vw,26px)] font-extrabold tracking-[.01em] uppercase">
                {stop.city}
              </span>
              <span className={cn("text-[13px]", stop.current ? "opacity-70" : "text-muted-foreground")}>
                {stop.what}
              </span>
              <span className={cn("mt-1.5 font-mono text-xs", stop.current ? "opacity-70" : "text-muted-foreground")}>
                {stop.year}
                {stop.current && (
                  <>
                    {" – "}
                    <span className="text-go dark:text-[#1d7a44]">still here</span>
                  </>
                )}
              </span>
            </div>
          </Fragment>
        ))}
      </Reveal>
    </section>
  )
}
