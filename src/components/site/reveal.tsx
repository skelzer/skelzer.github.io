import type { ComponentProps } from "react"
import { useReveal } from "@/hooks/use-reveal"
import { cn } from "@/lib/utils"

export function Reveal({ className, ...props }: ComponentProps<"div">) {
  const ref = useReveal<HTMLDivElement>()
  return <div ref={ref} className={cn("reveal", className)} {...props} />
}
