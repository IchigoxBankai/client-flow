import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Search, PlusCircle, Command, Layers, Users, FileText, Settings, User } from 'lucide-react';

export function Navbar() {
  const { studio, logout } = useAuth();
  const {
    isFlowAgentOpen,
    setIsFlowAgentOpen,
    setIsCommandPaletteOpen,
    setIsBriefModalOpen,
    pendingAction,
    activeProject
  } = useWorkspace();

  const navLinks = [
    { to: '/app/work', label: 'Work', icon: Layers },
    { to: '/app/clients', label: 'Clients', icon: Users },
    { to: '/app/documents', label: 'Documents', icon: FileText },
    { to: '/app/studio', label: 'Studio', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-atelier">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand & Workspace Name */}
        <div className="flex items-center gap-3">
          <Link to="/app" className="flex items-center gap-2 group">
            <span className="w-5 h-5 rounded-sm bg-ink text-chartreuse flex items-center justify-center font-mono-meta text-[11px] font-bold group-hover:bg-chartreuse group-hover:text-ink transition-colors">
              CF
            </span>
            <span className="font-mono-meta text-xs tracking-widest uppercase font-bold text-ink">
              CLIENTFLOW
            </span>
          </Link>
          <span className="text-ink/30 font-mono-meta text-xs">/</span>
          <span className="hidden sm:inline-block font-mono-meta text-xs uppercase tracking-wider text-ink/70 truncate max-w-[180px]">
            {studio?.name || 'STUDIO'}
          </span>
          {studio?.isDemo && (
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono-meta bg-warmGrey text-ink/70 uppercase">
              Demo Workspace
            </span>
          )}
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-xs font-mono-meta tracking-wider uppercase transition-colors ${
                  isActive
                    ? 'bg-ink text-paper font-semibold shadow-atelier'
                    : 'text-ink/70 hover:text-ink hover:bg-warmGrey/60'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Brief to Build Quick Action */}
          <button
            onClick={() => setIsBriefModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-meta uppercase tracking-wider font-semibold bg-chartreuse text-ink rounded border border-ink shadow-atelier hover:bg-chartreuse-dark transition-all"
            title="Convert client brief to structured blueprint"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Brief to Build</span>
          </button>

          {/* Search / Command Palette */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-mono-meta rounded bg-warmGrey/50 text-ink/80 hover:bg-warmGrey border border-atelier transition-colors"
            title="Global Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px] text-ink/50">Ctrl+K</span>
          </button>

          {/* Flow Agent Companion Toggle */}
          <button
            onClick={() => setIsFlowAgentOpen(!isFlowAgentOpen)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-meta uppercase tracking-wider rounded border transition-all ${
              isFlowAgentOpen
                ? 'bg-ink text-chartreuse border-ink shadow-atelier'
                : 'bg-paper text-ink border-ink/40 hover:border-ink hover:bg-chartreuse/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-chartreuse fill-chartreuse/40" />
            <span className="hidden sm:inline">Flow Agent</span>
            {pendingAction && (
              <span className="w-2 h-2 rounded-full bg-chartreuse animate-ping absolute -top-1 -right-1" />
            )}
          </button>

          {/* User Profile Avatar / Logout */}
          <Link
            to="/app/studio"
            className="w-8 h-8 rounded bg-warmGrey border border-atelier flex items-center justify-center text-xs font-mono-meta font-bold text-ink hover:bg-chartreuse/30 transition-colors"
            title="Studio Settings & Profile"
          >
            {studio?.name?.charAt(0) || 'N'}
          </Link>
        </div>
      </div>
    </header>
  );
}
