'use client';

import { useContactModal } from "@/lib/contact-modal-context";
import { ContactModal } from "@/components/sections/ContactModal";

export function ContentSiteLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, close, service } = useContactModal();
  return (
    <>
      {children}
      <ContactModal isOpen={isOpen} onClose={close} service={service} />
    </>
  );
}
