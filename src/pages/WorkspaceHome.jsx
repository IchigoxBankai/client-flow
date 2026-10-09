import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { calculateProjectHealth } from '../utils/healthCalculator';
import { sendAgentChatMessage } from '../services/agentApi';
import {
  Sparkles,
  ArrowRight,
  Clock,
  AlertTriangle,
  FileText,
  Receipt,
  CheckCircle2,
  FolderKanban,
  Users,
  Send,
  PlusCircle,
  Calendar,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

export function WorkspaceHome() {
  const navigate = useNavigate();
  const { studio } = useAuth();
  const {
    projects,
    clients,
    invoices,
    proposals,
    activity,
    setActiveProjectId,
    setIsFlowAgentOpen,
    setIsBriefModalOpen,
    setAgentMessages,
    pendingAction
  } = useWorkspace();

  const [commandInput, setCommandInput] = useState('');

  // Calculate Studio stats
  const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'review');
  const leadProjects = projects.filter(p => p.status === 'lead' || p.status === 'planning');
  const allTasks = projects.flatMap(p => (p.tasks || []).map(t => ({ ...t, projectTitle: p.title, projectId: p.id })));
  const openTasks = allTasks.filter(t => t.status !== 'done');
  const overdueInvoices = invoices.filter(i => i.status === 'overdue');
  const unpaidInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'partially_paid');

  const handleCommandSubmit = async (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    setCommandInput('');

    // Open Flow Agent with this command
    setIsFlowAgentOpen(true);
    setAgentMessages(prev => [
      ...prev,
      {
        id: `msg_u_${Date.now()}`,
        sender: 'user',
        text: cmd,
        timestamp: new Date().toISOString()
      }
    ]);

    try {
      const response = await sendAgentChatMessage({
        message: cmd,
        activeProjectId: projects[0]?.id,
        workspace: { projects, clients, invoices },
        studioProfile: studio
      });

      if (response.reply) {
        setAgentMessages(prev => [
          ...prev,
          {
            id: `msg_a_${Date.now()}`,
            sender: 'agent',
            text: response.reply,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Studio Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-atelier pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">
              {studio?.name || 'Northstar Creative'} • Studio Atelier
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl text-ink font-bold tracking-tight">
            Your studio, today.
          </h1>
          <p className="text-sm text-ink/70 font-sans mt-1">
            {activeProjects.length} active projects in flight • {openTasks.length} pending tasks • {overdueInvoices.length > 0 ? `${overdueInvoices.length} invoice needs attention` : 'All invoices up to date'}
          </p>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsBriefModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Brief to Build</span>
          </button>
          <button
            onClick={() => setIsFlowAgentOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-paper hover:bg-warmGrey/60 text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-atelier transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-ink" />
            <span>Ask Flow Agent</span>
          </button>
        </div>
      </div>

      {/* Prominent Editorial Command Bar (Section 18) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border-2 border-ink shadow-sheet">
        <form onSubmit={handleCommandSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2.5 flex-1">
            <Sparkles className="w-5 h-5 text-ink shrink-0 ml-1" />
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="What are we working on? (e.g. 'Draft proposal for latest client', 'Approve homepage design')..."
              className="w-full bg-transparent text-sm sm:text-base text-ink placeholder:text-ink/40 focus:outline-none font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={!commandInput.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-ink text-chartreuse hover:bg-ink/90 font-semibold text-xs font-mono-meta uppercase tracking-wider rounded-lg border border-ink transition-all disabled:opacity-40"
          >
            <span>Execute</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Grid: Needs Your Attention & Upcoming Work Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Needs Attention & Project Overview (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Needs Your Attention Section */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-ink" />
                <span>Needs Your Attention</span>
              </h2>
              <span className="text-[11px] font-mono-meta text-ink/50">4 items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1: Review Item */}
              <div className="p-4 rounded-xl bg-white border border-atelier hover:border-ink/50 transition-all space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-meta">
                  <span className="text-ink/50 uppercase">Milestone Review</span>
                  <span className="px-1.5 py-0.5 rounded bg-chartreuse text-ink font-semibold">Action Ready</span>
                </div>
                <h4 className="font-editorial text-lg text-ink font-semibold">
                  Olive & Ember Bistro — Visual Design
                </h4>
                <p className="text-xs text-ink/70">
                  Client review round complete. You can mark milestone approved to unlock frontend development.
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setActiveProjectId('proj_restaurant');
                      setIsFlowAgentOpen(true);
                    }}
                    className="text-xs font-mono-meta uppercase font-bold text-ink hover:underline flex items-center gap-1"
                  >
                    <span>Approve via Agent</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card 2: Overdue / Outstanding Invoice */}
              <div className="p-4 rounded-xl bg-white border border-atelier hover:border-ink/50 transition-all space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-meta">
                  <span className="text-terracotta uppercase font-bold">Overdue Payment</span>
                  <span className="font-mono-meta text-ink font-semibold">₹18,000</span>
                </div>
                <h4 className="font-editorial text-lg text-ink font-semibold">
                  Kestrel Studio — INV-2026-039
                </h4>
                <p className="text-xs text-ink/70">
                  Payment for architectural portfolio handover was due on October 8.
                </p>
                <div className="pt-2 flex justify-end">
                  <Link
                    to="/app/documents/communication"
                    className="text-xs font-mono-meta uppercase font-bold text-ink hover:underline flex items-center gap-1"
                  >
                    <span>Draft Reminder Email</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Lead Proposal */}
              <div className="p-4 rounded-xl bg-white border border-atelier hover:border-ink/50 transition-all space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-meta">
                  <span className="text-ink/50 uppercase">Lead Proposal</span>
                  <span className="font-mono-meta text-ink font-semibold">₹45,000</span>
                </div>
                <h4 className="font-editorial text-lg text-ink font-semibold">
                  Aura Botanicals — Storefront
                </h4>
                <p className="text-xs text-ink/70">
                  Requirements collected. Proposal draft ready for review and transmission.
                </p>
                <div className="pt-2 flex justify-end">
                  <Link
                    to="/app/documents/proposals"
                    className="text-xs font-mono-meta uppercase font-bold text-ink hover:underline flex items-center gap-1"
                  >
                    <span>Open Proposal Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Card 4: Upcoming Task */}
              <div className="p-4 rounded-xl bg-white border border-atelier hover:border-ink/50 transition-all space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono-meta">
                  <span className="text-ink/50 uppercase">Task Due Soon</span>
                  <span className="text-[10px] font-mono-meta text-ink/60">Oct 12</span>
                </div>
                <h4 className="font-editorial text-lg text-ink font-semibold">
                  Table reservation modal & confirmation
                </h4>
                <p className="text-xs text-ink/70">
                  Associated with Olive & Ember Bistro Phase 2 deliverables.
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setActiveProjectId('proj_restaurant');
                      navigate('/app/work');
                    }}
                    className="text-xs font-mono-meta uppercase font-bold text-ink hover:underline flex items-center gap-1"
                  >
                    <span>View in Canvas</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Pick Up Where You Left Off: Active Projects */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink flex items-center gap-2">
                <FolderKanban className="w-3.5 h-3.5 text-ink" />
                <span>Active Studio Projects</span>
              </h2>
              <Link to="/app/work" className="text-xs font-mono-meta text-ink hover:underline">
                View All ({projects.length}) →
              </Link>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 3).map((p) => {
                const health = calculateProjectHealth(p);
                const currentMilestone = p.milestones?.find(m => m.status === 'in_progress' || m.status === 'in_review') || p.milestones?.[0];

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveProjectId(p.id);
                      navigate('/app/work');
                    }}
                    className="p-5 rounded-xl bg-white border border-atelier hover:border-ink shadow-subtle hover:shadow-atelier transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-atelier">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono-meta text-[11px] text-ink/50 uppercase">{p.projectNumber}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono-meta uppercase ${health.color}`}>
                            {health.label}
                          </span>
                        </div>
                        <h3 className="font-editorial text-2xl text-ink font-semibold group-hover:text-ink transition-colors mt-0.5">
                          {p.title}
                        </h3>
                        <p className="text-xs text-ink/60">Client: {p.clientName} • Deadline: {p.deadline}</p>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="font-mono-meta text-sm font-bold text-ink">
                          {p.currency}{Number(p.budget || 0).toLocaleString()}
                        </div>
                        <div className="text-[11px] font-mono-meta text-ink/50">
                          {p.completionPercentage}% Complete
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Milestone Status */}
                    <div className="pt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-ink/70">
                        <Clock className="w-3.5 h-3.5 text-ink/50" />
                        <span>Current Stage: <strong className="text-ink">{currentMilestone?.name || 'Discovery'}</strong></span>
                      </div>
                      <span className="font-mono-meta text-[11px] text-ink/50 uppercase group-hover:translate-x-1 transition-transform">
                        Open Project Canvas →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Studio Feed & Upcoming Deadlines (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Upcoming Studio Deadlines */}
          <div className="p-5 rounded-xl bg-paper-light border border-atelier space-y-4">
            <h3 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-ink" />
              <span>Upcoming Milestones</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-atelier space-y-1">
                <div className="flex justify-between font-mono-meta text-[11px]">
                  <span className="font-bold text-ink">Oct 12, 2026</span>
                  <span className="text-ink/60">In 3 days</span>
                </div>
                <div className="font-semibold text-ink">Visual Design Signoff</div>
                <div className="text-[11px] text-ink/60 font-mono-meta">Olive & Ember Bistro</div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-atelier space-y-1">
                <div className="flex justify-between font-mono-meta text-[11px]">
                  <span className="font-bold text-ink">Oct 14, 2026</span>
                  <span className="text-ink/60">In 5 days</span>
                </div>
                <div className="font-semibold text-ink">Final Client Review Walkthrough</div>
                <div className="text-[11px] text-ink/60 font-mono-meta">Kestrel Studio</div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-atelier space-y-1">
                <div className="flex justify-between font-mono-meta text-[11px]">
                  <span className="font-bold text-ink">Oct 18, 2026</span>
                  <span className="text-ink/60">In 9 days</span>
                </div>
                <div className="font-semibold text-ink">Frontend Web App Build Handover</div>
                <div className="text-[11px] text-ink/60 font-mono-meta">Olive & Ember Bistro</div>
              </div>
            </div>
          </div>

          {/* Recent Studio Activity Log */}
          <div className="p-5 rounded-xl bg-paper-light border border-atelier space-y-4">
            <h3 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-ink" />
              <span>Studio Flow Log</span>
            </h3>

            <div className="space-y-3">
              {activity.slice(0, 5).map((act) => (
                <div key={act.id} className="border-l-2 border-ink pl-3 py-0.5 space-y-0.5 text-xs">
                  <div className="font-medium text-ink">{act.title}</div>
                  <div className="text-[11px] text-ink/60">{act.description}</div>
                  <div className="text-[10px] font-mono-meta text-ink/40">
                    {new Date(act.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
