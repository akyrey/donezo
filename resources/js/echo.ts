import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const key = import.meta.env.VITE_REVERB_APP_KEY as string | undefined;

const echo = key
  ? new Echo({
      broadcaster: 'reverb',
      key,
      wsHost: import.meta.env.VITE_REVERB_HOST as string,
      wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
      wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
      forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss'],
    })
  : null;

export default echo;
