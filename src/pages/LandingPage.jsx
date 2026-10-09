import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, Layers, FileText, Receipt, Mail, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('canvas'); // 'canvas' | 'agent' | 'proposal'

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-chartreuse selection:text-ink flex flex-col">
      {/* Top Editorial Nav */}
      <header className="border-b border-atelier bg-paper/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-sm bg-ink text-chartreuse flex items-center justify-center font-mono-meta text-xs font-bold">
              CF
            </span>
            <span className="font-mono-meta text-xs uppercase tracking-widest font-bold">
              CLIENTFLOW
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/app"
              className="text-xs font-mono-meta uppercase tracking-wider text-ink/70 hover:text-ink hidden sm:inline-block"
            >
              Explore Live Demo
            </Link>
            <Link
              to="/onboarding"
              className="flex items-center gap-1.5 px-4 py-2 bg-ink text-paper hover:bg-ink/90 font-mono-meta text-xs uppercase tracking-wider font-semibold rounded shadow-atelier border border-ink transition-all"
            >
              <span>Build your workspace</span>
              <ArrowRight className="w-3.5 h-3.5 text-chartreuse" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Hero Copy */}
          <div className="lg:col-span-6 space-y-8 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chartreuse/50 border border-ink/20 text-xs font-mono-meta uppercase tracking-wider font-semibold text-ink">
              <Sparkles className="w-3.5 h-3.5 fill-ink" />
              <span>The Autonomous Freelance Studio</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl leading-[1.05] text-ink font-extrabold tracking-tight">
              Less admin.<br />
              <span className="text-ink/75 font-bold">More making.</span>
            </h1>

            <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-sans max-w-xl font-normal">
              Your AI-powered freelance studio for turning messy client briefs into clear plans, professional proposals, milestone timelines, and paid invoices — with real autonomous project execution.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/onboarding"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
              >
                <span>Build your workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/app"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-paper hover:bg-warmGrey/60 text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-atelier transition-colors"
              >
                <span>Explore the demo studio</span>
              </Link>
            </div>

            {/* Micro feature badges */}
            <div className="pt-6 border-t border-atelier grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono-meta text-ink/70">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-sage-dark" />
                <span>Brief to Build Intake</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-sage-dark" />
                <span>Real Agent Tools</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-sage-dark" />
                <span>Human-in-the-Loop</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Workspace Teaser (CSS-Generated Atelier Canvas) */}
          <div className="lg:col-span-6 w-full">
            <div className="bg-paper-card border-2 border-ink rounded-xl shadow-sheet overflow-hidden">
              {/* Teaser window bar */}
              <div className="px-4 py-3 bg-paper-dark border-b border-atelier flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-ink/30" />
                  <span className="w-3 h-3 rounded-full bg-ink/30" />
                  <span className="w-3 h-3 rounded-full bg-ink/30" />
                  <span className="ml-2 font-mono-meta text-[11px] text-ink/60 uppercase">
                    Olive & Ember Bistro — Canvas
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab('canvas')}
                    className={`px-2 py-0.5 text-[10px] font-mono-meta uppercase rounded ${activeTab === 'canvas' ? 'bg-ink text-chartreuse font-bold' : 'text-ink/60'}`}
                  >
                    Canvas
                  </button>
                  <button
                    onClick={() => setActiveTab('agent')}
                    className={`px-2 py-0.5 text-[10px] font-mono-meta uppercase rounded ${activeTab === 'agent' ? 'bg-ink text-chartreuse font-bold' : 'text-ink/60'}`}
                  >
                    Flow Agent
                  </button>
                  <button
                    onClick={() => setActiveTab('proposal')}
                    className={`px-2 py-0.5 text-[10px] font-mono-meta uppercase rounded ${activeTab === 'proposal' ? 'bg-ink text-chartreuse font-bold' : 'text-ink/60'}`}
                  >
                    Proposal
                  </button>
                </div>
              </div>

              {/* Dynamic Tab Content */}
              <div className="p-6 bg-paper-light min-h-[380px] flex flex-col justify-between">
                {activeTab === 'canvas' && (
                  <div className="space-y-5">
                    <div className="flex items-start justify-between border-b border-atelier pb-4">
                      <div>
                        <span className="font-mono-meta text-[11px] text-ink/50 uppercase">PRJ-001 • In Progress</span>
                        <h3 className="font-editorial text-2xl text-ink font-bold mt-0.5">
                          Restaurant Website Redesign
                        </h3>
                        <p className="text-xs text-ink/70">Client: Olive & Ember Bistro • Budget: ₹25,000</p>
                      </div>
                      <span className="px-2.5 py-1 bg-chartreuse text-ink font-mono-meta text-xs uppercase font-bold rounded border border-ink">
                        45% In Flow
                      </span>
                    </div>

                    {/* Timeline Stages preview */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono-meta uppercase text-ink/50 tracking-wider">Milestone Track</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2.5 rounded bg-sage-faint border border-sage/40">
                          <div className="font-mono-meta text-[10px] text-sage-dark font-bold">01 DISCOVERY</div>
                          <div className="font-semibold text-ink text-xs mt-0.5">Requirements</div>
                          <div className="text-[10px] text-sage-dark mt-1">✓ Completed</div>
                        </div>
                        <div className="p-2.5 rounded bg-paper-light border-2 border-ink shadow-sm">
                          <div className="font-mono-meta text-[10px] text-ink font-bold">02 DESIGN</div>
                          <div className="font-semibold text-ink text-xs mt-0.5">Homepage & Menu</div>
                          <div className="text-[10px] text-ink/70 mt-1">● In Client Review</div>
                        </div>
                        <div className="p-2.5 rounded bg-white border border-atelier">
                          <div className="font-mono-meta text-[10px] text-ink/40 font-bold">03 BUILD</div>
                          <div className="font-semibold text-ink text-xs mt-0.5">React Development</div>
                          <div className="text-[10px] text-ink/40 mt-1">Pending approval</div>
                        </div>
                      </div>
                    </div>

                    {/* Active tasks preview */}
                    <div className="p-3 rounded-lg bg-white border border-atelier flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-chartreuse" />
                        <span className="font-medium text-ink">Design editorial homepage & typography system</span>
                      </div>
                      <span className="font-mono-meta text-[11px] text-sage-dark font-semibold">Done</span>
                    </div>
                  </div>
                )}

                {activeTab === 'agent' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-white rounded-lg border border-atelier text-xs text-ink/80 leading-relaxed">
                      <div className="font-mono-meta uppercase text-[10px] text-ink/40 mb-1">Freelancer Prompt</div>
                      "The client approved the homepage. Mark that milestone as approved and move to development."
                    </div>

                    <div className="p-3.5 bg-paper rounded-lg border-2 border-ink shadow-sm text-xs space-y-2.5">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-ink" />
                        <span className="font-mono-meta text-[11px] uppercase font-bold text-ink">Flow Agent Action Proposal</span>
                      </div>
                      <p className="text-ink/80 text-[11px]">
                        I found the Design milestone for <strong>Olive & Ember Bistro</strong>. Proposed changes:
                      </p>
                      <ul className="text-[11px] text-ink/80 space-y-1 list-disc list-inside">
                        <li>Mark homepage design as approved</li>
                        <li>Mark Visual Design milestone as completed</li>
                        <li>Activate Frontend Development milestone</li>
                      </ul>
                      <div className="pt-1 flex gap-2">
                        <span className="px-3 py-1 bg-chartreuse text-ink font-mono-meta text-[10px] font-bold uppercase rounded border border-ink">
                          [Approve Changes]
                        </span>
                        <span className="px-3 py-1 bg-warmGrey/60 text-ink/70 font-mono-meta text-[10px] uppercase rounded">
                          [Cancel]
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'proposal' && (
                  <div className="space-y-3">
                    <div className="border-b border-atelier pb-2">
                      <span className="font-mono-meta text-[10px] text-ink/50 uppercase">Document Studio</span>
                      <h4 className="font-editorial text-xl text-ink font-bold">Proposal — Olive & Ember Bistro</h4>
                    </div>
                    <div className="p-3 bg-white rounded border border-atelier text-xs space-y-2">
                      <div className="flex justify-between font-mono-meta text-[11px]">
                        <span>Phase 1 Discovery & Wireframes</span>
                        <span>₹6,000</span>
                      </div>
                      <div className="flex justify-between font-mono-meta text-[11px]">
                        <span>Phase 2 Bespoke Visual Design</span>
                        <span>₹8,000</span>
                      </div>
                      <div className="flex justify-between font-mono-meta text-[11px]">
                        <span>Phase 3 Frontend Development</span>
                        <span>₹8,000</span>
                      </div>
                      <div className="flex justify-between font-mono-meta text-[11px]">
                        <span>Phase 4 Launch & Handover</span>
                        <span>₹3,000</span>
                      </div>
                      <div className="border-t border-atelier pt-1.5 flex justify-between font-mono-meta font-bold text-xs text-ink">
                        <span>Total Fixed Investment</span>
                        <span>₹25,000</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-atelier flex items-center justify-between text-[11px] font-mono-meta text-ink/60">
                  <span>Interactive Project Canvas</span>
                  <Link to="/app" className="text-ink font-semibold hover:underline flex items-center gap-1">
                    Open Demo <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Creative Atelier Philosophy */}
      <section className="py-20 bg-paper-dark border-y border-atelier px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/60">
              The Architecture
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-ink font-normal">
              Not another generic SaaS dashboard.
            </h2>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-sans">
              We replaced cramped sidebar panels and meaningless metric graphs with an editorial Project Canvas designed specifically for independent makers, designers, and creative studios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-paper border border-atelier space-y-4">
              <span className="font-mono-meta text-xs font-bold text-ink/40">01 / INTAKE</span>
              <h3 className="font-editorial text-2xl text-ink font-semibold">Brief to Build</h3>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                Paste any unstructured client email or WhatsApp brief. Flow Agent automatically extracts scope, suggests realistic milestones, flags missing assets, and produces an editable project blueprint.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-paper border border-atelier space-y-4">
              <span className="font-mono-meta text-xs font-bold text-ink/40">02 / WORKFLOW</span>
              <h3 className="font-editorial text-2xl text-ink font-semibold">Project Canvas & Flow Board</h3>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                Switch effortlessly between the typography-led Project Canvas and the draggable Flow Board. Track connected milestone timelines, task dependencies, and project health indicators in real time.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-paper border border-atelier space-y-4">
              <span className="font-mono-meta text-xs font-bold text-ink/40">03 / AUTONOMOUS TOOLS</span>
              <h3 className="font-editorial text-2xl text-ink font-semibold">Contextual Flow Agent</h3>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                Powered by real application tools. Flow Agent doesn't just chat — it generates proposals, drafts invoices, composes client emails, and executes state changes with mandatory human confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <footer className="py-16 px-6 max-w-7xl mx-auto w-full mt-auto">
        <div className="p-8 sm:p-12 rounded-2xl bg-ink text-paper flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-editorial text-3xl sm:text-4xl text-paper font-normal">
              Your freelance business, in flow.
            </h3>
            <p className="text-xs sm:text-sm text-paper/70 font-sans max-w-md">
              Step into the Creative Atelier workspace. No credit card required.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/onboarding"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-sm transition-all"
            >
              <span>Build your workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono-meta text-ink/50 gap-4">
          <div>CLIENTFLOW STUDIO • THE CREATIVE ATELIER</div>
          <div>EST. 2026 • BUILT FOR INDEPENDENT MAKERS</div>
        </div>
      </footer>
    </div>
  );
}
