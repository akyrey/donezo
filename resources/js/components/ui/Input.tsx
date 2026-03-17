import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Extra classes applied to the outer wrapper div (useful for flex-1, min-w-0, etc.) */
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, wrapperClassName, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-text text-sm font-medium">
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'border-border bg-bg text-text flex h-9 w-full rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-text-tertiary',
            'focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus-visible:ring-danger/50',
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-danger text-xs">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
