import { useEffect, useState } from "react"
import { Reveal } from "@/components/site/reveal"
import { Section } from "@/components/site/section"
import { Card, CardContent } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { models, sample, savedTime, supportAlone, type Coef } from "@/data/research"
import { cn } from "@/lib/utils"

type Mode = "core" | "withSupport"

// Plot domain for standardised coefficients.
const MIN = -0.45
const MAX = 0.7
const TICKS = [-0.4, -0.2, 0, 0.2, 0.4, 0.6]
const pos = (v: number) => `${((v - MIN) / (MAX - MIN)) * 100}%`
const fmt = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(2).replace(/^0/, "")}`

const COPY: Record<Mode, { title: string; body: string }> = {
  core: {
    title: "Attitude and autonomy drive intention. Capability does not.",
    body: "What predicts whether an engineer intends to use AI tools is whether they think the tools are worth it and whether they're free to decide how to use them. Feeling skilled enough adds nothing once those are known. Adoption looks more like a question of latitude and trust than of training.",
  },
  withSupport: {
    title: "Support helps, until you account for autonomy.",
    body: `On its own, organisational support goes with higher intention (r = ${fmt(supportAlone.r)}). Held alongside autonomy and the rest, the sign flips (β = −.21). The interviews suggest why: support helped when it enabled engineers and left the decision to them, and held use back when it blocked access or prescribed use task by task.`,
  },
}

export function Research() {
  const [mode, setMode] = useState<Mode>("core")
  const model = models[mode]
  const copy = COPY[mode]

  return (
    <Section id="research" title="Research" tag="ETH Zürich">
      <Reveal>
        <Card className="relative overflow-visible border border-foreground bg-transparent py-0 shadow-none ring-0 before:absolute before:-top-px before:-left-px before:size-11.5 before:border-t-4 before:border-l-4 before:border-signal">
          <CardContent className="grid gap-4.5 px-5 py-8 sm:px-8">
            <span className="font-mono text-xs tracking-[.08em] text-signal uppercase">MAS Thesis · in progress</span>
            <h3 className="font-heading text-[clamp(19px,2.6vw,25px)] leading-snug font-extrabold">
              The Everyday Use of AI Development Tools: Attitudes, Intention, and Time Reallocation Among Software
              Engineers
            </h3>
            <p className="max-w-[760px] text-[15.5px] text-prose">
              A mixed-methods study of how software engineers adopt AI development tools: a survey of {sample.n}{" "}
              engineers, then {sample.interviews} interviews to explain what the numbers couldn't.
            </p>

            {/* ---- finding 1: what drives intention ---- */}
            <div className="mt-4 border-t pt-7">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-[560px]">
                  <div className="font-mono text-[11px] tracking-[.08em] text-muted-foreground uppercase">
                    Finding 01 · what predicts intention to use AI tools
                  </div>
                  <h4 aria-live="polite" className="mt-1.5 font-heading text-xl leading-tight font-extrabold">
                    {copy.title}
                  </h4>
                </div>
                <ToggleGroup
                  aria-label="Model"
                  value={[mode]}
                  onValueChange={(v: string[]) => v[0] && setMode(v[0] as Mode)}
                  spacing={0}
                  className="border border-foreground"
                >
                  {(
                    [
                      ["core", "Core model"],
                      ["withSupport", "+ Org support"],
                    ] as const
                  ).map(([value, label]) => (
                    <ToggleGroupItem
                      key={value}
                      value={value}
                      className="h-9 rounded-none px-3.5 font-mono text-xs tracking-[.04em] uppercase data-pressed:bg-foreground data-pressed:text-background"
                    >
                      {label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <CoefChart coefs={model.coefs} mode={mode} />

              <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
                <p className="max-w-[640px] text-[15px] leading-relaxed text-prose">{copy.body}</p>
                <dl className="flex gap-6 font-mono text-xs text-muted-foreground md:flex-col md:gap-2 md:text-right">
                  <div>
                    <dt className="inline">R² </dt>
                    <dd className="inline font-medium text-foreground">{model.r2.toFixed(2).replace(/^0/, "")}</dd>
                  </div>
                  <div>
                    <dt className="inline">N </dt>
                    <dd className="inline font-medium text-foreground">{sample.n}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* ---- finding 2: where the saved time went ---- */}
            <div className="mt-4 border-t pt-7">
              <div className="font-mono text-[11px] tracking-[.08em] text-muted-foreground uppercase">
                Finding 02 · where the saved time went
              </div>
              <h4 className="mt-1.5 font-heading text-xl leading-tight font-extrabold">
                Saved time is an organisational outcome, not a personal one.
              </h4>
              <p className="mt-3 max-w-[680px] text-[15px] leading-relaxed text-prose">
                The survey assumed time saved by AI goes into higher-value work. In the interviews, almost nobody
                described that. What the time turned into depended on the organisation around the engineer:
              </p>
              <ul className="mt-5 grid border sm:grid-cols-3">
                {savedTime.map((s) => (
                  <li key={s.title} className="border-b px-5 py-4.5 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0">
                    <div className="font-heading text-lg font-extrabold uppercase">{s.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.where}</div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
              Cross-sectional survey, so these are associations, not causal effects. Standardised OLS coefficients with
              95% confidence intervals. The sample leans towards engineers already positive about AI.
            </p>
          </CardContent>
        </Card>
      </Reveal>
    </Section>
  )
}

function CoefChart({ coefs, mode }: { coefs: Coef[]; mode: Mode }) {
  return (
    <div className="mt-6">
      <ul aria-label="Standardised coefficients with 95% confidence intervals">
        {coefs.map((c) => (
          <CoefRow key={c.key} coef={c} fresh={c.key === "support" && mode === "withSupport"} />
        ))}
      </ul>

      {/* axis */}
      <div className="grid grid-cols-[1fr_52px] sm:grid-cols-[200px_1fr_52px]" aria-hidden>
        <div className="hidden sm:block" />
        <div className="relative h-6 border-t border-foreground">
          {TICKS.map((t) => (
            <span
              key={t}
              style={{ left: pos(t) }}
              className="absolute top-1 -translate-x-1/2 font-mono text-[10px] text-muted-foreground"
            >
              {t === 0 ? "0" : fmt(t)}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-muted-foreground sm:pl-[200px]">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground" /> clearly above zero
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-signal" /> clearly below zero
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border-2 border-muted-foreground" /> can't tell from zero
        </span>
      </div>
    </div>
  )
}

function CoefRow({ coef, fresh }: { coef: Coef; fresh: boolean }) {
  // The org-support row enters at its stand-alone correlation, then flips to its partial β.
  const [flipped, setFlipped] = useState(!fresh)
  useEffect(() => {
    if (!fresh) return
    const t = setTimeout(() => setFlipped(true), 450)
    return () => clearTimeout(t)
  }, [fresh])

  const beta = flipped ? coef.beta : supportAlone.r
  const ci: [number, number] = flipped ? coef.ci : [supportAlone.r, supportAlone.r]
  const significant = ci[0] > 0 || ci[1] < 0
  const negative = significant && beta < 0

  return (
    <li className="grid grid-cols-[1fr_52px] items-center border-b border-dashed py-2 animate-in fade-in-0 duration-300 sm:grid-cols-[200px_1fr_52px]">
      <div className="col-span-2 pb-1 sm:col-span-1 sm:pr-4 sm:pb-0">
        <div className="text-[14.5px] font-semibold">{coef.label}</div>
        <div className="text-xs text-muted-foreground">{coef.hint}</div>
      </div>

      <div className="relative h-8" aria-hidden>
        <span className="absolute inset-y-0 w-px bg-foreground/40" style={{ left: pos(0) }} />
        {coef.key === "support" && (
          <>
            <span
              className="absolute top-1/2 size-3 -translate-1/2 rounded-full border-2 border-dashed border-muted-foreground"
              style={{ left: pos(supportAlone.r) }}
            />
            <span
              className={cn(
                "absolute -top-1.5 -translate-x-1/2 font-mono text-[9px] text-muted-foreground transition-opacity duration-500",
                flipped ? "opacity-100" : "opacity-0"
              )}
              style={{ left: pos(supportAlone.r) }}
            >
              alone
            </span>
          </>
        )}
        <span
          className={cn(
            "absolute top-1/2 h-0.5 -translate-y-1/2 transition-all duration-700 ease-out",
            negative ? "bg-signal" : significant ? "bg-foreground" : "bg-muted-foreground/60"
          )}
          style={{ left: pos(ci[0]), width: `calc(${pos(ci[1])} - ${pos(ci[0])})` }}
        />
        <span
          className={cn(
            "absolute top-1/2 size-3.5 -translate-1/2 rounded-full transition-all duration-700 ease-out",
            negative ? "bg-signal" : significant ? "bg-foreground" : "border-2 border-muted-foreground bg-background"
          )}
          style={{ left: pos(beta) }}
        />
      </div>

      <div
        className={cn(
          "text-right font-mono text-[13px] tabular-nums",
          negative ? "text-signal" : significant ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {fmt(beta)}
      </div>
      <span className="sr-only">
        {coef.label}: {flipped ? `β = ${fmt(coef.beta)}, 95% CI ${fmt(coef.ci[0])} to ${fmt(coef.ci[1])}` : ""}
      </span>
    </li>
  )
}
