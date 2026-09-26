// Builds the agent's knowledge from the same data files the site renders,
// so answers can't drift from what the page says.
import { chapters, contact, education, intro, languages, roles, skillGroups } from "../../src/data/cv"
import { models, sample, savedTime, supportAlone } from "../../src/data/research"

const f2 = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(2)}`

function career() {
  return chapters
    .map((c) => {
      const stops = roles
        .filter((r) => r.chapter === c.id)
        .reverse()
        .map((r) => `- ${r.title}, ${r.org} (${r.when}${r.current ? " – present, current role" : ""}, ${r.where})\n  ${r.prose.join(" ")}`)
        .join("\n")
      return `### ${c.city}, ${c.country} (${c.years}) — ${c.what} [section: #${c.id}]\n${stops}`
    })
    .join("\n\n")
}

function research() {
  const coef = (m: (typeof models)["core"]) =>
    m.coefs.map((c) => `  - ${c.label} (${c.hint}): β = ${f2(c.beta)}, 95% CI [${f2(c.ci[0])}, ${f2(c.ci[1])}]`).join("\n")
  return `MAS thesis, ETH Zürich, defended July 2026: "The Everyday Use of AI Development Tools: Attitudes, Intention, and Time Reallocation Among Software Engineers". Mixed methods: survey of ${sample.n} software engineers, then ${sample.interviews} interviews. [section: #research]

Finding 1, what predicts intention to use AI tools (standardised OLS, cross-sectional, associations not causal effects; sample leans AI-positive):
- Core model, R² = ${models.core.r2}:
${coef(models.core)}
- Adding organisational support, R² = ${models.withSupport.r2}:
${coef(models.withSupport)}
- Organisational support on its own correlates positively with intention (r = ${f2(supportAlone.r)}), but held alongside autonomy and the rest its sign flips (β = −0.21). Interviews suggest why: support helped when it enabled engineers and left the decision to them, and held use back when it blocked access or prescribed use task by task.
- Headline: attitude and autonomy drive intention; capability does not. Adoption looks more like a question of latitude and trust than of training.

Finding 2, where time saved by AI went: the survey assumed it goes to higher-value work; in the interviews almost nobody described that. What the time turned into depended on the organisation: ${savedTime.map((s) => `${s.title.replace(/[“”]/g, '"')} (${s.where})`).join("; ")}. "Not yet" means the gains existed but hadn't turned into anything new.`
}

export const cvContext = `# Miguel Luque — luquematte.com

${intro}

Based in Zürich, Switzerland. Current role: Agentic AI Engineer at Sunrise (Swiss telecom), from October 2026.
Contact: ${contact.email} · LinkedIn ${contact.linkedin} · GitHub ${contact.github} [section: #contact]

## Career route (Málaga → Žilina → Zürich, 3,107 km) [section: #route]
${career()}

## Research [section: #research]
${research()}

## Skills [section: #skills]
${skillGroups.map((g) => `- ${g.title}: ${g.skills.map((s) => s.name).join(", ")}`).join("\n")}

## Education & certifications [section: #education]
${education.map((e) => `- ${e.title}, ${e.org} (${e.when})`).join("\n")}

## Languages [section: #education]
${languages.map((l) => `- ${l.name}: ${l.level}`).join("\n")}

## About this site
Built with React, Vite, Tailwind CSS and shadcn/ui; the source is on GitHub (${contact.github}/skelzer.github.io). Easter egg: on a keyboard, typing ↑ ↑ ↓ ↓ ← → ← → B A starts an 8-bit fiesta with music and pixel dancers (Esc stops it).`

export const SECTIONS = ["#route", "#malaga", "#zilina", "#zurich", "#research", "#skills", "#education", "#contact"]
