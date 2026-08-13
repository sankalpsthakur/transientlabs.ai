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
    // Vertical rhythm was py-16..28. Tightened one step across the board as part of
    // the landing compression; sections still breathe, the page is a viewport shorter.
    return (
        <section
            ref={ref}
            className={cn("py-12 sm:py-14 md:py-16 lg:py-20", className)}
            {...props}
        >
            {children}
        </section>
    );
});
