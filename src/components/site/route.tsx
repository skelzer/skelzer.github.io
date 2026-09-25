import { useCallback, useEffect, useRef, useState } from "react"
import { Section } from "@/components/site/section"
import { Badge } from "@/components/ui/badge"
import { chapters, roles, type Chapter } from "@/data/cv"
import { europeLand } from "@/data/europe-land"
import { cn } from "@/lib/utils"

// Flight-style arcs between consecutive stops (quadratic control points, map units).
const ARCS = ["M79 306 Q170 110 406 56", "M406 56 Q340 40 262 92"]
const ARC_LABELS: [number, number][] = [
  [236, 154],
  [340, 82],
]
// City label offsets from each stop, placed to stay clear of the arcs.
const LABEL_POS: Record<string, [number, number]> = { malaga: [12, 5], zilina: [-10, -12], zurich: [-12, 20] }
const TOTAL_KM = chapters.reduce((s, c) => s + (c.km ?? 0), 0)

type Listener = (progress: number[]) => void

function fmtCoords([lat, lon]: [number, number]) {
  return `${lat.toFixed(2)}° N, ${Math.abs(lon).toFixed(2)}° ${lon < 0 ? "W" : "E"}`
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Tracks how far each chapter has scrolled past a reading line at 60% of the
 * viewport (0 → 1), and which chapter sits at the middle of the screen.
 * Progress is pushed to subscribers imperatively so scrolling never re-renders.
 */
function useChapterProgress() {
  const refs = useRef<(HTMLElement | null)[]>([])
  const listeners = useRef(new Set<Listener>())
  const last = useRef<number[]>(chapters.map(() => 0))
  const [active, setActive] = useState(0)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const line = innerHeight * 0.6
      const mid = innerHeight * 0.5
      let current = 0
      last.current = refs.current.map((el, i) => {
        if (!el) return 0
        const r = el.getBoundingClientRect()
        if (r.top <= mid) current = i
        return clamp01((line - r.top) / r.height)
      })
      setActive(current)
      listeners.current.forEach((l) => l(last.current))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    addEventListener("scroll", schedule, { passive: true })
    addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener("scroll", schedule)
      removeEventListener("resize", schedule)
    }
  }, [])

  const subscribe = useCallback((l: Listener) => {
    listeners.current.add(l)
    l(last.current)
    return () => void listeners.current.delete(l)
  }, [])

  return { refs, active, subscribe }
}

export function Route() {
  const { refs, active, subscribe } = useChapterProgress()

  return (
    <Section id="route" title="The Route" tag={`${TOTAL_KM.toLocaleString("en")} km · 2014 – present`}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <RouteMap subscribe={subscribe} active={active} />
          </div>
        </div>

        <div>
          <RouteBar subscribe={subscribe} active={active} />
          {chapters.map((c, i) => (
            <ChapterBlock
              key={c.id}
              ref={(el) => {
                refs.current[i] = el
              }}
              chapter={c}
              index={i}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}

function ChapterBlock({ chapter, index, ref }: { chapter: Chapter; index: number; ref: React.Ref<HTMLElement> }) {
  // roles are stored newest-first; a journey reads oldest-first
  const stops = roles.filter((r) => r.chapter === chapter.id).reverse()

  return (
    <article ref={ref} id={chapter.id} aria-labelledby={`${chapter.id}-title`} className="scroll-mt-28 pb-16 lg:min-h-[70vh]">
      <header className="mb-8 border-b border-foreground pb-5">
        <div className="font-mono text-xs tracking-[.08em] text-muted-foreground uppercase">
          {String(index + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")} · {chapter.years}
        </div>
        <h3
          id={`${chapter.id}-title`}
          className="mt-2 font-heading font-wide text-[clamp(44px,7vw,80px)] leading-[.9] font-black tracking-[-.01em] uppercase"
        >
          {chapter.city}
          <span className="text-signal">.</span>
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
          <span>{fmtCoords(chapter.coords)}</span>
          <span>{chapter.what}</span>
          {chapter.km && <span className="text-signal">+{chapter.km.toLocaleString("en")} km</span>}
        </div>
      </header>

      <ol className="space-y-10">
        {stops.map((role) => (
          <li key={role.title + role.when} className="grid gap-2 sm:grid-cols-[150px_1fr] sm:gap-6">
            <div className="font-mono text-[13px] leading-[1.7] text-muted-foreground">
              {role.when}
              {role.current && (
                <>
                  {" – "}
                  <span className="font-medium text-go">present</span>
                </>
              )}
            </div>
            <div>
              <h4 className="font-heading text-xl leading-tight font-bold">
                {role.title}
                {role.current && (
                  <Badge
                    variant="outline"
                    className="ml-2.5 translate-y-[-2px] border-go font-mono text-[10px] tracking-[.08em] text-go uppercase"
                  >
                    Current
                  </Badge>
                )}
              </h4>
              <p className="mt-1 mb-3.5 font-mono text-[13px] text-muted-foreground">{role.org}</p>
              <div className="max-w-[640px] space-y-3 text-[15.5px] leading-[1.65] text-prose">
                {role.prose.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}

function RouteMap({ subscribe, active }: { subscribe: (l: Listener) => () => void; active: number }) {
  const arcRefs = useRef<(SVGPathElement | null)[]>([])
  const labelRefs = useRef<(SVGTextElement | null)[]>([])
  const markerRef = useRef<SVGCircleElement>(null)

  useEffect(
    () =>
      subscribe((progress) => {
        ARCS.forEach((_, i) => {
          const p = progress[i]
          arcRefs.current[i]?.style.setProperty("stroke-dashoffset", String(1 - p))
          labelRefs.current[i]?.style.setProperty("opacity", String(clamp01((p - 0.6) / 0.3)))
        })
        // "you are here": ride along whichever arc is still being drawn
        let seg = ARCS.findIndex((_, i) => progress[i] < 1)
        if (seg === -1) seg = ARCS.length - 1
        const path = arcRefs.current[seg]
        if (!path || !markerRef.current) return
        const pt = path.getPointAtLength(path.getTotalLength() * progress[seg])
        markerRef.current.setAttribute("cx", String(pt.x))
        markerRef.current.setAttribute("cy", String(pt.y))
      }),
    [subscribe]
  )

  const here = chapters[active]

  return (
    <figure className="border border-foreground bg-background">
      <svg viewBox="-14 -20 481 380" role="img" aria-label="Map of the route from Málaga via Žilina to Zürich" className="block w-full">
        {/* graticule */}
        <g className="stroke-border" strokeWidth={1}>
          {[-10, -5, 0, 5, 10, 15, 20].map((lon) => {
            const x = (lon + 10) * 20 * Math.SQRT1_2
            return <line key={lon} x1={x} x2={x} y1={-20} y2={360} />
          })}
          {[35, 40, 45, 50].map((lat) => {
            const y = (52 - lat) * 20
            return <line key={lat} x1={-14} x2={467} y1={y} y2={y} />
          })}
        </g>
        <g className="fill-muted-foreground font-mono" fontSize={8} opacity={0.7}>
          {[35, 40, 45, 50].map((lat) => (
            <text key={lat} x={-10} y={(52 - lat) * 20 - 4}>
              {lat}°N
            </text>
          ))}
        </g>

        <path d={europeLand} className="fill-muted" opacity={0.75} />

        {/* ghost route */}
        {ARCS.map((d) => (
          <path key={d} d={d} fill="none" className="stroke-muted-foreground" strokeWidth={1.25} strokeDasharray="3 5" opacity={0.6} />
        ))}
        {/* drawn route: normalised length, revealed by stroke-dashoffset */}
        {ARCS.map((d, i) => (
          <path
            key={d}
            ref={(el) => {
              arcRefs.current[i] = el
            }}
            d={d}
            pathLength={1}
            fill="none"
            className="stroke-signal"
            strokeWidth={2.5}
            strokeDasharray="1 1"
            strokeDashoffset={1}
          />
        ))}
        {ARCS.map((d, i) => (
          <text
            key={d}
            ref={(el) => {
              labelRefs.current[i] = el
            }}
            x={ARC_LABELS[i][0]}
            y={ARC_LABELS[i][1]}
            className="fill-signal font-mono"
            fontSize={9}
            opacity={0}
          >
            {chapters[i + 1].km!.toLocaleString("en")} km
          </text>
        ))}

        {/* stops */}
        {chapters.map((c, i) => {
          const isActive = i === active
          const visited = i <= active
          return (
            <g key={c.id} transform={`translate(${c.map[0]} ${c.map[1]})`}>
              {isActive && (
                <circle
                  r={10}
                  className="origin-center animate-[ping-ring_2s_ease-out_infinite] fill-none stroke-signal [transform-box:fill-box]"
                  strokeWidth={1}
                />
              )}
              <rect
                x={-5}
                y={-5}
                width={10}
                height={10}
                className={cn("transition-colors", isActive ? "fill-signal" : visited ? "fill-foreground" : "fill-background stroke-foreground")}
                strokeWidth={1.5}
              />
              <text
                x={LABEL_POS[c.id][0]}
                y={LABEL_POS[c.id][1]}
                textAnchor={c.id === "malaga" ? "start" : "end"}
                className={cn("font-heading font-extrabold uppercase transition-colors", isActive ? "fill-signal" : "fill-foreground")}
                fontSize={15}
              >
                {c.city}
              </text>
            </g>
          )
        })}

        {/* you are here */}
        <circle ref={markerRef} cx={chapters[0].map[0]} cy={chapters[0].map[1]} r={4} className="fill-background stroke-signal" strokeWidth={2.5} />
      </svg>

      <figcaption className="grid grid-cols-[1fr_auto] items-end gap-4 border-t border-foreground px-5 py-4">
        <div aria-live="polite">
          <div className="font-mono text-[11px] tracking-[.08em] text-muted-foreground uppercase">Now reading</div>
          <div className="font-heading text-2xl font-extrabold uppercase">
            {here.city}, {here.country}
          </div>
          <div className="font-mono text-xs text-muted-foreground">{fmtCoords(here.coords)}</div>
        </div>
        <div className="text-right font-mono text-xs leading-relaxed text-muted-foreground">
          {TOTAL_KM.toLocaleString("en")} km
          <br />
          {chapters.length} countries
          <br />
          {new Date().getFullYear() - 2014} years
        </div>
      </figcaption>
    </figure>
  )
}

/** Compact progress rail for small screens, pinned while reading the chapters. */
function RouteBar({ subscribe, active }: { subscribe: (l: Listener) => () => void; active: number }) {
  const fillRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(
    () =>
      subscribe((progress) =>
        fillRefs.current.forEach((el, i) => el?.style.setProperty("transform", `scaleX(${progress[i]})`))
      ),
    [subscribe]
  )

  return (
    <div className="sticky top-[57px] z-30 -mx-4 mb-8 flex items-center gap-2 border-b bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-7 sm:px-7 lg:hidden">
      {chapters.map((c, i) => (
        <div key={c.id} className={cn("flex items-center gap-2", i < chapters.length - 1 && "flex-1")}>
          <a
            href={`#${c.id}`}
            className={cn(
              "font-heading text-xs font-extrabold uppercase no-underline transition-colors",
              i === active ? "text-signal" : "text-foreground"
            )}
          >
            {c.city}
          </a>
          {i < chapters.length - 1 && (
            <div className="relative h-0.5 flex-1 bg-muted">
              <div
                ref={(el) => {
                  fillRefs.current[i] = el
                }}
                className="absolute inset-0 origin-left scale-x-0 bg-signal"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
