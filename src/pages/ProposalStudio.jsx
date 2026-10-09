import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { exportElementToPDF } from '../utils/pdfExport';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Calendar,
  DollarSign,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';

export function ProposalStudio() {
  const { proposals, activeProject, clients, updateProposal, createProposal, showToast } = useWorkspace();
  const { studio } = useAuth();

  const [selectedProposalId, setSelectedProposalId] = useState(() => proposals[0]?.id || null);
  const activeProposal = proposals.find(p => p.id === selectedProposalId) || proposals[0];

  // Proposal form / document state
  const [title, setTitle] = useState(activeProposal?.title || 'Client Agreement & Project Scope');
  const [overview, setOverview] = useState(activeProposal?.overview || 'Comprehensive project scope and commercial terms.');
  const [scope, setScope] = useState(activeProposal?.scope || [
    'Brand design and digital architecture',
    'Responsive web application development',
    'Hosting deployment and handover guide'
  ]);
  const [deliverables, setDeliverables] = useState(activeProposal?.deliverables || [
    'Interactive Figma prototype',
    'Production-grade codebase',
    '14-day post-launch support'
  ]);
  const [pricingItems, setPricingItems] = useState(activeProposal?.pricingItems || [
    { description: 'Phase 1: Discovery & Wireframing', amount: 6000 },
    { description: 'Phase 2: Visual Design & Prototyping', amount: 8000 },
    { description: 'Phase 3: Frontend Web Development', amount: 8000 },
    { description: 'Phase 4: Launch & Handover Documentation', amount: 3000 }
  ]);
  const [paymentSchedule, setPaymentSchedule] = useState(activeProposal?.paymentSchedule || '50% Advance on project kickoff, 50% upon final delivery.');
  const [terms, setTerms] = useState(activeProposal?.terms || 'Includes two revision rounds per phase. Final assets delivered upon invoice settlement.');
  const [validUntil, setValidUntil] = useState(activeProposal?.validUntil || '2026-10-31');

  // Auto calculate total
  const calculatedTotal = pricingItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  const handleAddPricingItem = () => {
    setPricingItems(prev => [...prev, { description: 'New Scope Phase / Deliverable', amount: 5000 }]);
  };

  const handleUpdatePricingItem = (idx, field, value) => {
    setPricingItems(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: field === 'amount' ? Number(value) : value };
      return copy;
    });
  };

  const handleRemovePricingItem = (idx) => {
    setPricingItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveProposal = () => {
    if (activeProposal) {
      updateProposal(activeProposal.id, {
        title,
        overview,
        scope,
        deliverables,
        pricingItems,
        totalBudget: calculatedTotal,
        paymentSchedule,
        terms,
        validUntil
      });
      showToast('Proposal Saved', 'All revisions saved to document library.');
    }
  };

  const handleExportPDF = () => {
    exportElementToPDF('proposal-document-sheet', `${(activeProposal?.title || 'proposal').replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-atelier pb-4">
        <div>
          <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">
            Document Atelier
          </span>
          <h1 className="text-2xl sm:text-3xl text-ink font-bold tracking-tight mt-0.5">
            Proposal Studio
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-warmGrey/60 text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-atelier transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4 py-2 bg-ink text-paper hover:bg-ink/90 font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
          >
            <Download className="w-3.5 h-3.5 text-chartreuse" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleSaveProposal}
            className="flex items-center gap-1.5 px-4 py-2 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Main Document Layout: Editorial Typeset Proposal */}
      <div className="max-w-4xl mx-auto">
        <div
          id="proposal-document-sheet"
          className="paper-sheet p-8 sm:p-14 rounded-2xl bg-white border border-atelier shadow-sheet space-y-10 text-ink"
        >
          {/* Document Header: Studio & Client Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8 border-b-2 border-ink pb-8">
            <div className="space-y-1">
              <span className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink/60">
                {studio?.name || 'NORTHSTAR CREATIVE'}
              </span>
              <div className="text-xs text-ink/70 font-mono-meta">
                {studio?.tagline || 'Independent Digital Product Atelier'}
              </div>
              <div className="text-xs text-ink/70 font-mono-meta">{studio?.email} • {studio?.location || 'Bangalore'}</div>
            </div>

            <div className="text-left sm:text-right space-y-1 font-mono-meta text-xs">
              <div className="font-bold uppercase text-ink">{activeProposal?.proposalNumber || 'PROP-2026-08'}</div>
              <div className="text-ink/60">Date: {activeProposal?.createdAt || '2026-10-01'}</div>
              <div className="text-ink/60">Valid Until: {validUntil}</div>
            </div>
          </div>

          {/* Proposal Prepared For */}
          <div className="p-4 rounded-xl bg-paper-light border border-atelier flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono-meta uppercase tracking-widest text-ink/50">PREPARED FOR</span>
              <div className="font-editorial text-2xl font-bold text-ink mt-0.5">
                {activeProposal?.clientName || 'Olive & Ember Bistro'}
              </div>
            </div>
            <span className="px-3 py-1 bg-chartreuse text-ink font-mono-meta text-xs uppercase font-bold rounded border border-ink self-start sm:self-auto">
              Fixed Scope Agreement
            </span>
          </div>

          {/* Title & Overview Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono-meta uppercase tracking-wider text-ink/40">Proposal Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl sm:text-3xl text-ink font-bold border-b border-dashed border-ink/30 focus:outline-none focus:border-ink bg-transparent mt-1"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-meta uppercase tracking-wider text-ink/40">Executive Overview</label>
              <textarea
                rows={3}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                className="w-full text-sm text-ink/80 leading-relaxed border-b border-dashed border-ink/20 focus:outline-none focus:border-ink bg-transparent mt-1 resize-none"
              />
            </div>
          </div>

          {/* Scope of Work */}
          <div className="space-y-3 pt-4 border-t border-atelier">
            <h3 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink">
              01 / Scope of Work & Deliverables
            </h3>
            <div className="space-y-2">
              {scope.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-ink/80">
                  <span className="font-mono-meta text-ink/40 mt-0.5">0{idx + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newScope = [...scope];
                      newScope[idx] = e.target.value;
                      setScope(newScope);
                    }}
                    className="flex-1 bg-transparent border-b border-transparent hover:border-atelier focus:border-ink focus:outline-none py-0.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown (Interactive Table) */}
          <div className="space-y-4 pt-4 border-t border-atelier">
            <div className="flex items-center justify-between">
              <h3 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink">
                02 / Commercial Investment Breakdown
              </h3>
              <button
                type="button"
                onClick={handleAddPricingItem}
                className="text-xs font-mono-meta uppercase text-ink/70 hover:text-ink flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Line Item</span>
              </button>
            </div>

            <div className="border border-atelier rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-paper-light border-b border-atelier font-mono-meta uppercase text-[10px] text-ink/60">
                  <tr>
                    <th className="p-3">Phase / Deliverable Description</th>
                    <th className="p-3 text-right w-36">Investment ({activeProposal?.currency || '₹'})</th>
                    <th className="p-3 w-12 no-print"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-atelier">
                  {pricingItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-warmGrey/20">
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdatePricingItem(idx, 'description', e.target.value)}
                          className="w-full bg-transparent focus:outline-none font-medium text-ink"
                        />
                      </td>
                      <td className="p-3 text-right">
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleUpdatePricingItem(idx, 'amount', e.target.value)}
                          className="w-24 text-right bg-transparent focus:outline-none font-mono-meta font-bold text-ink"
                        />
                      </td>
                      <td className="p-3 text-right no-print">
                        <button
                          type="button"
                          onClick={() => handleRemovePricingItem(idx)}
                          className="text-ink/30 hover:text-terracotta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-paper-light border-t-2 border-ink font-mono-meta">
                  <tr>
                    <td className="p-4 font-bold text-xs uppercase text-ink">Total Agreed Investment</td>
                    <td className="p-4 text-right font-bold text-sm text-ink">
                      {activeProposal?.currency || '₹'}{calculatedTotal.toLocaleString()}
                    </td>
                    <td className="no-print"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment Schedule & Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-atelier text-xs">
            <div className="space-y-1.5">
              <span className="font-mono-meta text-[11px] uppercase tracking-wider font-bold text-ink">
                Payment Schedule
              </span>
              <textarea
                rows={2}
                value={paymentSchedule}
                onChange={(e) => setPaymentSchedule(e.target.value)}
                className="w-full bg-transparent border border-atelier rounded-lg p-2.5 text-ink/80 focus:outline-none focus:border-ink resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <span className="font-mono-meta text-[11px] uppercase tracking-wider font-bold text-ink">
                Terms & Revision Policy
              </span>
              <textarea
                rows={2}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full bg-transparent border border-atelier rounded-lg p-2.5 text-ink/80 focus:outline-none focus:border-ink resize-none"
              />
            </div>
          </div>

          {/* Signatures & Acceptance */}
          <div className="pt-8 border-t-2 border-ink grid grid-cols-2 gap-8 text-xs font-mono-meta">
            <div className="space-y-6">
              <div className="text-ink/60 uppercase">For Northstar Creative:</div>
              <div className="border-b border-ink/40 pb-1 font-editorial text-xl italic text-ink">
                {studio?.ownerName || 'Nishant Puthran'}
              </div>
              <div className="text-[10px] text-ink/50">Authorized Studio Principal</div>
            </div>

            <div className="space-y-6">
              <div className="text-ink/60 uppercase">Client Acceptance:</div>
              <div className="border-b border-ink/40 pb-1 font-editorial text-xl text-ink/40 italic">
                {activeProposal?.clientName}
              </div>
              <div className="text-[10px] text-ink/50">Authorized Client Representative</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
