import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PROJECTS,
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
  INITIAL_PROPOSALS,
  INITIAL_DOCUMENTS,
  INITIAL_ACTIVITY,
  INITIAL_STUDIO
} from '../data/initialData';
import { executeAgentActionAPI } from '../services/agentApi';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  // 1. Projects State
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('clientflow_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PROJECTS;
  });

  // 2. Clients State
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('clientflow_clients');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CLIENTS;
  });

  // 3. Invoices State
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('clientflow_invoices');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_INVOICES;
  });

  // 4. Proposals State
  const [proposals, setProposals] = useState(() => {
    const saved = localStorage.getItem('clientflow_proposals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_PROPOSALS;
  });

  // 5. Documents State
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('clientflow_documents');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_DOCUMENTS;
  });

  // 6. Activity Log
  const [activity, setActivity] = useState(() => {
    const saved = localStorage.getItem('clientflow_activity');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ACTIVITY;
  });

  // Active Selected Project ID (defaults to primary active project)
  const [activeProjectId, setActiveProjectId] = useState(() => {
    return projects[0]?.id || 'proj_restaurant';
  });

  // UI Drawers & Modals
  const [isFlowAgentOpen, setIsFlowAgentOpen] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Agent Chat & Human Approval Queue
  const [pendingAction, setPendingAction] = useState(null);
  const [agentMessages, setAgentMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'agent',
      text: "Welcome to your Flow Agent. I'm actively tracking your projects, deadlines, and milestone approvals. You can ask me to draft client proposals, approve milestone work, create invoices, or turn raw client briefs into structured blueprints.",
      timestamp: new Date().toISOString()
    }
  ]);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // LocalStorage sync
  useEffect(() => {
    localStorage.setItem('clientflow_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('clientflow_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('clientflow_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('clientflow_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('clientflow_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('clientflow_activity', JSON.stringify(activity));
  }, [activity]);

  // Derived Active Project
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  // Toast Dispatcher
  const showToast = (title, message, type = 'success') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Activity Logger
  const logActivity = (item) => {
    const entry = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...item
    };
    setActivity(prev => [entry, ...prev]);
  };

  // --- Project Operations ---
  const createProject = (projectData) => {
    const newProject = {
      id: `proj_${Date.now()}`,
      projectNumber: `PRJ-${String(projects.length + 1).padStart(3, '0')}`,
      completionPercentage: 0,
      status: 'planning',
      milestones: [],
      tasks: [],
      notes: [],
      ...projectData
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    logActivity({
      type: 'project_created',
      title: `Project created: ${newProject.title}`,
      description: `New project registered for client ${newProject.clientName || 'Client'}.`,
      projectId: newProject.id
    });
    showToast('Project Created', `"${newProject.title}" has been added to your workspace.`);
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, ...updates };
      }
      return p;
    }));
  };

  const deleteProject = (projectId) => {
    const proj = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      const remaining = projects.filter(p => p.id !== projectId);
      setActiveProjectId(remaining[0]?.id || null);
    }
    showToast('Project Archived', `Project "${proj?.title}" removed.`);
  };

  // --- Task Operations ---
  const updateTask = (projectId, taskId, updates) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedTasks = (p.tasks || []).map(t => {
        if (t.id === taskId) {
          return { ...t, ...updates };
        }
        return t;
      });

      // Recalculate milestone task counts & project completion percentage
      const totalTasks = updatedTasks.length;
      const doneTasks = updatedTasks.filter(t => t.status === 'done').length;
      const completionPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : p.completionPercentage;

      const updatedMilestones = (p.milestones || []).map(m => {
        const mTasks = updatedTasks.filter(t => t.milestoneId === m.id);
        const mDone = mTasks.filter(t => t.status === 'done').length;
        return {
          ...m,
          taskCount: mTasks.length,
          completedTaskCount: mDone
        };
      });

      return {
        ...p,
        tasks: updatedTasks,
        milestones: updatedMilestones,
        completionPercentage
      };
    }));
  };

  const createTask = (projectId, taskData) => {
    const newTask = {
      id: `tsk_${Date.now()}`,
      status: 'todo',
      priority: 'medium',
      estimatedHours: 4,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ...taskData
    };

    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedTasks = [...(p.tasks || []), newTask];
      const updatedMilestones = (p.milestones || []).map(m => {
        if (m.id === newTask.milestoneId) {
          return {
            ...m,
            taskCount: (m.taskCount || 0) + 1
          };
        }
        return m;
      });
      return {
        ...p,
        tasks: updatedTasks,
        milestones: updatedMilestones
      };
    }));

    logActivity({
      type: 'task_created',
      title: `Task created: ${newTask.title}`,
      description: `Added to project milestone.`,
      projectId
    });
    showToast('Task Created', newTask.title);
    return newTask;
  };

  const deleteTask = (projectId, taskId) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedTasks = (p.tasks || []).filter(t => t.id !== taskId);
      return { ...p, tasks: updatedTasks };
    }));
  };

  // --- Milestone Operations ---
  const updateMilestone = (projectId, milestoneId, updates) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedMilestones = (p.milestones || []).map(m => {
        if (m.id === milestoneId) {
          return { ...m, ...updates };
        }
        return m;
      });
      return { ...p, milestones: updatedMilestones };
    }));
    logActivity({
      type: 'milestone_update',
      title: `Milestone status updated`,
      description: `Project milestone progress altered.`,
      projectId
    });
  };

  // --- Client Operations ---
  const createClient = (clientData) => {
    const newClient = {
      id: `cli_${Date.now()}`,
      totalProjectValue: 0,
      outstandingBalance: 0,
      status: 'active',
      lastInteraction: new Date().toISOString(),
      ...clientData
    };
    setClients(prev => [newClient, ...prev]);
    showToast('Client Registered', newClient.name);
    return newClient;
  };

  const updateClient = (clientId, updates) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates } : c));
  };

  // --- Invoice Operations ---
  const createInvoice = (invoiceData) => {
    const subtotal = (invoiceData.lineItems || []).reduce((acc, item) => acc + (Number(item.quantity || 1) * Number(item.rate || 0)), 0);
    const taxAmount = invoiceData.taxPercent ? (subtotal * invoiceData.taxPercent) / 100 : 0;
    const discountAmount = Number(invoiceData.discountAmount || 0);
    const total = subtotal + taxAmount - discountAmount;

    const newInvoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 42).padStart(3, '0')}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      subtotal,
      taxAmount,
      discountAmount,
      total,
      amountPaid: 0,
      payments: [],
      ...invoiceData
    };

    setInvoices(prev => [newInvoice, ...prev]);
    
    // Also save in Document Library
    setDocuments(prev => [{
      id: `doc_${newInvoice.id}`,
      type: 'invoice',
      title: `${newInvoice.invoiceNumber} (${newInvoice.currency || '₹'}${newInvoice.total.toLocaleString()})`,
      projectId: newInvoice.projectId,
      clientId: newInvoice.clientId,
      clientName: newInvoice.clientName,
      createdAt: newInvoice.issueDate,
      updatedAt: newInvoice.issueDate,
      status: newInvoice.status
    }, ...prev]);

    logActivity({
      type: 'invoice_created',
      title: `Invoice created: ${newInvoice.invoiceNumber}`,
      description: `Amount: ${newInvoice.currency || '₹'}${newInvoice.total.toLocaleString()} for ${newInvoice.clientName}`,
      projectId: newInvoice.projectId
    });
    showToast('Invoice Created', newInvoice.invoiceNumber);
    return newInvoice;
  };

  const updateInvoice = (invoiceId, updates) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, ...updates } : inv));
  };

  const recordPayment = (invoiceId, { amount, method, reference, date }) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const numAmount = Number(amount);
      const newPaid = (inv.amountPaid || 0) + numAmount;
      const newStatus = newPaid >= inv.total ? 'paid' : 'partially_paid';
      const paymentRecord = {
        id: `pay_${Date.now()}`,
        date: date || new Date().toISOString().split('T')[0],
        amount: numAmount,
        method: method || 'Bank Transfer',
        reference: reference || 'N/A'
      };

      // Also update client outstanding balance
      if (inv.clientId) {
        setClients(cls => cls.map(c => {
          if (c.id === inv.clientId) {
            return {
              ...c,
              outstandingBalance: Math.max(0, (c.outstandingBalance || 0) - numAmount)
            };
          }
          return c;
        }));
      }

      logActivity({
        type: 'payment_received',
        title: `Payment recorded for ${inv.invoiceNumber}`,
        description: `Received ${inv.currency || '₹'}${numAmount.toLocaleString()} via ${method}.`,
        projectId: inv.projectId
      });

      return {
        ...inv,
        amountPaid: newPaid,
        paidDate: newStatus === 'paid' ? paymentRecord.date : inv.paidDate,
        status: newStatus,
        payments: [...(inv.payments || []), paymentRecord]
      };
    }));
    showToast('Payment Recorded', `Amount received: ${amount}`);
  };

  // --- Proposal Operations ---
  const createProposal = (proposalData) => {
    const newProposal = {
      id: `prop_${Date.now()}`,
      proposalNumber: `PROP-${new Date().getFullYear()}-${String(proposals.length + 9).padStart(2, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      ...proposalData
    };
    setProposals(prev => [newProposal, ...prev]);

    // Also add to Document Library
    setDocuments(prev => [{
      id: `doc_${newProposal.id}`,
      type: 'proposal',
      title: newProposal.title,
      projectId: newProposal.projectId,
      clientId: newProposal.clientId,
      clientName: newProposal.clientName,
      createdAt: newProposal.createdAt,
      updatedAt: newProposal.createdAt,
      status: 'draft'
    }, ...prev]);

    logActivity({
      type: 'proposal_created',
      title: `Proposal drafted: ${newProposal.title}`,
      description: `Prepared for ${newProposal.clientName}`,
      projectId: newProposal.projectId
    });
    showToast('Proposal Drafted', newProposal.title);
    return newProposal;
  };

  const updateProposal = (proposalId, updates) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, ...updates } : p));
  };

  // --- Document Operations ---
  const createDocument = (docData) => {
    const newDoc = {
      id: `doc_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...docData
    };
    setDocuments(prev => [newDoc, ...prev]);
    showToast('Document Saved', newDoc.title);
    return newDoc;
  };

  // --- Human Approval & Action Execution ---
  const approvePendingAction = async (action) => {
    if (!action) return;

    try {
      // 1. Send to server for verification
      await executeAgentActionAPI({
        actionId: action.id,
        tool: action.tool,
        payload: action.payload,
        projectId: action.projectId
      });

      // 2. Perform actual application state mutations based on action changes
      if (action.tool === 'batchUpdateProjectWorkflow') {
        const { projectId, changes } = action;
        for (const change of changes) {
          if (change.type === 'task_status' && change.taskId) {
            updateTask(projectId, change.taskId, { status: change.to });
          } else if (change.type === 'milestone_approval' && change.milestoneId) {
            updateMilestone(projectId, change.milestoneId, {
              approvalStatus: change.approvalStatus,
              status: change.status
            });
          } else if (change.type === 'milestone_status' && change.milestoneId) {
            updateMilestone(projectId, change.milestoneId, {
              status: change.status
            });
          } else if (change.type === 'project_status') {
            updateProject(projectId, { status: change.to });
          }
        }
      } else if (action.tool === 'createProposalDraft') {
        const payload = action.payload;
        createProposal({
          title: payload.title,
          projectId: payload.projectId,
          clientId: payload.clientId,
          clientName: payload.clientName,
          totalBudget: payload.totalBudget,
          currency: payload.currency,
          validUntil: payload.validUntil,
          overview: `Comprehensive project agreement and scope for ${payload.clientName}.`,
          scope: [
            'End-to-end design, implementation, and launch',
            'Full responsive device testing and performance optimization'
          ],
          pricingItems: [
            { description: 'Phase 1 Discovery & Architecture', amount: Math.round(payload.totalBudget * 0.25) },
            { description: 'Phase 2 Visual Design & Prototype', amount: Math.round(payload.totalBudget * 0.35) },
            { description: 'Phase 3 Engineering & Deployment', amount: Math.round(payload.totalBudget * 0.4) }
          ],
          paymentSchedule: '50% advance upon commencement, 50% upon delivery.',
          terms: 'Standard studio commercial terms and two revision rounds included.'
        });
      } else if (action.tool === 'createInvoiceDraft') {
        const payload = action.payload;
        createInvoice({
          title: `Milestone Invoice — ${payload.projectTitle || 'Project'}`,
          projectId: payload.projectId,
          clientId: payload.clientId,
          clientName: payload.clientName,
          currency: payload.currency,
          lineItems: payload.lineItems
        });
      }

      // Log execution to activity log
      logActivity({
        type: 'agent_executed',
        title: `Flow Agent executed: ${action.label}`,
        description: `Approved by human operator. Applied ${action.changes?.length || 1} state changes.`,
        projectId: action.projectId
      });

      // Add feedback message in chat
      setAgentMessages(prev => [
        ...prev,
        {
          id: `msg_${Date.now()}`,
          sender: 'agent',
          text: `✅ **Action Approved & Applied Successfully**\n\nI have updated the project records in the database according to the approved plan.`,
          timestamp: new Date().toISOString()
        }
      ]);

      setPendingAction(null);
      showToast('Changes Applied', `Flow Agent executed "${action.label}".`);
    } catch (err) {
      showToast('Action Failed', err.message, 'error');
    }
  };

  const rejectPendingAction = (action) => {
    setPendingAction(null);
    setAgentMessages(prev => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        sender: 'agent',
        text: `Action **${action?.label || 'proposed changes'}** was cancelled by you. No changes were made to your project data.`,
        timestamp: new Date().toISOString()
      }
    ]);
    showToast('Action Cancelled', 'No modifications were made.');
  };

  // Reset to initial rich demo data
  const resetDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setClients(INITIAL_CLIENTS);
    setInvoices(INITIAL_INVOICES);
    setProposals(INITIAL_PROPOSALS);
    setDocuments(INITIAL_DOCUMENTS);
    setActivity(INITIAL_ACTIVITY);
    setActiveProjectId('proj_restaurant');
    localStorage.removeItem('clientflow_projects');
    localStorage.removeItem('clientflow_clients');
    localStorage.removeItem('clientflow_invoices');
    localStorage.removeItem('clientflow_proposals');
    localStorage.removeItem('clientflow_documents');
    localStorage.removeItem('clientflow_activity');
    showToast('Demo Data Restored', 'Northstar Creative demo workspace reset.');
  };

  return (
    <WorkspaceContext.Provider
      value={{
        projects,
        clients,
        invoices,
        proposals,
        documents,
        activity,
        activeProjectId,
        setActiveProjectId,
        activeProject,
        isFlowAgentOpen,
        setIsFlowAgentOpen,
        isBriefModalOpen,
        setIsBriefModalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        pendingAction,
        setPendingAction,
        agentMessages,
        setAgentMessages,
        toasts,
        showToast,
        logActivity,
        createProject,
        updateProject,
        deleteProject,
        updateTask,
        createTask,
        deleteTask,
        updateMilestone,
        createClient,
        updateClient,
        createInvoice,
        updateInvoice,
        recordPayment,
        createProposal,
        updateProposal,
        createDocument,
        approvePendingAction,
        rejectPendingAction,
        resetDemoData
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
