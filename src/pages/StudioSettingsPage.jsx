import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { Settings, RotateCcw, Check, Sparkles, Shield, DollarSign, Building } from 'lucide-react';

export function StudioSettingsPage() {
  const { studio, updateStudioProfile } = useAuth();
  const { resetDemoData, showToast } = useWorkspace();

  const [name, setName] = useState(studio?.name || 'Northstar Creative');
  const [tagline, setTagline] = useState(studio?.tagline || 'Independent Digital Product Atelier');
  const [ownerName, setOwnerName] = useState(studio?.ownerName || 'Nishant Puthran');
  const [ownerTitle, setOwnerTitle] = useState(studio?.ownerTitle || 'Principal Designer & Developer');
  const [email, setEmail] = useState(studio?.email || 'studio@northstar.creative');
  const [currency, setCurrency] = useState(studio?.currency || '₹');
  const [paymentDetails, setPaymentDetails] = useState(studio?.paymentDetails || 'UPI: northstar@okhdfcbank | HDFC A/C: 50200019283746');

  const handleSave = (e) => {
    e.preventDefault();
    updateStudioProfile({
      name,
      tagline,
      ownerName,
      ownerTitle,
      email,
      currency,
      paymentDetails
    });
    showToast('Settings Saved', 'Studio profile updated.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-atelier pb-4">
        <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">
          Studio Preferences
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-ink font-normal tracking-tight mt-0.5">
          Studio Settings
        </h1>
      </div>

      {/* Demo Workspace Banner & Reset Button */}
      <div className="p-5 rounded-2xl bg-paper-light border-2 border-ink shadow-sheet flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-chartreuse animate-pulse" />
            <h3 className="font-mono-meta text-xs uppercase tracking-wider font-bold text-ink">
              Demo Studio Active (Northstar Creative)
            </h3>
          </div>
          <p className="text-xs text-ink/70">
            You are operating in the demo workspace with fictional client Olive & Ember Bistro. Resetting restores all original demo projects, invoices, and milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Reset workspace to original demo data?')) {
              resetDemoData();
            }
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-warmGrey/60 text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-sm transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-white border border-atelier shadow-sheet space-y-6">
        <div className="border-b border-atelier pb-3">
          <h2 className="font-editorial text-2xl text-ink font-semibold">Studio Profile & Commercials</h2>
          <p className="text-xs text-ink/60 font-sans">Used on generated client proposals, emails, and invoices.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono-meta text-xs uppercase tracking-wider text-ink/70 mb-1">
              Studio Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-paper border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
            />
          </div>

          <div>
            <label className="block font-mono-meta text-xs uppercase tracking-wider text-ink/70 mb-1">
              Studio Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-paper border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-mono-meta text-xs uppercase tracking-wider text-ink/70 mb-1">
              Studio Principal Name
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-paper border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
            />
          </div>

          <div>
            <label className="block font-mono-meta text-xs uppercase tracking-wider text-ink/70 mb-1">
              Professional Title
            </label>
            <input
              type="text"
              value={ownerTitle}
              onChange={(e) => setOwnerTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-paper border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
            />
          </div>

          <div>
            <label className="block font-mono-meta text-xs uppercase tracking-wider text-ink/70 mb-1">
              Default Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-paper border border-atelier rounded-lg text-ink focus:outline-none font-mono-meta"
            >
              <option value="₹">₹ INR (Rupees)</option>
              <option value="$">$ USD (Dollars)</option>
              <option value="€">€ EUR (Euros)</option>
              <option value="£">£ GBP (Pounds)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-mono-meta text-xs uppercase tracking-wider text-ink/70 mb-1">
            Studio Contact Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-paper border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
          />
        </div>

        <div>
          <label className="block font-mono-meta text-xs uppercase tracking-wider text-ink/70 mb-1">
            Payment Settlement Instructions (UPI / Bank Details)
          </label>
          <textarea
            rows={2}
            value={paymentDetails}
            onChange={(e) => setPaymentDetails(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-paper border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-mono-meta resize-none"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
