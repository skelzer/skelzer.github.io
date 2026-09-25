// Renders the social share image (public/og.png) with headless Chrome: a 1200×630
// layout at 2× pixel density (2400×1260), so previews stay sharp on high-DPI screens.
// Usage: npm run og   (needs Google Chrome; set CHROME=/path/to/chrome to override)
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chapters } from "../src/data/cv.ts"
import { europeLand } from "../src/data/europe-land.ts"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const out = path.join(root, "public", "og.png")
const chrome = process.env.CHROME ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

const ARCS = ["M79 306 Q170 110 406 56", "M406 56 Q340 40 262 92"]
const LABEL = { malaga: [12, 5, "start"], zilina: [-10, -12, "end"], zurich: [-12, 20, "end"] }

const stops = chapters
  .map(
    (c, i) => `
    <g transform="translate(${c.map[0]} ${c.map[1]})">
      <rect x="-6" y="-6" width="12" height="12" fill="${i === chapters.length - 1 ? "#E63327" : "#14171B"}"/>
      <text x="${LABEL[c.id][0]}" y="${LABEL[c.id][1]}" text-anchor="${LABEL[c.id][2]}"
        font-family="Archivo" font-weight="800" font-size="20" fill="${i === chapters.length - 1 ? "#E63327" : "#14171B"}">${c.city.toUpperCase()}</text>
    </g>`
  )
  .join("")

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Mono:wght@400;500&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box }
  html, body { width: 1200px; height: 630px; overflow: hidden }
  body { background: #FAFAF8; color: #14171B; position: relative; font-family: "IBM Plex Mono", monospace }
  .grid { position: absolute; inset: 0;
    background-image: linear-gradient(#E3E1DC 1px, transparent 1px), linear-gradient(90deg, #E3E1DC 1px, transparent 1px);
    background-size: 44px 44px; opacity: .55;
    mask-image: linear-gradient(to bottom, black, transparent 85%) }
  .bar { position: absolute; left: 0; top: 0; width: 100%; height: 10px; background: #E63327 }
  .kicker { position: absolute; left: 64px; top: 64px; font-size: 24px; letter-spacing: .06em; text-transform: uppercase; color: #3E464E;
    display: flex; align-items: center; gap: 14px }
  .kicker i { width: 12px; height: 12px; border-radius: 50%; background: #2E9E5B }
  h1 { position: absolute; left: 60px; top: 112px; font-family: Archivo; font-weight: 900; font-stretch: 112%;
    font-size: 96px; line-height: .96; letter-spacing: -.015em; text-transform: uppercase }
  h1 span { color: #E63327 }
  .who { position: absolute; left: 64px; bottom: 60px }
  .name { font-family: Archivo; font-weight: 800; font-size: 30px; letter-spacing: .02em; display: flex; align-items: center; gap: 14px }
  .name b { width: 14px; height: 14px; background: #E63327; display: inline-block }
  .url { margin-top: 8px; font-size: 24px; color: #3E464E }
  .map { position: absolute; right: 56px; bottom: 56px; width: 392px; border: 2px solid #14171B; background: #FAFAF8 }
  .map svg { display: block; width: 100% }
</style></head>
<body>
  <div class="grid"></div><div class="bar"></div>
  <div class="kicker"><i></i>Zürich · Agentic AI Engineer at Sunrise</div>
  <h1>Making<br><span>agentic AI</span><br>reliable.</h1>
  <div class="who">
    <div class="name"><b></b>MIGUEL LUQUE</div>
    <div class="url">luquematte.com</div>
  </div>
  <div class="map">
    <svg viewBox="-14 -20 481 380">
      <path d="${europeLand}" fill="#E3E1DC"/>
      ${ARCS.map((d) => `<path d="${d}" fill="none" stroke="#E63327" stroke-width="3" stroke-linecap="round"/>`).join("")}
      ${stops}
    </svg>
  </div>
</body></html>`

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "og-"))
const file = path.join(tmp, "og.html")
fs.writeFileSync(file, html)
execFileSync(chrome, [
  "--headless=new",
  "--hide-scrollbars",
  "--force-device-scale-factor=2",
  "--window-size=1200,630",
  "--virtual-time-budget=8000",
  `--screenshot=${out}`,
  `file://${file}`,
], { stdio: "ignore" })
fs.rmSync(tmp, { recursive: true })
// Version the image URL by content so link-preview caches (LinkedIn keys on the URL) refetch it.
const version = createHash("sha256").update(fs.readFileSync(out)).digest("hex").slice(0, 8)
const indexHtml = path.join(root, "index.html")
fs.writeFileSync(
  indexHtml,
  fs.readFileSync(indexHtml, "utf8").replace(
    /(<meta property="og:image" content=")[^"]*(")/,
    `$1https://luquematte.com/og.png?v=${version}$2`
  )
)
console.log(`wrote ${path.relative(root, out)} (${fs.statSync(out).size} bytes), og:image version ${version}`)
