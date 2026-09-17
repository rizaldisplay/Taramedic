'use client';

/**
 * Optional port of the idle-timer half of app.js's `kioskShell` Alpine
 * component (the printer half is `useReceiptPrinter`). The original called
 * `this.$wire?.resetKiosk?.()` — a Livewire-specific hook — so this version
 * takes a plain `onIdle` callback instead, and lets the caller decide when
 * the timer should be suspended (the original's `if ($wire?.issuedTicket) return`).
 */

import { useEffect, useRef } from 'react';

export interface UseIdleResetOptions {
  /** Seconds of inactivity before `onIdle` fires. */
  idleSeconds: number;
  /** Called once the idle timer elapses. */
  onIdle: () => void;
  /**
   * When false, the timer is cleared and not restarted — mirrors the
   * original's early-return while a ticket is being shown.
   */
  active?: boolean;
}

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart'];

export function useIdleReset({ idleSeconds, onIdle, active = true }: UseIdleResetOptions): { resetIdle: () => void } {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = useRef(onIdle);
  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  const resetIdle = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!active) {
      return;
    }

    timerRef.current = setTimeout(() => {
      onIdleRef.current();
    }, idleSeconds * 1000);
  };

  useEffect(() => {
    resetIdle();

    ACTIVITY_EVENTS.forEach((eventName) => window.addEventListener(eventName, resetIdle));

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      ACTIVITY_EVENTS.forEach((eventName) => window.removeEventListener(eventName, resetIdle));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idleSeconds, active]);

  return { resetIdle };
}