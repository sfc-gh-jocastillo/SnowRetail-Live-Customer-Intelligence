export interface ScenarioStep {
  phase: 'detect' | 'observe' | 'hypothesize' | 'plan' | 'act' | 'verify' | 'resolve'
  title: string
  description: string
  semanticLayerNote?: string
  primitives?: string[]
}

export interface ScenarioROI {
  hoursSaved: string
  valueProtected: string
  customersImpacted: string
}

export interface Scenario {
  id: string
  domain: 'cic' | 'omn' | 'com' | 'sco' | 'mkt'
  title: string
  description: string
  isSemanticHero: boolean
  role: string
  trigger: string
  steps: ScenarioStep[]
  roi: ScenarioROI
  standards: string[]
  primitives: string[]
}
