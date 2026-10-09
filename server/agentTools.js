/**
 * ClientFlow Agent Tool Registry Definitions
 * Structured tool declarations conforming to function-calling specifications.
 */

export const AGENT_TOOLS_DEFINITIONS = [
  {
    name: 'getProjectDetails',
    description: 'Retrieve full details of a specific project including brief, requirements, budget, status, and dates.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING', description: 'Unique identifier of the project' }
      },
      required: ['projectId']
    }
  },
  {
    name: 'getProjectMilestones',
    description: 'Retrieve all milestones and associated task summaries for a project.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING', description: 'Unique identifier of the project' }
      },
      required: ['projectId']
    }
  },
  {
    name: 'getProjectTasks',
    description: 'Retrieve all tasks, their statuses, priorities, and assigned milestones for a project.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING', description: 'Unique identifier of the project' },
        milestoneId: { type: 'STRING', description: 'Optional milestone ID to filter tasks' }
      },
      required: ['projectId']
    }
  },
  {
    name: 'getClientDetails',
    description: 'Retrieve details, contact information, and project history for a client.',
    parameters: {
      type: 'OBJECT',
      properties: {
        clientId: { type: 'STRING', description: 'Unique identifier of the client' }
      },
      required: ['clientId']
    }
  },
  {
    name: 'getUpcomingDeadlines',
    description: 'Retrieve upcoming task and milestone deadlines across the workspace.',
    parameters: {
      type: 'OBJECT',
      properties: {
        daysAhead: { type: 'NUMBER', description: 'Number of days to look ahead (default 14)' }
      }
    }
  },
  {
    name: 'getOutstandingInvoices',
    description: 'Retrieve all unpaid, partially paid, or overdue invoices in the workspace.',
    parameters: {
      type: 'OBJECT',
      properties: {
        clientId: { type: 'STRING', description: 'Optional client filter' }
      }
    }
  },
  {
    name: 'createTask',
    description: 'Create a new task within a project milestone. Requires human confirmation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING', description: 'Target project ID' },
        milestoneId: { type: 'STRING', description: 'Target milestone ID' },
        title: { type: 'STRING', description: 'Task title' },
        description: { type: 'STRING', description: 'Task description' },
        priority: { type: 'STRING', enum: ['low', 'medium', 'high'], description: 'Task priority' },
        estimatedHours: { type: 'NUMBER', description: 'Estimated hours to complete' },
        dueDate: { type: 'STRING', description: 'Due date in YYYY-MM-DD format' }
      },
      required: ['projectId', 'title']
    }
  },
  {
    name: 'updateTaskStatus',
    description: 'Update the status of an existing task (To Do, In Progress, Blocked, Done). Requires human confirmation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING', description: 'Project ID' },
        taskId: { type: 'STRING', description: 'Task ID' },
        status: { type: 'STRING', enum: ['todo', 'in_progress', 'blocked', 'done'], description: 'New task status' },
        note: { type: 'STRING', description: 'Optional note or reason for status update' }
      },
      required: ['projectId', 'taskId', 'status']
    }
  },
  {
    name: 'updateMilestone',
    description: 'Update milestone status or approval state (e.g. approved, in_progress, completed). Requires human confirmation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING', description: 'Project ID' },
        milestoneId: { type: 'STRING', description: 'Milestone ID' },
        status: { type: 'STRING', enum: ['pending', 'in_progress', 'in_review', 'completed'], description: 'Milestone lifecycle status' },
        approvalStatus: { type: 'STRING', enum: ['unapproved', 'pending_approval', 'approved', 'rejected'], description: 'Client approval status' }
      },
      required: ['projectId', 'milestoneId']
    }
  },
  {
    name: 'updateProjectStatus',
    description: 'Move project to a new stage (lead, planning, in_progress, review, completed). Requires human confirmation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING', description: 'Project ID' },
        status: { type: 'STRING', enum: ['lead', 'planning', 'in_progress', 'review', 'completed'], description: 'New project status' },
        reason: { type: 'STRING', description: 'Context or rationale for the status transition' }
      },
      required: ['projectId', 'status']
    }
  },
  {
    name: 'createProjectPlan',
    description: 'Extract and structure a project plan from a client message or brief. Returns structured blueprint.',
    parameters: {
      type: 'OBJECT',
      properties: {
        rawBrief: { type: 'STRING', description: 'Raw client message or brief' },
        clientName: { type: 'STRING', description: 'Client or business name' },
        budget: { type: 'NUMBER', description: 'Budget amount if specified' },
        currency: { type: 'STRING', description: 'Currency symbol or code' },
        deadlineWeeks: { type: 'NUMBER', description: 'Timeline in weeks if specified' }
      },
      required: ['rawBrief']
    }
  },
  {
    name: 'createProposalDraft',
    description: 'Draft a complete, professional client proposal from project details. Requires human confirmation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING', description: 'Project ID to generate proposal for' },
        validDays: { type: 'NUMBER', description: 'Number of days proposal is valid for (default 30)' }
      },
      required: ['projectId']
    }
  },
  {
    name: 'createInvoiceDraft',
    description: 'Create an invoice draft for a project or milestone. Requires human confirmation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING', description: 'Associated Project ID' },
        clientId: { type: 'STRING', description: 'Client ID' },
        title: { type: 'STRING', description: 'Invoice description / title' },
        items: {
          type: 'ARRAY',
          description: 'Line items',
          items: {
            type: 'OBJECT',
            properties: {
              description: { type: 'STRING' },
              quantity: { type: 'NUMBER' },
              rate: { type: 'NUMBER' }
            }
          }
        },
        taxPercent: { type: 'NUMBER' },
        dueDays: { type: 'NUMBER', description: 'Days until payment is due (default 14)' }
      },
      required: ['projectId', 'clientId', 'title']
    }
  },
  {
    name: 'createClientEmailDraft',
    description: 'Generate an email draft to a client based on real project state and selected tone.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING', description: 'Project ID' },
        purpose: { type: 'STRING', enum: ['kickoff', 'proposal_delivery', 'progress_update', 'request_feedback', 'milestone_approval', 'deadline_extension', 'payment_reminder', 'project_completion', 'handover'], description: 'Email purpose' },
        tone: { type: 'STRING', enum: ['professional', 'friendly', 'concise'], description: 'Desired tone' },
        customNotes: { type: 'STRING', description: 'Specific details or links to mention' }
      },
      required: ['projectId', 'purpose']
    }
  },
  {
    name: 'recordProjectNote',
    description: 'Append an internal note or client feedback note to a project. Requires human confirmation.',
    parameters: {
      type: 'OBJECT',
      properties: {
        projectId: { type: 'STRING', description: 'Project ID' },
        content: { type: 'STRING', description: 'Note text' },
        category: { type: 'STRING', enum: ['client_feedback', 'decision', 'internal', 'scope_change'], description: 'Category of note' }
      },
      required: ['projectId', 'content']
    }
  }
];
