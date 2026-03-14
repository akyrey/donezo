import React from 'react';

interface GuestLayoutProps {
    children: React.ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-bg-secondary text-text px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-text">
                        Donezo
                    </h1>
                    <p className="mt-1 text-sm text-text-tertiary">
                        Get things done, beautifully.
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-xl border border-border bg-bg p-8 shadow-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}
