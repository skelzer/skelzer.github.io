import { ArrowUpIcon, SparklesIcon } from "lucide-react"
import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const ASK_URL = import.meta.env.VITE_ASK_URL ?? "https://ask.luquematte.com/ask"
const MAX_QUESTION = 500

const SUGGESTIONS = [
  "What did his ETH thesis find?",
  "How did he lead a team across time zones?",
  "What has he built with LLMs?",
  "Which languages does he speak?",
]

type Msg = { role: "user" | "assistant"; content: string }

export function AskMyCv() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const abort = useRef<AbortController | null>(null)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [messages])

  useEffect(() => () => abort.current?.abort(), [])

  async function ask(question: string) {
    const q = question.trim().slice(0, MAX_QUESTION)
    if (!q || busy) return
    const history: Msg[] = [...messages, { role: "user", content: q }]
    setMessages([...history, { role: "assistant", content: "" }])
    setInput("")
    setBusy(true)

    const append = (text: string) =>
      setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: m[m.length - 1].content + text }])

    abort.current = new AbortController()
    try {
      const res = await fetch(ASK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abort.current.signal,
      })
      if (!res.ok || !res.body) {
        append((await res.text().catch(() => "")) || "Something went wrong. Try again in a moment.")
        return
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        append(value)
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") append("I couldn't reach the assistant. Check your connection and try again.")
    } finally {
      setBusy(false)
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    void ask(input)
  }

  // Internal links in answers close the panel, then jump to the section.
  function go(href: string) {
    setOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
      history.replaceState(null, "", href)
    }, 250)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button className="fixed right-4 bottom-4 z-40 h-auto gap-2 border border-foreground px-4 py-3 font-mono text-xs tracking-[.06em] uppercase shadow-[4px_4px_0_var(--signal)] transition hover:-translate-y-0.5 sm:right-6 sm:bottom-6" />
        }
      >
        <SparklesIcon className="text-signal" />
        Ask my CV
      </SheetTrigger>

      <SheetContent side="right" className="w-full gap-0 bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 pt-5 pb-4">
          <SheetTitle className="flex items-center gap-2 font-heading text-lg font-extrabold uppercase">
            <SparklesIcon className="size-4 text-signal" /> Ask my CV
          </SheetTitle>
          <SheetDescription className="text-xs leading-relaxed">
            An AI agent that answers from what's on this site. It can get things wrong; the page is the source of
            truth.
          </SheetDescription>
        </SheetHeader>

        <div ref={scroller} className="flex-1 overflow-y-auto px-5 py-5" aria-live="polite">
          {messages.length === 0 ? (
            <div>
              <p className="mb-3 font-mono text-[11px] tracking-[.08em] text-muted-foreground uppercase">Try asking</p>
              <ul className="flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => void ask(s)}
                      className="w-full border px-3.5 py-2.5 text-left text-sm transition hover:border-foreground"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ol className="flex flex-col gap-4">
              {messages.map((m, i) => (
                <li
                  key={i}
                  className={cn(
                    "max-w-[88%] text-[14.5px] leading-relaxed whitespace-pre-wrap",
                    m.role === "user" ? "self-end bg-foreground px-3.5 py-2.5 text-background" : "self-start text-prose"
                  )}
                >
                  {m.role === "assistant" && !m.content ? (
                    <span className="inline-flex gap-1" aria-label="Thinking">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="size-1.5 animate-pulse rounded-full bg-signal"
                          style={{ animationDelay: `${d * 150}ms` }}
                        />
                      ))}
                    </span>
                  ) : m.role === "assistant" ? (
                    renderAnswer(m.content, go)
                  ) : (
                    m.content
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>

        <form onSubmit={submit} className="flex gap-2 border-t px-5 py-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={MAX_QUESTION}
            placeholder="Ask about Miguel's work…"
            aria-label="Your question"
            className="h-10 border-foreground"
            autoFocus
          />
          <Button type="submit" size="icon-lg" className="size-10" disabled={busy || !input.trim()} aria-label="Send">
            <ArrowUpIcon />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}

/** Renders plain text, turning [label](#section) and mailto links into real links. Nothing else is linkified. */
function renderAnswer(text: string, go: (href: string) => void): ReactNode {
  const parts: ReactNode[] = []
  const re = /\[([^\]]+)\]\((#[a-z]+|mailto:[^)\s]+)\)/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(text))) {
    parts.push(text.slice(last, match.index))
    const [, label, href] = match
    parts.push(
      href.startsWith("#") ? (
        <a
          key={match.index}
          href={href}
          onClick={(e) => {
            e.preventDefault()
            go(href)
          }}
          className="font-medium text-signal underline underline-offset-2"
        >
          {label}
        </a>
      ) : (
        <a key={match.index} href={href} className="font-medium text-signal underline underline-offset-2">
          {label}
        </a>
      )
    )
    last = match.index + match[0].length
  }
  parts.push(text.slice(last))
  return parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)
}
