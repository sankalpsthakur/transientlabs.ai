'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ContactModalContextType {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | null>(null);

export function ContactModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ContactModalContext.Provider
            value={{
                isOpen,
                open: () => setIsOpen(true),
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
