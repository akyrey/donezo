import '../css/app.css';

import {createInertiaApp} from '@inertiajs/react';
import {createRoot} from 'react-dom/client';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

const appName = import.meta.env.VITE_APP_NAME || 'Donezo';

const queryClient = new QueryClient();

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({el, App, props}) {
        const root = createRoot(el);
        const appElement = (
            <QueryClientProvider client={queryClient}>
                <App {...props} />
                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
        );

        root.render(appElement);
    },
});
