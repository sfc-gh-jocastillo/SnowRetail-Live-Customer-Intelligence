import { Routes, Route } from 'react-router-dom'
import { Shell } from './components/layout/Shell'
import { Landing } from './pages/Landing'
import { CommandCenter } from './pages/CommandCenter'
import { Omnichannel } from './pages/Omnichannel'
import { Commerce } from './pages/Commerce'
import { SupplyChain } from './pages/SupplyChain'
import { Marketing } from './pages/Marketing'
import { SemanticLayer } from './pages/SemanticLayer'
import { Scenarios } from './pages/Scenarios'
import { ScenarioDetail } from './pages/ScenarioDetail'
import { Compliance } from './pages/Compliance'
import { Tours } from './pages/Tours'
import { Architecture } from './pages/Architecture'

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/command-center" element={<CommandCenter />} />
        <Route path="/omnichannel" element={<Omnichannel />} />
        <Route path="/commerce" element={<Commerce />} />
        <Route path="/supply-chain" element={<SupplyChain />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/semantic-layer" element={<SemanticLayer />} />
        <Route path="/scenarios" element={<Scenarios />} />
        <Route path="/scenarios/:id" element={<ScenarioDetail />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/architecture" element={<Architecture />} />
      </Routes>
    </Shell>
  )
}
