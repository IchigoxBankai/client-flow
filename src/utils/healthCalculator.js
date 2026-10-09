/**
 * Deterministic Project Health Calculator
 * Evaluates real project state against milestone dates, overdue tasks, and completion percentage.
 * Returns: { status: 'on_track' | 'at_risk' | 'overdue' | 'completed', label: string, color: string, reason: string }
 */

export function calculateProjectHealth(project) {
  if (!project) return { status: 'unknown', label: 'Unknown', color: 'bg-warmGrey text-ink', reason: 'No project data' };

  if (project.status === 'completed' || project.completionPercentage === 100) {
    return {
      status: 'completed',
      label: 'Completed',
      color: 'bg-sage text-ink border border-sage-dark/30',
      reason: 'All project milestones and deliverables have been fulfilled.'
    };
  }

  const now = new Date();
  const deadline = project.deadline ? new Date(project.deadline) : null;
  const isPastDeadline = deadline && deadline < now;

  const tasks = project.tasks || [];
  const milestones = project.milestones || [];

  // Check for overdue tasks
  const overdueTasks = tasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < now);

  // Check for overdue milestones
  const overdueMilestones = milestones.filter(m => m.status !== 'completed' && m.dueDate && new Date(m.dueDate) < now);

  // Check blocked tasks
  const blockedTasks = tasks.filter(t => t.status === 'blocked');

  if (isPastDeadline) {
    return {
      status: 'overdue',
      label: 'Overdue',
      color: 'bg-terracotta text-white font-medium',
      reason: `Project deadline passed on ${project.deadline}. Incomplete tasks remain.`
    };
  }

  if (overdueMilestones.length > 0) {
    return {
      status: 'at_risk',
      label: 'At Risk',
      color: 'bg-[#FBE7C6] text-[#7A4B00] border border-[#E0B86C]',
      reason: `Milestone "${overdueMilestones[0].name}" missed target date of ${overdueMilestones[0].dueDate}.`
    };
  }

  if (blockedTasks.length > 0) {
    return {
      status: 'at_risk',
      label: 'At Risk',
      color: 'bg-[#FBE7C6] text-[#7A4B00] border border-[#E0B86C]',
      reason: `${blockedTasks.length} task(s) currently blocked by dependencies.`
    };
  }

  if (overdueTasks.length > 1) {
    return {
      status: 'at_risk',
      label: 'At Risk',
      color: 'bg-[#FBE7C6] text-[#7A4B00] border border-[#E0B86C]',
      reason: `${overdueTasks.length} tasks are past their due dates.`
    };
  }

  return {
    status: 'on_track',
    label: 'On Track',
    color: 'bg-sage-faint text-sage-dark border border-sage/40',
    reason: `All milestones and ${tasks.filter(t => t.status === 'done').length}/${tasks.length} tasks are progressing on schedule.`
  };
}
