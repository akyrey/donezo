import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const cfg = typeof window !== 'undefined' ? window.__CONFIG__ : null;
const key = cfg?.reverbAppKey ?? null;

const echo = key
  ? new Echo({
      broadcaster: 'reverb',
      key,
      wsHost: cfg?.reverbHost ?? '',
      wsPort: cfg?.reverbPort ?? 80,
      wssPort: cfg?.reverbPort ?? 443,
      forceTLS: (cfg?.reverbScheme ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss'],
    })
  : null;

export default echo;
