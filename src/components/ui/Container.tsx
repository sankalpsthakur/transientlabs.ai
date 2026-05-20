import { cn } from "@/lib/utils";
import React from "react";

type ContainerVariant = 'default' | 'reading';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    width?: ContainerVariant;
}

const VARIANT_CLASS: Record<ContainerVariant, string> = {
    default: 'max-w-7xl',
    reading: 'max-w-3xl',
};

export function Container({ className, children, width = 'default', ...props }: ContainerProps) {
    return (
        <div
            data-container={width}
            className={cn('mx-auto px-4 sm:px-6 lg:px-8', VARIANT_CLASS[width], className)}
            {...props}
        >
            {children}
        </div>
    );
}
