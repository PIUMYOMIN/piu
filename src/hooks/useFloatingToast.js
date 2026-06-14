import { useCallback, useEffect, useState, createElement } from 'react';
import FloatingToast from '../components/admin/FloatingToast';

export function useFloatingToast(autoDismissMs = 3000) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast || !autoDismissMs) return undefined;
    const timer = setTimeout(() => setToast(null), autoDismissMs);
    return () => clearTimeout(timer);
  }, [toast, autoDismissMs]);

  const dismissToast = useCallback(() => setToast(null), []);

  const showToast = useCallback((message, type = 'success') => {
    if (!message) return;
    setToast({ message, type });
  }, []);

  const showSuccess = useCallback((message) => showToast(message, 'success'), [showToast]);
  const showError = useCallback((message) => showToast(message, 'error'), [showToast]);
  const showInfo = useCallback((message) => showToast(message, 'info'), [showToast]);

  const Toast = useCallback(
    () => createElement(FloatingToast, { toast, onDismiss: dismissToast }),
    [toast, dismissToast]
  );

  return {
    toast,
    showToast,
    showSuccess,
    showError,
    showInfo,
    dismissToast,
    Toast,
  };
}
