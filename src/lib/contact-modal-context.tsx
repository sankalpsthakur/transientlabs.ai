'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ContactModalContextType {
    isOpen: boolean;
    prefillEmail: string;
    open: (emailOrEvent?: string | unknown) => void;
    close: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [prefillEmail, setPrefillEmail] = useState('');

    return (
        <ContactModalContext.Provider
            value={{
                isOpen,
                prefillEmail,
                open: (emailOrEvent?: string | unknown) => {
                    if (typeof emailOrEvent === 'string' && emailOrEvent) setPrefillEmail(emailOrEvent);
                    setIsOpen(true);
                },
                close: () => {
                    setIsOpen(false);
                    setPrefillEmail('');
                },
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
