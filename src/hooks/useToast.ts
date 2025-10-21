import { useState, useCallback } from 'react';
import { AlertColor } from '@mui/material';

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface UseToastReturn {
  toastState: ToastState;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  hideToast: () => void;
}

/**
 * Custom hook for managing toast notifications
 * Provides methods to show success, error, warning, and info toasts
 * 
 * @example
 * const { toastState, showSuccess, showError, hideToast } = useToast();
 * 
 * // Show success message
 * showSuccess('Project created successfully!');
 * 
 * // Show error message
 * showError('Failed to delete project');
 */
export const useToast = (): UseToastReturn => {
  const [toastState, setToastState] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showToast = useCallback((message: string, severity: AlertColor) => {
    setToastState({
      open: true,
      message,
      severity,
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, 'success');
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, 'error');
  }, [showToast]);

  const showWarning = useCallback((message: string) => {
    showToast(message, 'warning');
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast(message, 'info');
  }, [showToast]);

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    toastState,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
  };
};
