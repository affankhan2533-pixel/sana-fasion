'use client';
import { useAdminStore } from '@/lib/adminStore';
import { CheckCircle, XCircle, AlertTriangle, X, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const icons = {
  success: <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />,
  error: <XCircle size={16} className="text-red-400 flex-shrink-0" />,
  warning: <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />,
  info: <Info size={16} className="text-blue-400 flex-shrink-0" />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useAdminStore();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-[10px] min-w-[280px] max-w-[360px]"
            style={{
              background: '#1C1008',
              color: '#FFF8F0',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,240,210,0.08)',
            }}
          >
            {icons[toast.type]}
            <p className="text-[13px] font-medium flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-1 p-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
              style={{ color: 'rgba(255,240,210,0.5)' }}
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
