import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    error: 'bg-red-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100',
  }[type];

  const textColor = {
    error: 'text-red',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`${bgColor} ${textColor} p-4 rounded-lg shadow-lg flex items-center gap-2 min-w-[300px] max-w-[400px]`}
    >
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70 transition-opacity">
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
