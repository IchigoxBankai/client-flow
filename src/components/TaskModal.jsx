import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { X, Check } from 'lucide-react';

export function TaskModal({ isOpen, onClose, projectId, task = null, defaultMilestoneId = null }) {
  const { createTask, updateTask, activeProject } = useWorkspace();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [milestoneId, setMilestoneId] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setMilestoneId(task.milestoneId || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setEstimatedHours(task.estimatedHours || 4);
      setDueDate(task.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setMilestoneId(defaultMilestoneId || activeProject?.milestones?.[0]?.id || '');
      setStatus('todo');
      setPriority('medium');
      setEstimatedHours(4);
      setDueDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
  }, [task, defaultMilestoneId, activeProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    if (task) {
      updateTask(projectId, task.id, {
        title,
        description,
        milestoneId,
        status,
        priority,
        estimatedHours: Number(estimatedHours),
        dueDate
      });
    } else {
      createTask(projectId, {
        title,
        description,
        milestoneId,
        status,
        priority,
        estimatedHours: Number(estimatedHours),
        dueDate
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-paper rounded-xl shadow-sheet border border-atelier overflow-hidden">
        <div className="px-6 py-4 border-b border-atelier bg-paper-light flex items-center justify-between">
          <h3 className="font-mono-meta text-xs uppercase tracking-wider font-bold text-ink">
            {task ? 'Edit Task' : 'New Project Task'}
          </h3>
          <button onClick={onClose} className="p-1 text-ink/40 hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design responsive table reservation flow"
              className="w-full px-3 py-2 text-sm bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
              Description & Deliverable Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail required assets or criteria..."
              className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Assigned Milestone
              </label>
              <select
                value={milestoneId}
                onChange={(e) => setMilestoneId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              >
                {activeProject?.milestones?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-2 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Est. Hours
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full px-2 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-atelier">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono-meta uppercase tracking-wider text-ink/60 hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{task ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
