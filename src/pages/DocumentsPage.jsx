import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import {
  FileText,
  Receipt,
  Mail,
  FolderKanban,
  Search,
  Filter,
  ArrowRight,
  Download,
  Plus
} from 'lucide-react';

export function DocumentsPage() {
  const { documents, proposals, invoices, projects } = useWorkspace();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'proposal' | 'invoice' | 'email' | 'brief'
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredDocs = documents.filter(doc => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clientName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getDocIcon = (type) => {
    switch (type) {
      case 'proposal': return FileText;
      case 'invoice': return Receipt;
      case 'email': return Mail;
      case 'brief': return FolderKanban;
      default: return FileText;
    }
  };

  const handleDocumentClick = (doc) => {
    if (doc.type === 'proposal') {
      navigate('/app/documents/proposals');
    } else if (doc.type === 'invoice') {
      navigate('/app/documents/invoices');
    } else if (doc.type === 'email') {
      navigate('/app/documents/communication');
    } else {
      navigate('/app/work');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-atelier pb-4">
        <div>
          <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">
            Studio Archive
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-ink font-normal tracking-tight mt-0.5">
            Document Library
          </h1>
          <p className="text-xs text-ink/60 mt-1">
            Proposals, commercial invoices, project briefs, and drafted client communications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/app/documents/proposals"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-warmGrey/60 text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-atelier"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Proposal Studio</span>
          </Link>
          <Link
            to="/app/documents/invoices"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-sm"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Invoice Studio</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'all', label: 'All Documents' },
            { key: 'proposal', label: 'Proposals' },
            { key: 'invoice', label: 'Invoices' },
            { key: 'email', label: 'Client Emails' },
            { key: 'brief', label: 'Project Briefs' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-meta uppercase transition-all ${
                filterType === tab.key
                  ? 'bg-ink text-chartreuse font-bold border border-ink shadow-sm'
                  : 'bg-paper-light border border-atelier text-ink/70 hover:border-ink/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const Icon = getDocIcon(doc.type);

          return (
            <div
              key={doc.id}
              onClick={() => handleDocumentClick(doc)}
              className="p-5 rounded-xl bg-white border border-atelier hover:border-ink shadow-subtle hover:shadow-atelier transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded bg-warmGrey/60 text-ink flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono-meta uppercase px-2 py-0.5 rounded bg-warmGrey text-ink font-semibold">
                    {doc.type}
                  </span>
                </div>

                <h3 className="font-editorial text-xl text-ink font-semibold group-hover:text-ink transition-colors line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-xs text-ink/60 font-mono-meta">
                  Client: {doc.clientName || 'Client'}
                </p>
              </div>

              <div className="pt-3 border-t border-atelier flex items-center justify-between text-xs font-mono-meta text-ink/50">
                <span>{doc.createdAt}</span>
                <span className="text-ink font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Open Document <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}

        {filteredDocs.length === 0 && (
          <div className="col-span-full p-12 text-center text-ink/50 text-xs bg-paper-light rounded-xl border border-atelier">
            No documents matching the selected criteria.
          </div>
        )}
      </div>
    </div>
  );
}
