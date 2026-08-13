import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { DURATION, EASE } from "@/components/ui/Motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "text";
    size?: "sm" | "md" | "lg";
    asChild?: boolean;
    children: React.ReactNode;
    animate?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", asChild = false, animate = true, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        const buttonContent = (
            <Comp
                ref={ref}
                className={cn(
                    "group inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium tracking-[0.01em] transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50",
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

        // One hover behaviour for every variant: a 1px lift, no scale. The primary
        // button used to grow 1% and sweep a white gradient across itself over
        // 0.65s. Hover shadows are already handled by the variant classes above.
        return (
            <m.div
                className={cn("inline-flex", variant === "secondary" && "group relative")}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                transition={{ duration: DURATION.micro, ease: EASE }}
            >
                {buttonContent}
            </m.div>
        );
    }
);
Button.displayName = "Button";
