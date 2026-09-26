import { instructions } from "./prompt"

type Msg = { role: "user" | "assistant"; content: string }

const MAX_QUESTION = 500
const MAX_MESSAGE = 1500
const MAX_TURNS = 6
const MAX_OUTPUT_TOKENS = 450

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") ?? ""
    const allowed = env.ALLOWED_ORIGINS.split(",").includes(origin)
    const cors: Record<string, string> = allowed
      ? {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        }
      : { Vary: "Origin" }

    if (req.method === "OPTIONS") return new Response(null, { status: allowed ? 204 : 403, headers: cors })
    if (new URL(req.url).pathname !== "/ask" || req.method !== "POST") return text("Not found", 404, cors)
    if (!allowed) return text("Forbidden", 403, cors)

    const ip = req.headers.get("CF-Connecting-IP") ?? "unknown"
    const { success } = await env.LIMITER.limit({ key: ip })
    if (!success) return text("That's a lot of questions. Give it a minute and try again.", 429, cors)

    const messages = parseMessages(await req.json().catch(() => null))
    if (!messages) return text("Bad request", 400, cors)

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OPENAI_MODEL,
        instructions,
        input: messages,
        reasoning: { effort: "none" },
        max_output_tokens: MAX_OUTPUT_TOKENS,
        store: false,
        stream: true,
      }),
    })
    if (!upstream.ok || !upstream.body) {
      console.error("openai error", upstream.status, await upstream.text().catch(() => ""))
      return text("The assistant is unavailable right now. Try again later, or email info@luquematte.com.", 502, cors)
    }

    return new Response(upstream.body.pipeThrough(new TextDecoderStream()).pipeThrough(sseToText()).pipeThrough(new TextEncoderStream()), {
      headers: { ...cors, "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    })
  },
} satisfies ExportedHandler<Env>

function text(body: string, status: number, headers: Record<string, string>) {
  return new Response(body, { status, headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" } })
}

/** Accepts { messages: [{role, content}, ...] } ending with a user question; trims and bounds it. */
function parseMessages(body: unknown): Msg[] | null {
  const raw = (body as { messages?: unknown })?.messages
  if (!Array.isArray(raw) || raw.length === 0) return null
  const msgs: Msg[] = []
  for (const m of raw.slice(-MAX_TURNS)) {
    const role = (m as Msg)?.role
    const content = typeof (m as Msg)?.content === "string" ? (m as Msg).content.trim() : ""
    if ((role !== "user" && role !== "assistant") || !content) return null
    msgs.push({ role, content: content.slice(0, MAX_MESSAGE) })
  }
  const last = msgs[msgs.length - 1]
  if (last.role !== "user" || last.content.length > MAX_QUESTION) return null
  return msgs
}

/** Turns the Responses API event stream into the plain answer text. */
function sseToText() {
  let buffer = ""
  return new TransformStream<string, string>({
    transform(chunk, controller) {
      buffer += chunk
      let end: number
      while ((end = buffer.indexOf("\n\n")) !== -1) {
        const event = buffer.slice(0, end)
        buffer = buffer.slice(end + 2)
        const data = event
          .split("\n")
          .filter((l) => l.startsWith("data:"))
          .map((l) => l.slice(5).trim())
          .join("")
        if (!data || data === "[DONE]") continue
        try {
          const e = JSON.parse(data) as { type?: string; delta?: string }
          if (e.type === "response.output_text.delta" && e.delta) controller.enqueue(e.delta)
          else if (e.type === "error" || e.type === "response.failed") {
            console.error("openai stream error", data)
            controller.enqueue("\n\n(Something went wrong. Try again, or email info@luquematte.com.)")
          }
        } catch {
          /* ignore malformed event */
        }
      }
    },
  })
}
