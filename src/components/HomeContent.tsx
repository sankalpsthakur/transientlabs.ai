'use client';

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { BuyerPaths } from "@/components/sections/BuyerPaths";
import { OfferingStages } from "@/components/sections/OfferingStages";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Proof } from "@/components/sections/Proof";
import { Industries } from "@/components/sections/Industries";
import { FAQ } from "@/components/sections/FAQ";
import { ContactModal } from "@/components/sections/ContactModal";
import { ContactModalProvider, useContactModal } from "@/lib/contact-modal-context";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { ScrollProgressBar, SectionIndicators } from "@/components/motion/ScrollProgress";

import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";

function ModalRenderer() {
    const { isOpen, close, service } = useContactModal();
    return <ContactModal isOpen={isOpen} onClose={close} service={service} />;
}

export function HomeContent() {
    return (
        <MotionProvider>
            <ContactModalProvider>
                <ScrollProgressBar className="z-[60]" />
                {/* 'services' now lives inside the merged buyer-paths section. */}
                <SectionIndicators sections={['buyer-paths', 'offerings', 'industries', 'work', 'faq']} />
                <div className="min-h-screen flex flex-col font-sans bg-paper text-ink selection:bg-accent selection:text-white">
                    <Header />
                    <main className="flex-grow overflow-x-clip pb-[72px] md:pb-0">
                        <Hero />
                        <BuyerPaths />
                        <OfferingStages />
                        <Industries />
                        <CaseStudies />
                        <Proof />
                        <FAQ />
                    </main>
                    <Footer />
                    <ModalRenderer />
                    <MobileStickyCTA />
                </div>
            </ContactModalProvider>
        </MotionProvider>
    );
}
