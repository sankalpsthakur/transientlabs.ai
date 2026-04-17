'use client';

import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useContactModal } from "@/lib/contact-modal-context";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { siteBrand } from "@/lib/site-brand";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [isOverHero, setIsOverHero] = useState(false);
    const { open } = useContactModal();
    const prefersReducedMotion = useReducedMotion();

    const navLinks = [
        { href: "#work", label: "Work" },
        { href: "#approach", label: "Approach" },
        { href: "#edge", label: "Edge" },
        { href: "#agent-teams", label: "Teams" },
        { href: "#services", label: "Pricing" },
        { href: "#faq", label: "FAQ" },
    ];

    const handleNavClick = (label: string, href: string) => {
        trackEvent('nav_click', { destination: label, href, location: 'header' });
    };

    const handleCtaClick = () => {
        trackEvent('cta_click', { cta_text: 'Request a Call', cta_location: 'nav' });
    };

    useEffect(() => {
        const sectionIds = ["work", "approach", "edge", "agent-teams", "services", "faq"];
        const elements = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                }
            },
            { threshold: 0.3, rootMargin: "-10% 0px -50% 0px" }
        );

        for (const el of elements) {
            observer.observe(el);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const heroEl = document.getElementById('hero');
        if (!heroEl) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsOverHero(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(heroEl);
        return () => observer.disconnect();
    }, []);

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isOverHero
                ? "bg-transparent"
                : "border-b border-border bg-paper/95 backdrop-blur-md"
        )}>
            <Container>
                <div className="flex h-[4.5rem] items-center justify-between md:h-20">
                    <Link href="/" aria-label="Transient Labs home" className="flex min-w-0 shrink-0 items-center gap-2.5 md:gap-3.5">
                        <BrandLogo
                            variant="symbol"
                            tone={isOverHero ? "dark" : "light"}
                            alt="Transient Labs symbol"
                            className="block h-7 w-7 shrink-0 sm:h-8 sm:w-8 md:h-10 md:w-10"
                        />
                        <div className="min-w-0">
                            <BrandLogo
                                variant="wordmark"
                                tone={isOverHero ? "dark" : "light"}
                                className="block h-[1rem] w-auto max-w-[9rem] sm:h-[1.1rem] sm:max-w-[10rem] md:h-[1.45rem] md:max-w-[13rem]"
                            />
                            <div className={cn(
                                "mt-1 hidden text-[8px] font-medium uppercase tracking-[0.22em] md:block",
                                isOverHero ? "text-white/50" : "text-ink-muted"
                            )}>
                                {siteBrand.descriptor}
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => handleNavClick(link.label, link.href)}
                                className={cn(
                                    "text-sm transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-px after:transition-all after:duration-200",
                                    isOverHero
                                        ? cn(
                                            "after:bg-white",
                                            activeSection === link.href.slice(1)
                                                ? "text-white after:w-full"
                                                : "text-white/60 hover:text-white after:w-0 hover:after:w-full"
                                          )
                                        : cn(
                                            "after:bg-ink",
                                            activeSection === link.href.slice(1)
                                                ? "text-ink after:w-full"
                                                : "text-ink-muted hover:text-ink after:w-0 hover:after:w-full"
                                          )
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isOverHero ? (
                            <button
                                className="liquid-glass rounded-full px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                                onClick={() => { handleCtaClick(); open(); }}
                            >
                                Request a Call
                            </button>
                        ) : (
                            <Button variant="primary" size="sm" onClick={() => { handleCtaClick(); open(); }}>
                                Request a Call
                            </Button>
                        )}
                    </nav>

                    {/* Mobile Menu Button - min 44x44px touch target */}
                    <button
                        className={cn(
                            "md:hidden p-2.5 min-w-11 min-h-11 flex items-center justify-center",
                            isOverHero ? "text-white" : "text-ink"
                        )}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <m.div
                                key={mobileMenuOpen ? "close" : "open"}
                                initial={prefersReducedMotion ? false : { rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </m.div>
                        </AnimatePresence>
                    </button>
                </div>
            </Container>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <m.div
                        className="md:hidden border-t border-border bg-paper overflow-hidden"
                        initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Container>
                            <nav className="py-4 flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "py-3 text-base transition-colors",
                                            activeSection === link.href.slice(1)
                                                ? "text-ink font-medium"
                                                : "text-ink-muted hover:text-ink"
                                        )}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            handleNavClick(link.label, link.href);
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Button
                                    variant="primary"
                                    size="md"
                                    className="mt-4"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleCtaClick();
                                        open();
                                    }}
                                >
                                    Request a Call
                                </Button>
                            </nav>
                        </Container>
                    </m.div>
                )}
            </AnimatePresence>
        </header>
    );
}
