import { Reveal } from "@/components/site/reveal"
import { Section } from "@/components/site/section"
import { Badge } from "@/components/ui/badge"
import { skillGroups } from "@/data/cv"
import { cn } from "@/lib/utils"

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <Reveal className="grid border md:grid-cols-3">
        {skillGroups.map((group) => (
          <div key={group.title} className="border-b px-6 py-6.5 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0">
            <h3 className="mb-4 font-mono text-xs tracking-[.08em] text-muted-foreground uppercase">{group.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((s) => (
                <li key={s.name}>
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-auto bg-card px-2.75 py-1.25 text-[13px] font-normal transition hover:-translate-y-px hover:border-foreground",
                      s.hot && "border-signal text-signal hover:border-signal"
                    )}
                  >
                    {s.name}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Reveal>
    </Section>
  )
}
