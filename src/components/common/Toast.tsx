import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface ToastProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
  autoHideDuration?: number;
}

/**
 * Enterprise-level Toast notification component
 * Used for displaying success, error, warning, and info messages
 * 
 * @example
 * <Toast 
 *   open={showToast} 
 *   message="Project created successfully!" 
 *   severity="success"
 *   onClose={() => setShowToast(false)}
 * />
 */
const Toast: React.FC<ToastProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 6000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
        elevation={6}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
