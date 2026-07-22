import { useState } from 'react'
import type { Scenario } from '../../data/types'
import { Play, Pause, SkipForward, RotateCcw, Clock, DollarSign, Users, Layers, Shield } from 'lucide-react'

const phaseLabels: Record<string, { label: string; color: string }> = {
  detect: { label: 'Detect', color: 'bg-accent-red/20 text-accent-red' },
  observe: { label: 'Observe', color: 'bg-accent-blue/20 text-accent-blue' },
  hypothesize: { label: 'Hypothesize', color: 'bg-accent-purple/20 text-accent-purple' },
  plan: { label: 'Plan', color: 'bg-gold-500/20 text-gold-400' },
  act: { label: 'Act', color: 'bg-accent-green/20 text-accent-green' },
  verify: { label: 'Verify', color: 'bg-accent-blue/20 text-accent-blue' },
  resolve: { label: 'Resolve', color: 'bg-accent-green/20 text-accent-green' },
}

export function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const step = scenario.steps[currentStep]

  const next = () => {
    if (currentStep < scenario.steps.length - 1) setCurrentStep(currentStep + 1)
    else setIsPlaying(false)
  }

  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded bg-navy-800 text-slate-400 font-mono uppercase">{scenario.domain}</span>
          {scenario.isSemanticHero && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30">
              <Layers size={10} /> Semantic Hero
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold">{scenario.title}</h1>
        <p className="text-sm text-slate-400">{scenario.description}</p>
        <div className="text-xs text-slate-500">Role: <span className="text-slate-300">{scenario.role}</span> · Trigger: <span className="text-slate-300">{scenario.trigger}</span></div>
      </div>

      {/* Timeline */}
      <div className="flex items-center gap-1">
        {scenario.steps.map((s, i) => {
          const phase = phaseLabels[s.phase]
          const isActive = i === currentStep
          const isPast = i < currentStep
          return (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`flex-1 py-2 px-1 rounded text-[10px] font-medium transition-all ${
                isActive ? phase.color + ' ring-1 ring-current' : isPast ? 'bg-navy-800 text-slate-400' : 'bg-navy-900 text-slate-600'
              }`}
            >
              {phase.label}
            </button>
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button onClick={reset} className="p-2 rounded bg-navy-800 text-slate-400 hover:text-white">
          <RotateCcw size={16} />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded bg-gold-500 text-navy-950 hover:bg-gold-400">
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={next} className="p-2 rounded bg-navy-800 text-slate-400 hover:text-white">
          <SkipForward size={16} />
        </button>
        <span className="text-xs text-slate-500 ml-2">Step {currentStep + 1} of {scenario.steps.length}</span>
      </div>

      {/* Active Step */}
      <div className="bg-navy-900 border border-navy-700 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded text-xs font-medium ${phaseLabels[step.phase].color}`}>
            {phaseLabels[step.phase].label}
          </span>
          <h2 className="font-semibold">{step.title}</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>

        {step.semanticLayerNote && (
          <div className="flex items-start gap-3 bg-gold-500/5 border border-gold-500/20 rounded-lg p-4">
            <Layers size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-gold-400 uppercase font-medium mb-1">Semantic Layer</div>
              <p className="text-xs text-slate-300">{step.semanticLayerNote}</p>
            </div>
          </div>
        )}

        {step.primitives && (
          <div className="flex flex-wrap gap-2">
            {step.primitives.map(p => (
              <span key={p} className="text-[10px] px-2 py-1 rounded bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ROI Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-navy-900 border border-navy-700 rounded-lg p-4 flex items-center gap-3">
          <Clock size={18} className="text-accent-blue" />
          <div>
            <div className="text-sm font-bold text-accent-blue">{scenario.roi.hoursSaved}</div>
            <div className="text-[10px] text-slate-500 uppercase">Hours Saved</div>
          </div>
        </div>
        <div className="bg-navy-900 border border-navy-700 rounded-lg p-4 flex items-center gap-3">
          <DollarSign size={18} className="text-accent-green" />
          <div>
            <div className="text-sm font-bold text-accent-green">{scenario.roi.valueProtected}</div>
            <div className="text-[10px] text-slate-500 uppercase">Value Protected</div>
          </div>
        </div>
        <div className="bg-navy-900 border border-navy-700 rounded-lg p-4 flex items-center gap-3">
          <Users size={18} className="text-gold-400" />
          <div>
            <div className="text-sm font-bold text-gold-400">{scenario.roi.customersImpacted}</div>
            <div className="text-[10px] text-slate-500 uppercase">Customers Impacted</div>
          </div>
        </div>
      </div>

      {/* Standards & Primitives */}
      <div className="flex flex-wrap gap-2">
        {scenario.standards.map(s => (
          <span key={s} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-accent-red/10 text-accent-red border border-accent-red/20">
            <Shield size={10} /> {s}
          </span>
        ))}
        {scenario.primitives.map(p => (
          <span key={p} className="text-[10px] px-2 py-1 rounded bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}
