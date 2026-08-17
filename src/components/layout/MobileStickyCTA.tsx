'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useContactModal } from '@/lib/contact-modal-context';

export function MobileStickyCTA() {
    const [visible, setVisible] = useState(false);
    const { open } = useContactModal();

    useEffect(() => {
        const hero = document.getElementById('hero');
        if (!hero) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setVisible(!entry.isIntersecting);
            },
            { threshold: 0 }
        );

        observer.observe(hero);
        return () => observer.disconnect();
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <m.div
                    initial={{ y: 80 }}
                    animate={{ y: 0 }}
                    exit={{ y: 80 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-paper/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center justify-between gap-3"
                >
                    <Button variant="primary" size="sm" className="flex-1" onClick={open}>
                        Request a Call
                    </Button>
                    <button
                        type="button"
                        className="text-sm text-ink hover:text-accent underline-offset-4 hover:underline whitespace-nowrap min-h-11 px-2"
                        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        See Pricing
                    </button>
                </m.div>
            )}
        </AnimatePresence>
    );
}
