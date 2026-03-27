"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

// Metadata must be in a separate server component; we export it from a wrapper.
// Since this page uses client hooks, metadata is defined in a layout or via generateMetadata elsewhere.
// For now we add a static metadata export (Next.js ignores it on client components but the SEO is handled by layout).

const locations = [
  { city: "Dubai", flag: "🇦🇪", detail: "DIFC & Business Bay" },
  { city: "Bangalore", flag: "🇮🇳", detail: "India Engineering Hub" },
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "General Inquiry",
    brief: "",
    honeypot: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, timestamp: new Date().toISOString() }),
      });
      const data = await res.json();
      if (data.ok) {
        setState("success");
      } else {
        setState("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setErrorMsg("Network error. Please try again or email us directly.");
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="h-16" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-accent mb-4 block">
            Contact
          </span>
          <h1 className="font-mono text-4xl sm:text-5xl font-bold text-ink leading-tight mb-4">
            Let&apos;s build{" "}
            <span className="text-accent">something.</span>
          </h1>
          <p className="text-lg text-ink-muted max-w-2xl">
            Tell us about your idea. We&apos;ll respond within one business day with honest
            thoughts on scope, fit, and timeline.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <div>
            {state === "success" ? (
              <div className="border border-accent/30 bg-accent/5 rounded-2xl p-10 text-center">
                <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                <h2 className="font-mono text-xl font-bold text-ink mb-2">
                  Message received!
                </h2>
                <p className="text-ink-muted mb-6">
                  We&apos;ll be in touch within one business day.
                </p>
                <Link
                  href="/"
                  className="font-mono text-sm text-accent hover:underline"
                >
                  ← Back to home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  value={form.honeypot}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2 block">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full border border-border bg-white px-4 py-3 text-ink placeholder-ink-muted/50 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@startup.com"
                      className="w-full border border-border bg-white px-4 py-3 text-ink placeholder-ink-muted/50 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2 block">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      className="w-full border border-border bg-white px-4 py-3 text-ink placeholder-ink-muted/50 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2 block">
                      What do you need? *
                    </label>
                    <select
                      name="service"
                      required
                      value={form.service}
                      onChange={handleChange}
                      className="w-full border border-border bg-white px-4 py-3 text-ink focus:outline-none focus:border-accent transition-colors"
                    >
                      <option>General Inquiry</option>
                      <option>3-Week AI MVP Sprint</option>
                      <option>AI Integration / Automation</option>
                      <option>Custom AI Development</option>
                      <option>Scoping Call</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2 block">
                    Tell us about your project *
                  </label>
                  <textarea
                    name="brief"
                    required
                    value={form.brief}
                    onChange={handleChange}
                    rows={5}
                    placeholder="What are you building? What's your timeline? What does success look like?"
                    className="w-full border border-border bg-white px-4 py-3 text-ink placeholder-ink-muted/50 focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                {state === "error" && (
                  <div className="flex items-start gap-3 border border-red-200 bg-red-50 rounded-lg p-4 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="inline-flex items-center gap-2 bg-ink text-paper px-8 py-4 font-mono text-sm font-semibold hover:bg-ink/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {state === "submitting" ? (
                    "Sending…"
                  ) : (
                    <>
                      Send message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Email */}
            <div className="border border-border rounded-2xl p-6 bg-white">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  Email
                </span>
              </div>
              <a
                href="mailto:admin@100xai.engineering"
                className="font-mono text-sm text-ink hover:text-accent transition-colors break-all"
              >
                admin@100xai.engineering
              </a>
            </div>

            {/* Locations */}
            <div className="border border-border rounded-2xl p-6 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  Locations
                </span>
              </div>
              <div className="space-y-4">
                {locations.map(({ city, flag, detail }) => (
                  <div key={city}>
                    <p className="font-mono font-bold text-ink text-sm">
                      {flag} {city}
                    </p>
                    <p className="text-xs text-ink-muted">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div className="border border-accent/30 bg-accent/5 rounded-2xl p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
                Response time
              </p>
              <p className="text-sm text-ink-muted">
                We respond to all inquiries within{" "}
                <strong className="text-ink">one business day</strong>. For urgent
                matters, email us directly.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
