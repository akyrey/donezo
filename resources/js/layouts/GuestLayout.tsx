import React from 'react';

interface GuestLayoutProps {
  children: React.ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div className="bg-bg-secondary text-text flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-text text-2xl font-bold tracking-tight">Donezo</h1>
          <p className="text-text-tertiary mt-1 text-sm">Get things done, beautifully.</p>
        </div>

        {/* Card */}
        <div className="border-border bg-bg rounded-xl border p-8 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
