import { GoogleGenerativeAI } from '@google/generative-ai';
import { AGENT_TOOLS_DEFINITIONS } from './agentTools.js';
import { DeterministicFlowAgent } from './deterministicAgent.js';

export class GeminiAgentService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.fallbackAgent = new DeterministicFlowAgent();

    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: `You are Flow Agent, an autonomous, intelligent project assistant in ClientFlow — an editorial, creative studio project workspace.
You assist creative freelancers and studios with turning client briefs into structured projects, drafting proposals, tracking milestones, managing tasks, composing client emails, generating invoices, and executing project workflow updates.

CRITICAL RULES:
1. Always base statements on actual workspace data provided in context.
2. For read-only queries (summaries, details), answer directly.
3. For write operations (updating milestone approval, changing project stage, creating tasks, issuing invoices), specify a clear structured proposal so the human freelancer can review and approve it.
4. Maintain an editorial, calm, professional, and encouraging creative studio tone.`
        });
      } catch (err) {
        console.warn('Failed to initialize GoogleGenerativeAI, falling back to deterministic agent:', err.message);
        this.genAI = null;
      }
    }
  }

  async handleChat({ message, activeProjectId, workspace, studioProfile }) {
    this.fallbackAgent.setWorkspace(workspace);

    // If no real API key or failed initialization, use robust deterministic agent
    if (!this.apiKey || !this.model) {
      return this.fallbackAgent.processMessage({ message, activeProjectId, studioProfile });
    }

    try {
      // Find active project & client
      const activeProject = workspace.projects?.find(p => p.id === activeProjectId) || workspace.projects?.[0];
      const activeClient = activeProject ? workspace.clients?.find(c => c.id === activeProject.clientId) : null;

      const contextPrompt = `
CURRENT WORKSPACE CONTEXT:
Studio: ${studioProfile?.name || 'Northstar Creative'} (${studioProfile?.currency || '₹'})
Active Project: ${activeProject ? JSON.stringify({
        id: activeProject.id,
        title: activeProject.title,
        status: activeProject.status,
        budget: activeProject.budget,
        currency: activeProject.currency,
        client: activeClient?.name,
        milestones: activeProject.milestones?.map(m => ({ id: m.id, name: m.name, status: m.status, approvalStatus: m.approvalStatus })),
        taskCount: activeProject.tasks?.length
      }) : 'None selected'}

USER PROMPT: "${message}"

If the user wants to take an action (e.g. mark approved, move stage, create invoice, draft proposal), output the response with a proposed change.
`;

      const result = await this.model.generateContent(contextPrompt);
      const text = result.response.text();

      // Check if user requested an approval/state mutation, supplement with structured proposedAction if appropriate
      const lower = message.toLowerCase();
      if (lower.includes('approved') || lower.includes('move to development') || lower.includes('proposal') || lower.includes('invoice')) {
        const structuredFallback = await this.fallbackAgent.processMessage({ message, activeProjectId, studioProfile });
        if (structuredFallback.proposedAction) {
          return {
            reply: text || structuredFallback.reply,
            requiresApproval: structuredFallback.requiresApproval,
            proposedAction: structuredFallback.proposedAction
          };
        }
      }

      return {
        reply: text,
        requiresApproval: false
      };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to deterministic response:', err.message);
      return this.fallbackAgent.processMessage({ message, activeProjectId, studioProfile });
    }
  }

  async handleBriefToIntake({ rawBrief, clientName, budget, currency, deadlineWeeks }) {
    // If Gemini is available, we can also parse or supplement, but deterministic structured blueprint is 100% schema compliant
    return this.fallbackAgent.parseBriefToBuild({ rawBrief, clientName, budget, currency, deadlineWeeks });
  }
}
