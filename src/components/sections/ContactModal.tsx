'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const services = [
    {
        id: 'sprint-mvp',
        title: 'Sprint MVP',
        duration: '3 weeks',
        price: '$4,999',
        description: 'AI-ready MVP build (Fixed scope)',
    },
    {
        duration: 'Monthly',
        id: 'fractional-cto',
        title: 'Fractional CTO',
        price: '$9,999/mo',
        description: 'AI product leadership, architecture, and reviews',
    },
    {
        id: 'custom-scope',
        title: 'Custom Scope',
        duration: 'Custom',
        price: 'Custom',
        description: 'Larger builds, mobile, and complex AI integrations',
    },
    {
        id: 'other',
        title: 'Other / Not Sure',
        duration: '—',
        price: '—',
        description: "Let's discuss your project",
    },
];

const industries = [
    'Fintech & Payments',
    'Healthcare & Biotech',
    'Energy & Utilities',
    'Manufacturing & Industrial',
    'SaaS & Developer Tools',
    'AI/ML & Data Platforms',
    'E-commerce & Marketplaces',
    'Other',
];

const budgetRanges = [
    'Sprint ($4,999)',
    '$10,000 – $25,000',
    '$25,000 – $75,000',
    '$75,000+',
    "Let's discuss",
];

const timelines = [
    'Urgent (within 2 weeks)',
    '1-3 months',
    '3-6 months',
    'Just exploring',
];

interface FormData {
    name: string;
    email: string;
    company: string;
    role: string;
    service: string;
    industry: string;
    brief: string;
    docsLink: string;
    budget: string;
    timeline: string;
    hasPrototype: 'yes' | 'no' | '';
    prototypeDetails: string;
    alternativeContact: string;
    honeypot: string;
}

const initialFormData: FormData = {
    name: '',
    email: '',
    company: '',
    role: '',
    service: '',
    industry: '',
    brief: '',
    docsLink: '',
    budget: '',
    timeline: '',
    hasPrototype: '',
    prototypeDetails: '',
    alternativeContact: '',
    honeypot: '',
};

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const formStartedRef = useRef(false);

    const handleFormFocus = () => {
        if (!formStartedRef.current) {
            formStartedRef.current = true;
            trackEvent('form_start', { form_name: 'contact' });
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceSelect = (serviceId: string) => {
        setFormData(prev => ({ ...prev, service: serviceId }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.honeypot) {
            setStatus('success');
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Something went wrong. Please try again or reach out directly.');
            }

            trackEvent('form_submit', { form_name: 'contact', service: formData.service || undefined });
            trackEvent('generate_lead', {
                method: 'contact_form',
                service: formData.service || undefined,
                industry: formData.industry || undefined,
                budget: formData.budget || undefined,
                timeline: formData.timeline || undefined,
            });

            setStatus('success');
            setFormData(initialFormData);
        } catch {
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again or reach out directly.');
        }
    };

    const handleClose = () => {
        if (status === 'success') {
            setStatus('idle');
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto">
	                {status === 'success' ? (
	                    <div className="text-center py-12">
	                        <div className="w-16 h-16 bg-ink text-paper rounded-full flex items-center justify-center mx-auto mb-6">
	                            <Check className="w-8 h-8" />
	                        </div>
	                        <h2 className="text-2xl font-semibold text-ink mb-4">
	                            Request received
	                        </h2>
		                        <p className="text-ink-light mb-8">
		                            We&apos;ll reply within 24 hours with a free quote and available slots.
		                        </p>
	                        <Button variant="secondary" onClick={handleClose}>
	                            Close
	                        </Button>
	                    </div>
                ) : (
                    <>
	                        <div className="mb-8">
	                            <p className="text-sm text-ink-muted mb-2">Work With Us</p>
	                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-2">
	                                Request a Call
	                            </h2>
	                            <p className="text-ink-light text-sm">
	                                Quick discovery call. We’ll confirm fit, scope, and next available sprint slot.
	                            </p>
	                        </div>

                        <form onSubmit={handleSubmit} onFocus={handleFormFocus} className="space-y-8">
                            {/* About You */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wide">
                                    About You
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm text-ink-muted mb-1.5">
                                            Name <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white border border-border rounded-none text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm text-ink-muted mb-1.5">
                                            Email <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white border border-border rounded-none text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors"
                                            placeholder="you@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="company" className="block text-sm text-ink-muted mb-1.5">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white border border-border rounded-none text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors"
                                            placeholder="Company name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="role" className="block text-sm text-ink-muted mb-1.5">
                                            Your Role
                                        </label>
                                        <input
                                            type="text"
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white border border-border rounded-none text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors"
                                            placeholder="e.g. Founder, CTO"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Service Selection */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wide">
                                    What are you looking for? <span className="text-accent">*</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {services.map((service) => (
                                        <button
                                            key={service.id}
                                            type="button"
                                            onClick={() => handleServiceSelect(service.id)}
                                            className={`p-4 text-left border transition-all ${formData.service === service.id
                                                ? 'border-ink bg-paper-warm'
                                                : 'border-border bg-white hover:border-ink-muted'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-medium text-ink text-sm">{service.title}</h4>
                                                {formData.service === service.id && (
                                                    <Check className="w-4 h-4 text-ink flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-ink-muted">
                                                {service.duration} · {service.price}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-medium text-ink-muted uppercase tracking-wide">
                                    Your Project
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
	                                    <div>
	                                        <label htmlFor="industry" className="block text-sm text-ink-muted mb-1.5">
	                                            Industry <span className="text-ink-muted">(optional)</span>
	                                        </label>
	                                        <select
	                                            id="industry"
	                                            name="industry"
	                                            value={formData.industry}
	                                            onChange={handleChange}
	                                            className="w-full px-3 py-2.5 bg-white border border-border rounded-none text-ink text-sm focus:outline-none focus:border-ink transition-colors appearance-none cursor-pointer"
	                                        >
                                            <option value="">Select industry</option>
                                            {industries.map((industry) => (
                                                <option key={industry} value={industry}>
                                                    {industry}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
	                                    <div>
	                                        <label htmlFor="budget" className="block text-sm text-ink-muted mb-1.5">
	                                            Budget Range <span className="text-ink-muted">(optional)</span>
	                                        </label>
	                                        <select
	                                            id="budget"
	                                            name="budget"
	                                            value={formData.budget}
	                                            onChange={handleChange}
	                                            className="w-full px-3 py-2.5 bg-white border border-border rounded-none text-ink text-sm focus:outline-none focus:border-ink transition-colors appearance-none cursor-pointer"
	                                        >
                                            <option value="">Select budget</option>
                                            {budgetRanges.map((range) => (
                                                <option key={range} value={range}>
                                                    {range}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="brief" className="block text-sm text-ink-muted mb-1.5">
                                        Project Brief <span className="text-accent">*</span>
                                    </label>
                                    <textarea
                                        id="brief"
                                        name="brief"
                                        required
                                        rows={3}
                                        value={formData.brief}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2.5 bg-white border border-border rounded-none text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors resize-none"
                                        placeholder="Tell us about your project—context, goals, and any technical requirements"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="docsLink" className="block text-sm text-ink-muted mb-1.5">
                                            Documentation Link
                                        </label>
                                        <input
                                            type="url"
                                            id="docsLink"
                                            name="docsLink"
                                            value={formData.docsLink}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white border border-border rounded-none text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors"
                                            placeholder="Notion, Google Doc, Figma"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="timeline" className="block text-sm text-ink-muted mb-1.5">
                                            Timeline
                                        </label>
                                        <select
                                            id="timeline"
                                            name="timeline"
                                            value={formData.timeline}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white border border-border rounded-none text-ink text-sm focus:outline-none focus:border-ink transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="">When do you need this?</option>
                                            {timelines.map((timeline) => (
                                                <option key={timeline} value={timeline}>
                                                    {timeline}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <p className="block text-sm text-ink-muted mb-2">
                                        Have you built a prototype?
                                    </p>
                                    <div className="flex gap-4 mb-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="hasPrototype"
                                                value="yes"
                                                checked={formData.hasPrototype === 'yes'}
                                                onChange={handleChange}
                                                className="w-4 h-4 accent-ink"
                                            />
                                            <span className="text-sm text-ink">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="hasPrototype"
                                                value="no"
                                                checked={formData.hasPrototype === 'no'}
                                                onChange={handleChange}
                                                className="w-4 h-4 accent-ink"
                                            />
                                            <span className="text-sm text-ink">No</span>
                                        </label>
                                    </div>
                                    {formData.hasPrototype === 'yes' && (
                                        <input
                                            type="text"
                                            name="prototypeDetails"
                                            value={formData.prototypeDetails}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-white border border-border rounded-none text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors"
                                            placeholder="Share a link or brief description"
                                        />
                                    )}
                                </div>
                            </div>

	                            {/* Alternative Contact */}
	                            <div>
	                                <label htmlFor="alternativeContact" className="block text-sm text-ink-muted mb-1.5">
	                                    Alternative Contact <span className="text-ink-muted">(optional)</span>
	                                </label>
	                                <input
	                                    type="text"
	                                    id="alternativeContact"
	                                    name="alternativeContact"
	                                    value={formData.alternativeContact}
	                                    onChange={handleChange}
	                                    className="w-full px-3 py-2.5 bg-white border border-border rounded-none text-ink text-sm placeholder:text-ink-muted/50 focus:outline-none focus:border-ink transition-colors"
	                                    placeholder="WhatsApp, X (@handle), or LinkedIn"
                                />
                                <p className="text-xs text-ink-muted mt-1.5">
                                    Emails sometimes land in spam—this helps us reach you.
                                </p>
                            </div>

                            {/* Honeypot */}
                            <input
                                type="text"
                                name="honeypot"
                                value={formData.honeypot}
                                onChange={handleChange}
                                className="absolute -left-[9999px] opacity-0 pointer-events-none"
                                tabIndex={-1}
                                autoComplete="off"
                            />

                            {/* Submit */}
                            <div className="pt-4 border-t border-border">
                                {status === 'error' && (
                                    <p className="text-accent text-sm mb-4">{errorMessage}</p>
                                )}

	                                <Button
	                                    type="submit"
	                                    variant="primary"
	                                    size="lg"
	                                    className="group w-full"
	                                    disabled={status === 'loading' || !formData.service}
	                                >
	                                    {status === 'loading' ? (
	                                        <>
	                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
	                                            Submitting...
	                                        </>
	                                    ) : (
	                                        <>
	                                            Request a Call
	                                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
	                                        </>
	                                    )}
	                                </Button>

			                                <p className="text-xs text-ink-muted mt-3 text-center">
			                                    No spam. We reply within 24 hours with a free quote and available slots.
			                                </p>
		                            </div>
		                        </form>
		                    </>
                )}
            </div>
        </Modal>
    );
}
