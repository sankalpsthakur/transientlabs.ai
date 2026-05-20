import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section({
    className,
    children,
    ...props
}, ref) {
    return (
        <section
            ref={ref}
            className={cn("py-16 sm:py-20 md:py-24 lg:py-28", className)}
            {...props}
        >
            {children}
        </section>
    );
});
