import { useEffect, useRef, useState } from "react"
import { startFiestaCanvas } from "@/lib/fiesta-canvas"

const SEQ = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]
// Cuban Sandwich runs ~178 BPM => ~337ms per 8th note. Adjust if you swap the track.
const BEAT_MS = 337
const TRACK = `${import.meta.env.BASE_URL}Cuban%20Sandwich.mp3`

/** Konami code toggles 8-bit fiesta mode; Esc stops it. */
export function useFiesta() {
  const [playing, setPlaying] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    let pos = 0
    const onKey = (e: KeyboardEvent) => {
      // Don't treat typing in a text field (e.g. the "Ask my CV" box) as the code.
      if (e.key !== "Escape" && (e.target as HTMLElement | null)?.closest?.("input, textarea, [contenteditable]")) return
      if (e.key === "Escape") {
        setPlaying(false)
        pos = 0
        return
      }
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      pos = k === SEQ[pos] ? pos + 1 : k === SEQ[0] ? 1 : 0
      if (pos === SEQ.length) {
        pos = 0
        // Start audio inside the key handler so autoplay policies allow it.
        audio.current ??= Object.assign(new Audio(TRACK), { loop: true })
        setPlaying((p) => {
          if (p) audio.current!.pause()
          else {
            audio.current!.currentTime = 0
            audio.current!.play().catch(() => {})
          }
          return !p
        })
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!playing) {
      audio.current?.pause()
      return
    }
    let beat = 0
    const timer = setInterval(() => beat++, BEAT_MS)
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    const stopCanvas = reduced ? undefined : startFiestaCanvas(() => beat)
    return () => {
      clearInterval(timer)
      stopCanvas?.()
    }
  }, [playing])

  return playing
}
