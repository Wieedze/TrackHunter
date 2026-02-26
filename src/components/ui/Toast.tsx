import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose: () => void;
}

const ICON_MAP = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} as const;

const COLOR_MAP = {
  success: 'border-status-success text-status-success',
  error: 'border-status-error text-status-error',
  info: 'border-status-info text-status-info',
} as const;

export function Toast({ message, type = 'info', visible, onClose }: ToastProps) {
  const Icon = ICON_MAP[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-sm border bg-bg-elevated px-4 py-3 ${COLOR_MAP[type]}`}
        >
          <Icon size={16} strokeWidth={1.5} />
          <span className="text-sm text-text-primary">{message}</span>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
