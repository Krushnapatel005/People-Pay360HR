'use client';
import { useState, useEffect, useCallback } from 'react';

export function useUnsavedChanges(isDirty: boolean) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Browser unload warning
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Guard a navigation / action with an in-app confirm dialog
  const guardAction = useCallback(
    (action: () => void) => {
      if (isDirty) {
        setPendingAction(() => action);
        setShowConfirm(true);
      } else {
        action();
      }
    },
    [isDirty]
  );

  const confirmLeave = useCallback(() => {
    setShowConfirm(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const cancelLeave = useCallback(() => {
    setShowConfirm(false);
    setPendingAction(null);
  }, []);

  return { showConfirm, guardAction, confirmLeave, cancelLeave };
}
