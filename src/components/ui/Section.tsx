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
            className={cn("py-24 md:py-32", className)}
            {...props}
        >
            {children}
        </section>
    );
});
