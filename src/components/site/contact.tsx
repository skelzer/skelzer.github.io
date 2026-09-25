import { Section } from "@/components/site/section"
import { buttonVariants } from "@/components/ui/button"
import { contact } from "@/data/cv"
import { cn } from "@/lib/utils"

const cta =
  "h-auto px-6.5 py-3.5 font-mono text-[13.5px] tracking-[.04em] uppercase border-foreground transition hover:-translate-y-0.5"

export function Contact() {
  return (
    <Section id="contact" className="pb-24">
      <h2 className="mb-6 font-heading font-wide text-[clamp(34px,6vw,64px)] leading-[1.02] font-black tracking-[-.01em] uppercase">
        Let's build something
        <br />
        <span className="text-signal">reliable</span> together.
      </h2>
      <p className="mb-8.5 max-w-[560px] text-[17px]">
        I'm always happy to talk about agentic AI, keeping production systems reliable, or how engineering teams
        actually adopt AI. Say hello.
      </p>
      <div className="flex flex-wrap gap-3.5">
        <a href={`mailto:${contact.email}`} className={cn(buttonVariants(), cta, "hover:border-signal hover:bg-signal hover:text-white")}>
          Email me
        </a>
        <a href={contact.linkedin} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "outline" }), cta, "bg-transparent hover:bg-foreground hover:text-background")}>
          LinkedIn
        </a>
        <a href={contact.github} target="_blank" rel="noopener" className={cn(buttonVariants({ variant: "outline" }), cta, "bg-transparent hover:bg-foreground hover:text-background")}>
          GitHub
        </a>
      </div>
    </Section>
  )
}
