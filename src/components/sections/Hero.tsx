'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useContactModal } from '@/lib/contact-modal-context';
import { trackEvent } from '@/lib/analytics';
import { FadeIn } from '@/components/ui/Motion';
import { useReducedMotion } from 'framer-motion';

const BG_OPTIONS = [
  { type: 'video' as const, src: '/videos/hero-video.mp4', label: 'Video — Particle lines' },
  { type: 'image' as const, src: '/images/hero-options/hero-bg-1.png', label: 'Light trails' },
  { type: 'image' as const, src: '/images/hero-options/hero-bg-2.png', label: 'Neural network' },
  { type: 'image' as const, src: '/images/hero-options/hero-bg-3.png', label: 'Volumetric smoke' },
];

export function Hero() {
  const [email, setEmail] = useState('');
  const [bgIndex, setBgIndex] = useState(0);
  const { open } = useContactModal();
  const prefersReducedMotion = useReducedMotion();
  const bg = BG_OPTIONS[bgIndex];

  const videoRef = useRef<HTMLVideoElement>(null);
  const animFrameRef = useRef<number>(0);
  const fadingOutRef = useRef(false);
  const opacityRef = useRef(0);

  const fadeTo = useCallback((target: number, duration: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const start = opacityRef.current;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + (target - start) * progress;
      opacityRef.current = current;
      if (videoRef.current) {
        videoRef.current.style.opacity = String(current);
      }
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      }
    }

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('cta_click', { cta_text: 'Email Submit', cta_location: 'hero' });
    open(email);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-black overflow-hidden flex flex-col"
    >
      {/* Background — Video or Image */}
      {!prefersReducedMotion && bg.type === 'video' && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover translate-y-[17%] brightness-[0.4]"
          muted
          autoPlay
          playsInline
          preload="auto"
          loop={false}
          src={bg.src}
          style={{ opacity: 0 }}
          onCanPlay={() => fadeTo(1, 500)}
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            if (
              video.duration - video.currentTime <= 0.55 &&
              !fadingOutRef.current
            ) {
              fadingOutRef.current = true;
              fadeTo(0, 500);
            }
          }}
          onEnded={(e) => {
            const video = e.currentTarget;
            video.style.opacity = '0';
            opacityRef.current = 0;
            setTimeout(() => {
              video.currentTime = 0;
              video.play();
              fadeTo(1, 500);
              fadingOutRef.current = false;
            }, 100);
          }}
        />
      )}
      {bg.type === 'image' && (
        <img
          src={bg.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
        />
      )}

      {/* Dark scrim over video for text readability */}
      <div className="absolute inset-0 z-[1] bg-black/70" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[5%]">
        <FadeIn delay={0.2}>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            We ship AI Agents<br />
            <span className="text-white/80">that boost margins</span><br />
            <span className="text-white/60">in weeks, not months.</span>
          </h1>

          {/* Email Input Bar */}
          <div className="max-w-xl w-full space-y-4">
            <form
              onSubmit={handleSubmit}
              className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3 bg-white/[0.08]"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-colors"
                aria-label="Submit email"
              >
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Subtitle */}
            <p className="text-white/70 text-sm leading-relaxed px-4">
              Agentic systems that ship fast, scale clean, and pass audit. From architecture to SOC2.
            </p>

            {/* Secondary CTA */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  trackEvent('cta_click', { cta_text: 'Our Approach', cta_location: 'hero' });
                  document.getElementById('approach')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium bg-white/[0.06] hover:bg-white/10 transition-colors"
              >
                Our Approach
              </button>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/50 z-10 pointer-events-none" />

      {/* Background Switcher (dev only — remove before shipping) */}
      <div className="absolute bottom-6 left-6 z-50 flex flex-col gap-2">
        {BG_OPTIONS.map((opt, i) => (
          <button
            key={opt.src}
            onClick={() => setBgIndex(i)}
            className={`text-left text-xs px-3 py-2 rounded-lg transition-all ${
              i === bgIndex
                ? 'bg-white text-black font-medium'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {i + 1}. {opt.label}
          </button>
        ))}
      </div>
    </section>
  );
}
