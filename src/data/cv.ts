export const contact = {
  email: "info@luquematte.com",
  linkedin: "https://linkedin.com/in/luquemar91",
  github: "https://github.com/skelzer",
}

export const nav = [
  { id: "experience", label: "Experience" },
  { id: "research", label: "Research" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const

export const route = [
  { city: "Málaga", what: "electronics & embedded", year: "2014" },
  { city: "Žilina", what: "automotive software", year: "2016" },
  { city: "Zürich", what: "digital health · engineering leadership · ETH", year: "2018", current: true },
]

export type Role = {
  when: string
  current?: boolean
  where: string
  title: string
  org: string
  prose: string[]
}

export const roles: Role[] = [
  {
    when: "Nov 2023",
    current: true,
    where: "Zürich, CH",
    title: "Head of Engineering, Application Support",
    org: "dacadoo · digital-health platform",
    prose: [
      "I lead the team that keeps dacadoo's platform running for enterprise clients across health, insurance and corporate wellness, a group spread across three continents, from Europe to Canada to Australia. Leading across that many timezones taught me to build for async by default: clear ownership, written decisions, and handovers that survive a sixteen-hour gap.",
      "I rebuilt how we triage, escalate and learn from incidents, and built a privacy-first AI pipeline that drafts first-line ticket responses with on-premise LLM inference, so nothing sensitive ever leaves our infrastructure.",
      "The quieter work matters just as much: hiring and coaching engineers, serving as the engineering liaison for our ISO 27001 and 27701 certification, and translating what customers experience into what the roadmap needs. The result: the platform got steadier even as the customer base grew.",
    ],
  },
  {
    when: "Oct 2019 – Nov 2023",
    where: "Zürich, CH",
    title: "Senior Backend Software Engineer & Scrum Master",
    org: "dacadoo",
    prose: [
      "Four years building and operating backend services for the platform, and from 2021, Scrum Master for the backend teams alongside the engineering work. I was a central contributor to the migration from a shared on-premise monolith to a modern cloud service architecture, and owned CI/CD pipelines, Kubernetes deployments and observability along the way. The Scrum Master years taught me the lesson I still lead by: delivery rhythm is built, not declared.",
    ],
  },
  {
    when: "Apr 2018 – Oct 2019",
    where: "Zürich, CH",
    title: "Software Engineer",
    org: "dacadoo",
    prose: [
      "Joined as a backend engineer and grew quickly into senior responsibilities across the platform's core domains. This is where digital health became my domain.",
    ],
  },
  {
    when: "Jun 2016 – Mar 2018",
    where: "Žilina, SK",
    title: "Software Engineer",
    org: "GlobalLogic",
    prose: [
      "Embedded software for European enterprise clients, mostly automotive. My first taste of international, distributed engineering, and of release processes where mistakes are expensive.",
    ],
  },
  {
    when: "Sep 2014 – May 2016",
    where: "Málaga, ES",
    title: "Electronics Engineer",
    org: "Métrica6",
    prose: [
      "Where it started: a small engineering firm in Málaga, designing embedded systems and Android apps end to end, from prototype to deployment, across the whole hardware-software stack.",
    ],
  },
]

export type Skill = { name: string; hot?: boolean }

export const skillGroups: { title: string; skills: Skill[] }[] = [
  {
    title: "Leadership & delivery",
    skills: [
      { name: "Engineering management" },
      { name: "Distributed / cross-timezone teams", hot: true },
      { name: "Async collaboration" },
      { name: "Team coaching & development" },
      { name: "Hiring" },
      { name: "Agile / Scrum" },
      { name: "SAFe®" },
      { name: "Stakeholder management" },
      { name: "Roadmap & priority alignment" },
      { name: "AI augmentation", hot: true },
    ],
  },
  {
    title: "Engineering",
    skills: [
      { name: "Backend development" },
      { name: "Microservices" },
      { name: "CI/CD" },
      { name: "Kubernetes & Helm" },
      { name: "Datadog & observability" },
      { name: "Incident management" },
      { name: "SRE practices" },
      { name: "On-premise LLM / RAG", hot: true },
    ],
  },
  {
    title: "Compliance & privacy",
    skills: [
      { name: "ISO 27001 / 27701" },
      { name: "GDPR / FADP" },
      { name: "Security & privacy controls" },
      { name: "Privacy-by-design AI", hot: true },
    ],
  },
]

export const education = [
  { when: "2024 – 2026 · in progress", title: "MAS, Management, Technology and Economics", org: "ETH Zürich" },
  { when: "2009 – 2012", title: "BSc, Industrial Electronics", org: "Universidad de Málaga" },
  { when: "2015 · Grade A", title: "Android Application Development", org: "Samsung Tech Institute · Universidad de Málaga" },
  {
    when: "Certifications",
    title: "SAFe® 4 Certified Scrum Master · ICAgile Certified Professional",
    org: "Scaled Agile, Inc. · ICAgile",
  },
]

export const languages = [
  { name: "Spanish", level: "native", value: 100 },
  { name: "English", level: "professional", value: 88 },
  { name: "Italian", level: "professional", value: 82 },
  { name: "German", level: "B2 · improving", value: 65 },
]
