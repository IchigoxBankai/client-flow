import React from 'react';
import { CheckCircle2, Clock, Eye, AlertCircle, ArrowRight } from 'lucide-react';

export function MilestoneTimeline({ milestones = [], selectedMilestoneId, onSelectMilestone }) {
  if (!milestones || milestones.length === 0) return null;

  return (
    <div className="w-full">
      {/* Desktop Horizontal Connected Stages */}
      <div className="hidden lg:flex items-stretch gap-2 overflow-x-auto pb-2">
        {milestones.map((m, index) => {
          const isSelected = selectedMilestoneId === m.id || (!selectedMilestoneId && index === 0);
          const isCompleted = m.status === 'completed';
          const isInReview = m.status === 'in_review';
          const isInProgress = m.status === 'in_progress';

          return (
            <div key={m.id} className="flex-1 min-w-[170px] flex items-center gap-1 group">
              <button
                type="button"
                onClick={() => onSelectMilestone(m.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'bg-paper-light border-ink shadow-atelier ring-1 ring-ink'
                    : isCompleted
                    ? 'bg-sage-faint/80 border-sage/40 hover:border-ink/60'
                    : 'bg-white border-atelier hover:border-ink/40'
                }`}
              >
                {/* Top Number and Status Icon */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono-meta text-[11px] font-bold tracking-widest text-ink/60 uppercase">
                    {m.number || `0${index + 1}`}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-sage-dark" />}
                  {isInReview && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono-meta bg-chartreuse text-ink font-semibold">
                      Review
                    </span>
                  )}
                  {isInProgress && <Clock className="w-3.5 h-3.5 text-ink animate-pulse" />}
                  {m.status === 'pending' && <span className="w-2 h-2 rounded-full bg-ink/20" />}
                </div>

                {/* Milestone Title */}
                <div className="text-sm text-ink font-bold line-clamp-1">
                  {m.name.replace(/^[0-9]+\s*—?\s*/, '')}
                </div>

                {/* Meta details */}
                <div className="mt-2 pt-2 border-t border-atelier/60 flex items-center justify-between text-[11px] font-mono-meta text-ink/60">
                  <span>{m.completedTaskCount || 0}/{m.taskCount || 0} tasks</span>
                  <span className="uppercase text-[10px]">{m.status.replace('_', ' ')}</span>
                </div>
              </button>

              {index < milestones.length - 1 && (
                <div className="shrink-0 text-ink/20">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile / Tablet Vertical Chronological View */}
      <div className="lg:hidden space-y-2">
        {milestones.map((m, index) => {
          const isSelected = selectedMilestoneId === m.id || (!selectedMilestoneId && index === 0);
          const isCompleted = m.status === 'completed';
          const isInReview = m.status === 'in_review';
          const isInProgress = m.status === 'in_progress';

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMilestone(m.id)}
              className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-paper-light border-ink shadow-sm ring-1 ring-ink'
                  : 'bg-white border-atelier'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded bg-warmGrey/60 font-mono-meta text-xs font-bold flex items-center justify-center text-ink shrink-0">
                  {m.number || `0${index + 1}`}
                </span>
                <div>
                  <div className="text-sm font-bold text-ink">
                    {m.name}
                  </div>
                  <div className="text-[11px] font-mono-meta text-ink/60">
                    Due {m.dueDate || 'Soon'} • {m.completedTaskCount || 0}/{m.taskCount || 0} tasks
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {isCompleted && <span className="text-[10px] font-mono-meta uppercase px-2 py-0.5 rounded bg-sage-light text-sage-dark font-semibold">Done</span>}
                {isInReview && <span className="text-[10px] font-mono-meta uppercase px-2 py-0.5 rounded bg-chartreuse text-ink font-semibold">In Review</span>}
                {isInProgress && <span className="text-[10px] font-mono-meta uppercase px-2 py-0.5 rounded bg-warmGrey text-ink font-semibold">In Progress</span>}
                {m.status === 'pending' && <span className="text-[10px] font-mono-meta uppercase px-2 py-0.5 rounded bg-paper-dark text-ink/50">Pending</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
