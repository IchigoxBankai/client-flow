import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { NewClientModal } from '../components/NewClientModal';
import { Users, Plus, Search, FolderKanban, Mail, Phone, MapPin, ArrowRight, DollarSign } from 'lucide-react';

export function ClientsPage() {
  const { clients, projects, invoices } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const navigate = useNavigate();

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-atelier pb-6">
        <div>
          <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">
            Studio Directory
          </span>
          <h1 className="text-3xl sm:text-4xl text-ink font-bold tracking-tight mt-1">
            Client Atelier
          </h1>
          <p className="text-sm text-ink/70 mt-1">
            Maintain relationship context, active project allocations, and balance ledgers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewClientOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, company, or contact..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
          />
        </div>

        <span className="font-mono-meta text-xs text-ink/50">
          Showing {filteredClients.length} clients
        </span>
      </div>

      {/* Editorial Directory Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.map((client) => {
          const clientProjects = projects.filter(p => p.clientId === client.id);
          const clientInvoices = invoices.filter(i => i.clientId === client.id);
          const totalVal = clientProjects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
          const outstanding = clientInvoices
            .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
            .reduce((acc, i) => acc + ((i.total || 0) - (i.amountPaid || 0)), 0);

          return (
            <div
              key={client.id}
              onClick={() => navigate(`/app/clients/${client.id}`)}
              className="p-6 rounded-2xl bg-paper-card border border-atelier hover:border-ink shadow-subtle hover:shadow-atelier transition-all cursor-pointer group space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono-meta text-[11px] uppercase tracking-wider text-ink/50">
                    {client.company || 'Direct Client'}
                  </span>
                  <h3 className="font-editorial text-2xl text-ink font-semibold group-hover:text-ink transition-colors mt-0.5">
                    {client.name}
                  </h3>
                  <div className="text-xs text-ink/70 flex items-center gap-1.5 mt-0.5">
                    <span className="font-medium text-ink">{client.contactPerson}</span>
                    {client.location && <span>• {client.location}</span>}
                  </div>
                </div>

                <div className="text-right font-mono-meta">
                  <div className="text-xs uppercase text-ink/50">Total Value</div>
                  <div className="text-base font-bold text-ink">₹{totalVal.toLocaleString()}</div>
                  {outstanding > 0 && (
                    <div className="text-[10px] text-terracotta font-semibold mt-0.5">
                      ₹{outstanding.toLocaleString()} unpaid
                    </div>
                  )}
                </div>
              </div>

              {/* Contact metadata */}
              <div className="pt-3 border-t border-atelier flex flex-wrap items-center gap-4 text-xs text-ink/70 font-mono-meta">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-ink/40" />
                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-ink/40" />
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>

              {/* Projects count & open link */}
              <div className="pt-2 flex items-center justify-between text-xs font-mono-meta text-ink/60">
                <span>{clientProjects.length} linked project(s)</span>
                <span className="text-ink font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Client Dossier <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
      />
    </div>
  );
}
