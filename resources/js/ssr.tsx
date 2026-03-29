import { createInertiaApp } from '@inertiajs/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { useState } from 'react';

const appName = process.env.APP_NAME || 'Donezo';

export default createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<
      string,
      { default: React.ComponentType }
    >;
    return pages[`./pages/${name}.tsx`];
  },
  setup: ({ App, props }) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
      <QueryClientProvider client={queryClient}>
        <App {...props} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  },
});
