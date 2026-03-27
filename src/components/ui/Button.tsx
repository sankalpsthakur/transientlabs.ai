import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { easings } from "@/components/ui/Motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "text";
    size?: "sm" | "md" | "lg";
    asChild?: boolean;
    children: React.ReactNode;
    animate?: boolean;
}

const _easingsSpring = [0.34, 1.56, 0.64, 1] as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", asChild = false, animate = true, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        const buttonContent = (
            <Comp
                ref={ref}
                className={cn(
                    "group inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium tracking-[0.01em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50",
                    "relative overflow-hidden rounded-full border",

                    variant === "primary" && [
                        "border-ink/90 bg-ink text-paper shadow-[0_12px_28px_rgba(24,18,13,0.14)]",
                        "hover:border-ink hover:bg-[#221913] hover:shadow-[0_16px_34px_rgba(24,18,13,0.16)]",
                        "active:bg-[#14100c] active:shadow-[0_8px_18px_rgba(24,18,13,0.12)]",
                        "btn-lift",
                    ],
                    variant === "secondary" && [
                        "border-border bg-paper-warm/80 text-ink shadow-[0_8px_18px_rgba(24,18,13,0.06)]",
                        "group-hover:border-ink group-hover:bg-ink group-hover:text-paper",
                        "hover:border-ink/20 hover:shadow-[0_12px_24px_rgba(24,18,13,0.08)]",
                        "active:bg-[#f0e7da] active:shadow-[0_6px_14px_rgba(24,18,13,0.05)]",
                        "btn-lift",
                    ],
                    variant === "outline" && [
                        "border-border bg-transparent text-ink",
                        "hover:border-ink/60 hover:bg-paper-warm/60 hover:shadow-[0_10px_20px_rgba(24,18,13,0.06)]",
                        "active:bg-paper-warm/80",
                        "btn-lift",
                    ],
                    variant === "ghost" && [
                        "border-transparent bg-transparent text-ink-muted hover:border-border hover:bg-paper-warm/60 hover:text-ink",
                    ],
                    variant === "text" && [
                        "border-transparent bg-transparent px-0 text-ink-muted hover:text-ink",
                        "underline-offset-4 hover:underline link-animated",
                    ],

                    size === "sm" && "h-10 px-4 text-xs min-w-11",
                    size === "md" && "h-11 px-5 text-sm min-w-11",
                    size === "lg" && "h-12 px-6 text-sm md:text-base min-w-14",
                    className
                )}
                {...props}
            />
        );

        if (!animate) {
            return buttonContent;
        }

        if (variant === "primary") {
            return (
                <m.div
                    className="inline-flex"
                    whileHover={{ y: -1, scale: 1.01 }}
                    whileTap={{ y: 1, scale: 0.985 }}
                    transition={{ duration: 0.18, ease: easings.easeOutQuint }}
                >
                    <m.div
                        className="relative"
                        whileHover={{ boxShadow: "0 18px 32px rgba(24,18,13,0.12)" }}
                        transition={{ duration: 0.2, ease: easings.easeOutQuint }}
                    >
                        {buttonContent}
                        <m.div
                            className="pointer-events-none absolute inset-0"
                            initial={{ opacity: 0, x: "-120%" }}
                            whileHover={{ opacity: 1, x: "120%" }}
                            transition={{ duration: 0.65, ease: easings.easeOutQuint }}
                            style={{
                                background:
                                    "linear-gradient(110deg, transparent 18%, rgba(255,255,255,0.22) 50%, transparent 82%)",
                            }}
                        />
                    </m.div>
                </m.div>
            );
        }

        if (variant === "secondary") {
            return (
                <m.div
                    className="group inline-flex relative"
                    whileHover={{ y: -1, scale: 1.01 }}
                    whileTap={{ y: 1, scale: 0.987 }}
                    transition={{ duration: 0.18, ease: easings.easeOutQuint }}
                >
                    {buttonContent}
                </m.div>
            );
        }

        return (
            <m.div
                className="inline-flex"
                whileHover={{ y: -1, scale: 1.005 }}
                whileTap={{ y: 1, scale: 0.99 }}
                transition={{ duration: 0.18, ease: easings.easeOutQuint }}
            >
                {buttonContent}
            </m.div>
        );
    }
);
Button.displayName = "Button";
