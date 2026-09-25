// MAS thesis results (ETH Zürich), from the analysis pipeline in skelzer/ai-dev-tools-thesis.
// Re-run against the survey data (N = 116): OLS on intention, z-standardised predictors,
// coefficients with 95% confidence intervals. Aggregates only; no respondent data.

export type Coef = { key: string; label: string; hint: string; beta: number; ci: [number, number] }

export const sample = { n: 116, interviews: 7 }

export const models = {
  core: {
    r2: 0.47,
    coefs: [
      { key: "attitude", label: "Attitude", hint: "Thinks AI tools are useful and worth it", beta: 0.42, ci: [0.22, 0.61] },
      { key: "autonomy", label: "Autonomy", hint: "Free to decide how and when to use them", beta: 0.33, ci: [0.17, 0.49] },
      { key: "norm", label: "Peer & team norm", hint: "People around them expect it", beta: 0.2, ci: [0.05, 0.35] },
      { key: "capacity", label: "Capability", hint: "Feels skilled enough to use them well", beta: -0.07, ci: [-0.26, 0.12] },
    ] as Coef[],
  },
  withSupport: {
    r2: 0.5,
    coefs: [
      { key: "attitude", label: "Attitude", hint: "Thinks AI tools are useful and worth it", beta: 0.38, ci: [0.19, 0.57] },
      { key: "autonomy", label: "Autonomy", hint: "Free to decide how and when to use them", beta: 0.4, ci: [0.23, 0.56] },
      { key: "norm", label: "Peer & team norm", hint: "People around them expect it", beta: 0.27, ci: [0.11, 0.42] },
      { key: "capacity", label: "Capability", hint: "Feels skilled enough to use them well", beta: -0.02, ci: [-0.21, 0.17] },
      { key: "support", label: "Organisational support", hint: "Employer provides guidance and resources", beta: -0.21, ci: [-0.38, -0.04] },
    ] as Coef[],
  },
}

/** Organisational support on its own (zero-order correlation with intention). */
export const supportAlone = { r: 0.2 }

/** Interview finding: what saved time turned into depended on the organisation. */
export const savedTime = [
  { title: "More output", where: "where the organisation could absorb it" },
  { title: "“Not yet”", where: "where the engineer was shielded from extra demand" },
  { title: "Idle slack", where: "where the organisation itself was slow" },
]
