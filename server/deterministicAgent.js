import { INITIAL_PROJECTS, INITIAL_CLIENTS } from '../src/data/initialData.js';

export class DeterministicFlowAgent {
  constructor(workspaceData = {}) {
    this.workspace = {
      projects: workspaceData.projects || INITIAL_PROJECTS,
      clients: workspaceData.clients || INITIAL_CLIENTS,
      ...workspaceData
    };
  }

  setWorkspace(data) {
    this.workspace = {
      projects: data?.projects?.length ? data.projects : (this.workspace.projects || INITIAL_PROJECTS),
      clients: data?.clients?.length ? data.clients : (this.workspace.clients || INITIAL_CLIENTS),
      ...data
    };
  }

  /**
   * Process incoming user prompt in context of active project and workspace
   */
  async processMessage({ message, activeProjectId, studioProfile }) {
    const text = (message || '').trim();
    const lower = text.toLowerCase();
    const projects = this.workspace.projects || [];
    const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;
    const clients = this.workspace.clients || [];
    const activeClient = activeProject ? clients.find(c => c.id === activeProject.clientId) : null;
    const currency = activeProject?.currency || studioProfile?.currency || '₹';

    // 1. Check for Milestone Approval / Status Movement Intent
    // e.g., "The client approved the homepage. Mark that milestone as approved and move to development."
    if (lower.includes('approved') || lower.includes('move to development') || lower.includes('mark as approved') || (lower.includes('approve') && lower.includes('milestone'))) {
      if (!activeProject) {
        return {
          reply: "I couldn't identify an active project. Please open or specify a project first to approve milestones.",
          requiresApproval: false
        };
      }

      // Find the milestone matching context (e.g. Design or Homepage)
      const milestones = activeProject.milestones || [];
      const designMilestone = milestones.find(m => m.name.toLowerCase().includes('design') || m.name.toLowerCase().includes('wireframe')) || milestones[1] || milestones[0];
      const devMilestone = milestones.find(m => m.name.toLowerCase().includes('development') || m.name.toLowerCase().includes('build')) || milestones[2];

      const tasks = activeProject.tasks || [];
      const homepageTask = tasks.find(t => t.title.toLowerCase().includes('home') || t.title.toLowerCase().includes('design') || t.title.toLowerCase().includes('visual')) || tasks[0];

      return {
        reply: `I found the **${designMilestone?.name || 'Design'}** milestone for **${activeProject.title}**.\n\nReview the proposed changes below before I apply them to the project:`,
        requiresApproval: true,
        proposedAction: {
          id: `act_${Date.now()}`,
          tool: 'batchUpdateProjectWorkflow',
          label: 'Approve Design & Move to Development',
          projectId: activeProject.id,
          projectTitle: activeProject.title,
          changes: [
            {
              type: 'task_status',
              taskId: homepageTask?.id,
              taskTitle: homepageTask?.title || 'Homepage Design & Visual Systems',
              from: homepageTask?.status || 'in_progress',
              to: 'done',
              description: `Mark '${homepageTask?.title || 'Homepage Design'}' as completed.`
            },
            {
              type: 'milestone_approval',
              milestoneId: designMilestone?.id,
              milestoneName: designMilestone?.name || 'Visual Design & Wireframes',
              approvalStatus: 'approved',
              status: 'completed',
              description: `Mark '${designMilestone?.name || 'Visual Design'}' milestone as Approved and Completed.`
            },
            {
              type: 'project_status',
              from: activeProject.status,
              to: 'in_progress',
              description: `Set project stage to 'In Progress'.`
            },
            devMilestone ? {
              type: 'milestone_status',
              milestoneId: devMilestone.id,
              milestoneName: devMilestone.name,
              status: 'in_progress',
              description: `Activate '${devMilestone.name}' milestone.`
            } : null
          ].filter(Boolean)
        }
      };
    }

    // 2. Proposal Generation Request
    if (lower.includes('proposal') || lower.includes('draft proposal') || lower.includes('create proposal')) {
      if (!activeProject) {
        return {
          reply: "Please select a project to draft a client proposal for.",
          requiresApproval: false
        };
      }

      return {
        reply: `I've prepared a comprehensive client proposal draft for **${activeProject.title}** tailored for **${activeClient?.name || 'the client'}**.\n\nKey Highlights:\n- **Scope & Deliverables**: ${activeProject.deliverables?.length || 4} defined deliverables\n- **Timeline**: ${activeProject.timelineWeeks || 3} weeks across ${activeProject.milestones?.length || 5} milestones\n- **Investment**: ${currency}${Number(activeProject.budget || 25000).toLocaleString()}\n\nWould you like me to save this proposal draft to your Document Library?`,
        requiresApproval: true,
        proposedAction: {
          id: `act_${Date.now()}`,
          tool: 'createProposalDraft',
          label: 'Generate & Save Client Proposal',
          projectId: activeProject.id,
          projectTitle: activeProject.title,
          payload: {
            title: `Proposal — ${activeProject.title}`,
            clientId: activeProject.clientId,
            clientName: activeClient?.name || 'Olive & Ember Bistro',
            totalBudget: activeProject.budget || 25000,
            currency: currency,
            timelineWeeks: activeProject.timelineWeeks || 3,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          changes: [
            {
              type: 'document_creation',
              docType: 'proposal',
              description: `Create Proposal document '${activeProject.title} — Client Agreement' with structured pricing and timeline.`
            }
          ]
        }
      };
    }

    // 3. Invoice Generation Request
    if (lower.includes('invoice') || lower.includes('bill') || lower.includes('payment request')) {
      if (!activeProject) {
        return {
          reply: "Please select a project to generate an invoice draft.",
          requiresApproval: false
        };
      }

      const invAmount = activeProject.budget ? Math.round(activeProject.budget * 0.5) : 12500;
      return {
        reply: `I have prepared a Milestone Invoice draft for **${activeProject.title}**.\n\n- **Invoice Type**: Milestone 1 / Advance (50%)\n- **Amount**: ${currency}${invAmount.toLocaleString()}\n- **Client**: ${activeClient?.name || 'Client'}\n- **Due Date**: 14 days from issue\n\nReview the invoice draft details below:`,
        requiresApproval: true,
        proposedAction: {
          id: `act_${Date.now()}`,
          tool: 'createInvoiceDraft',
          label: 'Create Invoice Draft',
          projectId: activeProject.id,
          projectTitle: activeProject.title,
          payload: {
            invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
            clientId: activeProject.clientId,
            clientName: activeClient?.name || 'Client',
            amount: invAmount,
            currency: currency,
            lineItems: [
              {
                description: `${activeProject.title} — Phase 1 Discovery & Initial Design Deliverables`,
                quantity: 1,
                rate: invAmount,
                total: invAmount
              }
            ],
            dueDays: 14
          },
          changes: [
            {
              type: 'invoice_creation',
              description: `Create Draft Invoice for ${currency}${invAmount.toLocaleString()} linked to ${activeProject.title}.`
            }
          ]
        }
      };
    }

    // 4. Client Email Drafting Intent
    if (lower.includes('email') || lower.includes('update the client') || lower.includes('tell the client') || lower.includes('write an update')) {
      if (!activeProject) {
        return {
          reply: "Please select a project to draft a contextual client communication.",
          requiresApproval: false
        };
      }

      const isDesign = lower.includes('design') || lower.includes('ready') || lower.includes('homepage');
      const subject = isDesign
        ? `Design Deliverables Ready for Review — ${activeProject.title}`
        : `Project Progress Update — ${activeProject.title}`;

      const emailBody = isDesign
        ? `Hi ${activeClient?.contactPerson || activeClient?.name?.split(' ')[0] || 'there'},\n\nI'm pleased to share that the initial visual designs and homepage prototype for ${activeProject.title} are now ready for your review.\n\nWe've incorporated the brand palette and key requirements (menu navigation, reservation flow, and contact touchpoints).\n\nPlease take a look at the attached preview when you have a moment and share any feedback or approval so we can proceed smoothly to the development phase.\n\nWarm regards,\n${studioProfile?.name || 'Northstar Creative'}`
        : `Hi ${activeClient?.contactPerson || activeClient?.name?.split(' ')[0] || 'there'},\n\nHere is a quick status update on ${activeProject.title}. We are currently on track with all milestone deliverables.\n\nEverything is proceeding according to our scheduled timeline. Let me know if you have any questions in the meantime!\n\nBest regards,\n${studioProfile?.name || 'Northstar Creative'}`;

      return {
        reply: `Here is a drafted client update for **${activeClient?.name || 'the client'}** based on current project progress:\n\n**Subject:** ${subject}\n\n\`\`\`text\n${emailBody}\n\`\`\`\n\nYou can copy this text directly or have me save it to the project's Communication Studio.`,
        requiresApproval: false,
        emailDraft: {
          subject,
          body: emailBody,
          tone: 'friendly',
          projectId: activeProject.id
        }
      };
    }

    // 5. Query / Summary of Projects & Deadlines
    if (lower.includes('deadlines') || lower.includes('overdue') || lower.includes('attention') || lower.includes('summary') || lower.includes('status')) {
      const allTasks = projects.flatMap(p => (p.tasks || []).map(t => ({ ...t, projectTitle: p.title })));
      const openTasks = allTasks.filter(t => t.status !== 'done');
      const activeProjectsCount = projects.filter(p => p.status === 'in_progress' || p.status === 'review').length;

      return {
        reply: `### Studio Workspace Status\n\n- **Active Projects in Flight**: ${activeProjectsCount}\n- **Open Tasks Across Studio**: ${openTasks.length}\n- **Immediate Focus**: ${activeProject ? `**${activeProject.title}** (${activeProject.milestones?.find(m => m.status === 'in_progress')?.name || 'Current Milestone'})` : 'Select a project to view milestone details.'}\n\nWould you like me to drill down into **${activeProject?.title || 'active projects'}** or draft a status report?`,
        requiresApproval: false
      };
    }

    // 6. Generic Contextual Assistance
    const activeMilestone = activeProject?.milestones?.find(m => m.status === 'in_progress' || m.status === 'in_review') || activeProject?.milestones?.[0];
    return {
      reply: `You are in **${activeProject ? activeProject.title : 'Workspace Overview'}**.\n\n${activeProject ? `• Client: **${activeClient?.name || 'Active Client'}**\n• Current Milestone: **${activeMilestone?.name || 'Planning'}**\n• Budget: **${currency}${Number(activeProject.budget || 0).toLocaleString()}**\n\nI can help you:` : 'I can help you:'}\n1. **Approve milestones** and advance the project workflow\n2. **Generate a comprehensive proposal** with custom pricing breakdown\n3. **Draft a milestone invoice**\n4. **Compose a polished client email**\n5. **Add or reassign tasks**\n\nWhat would you like to do?`,
      requiresApproval: false
    };
  }

  /**
   * Structured "Brief to Build" Parser
   * Converts raw message or unstructured requirements into an editable project blueprint.
   */
  async parseBriefToBuild({ rawBrief, clientName, budget, currency = '₹', deadlineWeeks }) {
    const text = (rawBrief || '').trim();
    const lower = text.toLowerCase();

    // Extract title
    let title = "Custom Digital Project";
    if (lower.includes("restaurant") || lower.includes("bistro") || lower.includes("cafe")) {
      title = "Modern Restaurant Website & Reservation System";
    } else if (lower.includes("e-commerce") || lower.includes("shop") || lower.includes("store")) {
      title = "E-Commerce Brand Platform & Online Store";
    } else if (lower.includes("portfolio") || lower.includes("architect") || lower.includes("studio")) {
      title = "Architectural Studio Portfolio & Case Studies";
    } else if (lower.includes("app") || lower.includes("mobile") || lower.includes("saas")) {
      title = "Web Application & Customer Portal";
    } else if (lower.includes("brand") || lower.includes("identity") || lower.includes("logo")) {
      title = "Brand Identity & Visual System Redesign";
    }

    // Extract or infer budget
    let detectedBudget = budget || null;
    if (!detectedBudget) {
      const budgetMatch = text.match(/(?:₹|\$|€|£|inr|usd)?\s?([0-9]{2,3}(?:,[0-9]{2,3})*|[0-9]{4,7})/i);
      if (budgetMatch && budgetMatch[1]) {
        detectedBudget = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
      } else {
        detectedBudget = 25000;
      }
    }

    // Extract or infer timeline
    let detectedWeeks = deadlineWeeks || null;
    if (!detectedWeeks) {
      const weeksMatch = text.match(/([0-9]+)\s*(?:week|wk)/i);
      const daysMatch = text.match(/([0-9]+)\s*(?:day)/i);
      const monthsMatch = text.match(/([0-9]+)\s*(?:month)/i);

      if (weeksMatch) detectedWeeks = parseInt(weeksMatch[1], 10);
      else if (daysMatch) detectedWeeks = Math.ceil(parseInt(daysMatch[1], 10) / 7);
      else if (monthsMatch) detectedWeeks = parseInt(monthsMatch[1], 10) * 4;
      else detectedWeeks = 3;
    }

    // Extract requirements & deliverables
    const requirements = [
      "Responsive, high-performance web architecture across desktop and mobile",
      "Interactive menu display with dietary tags and high-res imagery",
      "Online table reservation / booking request workflow with confirmation",
      "Location map, operating hours, and direct contact touchpoints",
      "Search Engine Optimization (SEO) and fast initial load speeds"
    ];

    const deliverables = [
      "Figma UI wireframes and visual design mockups",
      "Complete responsive frontend codebase",
      "Interactive reservation inquiry form integration",
      "Domain DNS connection and production deployment handover"
    ];

    // Structured milestones & tasks
    const milestones = [
      {
        id: `m1_${Date.now()}`,
        name: "01 Discovery & Architecture",
        description: "Requirements finalization, content architecture, and tech setup.",
        durationWeeks: 0.5,
        status: "in_progress",
        approvalStatus: "approved",
        tasks: [
          { id: `t1_${Date.now()}`, title: "Client intake review & asset collection", status: "done", priority: "high", estimatedHours: 4 },
          { id: `t2_${Date.now()}`, title: "Sitemap and content wireframing", status: "in_progress", priority: "medium", estimatedHours: 6 }
        ]
      },
      {
        id: `m2_${Date.now()}`,
        name: "02 Visual Design & Prototype",
        description: "Homepage layout, typography, color system, and menu styling.",
        durationWeeks: 1,
        status: "pending",
        approvalStatus: "unapproved",
        tasks: [
          { id: `t3_${Date.now()}`, title: "Homepage desktop & mobile responsive UI mockups", status: "todo", priority: "high", estimatedHours: 12 },
          { id: `t4_${Date.now()}`, title: "Interactive menu and reservation form prototypes", status: "todo", priority: "medium", estimatedHours: 8 }
        ]
      },
      {
        id: `m3_${Date.now()}`,
        name: "03 Frontend Development",
        description: "Building responsive components, menu filters, and animations.",
        durationWeeks: 1,
        status: "pending",
        approvalStatus: "unapproved",
        tasks: [
          { id: `t5_${Date.now()}`, title: "Core responsive layout & navigation build", status: "todo", priority: "high", estimatedHours: 14 },
          { id: `t6_${Date.now()}`, title: "Reservation booking workflow & email triggers", status: "todo", priority: "high", estimatedHours: 10 }
        ]
      },
      {
        id: `m4_${Date.now()}`,
        name: "04 Client Review & QA",
        description: "Cross-browser testing, content audit, and client revisions.",
        durationWeeks: 0.5,
        status: "pending",
        approvalStatus: "unapproved",
        tasks: [
          { id: `t7_${Date.now()}`, title: "Cross-device responsiveness & speed audit", status: "todo", priority: "medium", estimatedHours: 5 },
          { id: `t8_${Date.now()}`, title: "Incorporate client review feedback", status: "todo", priority: "high", estimatedHours: 6 }
        ]
      },
      {
        id: `m5_${Date.now()}`,
        name: "05 Launch & Handover",
        description: "Domain deployment, DNS configuration, and documentation.",
        durationWeeks: 0.5,
        status: "pending",
        approvalStatus: "unapproved",
        tasks: [
          { id: `t9_${Date.now()}`, title: "Production hosting & custom domain SSL setup", status: "todo", priority: "high", estimatedHours: 4 },
          { id: `t10_${Date.now()}`, title: "Final handover documentation & training video", status: "todo", priority: "low", estimatedHours: 3 }
        ]
      }
    ];

    // Identify missing information / assumptions
    const missingInfo = [];
    const assumptions = [
      `Suggested timeline: ${detectedWeeks} weeks based on standard scope. Confirm before adding as hard deadline.`,
      `Budget set to ${currency}${Number(detectedBudget).toLocaleString()}. Can be adjusted in blueprint.`,
      "Client will provide high-resolution photography and approved menu text copy."
    ];

    if (!rawBrief.toLowerCase().includes('brand') && !rawBrief.toLowerCase().includes('logo')) {
      missingInfo.push("Brand assets (Vector logo, color hex codes, brand guidelines).");
    }
    if (!rawBrief.toLowerCase().includes('domain') && !rawBrief.toLowerCase().includes('host')) {
      missingInfo.push("Existing domain credentials or hosting provider preferences.");
    }

    return {
      title,
      clientName: clientName || "Olive & Ember Bistro",
      brief: rawBrief,
      budget: detectedBudget,
      currency,
      timelineWeeks: detectedWeeks,
      requirements,
      deliverables,
      milestones,
      assumptions,
      missingInfo,
      risks: [
        "Delays in receiving menu photography may affect Phase 2 Visual Design completion.",
        "Third-party reservation widget API availability."
      ]
    };
  }
}
