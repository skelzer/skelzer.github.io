import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Section({
  id,
  title,
  tag,
  className,
  children,
}: {
  id: string
  title?: string
  tag?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={cn("border-t py-18", className)}>
      {title && (
        <div className="mb-11 flex items-baseline gap-4">
          <h2 className="font-heading font-wide text-[clamp(22px,3vw,30px)] font-extrabold tracking-[.01em] uppercase">
            {title}
          </h2>
          <div className="h-px flex-1 bg-foreground" />
          {tag && <span className="font-mono text-xs tracking-[.06em] text-muted-foreground">{tag}</span>}
        </div>
      )}
      {children}
    </section>
  )
}
