import { Reveal } from "@/components/site/reveal"
import { Section } from "@/components/site/section"
import { Card, CardContent } from "@/components/ui/card"

export function Research() {
  return (
    <Section id="research" title="Research" tag="ETH Zürich">
      <Reveal>
        <Card className="relative overflow-visible border border-foreground bg-transparent py-0 ring-0 shadow-none before:absolute before:-top-px before:-left-px before:size-11.5 before:border-t-4 before:border-l-4 before:border-signal">
          <CardContent className="grid gap-4.5 px-6 py-8 sm:px-8">
            <span className="font-mono text-xs tracking-[.08em] text-signal uppercase">MAS Thesis · in progress</span>
            <h3 className="font-heading text-[clamp(19px,2.6vw,25px)] leading-snug font-extrabold">
              The Everyday Use of AI Development Tools: Attitudes, Intention, and Time Reallocation Among Software
              Engineers
            </h3>
            <p className="max-w-[760px] text-[15.5px] text-prose">
              Mixed-methods empirical study of how software engineers adopt AI development tools, examining the
              attitude–intention–use pathway and how engineers reallocate the time they perceive they save.
            </p>
            <blockquote className="border-l-3 border-signal py-1.5 pl-4.5 leading-relaxed">
              <strong className="font-semibold">Key finding:</strong> engineers' intention to adopt AI tools is driven
              by their perceived <strong className="font-semibold">autonomy</strong> over how they work, not by
              perceived capability. Adoption depends more on latitude and trust than on training.
            </blockquote>
          </CardContent>
        </Card>
      </Reveal>
    </Section>
  )
}
