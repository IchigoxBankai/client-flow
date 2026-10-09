import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { ArrowLeft, Mail, Phone, MapPin, FolderKanban, FileText, Receipt, PlusCircle, Sparkles, Clock } from 'lucide-react';

export function ClientDetailPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { clients, projects, invoices, proposals, documents, setActiveProjectId, setIsFlowAgentOpen } = useWorkspace();

  const client = clients.find(c => c.id === clientId) || clients[0];

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="font-editorial text-2xl text-ink">Client not found</h2>
        <Link to="/app/clients" className="text-xs font-mono-meta text-ink underline mt-2 inline-block">
          Return to directory
        </Link>
      </div>
    );
  }

  const clientProjects = projects.filter(p => p.clientId === client.id);
  const clientInvoices = invoices.filter(i => i.clientId === client.id);
  const clientProposals = proposals.filter(p => p.clientId === client.id);
  const totalVal = clientProjects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
  const totalPaid = clientInvoices
    .filter(i => i.status === 'paid')
    .reduce((acc, i) => acc + (i.total || 0), 0);
  const outstanding = clientInvoices
    .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((acc, i) => acc + ((i.total || 0) - (i.amountPaid || 0)), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & top actions */}
      <div className="flex items-center justify-between border-b border-atelier pb-4">
        <button
          onClick={() => navigate('/app/clients')}
          className="flex items-center gap-1.5 text-xs font-mono-meta uppercase tracking-wider text-ink/70 hover:text-ink"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to="/app/documents/communication"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-paper hover:bg-warmGrey/60 text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-atelier"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Draft Email</span>
          </Link>
          <button
            onClick={() => {
              if (clientProjects[0]) {
                setActiveProjectId(clientProjects[0].id);
              }
              setIsFlowAgentOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Flow Agent</span>
          </button>
        </div>
      </div>

      {/* Client Overview Dossier Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-paper-card border border-atelier shadow-sheet space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">
              Client Dossier • {client.status?.toUpperCase()}
            </span>
            <h1 className="text-3xl sm:text-4xl text-ink font-bold tracking-tight mt-1">
              {client.name}
            </h1>
            <div className="text-sm text-ink/70 mt-1">
              {client.company} • Contact: <span className="font-semibold text-ink">{client.contactPerson}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-paper-light border border-atelier text-right">
            <div>
              <span className="font-mono-meta text-[10px] uppercase text-ink/50">Total Value</span>
              <div className="font-mono-meta text-base font-bold text-ink">₹{totalVal.toLocaleString()}</div>
            </div>
            <div>
              <span className="font-mono-meta text-[10px] uppercase text-ink/50">Settled</span>
              <div className="font-mono-meta text-base font-bold text-sage-dark">₹{totalPaid.toLocaleString()}</div>
            </div>
            <div>
              <span className="font-mono-meta text-[10px] uppercase text-ink/50">Outstanding</span>
              <div className="font-mono-meta text-base font-bold text-terracotta">₹{outstanding.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Contact details & studio notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-atelier text-xs">
          <div className="space-y-2 font-mono-meta">
            <span className="text-[10px] uppercase text-ink/50 tracking-widest font-bold">Direct Channels</span>
            <div className="space-y-1 text-ink/80">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-ink/40" />
                <span>{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-ink/40" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-ink/40" />
                  <span>{client.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-mono-meta text-[10px] uppercase text-ink/50 tracking-widest font-bold">Studio Notes</span>
            <p className="text-ink/70 leading-relaxed italic">
              "{client.notes || 'No custom client notes recorded.'}"
            </p>
          </div>
        </div>
      </div>

      {/* Linked Projects */}
      <section className="space-y-4">
        <h2 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink flex items-center gap-2">
          <FolderKanban className="w-3.5 h-3.5 text-ink" />
          <span>Client Projects ({clientProjects.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clientProjects.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setActiveProjectId(p.id);
                navigate('/app/work');
              }}
              className="p-5 rounded-xl bg-white border border-atelier hover:border-ink shadow-subtle cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-meta text-[10px] text-ink/50 uppercase">{p.projectNumber}</span>
                <span className="text-xs font-mono-meta uppercase px-2 py-0.5 rounded bg-warmGrey text-ink font-semibold">
                  {p.status}
                </span>
              </div>
              <h3 className="font-editorial text-xl text-ink font-semibold group-hover:underline">
                {p.title}
              </h3>
              <div className="flex items-center justify-between text-xs font-mono-meta text-ink/70 pt-2 border-t border-atelier">
                <span>Budget: {p.currency}{Number(p.budget || 0).toLocaleString()}</span>
                <span>{p.completionPercentage}% Done</span>
              </div>
            </div>
          ))}

          {clientProjects.length === 0 && (
            <div className="p-8 text-center bg-white rounded-xl border border-atelier text-ink/50 text-xs">
              No active or archived projects registered for this client.
            </div>
          )}
        </div>
      </section>

      {/* Linked Invoices & Proposals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invoices */}
        <section className="space-y-3">
          <h3 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink flex items-center gap-2">
            <Receipt className="w-3.5 h-3.5 text-ink" />
            <span>Invoices Ledger</span>
          </h3>

          <div className="space-y-2">
            {clientInvoices.map((inv) => (
              <div key={inv.id} className="p-3.5 rounded-lg bg-white border border-atelier flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold font-mono-meta text-ink">{inv.invoiceNumber}</div>
                  <div className="text-[11px] text-ink/60">{inv.title}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono-meta">{inv.currency}{inv.total?.toLocaleString()}</div>
                  <span className={`text-[10px] font-mono-meta uppercase px-1.5 py-0.2 rounded font-semibold ${
                    inv.status === 'paid' ? 'bg-sage-light text-sage-dark' : 'bg-warmGrey text-ink'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
            {clientInvoices.length === 0 && (
              <div className="p-6 text-center text-xs text-ink/50 bg-paper-light rounded border border-atelier">
                No invoices issued for this client.
              </div>
            )}
          </div>
        </section>

        {/* Proposals */}
        <section className="space-y-3">
          <h3 className="font-mono-meta text-xs uppercase tracking-widest font-bold text-ink flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-ink" />
            <span>Agreements & Proposals</span>
          </h3>

          <div className="space-y-2">
            {clientProposals.map((prop) => (
              <div key={prop.id} className="p-3.5 rounded-lg bg-white border border-atelier flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold font-mono-meta text-ink">{prop.proposalNumber}</div>
                  <div className="text-[11px] text-ink/60">{prop.title}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono-meta">{prop.currency}{prop.totalBudget?.toLocaleString()}</div>
                  <span className="text-[10px] font-mono-meta uppercase px-1.5 py-0.2 rounded bg-sage-light text-sage-dark font-semibold">
                    {prop.status}
                  </span>
                </div>
              </div>
            ))}
            {clientProposals.length === 0 && (
              <div className="p-6 text-center text-xs text-ink/50 bg-paper-light rounded border border-atelier">
                No formal proposals recorded.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
