import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { sendAgentChatMessage } from '../services/agentApi';
import { Sparkles, X, Send, Check, Ban, ArrowRight, ShieldCheck, CornerDownLeft, Bot, User, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FlowAgentDrawer() {
  const {
    isFlowAgentOpen,
    setIsFlowAgentOpen,
    activeProject,
    projects,
    clients,
    invoices,
    pendingAction,
    setPendingAction,
    approvePendingAction,
    rejectPendingAction,
    agentMessages,
    setAgentMessages,
    showToast
  } = useWorkspace();

  const { studio } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeClient = activeProject ? clients.find(c => c.id === activeProject.clientId) : null;

  useEffect(() => {
    if (isFlowAgentOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [agentMessages, isFlowAgentOpen, pendingAction]);

  if (!isFlowAgentOpen) return null;

  const handleSendMessage = async (textToSend) => {
    const message = (textToSend || inputText).trim();
    if (!message || isTyping) return;

    setInputText('');

    // Append user message
    const userMsg = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };
    setAgentMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const workspaceContext = {
        projects,
        clients,
        invoices,
        activeProjectId: activeProject?.id
      };

      const response = await sendAgentChatMessage({
        message,
        activeProjectId: activeProject?.id,
        workspace: workspaceContext,
        studioProfile: studio
      });

      setIsTyping(false);

      if (response.reply) {
        const agentMsg = {
          id: `msg_a_${Date.now()}`,
          sender: 'agent',
          text: response.reply,
          timestamp: new Date().toISOString()
        };
        setAgentMessages(prev => [...prev, agentMsg]);
      }

      if (response.requiresApproval && response.proposedAction) {
        setPendingAction(response.proposedAction);
      }
    } catch (err) {
      setIsTyping(false);
      setAgentMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'agent',
          text: "I encountered an error processing that request. Please try again or check your project selection.",
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  const quickPrompts = [
    "The client approved the homepage. Mark that milestone as approved and move to development.",
    "Draft a comprehensive client proposal for this project.",
    "Create a milestone invoice draft for the completed phase.",
    "Write an update telling the client the visual design is ready for review.",
    "Show me projects and deadlines that need attention this week."
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] md:w-[480px] bg-paper border-l border-atelier shadow-2xl flex flex-col justify-between">
      {/* Drawer Header */}
      <div className="p-4 border-b border-atelier bg-paper-light flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-chartreuse text-ink flex items-center justify-center border border-ink shadow-sm">
            <Sparkles className="w-4 h-4 fill-ink" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink">
                Flow Agent
              </h3>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono-meta bg-chartreuse/60 text-ink">
                Autonomous
              </span>
            </div>
            <p className="text-[11px] text-ink/60 font-mono-meta">
              {activeProject ? `Context: ${activeProject.title}` : 'Studio Overview Context'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFlowAgentOpen(false)}
          className="p-1.5 rounded-lg text-ink/50 hover:text-ink hover:bg-warmGrey/60 transition-colors"
          title="Close Agent Drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Context Summary Banner */}
        {activeProject && (
          <div className="p-3 rounded-lg bg-warmGrey/40 border border-atelier text-xs">
            <div className="font-mono-meta uppercase tracking-wider text-[10px] text-ink/50 mb-1">
              Active Project Context
            </div>
            <div className="font-semibold text-ink">{activeProject.title}</div>
            <div className="text-ink/70 text-[11px] mt-0.5">
              Client: {activeClient?.name || 'Client'} • Budget: {activeProject.currency}{Number(activeProject.budget || 0).toLocaleString()} • Health: {activeProject.status.toUpperCase()}
            </div>
          </div>
        )}

        {/* Message Stream */}
        {agentMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-ink text-paper rounded-br-none shadow-sm'
                  : 'bg-white border border-atelier rounded-bl-none text-ink shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
            <span className="text-[10px] font-mono-meta text-ink/40 mt-1 px-1">
              {msg.sender === 'user' ? 'You' : 'Flow Agent'}
            </span>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-atelier max-w-[140px]">
            <span className="w-2 h-2 rounded-full bg-chartreuse animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-chartreuse animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-chartreuse animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-mono-meta text-ink/60 ml-1">Thinking...</span>
          </div>
        )}

        {/* Human Confirmation Proposal Box (Section 12 Safety Loop) */}
        {pendingAction && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="p-4 rounded-xl bg-paper-light border-2 border-ink shadow-atelier space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-atelier">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-ink" />
                <span className="font-mono-meta text-xs uppercase tracking-wider font-bold text-ink">
                  Human Approval Required
                </span>
              </div>
              <span className="text-[10px] font-mono-meta px-1.5 py-0.5 bg-chartreuse text-ink rounded font-semibold">
                Action Proposal
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-ink">{pendingAction.label}</h4>
              <p className="text-xs text-ink/70 mt-0.5">
                The agent wants to execute real changes on project <span className="font-semibold text-ink">"{pendingAction.projectTitle}"</span>:
              </p>
            </div>

            {/* Changes list */}
            {pendingAction.changes && (
              <div className="bg-white rounded-lg p-2.5 border border-atelier space-y-2 text-xs">
                {pendingAction.changes.map((ch, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                    <span className="text-ink/80">{ch.description}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => approvePendingAction(pendingAction)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-sm transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve Changes</span>
              </button>

              <button
                onClick={() => rejectPendingAction(pendingAction)}
                className="py-2 px-3 bg-warmGrey/60 hover:bg-warmGrey text-ink/80 text-xs font-mono-meta uppercase tracking-wider rounded border border-atelier transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Quick Suggestion Chips */}
        {agentMessages.length <= 2 && !pendingAction && (
          <div className="pt-2">
            <div className="text-[10px] font-mono-meta uppercase tracking-widest text-ink/40 mb-2">
              Suggested Quick Prompts
            </div>
            <div className="space-y-1.5">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left p-2.5 rounded-lg bg-white hover:bg-chartreuse/30 border border-atelier text-xs text-ink/80 hover:text-ink transition-colors group flex items-center justify-between"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <ArrowRight className="w-3 h-3 text-ink/30 group-hover:text-ink shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="p-3 border-t border-atelier bg-paper-light">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={activeProject ? `Command agent for ${activeProject.title}...` : "Ask Flow Agent anything..."}
            className="flex-1 px-3 py-2 text-xs sm:text-sm bg-white border border-atelier rounded-lg text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 bg-ink text-chartreuse rounded-lg hover:bg-ink/90 disabled:opacity-40 disabled:cursor-not-allowed border border-ink transition-colors"
            title="Send instruction"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
