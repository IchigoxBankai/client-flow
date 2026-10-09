import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { X, Check, DollarSign } from 'lucide-react';

export function RecordPaymentModal({ isOpen, onClose, invoice }) {
  const { recordPayment } = useWorkspace();

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('UPI / Bank Transfer');
  const [reference, setReference] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen || !invoice) return null;

  const remaining = Math.max(0, (invoice.total || 0) - (invoice.amountPaid || 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount || remaining);
    if (numAmount <= 0) return;

    recordPayment(invoice.id, {
      amount: numAmount,
      method,
      reference,
      date
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-paper rounded-xl shadow-sheet border border-atelier overflow-hidden">
        <div className="px-6 py-4 border-b border-atelier bg-paper-light flex items-center justify-between">
          <h3 className="font-mono-meta text-xs uppercase tracking-wider font-bold text-ink">
            Record Payment — {invoice.invoiceNumber}
          </h3>
          <button onClick={onClose} className="p-1 text-ink/40 hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-white rounded-lg border border-atelier text-xs">
            <div className="text-ink/60 font-mono-meta uppercase text-[10px]">Invoice Total</div>
            <div className="text-base font-bold text-ink mt-0.5">
              {invoice.currency || '₹'}{invoice.total?.toLocaleString()}
            </div>
            <div className="text-ink/60 text-[11px] mt-1">
              Already paid: {invoice.currency || '₹'}{(invoice.amountPaid || 0).toLocaleString()} • Outstanding: <span className="font-semibold text-terracotta">{invoice.currency || '₹'}{remaining.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
              Payment Amount ({invoice.currency || '₹'}) *
            </label>
            <input
              type="number"
              required
              min="1"
              max={remaining}
              value={amount}
              placeholder={String(remaining)}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
              Payment Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
            >
              <option value="UPI / Bank Transfer">UPI / Direct Bank Transfer</option>
              <option value="Razorpay / Stripe">Razorpay / Stripe Gateway</option>
              <option value="Cheque">Cheque</option>
              <option value="Cash / Wire">International Wire / Cash</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Reference / Txn ID
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. UPI-992812"
                className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-atelier">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono-meta uppercase tracking-wider text-ink/60 hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
