import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { Sparkles, ArrowRight, Check, CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { resetDemoData } = useWorkspace();

  const [step, setStep] = useState(1);
  const [studioName, setStudioName] = useState('Northstar Creative');
  const [fullName, setFullName] = useState('Nishant Puthran');
  const [email, setEmail] = useState('studio@northstar.creative');
  const [selectedServices, setSelectedServices] = useState(['Web Development', 'UI/UX Design']);
  const [currency, setCurrency] = useState('₹');
  const [projectChoice, setProjectChoice] = useState('demo'); // 'demo' | 'empty'

  const availableServices = [
    'Web Development',
    'UI/UX Design',
    'Brand Systems',
    'Graphic Design',
    'Video Editing',
    'Content Writing',
    'Digital Marketing',
    'Full-Stack Engineering'
  ];

  const toggleService = (srv) => {
    setSelectedServices(prev =>
      prev.includes(srv) ? prev.filter(s => s !== srv) : [...prev, srv]
    );
  };

  const handleFinish = async () => {
    await signup({
      email,
      fullName,
      studioName,
      services: selectedServices,
      currency,
      title: 'Principal Designer & Developer'
    });

    if (projectChoice === 'demo') {
      resetDemoData();
    }

    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col justify-between p-6 sm:p-10">
      {/* Top Header */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between border-b border-atelier pb-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-sm bg-ink text-chartreuse flex items-center justify-center font-mono-meta text-[11px] font-bold">
            CF
          </span>
          <span className="font-mono-meta text-xs uppercase tracking-widest font-bold">
            CLIENTFLOW
          </span>
        </Link>
        <span className="font-mono-meta text-xs text-ink/60 uppercase">
          Step 0{step} of 04
        </span>
      </div>

      {/* Center Step Card */}
      <div className="max-w-xl mx-auto w-full py-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">01 / Identity</span>
                <h2 className="font-editorial text-4xl sm:text-5xl text-ink font-normal">
                  Name your studio.
                </h2>
                <p className="text-sm text-ink-muted">
                  This identity will appear on your client proposals, milestone plans, and invoices.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1.5">
                    Studio or Business Name
                  </label>
                  <input
                    type="text"
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                    placeholder="e.g. Northstar Creative"
                    className="w-full px-4 py-3 bg-white border border-atelier rounded-lg text-ink font-sans text-base focus:outline-none focus:border-ink shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Nishant Puthran"
                      className="w-full px-4 py-2.5 bg-white border border-atelier rounded-lg text-ink font-sans text-sm focus:outline-none focus:border-ink shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-meta uppercase tracking-wider text-ink/70 mb-1.5">
                      Studio Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="studio@northstar.creative"
                      className="w-full px-4 py-2.5 bg-white border border-atelier rounded-lg text-ink font-sans text-sm focus:outline-none focus:border-ink shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">02 / Offerings</span>
                <h2 className="font-editorial text-4xl sm:text-5xl text-ink font-normal">
                  Choose your primary services.
                </h2>
                <p className="text-sm text-ink-muted">
                  Flow Agent uses your services to calibrate proposal scopes and task estimates.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {availableServices.map((srv) => {
                  const isSelected = selectedServices.includes(srv);
                  return (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => toggleService(srv)}
                      className={`p-3.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-paper-light border-ink shadow-atelier text-ink font-semibold'
                          : 'bg-white border-atelier text-ink/70 hover:border-ink/40'
                      }`}
                    >
                      <span>{srv}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-ink shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">03 / Commercials</span>
                <h2 className="font-editorial text-4xl sm:text-5xl text-ink font-normal">
                  Set your preferred currency.
                </h2>
                <p className="text-sm text-ink-muted">
                  Default currency used for project budgets, proposals, and invoices.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { symbol: '₹', label: 'INR (Rupees)' },
                  { symbol: '$', label: 'USD (Dollars)' },
                  { symbol: '€', label: 'EUR (Euros)' },
                  { symbol: '£', label: 'GBP (Pounds)' }
                ].map((cur) => {
                  const isSelected = currency === cur.symbol;
                  return (
                    <button
                      key={cur.symbol}
                      type="button"
                      onClick={() => setCurrency(cur.symbol)}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-paper-light border-ink shadow-atelier ring-1 ring-ink'
                          : 'bg-white border-atelier hover:border-ink/40'
                      }`}
                    >
                      <div className="font-mono-meta text-2xl font-bold text-ink">{cur.symbol}</div>
                      <div className="font-mono-meta text-[11px] text-ink/60 mt-1 uppercase">{cur.label}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="font-mono-meta text-xs uppercase tracking-widest text-ink/50">04 / Workspace</span>
                <h2 className="font-editorial text-4xl sm:text-5xl text-ink font-normal">
                  Ready to step into flow.
                </h2>
                <p className="text-sm text-ink-muted">
                  Choose how you'd like to initialize your Creative Atelier workspace.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProjectChoice('demo')}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    projectChoice === 'demo'
                      ? 'bg-paper-light border-2 border-ink shadow-atelier'
                      : 'bg-white border-atelier'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-meta text-xs font-bold uppercase text-ink">
                      Load Atelier Sample Data (Recommended)
                    </span>
                    {projectChoice === 'demo' && <Check className="w-4 h-4 text-ink" />}
                  </div>
                  <p className="text-xs text-ink/70 mt-1">
                    Pre-seeds the Olive & Ember Bistro restaurant website project, proposals, milestone invoices, and client records so you can test all autonomous agent workflows immediately.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setProjectChoice('empty')}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    projectChoice === 'empty'
                      ? 'bg-paper-light border-2 border-ink shadow-atelier'
                      : 'bg-white border-atelier'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-meta text-xs font-bold uppercase text-ink">
                      Start with Clean Workspace
                    </span>
                    {projectChoice === 'empty' && <Check className="w-4 h-4 text-ink" />}
                  </div>
                  <p className="text-xs text-ink/70 mt-1">
                    Initialize an empty studio and create your first real client project using Brief to Build.
                  </p>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Navigation Controls */}
        <div className="pt-8 border-t border-atelier flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-xs font-mono-meta uppercase tracking-wider text-ink/70 hover:text-ink"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <Link to="/" className="text-xs font-mono-meta uppercase tracking-wider text-ink/50 hover:text-ink">
              Cancel
            </Link>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 bg-chartreuse hover:bg-chartreuse-dark text-ink font-semibold text-xs font-mono-meta uppercase tracking-wider rounded border border-ink shadow-atelier transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom info */}
      <div className="max-w-xl mx-auto w-full text-center text-xs font-mono-meta text-ink/40">
        CLIENTFLOW • YOUR FREELANCE BUSINESS, IN FLOW
      </div>
    </div>
  );
}
