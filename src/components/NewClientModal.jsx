import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { X, Check, Users } from 'lucide-react';

export function NewClientModal({ isOpen, onClose }) {
  const { createClient } = useWorkspace();

  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    createClient({
      name: name.trim(),
      contactPerson: contactPerson.trim() || name.trim(),
      company: company.trim() || name.trim(),
      email: email.trim() || `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: phone.trim(),
      location: location.trim(),
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-paper rounded-xl shadow-sheet border border-atelier overflow-hidden">
        <div className="px-6 py-4 border-b border-atelier bg-paper-light flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-ink" />
            <h3 className="font-mono-meta text-xs uppercase tracking-wider font-bold text-ink">
              Add Client Directory Record
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-ink/40 hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Client / Brand Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Olive & Ember Bistro"
                className="w-full px-3 py-2 text-sm bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Primary Contact Person
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Raghav Anand"
                className="w-full px-3 py-2 text-sm bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="raghav@oliveandember.in"
                className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98201 44321"
                className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Company / Legal Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Olive & Ember Hospitality LLP"
                className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Indiranagar, Bangalore"
                className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1">
              Studio Notes & Context
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Design preferences, communication cadence, or project history..."
              className="w-full px-3 py-2 text-xs bg-white border border-atelier rounded-lg text-ink focus:outline-none focus:border-ink font-sans resize-none"
            />
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
              <span>Add Client</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
