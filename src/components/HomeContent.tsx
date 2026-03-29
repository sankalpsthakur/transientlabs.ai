'use client';

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { CaseStudies } from "@/components/sections/CaseStudies";

import { PainPoints } from "@/components/sections/PainPoints";
import { Advantage } from "@/components/sections/Advantage";
import { AgentTeams } from "@/components/sections/AgentTeams";
import { GameTheory } from "@/components/sections/GameTheory";
import { Services } from "@/components/sections/Services";
import { FAQ } from "@/components/sections/FAQ";
import { ContactModal } from "@/components/sections/ContactModal";
import { ContactModalProvider, useContactModal } from "@/lib/contact-modal-context";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { ScrollProgressBar, SectionIndicators } from "@/components/motion/ScrollProgress";
import { WaveDivider } from "@/components/motion/WaveDivider";

import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";

function ModalRenderer() {
    const { isOpen, close } = useContactModal();
    return <ContactModal isOpen={isOpen} onClose={close} />;
}

export function HomeContent() {
    return (
        <MotionProvider>
            <ContactModalProvider>
                <ScrollProgressBar className="z-[60]" />
                <SectionIndicators sections={['work', 'approach', 'edge', 'agent-teams', 'game-theory', 'services', 'faq']} />
                <div className="min-h-screen flex flex-col font-sans bg-paper text-ink selection:bg-accent selection:text-white">
                    <Header />
                    <main className="flex-grow pb-[72px] md:pb-0">
                        <Hero />
                        <WaveDivider variant="accent" />
                        <CaseStudies />
                        <WaveDivider variant="subtle" />
                        <PainPoints />
                        <WaveDivider variant="subtle" />
                        <Advantage />
                        <WaveDivider variant="default" />
                        <AgentTeams />
                        <GameTheory />
                        <WaveDivider variant="default" />
                        <Services />
                        <WaveDivider variant="default" />
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
