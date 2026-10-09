import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { Home, Layers, Users, FileText, Sparkles, Plus } from 'lucide-react';

export function BottomNav() {
  const { isFlowAgentOpen, setIsFlowAgentOpen, setIsBriefModalOpen, pendingAction } = useWorkspace();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur border-t border-atelier pb-safe">
      <div className="flex items-center justify-around px-2 py-1.5 h-16">
        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 h-full touch-target transition-colors ${
              isActive ? 'text-ink font-semibold' : 'text-ink/50 hover:text-ink'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono-meta uppercase tracking-wider">Home</span>
        </NavLink>

        <NavLink
          to="/app/work"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 h-full touch-target transition-colors ${
              isActive ? 'text-ink font-semibold' : 'text-ink/50 hover:text-ink'
            }`
          }
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono-meta uppercase tracking-wider">Work</span>
        </NavLink>

        {/* Center Floating Brief Button */}
        <button
          onClick={() => setIsBriefModalOpen(true)}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-chartreuse text-ink border border-ink shadow-atelier -mt-5"
          title="New Brief"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <NavLink
          to="/app/clients"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 h-full touch-target transition-colors ${
              isActive ? 'text-ink font-semibold' : 'text-ink/50 hover:text-ink'
            }`
          }
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono-meta uppercase tracking-wider">Clients</span>
        </NavLink>

        {/* Flow Agent Launcher */}
        <button
          onClick={() => setIsFlowAgentOpen(!isFlowAgentOpen)}
          className={`relative flex flex-col items-center justify-center w-14 h-full touch-target transition-colors ${
            isFlowAgentOpen ? 'text-chartreuse-dark font-bold' : 'text-ink/50 hover:text-ink'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5 text-ink" />
          <span className="text-[10px] font-mono-meta uppercase tracking-wider text-ink">Agent</span>
          {pendingAction && (
            <span className="w-2 h-2 rounded-full bg-chartreuse ring-2 ring-ink absolute top-1 right-3 animate-ping" />
          )}
        </button>
      </div>
    </div>
  );
}
