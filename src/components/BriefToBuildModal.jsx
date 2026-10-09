import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { parseBriefToBlueprint } from '../services/agentApi';
import { Sparkles, X, ArrowRight, Check, AlertTriangle, HelpCircle, Layers, Calendar, DollarSign, Clock, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BriefToBuildModal() {
  const { isBriefModalOpen, setIsBriefModalOpen, createProject, clients, createClient } = useWorkspace();
  const { studio } = useAuth();

  const [step, setStep] = useState('input'); // 'input' | 'processing' | 'blueprint'
  const [rawBrief, setRawBrief] = useState('');
  const [clientName, setClientName] = useState('');
  const [budget, setBudget] = useState('');
  const [timelineWeeks, setTimelineWeeks] = useState('');
  const [blueprint, setBlueprint] = useState(null);

  if (!isBriefModalOpen) return null;

  const handleSampleClick = (sampleText) => {
    setRawBrief(sampleText);
    setClientName('Olive & Ember Bistro');
    setBudget('25000');
    setTimelineWeeks('3');
  };

  const handleGenerateBlueprint = async (e) => {
    e.preventDefault();
    if (!rawBrief.trim()) return;

    setStep('processing');

    try {
      const result = await parseBriefToBlueprint({
        rawBrief,
        clientName: clientName.trim() || 'New Client',
        budget: budget ? Number(budget) : undefined,
        currency: studio?.currency || '₹',
        deadlineWeeks: timelineWeeks ? Number(timelineWeeks) : undefined
      });

      setBlueprint(result);
      setStep('blueprint');
    } catch (err) {
      console.error('Failed to parse blueprint:', err);
      setStep('input');
    }
  };

  const handleConfirmProject = () => {
    if (!blueprint) return;

    // Check if client exists or create
    let matchedClient = clients.find(c => c.name.toLowerCase() === (blueprint.clientName || '').toLowerCase());
    let clientId = matchedClient?.id;
    if (!matchedClient) {
      const createdClient = createClient({
        name: blueprint.clientName || 'New Client',
        company: blueprint.clientName || 'Client Studio',
        email: 'contact@' + (blueprint.clientName || 'client').toLowerCase().replace(/\s+/g, '') + '.com',
        notes: `Created during AI Brief intake for "${blueprint.title}".`
      });
      clientId = createdClient.id;
    }

    // Flatten tasks from blueprint milestones
    const allTasks = [];
    const flattenedMilestones = (blueprint.milestones || []).map((m, idx) => {
      const mId = `ms_${Date.now()}_${idx}`;
      (m.tasks || []).forEach((t, tIdx) => {
        allTasks.push({
          id: `tsk_${Date.now()}_${idx}_${tIdx}`,
          milestoneId: mId,
          title: t.title,
          description: t.description || '',
          status: t.status || 'todo',
          priority: t.priority || 'medium',
          estimatedHours: t.estimatedHours || 4,
          dueDate: new Date(Date.now() + (idx + 1) * 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      });

      return {
        id: mId,
        number: String(idx + 1).padStart(2, '0'),
        name: m.name,
        description: m.description,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + (idx + 1) * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: idx === 0 ? 'in_progress' : 'pending',
        approvalStatus: idx === 0 ? 'approved' : 'unapproved',
        taskCount: (m.tasks || []).length,
        completedTaskCount: 0
      };
    });

    const deadlineDays = (blueprint.timelineWeeks || 3) * 7;
    const deadlineDate = new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    createProject({
      title: blueprint.title,
      clientId,
      clientName: blueprint.clientName || 'New Client',
      status: 'planning',
      budget: Number(blueprint.budget || 25000),
      currency: blueprint.currency || studio?.currency || '₹',
      startDate: new Date().toISOString().split('T')[0],
      deadline: deadlineDate,
      timelineWeeks: blueprint.timelineWeeks || 3,
      brief: blueprint.brief,
      requirements: blueprint.requirements || [],
      deliverables: blueprint.deliverables || [],
      milestones: flattenedMilestones,
      tasks: allTasks,
      completionPercentage: 0
    });

    setIsBriefModalOpen(false);
    setStep('input');
    setRawBrief('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/50 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-paper rounded-xl shadow-sheet border border-atelier-dark overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Topbar */}
        <div className="px-6 py-4 border-b border-atelier bg-paper-light flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-chartreuse text-ink flex items-center justify-center border border-ink shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink">
                Brief to Build — AI Project Intake
              </h2>
              <p className="text-xs text-ink/60">
                Transform messy client messages into an actionable, editable project blueprint.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBriefModalOpen(false)}
            className="p-1 rounded text-ink/40 hover:text-ink hover:bg-warmGrey/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'input' && (
            <form onSubmit={handleGenerateBlueprint} className="space-y-5">
              <div>
                <label className="block font-mono-meta text-xs uppercase tracking-wider text-ink font-semibold mb-2">
                  Client Message or Project Scope
                </label>
                <textarea
                  rows={6}
                  value={rawBrief}
                  onChange={(e) => setRawBrief(e.target.value)}
                  placeholder="Tell me what your client needs. Paste their message or describe the project in your own words..."
                  className="w-full p-4 text-sm bg-white border border-atelier rounded-lg text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink resize-none font-sans leading-relaxed"
                  required
                />
                
                {/* Sample Prompt Chip */}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="font-mono-meta text-[11px] text-ink/50 uppercase">Try sample:</span>
                  <button
                    type="button"
                    onClick={() => handleSampleClick("Hi, I need a modern restaurant website with a menu, online reservation form and contact page. My budget is ₹25,000, and I'd like it completed within three weeks.")}
                    className="text-xs font-medium text-ink/80 hover:text-ink underline decoration-chartreuse-dark underline-offset-4 decoration-2"
                  >
                    "Restaurant website with menu, reservations & contact page (₹25,000, 3 weeks)"
                  </button>
                </div>
              </div>

              {/* Optional Quick Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-atelier">
                <div>
                  <label className="block font-mono-meta text-[11px] uppercase tracking-wider text-ink/70 mb-1">
                    Client / Business Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Olive & Ember Bistro"
                    className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded text-ink focus:outline-none focus:border-ink font-sans"
                  />
                </div>

                <div>
                  <label className="block font-mono-meta text-[11px] uppercase tracking-wider text-ink/70 mb-1">
                    Target Budget ({studio?.currency || '₹'})
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="25000"
                    className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded text-ink focus:outline-none focus:border-ink font-sans"
                  />
                </div>

                <div>
                  <label className="block font-mono-meta text-[11px] uppercase tracking-wider text-ink/70 mb-1">
                    Timeline (Weeks)
                  </label>
                  <input
                    type="number"
                    value={timelineWeeks}
                    onChange={(e) => setTimelineWeeks(e.target.value)}
                    placeholder="3"
                    className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded text-ink focus:outline-none focus:border-ink font-sans"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={!rawBrief.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all disabled:opacity-40"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Project Blueprint</span>
                </button>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-chartreuse border border-ink flex items-center justify-center animate-spin">
                <Sparkles className="w-6 h-6 text-ink" />
              </div>
              <h3 className="text-xl sm:text-2xl text-ink font-bold">Analyzing brief & architecting blueprint...</h3>
              <p className="text-xs font-mono-meta text-ink/60 max-w-sm mx-auto">
                Extracting requirements, structuring 5 project milestones, calculating budget allocations, and identifying missing assets.
              </p>
            </div>
          )}

          {step === 'blueprint' && blueprint && (
            <div className="space-y-6">
              {/* Blueprint Header */}
              <div className="p-4 rounded-xl bg-white border border-atelier space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono-meta text-[11px] uppercase tracking-widest text-ink/50">
                    Generated Blueprint
                  </span>
                  <span className="font-mono-meta text-xs px-2 py-0.5 bg-chartreuse/60 text-ink rounded font-semibold">
                    Ready for Review
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-meta uppercase text-ink/50">Project Title</label>
                  <input
                    type="text"
                    value={blueprint.title}
                    onChange={(e) => setBlueprint({ ...blueprint, title: e.target.value })}
                    className="w-full text-xl sm:text-2xl text-ink font-bold border-b border-dashed border-ink/30 focus:outline-none focus:border-ink bg-transparent mt-0.5"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div>
                    <span className="text-[10px] font-mono-meta uppercase text-ink/50">Client</span>
                    <div className="font-semibold text-xs text-ink">{blueprint.clientName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-meta uppercase text-ink/50">Budget</span>
                    <div className="font-semibold text-xs text-ink">{blueprint.currency}{Number(blueprint.budget).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-meta uppercase text-ink/50">Timeline</span>
                    <div className="font-semibold text-xs text-ink">{blueprint.timelineWeeks} Weeks</div>
                  </div>
                </div>
              </div>

              {/* Assumptions & Missing Info Banner */}
              {(blueprint.assumptions?.length > 0 || blueprint.missingInfo?.length > 0) && (
                <div className="p-4 rounded-xl bg-warmGrey/40 border border-atelier space-y-2">
                  <div className="flex items-center gap-1.5 text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5 text-ink" />
                    <span>Assumptions & Inferred Scope</span>
                  </div>
                  <ul className="text-xs text-ink/80 space-y-1 list-disc list-inside">
                    {blueprint.assumptions?.map((assump, i) => (
                      <li key={i}>{assump}</li>
                    ))}
                    {blueprint.missingInfo?.map((info, i) => (
                      <li key={`m_${i}`} className="text-terracotta font-medium">To verify with client: {info}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Milestones & Tasks Preview */}
              <div>
                <h4 className="font-mono-meta text-xs uppercase tracking-wider text-ink font-bold mb-3">
                  Proposed Milestone Structure ({blueprint.milestones?.length || 0} Stages)
                </h4>
                <div className="space-y-3">
                  {blueprint.milestones?.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-white border border-atelier space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-meta text-xs font-bold text-ink">{m.name}</span>
                        <span className="text-[11px] font-mono-meta text-ink/50">{m.tasks?.length || 0} tasks • ~{m.durationWeeks} wk</span>
                      </div>
                      <p className="text-xs text-ink/70">{m.description}</p>
                      
                      {/* Tasks chip list */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.tasks?.map((t, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded text-[11px] bg-warmGrey/60 text-ink/80 border border-atelier">
                            {t.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm / Back Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-atelier">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="px-4 py-2 text-xs font-mono-meta uppercase tracking-wider text-ink/70 hover:text-ink"
                >
                  ← Edit Brief
                </button>

                <button
                  type="button"
                  onClick={handleConfirmProject}
                  className="flex items-center gap-2 px-6 py-2.5 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Create Project & Initialize Canvas</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
