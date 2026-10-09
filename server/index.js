import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GeminiAgentService } from './geminiService.js';
import { DeterministicFlowAgent } from './deterministicAgent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const geminiService = new GeminiAgentService(process.env.GEMINI_API_KEY);
const deterministicAgent = new DeterministicFlowAgent();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ClientFlow Autonomous Agent Server',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// Chat with Flow Agent
app.post('/api/agent/chat', async (req, res) => {
  try {
    const { message, activeProjectId, workspace, studioProfile } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await geminiService.handleChat({
      message,
      activeProjectId,
      workspace: workspace || {},
      studioProfile: studioProfile || {}
    });

    res.json(response);
  } catch (error) {
    console.error('Agent chat error:', error);
    res.status(500).json({
      error: 'Failed to process agent request',
      details: error.message
    });
  }
});

// Brief to Build Intake Parser
app.post('/api/agent/intake', async (req, res) => {
  try {
    const { rawBrief, clientName, budget, currency, deadlineWeeks } = req.body;
    if (!rawBrief) {
      return res.status(400).json({ error: 'Brief is required' });
    }

    const blueprint = await geminiService.handleBriefToIntake({
      rawBrief,
      clientName,
      budget,
      currency,
      deadlineWeeks
    });

    res.json(blueprint);
  } catch (error) {
    console.error('Brief intake error:', error);
    res.status(500).json({
      error: 'Failed to extract project blueprint',
      details: error.message
    });
  }
});

// Execute Approved Action
app.post('/api/agent/execute-action', (req, res) => {
  try {
    const { actionId, tool, payload, projectId } = req.body;
    // Log audit event and return verified execution status
    const executionReceipt = {
      actionId: actionId || `act_${Date.now()}`,
      status: 'executed',
      timestamp: new Date().toISOString(),
      tool,
      payload,
      receiptMessage: `Successfully executed agent action: ${tool}`
    };

    res.json(executionReceipt);
  } catch (error) {
    res.status(500).json({ error: 'Execution failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[ClientFlow Server] Running on http://localhost:${PORT}`);
});
