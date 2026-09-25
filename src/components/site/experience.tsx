import { Reveal } from "@/components/site/reveal"
import { Section } from "@/components/site/section"
import { Badge } from "@/components/ui/badge"
import { roles } from "@/data/cv"
import { cn } from "@/lib/utils"

export function Experience() {
  return (
    <Section id="experience" title="Experience" tag="2014 – present">
      {/* git-log style timeline */}
      <ol className="relative pl-6.5 before:absolute before:top-1.5 before:bottom-1.5 before:left-[5px] before:w-0.5 before:bg-[repeating-linear-gradient(to_bottom,var(--ink)_0_6px,transparent_6px_11px)] before:opacity-35 sm:pl-8.5 sm:before:left-2">
        {roles.map((role, i) => (
          <li key={role.title + role.when} className={cn("border-t py-7 first:border-t-0 first:pt-0 sm:py-8.5")}>
            <Reveal className="relative grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-7">
              <span
                aria-hidden
                className={cn(
                  "absolute -left-6.5 size-[11px] rounded-full border-2 sm:-left-8.5 sm:size-3.5 sm:border-3",
                  i === 0
                    ? "top-1.5 border-go bg-go shadow-[0_0_0_4px_color-mix(in_oklab,var(--go)_20%,transparent)] sm:top-2"
                    : "top-1.5 border-foreground bg-background sm:top-2"
                )}
              />
              <div className="flex flex-wrap gap-x-3.5 font-mono text-[13px] leading-[1.7] text-muted-foreground sm:block">
                <div>
                  {role.when}
                  {role.current && (
                    <>
                      {" – "}
                      <span className="font-medium text-go">present</span>
                    </>
                  )}
                </div>
                <div className="sm:mt-1">{role.where}</div>
              </div>
              <div>
                <h3 className="font-heading text-xl leading-tight font-bold">
                  {role.title}
                  {role.current && (
                    <Badge variant="outline" className="ml-2.5 translate-y-[-2px] border-go font-mono text-[10px] tracking-[.08em] text-go uppercase">
                      Current
                    </Badge>
                  )}
                </h3>
                <p className="mt-1 mb-3.5 font-mono text-[13px] text-muted-foreground">{role.org}</p>
                <div className="max-w-[680px] space-y-3 text-[15.5px] leading-[1.65] text-prose">
                  {role.prose.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
