import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'bg-primary text-white',
                secondary: 'bg-bg-secondary text-text-secondary',
                outline: 'border border-border text-text-secondary',
                destructive: 'bg-danger text-white',
                success: 'bg-success text-white',
                warning: 'bg-warning text-white',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
    color?: string;
}

function Badge({ className, variant, color, style, ...props }: BadgeProps) {
    return (
        <div
            className={cn(badgeVariants({ variant }), className)}
            style={color ? { backgroundColor: color, color: '#fff', ...style } : style}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
