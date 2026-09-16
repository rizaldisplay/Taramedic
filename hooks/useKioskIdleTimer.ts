'use client';

/**
 * Port of the idle-timer half of Alpine's `kioskShell` (app.js):
 *
 *   idleTimer: null,
 *   idleSeconds: ...,
 *   async boot() { await this.init(); this.resetIdle(); },
 *   resetIdle() {
 *       clearTimeout(this.idleTimer);
 *       if (this.$wire?.issuedTicket) return;
 *       this.idleTimer = setTimeout(() => this.$wire?.resetKiosk?.(), this.idleSeconds * 1000);
 *   },
 *
 * Two things had no Next.js equivalent and are now explicit inputs instead:
 *  - `$wire?.resetKiosk?.()` (a Livewire component method call) becomes the
 *    `onIdle` callback — wire it to whatever "go back to the idle screen"
 *    means in your app (router push, state reset, etc).
 *  - `$wire?.issuedTicket` (a Livewire property read) becomes `isPaused` —
 *    pass `true` while a ticket/success screen is showing so the idle timer
 *    doesn't fire underneath it.
 *
 * The original Blade template must have wired `resetIdle()` to some user
 * activity somewhere off-screen (that markup wasn't part of what you
 * uploaded). This port makes that explicit via `resetOnActivity`, which
 * defaults to on and listens for pointerdown/keydown/touchstart on `window`.
 */

import { useCallback, useEffect, useRef } from 'react';

export interface UseKioskIdleTimerOptions {
    /** Seconds of inactivity before `onIdle` fires. Defaults to 60. */
    idleSeconds?: number;
    /** While true, the timer is cleared and not restarted (e.g. ticket screen showing). */
    isPaused?: boolean;
    /** Called when the idle timeout elapses. */
    onIdle: () => void;
    /** Auto-reset the timer on pointer/keyboard/touch activity. Defaults to true. */
    resetOnActivity?: boolean;
}

export interface UseKioskIdleTimerResult {
    /** Clears and restarts the idle timer (call this on any user interaction). */
    resetIdle: () => void;
}

export function useKioskIdleTimer({
    idleSeconds = 60,
    isPaused = false,
    onIdle,
    resetOnActivity = true,
}: UseKioskIdleTimerOptions): UseKioskIdleTimerResult {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onIdleRef = useRef(onIdle);
    onIdleRef.current = onIdle;

    const resetIdle = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (isPaused) {
            return;
        }

        timerRef.current = setTimeout(() => {
            onIdleRef.current();
        }, idleSeconds * 1000);
    }, [idleSeconds, isPaused]);

    // Mirrors boot(): start the timer as soon as this mounts (or whenever
    // idleSeconds/isPaused change), and always clear on unmount.
    useEffect(() => {
        resetIdle();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [resetIdle]);

    useEffect(() => {
        if (!resetOnActivity) {
            return;
        }

        const handleActivity = () => resetIdle();
        const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart'];

        events.forEach((eventName) => window.addEventListener(eventName, handleActivity));

        return () => {
            events.forEach((eventName) => window.removeEventListener(eventName, handleActivity));
        };
    }, [resetOnActivity, resetIdle]);

    return { resetIdle };
}