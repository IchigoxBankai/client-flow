import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ToastContainer() {
  const { toasts } = useWorkspace();

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg bg-ink text-paper shadow-atelier border border-ink/20`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-chartreuse shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-chartreuse shrink-0 mt-0.5" />}
            
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold tracking-wider uppercase font-mono-meta text-paper/90">
                {toast.title}
              </h4>
              <p className="text-sm text-paper/70 mt-0.5 leading-snug break-words">
                {toast.message}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
