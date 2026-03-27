import { cn } from "@/lib/utils";
import { m, HTMLMotionProps } from "framer-motion";
import { easings } from "@/components/ui/Motion";
import React from "react";

interface CardProps extends Omit<HTMLMotionProps<"div">, 'onDrag'> {
    children: React.ReactNode;
    hover?: boolean;
    lift?: boolean;
    glow?: boolean;
}

export function Card({
    className,
    children,
    hover = true,
    lift = true,
    glow = false,
    ...props
}: CardProps) {
    return (
        <m.div
            className={cn(
                "bg-white border border-border p-6 relative",
                className
            )}
            initial={{ opacity: 1 }}
            whileHover={hover ? {
                borderColor: 'rgba(0,0,0,0.2)',
                ...(lift && { y: -4 }),
                ...(glow && { boxShadow: '0 0 20px rgba(0,0,0,0.1)' }),
            } : {}}
            transition={{
                duration: 0.3,
                ease: easings.easeOutQuint,
            }}
            {...props}
        >
            {hover && (
                <m.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0, boxShadow: '0 8px 24px rgba(0,0,0,0)' }}
                    whileHover={{ opacity: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.3, ease: easings.easeOutQuint }}
                />
            )}
            <div className="relative z-10">{children}</div>
        </m.div>
    );
}

// Card with 3D perspective effect
interface PerspectiveCardProps extends Omit<HTMLMotionProps<"div">, 'onDrag'> {
    children: React.ReactNode;
    className?: string;
    rotateY?: number;
}

export function PerspectiveCard({
    className,
    children,
    rotateY = -5,
    ...props
}: PerspectiveCardProps) {
    return (
        <m.div
            className={cn(
                "bg-white border border-border p-6 relative",
                className
            )}
            initial={{ opacity: 0, rotateY, transformPerspective: 1000 }}
            whileInView={{ opacity: 1, rotateY: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            whileHover={{
                y: -4,
                boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
            }}
            transition={{
                duration: 0.6,
                ease: easings.easeOutQuint,
            }}
            {...props}
        >
            {children}
        </m.div>
    );
}

// Card with gradient border animation
interface GradientBorderCardProps extends Omit<HTMLMotionProps<"div">, 'onDrag'> {
    children: React.ReactNode;
    className?: string;
    gradientColors?: string[];
}

export function GradientBorderCard({
    className,
    children,
    gradientColors = ['#0066ff', '#6366f1', '#0066ff'],
    ...props
}: GradientBorderCardProps) {
    return (
        <m.div
            className={cn(
                "relative p-[1px] rounded-lg overflow-hidden group",
                className
            )}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3, ease: easings.easeOutQuint }}
            {...props}
        >
            {/* Animated gradient border */}
            <m.div
                className="absolute inset-0 rounded-lg"
                style={{
                    background: `linear-gradient(90deg, ${gradientColors.join(', ')})`,
                    backgroundSize: '200% 100%',
                }}
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            {/* Inner content */}
            <div className="relative bg-white p-6 rounded-lg h-full">
                {children}
            </div>
        </m.div>
    );
}
