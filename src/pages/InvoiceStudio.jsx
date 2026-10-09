import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { RecordPaymentModal } from '../components/RecordPaymentModal';
import { exportElementToPDF } from '../utils/pdfExport';
import {
  Receipt,
  Plus,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Trash2,
  Check,
  Send,
  ArrowRight
} from 'lucide-react';

export function InvoiceStudio() {
  const { invoices, projects, clients, createInvoice, updateInvoice, showToast } = useWorkspace();
  const { studio } = useAuth();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(() => invoices[0]?.id || null);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const activeInvoice = invoices.find(i => i.id === selectedInvoiceId) || invoices[0];

  // New Invoice Form state
  const [newClient, setNewClient] = useState(clients[0]?.id || '');
  const [newProject, setNewProject] = useState(projects[0]?.id || '');
  const [newTitle, setNewTitle] = useState('Milestone Deliverables Invoice');
  const [newLineItems, setNewLineItems] = useState([
    { description: 'Phase 1 Discovery & Initial Design Deliverables', quantity: 1, rate: 12500 }
  ]);
  const [newTaxPercent, setNewTaxPercent] = useState(0);

  const handleCreateInvoiceSubmit = (e) => {
    e.preventDefault();
    const cl = clients.find(c => c.id === newClient) || clients[0];
    const pr = projects.find(p => p.id === newProject) || projects[0];

    const created = createInvoice({
      title: newTitle,
      clientId: cl?.id,
      clientName: cl?.name,
      clientEmail: cl?.email,
      clientAddress: cl?.location,
      projectId: pr?.id,
      projectTitle: pr?.title,
      currency: studio?.currency || '₹',
      lineItems: newLineItems.map(item => ({
        ...item,
        amount: Number(item.quantity) * Number(item.rate)
      })),
      taxPercent: Number(newTaxPercent)
    });

    setSelectedInvoiceId(created.id);
    setIsCreatingNew(false);
  };

  const handleExportPDF = () => {
    exportElementToPDF('invoice-sheet', `${(activeInvoice?.invoiceNumber || 'invoice')}.pdf`);
  };

  const handleMarkAsSent = () => {
    if (activeInvoice) {
      updateInvoice(activeInvoice.id, { status: 'sent' });
      showToast('Status Updated', `${activeInvoice.invoiceNumber} marked as Sent.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-atelier pb-4">
        <div>
          <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">
            Commercial Ledger
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-ink font-normal tracking-tight mt-0.5">
            Invoice Studio
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="flex items-center gap-1.5 px-4 py-2 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCreatingNew ? 'View Invoices' : 'Create Invoice'}</span>
          </button>
        </div>
      </div>

      {isCreatingNew ? (
        /* Create Invoice Form */
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-atelier shadow-sheet space-y-6">
          <div className="border-b border-atelier pb-3">
            <h3 className="font-editorial text-2xl text-ink font-semibold">New Invoice Draft</h3>
            <p className="text-xs text-ink/60">Generate and calculate milestone billing with line items.</p>
          </div>

          <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono-meta uppercase text-[11px] text-ink/70 mb-1">Target Client *</label>
                <select
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  className="w-full px-3 py-2 bg-paper border border-atelier rounded text-ink focus:outline-none"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono-meta uppercase text-[11px] text-ink/70 mb-1">Associated Project</label>
                <select
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="w-full px-3 py-2 bg-paper border border-atelier rounded text-ink focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono-meta uppercase text-[11px] text-ink/70 mb-1">Invoice Description Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Milestone 02 Visual Design Handover"
                className="w-full px-3 py-2 bg-paper border border-atelier rounded text-ink focus:outline-none"
                required
              />
            </div>

            {/* Line items creator */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between font-mono-meta text-[11px] uppercase text-ink/60">
                <span>Line Items</span>
                <button
                  type="button"
                  onClick={() => setNewLineItems([...newLineItems, { description: 'Milestone Work', quantity: 1, rate: 5000 }])}
                  className="text-ink font-bold hover:underline"
                >
                  + Add Line
                </button>
              </div>

              {newLineItems.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const copy = [...newLineItems];
                      copy[idx].description = e.target.value;
                      setNewLineItems(copy);
                    }}
                    placeholder="Description"
                    className="flex-1 px-2.5 py-1.5 bg-paper border border-atelier rounded text-xs text-ink"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const copy = [...newLineItems];
                      copy[idx].quantity = Number(e.target.value);
                      setNewLineItems(copy);
                    }}
                    placeholder="Qty"
                    className="w-16 px-2.5 py-1.5 bg-paper border border-atelier rounded text-xs text-ink"
                  />
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => {
                      const copy = [...newLineItems];
                      copy[idx].rate = Number(e.target.value);
                      setNewLineItems(copy);
                    }}
                    placeholder="Rate"
                    className="w-24 px-2.5 py-1.5 bg-paper border border-atelier rounded text-xs text-ink font-mono-meta"
                  />
                  {newLineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setNewLineItems(newLineItems.filter((_, i) => i !== idx))}
                      className="text-ink/30 hover:text-terracotta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-atelier">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 font-mono-meta uppercase text-xs text-ink/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-chartreuse text-ink font-bold font-mono-meta uppercase text-xs rounded border border-ink shadow-sm"
              >
                Generate Invoice
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Invoice Viewer & Ledger */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Invoices Index (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="font-mono-meta text-xs uppercase tracking-widest text-ink/50 font-bold px-1">
              Invoice Ledger ({invoices.length})
            </div>

            <div className="space-y-2">
              {invoices.map((inv) => {
                const isSelected = inv.id === activeInvoice?.id;
                const remaining = Math.max(0, (inv.total || 0) - (inv.amountPaid || 0));

                return (
                  <button
                    key={inv.id}
                    type="button"
                    onClick={() => setSelectedInvoiceId(inv.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-white border-ink shadow-sm ring-1 ring-ink'
                        : 'bg-paper-light border-atelier hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-meta text-xs font-bold text-ink">{inv.invoiceNumber}</span>
                      <span className={`text-[10px] font-mono-meta uppercase px-2 py-0.5 rounded font-semibold ${
                        inv.status === 'paid'
                          ? 'bg-sage-light text-sage-dark'
                          : inv.status === 'overdue'
                          ? 'bg-terracotta-light text-terracotta'
                          : 'bg-chartreuse/60 text-ink'
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    <div className="font-editorial text-lg text-ink font-semibold line-clamp-1 mt-1">
                      {inv.clientName}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono-meta text-ink/60 mt-2 pt-2 border-t border-atelier/60">
                      <span>Total: {inv.currency}{inv.total?.toLocaleString()}</span>
                      <span className={remaining > 0 ? 'text-terracotta font-semibold' : 'text-sage-dark'}>
                        {remaining > 0 ? `Unpaid: ${inv.currency}${remaining.toLocaleString()}` : 'Settled ✓'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Invoice Preview Sheet (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {activeInvoice ? (
              <div>
                {/* Actions bar */}
                <div className="flex items-center justify-between p-4 bg-paper-light rounded-xl border border-atelier mb-4 text-xs font-mono-meta">
                  <div className="flex items-center gap-2">
                    <span className="text-ink/60">Status:</span>
                    <span className="uppercase font-bold text-ink">{activeInvoice.status}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeInvoice.status !== 'paid' && (
                      <button
                        onClick={() => setIsRecordPaymentOpen(true)}
                        className="px-3 py-1.5 bg-chartreuse hover:bg-chartreuse-dark text-ink font-bold uppercase rounded border border-ink shadow-sm transition-colors"
                      >
                        Record Payment
                      </button>
                    )}
                    {activeInvoice.status === 'draft' && (
                      <button
                        onClick={handleMarkAsSent}
                        className="px-3 py-1.5 bg-white hover:bg-warmGrey/60 text-ink font-bold uppercase rounded border border-atelier transition-colors"
                      >
                        Mark as Sent
                      </button>
                    )}
                    <button
                      onClick={handleExportPDF}
                      className="px-3 py-1.5 bg-ink text-chartreuse hover:bg-ink/90 font-bold uppercase rounded border border-ink shadow-sm transition-colors"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>

                {/* The Typeset Invoice Sheet */}
                <div
                  id="invoice-sheet"
                  className="paper-sheet p-8 sm:p-12 rounded-2xl bg-white border border-atelier shadow-sheet space-y-8 text-ink"
                >
                  {/* Sheet Header */}
                  <div className="flex justify-between items-start border-b-2 border-ink pb-6">
                    <div>
                      <span className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink/60">
                        {studio?.name || 'NORTHSTAR CREATIVE'}
                      </span>
                      <h2 className="font-editorial text-3xl font-bold text-ink mt-0.5">INVOICE</h2>
                      <div className="text-xs text-ink/60 font-mono-meta mt-1">
                        {studio?.paymentDetails || 'UPI / Direct Bank Transfer'}
                      </div>
                    </div>

                    <div className="text-right font-mono-meta text-xs space-y-1">
                      <div className="text-base font-bold text-ink">{activeInvoice.invoiceNumber}</div>
                      <div className="text-ink/60">Issue Date: {activeInvoice.issueDate}</div>
                      <div className="text-ink/60">Due Date: {activeInvoice.dueDate}</div>
                      {activeInvoice.paidDate && (
                        <div className="text-sage-dark font-semibold">Paid: {activeInvoice.paidDate}</div>
                      )}
                    </div>
                  </div>

                  {/* Billed To */}
                  <div className="grid grid-cols-2 gap-6 text-xs">
                    <div>
                      <span className="font-mono-meta text-[10px] uppercase tracking-widest text-ink/50">BILLED TO:</span>
                      <div className="font-editorial text-xl font-bold text-ink mt-1">{activeInvoice.clientName}</div>
                      <div className="text-ink/70 font-mono-meta">{activeInvoice.clientAddress || 'Client Studio'}</div>
                      <div className="text-ink/70 font-mono-meta">{activeInvoice.clientEmail}</div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono-meta text-[10px] uppercase tracking-widest text-ink/50">ASSOCIATED PROJECT:</span>
                      <div className="font-semibold text-ink text-sm mt-1">{activeInvoice.projectTitle || activeInvoice.title}</div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="border border-atelier rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-paper-light border-b border-atelier font-mono-meta uppercase text-[10px] text-ink/60">
                        <tr>
                          <th className="p-3">Description</th>
                          <th className="p-3 text-center w-16">Qty</th>
                          <th className="p-3 text-right w-28">Rate</th>
                          <th className="p-3 text-right w-28">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-atelier">
                        {(activeInvoice.lineItems || []).map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-3 font-medium text-ink">{item.description}</td>
                            <td className="p-3 text-center text-ink/70">{item.quantity || 1}</td>
                            <td className="p-3 text-right font-mono-meta text-ink/70">
                              {activeInvoice.currency}{(item.rate || item.amount || 0).toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-mono-meta font-semibold text-ink">
                              {activeInvoice.currency}{((item.quantity || 1) * (item.rate || item.amount || 0)).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Calculation Breakdown */}
                  <div className="flex justify-end pt-2">
                    <div className="w-64 space-y-2 text-xs font-mono-meta">
                      <div className="flex justify-between text-ink/70">
                        <span>Subtotal:</span>
                        <span>{activeInvoice.currency}{(activeInvoice.subtotal || activeInvoice.total).toLocaleString()}</span>
                      </div>
                      {activeInvoice.taxPercent > 0 && (
                        <div className="flex justify-between text-ink/70">
                          <span>Tax ({activeInvoice.taxPercent}%):</span>
                          <span>{activeInvoice.currency}{(activeInvoice.taxAmount || 0).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t-2 border-ink pt-2 flex justify-between font-bold text-sm text-ink">
                        <span>Total Due:</span>
                        <span>{activeInvoice.currency}{activeInvoice.total?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sage-dark font-semibold">
                        <span>Amount Paid:</span>
                        <span>{activeInvoice.currency}{(activeInvoice.amountPaid || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-terracotta font-bold">
                        <span>Balance Remaining:</span>
                        <span>{activeInvoice.currency}{Math.max(0, (activeInvoice.total || 0) - (activeInvoice.amountPaid || 0)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes & Payment History */}
                  <div className="pt-4 border-t border-atelier text-xs space-y-3">
                    <div className="text-ink/70 font-mono-meta">
                      <strong>Payment Terms:</strong> {activeInvoice.notes || 'Please remit payment within 14 days.'}
                    </div>

                    {activeInvoice.payments?.length > 0 && (
                      <div className="p-3 rounded-lg bg-paper-light border border-atelier space-y-1 font-mono-meta text-[11px]">
                        <span className="font-bold uppercase text-ink">Settlement Receipts:</span>
                        {activeInvoice.payments.map((p, pIdx) => (
                          <div key={pIdx} className="text-sage-dark">
                            ✓ {p.date}: Received {activeInvoice.currency}{p.amount.toLocaleString()} via {p.method} (Ref: {p.reference})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        invoice={activeInvoice}
      />
    </div>
  );
}
