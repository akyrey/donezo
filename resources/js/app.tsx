import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/components/ThemeProvider';
import { showToast } from '@/lib/toast';
import axios from '@/lib/axios';

// Register the service worker for PWA support (push notifications + offline caching)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}

const appName = import.meta.env.VITE_APP_NAME || 'Donezo';

/**
 * Extract a human-readable message from any thrown value.
 * Handles Axios errors (JSON API responses) and plain Error objects.
 */
function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;

    if (data?.message) return data.message;

    // Laravel validation errors — join the first error from each field
    if (data?.errors) {
      const first = Object.values(data.errors).flat()[0];
      if (first) return first;
    }
  }

  if (error instanceof Error) return error.message;

  return 'Something went wrong. Please try again.';
}

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError(error) {
        showToast(extractErrorMessage(error), 'error');
      },
    },
  },
});

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) =>
    resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);
    const appElement = (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <App {...props} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    );

    root.render(appElement);
  },
});
