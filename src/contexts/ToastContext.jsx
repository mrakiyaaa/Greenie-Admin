import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Toast from '../components/ui/Toast';
import { motion } from 'framer-motion';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-3 pointer-events-none">
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, scale: 0.85, x: 100 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              transition: {
                type: 'spring',
                stiffness: 500,
                damping: 30,
                mass: 1,
                delay: index * 0.1,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.85,
              x: 100,
              transition: {
                duration: 0.2,
                ease: 'easeOut',
              },
            }}
            className="pointer-events-auto"
          >
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          </motion.div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
