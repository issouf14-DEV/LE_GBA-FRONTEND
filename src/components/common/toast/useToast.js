import { useContext } from 'react';
import { ToastContext } from '@/components/common/toast/toastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast doit être utilisé dans un ToastProvider');
  return context;
}
