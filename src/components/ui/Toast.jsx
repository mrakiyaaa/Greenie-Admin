import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    error: {
      bg: 'bg-red-50 border-red-400',
      icon: <AlertCircle className="w-5 h-5 text-red" />,
      text: 'text-red',
    },
    success: {
      bg: 'bg-green-50 border-green-400',
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      text: 'text-green-800',
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-400',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      text: 'text-yellow-800',
    },
    info: {
      bg: 'bg-blue-50 border-blue-400',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      text: 'text-blue-800',
    },
  };

  const { bg, icon, text } = styles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, rotateX: 90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -15, rotateX: -90 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 1,
      }}
      className={`${bg} ${text} p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[320px] max-w-[420px] border backdrop-blur-sm relative`}
    >
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
        {icon}
      </motion.div>
      <motion.span
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm font-medium flex-1 pr-2"
      >
        {message}
      </motion.span>
      <button
        onClick={onClose}
        className={`${text} hover:bg-black/5 p-1 rounded-full transition-colors`}
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['error', 'success', 'warning', 'info']),
  onClose: PropTypes.func.isRequired,
};

export default Toast;
