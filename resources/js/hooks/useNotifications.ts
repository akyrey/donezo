import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface UseNotificationsReturn {
  permission: NotificationPermission;
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray as Uint8Array<ArrayBuffer>;
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default',
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window;

  // Check existing subscription on mount
  useEffect(() => {
    if (!isSupported) return;

    async function checkSubscription() {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(subscription !== null);
      } catch {
        // Service worker not registered yet
      }
    }

    checkSubscription();
  }, [isSupported]);

  const subscribe = useCallback(async () => {
    if (!isSupported) return;

    setIsLoading(true);

    try {
      // Request notification permission
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== 'granted') {
        setIsLoading(false);
        return;
      }

      // Wait for SW to be ready (registered globally in app.tsx), with a 10s timeout
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Service worker timed out')), 10_000),
        ),
      ]);

      // Get VAPID public key
      const vapidKey = window.__CONFIG__?.vapidPublicKey;
      if (!vapidKey) {
        console.error('VAPID public key not configured');
        setIsLoading(false);
        return;
      }

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const subscriptionJson = subscription.toJSON();

      // Send subscription to backend
      await axios.post('/api/v1/push-subscriptions', {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscriptionJson.keys?.p256dh ?? '',
          auth: subscriptionJson.keys?.auth ?? '',
        },
        content_encoding: (PushManager.supportedContentEncodings ?? ['aesgcm'])[0],
      });

      setIsSubscribed(true);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return;

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe locally
        await subscription.unsubscribe();

        // Remove from backend
        await axios.delete('/api/v1/push-subscriptions', {
          data: { endpoint: subscription.endpoint },
        });
      }

      setIsSubscribed(false);
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return {
    permission,
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  };
}
