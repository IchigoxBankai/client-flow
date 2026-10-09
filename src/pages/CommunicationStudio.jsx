import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Copy,
  Check,
  Sparkles,
  Send,
  Save,
  RotateCcw,
  Layers,
  FileText
} from 'lucide-react';

export function CommunicationStudio() {
  const { projects, clients, activeProject, activeProjectId, setActiveProjectId, createDocument, showToast } = useWorkspace();
  const { studio } = useAuth();

  const [selectedProjectId, setSelectedProjectId] = useState(activeProject?.id || projects[0]?.id || '');
  const [template, setTemplate] = useState('feedback_request');
  const [tone, setTone] = useState('friendly'); // 'professional' | 'friendly' | 'concise'
  const [customPrompt, setCustomPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const currentProject = projects.find(p => p.id === selectedProjectId) || activeProject || projects[0];
  const currentClient = currentProject ? clients.find(c => c.id === currentProject.clientId) : clients[0];

  // Dynamic Email Generation Engine based on real project state & selected tone
  const getSubjectAndBody = () => {
    const clientName = currentClient?.contactPerson || currentClient?.name || 'Client';
    const projTitle = currentProject?.title || 'Project';
    const studioName = studio?.name || 'Northstar Creative';

    if (template === 'kickoff') {
      return {
        subject: `Kickoff & Project Roadmap — ${projTitle}`,
        body: tone === 'concise'
          ? `Hi ${clientName},\n\nWe are officially kicking off ${projTitle}. Milestone 1 Discovery starts today. Target deadline is ${currentProject?.deadline || 'in 3 weeks'}.\n\nLooking forward to building this together.\n\nBest,\n${studioName}`
          : tone === 'professional'
          ? `Dear ${clientName},\n\nWe are pleased to confirm commencement of ${projTitle}. All initial assets have been cataloged and Milestone 01 Discovery & Content Architecture is underway.\n\nWe will provide our next milestone progress update on schedule. Please find the project timeline and deliverables roadmap in your client portal.\n\nSincerely,\n${studio?.ownerName || 'Studio Principal'}\n${studioName}`
          : `Hi ${clientName},\n\nExcited to kick off ${projTitle} today! We're starting with the discovery phase and content structure.\n\nWe'll keep you closely updated on our progress as we move into visual design next week. Feel free to reach out anytime if anything comes up!\n\nWarm regards,\n${studio?.ownerName || 'Nishant'}\n${studioName}`
      };
    }

    if (template === 'feedback_request') {
      return {
        subject: `Visual Design Ready for Review — ${projTitle}`,
        body: tone === 'concise'
          ? `Hi ${clientName},\n\nThe homepage and menu interactive prototypes for ${projTitle} are ready for your review: https://figma.com/preview/${currentProject?.id}\n\nPlease share your feedback or signoff by Friday.\n\nThanks,\n${studioName}`
          : tone === 'professional'
          ? `Dear ${clientName},\n\nWe have completed Phase 02 Visual Design & Wireframes for ${projTitle}. The interactive responsive mockups incorporating your brand requirements are now available for review.\n\nKindly inspect the layouts and let us know if any revisions are needed, or if we have your approval to proceed into frontend development.\n\nBest regards,\n${studio?.ownerName || 'Studio Principal'}\n${studioName}`
          : `Hi ${clientName},\n\nGreat news — the initial visual design and interactive prototype for ${projTitle} is ready for you to explore!\n\nWe've incorporated the warm color palette and menu structure we discussed. Please take a look at the preview when you have a moment and let us know your thoughts so we can start coding the build.\n\nBest,\n${studio?.ownerName || 'Nishant'}\n${studioName}`
      };
    }

    if (template === 'payment_reminder') {
      return {
        subject: `Invoice Follow-Up & Settlement — ${projTitle}`,
        body: tone === 'concise'
          ? `Hi ${clientName},\n\nQuick reminder regarding the outstanding milestone invoice for ${projTitle}. Please settle at your earliest convenience.\n\nThank you,\n${studioName}`
          : tone === 'professional'
          ? `Dear ${clientName},\n\nThis is a courteous reminder regarding the outstanding balance for ${projTitle}. Please review the attached invoice receipt and confirm settlement via UPI or bank transfer.\n\nThank you for your prompt attention.\n\nSincerely,\n${studioName} Accounts`
          : `Hi ${clientName},\n\nHope you're having a great week! Just following up on the recent milestone invoice for ${projTitle}. Please let me know once you've had a chance to process it, or if you need any additional invoice details.\n\nThanks a lot,\n${studio?.ownerName || 'Nishant'}`
      };
    }

    // Default Progress Update
    return {
      subject: `Project Progress Update — ${projTitle}`,
      body: `Hi ${clientName},\n\nHere is a quick update on ${projTitle}. We are currently ${currentProject?.completionPercentage || 45}% complete and on track for delivery by ${currentProject?.deadline || 'next week'}.\n\nEverything is progressing smoothly. Let me know if you have any questions!\n\nBest,\n${studioName}`
    };
  };

  const emailDraft = getSubjectAndBody();
  const [subject, setSubject] = useState(emailDraft.subject);
  const [body, setBody] = useState(emailDraft.body);

  const handleTemplateChange = (tmpl) => {
    setTemplate(tmpl);
    const updated = getSubjectAndBody();
    setSubject(updated.subject);
    setBody(updated.body);
  };

  const handleToneChange = (newTone) => {
    setTone(newTone);
    const updated = getSubjectAndBody();
    setSubject(updated.subject);
    setBody(updated.body);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    showToast('Copied to Clipboard', 'Email subject and body copied.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDocuments = () => {
    createDocument({
      type: 'email',
      title: subject,
      projectId: currentProject?.id,
      clientId: currentClient?.id,
      clientName: currentClient?.name,
      status: 'draft',
      content: `Subject: ${subject}\n\n${body}`
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-atelier pb-4">
        <div>
          <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">
            Client Relations
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-ink font-normal tracking-tight mt-0.5">
            Client Communication Studio
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSaveToDocuments}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-warmGrey/60 text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-atelier transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Docs</span>
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center gap-1.5 px-4 py-2 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Context & Template Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Target Project Selector */}
          <div className="p-4 rounded-xl bg-paper-light border border-atelier space-y-2">
            <label className="block font-mono-meta text-[11px] uppercase tracking-wider text-ink/70 font-bold">
              Target Project Context
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setActiveProjectId(e.target.value);
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded text-ink focus:outline-none"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.clientName})
                </option>
              ))}
            </select>
          </div>

          {/* Tone Selector (Section 15) */}
          <div className="p-4 rounded-xl bg-paper-light border border-atelier space-y-3">
            <label className="block font-mono-meta text-[11px] uppercase tracking-wider text-ink/70 font-bold">
              Communication Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'friendly', label: 'Friendly' },
                { key: 'professional', label: 'Formal' },
                { key: 'concise', label: 'Concise' }
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => handleToneChange(t.key)}
                  className={`p-2 text-center rounded border text-xs font-mono-meta uppercase transition-all ${
                    tone === t.key
                      ? 'bg-ink text-chartreuse font-bold border-ink shadow-sm'
                      : 'bg-white border-atelier text-ink/70 hover:border-ink/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Templates */}
          <div className="p-4 rounded-xl bg-paper-light border border-atelier space-y-2">
            <label className="block font-mono-meta text-[11px] uppercase tracking-wider text-ink/70 font-bold">
              Email Scenarios
            </label>
            <div className="space-y-1.5">
              {[
                { key: 'feedback_request', label: 'Visual Design Ready for Review' },
                { key: 'kickoff', label: 'Project Kickoff & Roadmap' },
                { key: 'progress', label: 'Mid-Sprint Progress Check' },
                { key: 'payment_reminder', label: 'Invoice Settlement Follow-up' }
              ].map((tmpl) => (
                <button
                  key={tmpl.key}
                  type="button"
                  onClick={() => handleTemplateChange(tmpl.key)}
                  className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
                    template === tmpl.key
                      ? 'bg-chartreuse text-ink font-semibold border border-ink shadow-sm'
                      : 'bg-white border border-atelier text-ink/80 hover:bg-warmGrey/40'
                  }`}
                >
                  {tmpl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: The Typeset Email Sheet (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="paper-sheet p-6 sm:p-10 rounded-2xl bg-white border border-atelier shadow-sheet space-y-6">
            <div className="flex items-center justify-between border-b border-atelier pb-3 text-xs font-mono-meta text-ink/60">
              <span>Recipient: <strong>{currentClient?.email}</strong></span>
              <span className="uppercase">{tone} Tone</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono-meta text-[10px] uppercase text-ink/50 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full font-editorial text-2xl text-ink font-semibold border-b border-dashed border-ink/30 focus:outline-none focus:border-ink bg-transparent py-1"
                />
              </div>

              <div>
                <label className="block font-mono-meta text-[10px] uppercase text-ink/50 mb-1">
                  Message Body
                </label>
                <textarea
                  rows={12}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full text-sm text-ink leading-relaxed font-sans border-0 focus:outline-none bg-paper-light/30 p-4 rounded-xl border border-atelier resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-atelier flex items-center justify-between text-xs font-mono-meta text-ink/50">
              <span>Ready to paste into your preferred email client</span>
              <button
                onClick={handleCopyToClipboard}
                className="text-ink font-bold hover:underline flex items-center gap-1"
              >
                Copy Full Email <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
