import { cicScenarios } from './scenarios/cic'
import { omnScenarios } from './scenarios/omnichannel'
import { comScenarios } from './scenarios/commerce'
import { scoScenarios } from './scenarios/supply-chain'
import { mktScenarios } from './scenarios/marketing'
import type { Scenario } from './types'

export const scenarios: Scenario[] = [
  ...cicScenarios,
  ...omnScenarios,
  ...comScenarios,
  ...scoScenarios,
  ...mktScenarios,
]

export type { Scenario, ScenarioStep, ScenarioROI } from './types'
