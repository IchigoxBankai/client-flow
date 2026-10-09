import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { calculateProjectHealth } from '../utils/healthCalculator';
import { MilestoneTimeline } from '../components/MilestoneTimeline';
import { TaskModal } from '../components/TaskModal';
import {
  Sparkles,
  Plus,
  PlusCircle,
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
  Calendar,
  Layers,
  LayoutGrid,
  Filter,
  CheckSquare,
  HelpCircle,
  Info,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WorkPage() {
  const { studio } = useAuth();
  const {
    projects,
    clients,
    activeProjectId,
    setActiveProjectId,
    activeProject,
    updateProject,
    deleteProject,
    updateTask,
    updateMilestone,
    setIsFlowAgentOpen,
    setIsBriefModalOpen,
    showToast
  } = useWorkspace();

  const [viewMode, setViewMode] = useState('canvas'); // 'canvas' | 'board'
  const [isIndexCollapsed, setIsIndexCollapsed] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Active project details
  const activeClient = activeProject ? clients.find(c => c.id === activeProject.clientId) : null;
  const health = calculateProjectHealth(activeProject);

  // Determine current active milestone
  const milestones = activeProject?.milestones || [];
  const currentMilestone = milestones.find(m => m.id === selectedMilestoneId) ||
    milestones.find(m => m.status === 'in_progress' || m.status === 'in_review') ||
    milestones[0];

  // Tasks filtered for the active project / active milestone
  const allProjectTasks = activeProject?.tasks || [];
  const milestoneTasks = selectedMilestoneId
    ? allProjectTasks.filter(t => t.milestoneId === selectedMilestoneId)
    : allProjectTasks;

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.clientName?.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleTaskStatusToggle = (task) => {
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    updateTask(activeProject.id, task.id, { status: nextStatus });
    showToast('Task Updated', `"${task.title}" marked as ${nextStatus.toUpperCase()}`);
  };

  const handleMoveProjectStatus = (projectId, newStatus) => {
    updateProject(projectId, { status: newStatus });
    showToast('Project Moved', `Stage changed to ${newStatus.toUpperCase()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Work Subheader & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-atelier pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl text-ink font-bold">
            Work Atelier
          </h1>
          <span className="font-mono-meta text-xs text-ink/50 uppercase">
            ({projects.length} Projects)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Dual View Toggle */}
          <div className="flex items-center p-1 bg-warmGrey/50 border border-atelier rounded-lg text-xs font-mono-meta">
            <button
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                viewMode === 'canvas'
                  ? 'bg-paper shadow-atelier text-ink font-bold border border-ink'
                  : 'text-ink/60 hover:text-ink'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Project Canvas</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                viewMode === 'board'
                  ? 'bg-paper shadow-atelier text-ink font-bold border border-ink'
                  : 'text-ink/60 hover:text-ink'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Flow Board</span>
            </button>
          </div>

          <button
            onClick={() => setIsBriefModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Brief</span>
          </button>
        </div>
      </div>

      {/* --- VIEW 1: SIGNATURE PROJECT CANVAS (Zones A & B) --- */}
      {viewMode === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Zone A — Collapsible Work Index (3 Cols on Desktop) */}
          <div
            className={`transition-all duration-300 ${
              isIndexCollapsed ? 'lg:col-span-1' : 'lg:col-span-3'
            } space-y-4`}
          >
            <div className="p-4 rounded-xl bg-paper-light border border-atelier space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono-meta text-[11px] uppercase tracking-widest font-bold text-ink/60">
                  {isIndexCollapsed ? 'Index' : 'Work Index'}
                </span>
                <button
                  onClick={() => setIsIndexCollapsed(!isIndexCollapsed)}
                  className="p-1 rounded hover:bg-warmGrey/60 text-ink/50 hover:text-ink hidden lg:block"
                  title={isIndexCollapsed ? 'Expand Index' : 'Collapse Index'}
                >
                  {isIndexCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {!isIndexCollapsed && (
                <>
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Filter projects..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-atelier rounded text-ink focus:outline-none focus:border-ink font-sans"
                  />

                  {/* Project List */}
                  <div className="space-y-1.5 pt-1 max-h-[600px] overflow-y-auto">
                    {filteredProjects.map((p) => {
                      const isSelected = p.id === activeProjectId;
                      const pHealth = calculateProjectHealth(p);

                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setActiveProjectId(p.id);
                            setSelectedMilestoneId(null);
                          }}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-white border-ink shadow-sm ring-1 ring-ink'
                              : 'bg-paper/50 border-atelier/60 hover:bg-white hover:border-atelier'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono-meta text-[10px] text-ink/50 uppercase">{p.projectNumber}</span>
                            <span className={`w-2 h-2 rounded-full ${pHealth.status === 'completed' ? 'bg-sage-dark' : pHealth.status === 'overdue' ? 'bg-terracotta' : pHealth.status === 'at_risk' ? 'bg-[#D97706]' : 'bg-chartreuse-dark'}`} />
                          </div>
                          <div className="font-editorial text-sm font-semibold text-ink line-clamp-1 mt-0.5">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-ink/60 font-mono-meta mt-0.5 truncate">
                            {p.clientName}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Zone B — Active Project Canvas (9 or 11 Cols on Desktop) */}
          <div
            className={`transition-all duration-300 ${
              isIndexCollapsed ? 'lg:col-span-11' : 'lg:col-span-9'
            } space-y-6`}
          >
            {activeProject ? (
              <div className="bg-paper-card border border-atelier rounded-2xl shadow-sheet overflow-hidden">
                {/* Project Canvas Editorial Header Sheet */}
                <div className="p-6 sm:p-8 border-b border-atelier bg-paper-light space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">
                          {activeProject.projectNumber}
                        </span>
                        <span className="text-ink/30 font-mono-meta text-xs">•</span>
                        <span className="font-mono-meta text-xs uppercase font-bold text-ink">
                          {activeProject.clientName}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono-meta uppercase font-bold ${health.color}`}>
                          {health.label}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-ink font-bold tracking-tight">
                        {activeProject.title}
                      </h2>
                    </div>

                    {/* Quick AI & Actions Bar */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsFlowAgentOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-sm transition-all"
                        title="Contextual AI Actions"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Flow Agent</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Archive project "${activeProject.title}"?`)) {
                            deleteProject(activeProject.id);
                          }
                        }}
                        className="p-2 text-ink/40 hover:text-terracotta transition-colors"
                        title="Archive Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Project Commercial & Timeline Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-atelier text-xs">
                    <div>
                      <span className="font-mono-meta text-[10px] uppercase text-ink/50">Total Budget</span>
                      <div className="font-mono-meta text-base font-bold text-ink mt-0.5">
                        {activeProject.currency}{Number(activeProject.budget || 0).toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <span className="font-mono-meta text-[10px] uppercase text-ink/50">Target Deadline</span>
                      <div className="font-mono-meta text-base font-bold text-ink mt-0.5">
                        {activeProject.deadline || '3 Weeks'}
                      </div>
                    </div>

                    <div>
                      <span className="font-mono-meta text-[10px] uppercase text-ink/50">Project Lifecycle</span>
                      <div className="mt-0.5">
                        <select
                          value={activeProject.status}
                          onChange={(e) => handleMoveProjectStatus(activeProject.id, e.target.value)}
                          className="font-mono-meta text-xs uppercase font-semibold bg-white border border-atelier rounded px-2 py-1 text-ink focus:outline-none"
                        >
                          <option value="lead">Lead</option>
                          <option value="planning">Planning</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Client Review</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <span className="font-mono-meta text-[10px] uppercase text-ink/50">Completion</span>
                      <div className="font-mono-meta text-base font-bold text-ink mt-0.5">
                        {activeProject.completionPercentage || 0}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone Interactive Timeline Track */}
                <div className="p-6 sm:p-8 border-b border-atelier space-y-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink">
                        Milestone Architecture
                      </h3>
                      <p className="text-xs text-ink/60">
                        Select a stage to manage its deliverables, tasks, and client approvals.
                      </p>
                    </div>
                    {currentMilestone && (
                      <span className="font-mono-meta text-xs text-ink/60">
                        Selected: <strong>{currentMilestone.name}</strong>
                      </span>
                    )}
                  </div>

                  <MilestoneTimeline
                    milestones={milestones}
                    selectedMilestoneId={selectedMilestoneId || currentMilestone?.id}
                    onSelectMilestone={(id) => setSelectedMilestoneId(id)}
                  />
                </div>

                {/* Selected Milestone Details & Task Board */}
                {currentMilestone && (
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Stage Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-paper-light border border-atelier">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-meta text-xs font-bold text-ink uppercase">
                            {currentMilestone.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono-meta uppercase font-semibold ${
                            currentMilestone.approvalStatus === 'approved'
                              ? 'bg-sage-light text-sage-dark'
                              : currentMilestone.approvalStatus === 'pending_approval'
                              ? 'bg-chartreuse text-ink'
                              : 'bg-warmGrey text-ink/60'
                          }`}>
                            Approval: {currentMilestone.approvalStatus?.replace('_', ' ') || 'Unapproved'}
                          </span>
                        </div>
                        <p className="text-xs text-ink/70">
                          {currentMilestone.description || 'Milestone scope and specifications.'}
                        </p>
                      </div>

                      {/* Milestone Quick Actions */}
                      <div className="flex items-center gap-2">
                        {currentMilestone.approvalStatus !== 'approved' && (
                          <button
                            onClick={() => {
                              updateMilestone(activeProject.id, currentMilestone.id, {
                                approvalStatus: 'approved',
                                status: 'completed'
                              });
                              showToast('Milestone Approved', `${currentMilestone.name} marked as Approved & Completed.`);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-paper hover:bg-chartreuse text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-sm transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Approved</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingTask(null);
                            setIsTaskModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-ink text-chartreuse hover:bg-ink/90 font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-sm transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Task</span>
                        </button>
                      </div>
                    </div>

                    {/* Task List under Milestone */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between font-mono-meta text-xs text-ink/50 uppercase tracking-wider">
                        <span>Milestone Tasks ({milestoneTasks.length})</span>
                        <span>Status</span>
                      </div>

                      <div className="space-y-2">
                        {milestoneTasks.map((t) => {
                          const isDone = t.status === 'done';
                          const isBlocked = t.status === 'blocked';

                          return (
                            <div
                              key={t.id}
                              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                                isDone
                                  ? 'bg-paper-light/60 border-atelier/60 text-ink/50'
                                  : isBlocked
                                  ? 'bg-terracotta-light/40 border-terracotta/30 text-ink'
                                  : 'bg-white border-atelier hover:border-ink/50 text-ink shadow-subtle'
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <button
                                  type="button"
                                  onClick={() => handleTaskStatusToggle(t)}
                                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                                    isDone
                                      ? 'bg-ink border-ink text-chartreuse'
                                      : 'bg-white border-ink/40 hover:border-ink'
                                  }`}
                                >
                                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>

                                <div className="min-w-0 flex-1">
                                  <div className={`text-sm font-medium ${isDone ? 'line-through text-ink/50' : 'text-ink'}`}>
                                    {t.title}
                                  </div>
                                  {t.description && (
                                    <div className="text-[11px] text-ink/60 truncate mt-0.5">
                                      {t.description}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Task Metadata & Status */}
                              <div className="flex items-center gap-3 shrink-0">
                                <span className={`text-[10px] font-mono-meta uppercase px-2 py-0.5 rounded font-semibold ${
                                  t.priority === 'high' ? 'bg-terracotta-light text-terracotta' : 'bg-warmGrey text-ink/60'
                                }`}>
                                  {t.priority}
                                </span>

                                <select
                                  value={t.status}
                                  onChange={(e) => {
                                    updateTask(activeProject.id, t.id, { status: e.target.value });
                                    showToast('Status Changed', `Task set to ${e.target.value}`);
                                  }}
                                  className="text-xs font-mono-meta uppercase bg-white border border-atelier rounded px-2 py-1 text-ink focus:outline-none"
                                >
                                  <option value="todo">To Do</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="blocked">Blocked</option>
                                  <option value="done">Done</option>
                                </select>
                              </div>
                            </div>
                          );
                        })}

                        {milestoneTasks.length === 0 && (
                          <div className="p-8 text-center bg-paper-light rounded-xl border border-atelier text-ink/50 text-xs">
                            No tasks created for this milestone yet. Click "+ Add Task" to create one.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Project Brief & Deliverables Drawer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-atelier">
                      <div className="p-4 rounded-xl bg-paper-light border border-atelier space-y-2">
                        <span className="font-mono-meta text-[11px] uppercase font-bold text-ink/60">
                          Project Brief & Objectives
                        </span>
                        <p className="text-xs text-ink/80 leading-relaxed">
                          {activeProject.brief || 'No brief summary specified.'}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-paper-light border border-atelier space-y-2">
                        <span className="font-mono-meta text-[11px] uppercase font-bold text-ink/60">
                          Scope & Key Deliverables
                        </span>
                        <ul className="text-xs text-ink/80 space-y-1 list-disc list-inside">
                          {activeProject.deliverables?.map((deliv, i) => (
                            <li key={i}>{deliv}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-16 text-center bg-paper-card border border-atelier rounded-2xl text-ink/60">
                <FolderKanban className="w-10 h-10 mx-auto text-ink/30 mb-3" />
                <h3 className="font-editorial text-2xl text-ink">No project selected</h3>
                <p className="text-xs font-mono-meta mt-1">Select a project from the index or create a new one using Brief to Build.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- VIEW 2: FLOW BOARD VIEW (Draggable / Accessible Kanban Columns) --- */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {[
            { key: 'lead', title: '01 Lead', color: 'border-t-4 border-t-warmGrey' },
            { key: 'planning', title: '02 Planning', color: 'border-t-4 border-t-ink/60' },
            { key: 'in_progress', title: '03 In Progress', color: 'border-t-4 border-t-chartreuse-dark' },
            { key: 'review', title: '04 Client Review', color: 'border-t-4 border-t-chartreuse' },
            { key: 'completed', title: '05 Completed', color: 'border-t-4 border-t-sage-dark' },
          ].map((col) => {
            const colProjects = projects.filter(p => p.status === col.key);

            return (
              <div key={col.key} className={`p-4 rounded-xl bg-paper-light border border-atelier space-y-3 ${col.color}`}>
                <div className="flex items-center justify-between pb-2 border-b border-atelier">
                  <span className="font-mono-meta text-xs uppercase font-bold text-ink">
                    {col.title}
                  </span>
                  <span className="font-mono-meta text-[11px] text-ink/50 font-bold">
                    {colProjects.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colProjects.map((p) => {
                    const pHealth = calculateProjectHealth(p);

                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-lg bg-white border border-atelier hover:border-ink shadow-subtle hover:shadow-atelier transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono-meta text-[10px] text-ink/50 uppercase">{p.projectNumber}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono-meta uppercase ${pHealth.color}`}>
                            {pHealth.label}
                          </span>
                        </div>

                        <div>
                          <h4
                            onClick={() => {
                              setActiveProjectId(p.id);
                              setViewMode('canvas');
                            }}
                            className="font-editorial text-lg text-ink font-semibold hover:underline cursor-pointer"
                          >
                            {p.title}
                          </h4>
                          <p className="text-[11px] text-ink/60">{p.clientName}</p>
                        </div>

                        <div className="pt-2 border-t border-atelier flex items-center justify-between text-[11px] font-mono-meta text-ink/70">
                          <span>{p.currency}{Number(p.budget || 0).toLocaleString()}</span>
                          <span>{p.completionPercentage}%</span>
                        </div>

                        {/* Move column quick selector */}
                        <div className="pt-1">
                          <select
                            value={p.status}
                            onChange={(e) => handleMoveProjectStatus(p.id, e.target.value)}
                            className="w-full text-[10px] font-mono-meta uppercase bg-warmGrey/40 border border-atelier rounded px-2 py-1 text-ink focus:outline-none"
                          >
                            <option value="lead">Move: Lead</option>
                            <option value="planning">Move: Planning</option>
                            <option value="in_progress">Move: In Progress</option>
                            <option value="review">Move: Review</option>
                            <option value="completed">Move: Completed</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}

                  {colProjects.length === 0 && (
                    <div className="p-6 text-center text-ink/40 text-xs border border-dashed border-atelier rounded-lg">
                      No projects
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={activeProject?.id}
        task={editingTask}
        defaultMilestoneId={currentMilestone?.id}
      />
    </div>
  );
}
