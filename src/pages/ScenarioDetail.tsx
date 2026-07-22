import { useParams } from 'react-router-dom'
import { scenarios } from '../data/scenarios'
import { ScenarioPlayer } from '../components/scenario/ScenarioPlayer'

export function ScenarioDetail() {
  const { id } = useParams()
  const scenario = scenarios.find(s => s.id === id)

  if (!scenario) {
    return <div className="text-center py-20 text-slate-400">Scenario not found</div>
  }

  return <ScenarioPlayer scenario={scenario} />
}
