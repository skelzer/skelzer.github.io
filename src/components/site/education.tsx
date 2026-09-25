import { Reveal } from "@/components/site/reveal"
import { Section } from "@/components/site/section"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { education, languages } from "@/data/cv"

export function Education() {
  return (
    <Section id="education" title="Education & Languages">
      <div className="grid gap-11 md:grid-cols-2">
        <Reveal>
          {education.map((e) => (
            <div key={e.title} className="border-t py-4.5 first:border-t-0 first:pt-0">
              <div className="font-mono text-[12.5px] text-muted-foreground">{e.when}</div>
              <h3 className="mt-1 mb-0.5 font-heading text-[17px] font-bold">{e.title}</h3>
              <div className="text-sm text-muted-foreground">{e.org}</div>
            </div>
          ))}
        </Reveal>

        <Reveal className="group/langs">
          <ul aria-label="Languages" className="mt-1 flex flex-col gap-5">
            {languages.map((l) => (
              <li key={l.name}>
                <Progress
                  value={l.value}
                  className="gap-x-3 gap-y-2 [&_[data-slot=progress-indicator]]:origin-left [&_[data-slot=progress-indicator]]:scale-x-0 [&_[data-slot=progress-indicator]]:bg-foreground [&_[data-slot=progress-indicator]]:transition-transform [&_[data-slot=progress-indicator]]:duration-900 group-data-in/langs:[&_[data-slot=progress-indicator]]:scale-x-100 motion-reduce:[&_[data-slot=progress-indicator]]:scale-x-100"
                >
                  <ProgressLabel className="text-[14.5px] font-semibold">{l.name}</ProgressLabel>
                  <ProgressValue className="font-mono text-xs text-muted-foreground">{() => l.level}</ProgressValue>
                </Progress>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
