'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ContactModalContextType {
    isOpen: boolean;
    /** Engagement preselected by whichever CTA opened the modal. */
    service: string;
    open: (service?: string) => void;
    close: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [service, setService] = useState('');

    return (
        <ContactModalContext.Provider
            value={{
                isOpen,
                service,
                open: (nextService) => {
                    // Guard against `onClick={open}`, which would otherwise hand us a
                    // MouseEvent and poison the form's engagement field.
                    setService(typeof nextService === 'string' ? nextService : '');
                    setIsOpen(true);
                },
                close: () => setIsOpen(false),
            }}
        >
            {children}
        </ContactModalContext.Provider>
    );
}

export function useContactModal() {
    const context = useContext(ContactModalContext);
    if (!context) {
        throw new Error('useContactModal must be used within ContactModalProvider');
    }
    return context;
}
