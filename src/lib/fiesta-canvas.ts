// 8-bit fiesta: pixel Latin dancers + confetti, drawn on a fixed canvas.

type Palette = { skin: string; hair: string; dress: string; trim: string }
type Dancer = { bx: number; by: number; px: number; pal: Palette; phase: number; flip: number }
type Confetto = { x: number; y: number; w: number; h: number; vx: number; vy: number; rot: number; vr: number; c: string }

const PALETTES: Palette[] = [
  { skin: "#E8B98C", hair: "#2A1B12", dress: "#E63327", trim: "#F4C430" },
  { skin: "#C98A5E", hair: "#14171B", dress: "#2E9E5B", trim: "#FAFAF8" },
  { skin: "#F0C9A0", hair: "#3A2416", dress: "#3B7DD8", trim: "#F4C430" },
  { skin: "#B57A4D", hair: "#1A1A1A", dress: "#F4C430", trim: "#E63327" },
]
const CONFETTI_COLORS = ["#E63327", "#2E9E5B", "#14171B", "#F4C430", "#3B7DD8"]

function makeDancers(): Dancer[] {
  const n = innerWidth < 620 ? 3 : 5
  return Array.from({ length: n }, (_, i) => ({
    bx: (innerWidth * (i + 0.5)) / n,
    by: innerHeight - 48,
    px: 5 + Math.random() * 2,
    pal: PALETTES[i % PALETTES.length],
    phase: Math.floor(Math.random() * 4),
    flip: Math.random() < 0.5 ? 1 : -1,
  }))
}

function drawDancer(ctx: CanvasRenderingContext2D, d: Dancer, b: number) {
  const p = d.px
  const { skin: sk, hair: ha, dress: dr, trim: tr } = d.pal
  const sway = Math.sin((b + d.phase) * 0.5) // hip sway, per 8th note
  const bob = Math.abs(Math.sin(((b + d.phase) * Math.PI) / 2)) // up-down bounce
  const armUp = (b + d.phase) % 4 < 2 // alternate arms raised
  const sideStep = Math.round(Math.sin((b + d.phase) * 0.25)) * p // salsa step
  const ox = d.bx + sideStep + sway * p * 1.2
  const oy = d.by - bob * p * 1.4
  const px = (x: number, y: number, c: string) => {
    ctx.fillStyle = c
    ctx.fillRect(Math.round(ox + x * p * d.flip), Math.round(oy + y * p), Math.ceil(p), Math.ceil(p))
  }
  // head
  px(0, -9, ha); px(1, -9, ha); px(-1, -9, ha)
  px(-1, -8, sk); px(0, -8, sk); px(1, -8, sk)
  px(-1, -7, sk); px(0, -7, sk); px(1, -7, sk)
  px(2, -8, tr) // flower
  // torso
  px(0, -6, dr); px(-1, -6, dr); px(1, -6, dr)
  px(-1, -5, dr); px(0, -5, dr); px(1, -5, dr)
  // arms, alternating on the beat
  if (armUp) { px(-2, -7, sk); px(-2, -8, sk); px(2, -5, sk) }
  else { px(2, -7, sk); px(2, -8, sk); px(-2, -5, sk) }
  // ruffled skirt with sway
  const h = sway > 0 ? 1 : -1
  for (let x = -2; x <= 2; x++) px(x + h, -4, dr)
  px(-2 + h, -3, tr); px(2 + h, -3, tr)
  px(-3 + h, -3, dr); px(3 + h, -3, dr)
  // legs stepping
  const stepL = b % 2 === 0 ? 1 : 0
  px(-1 + h, -2, sk); px(1 + h, -2, sk)
  px(-1 + h, -1, sk); px(1 + h, -1, sk)
  px(-1 + h - stepL, 0, ha); px(1 + h + stepL, 0, ha) // shoes
}

/** Starts the animation; `getBeat` returns the current 8th-note step. Returns a stop function. */
export function startFiestaCanvas(getBeat: () => number) {
  const cvs = document.createElement("canvas")
  cvs.setAttribute("aria-hidden", "true")
  cvs.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:98"
  document.body.appendChild(cvs)
  const ctx = cvs.getContext("2d")!

  let dancers: Dancer[] = []
  const size = () => {
    cvs.width = innerWidth
    cvs.height = innerHeight
    dancers = makeDancers()
  }
  size()
  addEventListener("resize", size)

  const parts: Confetto[] = Array.from({ length: 140 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * -innerHeight,
    w: 6 + Math.random() * 7,
    h: 8 + Math.random() * 8,
    vy: 1.4 + Math.random() * 2.6,
    vx: -1 + Math.random() * 2,
    rot: Math.random() * Math.PI,
    vr: -0.12 + Math.random() * 0.24,
    c: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
  }))

  let raf = 0
  const frame = () => {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    const beat = getBeat()
    for (const d of dancers) drawDancer(ctx, d, beat) // dancers behind confetti
    for (const p of parts) {
      p.y += p.vy
      p.x += p.vx
      p.rot += p.vr
      if (p.y > cvs.height + 20) {
        p.y = -20
        p.x = Math.random() * cvs.width
      }
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.c
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    }
    raf = requestAnimationFrame(frame)
  }
  frame()

  return () => {
    cancelAnimationFrame(raf)
    removeEventListener("resize", size)
    cvs.remove()
  }
}
