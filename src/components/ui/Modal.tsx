'use client';

import { useEffect, useCallback, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;
        const previousFocus = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        let frame = 0;
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
            frame = requestAnimationFrame(() => {
                const target = dialogRef.current?.querySelector<HTMLElement>('input:not([aria-hidden="true"])');
                (target ?? dialogRef.current)?.focus();
            });
        }
        return () => {
            cancelAnimationFrame(frame);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
            previousFocus?.focus();
        };
    }, [isOpen, handleEscape]);

    const containFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key !== 'Tab') return;
        const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([aria-hidden="true"]), select, textarea, a[href]');
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };

    if (typeof window === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
                    {/* Backdrop */}
                    <m.div
                        aria-hidden="true"
                        initial={reducedMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.2 }}
                        className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <m.div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Project enquiry"
                        tabIndex={-1}
                        onKeyDown={containFocus}
                        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: reducedMotion ? 0 : 0.2, ease: 'easeOut' }}
                        className="relative w-full max-w-3xl mx-4 my-8 bg-paper shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2.5 min-w-11 min-h-11 flex items-center justify-center text-ink-muted hover:text-ink transition-colors z-10"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        {children}
                    </m.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
