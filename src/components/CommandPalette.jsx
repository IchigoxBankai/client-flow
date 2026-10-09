import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { Search, FolderKanban, Users, FileText, Sparkles, Plus, Receipt, RotateCcw, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    projects,
    clients,
    invoices,
    documents,
    setActiveProjectId,
    setIsFlowAgentOpen,
    setIsBriefModalOpen,
    resetDemoData
  } = useWorkspace();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter Projects
  const filteredProjects = projects
    .filter(p => p.title.toLowerCase().includes(q) || p.clientName?.toLowerCase().includes(q))
    .slice(0, 4);

  // Filter Clients
  const filteredClients = clients
    .filter(c => c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q))
    .slice(0, 3);

  // Filter Invoices
  const filteredInvoices = invoices
    .filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.clientName?.toLowerCase().includes(q))
    .slice(0, 3);

  // Actions list
  const actions = [
    {
      id: 'act_brief',
      title: 'Brief to Build — AI Project Intake',
      category: 'Action',
      icon: Sparkles,
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsBriefModalOpen(true);
      }
    },
    {
      id: 'act_proposal',
      title: 'Draft Client Proposal',
      category: 'Action',
      icon: FileText,
      action: () => {
        setIsCommandPaletteOpen(false);
        navigate('/app/documents/proposals/new');
      }
    },
    {
      id: 'act_invoice',
      title: 'Create Invoice',
      category: 'Action',
      icon: Receipt,
      action: () => {
        setIsCommandPaletteOpen(false);
        navigate('/app/documents/invoices/new');
      }
    },
    {
      id: 'act_agent',
      title: 'Open Flow Agent Companion',
      category: 'Action',
      icon: Sparkles,
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsFlowAgentOpen(true);
      }
    },
    {
      id: 'act_reset',
      title: 'Reset Demo Workspace Data',
      category: 'System',
      icon: RotateCcw,
      action: () => {
        setIsCommandPaletteOpen(false);
        resetDemoData();
      }
    }
  ].filter(a => a.title.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-ink/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-2xl bg-paper rounded-xl shadow-sheet border border-atelier-dark overflow-hidden flex flex-col max-h-[75vh]"
      >
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-atelier bg-paper-light">
          <Search className="w-5 h-5 text-ink/40 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, clients, invoices, or type a command..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none font-sans"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded text-ink/40 hover:text-ink hover:bg-warmGrey/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs font-sans">
          {/* Quick Actions */}
          {actions.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-mono-meta uppercase tracking-widest text-[10px] text-ink/40">
                Commands & Shortcuts
              </div>
              <div className="space-y-1">
                {actions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      onClick={act.action}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-chartreuse/30 text-ink text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-ink/70 group-hover:text-ink" />
                        <span className="font-medium">{act.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-ink/30 group-hover:text-ink transition-transform group-hover:translate-x-0.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-mono-meta uppercase tracking-widest text-[10px] text-ink/40">
                Projects
              </div>
              <div className="space-y-1">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProjectId(p.id);
                      setIsCommandPaletteOpen(false);
                      navigate('/app/work');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-warmGrey/60 text-ink text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderKanban className="w-4 h-4 text-ink/60" />
                      <div>
                        <div className="font-medium text-ink">{p.title}</div>
                        <div className="text-[11px] text-ink/50 font-mono-meta">{p.clientName} • {p.status.toUpperCase()}</div>
                      </div>
                    </div>
                    <span className="font-mono-meta text-[11px] text-ink/60">{p.currency}{Number(p.budget || 0).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {filteredClients.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-mono-meta uppercase tracking-widest text-[10px] text-ink/40">
                Clients
              </div>
              <div className="space-y-1">
                {filteredClients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setIsCommandPaletteOpen(false);
                      navigate(`/app/clients/${c.id}`);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-warmGrey/60 text-ink text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-ink/60" />
                      <div>
                        <div className="font-medium text-ink">{c.name}</div>
                        <div className="text-[11px] text-ink/50">{c.contactPerson} • {c.company}</div>
                      </div>
                    </div>
                    <span className="font-mono-meta text-[11px] text-ink/60">{c.email}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {filteredInvoices.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 font-mono-meta uppercase tracking-widest text-[10px] text-ink/40">
                Invoices
              </div>
              <div className="space-y-1">
                {filteredInvoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      setIsCommandPaletteOpen(false);
                      navigate('/app/documents/invoices');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-warmGrey/60 text-ink text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Receipt className="w-4 h-4 text-ink/60" />
                      <div>
                        <div className="font-medium text-ink">{inv.invoiceNumber} — {inv.clientName}</div>
                        <div className="text-[11px] text-ink/50">{inv.title}</div>
                      </div>
                    </div>
                    <span className="font-mono-meta text-[11px] text-ink/60 font-semibold">{inv.currency}{inv.total?.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {actions.length === 0 && filteredProjects.length === 0 && filteredClients.length === 0 && (
            <div className="p-8 text-center text-ink/50 text-sm">
              No matching items found for "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-warmGrey/30 border-t border-atelier flex items-center justify-between text-[11px] font-mono-meta text-ink/50">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </motion.div>
    </div>
  );
}
