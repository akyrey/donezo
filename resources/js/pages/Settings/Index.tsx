import React from 'react';
import { type SubmitEventHandler } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
  Settings as SettingsIcon,
  Trash2,
  Shield,
  User as UserIcon,
  Globe,
  Link as LinkIcon,
  Calendar as CalendarIcon,
  Bell,
  RefreshCw,
  Unlink,
  Loader2,
  Sun,
  Moon,
  Monitor,
  Palette,
} from 'lucide-react';
import * as Separator from '@radix-ui/react-separator';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import type { User, CalendarStatus, SocialAccount } from '@/types';
import { useDisconnectCalendarMutation, useSyncCalendarMutation } from '@/hooks/useCalendar';
import { useDisconnectSocialAccountMutation } from '@/hooks/useSocialAccounts';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme, type Theme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface SettingsProps {
  auth: { user: User };
  calendarStatus: CalendarStatus;
  hasGoogleAccount: boolean;
  hasPushSubscriptions: boolean;
  socialAccounts: SocialAccount[];
  hasPassword: boolean;
}

function ProfileSection({ user }: { user: User }) {
  const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email,
  });

  const submit: SubmitEventHandler = (e) => {
    e.preventDefault();
    patch(route('profile.update'));
  };

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <UserIcon className="text-text-secondary h-5 w-5" />
        <h2 className="text-text text-lg font-semibold">Profile</h2>
      </div>

      <form onSubmit={submit} className="max-w-md space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-text font-medium">{user.name}</p>
            <p className="text-text-secondary text-sm">{user.email}</p>
          </div>
        </div>

        <Input
          label="Name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          error={errors.email}
        />

        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" disabled={processing}>
            {processing ? 'Saving...' : 'Save Changes'}
          </Button>
          {recentlySuccessful && <span className="text-success text-sm">Saved.</span>}
        </div>
      </form>
    </section>
  );
}

function PreferencesSection({ user }: { user: User }) {
  const { data, setData, patch, processing, recentlySuccessful } = useForm({
    timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const submit: SubmitEventHandler = (e) => {
    e.preventDefault();
    patch(route('profile.preferences'));
  };

  const commonTimezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Paris',
    'Europe/Rome',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
    'Pacific/Auckland',
  ];

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Globe className="text-text-secondary h-5 w-5" />
        <h2 className="text-text text-lg font-semibold">Preferences</h2>
      </div>

      <form onSubmit={submit} className="max-w-md space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-text text-sm font-medium">Timezone</label>
          <select
            value={data.timezone}
            onChange={(e) => setData('timezone', e.target.value)}
            className="border-border bg-bg text-text focus-visible:ring-primary/50 flex h-9 w-full cursor-pointer rounded-lg border px-3 py-1 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
          >
            {commonTimezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" disabled={processing}>
            {processing ? 'Saving...' : 'Save Preferences'}
          </Button>
          {recentlySuccessful && <span className="text-success text-sm">Saved.</span>}
        </div>
      </form>
    </section>
  );
}

function PasswordSection() {
  const { data, setData, put, processing, errors, reset, recentlySuccessful } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submit: SubmitEventHandler = (e) => {
    e.preventDefault();
    put(route('password.update'), {
      onSuccess: () => reset(),
    });
  };

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Shield className="text-text-secondary h-5 w-5" />
        <h2 className="text-text text-lg font-semibold">Change Password</h2>
      </div>

      <form onSubmit={submit} className="max-w-md space-y-4">
        <Input
          label="Current password"
          type="password"
          value={data.current_password}
          onChange={(e) => setData('current_password', e.target.value)}
          error={errors.current_password}
          autoComplete="current-password"
        />

        <Input
          label="New password"
          type="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          label="Confirm new password"
          type="password"
          value={data.password_confirmation}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          error={errors.password_confirmation}
          autoComplete="new-password"
        />

        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" disabled={processing}>
            {processing ? 'Updating...' : 'Update Password'}
          </Button>
          {recentlySuccessful && <span className="text-success text-sm">Updated.</span>}
        </div>
      </form>
    </section>
  );
}

const PROVIDERS: { key: string; label: string; icon: React.ReactNode; connectHref: string }[] = [
  {
    key: 'google',
    label: 'Google',
    connectHref: '/auth/google/redirect',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  {
    key: 'github',
    label: 'GitHub',
    connectHref: '/auth/github/redirect',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
];

function ConnectedAccountsSection({
  socialAccounts,
  hasPassword,
}: {
  socialAccounts: SocialAccount[];
  hasPassword: boolean;
}) {
  const disconnectMutation = useDisconnectSocialAccountMutation();
  const isOnlyAccount = socialAccounts.length <= 1;
  const disconnectBlocked = !hasPassword && isOnlyAccount;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <LinkIcon className="text-text-secondary h-5 w-5" />
        <h2 className="text-text text-lg font-semibold">Connected Accounts</h2>
      </div>

      <div className="max-w-md space-y-3">
        {PROVIDERS.map((provider) => {
          const account = socialAccounts.find((a) => a.provider === provider.key);
          const isConnected = account !== undefined;
          const isPending =
            disconnectMutation.isPending && disconnectMutation.variables === account?.id;

          return (
            <div
              key={provider.key}
              className="border-border flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                {provider.icon}
                <div>
                  <span className="text-text text-sm font-medium">{provider.label}</span>
                  {isConnected && <p className="text-text-tertiary text-xs">Connected</p>}
                </div>
                {isConnected && (
                  <Badge variant="outline" className="border-success text-success">
                    Connected
                  </Badge>
                )}
              </div>

              {isConnected ? (
                <div className="flex flex-col items-end gap-1">
                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending || disconnectBlocked}
                        className="text-danger hover:text-danger"
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Unlink className="h-4 w-4" />
                        )}
                        Disconnect
                      </Button>
                    </AlertDialog.Trigger>

                    <AlertDialog.Portal>
                      <AlertDialog.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 bg-black/40" />
                      <AlertDialog.Content className="border-border bg-bg text-text data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg focus:outline-none">
                        <AlertDialog.Title className="text-text text-lg font-semibold">
                          Disconnect {provider.label}?
                        </AlertDialog.Title>
                        <AlertDialog.Description className="text-text-secondary mt-2 text-sm">
                          You will no longer be able to sign in with {provider.label}. Make sure you
                          have another way to access your account.
                        </AlertDialog.Description>

                        <div className="mt-6 flex justify-end gap-3">
                          <AlertDialog.Cancel asChild>
                            <Button variant="ghost">Cancel</Button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action asChild>
                            <Button
                              variant="destructive"
                              onClick={() => account && disconnectMutation.mutate(account.id)}
                            >
                              Disconnect
                            </Button>
                          </AlertDialog.Action>
                        </div>
                      </AlertDialog.Content>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>
                  {disconnectBlocked && (
                    <p className="text-text-tertiary max-w-[180px] text-right text-xs">
                      Set a password before disconnecting your only login method
                    </p>
                  )}
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <a href={provider.connectHref}>Connect</a>
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CalendarSection({ calendarStatus }: { calendarStatus: CalendarStatus }) {
  const disconnectMutation = useDisconnectCalendarMutation();
  const syncMutation = useSyncCalendarMutation();

  const isCalendarConnected = calendarStatus.connected && calendarStatus.has_calendar_scope;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <CalendarIcon className="text-text-secondary h-5 w-5" />
        <h2 className="text-text text-lg font-semibold">Google Calendar</h2>
      </div>

      <div className="max-w-md space-y-4">
        {!calendarStatus.enabled ? (
          <div className="border-border rounded-lg border p-4">
            <p className="text-text-secondary text-sm">
              Google Calendar integration is not enabled on this server. Contact your administrator
              to enable it.
            </p>
          </div>
        ) : isCalendarConnected ? (
          <>
            <div className="border-border flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="text-success h-5 w-5" />
                <div>
                  <span className="text-text text-sm font-medium">Connected</span>
                  {calendarStatus.token_expired && (
                    <Badge variant="outline" className="border-warning text-warning ml-2">
                      Token expired
                    </Badge>
                  )}
                  <p className="text-text-tertiary text-xs">
                    Tasks with dates will sync to your Google Calendar
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => syncMutation.mutate()}
                  disabled={syncMutation.isPending}
                >
                  {syncMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Sync
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => disconnectMutation.mutate()}
                  disabled={disconnectMutation.isPending}
                  className="text-danger hover:text-danger"
                >
                  <Unlink className="h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            </div>
            {syncMutation.isSuccess && (
              <p className="text-success text-sm">
                Queued {syncMutation.data?.count ?? 0} tasks for sync.
              </p>
            )}
          </>
        ) : (
          <div className="border-border rounded-lg border p-4">
            <p className="text-text-secondary mb-3 text-sm">
              Connect your Google Calendar to automatically sync tasks with dates as calendar
              events.
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="/auth/google/calendar/redirect">
                <CalendarIcon className="h-4 w-4" />
                Connect Google Calendar
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function NotificationsSection() {
  const { permission, isSupported, isSubscribed, isLoading, subscribe, unsubscribe } =
    useNotifications();

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Bell className="text-text-secondary h-5 w-5" />
        <h2 className="text-text text-lg font-semibold">Push Notifications</h2>
      </div>

      <div className="max-w-md space-y-4">
        {!isSupported ? (
          <div className="border-border rounded-lg border p-4">
            <p className="text-text-secondary text-sm">
              Push notifications are not supported in this browser. Try using a modern browser like
              Chrome, Firefox, or Edge.
            </p>
          </div>
        ) : permission === 'denied' ? (
          <div className="border-danger/30 rounded-lg border p-4">
            <p className="text-text-secondary text-sm">
              Notification permissions have been blocked. Please enable notifications in your
              browser settings to receive task reminders.
            </p>
          </div>
        ) : isSubscribed ? (
          <div className="border-border flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Bell className="text-success h-5 w-5" />
              <div>
                <span className="text-text text-sm font-medium">Notifications enabled</span>
                <p className="text-text-tertiary text-xs">
                  You will receive push notifications for task reminders
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={unsubscribe} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Disable'}
            </Button>
          </div>
        ) : (
          <div className="border-border rounded-lg border p-4">
            <p className="text-text-secondary mb-3 text-sm">
              Enable push notifications to receive reminders for your tasks, even when the app is
              closed.
            </p>
            <Button variant="outline" size="sm" onClick={subscribe} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
              Enable Notifications
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function AppearanceSection() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Palette className="text-text-secondary h-5 w-5" />
        <h2 className="text-text text-lg font-semibold">Appearance</h2>
      </div>

      <div className="max-w-md space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-text text-sm font-medium">Theme</label>
          <p className="text-text-secondary text-sm">
            Choose how Donezo looks to you. Select a theme, or sync with your system settings.
          </p>
        </div>

        {/* Segmented control */}
        <div className="border-border bg-bg-secondary inline-flex gap-1 rounded-xl border p-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150',
                theme === opt.value
                  ? 'bg-bg text-text border-border border shadow-sm'
                  : 'text-text-secondary hover:text-text hover:bg-bg-tertiary',
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        <p className="text-text-tertiary text-xs">
          Currently showing:{' '}
          <span className="text-text-secondary font-medium capitalize">{resolvedTheme}</span>
          {theme === 'system' && ' (from system preference)'}
        </p>
      </div>
    </section>
  );
}

function DangerZone() {
  const { delete: destroy, processing } = useForm({});

  const handleDelete = () => {
    destroy(route('profile.destroy'));
  };

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Trash2 className="text-danger h-5 w-5" />
        <h2 className="text-danger text-lg font-semibold">Danger Zone</h2>
      </div>

      <div className="border-danger/30 max-w-md rounded-lg border p-4">
        <h3 className="text-text text-sm font-medium">Delete Account</h3>
        <p className="text-text-secondary mt-1 text-sm">
          Once you delete your account, all of your data will be permanently removed. This action
          cannot be undone.
        </p>

        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <Button variant="destructive" size="sm" className="mt-4">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </AlertDialog.Trigger>

          <AlertDialog.Portal>
            <AlertDialog.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 bg-black/40" />
            <AlertDialog.Content className="border-border bg-bg text-text data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg focus:outline-none">
              <AlertDialog.Title className="text-text text-lg font-semibold">
                Are you absolutely sure?
              </AlertDialog.Title>
              <AlertDialog.Description className="text-text-secondary mt-2 text-sm">
                This will permanently delete your account and all associated data including tasks,
                projects, and settings. This action cannot be undone.
              </AlertDialog.Description>

              <div className="mt-6 flex justify-end gap-3">
                <AlertDialog.Cancel asChild>
                  <Button variant="ghost">Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                    {processing ? 'Deleting...' : 'Yes, delete my account'}
                  </Button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </section>
  );
}

export default function SettingsIndex({
  auth: { user },
  calendarStatus,
  socialAccounts,
  hasPassword,
}: SettingsProps) {
  return (
    <AuthenticatedLayout>
      <Head title="Settings" />

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-text flex items-center gap-3 text-2xl font-semibold">
            <SettingsIcon className="text-text-secondary h-6 w-6" />
            Settings
          </h1>
        </div>

        <div className="space-y-10">
          <ProfileSection user={user} />

          <Separator.Root className="bg-border h-px" />

          <PreferencesSection user={user} />

          <Separator.Root className="bg-border h-px" />

          <AppearanceSection />

          <Separator.Root className="bg-border h-px" />

          <PasswordSection />

          <Separator.Root className="bg-border h-px" />

          <ConnectedAccountsSection socialAccounts={socialAccounts} hasPassword={hasPassword} />

          <Separator.Root className="bg-border h-px" />

          <CalendarSection calendarStatus={calendarStatus} />

          <Separator.Root className="bg-border h-px" />

          <NotificationsSection />

          <Separator.Root className="bg-border h-px" />

          <DangerZone />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
